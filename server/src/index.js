import "dotenv/config";
import express from "express";
import cors from "cors";
import Stripe from "stripe";
import { createUser, findUserByEmail, findUserById, getAllUsers, updateUser } from "./db.js";
import {
  adminAuthMiddleware,
  authMiddleware,
  hashPassword,
  signAdminToken,
  signToken,
  toPublicUser,
  verifyPassword,
} from "./auth.js";

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const PAYMENT_LINK_BASE_URL = process.env.PAYMENT_LINK_BASE_URL || "";
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

app.use(cors({ origin: FRONTEND_URL }));

// Minimal in-memory rate limiter for auth endpoints — resets on server
// restart, which is fine for this scale. Not a substitute for a real WAF,
// but stops naive brute-force / signup-spam attempts.
const attempts = new Map();
function rateLimit(max, windowMs) {
  return (req, res, next) => {
    const key = req.ip + ":" + req.path;
    const now = Date.now();
    const record = attempts.get(key) || { count: 0, resetAt: now + windowMs };
    if (now > record.resetAt) {
      record.count = 0;
      record.resetAt = now + windowMs;
    }
    record.count += 1;
    attempts.set(key, record);
    if (record.count > max) {
      return res.status(429).json({ error: "Too many attempts. Try again in a few minutes." });
    }
    next();
  };
}

// --- Stripe webhook: must read the RAW body, so this is registered
// BEFORE the express.json() body parser below. ---
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), (req, res) => {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    console.warn("Stripe webhook received but STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET not configured.");
    return res.status(200).send("ignored (not configured)");
  }

  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.client_reference_id;
    if (userId) {
      const user = findUserById(userId);
      if (user) {
        updateUser(userId, {
          paid: true,
          paidAt: new Date().toISOString(),
          stripeCustomerId: session.customer || null,
          stripeSessionId: session.id,
        });
        console.log(`User ${userId} marked as paid.`);
      } else {
        console.warn(`Stripe webhook: no user found for client_reference_id ${userId}`);
      }
    } else {
      console.warn("Stripe webhook: checkout.session.completed with no client_reference_id set.");
    }
  }

  res.json({ received: true });
});

// Normal JSON parsing for every other route.
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/signup", rateLimit(10, 15 * 60 * 1000), async (req, res) => {
  const { firstName, email, password, fitnessLevel, goal, profile } = req.body || {};
  if (!firstName || !email || !password) {
    return res.status(400).json({ error: "First name, email and password are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }
  if (profile && profile.age != null) {
    const age = Number(profile.age);
    if (!Number.isFinite(age) || age < 16 || age > 100) {
      return res.status(400).json({ error: "You must be 16 or older to sign up for this program." });
    }
  }
  if (findUserByEmail(email)) {
    return res.status(409).json({ error: "An account with this email already exists." });
  }

  const passwordHash = await hashPassword(password);
  const user = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    firstName,
    email,
    passwordHash,
    fitnessLevel: fitnessLevel || "Beginner",
    goal: goal || "Improve fitness",
    profile: profile || null,
    paid: false,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    progressSummary: null,
  };
  createUser(user);

  const token = signToken(user.id);
  res.status(201).json({ token, user: toPublicUser(user) });
});

app.post("/api/auth/login", rateLimit(15, 15 * 60 * 1000), async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "No account found with that email." });
  }
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ error: "Incorrect password." });
  }
  const token = signToken(user.id);
  res.json({ token, user: toPublicUser(user) });
});

app.get("/api/auth/me", authMiddleware, (req, res) => {
  const user = findUserById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user: toPublicUser(user) });
});

// Returns a personalized Stripe Payment Link for the logged-in user, so the
// webhook can tell us who paid via client_reference_id.
app.get("/api/checkout-link", authMiddleware, (req, res) => {
  const user = findUserById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found." });
  if (!PAYMENT_LINK_BASE_URL) {
    return res.status(500).json({ error: "PAYMENT_LINK_BASE_URL is not configured on the server." });
  }
  const url = new URL(PAYMENT_LINK_BASE_URL);
  url.searchParams.set("client_reference_id", user.id);
  url.searchParams.set("prefilled_email", user.email);
  res.json({ url: url.toString() });
});

// The tracker/checklist data itself lives in the browser's local storage
// (see src/lib/storage.ts) so a person's day-to-day experience never depends
// on a network call. This endpoint receives a lightweight summary after each
// change purely so the admin dashboard has something real to show — it is
// not the source of truth for the person's own experience of the app.
app.post("/api/progress", authMiddleware, (req, res) => {
  const { currentDay, totalCompleted, streak, lastCompletedDay } = req.body || {};
  const user = findUserById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found." });
  updateUser(req.userId, {
    lastActiveAt: new Date().toISOString(),
    progressSummary: {
      currentDay: currentDay ?? null,
      totalCompleted: totalCompleted ?? 0,
      streak: streak ?? 0,
      lastCompletedDay: lastCompletedDay ?? null,
      updatedAt: new Date().toISOString(),
    },
  });
  res.json({ ok: true });
});

// --- Admin ---

app.post("/api/admin/login", rateLimit(10, 15 * 60 * 1000), (req, res) => {
  const { password } = req.body || {};
  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ error: "Admin access is not configured on the server." });
  }
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Incorrect admin password." });
  }
  res.json({ token: signAdminToken() });
});

app.get("/api/admin/users", adminAuthMiddleware, (req, res) => {
  const users = getAllUsers().map((u) => {
    const { passwordHash, ...rest } = u;
    return rest;
  });
  res.json({ users });
});

app.listen(PORT, () => {
  console.log(`Standard28 server listening on port ${PORT}`);
});

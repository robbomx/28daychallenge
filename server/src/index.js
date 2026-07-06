import "dotenv/config";
import express from "express";
import cors from "cors";
import Stripe from "stripe";
import { createUser, findUserByEmail, findUserById, updateUser } from "./db.js";
import { authMiddleware, hashPassword, signToken, toPublicUser, verifyPassword } from "./auth.js";

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const PAYMENT_LINK_BASE_URL = process.env.PAYMENT_LINK_BASE_URL || "";
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

app.use(cors({ origin: FRONTEND_URL }));

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

app.post("/api/auth/signup", async (req, res) => {
  const { firstName, email, password, fitnessLevel, goal } = req.body || {};
  if (!firstName || !email || !password) {
    return res.status(400).json({ error: "First name, email and password are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
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
    paid: false,
    createdAt: new Date().toISOString(),
  };
  createUser(user);

  const token = signToken(user.id);
  res.status(201).json({ token, user: toPublicUser(user) });
});

app.post("/api/auth/login", async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Standard28 server listening on port ${PORT}`);
});

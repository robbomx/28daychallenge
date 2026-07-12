// Real persistent database (Postgres), replacing the old JSON-file storage.
//
// Users are stored as a single JSONB blob per row rather than one column per
// field. This app's user shape has grown organically (profile fields added
// and removed, progress summary added, Stripe fields added by the webhook,
// etc.) — JSONB means adding a new field to a user object never requires a
// schema migration, while `id` and `email` stay as real indexed columns for
// fast, safe lookups and the uniqueness guarantee on email.
import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    "WARNING: DATABASE_URL is not set. The server will crash on first database " +
      "access. Set DATABASE_URL to a Postgres connection string (see .env.example)."
  );
}

// Neon, Render Postgres, Supabase, etc. all require SSL for external
// connections. Local Postgres (e.g. during development) typically doesn't
// use or need it.
const isLocal =
  connectionString && (connectionString.includes("localhost") || connectionString.includes("127.0.0.1"));

export const pool = new Pool({
  connectionString,
  ssl: connectionString && !isLocal ? { rejectUnauthorized: false } : false,
});

let schemaReadyPromise = null;

export function ensureSchema() {
  if (!schemaReadyPromise) {
    schemaReadyPromise = pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        data JSONB NOT NULL
      );
    `);
  }
  return schemaReadyPromise;
}

export async function getAllUsers() {
  const { rows } = await pool.query("SELECT data FROM users ORDER BY (data->>'createdAt') ASC");
  return rows.map((r) => r.data);
}

export async function findUserByEmail(email) {
  const { rows } = await pool.query("SELECT data FROM users WHERE lower(email) = lower($1)", [email]);
  return rows[0]?.data ?? undefined;
}

export async function findUserById(id) {
  const { rows } = await pool.query("SELECT data FROM users WHERE id = $1", [id]);
  return rows[0]?.data ?? undefined;
}

export async function createUser(user) {
  await pool.query("INSERT INTO users (id, email, data) VALUES ($1, $2, $3::jsonb)", [
    user.id,
    user.email,
    JSON.stringify(user),
  ]);
  return user;
}

// Shallow-merges `updates` into the stored JSON, done atomically in Postgres
// itself (no read-modify-write race between concurrent requests).
export async function updateUser(id, updates) {
  const { rows } = await pool.query("UPDATE users SET data = data || $2::jsonb WHERE id = $1 RETURNING data", [
    id,
    JSON.stringify(updates),
  ]);
  return rows[0]?.data ?? null;
}

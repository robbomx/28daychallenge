// Minimal file-based "database" for this prototype. Good enough for a single
// small server; swap for Postgres/SQLite if you outgrow it.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "..", "data", "users.json");

function readAll() {
  if (!fs.existsSync(DB_FILE)) return { users: [] };
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  if (!raw.trim()) return { users: [] };
  return JSON.parse(raw);
}

function writeAll(data) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export function getAllUsers() {
  return readAll().users;
}

export function findUserByEmail(email) {
  return readAll().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id) {
  return readAll().users.find((u) => u.id === id);
}

export function createUser(user) {
  const data = readAll();
  data.users.push(user);
  writeAll(data);
  return user;
}

export function updateUser(id, updates) {
  const data = readAll();
  const idx = data.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  data.users[idx] = { ...data.users[idx], ...updates };
  writeAll(data);
  return data.users[idx];
}

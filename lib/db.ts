import { createClient } from "@libsql/client";

// ── Connection ────────────────────────────────────────────────────────────────
// Lazy singleton — only created on first use, not at build time.
// This prevents Vercel build failures when env vars are not available
// during the build phase (they are only available at runtime).

let _db: ReturnType<typeof createClient> | null = null;

function getDb(): ReturnType<typeof createClient> {
  if (_db) return _db;

  if (!process.env.TURSO_DATABASE_URL) {
    throw new Error("Missing env variable: TURSO_DATABASE_URL");
  }
  if (!process.env.TURSO_AUTH_TOKEN) {
    throw new Error("Missing env variable: TURSO_AUTH_TOKEN");
  }

  _db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  return _db;
}

// Proxy so callers can still write `db.execute(...)` unchanged
export const db = new Proxy({} as ReturnType<typeof createClient>, {
  get(_, prop) {
    return getDb()[prop as keyof ReturnType<typeof createClient>];
  },
});

// ── Schema ────────────────────────────────────────────────────────────────────

export async function initDb() {
  const client = getDb();

  await client.execute(`
    CREATE TABLE IF NOT EXISTS whitelist (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      email      TEXT UNIQUE NOT NULL COLLATE NOCASE,
      created_at INTEGER DEFAULT (unixepoch())
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id         TEXT PRIMARY KEY,
      email      TEXT UNIQUE NOT NULL COLLATE NOCASE,
      name       TEXT,
      image      TEXT,
      created_at INTEGER DEFAULT (unixepoch())
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id          TEXT PRIMARY KEY,
      user_id     TEXT NOT NULL REFERENCES users(id),
      title       TEXT NOT NULL,
      status      TEXT NOT NULL DEFAULT 'pending',
      source_lang TEXT,
      target_lang TEXT,
      created_at  INTEGER DEFAULT (unixepoch()),
      updated_at  INTEGER DEFAULT (unixepoch())
    )
  `);

  await client.execute({
    sql: `INSERT OR IGNORE INTO whitelist (email) VALUES (?)`,
    args: ["kts123@estsoft.com"],
  });
}

// ── Whitelist helpers ─────────────────────────────────────────────────────────

export async function isEmailWhitelisted(email: string): Promise<boolean> {
  const result = await getDb().execute({
    sql: `SELECT 1 FROM whitelist WHERE email = ? LIMIT 1`,
    args: [email],
  });
  return result.rows.length > 0;
}

export async function addToWhitelist(email: string): Promise<void> {
  await getDb().execute({
    sql: `INSERT OR IGNORE INTO whitelist (email) VALUES (?)`,
    args: [email],
  });
}

// ── Dub history helpers ───────────────────────────────────────────────────────

export async function saveDubRecord(
  userEmail: string,
  filename: string,
  targetLang: string,
  fileSize: number
): Promise<void> {
  // Ensure table exists (safe to call multiple times)
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS dub_history (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email  TEXT NOT NULL COLLATE NOCASE,
      filename    TEXT NOT NULL,
      target_lang TEXT NOT NULL,
      file_size   INTEGER,
      created_at  INTEGER DEFAULT (unixepoch())
    )
  `);

  await getDb().execute({
    sql: `INSERT INTO dub_history (user_email, filename, target_lang, file_size) VALUES (?, ?, ?, ?)`,
    args: [userEmail, filename, targetLang, fileSize],
  });
}

export async function getDubHistory(userEmail: string) {
  // Ensure table exists before querying
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS dub_history (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_email  TEXT NOT NULL COLLATE NOCASE,
      filename    TEXT NOT NULL,
      target_lang TEXT NOT NULL,
      file_size   INTEGER,
      created_at  INTEGER DEFAULT (unixepoch())
    )
  `);

  const result = await getDb().execute({
    sql: `SELECT * FROM dub_history WHERE user_email = ? ORDER BY created_at DESC LIMIT 50`,
    args: [userEmail],
  });
  return result.rows;
}
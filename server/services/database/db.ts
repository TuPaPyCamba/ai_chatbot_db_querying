import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("WARNING: DATABASE_URL environment variable is not defined.");
}

const pool = new Pool({
  connectionString,
  ssl: connectionString?.includes("supabase") ? { rejectUnauthorized: false } : undefined,
});

/**
 * Executes a PostgreSQL query strictly within a read-only transaction.
 * Always rolls back the transaction at the end to prevent any accidental write side-effects.
 * If the query fails, returns the exact database error message as string text.
 */
export async function executeReadOnlyQuery(query: string): Promise<string> {
  const client = await pool.connect();
  try {
    // Begin read-only transaction
    await client.query("BEGIN READ ONLY;");

    // Execute user query
    const res = await client.query(query);

    // Rollback the transaction
    await client.query("ROLLBACK;");

    // Return the result rows as stringified JSON
    return JSON.stringify(res.rows);
  } catch (err: any) {
    // Always attempt rollback in case of failure
    try {
      await client.query("ROLLBACK;");
    } catch {}

    // Return the database error to let the LLM self-correct
    return `PostgreSQL Error: ${err.message || String(err)}`;
  } finally {
    client.release();
  }
}

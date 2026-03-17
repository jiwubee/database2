require("dotenv").config();
const { pool } = require("./pool");

(async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS heroes (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        power TEXT NOT NULL CHECK (power IN ('flight','strength','telepathy','speed','invisibility')),
        status TEXT NOT NULL CHECK (status IN ('available','busy')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS incidents (
        id SERIAL PRIMARY KEY,
        location TEXT NOT NULL,
        threat_level TEXT NOT NULL CHECK (threat_level IN ('low','medium','critical')),
        status TEXT NOT NULL CHECK (status IN ('open','resolved')),
        hero_id INTEGER NULL REFERENCES heroes(id) ON DELETE SET NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        resolved_at TIMESTAMPTZ NULL
      );
    `);

    await client.query("COMMIT");
    console.log("Migration done");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
})();
const { pool } = require("../db/pool");

const heroesRepo = {
  async list({ status, power }) {
    const where = [];
    const values = [];
    let i = 1;

    if (status) {
      where.push(`status = $${i++}`);
      values.push(status);
    }
    if (power) {
      where.push(`power = $${i++}`);
      values.push(power);
    }

    const sql = `
      SELECT id, name, power, status, created_at
      FROM heroes
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY id ASC
    `;

    const { rows } = await pool.query(sql, values);
    return rows;
  },

  async create({ name, power, status }) {
    const { rows } = await pool.query(
      `
      INSERT INTO heroes (name, power, status)
      VALUES ($1, $2, $3)
      RETURNING id, name, power, status, created_at
      `,
      [name, power, status]
    );
    return rows[0];
  },

  async getByIdForUpdate(client, heroId) {
    const { rows } = await client.query(
      `
      SELECT id, name, power, status, created_at
      FROM heroes
      WHERE id = $1
      FOR UPDATE
      `,
      [heroId]
    );
    return rows[0] || null;
  },

  async setStatus(client, { heroId, status }) {
    const { rows } = await client.query(
      `
      UPDATE heroes
      SET status = $2
      WHERE id = $1
      RETURNING id, name, power, status, created_at
      `,
      [heroId, status]
    );
    return rows[0] || null;
  }
};

module.exports = { heroesRepo };
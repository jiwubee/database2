const { pool } = require("../db/pool");

const incidentsRepo = {
  async list({ threatLevel, status }) {
    const where = [];
    const values = [];
    let i = 1;

    if (threatLevel) {
      where.push(`threat_level = $${i++}`);
      values.push(threatLevel);
    }
    if (status) {
      where.push(`status = $${i++}`);
      values.push(status);
    }

    const { rows } = await pool.query(
      `
      SELECT id, location, threat_level, status, hero_id, created_at, resolved_at
      FROM incidents
      ${where.length ? "WHERE " + where.join(" AND ") : ""}
      ORDER BY id ASC
      `,
      values
    );
    return rows;
  },

  async create({ location, threatLevel, status }) {
    const { rows } = await pool.query(
      `
      INSERT INTO incidents (location, threat_level, status)
      VALUES ($1, $2, $3)
      RETURNING id, location, threat_level, status, hero_id, created_at, resolved_at
      `,
      [location, threatLevel, status]
    );
    return rows[0];
  },

  async getByIdForUpdate(client, incidentId) {
    const { rows } = await client.query(
      `
      SELECT id, location, threat_level, status, hero_id, created_at, resolved_at
      FROM incidents
      WHERE id = $1
      FOR UPDATE
      `,
      [incidentId]
    );
    return rows[0] || null;
  },

  async assign(client, { incidentId, heroId }) {
    const { rows } = await client.query(
      `
      UPDATE incidents
      SET hero_id = $2
      WHERE id = $1
      RETURNING id, location, threat_level, status, hero_id, created_at, resolved_at
      `,
      [incidentId, heroId]
    );
    return rows[0] || null;
  },

  async resolve(client, incidentId) {
    const { rows } = await client.query(
      `
      UPDATE incidents
      SET status = 'resolved',
          resolved_at = NOW()
      WHERE id = $1
      RETURNING id, location, threat_level, status, hero_id, created_at, resolved_at
      `,
      [incidentId]
    );
    return rows[0] || null;
  }
};

module.exports = { incidentsRepo };
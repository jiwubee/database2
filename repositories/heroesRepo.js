const db = require("../db/knex");

const heroesRepo = {
  async findAll({ status, power, sortBy = "name", page = 1, pageSize = 50 }) {
    // Validate pagination
    const validPageSize = Math.min(Math.max(pageSize || 50, 1), 50);
    const validPage = Math.max(page || 1, 1);
    const offset = (validPage - 1) * validPageSize;

    // Build query with optional filters
    let query = db("heroes");

    if (status !== undefined) {
      query = query.where("status", status);
    }
    if (power !== undefined) {
      query = query.where("power", power);
    }

    // Count total before pagination
    const countResult = await query.clone().count("* as count");
    const total = countResult[0]?.count || 0;

    // Apply sorting
    const validSortColumns = ["name", "missions_count", "created_at"];
    if (validSortColumns.includes(sortBy)) {
      query = query.orderBy(sortBy, "asc");
    } else {
      query = query.orderBy("name", "asc");
    }

    // Apply pagination
    const rows = await query
      .select("id", "name", "power", "status", "created_at")
      .limit(validPageSize)
      .offset(offset);

    const totalPages = Math.ceil(total / validPageSize);

    return {
      data: rows,
      pagination: {
        page: validPage,
        pageSize: validPageSize,
        total: parseInt(total),
        totalPages
      }
    };
  },

  async findById(id) {
    const row = await db("heroes")
      .where("id", id)
      .select("id", "name", "power", "status", "created_at")
      .first();
    return row || null;
  },

  async create({ name, power, status }) {
    const [hero] = await db("heroes")
      .insert({ name, power, status })
      .returning(["id", "name", "power", "status", "created_at"]);
    return hero;
  },

  async update(id, { name, power, status }) {
    const [hero] = await db("heroes")
      .where("id", id)
      .update({ name, power, status, updated_at: db.fn.now() })
      .returning(["id", "name", "power", "status", "created_at"]);
    return hero || null;
  },

  // For transactions (used in incidents assign/resolve)
  async getByIdForUpdate(trx, heroId) {
    return trx("heroes")
      .where("id", heroId)
      .select("id", "name", "power", "status", "created_at")
      .first();
  },

  async setStatus(trx, { heroId, status }) {
    const [hero] = await trx("heroes")
      .where("id", heroId)
      .update({ status })
      .returning(["id", "name", "power", "status", "created_at"]);
    return hero || null;
  }
};

module.exports = { heroesRepo };
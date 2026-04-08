const db = require("../db/knex");

const incidentsRepo = {
  async findAll({ level, status, district, sortBy = "created_at", page = 1, pageSize = 50 }) {
    const validPageSize = Math.min(Math.max(pageSize || 50, 1), 50);
    const validPage = Math.max(page || 1, 1);
    const offset = (validPage - 1) * validPageSize;

    let query = db("incidents");

    // Optional filters
    if (level !== undefined) {
      query = query.where("threat_level", level);
    }
    if (status !== undefined) {
      query = query.where("status", status);
    }
    if (district !== undefined) {
      // ILIKE search on location field
      query = query.whereRaw("location ILIKE ?", [`%${district}%`]);
    }

    // Count total
    const countResult = await query.clone().count("* as count");
    const total = countResult[0]?.count || 0;

    // Sorting
    const validSortColumns = ["created_at", "threat_level", "status"];
    if (validSortColumns.includes(sortBy)) {
      query = query.orderBy(sortBy, "desc");
    } else {
      query = query.orderBy("created_at", "desc");
    }

    const rows = await query
      .select("id", "location", "threat_level", "status", "hero_id", "created_at", "resolved_at")
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
    return db("incidents")
      .where("id", id)
      .select("id", "location", "threat_level", "status", "hero_id", "created_at", "resolved_at")
      .first();
  },

  async create({ location, threatLevel, status }) {
    const [incident] = await db("incidents")
      .insert({ location, threat_level: threatLevel, status })
      .returning(["id", "location", "threat_level", "status", "hero_id", "created_at", "resolved_at"]);
    return incident;
  },

  async getHeroIncidents(heroId, page = 1, pageSize = 50) {
    const validPageSize = Math.min(Math.max(pageSize || 50, 1), 50);
    const validPage = Math.max(page || 1, 1);
    const offset = (validPage - 1) * validPageSize;

    // Count total incidents for hero
    const countResult = await db("incidents")
      .where("hero_id", heroId)
      .count("* as count");
    const total = countResult[0]?.count || 0;

    const rows = await db("incidents")
      .where("hero_id", heroId)
      .select("id", "location", "threat_level", "status", "hero_id", "created_at", "resolved_at")
      .orderBy("assigned_at", "desc")
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

  // Transactions (with trx passed as argument)
  async getByIdForUpdate(trx, incidentId) {
    return trx("incidents")
      .where("id", incidentId)
      .select("id", "location", "threat_level", "status", "hero_id", "created_at", "resolved_at")
      .first();
  },

  async assign(trx, { incidentId, heroId }) {
    const [incident] = await trx("incidents")
      .where("id", incidentId)
      .update({ hero_id: heroId, assigned_at: trx.fn.now() })
      .returning(["id", "location", "threat_level", "status", "hero_id", "created_at", "resolved_at"]);
    return incident || null;
  },

  async resolve(trx, incidentId) {
    const [incident] = await trx("incidents")
      .where("id", incidentId)
      .update({ status: "resolved", resolved_at: trx.fn.now() })
      .returning(["id", "location", "threat_level", "status", "hero_id", "created_at", "resolved_at"]);
    return incident || null;
  }
};

module.exports = { incidentsRepo };
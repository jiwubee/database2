const db = require("../db/knex");

const statsService = {
  async getStats() {
    // Total heroes and incidents
    const heroCount = await db("heroes").count("* as count").first();
    const incidentCount = await db("incidents").count("* as count").first();

    // Heroes grouped by status
    const herosByStatus = await db("heroes")
      .groupBy("status")
      .select("status")
      .count("* as count");

    // Incidents grouped by threat_level
    const incidentsByLevel = await db("incidents")
      .groupBy("threat_level")
      .select("threat_level")
      .count("* as count");

    // Average resolution time in minutes
    const avgResolutionTime = await db("incidents")
      .where("status", "resolved")
      .avg(db.raw("EXTRACT(EPOCH FROM (resolved_at - created_at))/60 as minutes"))
      .first();

    return {
      totalHeroes: parseInt(heroCount.count),
      totalIncidents: parseInt(incidentCount.count),
      heroesBy Status: herosByStatus.map(h => ({ [h.status]: h.count })),
      incidentsBy Level: incidentsByLevel.map(i => ({ [i.threat_level]: i.count })),
      avgResolutionMinutes: avgResolutionTime?.minutes || 0
    };
  }
};

module.exports = { statsService };
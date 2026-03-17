const { pool } = require("../db/pool");
const { domainError } = require("../utils/domainErrors");
const { incidentsRepo } = require("../repositories/incidentsRepo");
const { heroesRepo } = require("../repositories/heroesRepo");

const THREAT = ["low", "medium", "critical"];
const INC_STATUSES = ["open", "resolved"];

function allowedForCritical(power) {
  return power === "flight" || power === "strength";
}

const incidentsService = {
  async list({ threatLevel, status }) {
    if (threatLevel !== undefined && !THREAT.includes(threatLevel)) {
      throw domainError(422, "Unprocessable Entity", "Invalid threat_level");
    }
    if (status !== undefined && !INC_STATUSES.includes(status)) {
      throw domainError(422, "Unprocessable Entity", "Invalid status");
    }
    return incidentsRepo.list({ threatLevel, status });
  },

  async create(body) {
    if (!body || body.location === undefined || body.threat_level === undefined || body.status === undefined) {
      throw domainError(400, "Bad Request", "Missing required fields: location, threat_level, status");
    }
    const { location, threat_level, status } = body;

    if (typeof location !== "string" || location.trim() === "") {
      throw domainError(422, "Unprocessable Entity", "Invalid location");
    }
    if (!THREAT.includes(threat_level)) {
      throw domainError(422, "Unprocessable Entity", "Invalid threat_level");
    }
    if (!INC_STATUSES.includes(status)) {
      throw domainError(422, "Unprocessable Entity", "Invalid status");
    }

    return incidentsRepo.create({ location: location.trim(), threatLevel: threat_level, status });
  },

  async assign({ incidentId, heroId }) {
    if (!Number.isInteger(incidentId) || incidentId <= 0) {
      throw domainError(422, "Unprocessable Entity", "Invalid incident id");
    }
    if (!Number.isInteger(heroId) || heroId <= 0) {
      throw domainError(422, "Unprocessable Entity", "Invalid hero_id");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const incident = await incidentsRepo.getByIdForUpdate(client, incidentId);
      if (!incident) throw domainError(404, "Not Found", "Incident not found");

      const hero = await heroesRepo.getByIdForUpdate(client, heroId);
      if (!hero) throw domainError(404, "Not Found", "Hero not found");

      if (incident.status !== "open") throw domainError(409, "Conflict", "Incident is not open");
      if (incident.hero_id !== null) throw domainError(409, "Conflict", "Incident already assigned");
      if (hero.status !== "available") throw domainError(409, "Conflict", "Hero is busy");

      if (incident.threat_level === "critical" && !allowedForCritical(hero.power)) {
        throw domainError(403, "Forbidden", "Hero power not allowed for critical incident");
      }

      const updatedIncident = await incidentsRepo.assign(client, { incidentId, heroId });
      await heroesRepo.setStatus(client, { heroId, status: "busy" });

      await client.query("COMMIT");
      return { incident: updatedIncident };
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  },

  async resolve({ incidentId }) {
    if (!Number.isInteger(incidentId) || incidentId <= 0) {
      throw domainError(422, "Unprocessable Entity", "Invalid incident id");
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const incident = await incidentsRepo.getByIdForUpdate(client, incidentId);
      if (!incident) throw domainError(404, "Not Found", "Incident not found");
      if (incident.status === "resolved") throw domainError(409, "Conflict", "Incident already resolved");

      const resolved = await incidentsRepo.resolve(client, incidentId);

      if (incident.hero_id !== null) {
        await heroesRepo.setStatus(client, { heroId: incident.hero_id, status: "available" });
      }

      await client.query("COMMIT");
      return { incident: resolved };
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }
};

module.exports = { incidentsService };
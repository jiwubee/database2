const { domainError } = require("../utils/domainErrors");
const { heroesRepo } = require("../repositories/heroesRepo");

const POWERS = ["flight", "strength", "telepathy", "speed", "invisibility"];
const HERO_STATUSES = ["available", "busy"];

const heroesService = {
  async list({ status, power }) {
    if (status !== undefined && !HERO_STATUSES.includes(status)) {
      throw domainError(422, "Unprocessable Entity", "Invalid status");
    }
    if (power !== undefined && !POWERS.includes(power)) {
      throw domainError(422, "Unprocessable Entity", "Invalid power");
    }
    return heroesRepo.list({ status, power });
  },

  async create(body) {
    if (!body || body.name === undefined || body.power === undefined || body.status === undefined) {
      throw domainError(400, "Bad Request", "Missing required fields: name, power, status");
    }
    const { name, power, status } = body;

    if (typeof name !== "string" || name.trim() === "") {
      throw domainError(422, "Unprocessable Entity", "Invalid name");
    }
    if (!POWERS.includes(power)) {
      throw domainError(422, "Unprocessable Entity", "Invalid power");
    }
    if (!HERO_STATUSES.includes(status)) {
      throw domainError(422, "Unprocessable Entity", "Invalid status");
    }

    return heroesRepo.create({ name: name.trim(), power, status });
  }
};

module.exports = { heroesService };
const { incidentsService } = require("../services/incidentsService");
const { domainError } = require("../utils/domainError");

const incidentsController = {
  async list(req, res, next) {
    try {
      const { level, status, district, sort, page, pageSize } = req.query;
      const result = await incidentsService.findAll({
        level,
        status,
        district,
        sortBy: sort,
        page: parseInt(page) || 1,
        pageSize: parseInt(pageSize) || 50
      });
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  },

  async getById(req, res, next) {
    try {
      const incident = await incidentsService.findById(Number(req.params.id));
      if (!incident) return res.status(404).json({ error: "Incident not found" });
      res.status(200).json({ data: incident });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const incident = await incidentsService.create(req.body);
      res.status(201).set("Location", `/api/v1/incidents/${incident.id}`).json({ data: incident });
    } catch (e) {
      next(e);
    }
  },

  async getHeroIncidents(req, res, next) {
    try {
      const heroId = Number(req.params.id);
      const { page, pageSize } = req.query;
      
      // Check hero exists first
      const heroService = require("../services/heroesService").heroesService;
      const hero = await heroService.findById(heroId);
      if (!hero) return res.status(404).json({ error: "Hero not found" });

      const result = await incidentsService.getHeroIncidents(
        heroId,
        parseInt(page) || 1,
        parseInt(pageSize) || 50
      );
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  },

  async assign(req, res, next) {
    try {
      const incidentId = Number(req.params.id);
      const heroId = req.body ? Number(req.body.hero_id) : NaN;

      if (!req.body || req.body.hero_id === undefined) {
        throw domainError("Missing required field: hero_id", { status: 400, isDomain: true });
      }

      const result = await incidentsService.assign({ incidentId, heroId });
      res.status(200).json({ data: result });
    } catch (e) {
      next(e);
    }
  },

  async resolve(req, res, next) {
    try {
      const incidentId = Number(req.params.id);
      const result = await incidentsService.resolve({ incidentId });
      res.status(200).json({ data: result });
    } catch (e) {
      next(e);
    }
  }
};

module.exports = { incidentsController };
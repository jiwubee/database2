const { incidentsService } = require("../services/incidentsService");

const incidentsController = {
  async list(req, res, next) {
    try {
      const { threat_level, status } = req.query;
      const data = await incidentsService.list({
        threatLevel: threat_level,
        status
      });
      res.status(200).json({ data });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const incident = await incidentsService.create(req.body);
      res
        .status(201)
        .set("Location", `/api/v1/incidents/${incident.id}`)
        .json({ data: incident });
    } catch (e) {
      next(e);
    }
  },

  async assign(req, res, next) {
    try {
      const incidentId = Number(req.params.id);
      const heroId = req.body ? Number(req.body.hero_id) : NaN;

      // brak pola -> 400 (zgodnie z wymaganiami)
      if (!req.body || req.body.hero_id === undefined) {
        return res
          .status(400)
          .type("application/problem+json")
          .json({
            type: "about:blank",
            title: "Bad Request",
            status: 400,
            detail: "Missing required field: hero_id",
            instance: req.originalUrl
          });
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
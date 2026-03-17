const { heroesService } = require("../services/heroesService");

const heroesController = {
  async list(req, res, next) {
    try {
      const { status, power } = req.query;
      const data = await heroesService.list({ status, power });
      res.status(200).json({ data });
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const hero = await heroesService.create(req.body);
      res.status(201).set("Location", `/api/v1/heroes/${hero.id}`).json({ data: hero });
    } catch (e) {
      next(e);
    }
  }
};

module.exports = { heroesController };
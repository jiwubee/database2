const { heroesService } = require("../services/heroesService");

const heroesController = {
  async list(req, res, next) {
    try {
      const { status, power, sort, page, pageSize } = req.query;
      const result = await heroesService.findAll({
        status,
        power,
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
      const hero = await heroesService.findById(Number(req.params.id));
      if (!hero) return res.status(404).json({ error: "Hero not found" });
      res.status(200).json({ data: hero });
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
  },

  async update(req, res, next) {
    try {
      const hero = await heroesService.update(Number(req.params.id), req.body);
      if (!hero) return res.status(404).json({ error: "Hero not found" });
      res.status(200).json({ data: hero });
    } catch (e) {
      next(e);
    }
  }
};

module.exports = { heroesController };
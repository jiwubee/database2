const { statsService } = require("../services/statsService");

const statsController = {
  async getStats(req, res, next) {
    try {
      const stats = await statsService.getStats();
      res.status(200).json({ data: stats });
    } catch (e) {
      next(e);
    }
  }
};

module.exports = { statsController };
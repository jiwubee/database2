const express = require("express");
const { heroesRouter } = require("./routes/heroes");
const { incidentsRouter } = require("./routes/incidents");
const { statsController } = require("./controllers/statsController");
const { errorHandler } = require("./middleware/errorHandler");

function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/health", (req, res) => res.json({ ok: true }));

  app.use("/api/v1/heroes", heroesRouter);
  app.use("/api/v1/incidents", incidentsRouter);
  app.get("/api/v1/stats", statsController.getStats);

  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
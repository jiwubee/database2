const express = require("express");
const { heroesRouter } = require("./routes/heroes");
const { incidentsRouter } = require("./routes/incidents");
const { errorHandler } = require("./middleware/errorHandler");

function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/health", (req, res) => res.json({ ok: true }));

  app.use("/api/v1/heroes", heroesRouter);
  app.use("/api/v1/incidents", incidentsRouter);

  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
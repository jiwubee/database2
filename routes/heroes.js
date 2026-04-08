const express = require("express");
const { heroesController } = require("../controllers/heroesController");

const heroesRouter = express.Router();

heroesRouter.get("/", heroesController.list);
heroesRouter.post("/", heroesController.create);
heroesRouter.get("/:id", heroesController.getById);
heroesRouter.patch("/:id", heroesController.update);
heroesRouter.get("/:id/incidents", heroesController.getHeroIncidents);

module.exports = { heroesRouter };
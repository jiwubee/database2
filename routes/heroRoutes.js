const express = require("express");
const { heroesController } = require("../controllers/heroesController");

const heroesRouter = express.Router();

heroesRouter.get("/", heroesController.list);
heroesRouter.post("/", heroesController.create);

module.exports = { heroesRouter };
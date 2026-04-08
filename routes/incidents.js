const express = require("express");
const { incidentsController } = require("../controllers/incidentsController");

const incidentsRouter = express.Router();

incidentsRouter.get("/", incidentsController.list);
incidentsRouter.post("/", incidentsController.create);
incidentsRouter.get("/:id", incidentsController.getById);
incidentsRouter.post("/:id/assign", incidentsController.assign);
incidentsRouter.patch("/:id/resolve", incidentsController.resolve);

module.exports = { incidentsRouter };
const express = require("express");
const route = express.Router();
const controller = require("./AllControllers");

route.post("/auth/register", controller.register );

route.post("/auth/login", controller.login );

route.get("/gerasenha/:id", controller.geradorSenhas);

module.exports = route;
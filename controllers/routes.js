const express = require("express");
const route = express.Router();
const controller = require("./controllers/AllControllers");

route.post("/auth/register", controller.register);

route.post("/auth/login", controller.login);

route.get("/gerasenha", controller.geradorSenhas);

route.post("/logout", controller.logout);

module.exports = route;

// COISAS A FAZER
// COLOCAR TUDO NO GITHUB, COLOCAR ALGORITMOS NO CONTROLLERS E ENTÃO EXPORTAR FUNÇÕES PARA O ROUTES.JS

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");


const port = process.env.PORT || 3000;
const app = express();
const routes = require("./routes");

///Config JSON Response
app.use(express.json());
app.use(routes);



//Conexão Com DataBase
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@cluster0.reb1yxy.mongodb.net/?retryWrites=true&w=majority`,
  )
  .then(() => {
    console.log("Conectou ao Banco!");
  })
  .catch((err) => console.log("Não foi possivel conectar ao Banco de Dados\n" + err));

app.listen(port, () => console.log("Servidor Iniciado "));

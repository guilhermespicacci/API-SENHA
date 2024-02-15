const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User.js");

exports.register = async (req, res) => {
  const { name, email, password, cpassword } = req.body;
  ///Validações
  if (!name) {
    return res.status(422).json({ msg: "O nome é Obrigatório" });
  }
  if (!email) {
    return res.status(422).json({ msg: "O email é Obrigatório" });
  }
  if (!password) {
    return res.status(422).json({ msg: "A Senha é Obrigatória" });
  }
  if (password !== cpassword) {
    return res.status(422).json({ msg: "As Senhas  não conferem" });
  }
  //Ver Se Usuário existe
  const userExists = await User.findOne({ email: email });
  if (userExists) {
    return res.status(422).json({ msg: "Por Favor Utilize Outro E-mail" });
  }
  //Cria Password
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);
  //Cria Usuario
  const user = new User({
    name,
    email,
    password: passwordHash,
  });
  try {
    await user.save();
    res.status(201).json({ msg: "Usuário criado com sucesso!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Erro No Servidor, Tente Novamente mais tarde" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(422).json({ msg: "O email é Obrigatório" });
  }
  if (!password) {
    return res.status(422).json({ msg: "A Senha é Obrigatória" });
  }
  //Ver se Usuário existe
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(422).json({ msg: "Usuário não encontrado" });
  }
  //Ver se a Senha é correta
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha Inválida!" });
  }
  try {
    res.status(200).json({
      msg: "Autenticação realizada com sucesso",
      id: user._id,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Erro No Servidor, Tente Novamente mais tarde" });
  }
};
exports.geradorSenhas = async (req, res) => {
  const id = req.params.id;
  try {
    //Vê se o User existe
    const user = await User.findById(id, "-password");

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }
  } catch (err) {
    return res.status(404).json({ msg: "Id Inválido" });
  }

  let senha = [];
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+={}[]|:;\"'<>,.?/";
  for (c = 0; c < 13; c++) {
    const indexCaractere = Math.floor(Math.random() * caracteres.length);
    senha.push(caracteres[indexCaractere]);
  }
  senha = senha.join("");
  res.json({ senha: senha });
};

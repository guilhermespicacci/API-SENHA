const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const geraSenha = require("./functions/geraSenha.js");

exports.register = async (req, res) => {
  const { name, email, password, cpassword } = req.body;
  ///Validações
  console.log(name, email, password, cpassword);
  if (!name) return res.status(422).json({ msg: "O nome é Obrigatório" });

  if (!email) return res.status(422).json({ msg: "O email é Obrigatório" });

  if (!password) return res.status(422).json({ msg: "A Senha é Obrigatória" });

  if (password !== cpassword)
    return res.status(422).json({ msg: "As Senhas  não conferem" });

  //Ver Se Usuário existe
  const userExists = await User.findOne({ email: email });
  console.log(userExists);
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
  //Ver se Usuário está no banco de dados, retorna um boolean
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
    //Erro está aqui
    const mySecret = process.env["SECRET"];
    //Cria o Json
    const token = jwt.sign({ user: User.name }, mySecret, { expiresIn: 300 });
    res.status(200).json({
      msg: "Autenticação realizada com sucesso",
      //Retorna o Token
      auth: true,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Erro No Servidor, Tente Novamente mais tarde" });
  }
};

exports.logout = () => {
  return res.json({ auth: false, token: null });
};

exports.geradorSenhas = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ auth: false, message: "Sem Token" });
    }

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
      if (err)
        return res
          .status(500)
          .json({ auth: false, message: "Falha ao autenticar Token " });

      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
    });
    let SenhaGerada = geraSenha();
    res.json(SenhaGerada);
  } catch (err) {
    return res.status(404).json({ msg: "Id Inválido" });
  }
};

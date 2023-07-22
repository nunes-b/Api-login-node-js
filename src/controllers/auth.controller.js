const { prisma } = require("../utils/prisma");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.authenticate = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({
        message:
          "Senha ou email não confere ou é inexistente, verifique suas credenciais e tente novamente",
      });
    }
    if (!password) {
      return res
        .status(400)
        .json({ message: "confira o email ou senha digitado" });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Email ou senha não existe" });
    }

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        {
          email: user.email,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "12h",
        }
      );
      const response = {
        user: {
          id: user.id,
          email: user.email,
        },
        token,
      };

      return res.status(200).json(response);
    } else {
      return res.status(401).json({ message: "Email ou senha invalido!" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ message: "Erro ao realizar autenticação para o login." });
  }
};

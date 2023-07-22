const bcrypt = require("bcrypt");
const { prisma } = require("../utils/prisma");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email ou senha inválidos!" });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Email ou senha não existe" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (checkPassword) {
      const token = jwt.sign(
        {
          id: user.id,
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
      return res.status(401).json({ message: "Email ou senha inválidos!" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ message: "Erro ao realizar autenticação para o login." });
  }
};

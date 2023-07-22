const { prisma } = require("../utils/prisma");
const { login } = require("../repositories/login");

exports.log = async (req, res) => {
  try {
    await prisma.$connect();
    const loginResult = await login(req.body);
    res.status(201).json(loginResult);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Erro ao realizar login" });
  } finally {
    await prisma.$disconnect();
  }
};

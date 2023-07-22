const { prisma } = require("../utils/prisma");
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../repositories/user");
const bcrypt = require("bcrypt");
// const { userValidation } = require("../validations/user.validation");

exports.create = async (req, res) => {
  try {
    await prisma.$connect();
    const existingUser = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Esse e-mail já existe em nossos registros." });
    }
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashPassword;
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    const errorResponse = err.errors
      ? err.errors.map((error) => ({
          code: error.code,
          expected: error.expected,
          received: error.received,
          path: error.path,
          message: error.message,
        }))
      : [];
    res
      .status(400)
      .json({ message: "Erro ao criar usuário.", errors: errorResponse });
  } finally {
    await prisma.$disconnect();
  }
};

exports.get = async (req, res) => {
  try {
    const skip = Number(req?.query?.skip) || 0;
    const take = Number(req?.query?.take) || 1020;
    await prisma.$connect();
    const users = await getAllUsers(skip, take);
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Erro ao encontrar usuarios." });
  } finally {
    await prisma.$disconnect();
  }
};

exports.getId = async (req, res) => {
  try {
    await prisma.$connect();
    const user = await getUserById(req.params);
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Erro ao encontrar usuario." });
  } finally {
    await prisma.$disconnect();
  }
};

exports.update = async (req, res) => {
  try {
    await prisma.$connect();

    if (req.body.password) {
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashPassword;
    }
    const user = updateUser(req.params, req.body);
    res.status(200).json(await user);
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ message: "Erro ao realizar a atualização do usuario." });
  } finally {
    await prisma.$disconnect();
  }
};

exports.remove = async (req, res) => {
  try {
    await prisma.$connect();
    await deleteUser(req.params);
    res.status(200).json({ message: "Usuario deletado com sucesso." });
  } catch (err) {
    res.status(400).json({ message: "Erro ao deletar usuario." });
  } finally {
    await prisma.$disconnect();
  }
};

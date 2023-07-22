const { prisma } = require("../utils/prisma");

exports.createUser = async ({ email, password }) => {
  const user = await prisma.user.create({
    data: {
      email,
      password,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });
  return user;
};

exports.getAllUsers = async (skip, take) => {
  const [user, totalRegister] = await prisma.$transaction([
    prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
      skip,
      take,
    }),
    prisma.user.count(),
  ]);
  const totalPage = Math.ceil(totalRegister / take);
  return { totalPage, totalRegister, user };
};

exports.getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: id,
    select: {
      id: true,
      email: true,
      password: true,
      createdAt: true,
    },
  });
  return user;
};

exports.updateUser = async (id, data) => {
  const user = await prisma.user.update({
    where: id,
    data,
  });
  return user;
};

exports.deleteUser = async (id) => {
  await prisma.user.delete({
    where: id,
  });
  return;
};

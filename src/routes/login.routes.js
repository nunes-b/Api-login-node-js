const express = require("express");
const { prisma } = require("../utils/prisma");
const { authenticate } = require("../controllers/auth.controller");
const bcrypt = require("bcrypt");
const { log } = require("../controllers/login.controller");

exports.loginRoutes = (app) => {
  app.post("/login", authenticate, log);
};

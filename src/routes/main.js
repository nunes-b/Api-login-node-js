const { userRoutes } = require("./user.routes");
const { loginRoutes } = require("./login.routes");

module.exports = (app) => {
  userRoutes(app);
  loginRoutes(app);
};

const {
  create,
  get,
  getId,
  update,
  remove,
} = require("../controllers/user.controller");
const { verifyToken } = require("../utils/middlewares/auth");

exports.userRoutes = (app) => {
  app.post("/user", create);
  app.get("/user", verifyToken, get);
  app.get("/user/:id", verifyToken, getId);
  app.put("/user/:id", verifyToken, update);
  app.delete("/user/:id", verifyToken, remove);
};

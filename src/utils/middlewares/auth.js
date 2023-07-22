const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Acesso negado",
    });
  }

  try {
    const replace = token.replace("Bearer ", "");
    jwt.verify(replace, process.env.TOKEN_KEY);
    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: "Erro verifique suas credenciais de acesso." });
  }
};

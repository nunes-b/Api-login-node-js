const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const bodyparser = require("body-parser");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();
dotenv.config();
const port = process.env.PORT;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3000,
});

app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.send("Login API v1");
});

require("./src/routes/main")(app);
app.use("/docapi", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});

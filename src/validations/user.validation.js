const { z } = require("zod");

exports.userValidation = z.object({
  email: z.string(255).email(),
  password: z.string().min(4),
});

const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const expiresIn = "8hr";
  const payload = {
    user: {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    expiresIn: expiresIn,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiresIn });
};

module.exports = generateToken;

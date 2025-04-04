const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  // console.log('token', token);
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; 
    next();
  } catch (err) {
   
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ msg: "Token has expired, please log in again" });
    }
    res.status(401).json({ msg: "Token is not valid", user: req.user });
  }
};

module.exports = authMiddleware;
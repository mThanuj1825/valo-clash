const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyTokenAndGetUser = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Authorization header is required." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId)
      .select("-password")
      .lean()
      .exec();
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token has expired." });
    }

    res.status(400).json({ message: "Invalid token." });
  }
};

const verifyIfLeader = async (req, res, next) => {
  try {
    const user = req.user;
    console.log(user);

    if (user.isLeader) {
      next();
    } else {
      res.status(403).json({
        message: "User is not a leader",
      });
    }
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

module.exports = { verifyTokenAndGetUser, verifyIfLeader };

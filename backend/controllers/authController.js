const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const signup = async (req, res) => {
  try {
    const { userName, password, email, riotId, rank } = req.body;

    if (!userName) {
      return res.status(400).json({
        message: "Username is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!riotId) {
      return res.status(400).json({
        message: "Riot Id is required",
      });
    }

    if (!rank) {
      return res.status(400).json({
        message: "Rank is required",
      });
    }

    const existingUsername = await User.findOne({ userName }).lean().exec();
    if (existingUsername) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }
    const existingEmail = await User.findOne({ email }).lean().exec();
    if (existingEmail) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }
    const existingRiotId = await User.findOne({ riotId }).lean().exec();
    if (existingRiotId) {
      return res.status(409).json({
        message: "RiotId already exists",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
      riotId,
      rank,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: "Error registering user",
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });

    if (user === null) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    let token = null;
    if (user && (await bcryptjs.compare(password, user.password))) {
      token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      const userResponse = {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        riotId: user.riotId,
      };

      res.status(200).json({
        message: "Login successful",
        token,
        user: userResponse,
      });
    } else {
      res.status(401).json({
        message: "Invalid credentials",
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "Error logging in",
      error: err.message,
    });
  }
};

module.exports = { signup, login };

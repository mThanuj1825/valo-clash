const User = require("../models/User");

const getUser = async (req, res) => {
  try {
    const userName = req.params.userName;

    if (!userName || userName.length < 3) {
      return res.status(400).json({
        message: "Invalid User Name",
      });
    }

    const user = await User.findOne({ userName })
      .select("-password")
      .lean()
      .exec();

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllUsers = async (_, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = { getUser, getAllUsers };

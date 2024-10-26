const Team = require("../models/Team");
const User = require("../models/User");

const createTeam = async (req, res) => {
  try {
    const { teamName } = req.body;
    const userId = req.user._id;
    const rank = req.user.rank;

    if (!teamName) {
      return res.status(400).json({
        message: "Team Name is required",
      });
    }

    const userInTeam = await Team.findOne({ teammates: userId }).lean().exec();
    if (userInTeam) {
      return res.status(409).json({
        message: `User already in a team: ${userInTeam.teamName}`,
      });
    }

    const existingTeam = await Team.findOne({ teamName }).lean().exec();
    if (existingTeam) {
      return res.status(409).json({
        message: "Team Name already exists",
      });
    }

    const newTeam = new Team({
      teamName,
      teammates: [userId],
      avgRank: rank,
    });

    await newTeam.save();

    await User.findByIdAndUpdate(userId, { isLeader: true });

    res.status(201).json({
      message: "Team created successfully",
      team: newTeam,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const getTeam = async (req, res) => {
  try {
    const id = req.params.teamId;
    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    res.status(200).json(team);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllTeams = async (_, res) => {
  try {
    const teams = await Team.find();

    return res.status(200).json(teams);
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const updateTeam = async (req, res) => {
  try {
    const userId = req.user._id;
    const team = await Team.findOne({ teammates: userId }).exec();

    if (!team) {
      return res.status(404).json({
        message: "Team not found for the user",
      });
    }

    const { teamName, teammates } = req.body;
    const updatedFields = {};

    if (teamName) {
      updatedFields.teamName = teamName;
    }

    if (teammates) {
      updatedFields.teammates = teammates;
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      team._id,
      {
        $set: updatedFields,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      message: "Team updated successfully",
      team: updatedTeam,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const id = req.params.teamId;
    const team = await Team.findByIdAndDelete(id);
    const userId = req.user._id;

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    await User.findByIdAndUpdate(userId, { isLeader: false });

    res.status(200).json({
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createTeam,
  getTeam,
  getAllTeams,
  updateTeam,
  deleteTeam,
};

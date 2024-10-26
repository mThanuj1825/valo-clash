const Tournament = require("../models/Tournament");

const createTournament = async (req, res) => {
  try {
    const { tournamentName, registrationEnd } = req.body;

    if (!tournamentName) {
      return res.status(400).json({
        message: "Tournament Name is required",
      });
    }

    const existingTournament = await Tournament.findOne({
      tournamentName,
    }).exec();
    if (existingTournament) {
      return res.status(409).json({
        message: "Tournament Name already exists",
      });
    }

    if (!registrationEnd) {
      return res.status(400).json({
        message: "Registration end time is required",
      });
    }

    const tournament = new Tournament({
      tournamentName,
      registrationEnd,
    });
    await tournament.save();

    res.status(201).json({
      message: "Tournament created successfully",
      tournament,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const getTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const tournament = await Tournament.findById(tournamentId)
      .populate("registeredTeams winner")
      .exec();

    if (!tournament) {
      return res.status(404).json({
        message: "Tournament not found",
      });
    }

    res.status(200).json(tournament);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllTournaments = async (_, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate("registeredTeams")
      .exec();
    res.status(200).json(tournaments);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { tournamentName, registrationEnd, onGoing, winner } = req.body;

    const updateFields = {};
    if (tournamentName) {
      updateFields.tournamentName = tournamentName;
    }
    if (registrationEnd) {
      updateFields.registrationEnd = registrationEnd;
    }
    if (typeof onGoing !== "undefined") {
      updateFields.onGoing = onGoing;
    }
    if (winner) {
      updateFields.winner = winner;
    }

    const updatedTournament = await Tournament.findByIdAndUpdate(
      tournamentId,
      { $set: updateFields },
      { new: true, runValidators: true },
    ).exec();

    if (!updatedTournament) {
      return res.status(404).json({
        message: "Tournament not found",
      });
    }

    res.status(200).json({
      message: "Tournament updated successfully",
      tournament: updatedTournament,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const deleteTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const tournament = await Tournament.findByIdAndDelete(tournamentId);

    if (!tournament) {
      return res.status(404).json({
        message: "Tournament not found",
      });
    }

    res.status(200).json({
      message: "Tournament deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

const registerTeam = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { teamId } = req.body;

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({
        message: "Tournament not found",
      });
    }

    if (tournament.registrationEnd && new Date() > tournament.registrationEnd) {
      return res.status(400).json({
        message: "Registration for this tournament has ended",
      });
    }

    if (tournament.registeredTeams.includes(teamId)) {
      return res.status(409).json({
        message: "Team is already registered in this tournament",
      });
    }

    tournament.registeredTeams.push(teamId);
    await tournament.save();

    res.status(200).json({
      message: "Team registered successfully",
      tournament,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  createTournament,
  getTournament,
  getAllTournaments,
  updateTournament,
  deleteTournament,
  registerTeam,
};

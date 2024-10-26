const express = require("express");
const {
  getTournament,
  createTournament,
  getAllTournaments,
  updateTournament,
  deleteTournament,
  registerTeam,
} = require("../controllers/tournamentController");

const router = express.Router();

router.post("", createTournament);
router.get("/:tournamentId", getTournament);
router.get("", getAllTournaments);
router.patch("/:tournamentId", updateTournament);
router.delete("/:tournamentId", deleteTournament);
router.post("/:tournamentId/register", registerTeam);

module.exports = router;

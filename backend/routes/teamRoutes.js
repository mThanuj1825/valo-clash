const express = require("express");
const {
  verifyTokenAndGetUser,
  verifyIfLeader,
} = require("../middleware/authMiddleware");
const {
  createTeam,
  getTeam,
  getAllTeams,
  deleteTeam,
  updateTeam,
} = require("../controllers/teamController");

const router = express.Router();

router.post("", verifyTokenAndGetUser, createTeam);
router.get("/:teamId", getTeam);
router.get("", getAllTeams);
router.patch("", verifyTokenAndGetUser, verifyIfLeader, updateTeam);
router.delete("/:teamId", verifyTokenAndGetUser, deleteTeam);

module.exports = router;

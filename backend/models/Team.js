const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: "String",
      required: [true, "Team Name is required"],
      unique: true,
      index: true,
      minLength: [3, "Team Name must be at least 3 characters long"],
      maxLength: [50, "Team Name cannot be more than 50 characters long"],
    },
    teammates: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    avgRank: {
      type: Number,
      default: 0,
      min: [0, "Average rank cannot be negative"],
    },
    wins: {
      type: Number,
      default: 0,
      min: [0, "Wins cannot be negative"],
    },
    tournamentsParticipated: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tournament",
          unique: true,
        },
      ],
    },
    creationDate: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.models.Team || mongoose.model("Team", teamSchema);

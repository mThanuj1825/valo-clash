const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema(
  {
    tournamentName: {
      type: "String",
      required: [true, "Tournament Name is required"],
      unique: true,
      index: true,
      minLength: [3, "Tournament Name must be at least 3 characters long"],
      maxLength: [75, "Tournament Name cannot be more than 75 characters long"],
    },
    onGoing: {
      type: Boolean,
      default: true,
    },
    registrationStart: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    registrationEnd: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.registrationStart;
        },
        message: "Registration end date must be after the start date.",
      },
    },
    registeredTeams: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Team",
        },
      ],
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.Tournament || mongoose.model("Tournament", tournamentSchema);

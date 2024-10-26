const mongoose = require("mongoose");

const organizerSchema = new mongoose.Schema(
  {
    userName: {
      type: "String",
      required: [true, "Username is required"],
      unique: true,
      index: true,
      minLength: [3, "Username must be at least 3 characters long"],
      maxLength: [50, "Username cannot be more than 50 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    tournamentsOrganized: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tournament",
        },
      ],
    },
    joinDate: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.Organizer || mongoose.model("Organizer", organizerSchema);

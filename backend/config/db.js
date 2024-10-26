const mongoose = require("mongoose");
const cron = require("node-cron");
const Tournament = require("../models/Tournament");

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Database connected"))
    .catch((err) => console.error(err));
};

const scheduleOngoing = () => {
  cron.schedule("*/5 * * * * *", async () => {
    try {
      await Tournament.updateMany(
        {
          registrationEnd: { $lt: new Date() },
          onGoing: true,
        },
        {
          onGoing: false,
        },
      );
    } catch (err) {
      console.error("Error updating ongoing:", err);
    }
  });
};

module.exports = { connectDB, scheduleOngoing };

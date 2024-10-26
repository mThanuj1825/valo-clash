const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB, scheduleOngoing } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const teamRoutes = require("./routes/teamRoutes");
const tournamentRoutes = require("./routes/tournamentRoutes");
const userRoutes = require("./routes/userRoutes");

const PORT = process.env.PORT || 3000;
const app = express();

connectDB();
scheduleOngoing();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

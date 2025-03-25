import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js"; // Database connection
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import statusMonitor from "express-status-monitor";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(statusMonitor()); // Enable monitoring

app.get("/", (req, res) => {
  res.send("Friend's Zone Server is alive! 🚀");
});

// Keep-alive endpoint
app.get("/ping", (req, res) => {
  res.send("Pong! 🏓");
});
// Routes with API prefix
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Connect to DB and start the server
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Run this once  to create the table:
import { createUserTable } from "./models/User.js";
createUserTable();
// Run this once to create the table:

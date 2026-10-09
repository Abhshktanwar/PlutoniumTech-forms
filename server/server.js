const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routes Import karien
const formRoutes = require("./routes/formRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/plutoniumtech_forms";

// Middleware (Frontend se request allow aur JSON format accept karne ke liye)
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/forms", formRoutes);

// Test Route (Check karne ke liye ki backend alive hai) , Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "PlutoniumTech Forms Backend is running smoothly 🚀",
    timestamp: new Date(),
  });
});

// MongoDB connection

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully to PlutoniumTech DB");
  })

  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    console.log(
      "💡 Note: Agar local MongoDB band hai toh hum cloud (Atlas) URI bhi use kar sakte hain.",
    );
  });

// Server Start
(app.listen(PORT),
  () => {
    console.log(`⚡ PlutoniumTech Server running on: http://localhost:${PORT}`);
  });

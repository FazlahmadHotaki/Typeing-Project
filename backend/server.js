require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

const authRoutes = require("./routes/auth");
const lessonRoutes = require("./routes/lessons");
const resultRoutes = require("./routes/results");   // ← NEW

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "TypeTone backend is running!" });
});

app.use("/api", authRoutes);
app.use("/api", lessonRoutes);
app.use("/api", resultRoutes);                       // ← NEW

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Unexpected server error." });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 TypeTone backend running on port ${PORT}`)
  );
});
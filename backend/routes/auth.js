const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

/* ---------- SIGN UP ---------- */
router.post("/signup", async (req, res) => {
  // ... (unchanged)
});

/* ---------- LOGIN ---------- */
router.post("/login", async (req, res) => {
  // ... (unchanged)
});

/* ---------- LIST ALL USERS (temporary admin route) ---------- */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "name email createdAt");
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
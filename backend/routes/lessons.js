const express = require("express");
const Lesson = require("../models/Lesson");
const User = require("../models/User");
const TypingResult = require("../models/TypingResult");

const router = express.Router();

/* ---------- DASHBOARD ---------- */
router.get("/dashboard/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const lessons = await Lesson.find({ user_id: user._id }).sort({
      createdAt: 1,
    });
    const typingResults = await TypingResult.find({ user_id: user._id }).sort({
      createdAt: -1,
    });

    const completed = typingResults.filter((r) => r.completed).length;
    const totalLessons = lessons.length;
    const progress =
      totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
    const stars = Math.floor(completed / 10);
    const score = completed * 10;

    const accuracy =
      typingResults.length > 0
        ? Math.round(
            typingResults.reduce((s, r) => s + Number(r.accuracy || 0), 0) /
              typingResults.length
          )
        : 0;

    const wpm =
      typingResults.length > 0
        ? Math.round(
            typingResults.reduce((s, r) => s + Number(r.wpm || 0), 0) /
              typingResults.length
          )
        : 0;

    const practiceMinutes =
      typingResults.length > 0
        ? Math.round(
            typingResults.reduce(
              (s, r) => s + Number(r.elapsed_time || 0),
              0
            ) / 60
          )
        : 0;

    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
      stats: {
        completed,
        totalLessons,
        progress,
        stars,
        score,
        accuracy,
        wpm,
        practiceMinutes,
      },
      lessons,
      typingResults,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

/* ---------- GET LESSONS ---------- */
router.get("/lessons/:userId", async (req, res) => {
  try {
    const lessons = await Lesson.find({ user_id: req.params.userId }).sort({
      createdAt: 1,
    });
    res.json({ success: true, lessons });
  } catch (error) {
    console.error("Get lessons error:", error);
    res
      .status(500)
      .json({ success: false, message: "Could not load lessons." });
  }
});

/* ---------- ADD LESSON ---------- */
router.post("/lessons", async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required." });
  }

  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const lesson = await Lesson.create(req.body);

    res.status(201).json({
      success: true,
      message: "Lesson created successfully!",
      lesson,
    });
  } catch (error) {
    console.error("Insert lesson error:", error);
    res
      .status(500)
      .json({ success: false, message: "Could not create lesson." });
  }
});

module.exports = router;
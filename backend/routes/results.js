const express = require("express");
const TypingResult = require("../models/TypingResult");
const User = require("../models/User");

const router = express.Router();

/* =========================================
   SAVE A LESSON RESULT
========================================= */
router.post("/results", async (req, res) => {
  const {
    user_id,
    lesson_id,
    lessonTitle,
    stars,
    score,
    accuracy,
    wpm,
    elapsedTime,
    typedCharacters,
    correctCharacters,
    totalCharacters,
  } = req.body;

  if (!user_id || !lesson_id) {
    return res.status(400).json({
      success: false,
      message: "user_id and lesson_id are required.",
    });
  }

  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    // Find previous BEST result for this user + lesson
    const previousBest = await TypingResult.findOne({
      user_id,
      lesson_id: String(lesson_id),
    }).sort({ stars: -1, score: -1 });

    // Only overwrite if this attempt is better OR first attempt
    const isBetter =
      !previousBest ||
      stars > previousBest.stars ||
      (stars === previousBest.stars && score > previousBest.score);

    // Always save the attempt (full history)
    const attempt = await TypingResult.create({
      user_id,
      lesson_id: String(lesson_id),
      lessonTitle: lessonTitle || "",
      stars,
      score,
      accuracy,
      wpm,
      elapsed_time: elapsedTime || 0,
      typedCharacters,
      correctCharacters,
      totalCharacters,
      completed: true,
    });

    res.json({
      success: true,
      message: isBetter ? "New best result saved!" : "Attempt saved.",
      isNewBest: isBetter,
      result: attempt,
    });
  } catch (error) {
    console.error("Save result error:", error);
    res.status(500).json({ success: false, message: "Could not save result." });
  }
});

/* =========================================
   GET ALL RESULTS FOR A USER (dashboard)
   Returns: total stars, total score, best per lesson
========================================= */
router.get("/results/:userId", async (req, res) => {
  try {
    const all = await TypingResult.find({
      user_id: req.params.userId,
    }).sort({ createdAt: -1 });

    // Compute best result per lesson
    const bestByLesson = {};
    for (const r of all) {
      const key = String(r.lesson_id);
      const current = bestByLesson[key];
      if (!current || r.stars > current.stars || (r.stars === current.stars && r.score > current.score)) {
        bestByLesson[key] = r.toJSON();
      }
    }

    const bestResults = Object.values(bestByLesson);
    const totalStars = bestResults.reduce((s, r) => s + (r.stars || 0), 0);
    const totalScore = bestResults.reduce((s, r) => s + (r.score || 0), 0);

    res.json({
      success: true,
      count: bestResults.length,
      totalAttempts: all.length,
      totalStars,
      totalScore,
      results: bestResults,
    });
  } catch (error) {
    console.error("Get results error:", error);
    res
      .status(500)
      .json({ success: false, message: "Could not load results." });
  }
});

/* =========================================
   GET BEST RESULT FOR ONE LESSON
========================================= */
router.get("/results/:userId/:lessonId", async (req, res) => {
  try {
    const result = await TypingResult.findOne({
      user_id: req.params.userId,
      lesson_id: String(req.params.lessonId),
    }).sort({ stars: -1, score: -1 });

    res.json({ success: true, result: result ? result.toJSON() : null });
  } catch (error) {
    console.error("Get single result error:", error);
    res.status(500).json({ success: false, message: "Could not load result." });
  }
});

module.exports = router;
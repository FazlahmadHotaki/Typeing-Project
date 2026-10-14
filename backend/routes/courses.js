const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

/* GET all courses, sorted */
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({ success: false, message: "Could not load courses." });
  }
});

/* GET one course by slug */
router.get("/courses/:slug", async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (!course) {
      return res.status(404).json({ success: false, message: "Not found." });
    }
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

/* TEMPORARY: seed the DB — delete after running once */
router.post("/courses/seed", async (req, res) => {
  try {
    const courses = [
      {
        slug: "pashto-typing",
        icon: "https://img.icons8.com/?size=100&id=IW0A1Zpa3Q9E&format=png&color=000000",
        color: "#fff8f0",
        title: { en: "Pashto Typing", ps: "د پښتو ټایپ", fa: "تایپ پشتو" },
        sub: { en: "Pashto script", ps: "پښتو لیک", fa: "خط پشتو" },
        score: "9,420",
        stars: 12,
        progress: 1,
        order: 1,
      },
      {
        slug: "typing-jungle",
        icon: "⌨",
        color: "#5B8DEF",
        title: { en: "Typing Jungle", ps: "د ټایپ ځنګل", fa: "جنگل تایپ" },
        sub: { en: "Adventure course", ps: "د ماجراجویۍ کورس", fa: "دوره ماجراجویی" },
        score: "634,115",
        stars: 1636,
        progress: 78,
        order: 2,
      },
      {
        slug: "dari-farsi",
        icon: "ف",
        color: "#4FC38A",
        title: { en: "Dari / Farsi Typing", ps: "د دري ټایپ", fa: "تایپ فارسی" },
        sub: { en: "Persian script", ps: "فارسي لیک", fa: "فارسی" },
        score: "18,311",
        stars: 35,
        progress: 22,
        order: 3,
      },
      {
        slug: "level-7",
        icon: "V",
        color: "#E8615A",
        title: { en: "Level 7 — Greek & Latin Roots", ps: "کچه ۷ - یوناني او لاتیني ریښې", fa: "سطح ۷ - ریشه‌های یونانی و لاتین" },
        sub: { en: "Vocabulary", ps: "لغتونه", fa: "واژگان" },
        score: "2,000",
        stars: 0,
        progress: 10,
        order: 4,
      },
      {
        slug: "grade-2",
        icon: "2",
        color: "#E8A33D",
        title: { en: "Typing — Grade 2", ps: "ټایپ | دویمه ټولګی", fa: "تایپ | پایه دوم" },
        sub: { en: "Grade 2", ps: "دویمه ټولګی", fa: "پایه دوم" },
        score: "5,000",
        stars: 5,
        progress: 55,
        order: 5,
      },
      {
        slug: "grade-1",
        icon: "1",
        color: "#8B6BD9",
        title: { en: "Typing — Grade 1", ps: "ټایپ | لومړۍ ټولګی", fa: "تایپ | پایه اول" },
        sub: { en: "Grade 1", ps: "لومړۍ ټولګی", fa: "پایه اول" },
        score: "3,000",
        stars: 0,
        progress: 5,
        order: 6,
      },
    ];

    // Wipe and re-insert (safe during dev only)
    await Course.deleteMany({});
    const created = await Course.insertMany(courses);

    res.json({ success: true, count: created.length });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ success: false, message: "Seed failed." });
  }
});

module.exports = router;
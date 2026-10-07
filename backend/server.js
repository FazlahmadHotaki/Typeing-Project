const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

// MySQL connection
const db = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());


// ========================================
// TEST BACKEND
// ========================================
app.get("/", (req, res) => {
  res.json({
    message: "TypeTone backend is running!",
  });
});


// ========================================
// TEST DATABASE
// ========================================
app.get("/api/test-db", (req, res) => {
  db.query("SELECT 1 + 1 AS result", (err, results) => {
    if (err) {
      console.error("Database error:", err);

      return res.status(500).json({
        success: false,
        message: "Database error",
        error: err.message,
      });
    }

    res.json({
      success: true,
      message: "Database is working!",
      result: results[0].result,
    });
  });
});


// ========================================
// SIGN UP
// ========================================
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required.",
    });
  }

  try {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    const checkSql = `
      SELECT id
      FROM users
      WHERE email = ?
    `;

    db.query(checkSql, [cleanEmail], async (err, results) => {
      if (err) {
        console.error("Check user error:", err);

        return res.status(500).json({
          success: false,
          message: "Database error.",
        });
      }

      if (results.length > 0) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists.",
        });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertSql = `
          INSERT INTO users (name, email, password)
          VALUES (?, ?, ?)
        `;

        db.query(
          insertSql,
          [cleanName, cleanEmail, hashedPassword],
          (err, result) => {
            if (err) {
              console.error("Signup database error:", err);

              return res.status(500).json({
                success: false,
                message: "Could not create account.",
              });
            }

            res.status(201).json({
              success: true,
              message: "Account created successfully!",
              user: {
                id: result.insertId,
                name: cleanName,
                email: cleanEmail,
              },
            });
          }
        );
      } catch (error) {
        console.error("Password hashing error:", error);

        return res.status(500).json({
          success: false,
          message: "Server error.",
        });
      }
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
});


// ========================================
// LOGIN
// ========================================
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  const sql = `
    SELECT id, name, email, password
    FROM users
    WHERE email = ?
  `;

  db.query(sql, [cleanEmail], async (err, results) => {
    if (err) {
      console.error("Login database error:", err);

      return res.status(500).json({
        success: false,
        message: "Database error.",
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = results[0];

    try {
      const passwordMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      res.json({
        success: true,
        message: "Login successful!",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Password comparison error:", error);

      return res.status(500).json({
        success: false,
        message: "Server error.",
      });
    }
  });
});


// ========================================
// GET DASHBOARD DATA
// ========================================
app.get("/api/dashboard/:userId", (req, res) => {
  const userId = req.params.userId;

  const userSql = `
    SELECT
      id,
      name,
      email
    FROM users
    WHERE id = ?
  `;

  db.query(userSql, [userId], (userErr, userResults) => {
    if (userErr) {
      console.error("Dashboard user error:", userErr);

      return res.status(500).json({
        success: false,
        message: "Database error while loading user.",
      });
    }

    if (userResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const user = userResults[0];

    const lessonsSql = `
      SELECT
        id,
        icon,
        title_en,
        title_ps,
        title_fa,
        title_dr,
        title_prs,
        sub_en,
        sub_ps,
        sub_fa,
        sub_dr,
        sub_prs,
        progress,
        score,
        stars,
        color
      FROM lessons
      WHERE user_id = ?
      ORDER BY id ASC
    `;

    db.query(
      lessonsSql,
      [userId],
      (lessonErr, lessonResults) => {
        if (lessonErr) {
          console.error(
            "Dashboard lessons error:",
            lessonErr
          );

          return res.status(500).json({
            success: false,
            message:
              "Database error while loading lessons.",
          });
        }

        const resultsSql = `
          SELECT
            id,
            lesson_id,
            wpm,
            accuracy,
            elapsed_time,
            completed,
            created_at
          FROM typing_results
          WHERE user_id = ?
          ORDER BY created_at DESC
        `;

        db.query(
          resultsSql,
          [userId],
          (resultsErr, typingResults) => {
            if (resultsErr) {
              console.error(
                "Dashboard results error:",
                resultsErr
              );

              return res.status(500).json({
                success: false,
                message:
                  "Database error while loading typing results.",
              });
            }

            const completed =
              typingResults.filter(
                (result) =>
                  Number(result.completed) === 1 ||
                  result.completed === true
              ).length;

            const totalLessons =
              lessonResults.length;

            const progress =
              totalLessons > 0
                ? Math.round(
                    (completed /
                      totalLessons) *
                      100
                  )
                : 0;

            const stars =
              Math.floor(
                completed / 10
              );

            const score =
              completed * 10;

            const accuracy =
              typingResults.length > 0
                ? Math.round(
                    typingResults.reduce(
                      (sum, result) =>
                        sum +
                        Number(
                          result.accuracy || 0
                        ),
                      0
                    ) /
                      typingResults.length
                  )
                : 0;

            const wpm =
              typingResults.length > 0
                ? Math.round(
                    typingResults.reduce(
                      (sum, result) =>
                        sum +
                        Number(
                          result.wpm || 0
                        ),
                      0
                    ) /
                      typingResults.length
                  )
                : 0;

            const practiceMinutes =
              typingResults.length > 0
                ? Math.round(
                    typingResults.reduce(
                      (sum, result) =>
                        sum +
                        Number(
                          result.elapsed_time ||
                            0
                        ),
                      0
                    ) / 60
                  )
                : 0;

            res.json({
              success: true,

              user: {
                id: user.id,
                name: user.name,
                email: user.email,
              },

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

              lessons: lessonResults,

              typingResults,
            });
          }
        );
      }
    );
  });
});


// ========================================
// GET LESSONS FOR USER
// ========================================
app.get("/api/lessons/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT
      id,
      user_id,
      icon,

      title_en,
      title_ps,
      title_fa,
      title_dr,
      title_prs,

      sub_en,
      sub_ps,
      sub_fa,
      sub_dr,
      sub_prs,

      progress,
      score,
      stars,

      color,
      created_at

    FROM lessons

    WHERE user_id = ?

    ORDER BY id ASC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(
        "Get lessons error:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Could not load lessons.",
      });
    }

    res.json({
      success: true,
      lessons: results,
    });
  });
});


// ========================================
// ADD NEW LESSON
// ========================================
app.post("/api/lessons", (req, res) => {
  const {
    user_id,

    icon,

    title_en,
    title_ps,
    title_fa,
    title_dr,
    title_prs,

    sub_en,
    sub_ps,
    sub_fa,
    sub_dr,
    sub_prs,

    progress,
    score,
    stars,

    color,
  } = req.body;


  // ========================================
  // CHECK USER ID
  // ========================================

  if (!user_id) {
    return res.status(400).json({
      success: false,
      message:
        "User ID is required.",
    });
  }


  // ========================================
  // CHECK USER EXISTS
  // ========================================

  const checkUserSql = `
    SELECT id
    FROM users
    WHERE id = ?
  `;

  db.query(
    checkUserSql,
    [user_id],
    (userErr, userResults) => {

      if (userErr) {
        console.error(
          "Check user error:",
          userErr
        );

        return res.status(500).json({
          success: false,
          message:
            "Database error.",
        });
      }


      if (
        userResults.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "User not found.",
        });
      }


      // ========================================
      // INSERT LESSON
      // ========================================

      const insertSql = `
        INSERT INTO lessons (
          user_id,
          icon,

          title_en,
          title_ps,
          title_fa,
          title_dr,
          title_prs,

          sub_en,
          sub_ps,
          sub_fa,
          sub_dr,
          sub_prs,

          progress,
          score,
          stars,

          color
        )

        VALUES (
          ?,
          ?,

          ?,
          ?,
          ?,
          ?,
          ?,

          ?,
          ?,
          ?,
          ?,
          ?,

          ?,
          ?,
          ?,

          ?
        )
      `;


      const values = [
        user_id,

        icon || "📚",

        title_en || "",
        title_ps || "",
        title_fa || "",
        title_dr || "",
        title_prs || "",

        sub_en || "",
        sub_ps || "",
        sub_fa || "",
        sub_dr || "",
        sub_prs || "",

        Number(progress) || 0,

        Number(score) || 0,

        Number(stars) || 0,

        color || "#8B5CF6",
      ];


      db.query(
        insertSql,
        values,
        (insertErr, result) => {

          if (insertErr) {
            console.error(
              "Insert lesson error:",
              insertErr
            );

            return res.status(500).json({
              success: false,
              message:
                "Could not create lesson.",
              error:
                insertErr.message,
            });
          }


          // ========================================
          // GET CREATED LESSON
          // ========================================

          const getLessonSql = `
            SELECT
              id,
              user_id,
              icon,

              title_en,
              title_ps,
              title_fa,
              title_dr,
              title_prs,

              sub_en,
              sub_ps,
              sub_fa,
              sub_dr,
              sub_prs,

              progress,
              score,
              stars,

              color,
              created_at

            FROM lessons

            WHERE id = ?
          `;


          db.query(
            getLessonSql,
            [result.insertId],
            (getErr, lessonResults) => {

              if (getErr) {
                console.error(
                  "Get created lesson error:",
                  getErr
                );

                return res.status(500).json({
                  success: false,
                  message:
                    "Lesson was created, but could not be loaded.",
                });
              }


              res.status(201).json({
                success: true,

                message:
                  "Lesson created successfully!",

                lesson:
                  lessonResults[0],
              });
            }
          );
        }
      );
    }
  );
});


// ========================================
// START SERVER
// ========================================
app.listen(5000, () => {
  console.log(
    "✅ TypeTone backend running on port 5000"
  );
});
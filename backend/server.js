const express = require("express");
const cors = require("cors");

// Import MySQL connection
const db = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

// Test backend
app.get("/", (req, res) => {
  res.json({
    message: "TypeTone backend is running!",
  });
});

// Test database
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


// Signup API
app.post("/api/signup", (req, res) => {
  const { name, email, password } = req.body;

  // Check required fields
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  // Check if email already exists
  const checkEmailSql = "SELECT id FROM users WHERE email = ?";

  db.query(checkEmailSql, [email], (err, results) => {
    if (err) {
      console.error("Error checking email:", err);

      return res.status(500).json({
        success: false,
        message: "Database error.",
      });
    }

    if (results.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Insert new user
    const insertSql =
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(insertSql, [name, email, password], (err, result) => {
      if (err) {
        console.error("Error creating user:", err);

        return res.status(500).json({
          success: false,
          message: "Could not create account.",
        });
      }

      res.status(201).json({
        success: true,
        message: "Account created successfully!",
        userId: result.insertId,
      });
    });
  });
});

// Login API
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const sql =
    "SELECT id, name, email, password FROM users WHERE email = ?";

  db.query(sql, [email.trim()], (err, results) => {
    if (err) {
      console.error("Login database error:", err);

      return res.status(500).json({
        success: false,
        message: "Database error.",
      });
    }

    // User not found
    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const user = results[0];

    // Check password
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Login successful
    res.json({
      success: true,
      message: "Login successful!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  });
});
// Start server
app.listen(5000, () => {
  console.log("✅ TypeTone backend running on port 5000");
});
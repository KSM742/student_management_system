
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "college",
  dateStrings: true
});

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.log("MySQL connection failed:", err.message);
  } else {
    console.log("MySQL connected");
  }
});

// Test backend
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// GET - display students
app.get("/students", (req, res) => {
  db.query("SELECT * FROM student", (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Database error");
    }
    res.json(results);
  });
});

// POST - add student
app.post("/students", (req, res) => {
  const { usn, name, dob } = req.body;

  db.query(
    "INSERT INTO student (usn, name, dob) VALUES (?, ?, ?)",
    [usn, name, dob],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Database error");
      }
      res.send("Student added");
    }
  );
});

// PUT - edit student
app.put("/students/:usn", (req, res) => {
  const oldUsn = req.params.usn;
  const { usn, name, dob } = req.body;

  db.query(
    "UPDATE student SET usn = ?, name = ?, dob = ? WHERE usn = ?",
    [usn, name, dob, oldUsn],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Database error");
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("Student not found");
      }

      res.send("Student updated");
    }
  );
});

// DELETE - delete student
app.delete("/students/:usn", (req, res) => {
  const usn = req.params.usn;

  db.query(
    "DELETE FROM student WHERE usn = ?",
    [usn],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Database error");
      }

      if (result.affectedRows === 0) {
        return res.status(404).send("Student not found");
      }

      res.send("Student deleted");
    }
  );
});

// Start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

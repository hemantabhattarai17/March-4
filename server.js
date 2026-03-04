const express = require("express");
const cors = require("cors");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetchFn }) => fetchFn(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// Use env var if provided, otherwise fall back to the key you shared.
const NEWS_API_KEY =
  process.env.NEWS_API_KEY || "fb7004e1c39d48d19569aacaae0ab5b4";

const dbPath = path.join(__dirname, "students.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      major TEXT NOT NULL,
      year TEXT NOT NULL,
      feedback TEXT,
      created_at TEXT NOT NULL
    )`
  );
});

app.use(cors());
app.use(express.json());

// Serve the static front-end (index.html, script.js, styles, assets)
app.use(express.static(path.join(__dirname)));

// Proxy endpoint for Tech & AI news
app.get("/news", async (req, res) => {
  try {
    if (!NEWS_API_KEY) {
      return res.status(500).json({
        error: "NEWS_API_KEY missing on server",
      });
    }

    const query =
      "artificial intelligence OR AI OR \"machine learning\" OR technology";

    const url =
      "https://newsapi.org/v2/everything?" +
      new URLSearchParams({
        q: query,
        language: "en",
        sortBy: "publishedAt",
        pageSize: "20",
      }).toString();

    const response = await fetch(url, {
      headers: {
        "X-Api-Key": NEWS_API_KEY,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        error: "NewsAPI error",
        status: response.status,
        body: text,
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching news:", err);
    res.status(500).json({
      error: "Unable to fetch news from backend",
    });
  }
});

// Student feedback API
app.post("/api/students", (req, res) => {
  const { name, phone, major, year, feedback } = req.body || {};
  if (!name || !phone || !major || !year) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const stmt = db.prepare(
    "INSERT INTO students (name, phone, major, year, feedback, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const createdAt = new Date().toISOString();
  stmt.run(
    name,
    phone,
    major,
    year,
    feedback || "",
    createdAt,
    function (err) {
      if (err) {
        console.error("Insert error:", err);
        return res.status(500).json({ error: "Database insert failed" });
      }
      res.status(201).json({
        id: this.lastID,
        name,
        phone,
        major,
        year,
        feedback: feedback || "",
        created_at: createdAt,
      });
    }
  );
});

app.get("/api/students", (req, res) => {
  db.all(
    "SELECT id, name, phone, major, year, feedback, created_at FROM students ORDER BY id DESC",
    (err, rows) => {
      if (err) {
        console.error("Select error:", err);
        return res.status(500).json({ error: "Database query failed" });
      }
      res.json(rows);
    }
  );
});

app.put("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, phone, major, year, feedback } = req.body || {};
  if (!id || !name || !phone || !major || !year) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const stmt = db.prepare(
    "UPDATE students SET name = ?, phone = ?, major = ?, year = ?, feedback = ? WHERE id = ?"
  );
  stmt.run(
    name,
    phone,
    major,
    year,
    feedback || "",
    id,
    function (err) {
      if (err) {
        console.error("Update error:", err);
        return res.status(500).json({ error: "Database update failed" });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json({ id, name, phone, major, year, feedback: feedback || "" });
    }
  );
});

app.delete("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "Invalid id" });
  }
  const stmt = db.prepare("DELETE FROM students WHERE id = ?");
  stmt.run(id, function (err) {
    if (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ error: "Database delete failed" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


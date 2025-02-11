const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 8080;
const JSON_FILE = path.join(__dirname, "bible-study.json");
const MEMORY_FILE = path.join(__dirname, "memory.json");

// Allow JSON & CORS requests
app.use(express.json());
app.use(cors());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// 📌 API Route: Load Devotional Data
app.get("/bible-study.json", (req, res) => {
  fs.readFile(JSON_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading devotional data.");
    res.json(JSON.parse(data));
  });
});

// 📌 API Route: Save Changes to Devotional JSON
app.post("/update-json", (req, res) => {
  const { date, updatedData } = req.body;

  fs.readFile(JSON_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading devotional data.");

    let jsonData = JSON.parse(data);
    jsonData[date] = updatedData;

    fs.writeFile(JSON_FILE, JSON.stringify(jsonData, null, 2), (err) => {
      if (err) return res.status(500).send("Error saving devotional data.");
      res.send("✅ Devotional data updated successfully.");
    });
  });
});

// 📌 API Route: Serve Memory Verses Data
app.get("/memory.json", (req, res) => {
  fs.readFile(MEMORY_FILE, "utf8", (err, data) => {
    if (err) return res.status(500).send("Error reading memory verses.");
    res.json(JSON.parse(data));
  });
});

// ✅ Start Server
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
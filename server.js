// server.js — the Express server for the Cat Journal API.
// Defines REST routes that talk to the SQLite database in database.js.

const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();
const PORT = 5000;

// ---------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------

// Parse incoming JSON request bodies onto req.body.
app.use(express.json());

// Allow cross-origin requests (so a frontend on another port can call us).
app.use(cors());

// Log the method and URL of every request that comes in.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ---------------------------------------------------------------
// Routes
// ---------------------------------------------------------------

// GET /entries — return all journal entries.
app.get("/entries", (req, res) => {
  // TODO: Use db.prepare to SELECT all entries from the database and
  // return them as JSON.
});

// POST /entries — add a new journal entry.
app.post("/entries", (req, res) => {
  // TODO: Use db.prepare to INSERT a new entry with the title and text
  // from req.body. Return the new entry with a 201 status.
});

// PUT /entries/:id — update an entry's title and text.
// This one is fully written as a reference example — the other routes
// follow the same pattern.
app.put("/entries/:id", (req, res) => {
  const { title, text } = req.body;

  // Prepare the UPDATE statement. The ? marks are placeholders that
  // better-sqlite3 fills in safely (no SQL injection).
  const result = db
    .prepare("UPDATE entries SET title = ?, text = ? WHERE id = ?")
    .run(title, text, req.params.id);

  // result.changes tells us how many rows were updated. Zero means
  // no entry had that id.
  if (result.changes === 0) {
    return res.status(404).json({ error: "Entry not found" });
  }

  // Fetch the updated row so we can send it back to the client.
  const updatedEntry = db
    .prepare("SELECT * FROM entries WHERE id = ?")
    .get(req.params.id);

  res.json(updatedEntry);
});

// DELETE /entries/:id — remove an entry.
app.delete("/entries/:id", (req, res) => {
  // TODO: Use db.prepare to DELETE the entry with the matching id from
  // req.params. Return a confirmation message.
});

// ---------------------------------------------------------------
// Start the server
// ---------------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Cat Journal API listening at http://localhost:${PORT}`);
});

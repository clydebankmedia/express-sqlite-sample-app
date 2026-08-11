// server.js — the Express server for the Cat Journal API.
// Defines REST routes that talk to the SQLite database in database.js.

const express = require("express");
const cors = require("cors");
const { initDatabase, saveDatabase } = require("./database");

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
// Routes + server start
// ---------------------------------------------------------------

// sql.js loads asynchronously, so we wait for the database to be ready,
// then define the routes and start listening.
async function startServer() {
  const db = await initDatabase();

  // GET /entries — return all journal entries.
  app.get("/entries", (req, res) => {
    // Prepare a SELECT, then step through the results one row at a time.
    // stmt.step() moves to the next row (returns false when done) and
    // stmt.getAsObject() reads the current row as a plain object.
    const stmt = db.prepare("SELECT * FROM entries");
    const entries = [];
    while (stmt.step()) {
      entries.push(stmt.getAsObject());
    }
    stmt.free(); // always free prepared statements when you're done

    res.json(entries);
  });

  // POST /entries — add a new journal entry.
  app.post("/entries", (req, res) => {
    const { title, text } = req.body;

    // The title column is NOT NULL, so reject requests without one.
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    db.run("INSERT INTO entries (title, text) VALUES (?, ?)", [title, text]);

    // last_insert_rowid() is SQLite's way of telling us the id of the
    // row we just created.
    const newId = db.exec("SELECT last_insert_rowid()")[0].values[0][0];

    // Fetch the new row (with its auto-generated id and date) to send back.
    const stmt = db.prepare("SELECT * FROM entries WHERE id = ?");
    const newEntry = stmt.getAsObject([newId]);
    stmt.free();

    // Save to disk so the new entry survives a restart.
    saveDatabase(db);

    res.status(201).json(newEntry);
  });

  // PUT /entries/:id — update an entry's title and text.
  // This one is fully written as a reference example — the other routes
  // follow the same pattern.
  app.put("/entries/:id", (req, res) => {
    const { title, text } = req.body;

    // db.run executes the statement. The ? marks are placeholders that
    // sql.js fills in safely (no SQL injection).
    db.run("UPDATE entries SET title = ?, text = ? WHERE id = ?", [
      title,
      text,
      req.params.id,
    ]);

    // getRowsModified() tells us how many rows the UPDATE touched.
    // Zero means no entry had that id.
    if (db.getRowsModified() === 0) {
      return res.status(404).json({ error: "Entry not found" });
    }

    // Fetch the updated row so we can send it back to the client.
    const stmt = db.prepare("SELECT * FROM entries WHERE id = ?");
    const updatedEntry = stmt.getAsObject([req.params.id]);
    stmt.free();

    // Save to disk so the change survives a restart.
    saveDatabase(db);

    res.json(updatedEntry);
  });

  // DELETE /entries/:id — remove an entry.
  app.delete("/entries/:id", (req, res) => {
    // Delete the row with the matching id, then check getRowsModified()
    // to see whether anything was actually deleted.
    db.run("DELETE FROM entries WHERE id = ?", [req.params.id]);

    if (db.getRowsModified() === 0) {
      return res.status(404).json({ error: "Entry not found" });
    }

    // Save to disk so the deletion survives a restart.
    saveDatabase(db);

    res.json({ message: `Entry ${req.params.id} deleted` });
  });

  // -------------------------------------------------------------
  // Start the server
  // -------------------------------------------------------------

  app.listen(PORT, () => {
    console.log(`Cat Journal API listening at http://localhost:${PORT}`);
  });
}

startServer();

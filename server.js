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
    // TODO: SELECT all entries from the database and return them as JSON.
    // (Hint: db.prepare a SELECT statement, loop with stmt.step() and
    // stmt.getAsObject() to collect the rows, then stmt.free().)
  });

  // POST /entries — add a new journal entry.
  app.post("/entries", (req, res) => {
    // TODO: INSERT a new entry with the title and text from req.body.
    // Return the new entry with a 201 status. (Hint: db.run the INSERT,
    // use SELECT last_insert_rowid() to find the new entry's id, and call
    // saveDatabase(db) so the entry survives a restart.)
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
    // TODO: DELETE the entry with the matching id from req.params and
    // return a confirmation message. (Hint: db.run the DELETE, check
    // db.getRowsModified(), and call saveDatabase(db).)
  });

  // -------------------------------------------------------------
  // Start the server
  // -------------------------------------------------------------

  app.listen(PORT, () => {
    console.log(`Cat Journal API listening at http://localhost:${PORT}`);
  });
}

startServer();

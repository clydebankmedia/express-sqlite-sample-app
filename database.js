// database.js — the database layer for the Cat Journal API.
// Uses sql.js, a pure-JavaScript build of SQLite. Nothing to compile,
// no build tools — it works the same on Windows, Mac, and Linux.
//
// sql.js keeps the whole database in memory, so we load journal.db from
// disk when the server starts and write it back to disk after every change.

const initSqlJs = require("sql.js");
const fs = require("fs");

// The file where the database lives on disk.
const DB_FILE = "journal.db";

// Write the in-memory database out to journal.db. Call this after any
// INSERT, UPDATE, or DELETE so changes survive a server restart.
function saveDatabase(db) {
  const data = db.export();
  fs.writeFileSync(DB_FILE, Buffer.from(data));
}

// Set up the database: load it from disk (or create a new one), make sure
// the entries table exists, and seed it with sample data if it's empty.
// This is async because sql.js takes a moment to initialize.
async function initDatabase() {
  const SQL = await initSqlJs();

  // Load the existing journal.db file if it exists, otherwise start fresh.
  let db;
  if (fs.existsSync(DB_FILE)) {
    const fileBuffer = fs.readFileSync(DB_FILE);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // ---------------------------------------------------------------
  // Create the table
  // ---------------------------------------------------------------

  // Create the entries table if it doesn't already exist.
  // - id: unique number that counts up automatically with each new entry
  // - title: required text (NOT NULL means it can't be empty)
  // - text: optional text for the entry body
  // - date: fills in today's date automatically if none is provided
  db.run(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      text TEXT,
      date TEXT DEFAULT CURRENT_DATE
    )
  `);

  // ---------------------------------------------------------------
  // Seed the table
  // ---------------------------------------------------------------

  // Count how many rows are in the table. db.exec returns an array of
  // result objects — the count lives at [0].values[0][0]. If the table is
  // empty, insert 3 sample entries so there's something to look at.
  // Because we only seed when the count is 0, restarting the server
  // won't create duplicates.
  const count = db.exec("SELECT COUNT(*) FROM entries")[0].values[0][0];

  if (count === 0) {
    db.run("INSERT INTO entries (title, text) VALUES (?, ?)", [
      "Marjorie's Big Nap",
      "Marjorie napped in the laundry basket for 6 hours straight. A personal best.",
    ]);
    db.run("INSERT INTO entries (title, text) VALUES (?, ?)", [
      "Felix vs. the Red Dot",
      "Felix chased the laser pointer for 20 minutes and remains convinced he almost had it.",
    ]);
    db.run("INSERT INTO entries (title, text) VALUES (?, ?)", [
      "Whiskers' Counter Heist",
      "Whiskers stole a piece of chicken off the counter and showed zero remorse.",
    ]);

    console.log("Seeded the database with 3 sample entries.");
  }

  // Save so a brand-new database (with its table and seed data) lands on disk.
  saveDatabase(db);

  return db;
}

// Export the setup function and the save helper so server.js can use them.
module.exports = { initDatabase, saveDatabase };

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

  // TODO: Create a table called entries with columns: id (integer, primary
  // key, autoincrement), title (text, not null), text (text), date (text,
  // default current date). (Hint: db.run with CREATE TABLE IF NOT EXISTS)

  // ---------------------------------------------------------------
  // Seed the table
  // ---------------------------------------------------------------

  // TODO: Check if the entries table is empty. If it is, insert 3 sample
  // entries with cat names. (Marjorie, Felix, and Whiskers are ready for
  // their journal debut.) (Hint: db.exec("SELECT COUNT(*) FROM entries")
  // to check, then db.run an INSERT for each entry.)

  // Save so a brand-new database (with its table and seed data) lands on disk.
  saveDatabase(db);

  return db;
}

// Export the setup function and the save helper so server.js can use them.
module.exports = { initDatabase, saveDatabase };

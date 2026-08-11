// database.js — the database layer for the Cat Journal API.
// Connects to a local SQLite file, creates the entries table,
// and seeds it with sample data if the table is empty.

const Database = require("better-sqlite3");

// Connect to (or create) the journal.db file in the project folder.
const db = new Database("journal.db");

// ---------------------------------------------------------------
// Create the table
// ---------------------------------------------------------------

// TODO: Create a table called entries with columns: id (integer, primary key,
// autoincrement), title (text, not null), text (text), date (text, default
// current date)

// ---------------------------------------------------------------
// Seed the table
// ---------------------------------------------------------------

// TODO: Check if the entries table is empty. If it is, insert 3 sample
// entries with cat names. (Marjorie, Felix, and Whiskers are ready for
// their journal debut.)

// Export the database instance so server.js can run queries against it.
module.exports = db;

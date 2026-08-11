# Cat Journal API (Express + SQLite)

A journal API for logging your cats' daily adventures, built with Express and SQLite. This project upgrades from in-memory storage to a real database that persists data between restarts.

It uses [sql.js](https://sql.js.org), a pure-JavaScript build of SQLite — no native compilation, no build tools, no extra setup. It works the same on Windows, Mac, and Linux.

## Getting Started

1. Clone the repository

```
git clone https://github.com/clydebankmedia/express-sqlite-sample-app.git
cd express-sqlite-sample-app
```

2. Install dependencies

```
npm install
```

3. Start the server

```
node server.js
```

Express API → http://localhost:5000

You can test the routes using Thunder Client in VS Code, Postman, or curl.

## Project Structure

```
├── server.js      Express server with routes and middleware
├── database.js    SQLite connection, table creation, and seed data
├── package.json   Dependencies and scripts
├── .gitignore     Ignores node_modules and the database file
└── README.md      You are here
```

- `server.js` — the Express server. It defines REST routes that talk to the SQLite database: `GET /entries`, `POST /entries`, `PUT /entries/:id`, and `DELETE /entries/:id`.
- `database.js` — the database layer. It loads a local SQLite file (`journal.db`) with sql.js, creates the entries table, seeds it with sample data if the table is empty, and saves the database back to disk after every change.

## What You'll Build

The server structure is done — the imports, middleware, route definitions, and database connection are all in place. Your job is to write the code that makes the database and routes actually work:

1. **Create the table** — write the SQL statement that creates the entries table with id, title, text, and date columns. (`database.js`)
2. **Seed the data** — check if the table is empty and insert 3 sample entries if it is. (`database.js`)
3. **GET /entries** — use `db.prepare` and `stmt.getAsObject` to SELECT all entries and return them as JSON. (`server.js`)
4. **POST /entries** — use `db.run` to INSERT a new entry with the title and text from the request body, then save the database to disk. (`server.js`)
5. **DELETE /entries/:id** — use `db.run` to DELETE an entry by id, save the database to disk, and return a confirmation. (`server.js`)

The PUT route is already written as a reference so you can see the pattern.

Each spot is marked with a `TODO` comment telling you exactly what to do.

## Testing the API

Once the server is running, try these requests:

**Get all entries**

```
GET http://localhost:5000/entries
```

**Add a new entry**

```
POST http://localhost:5000/entries
Content-Type: application/json

{ "title": "Nap Report", "text": "Marjorie napped for 6 hours straight" }
```

**Update an entry**

```
PUT http://localhost:5000/entries/1
Content-Type: application/json

{ "title": "Updated Title", "text": "Updated text" }
```

**Delete an entry**

```
DELETE http://localhost:5000/entries/1
```

## Branches

- `main` — the starter project with TODOs (you are here)
- `completed` — the finished app with all TODOs implemented, if you want to peek at the solution

## QuickStart Guides Academy

This project is part of the QuickStart Guides Academy curriculum.
Learn more at [quickstartguides.com](https://quickstartguides.com)

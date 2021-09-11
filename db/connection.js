const dotenv = require("dotenv").config();
const mysql = require("mysql2");

// Connect to database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DB,
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Successfully connected to database!");
});

module.exports = db;

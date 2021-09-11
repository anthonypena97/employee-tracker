const mysql = require("mysql2");
const dotenv = require("dotenv").config();

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // Your MySQL username,
    user: "root",
    // Your MySQL password
    password: "Antpen97!",
    database: "election",
  },
  console.log("Connected to the election database")
);

module.exports = db;

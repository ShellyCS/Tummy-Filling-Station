// Accessing Express
const express = require("express");
const mysql = require("mysql");
// To handle cross platform we gona use cors
const cors = require("cors");
// For environmental variable we are going to use dotenv package
require("dotenv").config();
const app = express();
app.use(cors());

const db = mysql.createConnection({
  host: process.env.HOSTNAME || "localhost",
  user: process.env.USER || "root",
  password: process.env.PASSWORD || "1234",
  database: process.env.DATABASE || "food_db",
});

console.log("Connected to MySQL database:", db.config.database);

app.get("/", (req, res) => {
  return res.json("From backend");
});

db.query("SELECT DATABASE()", (error, results) => {
  if (error) {
    console.error("Error fetching current database:", error);
    return;
  }
  console.log("Connected to MySQL database:", results[0]["DATABASE()"]);
});

app.get("/restaurants", (req, res) => {
  // Query to fetch data from the food table
  db.query("SELECT * FROM Restaurants", (error, results, fields) => {
    if (error) {
      console.error("Error fetching food data:", error);
      res.status(500).json({ error: "Internal server error!" });
      return;
    }
    res.json(results);
  });
});

app.listen(8081, () => {
  console.log("listening...");
});

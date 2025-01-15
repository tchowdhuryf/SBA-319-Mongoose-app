require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const conn = require("./config/db");
conn();

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname, "/index.html");
});

app.listen(port, () => {
  console.log(`Trivia app running at http://localhost:${port}`);
});

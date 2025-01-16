require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const conn = require("./config/db");
conn();
const Question = require("./models/question");
const questionsSeed = require("./config/questionsSeed");

app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname, "/index.html");
});

app.get("/questions/seed", async (req, res) => {
  try {
    await Question.deleteMany({});
    await Question.create(questionsSeed)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error(error);
      });

    res.json(questionsSeed);
  } catch (error) {
    console.log(
      `Something went wrong with loading seed data: ${error.message}`
    );
  }
});

app.listen(port, () => {
  console.log(`Trivia app running at http://localhost:${port}`);
});

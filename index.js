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

const seedDatabase = async () => {
  try {
    await Question.deleteMany({});
    console.log("Existing data cleared.");

    const categories = Object.keys(questionsSeed.categories).map(
      (categoryName) => ({
        name: categoryName,
        questions: questionsSeed.categories[categoryName],
      })
    );

    const question = new Question({ categories });
    await question.save();
    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
};

// Run the seed script
seedDatabase();

app.listen(port, () => {
  console.log(`Trivia app running at http://localhost:${port}`);
});

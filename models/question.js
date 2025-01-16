const mongoose = require("mongoose");

// Question Schema
const QuestionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
});

// Category Schema
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  questions: { type: [QuestionSchema], required: true },
});

// Main Schema
const MainSchema = new mongoose.Schema({
  categories: { type: [CategorySchema], required: true },
});

// Model linked explicitly to the "questions" collection
module.exports = mongoose.model("Question", MainSchema, "questions");


// const Question = mongoose.model("Question", QuestionSchema, "questions");
// const Category = mongoose.model("Category", CategorySchema, "questions");
// const Main = mongoose.model("Main", MainSchema, "questions");

// module.exports = { Question, Category, Main };
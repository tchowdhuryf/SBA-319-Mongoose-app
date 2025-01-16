const mongoose = require("mongoose");

//Question schema
const QuestionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
});

//Category schema
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  questions: { type: [QuestionSchema], required: true },
});

const TriviaSchema = new mongoose.Schema({
  categories: {
    type: [CategorySchema],
    required: true,
  },
});

const Trivia = mongoose.model("Trivia", TriviaSchema);

module.exports = Trivia;

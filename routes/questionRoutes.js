const express = require("express");
const router = express.Router();
const Question = require("../models/question"); // Ensure path is correct

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: err.message || "An unexpected error occurred" });
});

// Fetch all categories
router.get("/categories", async (req, res, next) => {
  try {
    const questionData = await Question.findOne();
    if (!questionData) {
      return res.status(404).json({ error: "No data found" });
    }

    const categories = questionData.categories.map((cat) => cat.name);
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// Filter questions by category
router.get("/questions/:category", async (req, res, next) => {
  const { category } = req.params;

  try {
    const questionData = await Question.findOne({
      "categories.name": category,
    });

    if (!questionData) {
      return res.status(404).json({ error: "Category not found" });
    }

    const selectedCategory = questionData.categories.find(
      (cat) => cat.name === category
    );
    if (!selectedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(selectedCategory.questions);
  } catch (error) {
    next(error);
  }
});

// Fetch a single question by ID
router.get("/questions/:category/:id", async (req, res, next) => {
  const { category, id } = req.params;

  try {
    const questionData = await Question.findOne({
      "categories.name": category,
    });

    if (!questionData) {
      return res.status(404).json({ error: "Category not found" });
    }

    const selectedCategory = questionData.categories.find(
      (cat) => cat.name === category
    );

    if (!selectedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    const selectedQuestion = selectedCategory.questions.find(
      (question) => question.id === Number(id)
    );

    if (!selectedQuestion) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(selectedQuestion);
  } catch (error) {
    next(error);
  }
});

//POST ROUTE
router.post("/questions/:category", async (req, res, next) => {
  const { category } = req.params;
  const { question, options, answer } = req.body;

  try {
    const questionData = await Question.findOne({
      "categories.name": category,
    });

    if (!questionData) {
      return res.status(404).json({ error: "Category not found" });
    }

    const selectedCategory = questionData.categories.find(
      (cat) => cat.name === category
    );

    if (!selectedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    const newQuestion = {
      id: selectedCategory.questions.length + 1,
      question,
      options,
      answer,
    };

    selectedCategory.questions.push(newQuestion);
    await questionData.save();

    res.json(newQuestion);
  } catch (error) {
    next(error);
  }
});

//DELETE ROUTE
router.delete("/questions/:category/:id", async (req, res, next) => {
  const { category, id } = req.params;

  try {
    const questionData = await Question.findOne({
      "categories.name": category,
    });

    if (!questionData) {
      return res.status(404).json({ error: "Category not found" });
    }

    const selectedCategory = questionData.categories.find(
      (cat) => cat.name === category
    );

    if (!selectedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    const selectedQuestionIndex = selectedCategory.questions.findIndex(
      (question) => question.id === Number(id)
    );

    if (selectedQuestionIndex === -1) {
      return res.status(404).json({ error: "Question not found" });
    }

    selectedCategory.questions.splice(selectedQuestionIndex, 1);
    await questionData.save();

    res.json({ message: "Question deleted" });
  } catch (error) {
    next(error);
  }
});

router.patch("/questions/:category/:id", async (req, res) => {
  const { category, id } = req.params;
  const { question, options, answer } = req.body;

  const questionData = await Question.findOne({ "categories.name": category });
  if (!questionData) {
    return res.status(404).json({ error: "Category not found" });
  }

  const selectedCategory = questionData.categories.find(
    (cat) => cat.name === category
  );
  if (!selectedCategory) {
    return res.status(404).json({ error: "Category not found" });
  }

  const selectedQuestion = selectedCategory.questions.find(
    (q) => q.id === Number(id)
  );
  if (!selectedQuestion) {
    return res.status(404).json({ error: "Question not found" });
  }

  // Update only the provided fields
  if (question !== undefined) selectedQuestion.question = question;
  if (options !== undefined) selectedQuestion.options = options;
  if (answer !== undefined) selectedQuestion.answer = answer;

  await questionData.save();

  res.status(200).json({
    message: "Question updated successfully",
    question: selectedQuestion,
  });
});

// PUT route: Replace an entire question object
router.put("/questions/:category/:id", async (req, res) => {
  const { category, id } = req.params;
  const { question, options, answer } = req.body;

  if (!question || !options || !answer) {
    return res
      .status(400)
      .json({ error: "All fields (question, options, answer) are required" });
  }

  const questionData = await Question.findOne({ "categories.name": category });
  if (!questionData) {
    return res.status(404).json({ error: "Category not found" });
  }

  const selectedCategory = questionData.categories.find(
    (cat) => cat.name === category
  );
  if (!selectedCategory) {
    return res.status(404).json({ error: "Category not found" });
  }

  const selectedQuestion = selectedCategory.questions.find(
    (q) => q.id === Number(id)
  );
  if (!selectedQuestion) {
    return res.status(404).json({ error: "Question not found" });
  }

  // Replace the entire question object
  selectedQuestion.question = question;
  selectedQuestion.options = options;
  selectedQuestion.answer = answer;

  await questionData.save();

  res.status(200).json({
    message: "Question replaced successfully",
    question: selectedQuestion,
  });
});

module.exports = router;

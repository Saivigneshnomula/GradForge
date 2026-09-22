const InterviewQuestion = require("../models/InterviewQuestion");
const getQuestions = async (req, res) => {
  try {
    const questions = await InterviewQuestion.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.json(questions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch interview questions",
      error: error.message,
    });
  }
};

const createQuestion = async (req, res) => {
  try {
    const {
      question,
      answer,
      category,
      difficulty,
      tags,
      isActive,
    } = req.body;

    if (!question || !answer || !category) {
      return res.status(400).json({
        message: "Question, answer and category are required",
      });
    }

    const newQuestion = await InterviewQuestion.create({
      question,
      answer,
      category,
      difficulty: difficulty || "Easy",
      tags: Array.isArray(tags) ? tags : [],
      isActive: isActive !== false,
      createdBy: req.userId,
    });

    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create question",
      error: error.message,
    });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const question = await InterviewQuestion.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update question",
      error: error.message,
    });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await InterviewQuestion.findByIdAndDelete(
      req.params.id
    );

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete question",
      error: error.message,
    });
  }
};

module.exports = {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
const express = require("express");

const {
  getInterviewQuestions,
} = require("../controllers/interviewController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/questions", protect, getInterviewQuestions);

module.exports = router;
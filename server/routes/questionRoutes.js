const express = require("express");

const {
  createQuestion,
  getQuestions,
  getQuestion,
  upvoteQuestion,
  createAnswer,
  getAnswers,
  upvoteAnswer,
  editAnswer,
  deleteAnswer,
} = require("../controllers/questionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   QUESTIONS
========================= */

router.get(
  "/",
  protect,
  getQuestions
);

router.post(
  "/",
  protect,
  createQuestion
);

router.get(
  "/:id",
  protect,
  getQuestion
);

router.post(
  "/:id/upvote",
  protect,
  upvoteQuestion
);

/* =========================
   ANSWERS
========================= */

router.get(
  "/:questionId/answers",
  protect,
  getAnswers
);

router.post(
  "/:questionId/answers",
  protect,
  createAnswer
);

router.post(
  "/answers/:id/upvote",
  protect,
  upvoteAnswer
);

router.put(
  "/answers/:id",
  protect,
  editAnswer
);

router.delete(
  "/answers/:id",
  protect,
  deleteAnswer
);

module.exports = router;
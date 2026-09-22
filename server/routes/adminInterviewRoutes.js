const express = require("express");

const {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/adminInterviewController");

const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", adminOnly, getQuestions);

router.post("/", adminOnly, createQuestion);

router.put("/:id", adminOnly, updateQuestion);

router.delete("/:id", adminOnly, deleteQuestion);

module.exports = router;
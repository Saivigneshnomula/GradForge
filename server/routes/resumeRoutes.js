const express = require("express");

const {
  getMyResume,
  saveResume,
} = require("../controllers/resumeController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMyResume);

router.put("/me", protect, saveResume);

module.exports = router;
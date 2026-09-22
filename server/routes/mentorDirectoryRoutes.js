const express = require("express");

const {
  getMentors,
} = require("../controllers/mentorDirectoryController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Mentor directory
router.get("/", protect, getMentors);

module.exports = router;
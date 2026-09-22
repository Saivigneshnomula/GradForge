const express = require("express");

const {
  createMentorApplication,
  getMyMentorApplication,
  updateMentorApplication,
} = require("../controllers/mentorApplicationController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Student submits mentor application
router.post("/", protect, createMentorApplication);

// Get logged-in user's application
router.get("/me", protect, getMyMentorApplication);

// Edit and resubmit rejected application
router.put("/me", protect, updateMentorApplication);

module.exports = router;

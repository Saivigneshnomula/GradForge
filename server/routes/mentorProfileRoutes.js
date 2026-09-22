const express = require("express");

const {
  getMyMentorProfile,
  updateMentorProfile,
} = require("../controllers/mentorProfileController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get logged-in mentor profile
router.get("/me", protect, getMyMentorProfile);

// Update logged-in mentor profile
router.put("/me", protect, updateMentorProfile);

module.exports = router;
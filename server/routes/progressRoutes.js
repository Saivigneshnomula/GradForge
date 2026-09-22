const express = require("express");

const {
  getProgress,
  completeTopic,
  uncompleteTopic,
} = require("../controllers/progressController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get progress
router.get("/:roadmapId", protect, getProgress);

// Complete topic
router.post(
  "/:roadmapId/topics/:topicId/complete",
  protect,
  completeTopic
);

// Uncomplete topic
router.delete(
  "/:roadmapId/topics/:topicId/complete",
  protect,
  uncompleteTopic
);

module.exports = router;
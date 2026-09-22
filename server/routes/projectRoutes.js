const express = require("express");

const {
  createProject,
  getProjects,
  getProject,
  getMyProjects,
  toggleProjectLike,
  toggleProjectBookmark,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Project discovery
router.get("/", protect, getProjects);
router.get("/my", protect, getMyProjects);
router.get("/:id", protect, getProject);

// Project contribution
router.post("/", protect, createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

// Project interactions
router.post("/:id/like", protect, toggleProjectLike);
router.post("/:id/bookmark", protect, toggleProjectBookmark);

module.exports = router;
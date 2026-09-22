const express = require("express");

const {
  createPost,
  getPosts,
  getPost,
  upvotePost,
  deletePost,
} = require("../controllers/communityController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getPosts);

router.get("/:id", protect, getPost);

router.post("/", protect, createPost);

router.post("/:id/upvote", protect, upvotePost);

router.delete("/:id", protect, deletePost);

module.exports = router;
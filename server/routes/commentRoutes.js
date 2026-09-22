const express = require("express");

const {
  createComment,
  getComments,
  deleteComment,
} = require("../controllers/commentController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

/* GET COMMENTS */
router.get("/:postId", protect, getComments);

/* CREATE COMMENT */
router.post("/:postId", protect, createComment);

/* DELETE OWN COMMENT */
router.delete("/:commentId", protect, deleteComment);

module.exports = router;
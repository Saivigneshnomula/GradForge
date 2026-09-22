const CommunityComment = require("../models/CommunityComment");
const CommunityPost = require("../models/CommunityPost");

/* =========================
   CREATE COMMENT / REPLY
========================= */
const createComment = async (req, res) => {
  try {
    const { content, parentComment } = req.body;
    const { postId } = req.params;

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Comment content is required",
      });
    }

    const post = await CommunityPost.findOne({
      _id: postId,
      isApproved: true,
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // If this is a reply, make sure parent comment exists
    if (parentComment) {
      const parent = await CommunityComment.findOne({
        _id: parentComment,
        post: postId,
      });

      if (!parent) {
        return res.status(404).json({
          message: "Parent comment not found",
        });
      }
    }

    const comment = await CommunityComment.create({
      post: postId,
      author: req.userId,
      content: content.trim(),
      parentComment: parentComment || null,
    });

    // Increase total comment count
    // Both comments and replies count
    await CommunityPost.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 },
    });

    const populatedComment =
      await CommunityComment.findById(comment._id).populate(
        "author",
        "name"
      );

    res.status(201).json({
      message: parentComment
        ? "Reply added successfully"
        : "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create comment",
    });
  }
};

/* =========================
   GET COMMENTS
========================= */
const getComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await CommunityComment.find({
      post: postId,
    })
      .populate("author", "name")
      .sort({ createdAt: 1 });

    res.json({
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch comments",
    });
  }
};

/* =========================
   DELETE OWN COMMENT
========================= */
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await CommunityComment.findById(
      commentId
    );

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (
      comment.author.toString() !==
      req.userId.toString()
    ) {
      return res.status(403).json({
        message: "You can only delete your own comments",
      });
    }

    // Find replies to this comment
    const replies = await CommunityComment.find({
      parentComment: commentId,
    });

    // Delete replies first
    await CommunityComment.deleteMany({
      parentComment: commentId,
    });

    // Delete parent comment
    await comment.deleteOne();

    // Decrease by parent + replies
    const deletedCount = 1 + replies.length;

    await CommunityPost.findByIdAndUpdate(comment.post, {
      $inc: {
        commentsCount: -deletedCount,
      },
    });

    res.json({
      message: "Comment deleted successfully",
      deletedCount,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete comment",
    });
  }
};

module.exports = {
  createComment,
  getComments,
  deleteComment,
};
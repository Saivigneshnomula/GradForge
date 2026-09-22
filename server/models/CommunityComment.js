const mongoose = require("mongoose");

const communityCommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityPost",
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    // null = normal comment
    // comment ID = reply to that comment
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityComment",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "CommunityComment",
  communityCommentSchema
);
const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    roadmap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true,
    },

    completedTopics: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// One progress document per user per roadmap
userProgressSchema.index(
  { user: 1, roadmap: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "UserProgress",
  userProgressSchema
);

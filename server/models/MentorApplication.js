const mongoose = require("mongoose");

const mentorApplicationSchema = new mongoose.Schema(
  {
    // ==========================================
    // STUDENT WHO IS APPLYING
    // ==========================================

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // ==========================================
    // PROFESSIONAL INFORMATION
    // ==========================================

    designation: {
      type: String,
      trim: true,
      required: true,
      maxlength: 150,
    },

    company: {
      type: String,
      trim: true,
      required: true,
      maxlength: 150,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    // ==========================================
    // MENTOR EXPERTISE
    // ==========================================

    expertise: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    mentoringAreas: {
      type: [String],
      default: [],
    },

    // ==========================================
    // ABOUT THE MENTOR
    // ==========================================

    bio: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
    },

    linkedinProfile: {
      type: String,
      trim: true,
      default: "",
    },

    githubProfile: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================
    // APPLICATION STATUS
    // ==========================================

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================
    // ADMIN REVIEW
    // ==========================================

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "MentorApplication",
  mentorApplicationSchema
);

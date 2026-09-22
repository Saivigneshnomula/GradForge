const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    personal: {
      name: { type: String, default: "" },
      email: { type: String, default: "" },
      mobile: { type: String, default: "" },
      location: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      summary: { type: String, default: "" },
    },

    education: [
      {
        institution: { type: String, default: "" },
        degree: { type: String, default: "" },
        fieldOfStudy: { type: String, default: "" },
        startYear: { type: String, default: "" },
        endYear: { type: String, default: "" },
      },
    ],

    skills: {
      type: [String],
      default: [],
    },

    projects: [
      {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        technologies: { type: [String], default: [] },
        githubUrl: { type: String, default: "" },
        liveDemoUrl: { type: String, default: "" },
      },
    ],

    experience: [
      {
        company: { type: String, default: "" },
        role: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],

    certifications: [
      {
        name: { type: String, default: "" },
        issuer: { type: String, default: "" },
        issueDate: { type: String, default: "" },
        credentialUrl: { type: String, default: "" },
      },
    ],

    achievements: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);
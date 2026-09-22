const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      default: "",
      trim: true,
    },

   type: {
  type: String,
  enum: ["job", "interview", "hackathon"],
  required: true,
},

    location: {
      type: String,
      default: "India",
    },

    mode: {
      type: String,
      enum: ["Remote", "On-site", "Hybrid", "Online", "Unknown"],
      default: "Unknown",
    },

    description: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    themes: {
      type: [String],
      default: [],
    },

    relatedIdeas: {
      type: [String],
      default: [],
    },

    deadline: {
      type: Date,
      default: null,
    },

    applicationUrl: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      default: "",
    },

    sourceUrl: {
      type: String,
      default: "",
    },

    salary: {
      type: String,
      default: "",
    },

    prize: {
      type: String,
      default: "",
    },

    companyLogo: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    externalId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

opportunitySchema.index({
  type: 1,
  deadline: 1,
});

opportunitySchema.index({
  title: "text",
  company: "text",
  description: "text",
  skills: "text",
});

module.exports = mongoose.model(
  "Opportunity",
  opportunitySchema
);
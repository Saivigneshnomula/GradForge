const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    // Project title
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    // Short/long project description
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    // Main technology / stack
    technology: {
      type: String,
      required: true,
      enum: [
        "MERN",
        "MEAN",
        "JavaFSD",
        "PythonFSD",
        "AI-ML",
        "Data Science",
        "DevOps",
        "VLSI",
        "Android",
        "Flutter",
        "IoT",
        "Mechanical",
        "Civil",
        "Other",
      ],
    },

    // Department
    department: {
      type: String,
      required: true,
      enum: [
        "CSE",
        "ECE",
        "EEE",
        "AIML",
        "EIE",
        "Mechanical",
        "Civil",
        "IT",
        "Other",
      ],
    },

    // Project difficulty
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    // Type of project
    projectType: {
      type: String,
      enum: [
        "Mini Project",
        "Major Project",
        "Academic Project",
        "Personal Project",
        "Hackathon Project",
        "Research Project",
        "Other",
      ],
      default: "Personal Project",
    },

    // Technologies used in the project
    techStack: {
      type: [String],
      default: [],
    },

    // Search/discovery tags
    tags: {
      type: [String],
      default: [],
    },

    // GitHub repository
    repositoryUrl: {
      type: String,
      trim: true,
    },

    // Specific branch if applicable
    branch: {
      type: String,
      trim: true,
      default: "main",
    },

    // Live deployed project
    demoUrl: {
      type: String,
      trim: true,
    },

    // Project documentation URL
    documentationUrl: {
      type: String,
      trim: true,
    },

    // Official GradForge repository or student project
    sourceType: {
      type: String,
      enum: ["official", "student"],
      default: "student",
    },

    // For official GradForge projects
    officialRepository: {
      type: String,
      trim: true,
    },

    // Student who submitted/contributed the project
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Admin who approved the project
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Admin approval time
    approvedAt: {
      type: Date,
      default: null,
    },

    // Project moderation status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // Reason when admin rejects
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    // Project screenshots for future storage
    screenshots: {
      type: [String],
      default: [],
    },

    // Users who liked the project
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Users who bookmarked the project
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Number of project views
   views: {
  type: Number,
  default: 0,
},

viewedBy: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],
    // Students collaborating on the project
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Whether admin has featured this project
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
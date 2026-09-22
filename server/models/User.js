const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      trim: true,
    },

    degree: {
      type: String,
      trim: true,
    },

    fieldOfStudy: {
      type: String,
      trim: true,
    },

    startYear: {
      type: Number,
    },

    endYear: {
      type: Number,
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    technologies: {
      type: [String],
      default: [],
    },

    githubUrl: {
      type: String,
      trim: true,
      default: "",
    },

    liveDemoUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: true }
);

const certificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    issuer: {
      type: String,
      trim: true,
    },

    issueDate: {
      type: String,
      trim: true,
    },

    credentialUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: true }
);

// =========================
// MENTOR PROFILE
// =========================

const mentorProfileSchema = new mongoose.Schema(
  {
    designation: {
      type: String,
      trim: true,
      default: "",
      maxlength: 150,
    },

    company: {
      type: String,
      trim: true,
      default: "",
      maxlength: 150,
    },

    experience: {
      type: Number,
      min: 0,
      default: 0,
    },

    expertise: {
      type: [String],
      default: [],
    },

    mentoringAreas: {
      type: [String],
      default: [],
    },

    bio: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isProfileVisible: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    // =========================
    // BASIC INFORMATION
    // =========================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    // =========================
    // ROLE
    // =========================

    role: {
      type: String,
      enum: ["student", "mentor", "admin"],
      default: "student",
    },

    // =========================
    // SOCIAL PROFILES
    // =========================

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

    // =========================
    // EDUCATION
    // =========================

    education: {
      type: educationSchema,
      default: null,
    },

    // =========================
    // SKILLS & INTERESTS
    // =========================

    skills: {
      type: [String],
      default: [],
    },

    interests: {
      type: [String],
      default: [],
    },

    careerGoals: {
      type: [String],
      default: [],
    },

    // =========================
    // PROJECTS
    // =========================

    projects: {
      type: [projectSchema],
      default: [],
    },

    // =========================
    // ACHIEVEMENTS
    // =========================

    achievements: {
      type: [String],
      default: [],
    },

    // =========================
    // CERTIFICATIONS
    // =========================

    certifications: {
      type: [certificationSchema],
      default: [],
    },

    // =========================
    // CONTRIBUTIONS
    // =========================

    contributions: {
      type: [String],
      default: [],
    },

    // =========================
    // MENTOR PROFILE
    // =========================

    mentorProfile: {
      type: mentorProfileSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
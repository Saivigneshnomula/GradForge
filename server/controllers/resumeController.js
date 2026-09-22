const Resume = require("../models/Resume");
const User = require("../models/User");

// =========================
// GET MY RESUME
// =========================

const getMyResume = async (req, res) => {
  try {
    let resume = await Resume.findOne({
      user: req.userId,
    });

    // Automatically create initial resume from profile
    if (!resume) {
      const user = await User.findById(req.userId).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      resume = await Resume.create({
        user: user._id,

        personal: {
          name: user.name || "",
          email: user.email || "",
          mobile: user.mobile || "",
          linkedin: user.linkedinProfile || "",
          github: user.githubProfile || "",
        },

        education: user.education
          ? [
              {
                institution: user.education.institution || "",
                degree: user.education.degree || "",
                fieldOfStudy: user.education.fieldOfStudy || "",
                startYear: user.education.startYear || "",
                endYear: user.education.endYear || "",
              },
            ]
          : [],

        skills: user.skills || [],

        projects: user.projects || [],

        certifications: user.certifications || [],

        achievements: user.achievements || [],
      });
    }

    res.status(200).json({
      resume,
    });
  } catch (error) {
    console.error("Get resume error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// SAVE RESUME
// =========================

const saveResume = async (req, res) => {
  try {
    const {
      personal,
      education,
      skills,
      projects,
      experience,
      certifications,
      achievements,
    } = req.body;

    const resume = await Resume.findOneAndUpdate(
      { user: req.userId },
      {
        user: req.userId,
        personal,
        education,
        skills,
        projects,
        experience,
        certifications,
        achievements,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Resume saved successfully",
      resume,
    });
  } catch (error) {
    console.error("Save resume error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getMyResume,
  saveResume,
};
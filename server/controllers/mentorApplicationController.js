const MentorApplication = require("../models/MentorApplication");
const User = require("../models/User");

// ==========================================
// SUBMIT MENTOR APPLICATION
// ==========================================

const createMentorApplication = async (req, res) => {
  try {
    const {
      designation,
      company,
      experience,
      expertise,
      skills,
      mentoringAreas,
      bio,
      linkedinProfile,
      githubProfile,
    } = req.body;

    // Only students can apply
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "student") {
      return res.status(403).json({
        message: "Only students can apply to become mentors",
      });
    }

    // Check required fields
    if (
      !designation ||
      !company ||
      experience === undefined ||
      !bio
    ) {
      return res.status(400).json({
        message:
          "Designation, company, experience and bio are required",
      });
    }

    // Check whether an application already exists
    const existingApplication = await MentorApplication.findOne({
      applicant: req.userId,
    });

    if (existingApplication) {
      return res.status(409).json({
        message: "You have already submitted a mentor application",
        status: existingApplication.status,
      });
    }

    // Create application
    const application = await MentorApplication.create({
      applicant: req.userId,
      designation,
      company,
      experience,
      expertise: Array.isArray(expertise) ? expertise : [],
      skills: Array.isArray(skills) ? skills : [],
      mentoringAreas: Array.isArray(mentoringAreas)
        ? mentoringAreas
        : [],
      bio,
      linkedinProfile: linkedinProfile || "",
      githubProfile: githubProfile || "",
      status: "pending",
    });

    res.status(201).json({
      message: "Mentor application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Create mentor application error:", error);

    res.status(500).json({
      message: "Server error while submitting mentor application",
    });
  }
};

// ==========================================
// GET MY MENTOR APPLICATION
// ==========================================

const getMyMentorApplication = async (req, res) => {
  try {
    const application = await MentorApplication.findOne({
      applicant: req.userId,
    }).populate("applicant", "name email profilePhoto role");

    if (!application) {
      return res.status(404).json({
        message: "No mentor application found",
      });
    }

    res.status(200).json({
      application,
    });
  } catch (error) {
    console.error("Get mentor application error:", error);

    res.status(500).json({
      message: "Server error while fetching mentor application",
    });
  }
};

// ==========================================
// UPDATE MY MENTOR APPLICATION
// ==========================================

const updateMentorApplication = async (req, res) => {
  try {
    const application = await MentorApplication.findOne({
      applicant: req.userId,
    });

    if (!application) {
      return res.status(404).json({
        message: "Mentor application not found",
      });
    }

    // Only rejected applications can be edited/resubmitted
    if (application.status !== "rejected") {
      return res.status(400).json({
        message:
          "Only rejected mentor applications can be edited and resubmitted",
      });
    }

    const {
      designation,
      company,
      experience,
      expertise,
      skills,
      mentoringAreas,
      bio,
      linkedinProfile,
      githubProfile,
    } = req.body;

    // Update fields
    if (designation !== undefined) {
      application.designation = designation;
    }

    if (company !== undefined) {
      application.company = company;
    }

    if (experience !== undefined) {
      application.experience = experience;
    }

    if (expertise !== undefined) {
      application.expertise = Array.isArray(expertise)
        ? expertise
        : [];
    }

    if (skills !== undefined) {
      application.skills = Array.isArray(skills) ? skills : [];
    }

    if (mentoringAreas !== undefined) {
      application.mentoringAreas = Array.isArray(mentoringAreas)
        ? mentoringAreas
        : [];
    }

    if (bio !== undefined) {
      application.bio = bio;
    }

    if (linkedinProfile !== undefined) {
      application.linkedinProfile = linkedinProfile;
    }

    if (githubProfile !== undefined) {
      application.githubProfile = githubProfile;
    }

    // Resubmit for review
    application.status = "pending";
    application.rejectionReason = "";
    application.reviewedBy = null;
    application.reviewedAt = null;

    await application.save();

    res.status(200).json({
      message: "Mentor application resubmitted successfully",
      application,
    });
  } catch (error) {
    console.error("Update mentor application error:", error);

    res.status(500).json({
      message: "Server error while updating mentor application",
    });
  }
};

module.exports = {
  createMentorApplication,
  getMyMentorApplication,
  updateMentorApplication,
};

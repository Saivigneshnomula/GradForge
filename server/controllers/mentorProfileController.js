const User = require("../models/User");

// =========================
// GET MY MENTOR PROFILE
// =========================

const getMyMentorProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "mentor") {
      return res.status(403).json({
        message: "Only mentors can access mentor profile",
      });
    }

    res.status(200).json({
      mentor: user,
    });
  } catch (error) {
    console.error("Get mentor profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// UPDATE MY MENTOR PROFILE
// =========================

const updateMentorProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "mentor") {
      return res.status(403).json({
        message: "Only mentors can update mentor profile",
      });
    }

    const {
      designation,
      company,
      experience,
      expertise,
      mentoringAreas,
      bio,
      isAvailable,
    } = req.body;

    // =========================
    // UPDATE BASIC MENTOR INFO
    // =========================

    if (designation !== undefined) {
      user.mentorProfile.designation = designation;
    }

    if (company !== undefined) {
      user.mentorProfile.company = company;
    }

    if (experience !== undefined) {
      user.mentorProfile.experience = experience;
    }

    if (expertise !== undefined) {
      user.mentorProfile.expertise = expertise;
    }

    if (mentoringAreas !== undefined) {
      user.mentorProfile.mentoringAreas = mentoringAreas;
    }

    if (bio !== undefined) {
      user.mentorProfile.bio = bio;
    }

    if (isAvailable !== undefined) {
      user.mentorProfile.isAvailable = isAvailable;
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password");

    res.status(200).json({
      message: "Mentor profile updated successfully",
      mentor: updatedUser,
    });
  } catch (error) {
    console.error("Update mentor profile error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getMyMentorProfile,
  updateMentorProfile,
};
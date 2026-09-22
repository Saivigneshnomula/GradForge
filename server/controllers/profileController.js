const User = require("../models/User");

// =========================
// GET MY PROFILE
// =========================

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

// =========================
// UPDATE MY PROFILE
// =========================

const updateProfile = async (req, res) => {
  try {
    const {
      name,
      mobile,
      profilePhoto,
      linkedinProfile,
      githubProfile,
      education,
      skills,
      interests,
      careerGoals,
      projects,
      achievements,
      certifications,
      contributions,
    } = req.body;

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name !== undefined) user.name = name;
    if (mobile !== undefined) user.mobile = mobile;
    if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;

    if (linkedinProfile !== undefined) {
      user.linkedinProfile = linkedinProfile;
    }

    if (githubProfile !== undefined) {
      user.githubProfile = githubProfile;
    }

    if (education !== undefined) {
      user.education = education;
    }

    if (skills !== undefined) {
      user.skills = skills;
    }

    if (interests !== undefined) {
      user.interests = interests;
    }

    if (careerGoals !== undefined) {
      user.careerGoals = careerGoals;
    }

    if (projects !== undefined) {
      user.projects = projects;
    }

    if (achievements !== undefined) {
      user.achievements = achievements;
    }

    if (certifications !== undefined) {
      user.certifications = certifications;
    }

    if (contributions !== undefined) {
      user.contributions = contributions;
    }

    await user.save();

    const updatedUser = await User.findById(req.userId).select(
      "-password"
    );

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
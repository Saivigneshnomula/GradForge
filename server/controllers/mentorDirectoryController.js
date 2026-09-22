const User = require("../models/User");

// =========================
// GET MENTOR DIRECTORY
// =========================

const getMentors = async (req, res) => {
  try {
    const {
      search = "",
      expertise = "",
      mentoringArea = "",
    } = req.query;

    const query = {
      role: "mentor",
      "mentorProfile.isProfileVisible": true,
    };

    // =========================
    // SEARCH
    // =========================

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");

      query.$or = [
        { name: searchRegex },
        { "mentorProfile.designation": searchRegex },
        { "mentorProfile.company": searchRegex },
        { "mentorProfile.expertise": searchRegex },
        { "mentorProfile.mentoringAreas": searchRegex },
      ];
    }

    // =========================
    // EXPERTISE FILTER
    // =========================

    if (expertise.trim()) {
      query["mentorProfile.expertise"] = {
        $regex: expertise.trim(),
        $options: "i",
      };
    }

    // =========================
    // MENTORING AREA FILTER
    // =========================

    if (mentoringArea.trim()) {
      query["mentorProfile.mentoringAreas"] = {
        $regex: mentoringArea.trim(),
        $options: "i",
      };
    }

    const mentors = await User.find(query)
      .select(
        "name profilePhoto linkedinProfile githubProfile skills mentorProfile"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: mentors.length,
      mentors,
    });
  } catch (error) {
    console.error("Get mentors error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getMentors,
};
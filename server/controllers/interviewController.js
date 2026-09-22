const InterviewQuestion = require("../models/InterviewQuestion");

// ==========================================
// GET INTERVIEW QUESTIONS
// ==========================================

const getInterviewQuestions = async (req, res) => {
  try {
    const {
      category,
      difficulty,
      search,
    } = req.query;

    const filter = {
      isActive: true,
    };

    if (category && category !== "All") {
      filter.category = category;
    }

    if (difficulty && difficulty !== "All") {
      filter.difficulty = difficulty;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(
        search.trim(),
        "i"
      );

      filter.$or = [
        {
          question: searchRegex,
        },
        {
          tags: searchRegex,
        },
      ];
    }

    const questions = await InterviewQuestion.find(filter)
      .select("-createdBy")
      .sort({
        category: 1,
        difficulty: 1,
        createdAt: -1,
      });

    res.status(200).json(questions);
  } catch (error) {
    console.error(
      "Interview questions error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch interview questions",
    });
  }
};

// ==========================================
// GET SINGLE INTERVIEW QUESTION
// ==========================================

const getInterviewQuestion = async (req, res) => {
  try {
    const question =
      await InterviewQuestion.findOne({
        _id: req.params.id,
        isActive: true,
      }).select("-createdBy");

    if (!question) {
      return res.status(404).json({
        message: "Interview question not found",
      });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error(
      "Interview question error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch interview question",
    });
  }
};

module.exports = {
  getInterviewQuestions,
  getInterviewQuestion,
};
const UserProgress = require("../models/UserProgress");
const Roadmap = require("../models/Roadmap");

// Get user's progress for a roadmap
const getProgress = async (req, res) => {
  try {
    const { roadmapId } = req.params;

    // Make sure roadmap exists
    const roadmap = await Roadmap.findById(roadmapId);

    if (!roadmap) {
      return res.status(404).json({
        message: "Roadmap not found",
      });
    }

    let progress = await UserProgress.findOne({
      user: req.userId,
      roadmap: roadmapId,
    });

    // Create progress if it doesn't exist
    if (!progress) {
      progress = await UserProgress.create({
        user: req.userId,
        roadmap: roadmapId,
        completedTopics: [],
      });
    }

    // Count total topics
    const totalTopics = roadmap.modules.reduce(
      (total, module) => total + module.topics.length,
      0
    );

    const completedTopics = progress.completedTopics.length;

    const percentage =
      totalTopics === 0
        ? 0
        : Math.round((completedTopics / totalTopics) * 100);

    res.status(200).json({
      roadmapId,
      completedTopics: progress.completedTopics,
      totalTopics,
      percentage,
    });
   } catch (error) {
    console.error("Get progress error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Mark topic as completed
const completeTopic = async (req, res) => {
  try {
    const { roadmapId, topicId } = req.params;

    const roadmap = await Roadmap.findById(roadmapId);

    if (!roadmap) {
      return res.status(404).json({
        message: "Roadmap not found",
      });
    }

    // Check whether topic actually belongs to roadmap
    const topicExists = roadmap.modules.some((module) =>
      module.topics.some(
        (topic) => topic._id.toString() === topicId
      )
    );

    if (!topicExists) {
      return res.status(404).json({
        message: "Topic not found in this roadmap",
      });
    }

    let progress = await UserProgress.findOne({
      user: req.userId,
      roadmap: roadmapId,
    });

    if (!progress) {
      progress = await UserProgress.create({
        user: req.userId,
        roadmap: roadmapId,
        completedTopics: [],
      });
    }

    // Avoid duplicate completion
    const alreadyCompleted =
      progress.completedTopics.some(
        (id) => id.toString() === topicId
      );

    if (!alreadyCompleted) {
      progress.completedTopics.push(topicId);
      await progress.save();
    }

    res.status(200).json({
      message: "Topic marked as completed",
      completedTopics: progress.completedTopics,
    });
  } catch (error) {
    console.error("Complete topic error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Mark topic as incomplete
const uncompleteTopic = async (req, res) => {
  try {
    const { roadmapId, topicId } = req.params;

    const progress = await UserProgress.findOne({
      user: req.userId,
      roadmap: roadmapId,
    });

    if (!progress) {
      return res.status(404).json({
        message: "Progress not found",
      });
    }

    progress.completedTopics =
      progress.completedTopics.filter(
        (id) => id.toString() !== topicId
      );

    await progress.save();

    res.status(200).json({
      message: "Topic marked as incomplete",
      completedTopics: progress.completedTopics,
    });
  } catch (error) {
    console.error("Uncomplete topic error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getProgress,
  completeTopic,
  uncompleteTopic,
};
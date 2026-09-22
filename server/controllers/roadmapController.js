const Roadmap = require("../models/Roadmap");

// Create roadmap
const createRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.create(req.body);

    res.status(201).json({
      message: "Roadmap created successfully",
      roadmap,
    });
  } catch (error) {
    console.error("Create roadmap error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get all roadmaps
const getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      roadmaps,
    });
  } catch (error) {
    console.error("Get roadmaps error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// Get single roadmap
const getRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);

    if (!roadmap) {
      return res.status(404).json({
        message: "Roadmap not found",
      });
    }

    res.status(200).json({
      roadmap,
    });
  } catch (error) {
    console.error("Get roadmap error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createRoadmap,
  getRoadmaps,
  getRoadmap,
};
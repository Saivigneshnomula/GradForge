const Opportunity = require("../models/Opportunity");

const getOpportunities = async (req, res) => {
  try {
    const opportunities = await Opportunity.find()
      .sort({ createdAt: -1 });

    res.json(opportunities);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch opportunities",
      error: error.message,
    });
  }
};

const createOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.create({
      ...req.body,
      isActive: req.body.isActive !== false,
    });

    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create opportunity",
      error: error.message,
    });
  }
};

const updateOpportunity = async (req, res) => {
  try {
    const opportunity =
      await Opportunity.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!opportunity) {
      return res.status(404).json({
        message: "Opportunity not found",
      });
    }

    res.json(opportunity);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update opportunity",
      error: error.message,
    });
  }
};

const deleteOpportunity = async (req, res) => {
  try {
    const opportunity =
      await Opportunity.findByIdAndDelete(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        message: "Opportunity not found",
      });
    }

    res.json({
      message: "Opportunity deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete opportunity",
      error: error.message,
    });
  }
};

module.exports = {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};
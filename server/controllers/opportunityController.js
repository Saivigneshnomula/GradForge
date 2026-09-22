const Opportunity = require("../models/Opportunity");
const {
  syncOpportunities,
} = require("../services/opportunityService");

const getOpportunities = async (req, res) => {
  try {
    const {
      type,
      search,
      skill,
    } = req.query;

    const filter = {
      isActive: true,
    };

    if (type === "job" || type === "hackathon") {
      filter.type = type;
    }

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          company: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          skills: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (skill) {
      filter.skills = {
        $regex: skill,
        $options: "i",
      };
    }

    const opportunities =
      await Opportunity.find(filter)
        .sort({
          deadline: 1,
          createdAt: -1,
        })
        .limit(100);

    res.json(opportunities);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to load opportunities",
    });
  }
};

const getHotOpportunities = async (
  req,
  res
) => {
  try {
    const now = new Date();

    const next24Hours = new Date(
      now.getTime() +
        24 * 60 * 60 * 1000
    );

    const opportunities =
      await Opportunity.find({
        isActive: true,

        deadline: {
          $gt: now,
          $lte: next24Hours,
        },
      })
        .sort({
          deadline: 1,
        })
        .limit(5);

    res.json(opportunities);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to load hot opportunities",
    });
  }
};

const getOpportunity = async (
  req,
  res
) => {
  try {
    const opportunity =
      await Opportunity.findOne({
        _id: req.params.id,
        isActive: true,
      });

    if (!opportunity) {
      return res.status(404).json({
        message:
          "Opportunity not found",
      });
    }

    res.json(opportunity);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to load opportunity",
    });
  }
};

const refreshOpportunities = async (
  req,
  res
) => {
  try {
    const count =
      await syncOpportunities();

    res.json({
      message:
        "Opportunities refreshed successfully",
      count,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to refresh opportunities",
    });
  }
};

module.exports = {
  getOpportunities,
  getHotOpportunities,
  getOpportunity,
  refreshOpportunities,
};
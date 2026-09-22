const express = require("express");

const {
  getOpportunities,
  getHotOpportunities,
  getOpportunity,
  refreshOpportunities,
} = require("../controllers/opportunityController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  getOpportunities
);

router.get(
  "/hot",
  protect,
  getHotOpportunities
);

router.get(
  "/:id",
  protect,
  getOpportunity
);

router.post(
  "/refresh",
  protect,
  refreshOpportunities
);

module.exports = router;
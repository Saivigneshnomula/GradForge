const express = require("express");

const {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} = require("../controllers/adminOpportunityController");

const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", adminOnly, getOpportunities);

router.post("/", adminOnly, createOpportunity);

router.put("/:id", adminOnly, updateOpportunity);

router.delete("/:id", adminOnly, deleteOpportunity);

module.exports = router;
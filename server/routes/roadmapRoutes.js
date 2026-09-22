const express = require("express");

const {
  createRoadmap,
  getRoadmaps,
  getRoadmap,
} = require("../controllers/roadmapController");

const router = express.Router();

router.post("/", createRoadmap);
router.get("/", getRoadmaps);
router.get("/:id", getRoadmap);

module.exports = router;
const Project = require("../models/Project");

// ===============================
// CREATE PROJECT
// ===============================
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      technology,
      department,
      difficulty,
      projectType,
      techStack,
      tags,
      repositoryUrl,
      branch,
      demoUrl,
      documentationUrl,
    } = req.body;

    if (!title || !description || !technology || !department) {
      return res.status(400).json({
        message:
          "Title, description, technology and department are required",
      });
    }

    const project = await Project.create({
      title,
      description,
      technology,
      department,
      difficulty,
      projectType,
      techStack: Array.isArray(techStack) ? techStack : [],
      tags: Array.isArray(tags) ? tags : [],
      repositoryUrl,
      branch: branch || "main",
      demoUrl,
      documentationUrl,

      // Student submissions
      sourceType: "student",
      submittedBy: req.userId,

      // Every student contribution requires admin approval
      status: "pending",
    });

    const populatedProject = await Project.findById(project._id).populate(
      "submittedBy",
      "name email profilePhoto"
    );

    res.status(201).json({
      message: "Project submitted successfully for admin approval",
      project: populatedProject,
    });
  } catch (error) {
    console.error("Create project error:", error);

    res.status(500).json({
      message: "Server error while creating project",
    });
  }
};

// ===============================
// GET APPROVED PROJECTS
// ===============================
const getProjects = async (req, res) => {
  try {
    const {
      technology,
      department,
      difficulty,
      projectType,
      search,
      featured,
    } = req.query;

    const filter = {
      status: "approved",
    };

    if (technology) {
      filter.technology = technology;
    }

    if (department) {
      filter.department = department;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (projectType) {
      filter.projectType = projectType;
    }

    if (featured === "true") {
      filter.isFeatured = true;
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
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: search,
            $options: "i",
          },
        },
        {
          techStack: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const projects = await Project.find(filter)
      .populate("submittedBy", "name profilePhoto")
      .populate("collaborators", "name profilePhoto")
      .sort({
        isFeatured: -1,
        createdAt: -1,
      });

    res.status(200).json({
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      message: "Server error while fetching projects",
    });
  }
};

// ===============================
// GET SINGLE PROJECT
// ===============================
const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      status: "approved",
    })
      .populate("submittedBy", "name profilePhoto")
      .populate("collaborators", "name profilePhoto");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // ==========================================
    // UNIQUE VIEW COUNT
    // ==========================================
    // A logged-in user only counts once.
    const alreadyViewed = project.viewedBy.some(
      (userId) => userId.toString() === req.userId.toString()
    );

    if (!alreadyViewed) {
      project.viewedBy.push(req.userId);
      project.views += 1;

      await project.save();
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Get project error:", error);

    res.status(500).json({
      message: "Server error while fetching project",
    });
  }
};

// ===============================
// GET MY PROJECT SUBMISSIONS
// ===============================
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      submittedBy: req.userId,
    })
      .populate("approvedBy", "name")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Get my projects error:", error);

    res.status(500).json({
      message: "Server error while fetching your projects",
    });
  }
};

// ===============================
// LIKE / UNLIKE PROJECT
// ===============================
const toggleProjectLike = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      status: "approved",
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const userId = req.userId;

    const alreadyLiked = project.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      project.likes = project.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      project.likes.push(userId);
    }

    await project.save();

    res.status(200).json({
      message: alreadyLiked
        ? "Project unliked"
        : "Project liked",

      likesCount: project.likes.length,

      liked: !alreadyLiked,
    });
  } catch (error) {
    console.error("Toggle project like error:", error);

    res.status(500).json({
      message: "Server error while liking project",
    });
  }
};

// ===============================
// BOOKMARK / REMOVE BOOKMARK
// ===============================
const toggleProjectBookmark = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      status: "approved",
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const userId = req.userId;

    const alreadyBookmarked = project.bookmarks.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyBookmarked) {
      project.bookmarks = project.bookmarks.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      project.bookmarks.push(userId);
    }

    await project.save();

    res.status(200).json({
      message: alreadyBookmarked
        ? "Project removed from bookmarks"
        : "Project bookmarked",

      bookmarked: !alreadyBookmarked,

      bookmarksCount: project.bookmarks.length,
    });
  } catch (error) {
    console.error("Toggle project bookmark error:", error);

    res.status(500).json({
      message: "Server error while bookmarking project",
    });
  }
};

// ===============================
// UPDATE OWN PROJECT
// ===============================
const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      submittedBy: req.userId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Approved projects cannot be edited directly
    if (project.status === "approved") {
      return res.status(403).json({
        message:
          "Approved projects cannot be edited directly",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "technology",
      "department",
      "difficulty",
      "projectType",
      "techStack",
      "tags",
      "repositoryUrl",
      "branch",
      "demoUrl",
      "documentationUrl",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    // Rejected project edited by student
    // goes back to pending review.
    if (project.status === "rejected") {
      project.status = "pending";
      project.rejectionReason = "";
      project.approvedBy = null;
      project.approvedAt = null;
    }

    await project.save();

    res.status(200).json({
      message:
        "Project updated successfully and sent for review",
      project,
    });
  } catch (error) {
    console.error("Update project error:", error);

    res.status(500).json({
      message: "Server error while updating project",
    });
  }
};

// ===============================
// DELETE OWN PROJECT
// ===============================
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      submittedBy: req.userId,
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    await Project.findByIdAndDelete(project._id);

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);

    res.status(500).json({
      message: "Server error while deleting project",
    });
  }
};

// ===============================
// EXPORT CONTROLLERS
// ===============================
module.exports = {
  createProject,
  getProjects,
  getProject,
  getMyProjects,
  toggleProjectLike,
  toggleProjectBookmark,
  updateProject,
  deleteProject,
};
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const roadmapRoutes = require("./routes/roadmapRoutes");
const progressRoutes = require("./routes/progressRoutes");
const profileRoutes = require("./routes/profileRoutes");
const communityRoutes = require("./routes/communityRoutes");
const commentRoutes = require("./routes/commentRoutes");
const questionRoutes = require("./routes/questionRoutes");
const projectRoutes = require("./routes/projectRoutes");
const mentorApplicationRoutes = require("./routes/mentorApplicationRoutes");
const mentorProfileRoutes = require("./routes/mentorProfileRoutes");
const mentorDirectoryRoutes = require("./routes/mentorDirectoryRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const adminInterviewRoutes = require("./routes/adminInterviewRoutes");
const adminOpportunityRoutes = require("./routes/adminOpportunityRoutes");
dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/mentor-applications", mentorApplicationRoutes);
app.use("/api/mentor-profile", mentorProfileRoutes);
app.use("/api/mentors", mentorDirectoryRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/interviews", interviewRoutes);
app.use( "/api/opportunities",opportunityRoutes);
app.use("/api/admin/interviews", adminInterviewRoutes);
app.use("/api/admin/opportunities", adminOpportunityRoutes);
// Test route
app.get("/", (req, res) => {
  res.json({
    message: "GradForge API is running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`GradForge server running on port ${PORT}`);
});
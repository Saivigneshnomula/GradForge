const User = require("../models/User");
const protect = require("./authMiddleware");

const adminOnly = [
  protect,

  async (req, res, next) => {
    try {
      // Get the latest user record from MongoDB
      const user = await User.findById(req.userId).select("role");

      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      console.log("================================");
      console.log("ADMIN AUTH CHECK");
      console.log("User ID:", req.userId);
      console.log("Database Role:", user.role);
      console.log("================================");

      if (user.role !== "admin") {
        return res.status(403).json({
          message: "Admin access required",
        });
      }

      // Make the current role available to later handlers
      req.userRole = user.role;

      next();
    } catch (error) {
      console.error("Admin authorization error:", error);

      return res.status(500).json({
        message: "Failed to verify admin access",
      });
    }
  },
];

module.exports = adminOnly;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// REGISTER USER
// ==========================================

const registerUser = async (req, res) => {
  try {
    const {
      name,
      mobile,
      email,
      password,
      linkedinProfile,
      githubProfile,
      education,
    } = req.body;

    // Check required fields
    if (!name || !mobile || !email || !password) {
      return res.status(400).json({
        message: "Name, mobile, email and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    // IMPORTANT:
    // Public registration always creates a STUDENT.
    // Mentor/Admin accounts will be handled separately.
    const user = await User.create({
      name,
      mobile,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "student",
      linkedinProfile,
      githubProfile,
      education,
    });

    // Don't send password back
    const userResponse = {
      id: user._id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      linkedinProfile: user.linkedinProfile,
      githubProfile: user.githubProfile,
      education: user.education,
    };

    res.status(201).json({
      message: "Account created successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// LOGIN USER
// ==========================================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // User data to send
    const userResponse = {
      id: user._id,
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      role: user.role,
      linkedinProfile: user.linkedinProfile,
      githubProfile: user.githubProfile,
      education: user.education,
    };

    res.status(200).json({
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// GET CURRENT USER
// ==========================================

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
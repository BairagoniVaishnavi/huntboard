const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper: sign JWT
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

// Helper: verify Cloudflare Turnstile token
const verifyTurnstile = async (token) => {
  // Skip verification if no secret is configured (dev convenience)
  if (!process.env.TURNSTILE_SECRET_KEY) return true;

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret:   process.env.TURNSTILE_SECRET_KEY,
          response: token,
        }),
      }
    );
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
};

// @route  POST /api/auth/signup
const signup = async (req, res, next) => {
  try {
    const { name, email, password, jobTitle, company } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const user = await User.create({ name, email, password, jobTitle, company });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: {
        id:        user._id,
        name:      user.name,
        email:     user.email,
        jobTitle:  user.jobTitle,
        company:   user.company,
        location:  user.location,
        bio:       user.bio,
        linkedin:  user.linkedin,
        github:    user.github,
        joinedAt:  user.joinedAt,
        notifications: user.notifications,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route  POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password, turnstileToken } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Verify Turnstile
    const turnstileOk = await verifyTurnstile(turnstileToken);
    if (!turnstileOk) {
      return res.status(400).json({ message: "Human verification failed. Please try again." });
    }

    // Find user (include password field)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const match = await user.matchPassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: {
        id:        user._id,
        name:      user.name,
        email:     user.email,
        jobTitle:  user.jobTitle,
        company:   user.company,
        location:  user.location,
        bio:       user.bio,
        linkedin:  user.linkedin,
        github:    user.github,
        joinedAt:  user.joinedAt,
        notifications: user.notifications,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @route  GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// @route  PUT /api/auth/me
const updateProfile = async (req, res, next) => {
  try {
    const allowed = ["name", "jobTitle", "company", "location", "bio", "linkedin", "github", "notifications"];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, getMe, updateProfile };

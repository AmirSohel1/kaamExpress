const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// =========================
// 🔑 Token Helper
// =========================
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// =========================
// 📌 Public Controllers
// =========================

// Register new user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email & password required" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already exists" });

    const user = await User.create({ name, email, password, role, phone });
    const token = createToken(user);

    res.status(201).json({ token, user: { id: user._id, name, email, role } });
  } catch (err) {
    next(err);
  }
};

// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    if (!user.isActive) {
      return res.status(403).json({ error: "Account disabled" });
    }

    const token = createToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

// Forgot password (send token)
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // ⚠️ In production: generate a separate reset token & send email
    const token = createToken(user);
    // console.log(`Password reset token for ${email}: ${token}`);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    // Check if token is provided
    if (!token) {
      return res.status(400).json({ error: "Reset token is required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Return 400 if token is invalid or expired
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    // console.log("Decoded token:", decoded);

    // Find the user
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Hash and save the new password
    // 4. Assign plain password — pre-save middleware will hash it
    user.password = newPassword;
    await user.save();

    // Return success response
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    next(err); // unexpected errors
  }
};
// =========================
// 👤 Authenticated User Controllers
// =========================

// Get current user
exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Update own profile
exports.updateProfile = async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Update own password
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

// Delete own account
exports.deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// =========================
// 🛠️ Admin Controllers
// =========================

// Update any user
exports.adminUpdateUser = async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Delete any user
exports.adminDeleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// Get all users
exports.adminGetAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// Get user by ID
exports.adminGetUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// Deactivate user
exports.adminDeactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User account deactivated" });
  } catch (err) {
    next(err);
  }
};

// Reactivate user
exports.adminReactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User account reactivated" });
  } catch (err) {
    next(err);
  }
};

// Search users
exports.adminSearchUsers = async (req, res, next) => {
  try {
    const { query } = req.params;
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("-password");

    res.json(users);
  } catch (err) {
    next(err);
  }
};

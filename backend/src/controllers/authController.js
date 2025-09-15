const User = require("../models/User");
const jwt = require("jsonwebtoken");

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already exists" });

    const user = await User.create({ name, email, password, role, phone });
    const token = createToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.bulkRegister = async (req, res, next) => {
  try {
    const usersData = req.body;
    if (!Array.isArray(usersData) || usersData.length === 0) {
      return res.status(400).json({ error: "Array of users required" });
    }

    for (let u of usersData) {
      if (!u.name || !u.email || !u.password) {
        return res
          .status(400)
          .json({ error: "Each user must have name, email, and password" });
      }
    }

    const emails = usersData.map((u) => u.email);
    const existingUsers = await User.find({ email: { $in: emails } });
    if (existingUsers.length > 0) {
      const existingEmails = existingUsers.map((u) => u.email);
      return res
        .status(409)
        .json({ error: "Some emails already exist", existingEmails });
    }

    const createdUsers = await User.insertMany(usersData);
    const usersWithToken = createdUsers.map((user) => ({
      token: createToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }));

    res.status(201).json({
      message: "Bulk User registered successfully",
      users: usersWithToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = createToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    next(err);
  }
};

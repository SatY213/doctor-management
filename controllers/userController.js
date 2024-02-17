const User = require("../models/User");
const mongoose = require("mongoose");

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create the user." });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedFields = {
      ...req.body,
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updatedFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update the user." });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the user." });
  }
};

exports.findUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to find the user." });
  }
};

// Find all users with pagination and search
exports.findAllUsers = async (req, res) => {
  try {
    const perPage = parseInt(req.query.perPage) || 10;
    const page = parseInt(req.query.page) || 1;
    const searchQuery = req.query.q || "";

    const query = {};
    if (searchQuery) {
      query.username = { $regex: searchQuery, $options: "i" };
    }

    const totalCount = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCount / perPage);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec();

    res.json({
      data: users,
      totalItems: totalCount,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
};

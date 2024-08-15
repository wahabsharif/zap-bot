// src/controllers/userController.ts

import { Request, Response } from "express";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register a new user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, username, password, isAdmin } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      isAdmin,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// src/controllers/userController.ts
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    user.isOnline = true;
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id.toString(), isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id.toString(), // Include userId in the response
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Logout a user
export const logoutUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user status to offline
    user.isOnline = false;
    await user.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error in logoutUser:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Check if user is admin
export const checkAdmin = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ isAdmin: user.isAdmin });
  } catch (error) {
    console.error("Error in checkAdmin:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.status(200).json(
      users.map((user) => ({
        ...user.toObject(),
        _id: user._id.toString(), // Convert _id to string
      }))
    );
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

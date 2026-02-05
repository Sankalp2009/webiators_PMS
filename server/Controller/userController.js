import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../Model/userModel.js";
import { createSendToken } from "../Utils/jwt.js";

dotenv.config({ path: "./config.env" });

export const Register = async (req, res) => {
  try {
    const { username = "", email = "", password = "" } = req.body;

    console.log(req.body);

    if (!username.trim() || !email.trim() || !password.trim()) {
      return res.status(400).json({
        status: "fail",
        message:
          "Please provide all required fields: username, email, and password.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail }).lean();
    if (existing) {
      return res.status(400).json({
        status: "fail",
        message: "User already exists with this email.",
      });
    }

    const newUser = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    return createSendToken(newUser, 201, res, "User registered successfully.");
  } catch (error) {
    console.error("Register error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Email already registered.",
      });
    }

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: "fail",
        message: "Validation failed.",
        errors,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Registration failed. Please try again later",
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // Step 1: Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide both email and password.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const plainPassword = password.trim();

    const user = await User.findOne({ email: normalizedEmail })
      .select("+password")
      .lean();

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid username or password.",
      });
    }

    const isMatch = await bcrypt.compare(plainPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid username or password.",
      });
    }

    delete user.password;

    return createSendToken(user, 200, res, "Login successful");
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: "error",
      message: "Login failed. Please try again later",
    });
  }
};

export const Logout = async (req, res) => {
  try {

    res.cookie("jwt", "loggedout", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    return res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      status: "error",
      message: "Logout failed",
    });
  }
};
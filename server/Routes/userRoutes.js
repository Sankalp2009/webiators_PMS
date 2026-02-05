import express from "express";
import { Register, Login, Logout } from "../Controller/userController.js";
import { strictLimiter } from "../Utils/rateLimiter.js";

const router = express.Router();

router.use(strictLimiter);

// Register route with validation
router.route("/register").post(Register);

// Login route with validation
router.route("/login").post(Login);

// Logout route (optional, for cookie clearing)
router.post("/logout", Logout);

export default router;
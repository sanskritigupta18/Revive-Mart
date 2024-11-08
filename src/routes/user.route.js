import express from "express";
import { registerUser, loginUser, logoutUser, changeCurrentPassword } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"; // Middleware for protected routes

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Login an existing user
router.post("/login", loginUser);

// Logout a user (protected route)
router.post("/logout", verifyJWT, logoutUser);

// Change password (protected route)
router.patch("/change-password", verifyJWT, changeCurrentPassword);

export default router;
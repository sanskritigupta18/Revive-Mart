import express from "express";
import { createStore, updateStore, deleteStore } from "../controllers/store.controller.js";
import { verifyJWT, verifyStore } from "../middlewares/auth.middleware.js"; // Middleware to protect routes

const router = express.Router();

// Create a store (protected route)
router.post("/create", verifyJWT, verifyStore, createStore);

// Update a store by ID (protected route)
router.patch("/update/:storeId", verifyJWT, verifyStore, updateStore);

// Delete a store by ID (protected route)
router.delete("/delete/:storeId", verifyJWT, verifyStore, deleteStore);

export default router;
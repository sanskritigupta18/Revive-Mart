import express from "express";
import { verifyJWT, verifyStore } from "../middlewares/auth.middleware.js";
import {
    createInventory,
    updateInventory,
    deleteInventory,
} from "../controllers/inventory.controller.js";

const router = express.Router();

// Route to create inventory
router.post("/create", verifyJWT, verifyStore, createInventory);

// Route to update inventory
router.patch("/update", verifyJWT, verifyStore, updateInventory);

// Route to delete inventory
router.delete("/delete", verifyJWT, verifyStore, deleteInventory);

export default router;
import express from "express";
import {
    createProduct,
    updateProduct,
    updateProductSoldOutStatus,
    deleteProduct,
    searchProducts,
    getProductById
} from "../controllers/product.controller.js";
import { verifyJWT, verifyStore } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Create a product (only for authenticated sellers)
router.post("/:storeId/create", verifyJWT, verifyStore, upload.single("productImage"), createProduct);

// Update a product by ID (only for authenticated sellers)
router.patch("/update/:productId", verifyJWT, verifyStore, updateProduct);

// Update product sold-out status (only for authenticated sellers)
router.patch("/status/:productId", verifyJWT, verifyStore, updateProductSoldOutStatus);

// Delete a product by ID (only for authenticated sellers)
router.delete("/delete", verifyJWT, verifyStore, deleteProduct);

// Get product details by ID (accessible to authenticated users)
router.get("/details/:productId", verifyJWT, getProductById);

// Search products (accessible to authenticated users)
router.get("/search", verifyJWT, searchProducts);

export default router;
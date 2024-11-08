import express from "express";
import { productDetails } from "../controllers/dashboard.controller.js";
import { verifyJWT, verifyStore } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.get("/productDetails", verifyJWT, verifyStore, productDetails);

export default router;
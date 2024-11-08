import express from "express";
import {
    createCoupon,
    editCoupon,
    deleteCoupon,
    getCouponByStore,
} from "../controllers/coupon.controller.js";
import { verifyJWT, verifyStore } from "../middlewares/auth.middleware.js";
const router = express.Router();

// Route to create a coupon
router.post("/store/:storeId/coupons", verifyJWT, verifyStore, createCoupon);

// Route to edit a coupon
router.patch("/coupons/:couponId", verifyJWT, verifyStore, editCoupon);

// Route to delete a coupon
router.delete("/coupons/:couponId", verifyJWT, verifyStore, deleteCoupon);

// Route to get coupons by store
router.get("/store/:storeId/coupons", getCouponByStore);

export default router;
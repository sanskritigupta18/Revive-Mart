import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import storeRoute from "./routes/store.route.js";
import productRoute from "./routes/product.route.js";
import couponRoute from "./routes/coupon.route.js";
import inventoryRoute from "./routes/inventory.route.js";
import reviewRoute from "./routes/review.route.js";
import orderRoute from "./routes/order.route.js";
import dashboardRoute from "./routes/dashboard.route.js";
import paymentRoute from "./routes/payment.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({limit: "16kb"}));
app.use(cookieParser());
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));

app.use("/api/v1/user",userRoute);
app.use("/api/v1/store",storeRoute);
app.use("/api/v1/product",productRoute);
app.use("/api/v1/coupon",couponRoute);
app.use("/api/v1/inventory",inventoryRoute);
app.use("/api/v1/review",reviewRoute);
app.use("/api/v1/order",orderRoute);
app.use("/api/v1/dashboard",dashboardRoute);
app.use("/api/v1/payment",paymentRoute);

export {app};
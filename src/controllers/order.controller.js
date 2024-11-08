import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Store } from "../models/store.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// Function to create an order
const createOrder = asyncHandler(async (req, res) => {
    const { products, sellerId } = req.body;
    const id = req?.user?._id;
    // Validate input
    if (!id || !products || products.length === 0) {
        return res
            .status(400)
            .json(
                new ApiResponse(400, {}, "User ID and products are required")
            );
    }

    try {
        // Fetch the selected products and calculate the total price
        let totalPrice = 0;
        const orderProducts = [];

        for (const item of products) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res
                    .status(404)
                    .json(
                        new ApiResponse(
                            404,
                            {},
                            `Product with ID ${item.productId} not found`
                        )
                    );
            }
            if (product.stock_quantity < item.quantity) {
                return res
                    .status(400)
                    .json(
                        new ApiResponse(
                            400,
                            {},
                            `Insufficient stock for product ${product.name}`
                        )
                    );
            }

            // Add product to the order
            orderProducts.push({
                product: product._id,
                quantity: item.quantity,
            });

            // Calculate total price
            totalPrice += product.price * item.quantity;

            // Optionally, reduce stock after order
            product.stock_quantity -= item.quantity;
            await product.save();
        }

        // Create the order
        const order = await Order.create({
            user_id: id,
            products: orderProducts,
            seller: new     mongoose.Types.ObjectId(sellerId), // If there’s a seller in the order
            total_price: totalPrice,
            delivery_status: "pending", // Initial status is "pending"
            payment_status: "pending", // Initial payment status
        });

        return res
            .status(201)
            .json(new ApiResponse(201, order, "Order created successfully"));
    } catch (error) {
        console.error("Error creating order:", error);
        return res
            .status(500)
            .json(new ApiResponse(500, {}, "Error while creating order"));
    }
});

// get order by id
const getOrderById = asyncHandler(async (req,res) => {
    try
    {
        const {id} = req.params;
        if(!id)
        {
            return res.status(400).json(new ApiResponse(400,{},"Id is required"));
        }

        const order = await Order.findById(new mongoose.Types.ObjectId(id)).populate("products.product").populate("seller").exec();
        if(!order)
        {
            return res.status(500).json(new ApiResponse(500,{},"Error while fetching order details"));
        }

        return res.status(200).json(new ApiResponse(200,order,"Order details fetched successully"));
    }
    catch(e)
    {
        return res.status(500).json(new ApiResponse(500,{},"Error while fetching order details"));
    }
})

const getAllOrdersByUser = asyncHandler(async (req,res) => {
    try
    {
        const id = req?.user?._id;
        if(!id)
        {
            return res.status(400).json(new ApiResponse(400,{},"Id is required"));
        }

        const orders = await Order.aggregate([
            {
                $match:
                {
                    user_id: id
                }
            },
            {
                $lookup:
                {
                    from: "products",
                    localField: "products.product",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $unwind: "$productDetails"
            },
            {
                $lookup:
                {
                    from: "stores",
                    localField: "seller",
                    foreignField: "_id",
                    as: "sellerDetails",
                }
            },
            {
                $unwind: "$sellerDetails",
            },
            {
                $project: {
                    _id: 1,
                    total_price: 1,
                    order_date: 1,
                    delivery_status: 1,
                    payment_status: 1,
                    "products.product": "$productDetails", // Replace product with detailed info
                    "products.quantity": 1, // Keep quantity from original order
                    sellerDetails: 1
                }
            }
        ]);

        if(!orders)
        {
            return res.status(500).json(new ApiResponse(500,{},"Error while fetching user order details"));
        }

        res.status(200).json(new ApiResponse(200,orders,"Orders fetched successfully"));
    }
    catch(e)
    {
        res.status(500).json(new ApiResponse(500,{},"Error while getting details"));
    }
})

const updateDeliveryStatus = asyncHandler(async (req,res) => {
    try
    {
        const {orderId, delivery_status} = req.body;
        if(!orderId || !delivery_status)
        {
            return res.status(400).json(new ApiResponse(400,{},"All fields are required"));
        }

        const order = await Order.findById(new mongoose.Types.ObjectId(orderId));

        if(!order)
        {
            return res.status(500).json(new ApiResponse(500,{},"Error while order details"));
        }

        const updatedOrder = await Order.findByIdAndUpdate(order._id,{delivery_status},{runValidators: false,new: true});

        if(!updatedOrder)
        {
            return res.status(500).json(new ApiResponse(500,{},"Error while updating delivery status"));
        }

        return res.status(200).json(new ApiResponse(200,updatedOrder,"Updated order status"));

    }
    catch(e)
    {
        return res.status(500).json(new ApiResponse(500,{},"Error while updating status"));
    }
})

const getAllOrdersBySeller = asyncHandler(async (req,res) => {
    try
    {
        const id = req?.user?._id;
        if(!id)
        {
            return res.status(400).json(new ApiResponse(400,{},"Id is required"));
        }
        console.log(storeDetails)
        if(!storeDetails)
        {
            return res.status(400).json(new ApiResponse(400,{},"Error while fetching store details"));
        }
        const orders = await Order.find({seller: storeDetails._id});
        if(!orders)
        {
            return res.status(500).json(new ApiResponse(500,{},"Error while fetching user order details"));
        }

        res.status(200).json(new ApiResponse(200,orders,"Orders fetched successfully"));
    }
    catch(e)
    {
        res.status(500).json(new ApiResponse(500,{},"Error while getting details"));
    }
})

export { createOrder, getAllOrdersByUser, getAllOrdersBySeller, getOrderById, updateDeliveryStatus };
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { Store } from "../models/store.model.js";

const productDetails = asyncHandler(async (req, res) => {
    try {
        const id = req?.user?._id;
        console.log(id)
        if (!id) {
            return res
                .status(400)
                .json(new ApiResponse(400, {}, "All fields are required"));
        }

        // const response = await Store.aggregate([
        //     {
        //         $match: {
        //             userId: id
        //         }
        //     },
        //     {
        //         $lookup:
        //         {
        //             from: "orders",
        //             localField: "_id",
        //             foreignField: "seller",
        //             as: "productsSold",
        //         }
        //     }
        // ]);
        const response = await Store.aggregate([
            {
                $match: {
                    userId: id, // Match the specific store by userId
                },
            },
            {
                $lookup: {
                    from: "orders", // Collection to join with (orders)
                    localField: "_id", // Local field from "Store" collection
                    foreignField: "seller", // Field in "orders" collection that references the store
                    as: "productsSold", // Alias for the joined data
                },
            },
            {
                $unwind: "$productsSold", // Unwind the productsSold array
            },
            {
                $lookup: {
                    from: "products", // Join with the products collection
                    localField: "productsSold.products.product", // Local field referencing the product IDs in orders
                    foreignField: "_id", // Foreign field (product _id in products collection)
                    as: "productDetails", // Alias for the product details
                },
            },
            {
                $unwind: "$productDetails", // Unwind the productDetails array
            },
            {
                $group: {
                    _id: "$_id", // Group by store ID
                    totalOrders: { $sum: 1 }, // Count total number of orders
                    totalValue: { $sum: "$productsSold.total_price" }, // Sum total price of all orders
                    products: {
                        $push: {
                            productId: "$productDetails._id",
                            productName: "$productDetails.name", // Include additional product details as needed
                            quantitySold: "$productsSold.products.quantity",
                            pricePerProduct: "$productDetails.price", // Include price if available in the product collection
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0, // Optionally remove the _id field from the result
                    totalOrders: 1, // Show total number of orders
                    totalValue: 1, // Show total value of orders
                    products: 1, // Include product details
                },
            },
        ]);
        console.log(response);
        if (!response) {
            return res.status(500).json(new ApiResponse(500, {}, ""));
        }

        return res.status(200).json(new ApiResponse(200,response,"Details fetched successfuly"));
    } catch (e) {
        return res.status(500).json(new ApiResponse(500, {}, ""));
    }
});

export { productDetails };
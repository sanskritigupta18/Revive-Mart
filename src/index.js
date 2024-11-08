/*
    functions
    seller
    product add
    product edit
    product delete
    bill generate
    discount

    reviews

    user
    buy product
    pay
    search

    admin
    category
*/

import dotenv from "dotenv";
import connectDB from "./dbConnect/index.js";
import { app } from "./app.js";
dotenv.config();

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("Error");
        });
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Listening at port ${process.env.PORT}`);
        });
    })
    .catch((e) => {
        {
            console.log("Connection error");
        }
    });

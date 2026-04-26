/**
 * @file app.js
 * @description Sets up Express app, middleware, and routes
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import listingRoutes from "./routes/listingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();

/**
 * Middleware
 */
app.use(cors());
app.use(express.json());

/**
 * Test route
 */
app.get("/", (req, res) => {
    res.send("Backend is working");
});

/**
 * Routes
 */
app.use("/api/listings", listingRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5001;

connectDB;

/**
 * Start server
 */
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
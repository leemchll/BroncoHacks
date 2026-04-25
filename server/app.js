/**
 * @file app.js
 * @description Sets up Express app, middleware, and routes
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import listingRoutes from "./routes/listingRoutes.js";
import userRoutes from "./routes/userRoutes.js"; 

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

export default app;
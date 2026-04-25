/**
 * @file app.js
 * @description Sets up Express app, middleware, and routes
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import listingRoutes from "./routes/listingRoutes.js";

dotenv.config();

const app = express();

/**
 * Middleware
 * - cors: allows frontend to talk to backend
 * - express.json: allows us to read JSON from requests
 */
app.use(cors());
app.use(express.json());

/**
 * Routes
 */
app.use("/api/listings", listingRoutes);

export default app;
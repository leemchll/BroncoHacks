/**
 * @file userRoutes.js
 * @description Defines routes for user-related API endpoints
 */

import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

/**
 * @route POST /api/users/register
 * @description Register a new user
 */
router.post("/register", registerUser);

/**
 * @route POST /api/users/login
 * @description Log in a user
 */
router.post("/login", loginUser);

export default router;
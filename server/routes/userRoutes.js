/**
 * @file userRoutes.js
 * @description Defines API routes for user-related actions (register, login)
 */

import express from "express";
import { registerUser, loginUser, checkPassword } from "../controllers/userController.js";

const router = express.Router();

/**
 * @route POST /api/users/register
 * @description Register a new user
 * @access Public
 */
router.post("/register", registerUser);

/**
 * @route POST /api/users/login
 * @description Log in a user
 * @access Public
 */
router.post("/login", loginUser);

router.post("/check-password", checkPassword);

export default router;
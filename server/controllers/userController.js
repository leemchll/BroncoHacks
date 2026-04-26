import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
    try {
        console.log("Register input:", req.body);
        const { username, name, email, password } = req.body;

        if (!username || !name || !email || !password) {
            return res.status(400).json({ message: "Please provide all fields" });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username already taken" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: { username: newUser.username, name: newUser.name, email: newUser.email },
        });
    } catch (err) {
        console.error("registerUser error:", err);
        res.status(500).json({ message: "Server error during registration" });
    }
};

export const loginUser = async (req, res) => {
    try {
        console.log("Login input:", req.body);
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Please provide username and password" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        res.status(200).json({
            message: "Login successful",
            user: { username: user.username, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error("loginUser error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
};

export const checkPassword = async (req, res) => {
    try {
        console.log("Password check input:", req.body);
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Please provide username and password" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        res.status(200).json({
            correct: isMatch,
            message: isMatch ? "Password is correct" : "Incorrect password",
        });
    } catch (err) {
        console.error("checkPassword error:", err);
        res.status(500).json({ message: "Server error during password check" });
    }
};

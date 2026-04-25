/**
 * @file userController.js
 * @description Handles user-related business logic
 */

/**
 * @function registerUser
 * @description Handles user registration
 * @route POST /api/users/register
 * @access Public
 */
export const registerUser = (req, res) => {
    const { username, name, email, password } = req.body;
  
    if (!username || !name || !email || !password) {
      return res.status(400).json({
        message: "Please provide all fields",
      });
    }
  
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }
  
    res.status(201).json({
      message: "User registered successfully",
      user: {
        username,
        name,
        email,
      },
    });
  };
  
 /**
 * @file userController.js
 * @description Handles user-related business logic (registration and login)
 */

/**
 * @function loginUser
 * @description Handles user login
 * @route POST /api/users/login
 * @access Public
 */
export const loginUser = (req, res) => {
    const { email, password } = req.body;
  
    // basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password",
      });
    }
  
    res.status(200).json({
      message: "Login successful",
      user: {
        email,
      },
    });
  };
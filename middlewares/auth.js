const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware for authentication
exports.auth = (req, res, next) => {
    try {
        // Extract the JWT token from the request
        const token = req.body.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token Missing"
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(decoded);
        // Storing decoded token payload in request object
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token is invalid or expired"
        });
    }
};

// Middleware to check if user is a student
exports.isStudent = (req, res, next) => {
    try {
        if (req.user.role !== "Student") {
            return res.status(403).json({
                success: false,
                message: "Access Forbidden. This is a protected route for students."
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error checking user role"
        });
    }
};

// Middleware to check if user is an admin
exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Access Forbidden. This is a protected route for admins."
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error checking user role"
        });
    }
};

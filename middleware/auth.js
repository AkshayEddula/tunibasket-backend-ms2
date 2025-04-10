const jwt = require("jsonwebtoken");
require("dotenv").config();

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Set user ID in request object
      req.userId = decoded.id;
      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Check admin secret key (for initial setup)
const checkAdminAuth = (req, res, next) => {
  const adminSecretKey = req.headers["x-admin-secret"];

  if (!adminSecretKey) {
    return res.status(401).json({ message: "Admin secret key is required" });
  }

  if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ message: "Invalid admin secret key" });
  }

  next();
};

module.exports = {
  protect,
  checkAdminAuth,
};

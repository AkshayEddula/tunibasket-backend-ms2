const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB()
  .then(() => {
    // Load routes after database connection is established
    const categoryRoutes = require("./routes/category");
    const subCategoryRoutes = require("./routes/subcategory");
    const productRoutes = require("./routes/product");

    app.use("/api/categories", categoryRoutes);
    app.use("/api/subcategories", subCategoryRoutes);
    app.use("/api/products", productRoutes);

    // Start server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize DB connection:", err);
    process.exit(1);
  });

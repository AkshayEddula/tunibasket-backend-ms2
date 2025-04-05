const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { checkAdminAuth } = require("../middleware/auth");

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate("category", "name")
      .populate("subCategory", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products by category
router.get("/category/:categoryId", async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.categoryId,
      isActive: true,
    })
      .populate("category", "name")
      .populate("subCategory", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get products by subcategory
router.get("/subcategory/:subCategoryId", async (req, res) => {
  try {
    const products = await Product.find({
      subCategory: req.params.subCategoryId,
      isActive: true,
    })
      .populate("category", "name")
      .populate("subCategory", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new product (Admin only)
router.post("/", checkAdminAuth, async (req, res) => {
  const product = new Product({
    name: req.body.name,
    heading: req.body.heading,
    images: req.body.images,
    category: req.body.category,
    subCategory: req.body.subCategory,
    weight: req.body.weight,
    mrp: req.body.mrp,
    offerPrice: req.body.offerPrice,
    purchasePrice: req.body.purchasePrice,
    offerPercentage: req.body.offerPercentage,
    deliveryTime: req.body.deliveryTime,
    description: req.body.description,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product (Admin only)
router.patch("/:id", checkAdminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updateFields = [
      "name",
      "heading",
      "images",
      "category",
      "subCategory",
      "weight",
      "mrp",
      "offerPrice",
      "purchasePrice",
      "offerPercentage",
      "deliveryTime",
      "description",
      "isActive",
    ];

    updateFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    product.updatedAt = new Date();
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product (Admin only)
router.delete("/:id", checkAdminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isActive = false;
    product.updatedAt = new Date();
    await product.save();

    res.json({ message: "Product deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

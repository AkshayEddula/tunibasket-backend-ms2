const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const { checkAdminAuth } = require("../middleware/auth");

// Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new category (Admin only)
router.post("/", checkAdminAuth, async (req, res) => {
  const category = new Category({
    name: req.body.name,
    image: req.body.image,
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update category (Admin only)
router.patch("/:id", checkAdminAuth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (req.body.name) category.name = req.body.name;
    if (req.body.image) category.image = req.body.image;
    if (req.body.isActive !== undefined) category.isActive = req.body.isActive;
    category.updatedAt = new Date();

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete category (Admin only)
router.delete("/:id", checkAdminAuth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.isActive = false;
    category.updatedAt = new Date();
    await category.save();

    res.json({ message: "Category deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

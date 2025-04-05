const express = require("express");
const router = express.Router();
const SubCategory = require("../models/SubCategory");
const { checkAdminAuth } = require("../middleware/auth");

// Get all subcategories
router.get("/", async (req, res) => {
  try {
    const subcategories = await SubCategory.find({ isActive: true }).populate(
      "category",
      "name"
    );
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get subcategories by category
router.get("/category/:categoryId", async (req, res) => {
  try {
    const subcategories = await SubCategory.find({
      category: req.params.categoryId,
      isActive: true,
    }).populate("category", "name");
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new subcategory (Admin only)
router.post("/", checkAdminAuth, async (req, res) => {
  const subcategory = new SubCategory({
    name: req.body.name,
    category: req.body.category,
    image: req.body.image,
  });

  try {
    const newSubCategory = await subcategory.save();
    res.status(201).json(newSubCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update subcategory (Admin only)
router.patch("/:id", checkAdminAuth, async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    if (req.body.name) subcategory.name = req.body.name;
    if (req.body.category) subcategory.category = req.body.category;
    if (req.body.image) subcategory.image = req.body.image;
    if (req.body.isActive !== undefined)
      subcategory.isActive = req.body.isActive;
    subcategory.updatedAt = new Date();

    const updatedSubCategory = await subcategory.save();
    res.json(updatedSubCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete subcategory (Admin only)
router.delete("/:id", checkAdminAuth, async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    subcategory.isActive = false;
    subcategory.updatedAt = new Date();
    await subcategory.save();

    res.json({ message: "Subcategory deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

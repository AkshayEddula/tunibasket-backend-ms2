const express = require("express");
const router = express.Router();
const Store = require("../models/Store");
const { checkAdminAuth } = require("../middleware/auth");

// Get all stores
router.get("/", async (req, res) => {
  try {
    const stores = await Store.find({ isActive: true });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new store (Admin only)
router.post("/", checkAdminAuth, async (req, res) => {
  const store = new Store({
    name: req.body.name,
    address: req.body.address,
    location: {
      type: "Point",
      coordinates: req.body.coordinates,
    },
    operatingHours: {
      open: req.body.operatingHours.open,
      close: req.body.operatingHours.close,
    },
  });

  try {
    const newStore = await store.save();
    res.status(201).json(newStore);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update store (Admin only)
router.patch("/:id", checkAdminAuth, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const updateFields = [
      "name",
      "address",
      "location",
      "operatingHours",
      "isActive",
    ];
    updateFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        store[field] = req.body[field];
      }
    });

    store.updatedAt = new Date();
    const updatedStore = await store.save();
    res.json(updatedStore);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;

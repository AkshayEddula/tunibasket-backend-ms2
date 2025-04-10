const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  mrp: {
    type: Number,
    required: true,
  },
  offerPrice: {
    type: Number,
    required: true,
  },
  purchasePrice: {
    type: Number,
    required: true,
  },
  offerPercentage: {
    type: Number,
    required: true,
  },
  deliveryTime: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  stock: {
    current: {
      type: Number,
      required: true,
      default: 0,
    },
    minimum: {
      type: Number,
      required: true,
      default: 5,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Method to update stock
productSchema.methods.updateStock = async function (quantity) {
  if (this.stock.current + quantity < 0) {
    throw new Error("Insufficient stock");
  }
  this.stock.current += quantity;
  this.stock.lastUpdated = new Date();
  return this.save();
};

// Static method to check stock availability
productSchema.statics.checkStock = async function (productId, quantity) {
  const product = await this.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }
  return product.stock.current >= quantity;
};

module.exports = mongoose.model("Product", productSchema);

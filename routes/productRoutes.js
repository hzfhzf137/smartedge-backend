const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// ✅ GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ GET product by name (e.g., /api/products/airpods-pro)
router.get('/:name', async (req, res) => {
  try {
    const productName = req.params.name.replace(/-/g, ' '); // Convert URL slug to proper name
    const product = await Product.findOne({
      name: new RegExp(`^${productName}$`, 'i') // Case-insensitive exact match
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product by name:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ POST a new product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, imageUrl, modelUrl, galleryImages } = req.body;

    // Validate required fields
    if (!name || !price || !description || !imageUrl || !modelUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      imageUrl,
      modelUrl,
      galleryImages: galleryImages || [],
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ error: 'Failed to create product' });
  }
});

module.exports = router;

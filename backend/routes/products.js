const express = require('express');
const router = express.Router();
const db = require('../database');
const { protect, admin } = require('./auth');

// GET all products with filtering, search, and sorting
router.get('/', async (req, res) => {
  const { category, search, sort } = req.query;

  try {
    let products = await db.products.find({ category, search });

    // Handle manual sorting for local JSON/Mongoose results
    if (sort) {
      if (sort === 'price-low') {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-high') {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        products.sort((a, b) => b.rating - a.rating);
      }
    }

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await db.products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// CREATE product (Admin)
router.post('/', protect, admin, async (req, res) => {
  const { name, description, price, category, image, stock } = req.body;

  if (!name || !description || !price || !category || !image || stock === undefined) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  try {
    const newProduct = await db.products.create({
      name,
      description,
      price: Number(price),
      category,
      image,
      stock: Number(stock)
    });
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// UPDATE product (Admin)
router.put('/:id', protect, admin, async (req, res) => {
  const { name, description, price, category, image, stock } = req.body;

  try {
    const product = await db.products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updatedProduct = await db.products.findByIdAndUpdate(req.params.id, {
      name: name || product.name,
      description: description || product.description,
      price: price !== undefined ? Number(price) : product.price,
      category: category || product.category,
      image: image || product.image,
      stock: stock !== undefined ? Number(stock) : product.stock
    });

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// DELETE product (Admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const success = await db.products.findByIdAndDelete(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// ADD product review
router.post('/:id/reviews', protect, async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({ message: 'Please provide rating and comment' });
  }

  try {
    const product = await db.products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = {
      user: req.user.name,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString()
    };

    const reviews = product.reviews ? [...product.reviews, review] : [review];
    
    // Calculate new average rating
    const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
    const avgRating = Number((totalRating / reviews.length).toFixed(1));

    const updatedProduct = await db.products.findByIdAndUpdate(req.params.id, {
      reviews,
      rating: avgRating
    });

    res.status(201).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error submitting review' });
  }
});

module.exports = router;

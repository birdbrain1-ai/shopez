const express = require('express');
const router = express.Router();
const db = require('../database');
const { protect, admin } = require('./auth');

// CREATE new order
router.post('/', protect, async (req, res) => {
  const { items, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    const newOrder = await db.orders.create({
      userId: req.user._id,
      userName: req.user.name,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error placing order' });
  }
});

// GET logged-in user's orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await db.orders.find({ userId: req.user._id });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving your orders' });
  }
});

// GET all orders (Admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await db.orders.find();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving all orders' });
  }
});

// UPDATE order status (Admin only)
router.put('/:id/status', protect, admin, async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Please provide status' });
  }

  try {
    const updatedOrder = await db.orders.findByIdAndUpdate(req.params.id, status);
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

module.exports = router;

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./database');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const { router: authRouter, protect, admin } = require('./routes/auth');
const productRouter = require('./routes/products');
const orderRouter = require('./routes/orders');

app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

// GET admin dashboard stats
app.get('/api/stats', protect, admin, async (req, res) => {
  try {
    const products = await db.products.find({});
    const orders = await db.orders.find({});
    const users = await db.users.find({});

    const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Group sales by category for statistics
    const categorySales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const cat = item.category || 'Other';
        categorySales[cat] = (categorySales[cat] || 0) + (item.price * item.quantity);
      });
    });

    res.json({
      totalSales: Math.round(totalSales * 100) / 100,
      ordersCount: orders.length,
      usersCount: users.length,
      productsCount: products.length,
      categorySales
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// API Root Healthcheck
app.get('/api', (req, res) => {
  res.json({
    message: 'Shopez API is running...',
    databaseMode: db.isFallback() ? 'Fallback local JSON file' : 'MongoDB Connected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

// Start Server
const PORT = process.env.PORT || 5000;
db.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const JSON_DB_PATH = path.join(__dirname, 'shopez-db.json');
let isFallbackMode = false;

// Initial Seed Data
const initialProducts = [
  {
    name: 'NovaBook Pro 16',
    description: 'Ultra-thin creator and gaming laptop featuring an AMD Ryzen 9 processor, 32GB DDR5 RAM, 1TB NVMe SSD, and an NVIDIA RTX 4070. Stunning 16-inch 120Hz Mini-LED display.',
    price: 1499,
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
    stock: 12,
    rating: 4.8,
    reviews: [
      { user: 'Sarah K.', rating: 5, comment: 'Incredible performance, the screen is absolutely gorgeous!' },
      { user: 'David M.', rating: 4, comment: 'Great power, but battery life could be slightly better.' }
    ]
  },
  {
    name: 'AeroSound Max',
    description: 'Premium wireless over-ear headphones with hybrid active noise cancellation, high-resolution spatial audio, and up to 45 hours of battery life with fast charging.',
    price: 299,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    stock: 25,
    rating: 4.6,
    reviews: [
      { user: 'Emily R.', rating: 5, comment: 'The noise cancellation is magic. Super comfortable.' }
    ]
  },
  {
    name: 'Quantum Watch S4',
    description: 'Next-gen smartwatch with a high-definition AMOLED screen, continuous heart rate tracking, ECG, sleep coaching, built-in GPS, and 7-day battery life.',
    price: 249,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    stock: 18,
    rating: 4.5,
    reviews: [
      { user: 'James T.', rating: 4, comment: 'Excellent tracking features, looks sleek on the wrist.' }
    ]
  },
  {
    name: 'VividPhone Ultra',
    description: 'Flagship smartphone with 200MP triple camera system, Snapdragon 8 Gen 3, 12GB RAM, 512GB storage, and a dynamic 120Hz AMOLED display.',
    price: 999,
    category: 'Phones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    stock: 8,
    rating: 4.9,
    reviews: [
      { user: 'Alex P.', rating: 5, comment: 'Best camera on any phone, hands down. Night mode is crazy.' }
    ]
  },
  {
    name: 'ApexBuds Pro',
    description: 'True wireless earbuds with custom dynamic drivers, personalized spatial audio, IPX4 sweat resistance, and seamless device switching.',
    price: 149,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    stock: 40,
    rating: 4.3,
    reviews: []
  },
  {
    name: 'SpectraView 32',
    description: '32-inch curved UHD 4K monitor with 144Hz refresh rate, HDR 600 support, and USB-C power delivery. Perfect for work and gaming setups.',
    price: 449,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    stock: 15,
    rating: 4.7,
    reviews: [
      { user: 'Michael L.', rating: 5, comment: 'Huge workspace, clean colors, and super smooth gaming.' }
    ]
  }
];

// Local JSON File DB State
let localDB = {
  users: [],
  products: [],
  orders: []
};

// Seed Local Database file if empty
function loadLocalDB() {
  try {
    if (fs.existsSync(JSON_DB_PATH)) {
      const data = fs.readFileSync(JSON_DB_PATH, 'utf8');
      localDB = JSON.parse(data);
    } else {
      localDB.products = initialProducts.map((p, index) => ({
        _id: `prod_${index + 1}`,
        ...p
      }));
    }

    // Ensure users array exists and is seeded if empty
    if (!localDB.users || localDB.users.length === 0) {
      const salt = bcrypt.genSaltSync(10);
      localDB.users = [
        {
          _id: 'user_admin',
          name: 'Demo Admin',
          email: 'admin@shopez.com',
          password: bcrypt.hashSync('admin123', salt),
          isAdmin: true,
          createdAt: new Date().toISOString()
        },
        {
          _id: 'user_customer',
          name: 'Demo Customer',
          email: 'user@shopez.com',
          password: bcrypt.hashSync('user123', salt),
          isAdmin: false,
          createdAt: new Date().toISOString()
        }
      ];
    }
    
    saveLocalDB();
  } catch (err) {
    console.error('Error loading local JSON DB:', err);
  }
}

function saveLocalDB() {
  try {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(localDB, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local JSON DB:', err);
  }
}

// Connect to Database
async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('\x1b[33m%s\x1b[0m', 'No MONGODB_URI found in environment. Falling back to local JSON database.');
    isFallbackMode = true;
    loadLocalDB();
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('\x1b[32m%s\x1b[0m', 'Successfully connected to MongoDB Atlas!');
    
    // Seed MongoDB if empty
    const productCount = await mongoose.connection.db.collection('products').countDocuments();
    if (productCount === 0) {
      await mongoose.connection.db.collection('products').insertMany(initialProducts);
      console.log('Seeded initial products into MongoDB.');
    }

    const userCount = await mongoose.connection.db.collection('users').countDocuments();
    if (userCount === 0) {
      const salt = await bcrypt.genSalt(10);
      await mongoose.connection.db.collection('users').insertMany([
        {
          name: 'Demo Admin',
          email: 'admin@shopez.com',
          password: await bcrypt.hash('admin123', salt),
          isAdmin: true,
          createdAt: new Date()
        },
        {
          name: 'Demo Customer',
          email: 'user@shopez.com',
          password: await bcrypt.hash('user123', salt),
          isAdmin: false,
          createdAt: new Date()
        }
      ]);
      console.log('Seeded initial users into MongoDB.');
    }
  } catch (err) {
    console.error('\x1b[31m%s\x1b[0m', 'MongoDB connection failed. Falling back to local JSON database.', err.message);
    isFallbackMode = true;
    loadLocalDB();
  }
}

// Generate unique ID helper
function generateId(prefix = '') {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 7)}`;
}

// Modular database methods exposing same signature
const db = {
  connect: connectDB,
  isFallback: () => isFallbackMode,

  users: {
    find: async () => {
      if (isFallbackMode) return localDB.users;
      return mongoose.connection.db.collection('users').find().toArray();
    },
    findOne: async (query) => {
      if (isFallbackMode) {
        return localDB.users.find(u => {
          for (let key in query) {
            if (u[key] !== query[key]) return false;
          }
          return true;
        }) || null;
      }
      return mongoose.connection.db.collection('users').findOne(query);
    },
    findById: async (id) => {
      if (isFallbackMode) {
        return localDB.users.find(u => u._id === id) || null;
      }
      return mongoose.connection.db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(id) });
    },
    create: async (userData) => {
      if (isFallbackMode) {
        const newUser = {
          _id: generateId('user'),
          ...userData,
          createdAt: new Date().toISOString()
        };
        localDB.users.push(newUser);
        saveLocalDB();
        return newUser;
      }
      const result = await mongoose.connection.db.collection('users').insertOne({
        ...userData,
        createdAt: new Date()
      });
      return { _id: result.insertedId, ...userData };
    }
  },

  products: {
    find: async (filters = {}) => {
      if (isFallbackMode) {
        let list = [...localDB.products];
        if (filters.category) {
          list = list.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          list = list.filter(p => 
            p.name.toLowerCase().includes(searchLower) || 
            p.description.toLowerCase().includes(searchLower)
          );
        }
        return list;
      }
      
      const query = {};
      if (filters.category) query.category = new RegExp(`^${filters.category}$`, 'i');
      if (filters.search) {
        query.$or = [
          { name: new RegExp(filters.search, 'i') },
          { description: new RegExp(filters.search, 'i') }
        ];
      }
      return mongoose.connection.db.collection('products').find(query).toArray();
    },
    findById: async (id) => {
      if (isFallbackMode) {
        return localDB.products.find(p => p._id === id) || null;
      }
      try {
        return await mongoose.connection.db.collection('products').findOne({ _id: id.startsWith('prod_') ? id : new mongoose.Types.ObjectId(id) });
      } catch (err) {
        return await mongoose.connection.db.collection('products').findOne({ _id: id });
      }
    },
    create: async (productData) => {
      if (isFallbackMode) {
        const newProduct = {
          _id: generateId('prod'),
          rating: 5,
          reviews: [],
          ...productData,
          price: Number(productData.price),
          stock: Number(productData.stock)
        };
        localDB.products.push(newProduct);
        saveLocalDB();
        return newProduct;
      }
      const prod = {
        rating: 5,
        reviews: [],
        ...productData,
        price: Number(productData.price),
        stock: Number(productData.stock)
      };
      const result = await mongoose.connection.db.collection('products').insertOne(prod);
      return { _id: result.insertedId, ...prod };
    },
    findByIdAndUpdate: async (id, updateData) => {
      if (isFallbackMode) {
        const index = localDB.products.findIndex(p => p._id === id);
        if (index === -1) return null;
        localDB.products[index] = {
          ...localDB.products[index],
          ...updateData,
          price: updateData.price !== undefined ? Number(updateData.price) : localDB.products[index].price,
          stock: updateData.stock !== undefined ? Number(updateData.stock) : localDB.products[index].stock
        };
        saveLocalDB();
        return localDB.products[index];
      }
      
      const queryId = id.startsWith('prod_') ? id : new mongoose.Types.ObjectId(id);
      const updateObj = { ...updateData };
      if (updateObj.price !== undefined) updateObj.price = Number(updateObj.price);
      if (updateObj.stock !== undefined) updateObj.stock = Number(updateObj.stock);
      
      await mongoose.connection.db.collection('products').updateOne(
        { _id: queryId },
        { $set: updateObj }
      );
      return mongoose.connection.db.collection('products').findOne({ _id: queryId });
    },
    findByIdAndDelete: async (id) => {
      if (isFallbackMode) {
        const index = localDB.products.findIndex(p => p._id === id);
        if (index === -1) return false;
        localDB.products.splice(index, 1);
        saveLocalDB();
        return true;
      }
      const queryId = id.startsWith('prod_') ? id : new mongoose.Types.ObjectId(id);
      const result = await mongoose.connection.db.collection('products').deleteOne({ _id: queryId });
      return result.deletedCount > 0;
    }
  },

  orders: {
    find: async (query = {}) => {
      if (isFallbackMode) {
        let list = [...localDB.orders];
        if (query.userId) {
          list = list.filter(o => o.userId === query.userId);
        }
        // Sort by date descending
        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
      return mongoose.connection.db.collection('orders').find(query).sort({ createdAt: -1 }).toArray();
    },
    create: async (orderData) => {
      if (isFallbackMode) {
        const newOrder = {
          _id: generateId('order'),
          status: 'Placed',
          createdAt: new Date().toISOString(),
          ...orderData
        };
        localDB.orders.push(newOrder);
        // Decrease stock for each item
        orderData.items.forEach(item => {
          const product = localDB.products.find(p => p._id === item.productId);
          if (product) {
            product.stock = Math.max(0, product.stock - item.quantity);
          }
        });
        saveLocalDB();
        return newOrder;
      }
      const order = {
        status: 'Placed',
        createdAt: new Date(),
        ...orderData
      };
      const result = await mongoose.connection.db.collection('orders').insertOne(order);
      
      // Decrease stock in MongoDB
      for (const item of orderData.items) {
        const queryId = item.productId.startsWith('prod_') ? item.productId : new mongoose.Types.ObjectId(item.productId);
        await mongoose.connection.db.collection('products').updateOne(
          { _id: queryId },
          { $inc: { stock: -item.quantity } }
        );
      }
      
      return { _id: result.insertedId, ...order };
    },
    findByIdAndUpdate: async (id, status) => {
      if (isFallbackMode) {
        const index = localDB.orders.findIndex(o => o._id === id);
        if (index === -1) return null;
        localDB.orders[index].status = status;
        saveLocalDB();
        return localDB.orders[index];
      }
      const queryId = id.startsWith('order_') ? id : new mongoose.Types.ObjectId(id);
      await mongoose.connection.db.collection('orders').updateOne(
        { _id: queryId },
        { $set: { status: status } }
      );
      return mongoose.connection.db.collection('orders').findOne({ _id: queryId });
    }
  }
};

module.exports = db;

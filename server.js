require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes'); // if you have this

const app = express();

// ✅ CORS setup (only for GitHub Pages now)
app.use(cors({
  origin: 'https://hzfhzf137.github.io',
  credentials: true
}));

// ✅ Global CORS Headers (required for preflight responses)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://hzfhzf137.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // Only if this file exists

// ✅ Connect to MongoDB and Start Server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

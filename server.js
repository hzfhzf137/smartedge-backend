require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS setup for GitHub Pages
app.use(cors({
  origin: 'https://hzfhzf137.github.io',
  credentials: true,
}));

// ✅ Basic test route
app.get('/', (req, res) => {
  res.send('SmartEdge Backend is running ✅');
});

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

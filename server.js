require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const verifyToken = require('./middleware/verifyToken');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');



const app = express();

// ✅ CORS setup for GitHub Pages

app.use(cors({
  origin: 'https://hzfhzf137.github.io',
  credentials: true
}));

// ✅ CORS setup for local machine Pages

// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true
// }));

// code for github

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://hzfhzf137.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// code for local machine

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   next();
// });

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Test route for checking server status
app.get('/', (req, res) => {
  res.send('🟢 SmartEdge backend is running!');
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', verifyToken, cartRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);




// ✅ Catch-all route for undefined paths
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error('❌ Internal error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ✅ MongoDB + Server Start
const PORT = 5000; // Railway custom port

// Optional: Log unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });



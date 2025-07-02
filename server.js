// code for railway backend

// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');

// const authRoutes = require('./routes/authRoutes');
// const productRoutes = require('./routes/productRoutes');

// const app = express();

// // ✅ CORS setup for GitHub Pages
// app.use(cors({
//   origin: 'https://hzfhzf137.github.io',
//   credentials: true
// }));

// // ✅ Global CORS Headers for preflight
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'https://hzfhzf137.github.io');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   res.setHeader('Access-Control-Allow-Credentials', 'true');
//   next();
// });

// // ✅ Middlewares
// app.use(express.json());
// app.use(cookieParser());

// // ✅ Test route for checking server status
// app.get('/', (req, res) => {
//   res.send('🟢 SmartEdge backend is running!');
// });

// // ✅ Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);

// // ✅ MongoDB and server startup
// const PORT = 5000; // Railway custom port

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => {
//     console.log('✅ MongoDB connected');
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('❌ MongoDB connection error:', err);
//     process.exit(1); // Show error clearly in Railway logs
//   });




//code for local machine server

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes'); // ✅ Cart Routes
const verifyToken = require('./middleware/verifyToken'); // ✅ Auth Middleware

const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://hzfhzf137.github.io'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Health Check
app.get('/', (req, res) => {
  res.send('🟢 SmartEdge backend is running!');
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', verifyToken, cartRoutes); // ✅ Protected

// ✅ Connect to MongoDB and Start Server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  imageUrl: String,
  modelUrl: String // For 3D model if needed
});

module.exports = mongoose.model('Product', productSchema);

// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cartItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number,
    }
  ],
  shippingDetails: {
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    phone: String,
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cod'],
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: Date,
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);

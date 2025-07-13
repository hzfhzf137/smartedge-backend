// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const verifyToken = require("../middleware/verifyToken"); // ✅ Needed for auth

// ✅ POST /api/orders (protected)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { cartItems, shippingDetails, paymentMethod } = req.body;

    if (!cartItems || !shippingDetails || !paymentMethod) {
      return res.status(400).json({ error: "Missing required order fields" });
    }

    const newOrder = new Order({
      userId: req.userId,
      cartItems, // ✅ This must match the schema key!
      shippingDetails,
      paymentMethod,
      isPaid: paymentMethod === 'card' ? true : false,
      paidAt: paymentMethod === 'card' ? new Date() : null,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ order: savedOrder });
  } catch (error) {
    console.error("❌ Failed to create order:", error.message);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// ✅ GET /api/orders/:orderId
router.get("/:orderId", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    console.error("❌ Failed to fetch order:", error.message);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

module.exports = router;

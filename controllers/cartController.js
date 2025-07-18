const Cart = require('../models/cart');

// GET Cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(200).json({ cart: [] }); // Return empty cart array
    }

    res.status(200).json({ cart: cart.items });
  } catch (err) {
    console.error('❌ Error fetching cart:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// SAVE/UPDATE Cart
exports.saveCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;
    const { cart } = req.body;

    if (!Array.isArray(cart)) {
      return res.status(400).json({ message: 'Invalid cart format' });
    }

    const transformedCart = cart.map(item => ({
      productId: item.id || item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
    }));

    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { items: transformedCart },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Cart saved', cart: updatedCart.items });
  } catch (err) {
    console.error('❌ Error saving cart:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// CLEAR Cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId;

    await Cart.findOneAndDelete({ userId });
    res.status(200).json({ message: 'Cart cleared' });
  } catch (err) {
    console.error('❌ Error clearing cart:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

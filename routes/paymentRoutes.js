const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // ✅ Secret key from .env

// @route   POST /api/payments/create-checkout-session
router.post("/create-checkout-session", async (req, res) => {
  const { cartItems, shippingDetails } = req.body;

  try {
    // ✅ Convert each cart item into Stripe line item
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // cents
      },
      quantity: item.quantity,
    }));

    // ✅ Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: process.env.FRONT_END_URL_SUCCESS, // ✅ Redirect to /success
      cancel_url: process.env.FRONT_END_URL_CANCEL,   // ✅ Redirect to /checkout with ?canceled=true
      metadata: {
        fullName: shippingDetails.fullName,
        address: shippingDetails.address,
        city: shippingDetails.city,
        postalCode: shippingDetails.postalCode,
        phone: shippingDetails.phone,
      },
    });

    // ✅ Return Checkout URL to frontend
    res.status(200).json({ url: session.url });

  } catch (error) {
    console.error("❌ Stripe session creation failed:", error.message);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
});

module.exports = router;

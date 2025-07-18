//backend//routes//paymentRoutes.js

const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/create-checkout-session
router.post("/create-checkout-session", async (req, res) => {
  const { cartItems, shippingDetails } = req.body;

  try {
    // Stripe line items (price in cents)
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Convert USD to cents
      },
      quantity: item.quantity,
    }));

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      success_url: `${process.env.FRONT_END_URL_SUCCESS}`,
      cancel_url: `${process.env.FRONT_END_URL_CANCEL}`,
      metadata: {
        fullName: shippingDetails.fullName,
        address: shippingDetails.address,
        city: shippingDetails.city,
        postalCode: shippingDetails.postalCode,
        phone: shippingDetails.phone,
      },
    });

    // Return session URL to client
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe session creation failed:", error.message);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
});

module.exports = router;

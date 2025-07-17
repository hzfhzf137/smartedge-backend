const express = require('express');
const router = express.Router();
const axios = require('axios');
const ChatMessage = require('../models/chatMessage');
const verifyToken = require('../middleware/verifyToken');

require('dotenv').config();


// POST /api/chatbot - Send a message and get reply
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Save user's message to MongoDB
    await ChatMessage.create({
      user: userId,
      sender: "user",
      text: message,
    });

    // Send message to OpenRouter code for local machine
    // const openRouterResponse = await axios.post(
    //   "https://openrouter.ai/api/v1/chat/completions",
    //   {
    //     model: "mistralai/mixtral-8x7b-instruct", // You can change model
    //     messages: [
    //       { role: "system", content: "You are a helpful assistant for Smart Edge customers." },
    //       { role: "user", content: message }
    //     ]
    //   },
    //   {
    //     headers: {
    //       "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
    //       "Content-Type": "application/json",
    //       "HTTP-Referer": "http://localhost:5173", // Required by OpenRouter
    //       "X-Title": "SmartEdge Chatbot"
    //     }
    //   }
    // );



    // // Send message to OpenRouter  code for github
    const openRouterResponse = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mixtral-8x7b-instruct", // You can change model
        messages: [
          { role: "system", content: "You are a helpful assistant for Smart Edge customers." },
          { role: "user", content: message }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://hzfhzf137.github.io/smart-edge", // Required by OpenRouter
          "X-Title": "SmartEdge Chatbot"
        }
      }
    );


    // console.log("ENV OPENROUTER KEY:", process.env.OPENROUTER_API_KEY);


    const botReply = openRouterResponse.data.choices[0].message.content;

    // Save bot's response
    await ChatMessage.create({
      user: userId,
      sender: "bot",
      text: botReply,
    });

    res.json({ reply: botReply });
  } catch (err) {
    console.error("Chatbot error:", err.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to get response from chatbot." });
  }
});

// GET /api/chatbot - Get chat history for logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await ChatMessage.find({ user: userId }).sort({ timestamp: 1 });

    res.json({ messages });
  } catch (err) {
    console.error("Fetch chat history error:", err);
    res.status(500).json({ error: "Failed to fetch chat history." });
  }
});

// DELETE /api/chatbot - Clear chat history for the logged-in user
router.delete('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    await ChatMessage.deleteMany({ user: userId });
    res.json({ message: "Chat history deleted successfully." });
  } catch (err) {
    console.error("Failed to delete chat history:", err);
    res.status(500).json({ error: "Failed to delete chat history." });
  }
});

module.exports = router;

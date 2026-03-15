const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Groq = require("groq-sdk");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://farhans-chatbot.vercel.app"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
console.log("API Key loaded:", process.env.GROQ_API_KEY ? "YES" : "NO");

app.get("/", (req, res) => {
  res.json({ status: "Server is working!" });
});

app.post("/chat", async (req, res) => {
  console.log("chat hit!");
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    console.log("Calling Groq...");
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: message }],
      max_tokens: 1024,
    });

    const reply = response.choices[0].message.content;
    console.log("Reply:", reply);
    res.json({ reply });
  } catch (err) {
    console.error("ERROR STATUS:", err.status);
    console.error("ERROR MESSAGE:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server running on port " + PORT));
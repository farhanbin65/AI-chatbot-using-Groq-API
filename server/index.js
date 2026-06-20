const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Groq = require("groq-sdk");

const app = express();
const PORT = process.env.PORT || 3001;
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

app.use(cors({
  origin: CLIENT_ORIGIN.split(",").map((origin) => origin.trim()),
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json({ limit: "1mb" }));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemPrompt = `
You are Farhan AI Assistant, a helpful portfolio assistant for Farhan Bin Hossain.
Be concise, friendly, and practical. Help visitors understand Farhan's skills,
projects, and experience. If you do not know something, say so clearly.
`.trim();

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Farhan AI Assistant API",
    model: MODEL
  });
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "Server is missing GROQ_API_KEY." });
  }

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  if (message.length > 4000) {
    return res.status(400).json({ error: "Message is too long" });
  }

  try {
    const response = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message.trim() }
      ],
      max_tokens: 1024
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error("Groq request failed:", err.message);
    res.status(500).json({ error: "AI service is unavailable. Please try again later." });
  }
});

app.listen(PORT, () => console.log("Server running on port " + PORT));

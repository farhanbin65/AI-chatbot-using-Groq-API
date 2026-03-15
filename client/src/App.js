import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! I'm your AI assistant. Ask me anything — I'm here to help." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("https://ai-chatbot-using-groq-api.onrender.com/chat", { message: input });
      setMessages((prev) => [...prev, { role: "bot", text: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Error getting response. Try again." }]);
    }
    setLoading(false);
  };

  const copyText = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="chat-wrap">
      <div className="sidebar">
        <div className="logo-area">
          <img src="/your-logo.png" alt="logo" className="logo-img" onError={(e) => e.target.style.display='none'} />
          <div>
            <div className="logo-text">Farhan's Bot</div>
            <div className="logo-sub">powered by Groq</div>
          </div>
        </div>
        <div className="new-chat" onClick={() => setMessages([{ role: "bot", text: "Hello! How can I help you?" }])}>
          <span>+</span> New chat
        </div>
        <div className="sidebar-label">Recent</div>
        <div className="chat-item active">Current conversation</div>
      </div>

      <div className="main">
        <div className="top-bar">
          <span className="top-bar-title">New conversation</span>
          <span className="model-badge">llama-3.3-70b</span>
        </div>

        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`msg-row ${msg.role}`}>
              <div className={`avatar ${msg.role}`}>{msg.role === "bot" ? "AI" : "U"}</div>
              <div className="bubble-wrap">
                <div className={`bubble ${msg.role}`}>{msg.text}</div>
                {msg.role === "bot" && (
                  <div className="copy-btn" onClick={() => copyText(msg.text, i)}>
                    {copied === i ? "✓ copied" : "copy"}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="msg-row bot">
              <div className="avatar bot">AI</div>
              <div className="typing"><div className="dot"/><div className="dot"/><div className="dot"/></div>
            </div>
          )}
        </div>

        <div className="input-area">
          <div className="input-box">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Message MyBot..."
            />
            <button className="send-btn" onClick={sendMessage} disabled={loading}>
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
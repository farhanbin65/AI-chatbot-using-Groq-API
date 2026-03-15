import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! I'm Farhan's AI assistant. Ask me anything — I'm here to help." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("https://farhans-chatbot.onrender.com/chat", { message: input });
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

  const newChat = () => {
    setMessages([{ role: "bot", text: "Hello! I'm Farhan's AI assistant. Ask me anything!" }]);
    setSidebarOpen(false);
  };

  return (
    <div className="chat-wrap">

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo-area">
          <img src="/your-logo.png" alt="logo" className="logo-img" onError={(e) => e.target.style.display='none'} />
          <div>
            <div className="logo-text">Farhans Chatbot</div>
            <div className="logo-sub">powered by Groq</div>
          </div>
          {/* Close button inside sidebar on mobile */}
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <div className="new-chat" onClick={newChat}>
          <span>+</span> New chat
        </div>
        <div className="sidebar-label">Recent</div>
        <div className="chat-item active">Current conversation</div>
      </div>

      {/* Main */}
      <div className="main">

        {/* Top bar */}
        <div className="top-bar">
          <div className="top-bar-left">
            <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <span /><span /><span />
            </button>
            <span className="top-bar-title">Farhans Chatbot</span>
          </div>
          <span className="model-badge">llama-3.3-70b</span>
        </div>

        {/* Messages */}
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

        {/* Input */}
        <div className="input-area">
          <div className="input-box">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Message Farhans Chatbot..."
            />
            <button className="send-btn" onClick={sendMessage} disabled={loading}>➤</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
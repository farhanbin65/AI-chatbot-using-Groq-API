import { useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";
const WELCOME_MESSAGE =
  "Hello! I'm Farhan's AI assistant. Ask me about Farhan's projects, skills, or experience.";

function App() {
  const [messages, setMessages] = useState([
    { role: "bot", text: WELCOME_MESSAGE }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const messageText = input.trim();
    const userMessage = { role: "user", text: messageText };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/chat`, { message: messageText });
      setMessages((prev) => [...prev, { role: "bot", text: res.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "I could not reach the AI service. Please try again in a moment." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const newChat = () => {
    setMessages([{ role: "bot", text: WELCOME_MESSAGE }]);
    setSidebarOpen(false);
  };

  return (
    <div className="chat-wrap">
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo-area">
          <img
            src="/carla.png"
            alt="Farhan AI Assistant"
            className="logo-img"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <div>
            <div className="logo-text">Farhan AI Assistant</div>
            <div className="logo-sub">powered by Groq</div>
          </div>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            x
          </button>
        </div>

        <button className="new-chat" onClick={newChat}>
          <span>+</span> New chat
        </button>

        <div className="sidebar-label">Recent</div>
        <div className="chat-item active">Current conversation</div>
      </div>

      <div className="main">
        <div className="top-bar">
          <div className="top-bar-left">
            <button
              className="hamburger"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <span />
              <span />
              <span />
            </button>
            <span className="top-bar-title">Farhan AI Assistant</span>
          </div>
          <span className="model-badge">llama-3.3-70b</span>
        </div>

        <div className="messages">
          {messages.map((msg, i) => (
            <div key={`${msg.role}-${i}`} className={`msg-row ${msg.role}`}>
              <div className={`avatar ${msg.role}`}>{msg.role === "bot" ? "AI" : "U"}</div>
              <div className="bubble-wrap">
                <div className={`bubble ${msg.role}`}>{msg.text}</div>
                {msg.role === "bot" && (
                  <button className="copy-btn" onClick={() => copyText(msg.text, i)}>
                    {copied === i ? "copied" : "copy"}
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="msg-row bot">
              <div className="avatar bot">AI</div>
              <div className="typing">
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </div>
            </div>
          )}
        </div>

        <div className="input-area">
          <div className="input-box">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Message Farhan AI Assistant..."
            />
            <button className="send-btn" onClick={sendMessage} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

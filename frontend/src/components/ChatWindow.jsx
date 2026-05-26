import { useEffect, useRef, useState, useContext } from "react";
import { socket } from "../socket";
import axios from "axios";
import { AppContext } from "../context/AppContext";

/* eslint-disable react/prop-types */
const AVATAR_PALETTES = [
  { bg: "#ede9fe", color: "#7c3aed" },
  { bg: "#fce7f3", color: "#be185d" },
  { bg: "#dbeafe", color: "#1d4ed8" },
  { bg: "#dcfce7", color: "#15803d" },
  { bg: "#fef9c3", color: "#92400e" },
  { bg: "#fce7f3", color: "#9d174d" },
];

function getPalette(name = "") {
  return AVATAR_PALETTES[name.charCodeAt(0) % AVATAR_PALETTES.length];
}

function getInitials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWindow({ chat, onBack }) {
  const { backendUrl } = useContext(AppContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [partnerOnline, setPartnerOnline] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingRef = useRef(null);

  const roomId = chat._id;
  const user = chat.userData?.name || "You";
  const docName = chat.docData?.name || "Doctor";
  const docPalette = getPalette(docName);
  const userPalette = getPalette(user + "x");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric"
  });

  // FIX 1: dependency array includes roomId so this re-runs when switching chats
  // FIX 2: named handler refs so we only remove OUR listeners on cleanup
  // FIX 3: typing uses clearTimeout (was a no-op before)
  // FIX 4: receive_message filters by roomId (safe guard)
  useEffect(() => {
    setMessages([]);
    setPartnerOnline(false);
    socket.emit("join_room", roomId);
    fetchHistory();

    // Tell server this user is actively viewing this chat
    socket.emit("user_online", { roomId, name: user, role: "user" });
    // Mark all incoming messages as seen immediately on open
    socket.emit("mark_seen", { roomId, readerName: user });

    const onMessage = (data) => {
      if (data.roomId !== roomId) return;
      setMessages(prev => [...prev, { ...data, isMe: data.sender === user, seen: false }]);
      setIsTyping(false);
      // Mark this new incoming message as seen right away (window is open)
      socket.emit("mark_seen", { roomId, readerName: user });
    };

    const onTyping = ({ roomId: tRoomId }) => {
      if (tRoomId !== roomId) return;
      setIsTyping(true);
      clearTimeout(typingRef.current);
      typingRef.current = setTimeout(() => setIsTyping(false), 2000);
    };

    const onPartnerOnline = ({ online }) => setPartnerOnline(online);

    // When partner reads our messages, flip all outgoing messages to seen
    const onMessagesSeen = ({ roomId: seenRoomId }) => {
      if (seenRoomId !== roomId) return;
      setMessages(prev => prev.map(m => m.isMe ? { ...m, seen: true } : m));
    };

    socket.on("receive_message", onMessage);
    socket.on("typing", onTyping);
    socket.on("partner_online", onPartnerOnline);
    socket.on("messages_seen", onMessagesSeen);

    return () => {
      socket.emit("user_offline", { roomId, name: user });
      socket.off("receive_message", onMessage);
      socket.off("typing", onTyping);
      socket.off("partner_online", onPartnerOnline);
      socket.off("messages_seen", onMessagesSeen);
      clearTimeout(typingRef.current);
    };
  }, [roomId]);

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/chat/messages/${roomId}`,
        { withCredentials: true }
      );
      if (data.success) {
        setMessages(
          data.messages.map(m => ({
            roomId: m.roomId,
            message: m.message,
            sender: m.sender,
            time: new Date(m.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isMe: m.sender === user,
            seen: m.seen,
          }))
        );
      }
    } catch { /* silent */ }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!message.trim()) return;
    // FIX: do NOT include isMe in the socket payload — receiver would get isMe:true wrongly
    // We add it locally so the sender sees it as their own bubble
    const msg = {
      roomId,
      message: message.trim(),
      sender: user,
      senderType: "user",
      time: now(),
    };
    socket.emit("send_message", msg);
    // Server uses socket.to() — sender won't receive it back, so add locally only
    setMessages(prev => [...prev, { ...msg, isMe: true }]);
    setMessage("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    socket.emit("typing", { roomId });
  };

  return (
    <div className="chat-window">

      {/* HEADER */}
      <div className="chat-header">
        <button className="back-btn" onClick={onBack} title="Back">
          ‹
        </button>

        <div
          className="header-avatar"
          style={{ background: docPalette.bg, color: docPalette.color }}
        >
          {getInitials(docName)}
        </div>

        <div className="header-info">
          <div className="header-name">{docName}</div>
          <div className="header-status" style={{ color: partnerOnline ? "var(--green)" : "var(--text-muted)" }}>
            <div className="status-dot" style={{ background: partnerOnline ? "var(--green)" : "#94a3b8" }} />
            {partnerOnline ? "Online" : "Offline"}
          </div>
        </div>

        <div className="header-actions">
          <button className="icon-btn" title="Video call">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
          </button>
          <button className="icon-btn" title="Call">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
          </button>
          <button className="icon-btn" title="More">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
            </svg>
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="messages-area">
        <div className="date-divider">{today}</div>

        {messages.length === 0 && (
          <div style={{
            textAlign: "center", padding: "40px 20px",
            color: "var(--text-muted)", lineHeight: 1.8
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👋</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 6 }}>
              Say hello!
            </div>
            <div style={{ fontSize: 13.5 }}>
              Your appointment with{" "}
              <strong style={{ color: "var(--purple-500)" }}>{docName}</strong> is confirmed.
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.isMe;
          const palette = isMe ? userPalette : docPalette;
          const showAvatar = !isMe && (i === 0 || messages[i - 1]?.sender !== msg.sender);

          return (
            <div key={i} className={`message-row${isMe ? " me" : ""}`}>
              {!isMe && (
                <div
                  className="msg-avatar"
                  style={{
                    background: showAvatar ? palette.bg : "transparent",
                    color: palette.color,
                    visibility: showAvatar ? "visible" : "hidden",
                  }}
                >
                  {showAvatar ? getInitials(msg.sender || docName) : ""}
                </div>
              )}

              <div className={`bubble${isMe ? " me" : " them"}`}>
                {!isMe && showAvatar && (
                  <div className="bubble-sender">{msg.sender || docName}</div>
                )}
                <div>{msg.message}</div>
                <div className="bubble-footer">
                  <span className="bubble-time">{msg.time || now()}</span>
                  {isMe && (
                    <span
                      className="tick"
                      style={{ color: msg.seen ? "#93c5fd" : "rgba(255,255,255,0.55)" }}
                      title={msg.seen ? "Seen" : "Delivered"}
                    >✓✓</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="typing-indicator">
            <div
              className="msg-avatar"
              style={{ background: docPalette.bg, color: docPalette.color }}
            >
              {getInitials(docName)}
            </div>
            <div className="typing-bubble">
              <div className="typing-dots">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="input-area">
        <button className="attach-btn" title="Attach">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>

        <div className="message-input-wrap">
          <button className="emoji-btn">😊</button>
          <textarea
            ref={inputRef}
            className="message-input"
            placeholder="Type a message…"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={1}
          />
        </div>

        <button className="send-btn" onClick={sendMessage} disabled={!message.trim()} title="Send">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ transform: "translateX(1px)" }}>
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>

    </div>
  );
}

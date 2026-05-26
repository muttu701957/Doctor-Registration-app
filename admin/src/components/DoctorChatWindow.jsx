import { useEffect, useRef, useState, useContext } from "react";
import { socket } from "../socket";
import axios from "axios";
import { DoctorContext } from "../context/DoctorContest";

/* eslint-disable react/prop-types */
const AVATAR_PALETTES = [
  { bg: "#ede9fe", color: "#7c3aed" },
  { bg: "#fce7f3", color: "#be185d" },
  { bg: "#dbeafe", color: "#1d4ed8" },
  { bg: "#dcfce7", color: "#15803d" },
  { bg: "#fef9c3", color: "#92400e" },
  { bg: "#fff1f2", color: "#e11d48" },
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

const QUICK_REPLIES = [
  "Hello! How are you feeling today?",
  "Please take the medicine as prescribed.",
  "Your reports look normal. 👍",
  "Come in for a follow-up next week.",
  "Drink plenty of water and rest well.",
];

export default function DoctorChatWindow({ chat, onBack }) {
  const { backendUrl, dToken } = useContext(DoctorContext);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [partnerOnline, setPartnerOnline] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingRef = useRef(null); // FIX: was missing — caused clearTimeout to fail

  const roomId = chat._id;
  const doctor = chat.docData?.name || "Doctor";
  const patient = chat.userData?.name || "Patient";
  const patientPalette = getPalette(patient);
  const doctorPalette = { bg: "#ede9fe", color: "#7c3aed" };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  // FIX: dep array is [roomId] so it re-runs when switching patients
  // FIX: named handlers so only our listeners are removed on cleanup
  // FIX: typing listener added (was completely missing before)
  useEffect(() => {
    setMessages([]);
    setPartnerOnline(false);
    setShowQuickReplies(true); // reset per room; fetchHistory will hide if msgs exist
    socket.emit("join_room", roomId);
    fetchHistory();

    socket.emit("user_online", { roomId, name: doctor, role: "doctor" });
    socket.emit("mark_seen", { roomId, readerName: doctor });

    const onMessage = (data) => {
      if (data.roomId !== roomId) return;
      setMessages(prev => [...prev, { ...data, isMe: data.sender === doctor, seen: false }]);
      setIsTyping(false);
      socket.emit("mark_seen", { roomId, readerName: doctor });
    };

    const onTyping = ({ roomId: tRoomId }) => {
      if (tRoomId !== roomId) return;
      setIsTyping(true);
      clearTimeout(typingRef.current);
      typingRef.current = setTimeout(() => setIsTyping(false), 2000);
    };

    const onPartnerOnline = ({ online }) => setPartnerOnline(online);

    const onMessagesSeen = ({ roomId: seenRoomId }) => {
      if (seenRoomId !== roomId) return;
      setMessages(prev => prev.map(m => m.isMe ? { ...m, seen: true } : m));
    };

    socket.on("receive_message", onMessage);
    socket.on("typing", onTyping);
    socket.on("partner_online", onPartnerOnline);
    socket.on("messages_seen", onMessagesSeen);

    return () => {
      socket.emit("user_offline", { roomId, name: doctor });
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
        { headers: { dtoken: dToken } }
      );
      if (data.success) {
        const msgs = data.messages.map(m => ({
          roomId: m.roomId,
          message: m.message,
          sender: m.sender,
          time: new Date(m.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMe: m.sender === doctor,
          seen: m.seen,
        }));
        setMessages(msgs);
        // Hide quick replies if the conversation already has messages
        if (msgs.length > 0) setShowQuickReplies(false);
      }
    } catch { /* silent */ }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const content = text || message;
    if (!content.trim()) return;

    // FIX: no isMe in socket payload — receiver would incorrectly get isMe:true
    const msg = {
      roomId,
      message: content.trim(),
      sender: doctor,
      senderType: "doctor",
      time: now(),
    };

    socket.emit("send_message", msg);
    // Server uses socket.to() — sender won't receive it back, add locally only
    setMessages(prev => [...prev, { ...msg, isMe: true }]);
    setMessage("");
    setShowQuickReplies(false);
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
    <div className="doc-chat-window">

      {/* HEADER */}
      <div className="doc-chat-header">
        <button className="doc-back-btn" onClick={onBack} title="Back">‹</button>

        <div
          className="doc-header-avatar"
          style={{ background: patientPalette.bg, color: patientPalette.color }}
        >
          {getInitials(patient)}
        </div>

        <div className="doc-header-info">
          <div className="doc-header-name">{patient}</div>
          <div className="doc-header-meta">
            <div className="doc-header-status" style={{ color: partnerOnline ? "var(--green)" : "var(--text-muted)" }}>
              <div className="doc-status-dot" style={{ background: partnerOnline ? "var(--green)" : "#94a3b8" }} />
              {partnerOnline ? "Online" : "Offline"}
            </div>
            <div className="doc-header-appt">
              📅 {chat.slotDate} · {chat.slotTime}
            </div>
          </div>
        </div>

        <div className="doc-header-actions">
          <button className="doc-icon-btn" title="Video call">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
          </button>
          <button className="doc-icon-btn" title="View patient profile">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </button>
          <button className="doc-icon-btn" title="Share prescription">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 13h8v1.5H8V13zm0 3h8v1.5H8V16zm0-6h4v1.5H8V10z"/>
            </svg>
          </button>
          <button className="doc-icon-btn danger" title="End conversation">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* PATIENT INFO BANNER */}
      <div className="doc-patient-banner">
        <div className="doc-banner-icon">🏥</div>
        <div className="doc-banner-info">
          <div className="doc-banner-title">Appointment Details</div>
          <div className="doc-banner-sub">
            {chat.slotDate} at {chat.slotTime} · Booking #{chat._id?.slice(-6).toUpperCase()}
          </div>
        </div>
        <div className="doc-banner-chip">
          {chat.isCompleted ? "✅ Completed" : "🔔 Upcoming"}
        </div>
      </div>

      {/* MESSAGES */}
      <div className="doc-messages-area">
        <div className="doc-date-divider">{today}</div>

        {messages.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "32px 20px",
            color: "var(--text-muted)",
            lineHeight: 1.8,
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👨‍⚕️</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 6 }}>
              Start the consultation
            </div>
            <div style={{ fontSize: 13.5 }}>
              Use the quick replies below or type a message to{" "}
              <strong style={{ color: "var(--purple-500)" }}>{patient}</strong>
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.isMe;
          const palette = isMe ? doctorPalette : patientPalette;
          const showAvatar = !isMe && (i === 0 || messages[i - 1]?.sender !== msg.sender);

          return (
            <div key={i} className={`doc-message-row${isMe ? " me" : ""}`}>
              {!isMe && (
                <div
                  className="doc-msg-avatar"
                  style={{
                    background: showAvatar ? palette.bg : "transparent",
                    color: palette.color,
                    visibility: showAvatar ? "visible" : "hidden",
                  }}
                >
                  {showAvatar ? getInitials(msg.sender || patient) : ""}
                </div>
              )}

              <div className={`doc-bubble${isMe ? " me" : " them"}`}>
                {!isMe && showAvatar && (
                  <div className="doc-bubble-sender">{msg.sender || patient}</div>
                )}
                <div>{msg.message}</div>
                <div className="doc-bubble-footer">
                  <span className="doc-bubble-time">{msg.time || now()}</span>
                  {isMe && (
                    <span
                      className="doc-tick"
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
          <div className="doc-typing-indicator">
            <div
              className="doc-msg-avatar"
              style={{ background: patientPalette.bg, color: patientPalette.color }}
            >
              {getInitials(patient)}
            </div>
            <div className="doc-typing-bubble">
              <div className="doc-typing-dots">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* QUICK REPLIES — only shown if no messages yet */}
      {showQuickReplies && (
        <div className="doc-quick-replies">
          {QUICK_REPLIES.map((qr, i) => (
            <button
              key={i}
              className="doc-quick-btn"
              onClick={() => sendMessage(qr)}
            >
              {qr}
            </button>
          ))}
        </div>
      )}

      {/* INPUT */}
      <div className="doc-input-area">
        <button className="doc-attach-btn" title="Attach file / report">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>

        <div className="doc-input-wrap">
          <button className="doc-emoji-btn" onClick={() => setShowQuickReplies(v => !v)} title="Quick replies">
            ⚡
          </button>
          <textarea
            ref={inputRef}
            className="doc-msg-input"
            placeholder="Type a message to your patient…"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            rows={1}
          />
        </div>

        <button
          className="doc-send-btn"
          onClick={() => sendMessage()}
          disabled={!message.trim()}
          title="Send"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ transform: "translateX(1px)" }}>
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>

    </div>
  );
}

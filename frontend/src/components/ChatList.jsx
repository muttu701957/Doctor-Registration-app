import { useEffect, useState, useContext } from "react";
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

function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7)  return d.toLocaleDateString([], { weekday: "short" });
  return d.toLocaleDateString([], { day: "numeric", month: "short" });
}

export default function ChatList({ onSelectChat }) {
  const { backendUrl } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchChats(); }, []);

  const fetchChats = async () => {
    setLoading(true);
    try {
      // 1. Fetch all booked appointments
      const { data: apptData } = await axios.get(`${backendUrl}/api/auth/appointments`, {
        withCredentials: true,
      });
      const allAppointments = apptData.appointments || [];

      if (!allAppointments.length) {
        setAppointments([]);
        return;
      }

      // 2. Ask backend which of these rooms have at least one message
      const roomIds = allAppointments.map(a => a._id);
      const { data: activeData } = await axios.post(
        `${backendUrl}/api/chat/active-rooms`,
        { roomIds },
        { withCredentials: true }
      );

      const activeRooms = activeData.activeRooms || {};

      // 3. Keep only appointments with actual messages, enrich with last-message metadata,
      //    and sort newest-message-first (same as WhatsApp / Messenger behaviour)
      const active = allAppointments
        .filter(a => activeRooms[a._id])
        .map(a => ({ ...a, _lastMsg: activeRooms[a._id] }))
        .sort((a, b) => new Date(b._lastMsg.lastTimestamp) - new Date(a._lastMsg.lastTimestamp));

      setAppointments(active);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const filtered = appointments.filter(item =>
    item.docData?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="sidebar-header">
        <span className="sidebar-title">Messages</span>
        {appointments.length > 0 && (
          <span className="sidebar-badge">{appointments.length}</span>
        )}
      </div>

      <div className="search-wrap">
        <input
          className="search-box"
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="chat-list-scroll">
        {loading ? (
          <div style={{ padding: "30px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "30px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13, lineHeight: 1.7 }}>
            {search
              ? "No results"
              : "No active chats yet.\nStart a conversation from your Appointments page."}
          </div>
        ) : (
          <>
            <div className="section-label">Active Chats</div>
            {filtered.map((item) => {
              const name = item.docData?.name || "Doctor";
              const { bg, color } = getPalette(name);
              const last = item._lastMsg;
              const preview = last?.lastMessage
                ? (last.lastMessage.length > 38
                    ? last.lastMessage.slice(0, 38) + "…"
                    : last.lastMessage)
                : `📅 ${item.slotDate}`;

              return (
                <div
                  key={item._id}
                  className="chat-item"
                  onClick={() => onSelectChat(item)}
                >
                  <div className="avatar">
                    <div className="avatar-inner" style={{ background: bg, color }}>
                      {getInitials(name)}
                    </div>
                  </div>

                  <div className="chat-item-info">
                    <div className="chat-item-name">{name}</div>
                    <div className="chat-item-sub">{preview}</div>
                  </div>

                  <div className="chat-item-meta">
                    <span className="chat-item-time">{formatTime(last?.lastTimestamp)}</span>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}

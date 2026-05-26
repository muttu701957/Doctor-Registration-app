import { useEffect, useState, useContext } from "react";
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

const FILTERS = ["All", "Upcoming", "Completed"];

export default function DoctorChatList({ onSelectChat, selectedChat }) {
  const { appointments, backendUrl, dToken } = useContext(DoctorContext);
  const [allPatients, setAllPatients] = useState([]); // all appointments enriched with last-msg data
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [filter, setFilter]           = useState("All");

  useEffect(() => {
    if (!appointments?.length) { setLoading(false); return; }

    // Join every appointment room so the doctor receives the first message from any patient
    const joinAllRooms = () => appointments.forEach(a => socket.emit("join_room", a._id));
    if (socket.connected) joinAllRooms();
    const handleConnect = () => joinAllRooms();
    socket.on("connect", handleConnect);

    // Enrich list with last-message data (for rooms that have messages)
    fetchLastMessages();

    return () => socket.off("connect", handleConnect);
  }, [appointments]);

  const fetchLastMessages = async () => {
    setLoading(true);
    try {
      const roomIds = appointments.map(a => a._id);
      const { data } = await axios.post(
        `${backendUrl}/api/chat/active-rooms`,
        { roomIds },
        { headers: { dtoken: dToken } }
      );

      const activeRooms = data.activeRooms || {};

      // ALL patients — enrich those with messages, leave the rest as-is
      const enriched = appointments.map(a => ({
        ...a,
        _lastMsg: activeRooms[a._id] || null,
      }));

      // Sort: patients with messages first (newest → oldest), then without (by appointment date)
      enriched.sort((a, b) => {
        if (a._lastMsg && b._lastMsg)
          return new Date(b._lastMsg.lastTimestamp) - new Date(a._lastMsg.lastTimestamp);
        if (a._lastMsg) return -1;
        if (b._lastMsg) return  1;
        return new Date(b.date) - new Date(a.date);
      });

      setAllPatients(enriched);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const filtered = allPatients.filter(item => {
    const matchSearch = item.userData?.name?.toLowerCase().includes(search.toLowerCase());
    if (filter === "Upcoming")  return matchSearch && !item.isCompleted && !item.cancelled;
    if (filter === "Completed") return matchSearch && item.isCompleted;
    return matchSearch;
  });

  // Stats
  const totalPatients = allPatients.length;
  const upcoming      = allPatients.filter(a => !a.isCompleted && !a.cancelled).length;
  const activeChats   = allPatients.filter(a => a._lastMsg).length;

  return (
    <>
      {/* HEADER */}
      <div className="doc-sidebar-header">
        <div className="doc-sidebar-icon">🩺</div>
        <div className="doc-sidebar-title-wrap">
          <div className="doc-sidebar-title">Patients</div>
        </div>
        {totalPatients > 0 && (
          <span className="doc-sidebar-badge">{totalPatients}</span>
        )}
      </div>

      {/* STATS STRIP */}
      <div className="doc-stats-strip">
        <div className="doc-stat">
          <div className="doc-stat-num">{totalPatients}</div>
          <div className="doc-stat-label">Total</div>
        </div>
        <div className="doc-stat">
          <div className="doc-stat-num">{upcoming}</div>
          <div className="doc-stat-label">Upcoming</div>
        </div>
        <div className="doc-stat">
          <div className="doc-stat-num">{activeChats}</div>
          <div className="doc-stat-label">Chats</div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="doc-search-wrap">
        <input
          className="doc-search-box"
          placeholder="Search patients…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* FILTER TABS */}
      <div style={{
        display: "flex", gap: "6px", padding: "10px 16px",
        borderBottom: "1.5px solid var(--border)"
      }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              flex: 1, padding: "7px 4px", borderRadius: "10px",
              border: "1.5px solid",
              borderColor: filter === f ? "var(--purple-400)" : "var(--border-strong)",
              background:  filter === f ? "var(--purple-100)" : "transparent",
              color:       filter === f ? "var(--purple-600)" : "var(--text-muted)",
              fontSize: "12px", fontWeight: "700", cursor: "pointer",
              fontFamily: "var(--font)", transition: "all 0.15s",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="doc-chat-list-scroll">
        {loading ? (
          <div style={{ padding: "30px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
            Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "30px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 13, lineHeight: 1.7 }}>
            {search ? "No patients found" : filter !== "All" ? `No ${filter.toLowerCase()} appointments` : "No appointments yet"}
          </div>
        ) : (
          <>
            {/* Active conversations section */}
            {filtered.some(i => i._lastMsg) && (
              <div className="doc-section-label">Active Chats</div>
            )}
            {filtered.filter(i => i._lastMsg).map(item => (
              <PatientRow
                key={item._id}
                item={item}
                isSelected={selectedChat?._id === item._id}
                onSelectChat={onSelectChat}
              />
            ))}

            {/* Patients without messages yet */}
            {filtered.some(i => !i._lastMsg) && (
              <div className="doc-section-label" style={{ marginTop: filtered.some(i => i._lastMsg) ? 8 : 0 }}>
                {filtered.some(i => i._lastMsg) ? "New Patients" : "All Patients"}
              </div>
            )}
            {filtered.filter(i => !i._lastMsg).map(item => (
              <PatientRow
                key={item._id}
                item={item}
                isSelected={selectedChat?._id === item._id}
                onSelectChat={onSelectChat}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
}

function PatientRow({ item, isSelected, onSelectChat }) {
  const name        = item.userData?.name || "Patient";
  const { bg, color } = getPalette(name);
  const isCompleted = item.isCompleted;
  const hasChat     = !!item._lastMsg;

  const preview = hasChat
    ? (item._lastMsg.lastMessage.length > 36
        ? item._lastMsg.lastMessage.slice(0, 36) + "…"
        : item._lastMsg.lastMessage)
    : `📅 ${item.slotDate} · ${item.slotTime}`;

  return (
    <div
      className="doc-chat-item"
      onClick={() => onSelectChat(item)}
      style={isSelected ? { background: "var(--purple-100)" } : undefined}
    >
      <div className="doc-avatar">
        <div className="doc-avatar-inner" style={{ background: bg, color }}>
          {getInitials(name)}
        </div>
      </div>

      <div className="doc-chat-item-info">
        <div className="doc-chat-item-name">{name}</div>
        <div className="doc-chat-item-sub">{preview}</div>
      </div>

      <div className="doc-chat-item-meta">
        <span className="doc-chat-item-time">
          {hasChat ? formatTime(item._lastMsg.lastTimestamp) : item.slotTime?.slice(0, 5)}
        </span>
        {hasChat ? (
          <span className={`doc-status-chip ${isCompleted ? "completed" : "upcoming"}`}>
            {isCompleted ? "Done" : "Soon"}
          </span>
        ) : (
          <span style={{
            fontSize: 10, fontWeight: 700, borderRadius: 8, padding: "2px 7px",
            background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0",
          }}>
            New
          </span>
        )}
      </div>
    </div>
  );
}

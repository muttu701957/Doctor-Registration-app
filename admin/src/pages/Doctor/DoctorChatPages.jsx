import { useState, useEffect, useContext } from "react";
import DoctorChatList from "../../components/DoctorChatList";
import DoctorChatWindow from "../../components/DoctorChatWindow";
import { DoctorContext } from "../../context/DoctorContest";


function DoctorChatPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const handleSelectChat = (chat) => setSelectedChat(chat);
  const handleBack = () => setSelectedChat(null);
const { dToken, getAppointments } = useContext(DoctorContext);






useEffect(() => {
  if (dToken) {
    console.log("FETCHING APPOINTMENTS FOR CHAT PAGE"  );

    getAppointments();

  }

}, [dToken]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg-app:         #f0ebff;
          --bg-sidebar:     #ffffff;
          --bg-main:        #f8f5ff;
          --bg-hover:       #f0ebff;
          --bg-input:       #f4f0ff;
          --purple-100:     #ede9fe;
          --purple-200:     #ddd6fe;
          --purple-300:     #c4b5fd;
          --purple-400:     #a78bfa;
          --purple-500:     #7c3aed;
          --purple-600:     #6d28d9;
          --purple-glow:    rgba(124,58,237,0.20);
          --purple-dim:     rgba(124,58,237,0.10);
          --border:         #ede8f8;
          --border-strong:  #d8d0f5;
          --text-primary:   #1e1035;
          --text-secondary: #6b5ea8;
          --text-muted:     #a899cc;
          --bubble-me:      #7c3aed;
          --bubble-them:    #ffffff;
          --green:          #22c55e;
          --green-dim:      rgba(34,197,94,0.15);
          --font: 'Plus Jakarta Sans', sans-serif;
          --mono: 'DM Mono', monospace;
          --shadow-sm: 0 1px 4px rgba(124,58,237,0.07);
          --shadow-md: 0 4px 24px rgba(124,58,237,0.11);
        }

        body { font-family: var(--font); background: var(--bg-app); color: var(--text-primary); overflow: hidden; }

        /* ── ROOT ── */
        .doc-chat-root {
          display: flex;
          height: 100vh;
          width: 100vw;
          padding: 20px;
          gap: 18px;
          background: var(--bg-app);
        }

        /* ── SIDEBAR ── */
        .doc-sidebar {
          width: 340px;
          min-width: 300px;
          max-width: 360px;
          display: flex;
          flex-direction: column;
          background: var(--bg-sidebar);
          border-radius: 22px;
          box-shadow: var(--shadow-md);
          border: 1.5px solid var(--border);
          overflow: hidden;
          flex-shrink: 0;
        }

        .doc-sidebar-header {
          padding: 26px 24px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1.5px solid var(--border);
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
        }

        .doc-sidebar-icon {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: rgba(255,255,255,0.18);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .doc-sidebar-title-wrap { flex: 1; }

        .doc-sidebar-title {
          font-size: 18px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.4px;
        }

        .doc-sidebar-sub {
          font-size: 11.5px;
          color: rgba(255,255,255,0.65);
          margin-top: 2px;
          font-family: var(--mono);
        }

        .doc-sidebar-badge {
          background: rgba(255,255,255,0.22);
          color: white;
          font-size: 11px;
          font-weight: 700;
          border-radius: 20px;
          padding: 3px 10px;
          font-family: var(--mono);
          border: 1px solid rgba(255,255,255,0.25);
        }

        .doc-search-wrap {
          padding: 14px 20px;
          border-bottom: 1.5px solid var(--border);
        }

        .doc-search-box {
          width: 100%;
          background: var(--bg-input);
          border: 1.5px solid var(--border-strong);
          border-radius: 14px;
          padding: 10px 14px 10px 40px;
          color: var(--text-primary);
          font-family: var(--font);
          font-size: 13.5px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' fill='%23a899cc' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: 13px center;
        }

        .doc-search-box:focus {
          border-color: var(--purple-400);
          box-shadow: 0 0 0 3px var(--purple-dim);
          background-color: #ffffff;
        }

        .doc-search-box::placeholder { color: var(--text-muted); }

        /* stats strip */
        .doc-stats-strip {
          display: flex;
          gap: 0;
          border-bottom: 1.5px solid var(--border);
        }

        .doc-stat {
          flex: 1;
          padding: 12px 10px;
          text-align: center;
          border-right: 1px solid var(--border);
        }

        .doc-stat:last-child { border-right: none; }

        .doc-stat-num {
          font-size: 17px;
          font-weight: 800;
          color: var(--purple-500);
          font-family: var(--mono);
        }

        .doc-stat-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-weight: 600;
          margin-top: 2px;
        }

        .doc-chat-list-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .doc-chat-list-scroll::-webkit-scrollbar { width: 4px; }
        .doc-chat-list-scroll::-webkit-scrollbar-track { background: transparent; }
        .doc-chat-list-scroll::-webkit-scrollbar-thumb { background: var(--purple-200); border-radius: 4px; }

        .doc-section-label {
          padding: 6px 8px 4px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 1.3px;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .doc-chat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          cursor: pointer;
          border-radius: 14px;
          transition: background 0.15s;
        }

        .doc-chat-item:hover { background: var(--bg-hover); }

        .doc-avatar {
          width: 50px; height: 50px;
          border-radius: 50%;
          flex-shrink: 0;
          position: relative;
        }

        .doc-avatar-inner {
          width: 100%; height: 100%;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          font-weight: 700;
        }

        .doc-online-dot {
          position: absolute;
          bottom: 1px; right: 1px;
          width: 13px; height: 13px;
          background: var(--green);
          border-radius: 50%;
          border: 2.5px solid white;
        }

        .doc-chat-item-info { flex: 1; min-width: 0; }

        .doc-chat-item-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .doc-chat-item-sub {
          font-size: 11.5px;
          color: var(--text-muted);
          margin-top: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .doc-chat-item-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
          flex-shrink: 0;
        }

        .doc-chat-item-time {
          font-size: 10.5px;
          color: var(--text-muted);
          font-family: var(--mono);
        }

        .doc-unread-badge {
          background: var(--purple-500);
          color: white;
          font-size: 10px;
          font-weight: 700;
          border-radius: 10px;
          padding: 2px 7px;
          min-width: 20px;
          text-align: center;
          font-family: var(--mono);
        }

        .doc-status-chip {
          font-size: 10px;
          font-weight: 600;
          border-radius: 8px;
          padding: 2px 7px;
        }

        .doc-status-chip.upcoming {
          background: #ede9fe;
          color: var(--purple-600);
        }

        .doc-status-chip.completed {
          background: #dcfce7;
          color: #15803d;
        }

        /* ── MAIN PANEL ── */
        .doc-main-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: var(--bg-main);
          border-radius: 22px;
          border: 1.5px solid var(--border);
          box-shadow: var(--shadow-md);
          min-width: 0;
          overflow: hidden;
        }

        /* empty state */
        .doc-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 16px;
        }

        .doc-empty-icon {
          width: 90px; height: 90px;
          border-radius: 50%;
          background: var(--purple-100);
          border: 2px solid var(--purple-200);
          display: flex; align-items: center; justify-content: center;
          font-size: 38px;
        }

        .doc-empty-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.3px;
        }

        .doc-empty-sub {
          font-size: 13.5px;
          color: var(--text-muted);
          text-align: center;
          max-width: 260px;
          line-height: 1.6;
        }

        .doc-empty-tips {
          display: flex;
          gap: 10px;
          margin-top: 6px;
        }

        .doc-tip-chip {
          background: white;
          border: 1.5px solid var(--border-strong);
          border-radius: 20px;
          padding: 6px 14px;
          font-size: 12px;
          color: var(--text-secondary);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* ── CHAT WINDOW ── */
        .doc-chat-window { display: flex; flex-direction: column; height: 100%; }

        /* header */
        .doc-chat-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 26px;
          border-bottom: 1.5px solid var(--border);
          background: white;
          flex-shrink: 0;
        }

        .doc-back-btn {
          width: 38px; height: 38px;
          border-radius: 12px;
          background: var(--purple-100);
          border: 1.5px solid var(--purple-200);
          color: var(--purple-500);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          font-size: 20px;
          font-weight: 700;
          line-height: 1;
          transition: background 0.15s, transform 0.15s;
        }

        .doc-back-btn:hover { background: var(--purple-200); transform: translateX(-2px); }

        .doc-header-avatar {
          width: 46px; height: 46px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 16px;
          flex-shrink: 0;
          border: 2px solid var(--purple-200);
        }

        .doc-header-info { flex: 1; }

        .doc-header-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .doc-header-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 3px;
        }

        .doc-header-appt {
          font-size: 11.5px;
          color: var(--text-muted);
          font-family: var(--mono);
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .doc-header-status {
          font-size: 11.5px;
          color: var(--green);
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
        }

        .doc-status-dot {
          width: 7px; height: 7px;
          background: var(--green);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .doc-header-actions { display: flex; gap: 8px; }

        .doc-icon-btn {
          width: 38px; height: 38px;
          border-radius: 12px;
          border: 1.5px solid var(--border-strong);
          background: var(--purple-100);
          color: var(--purple-500);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.15s;
        }

        .doc-icon-btn:hover { background: var(--purple-200); }

        .doc-icon-btn.danger {
          background: #fff1f2;
          border-color: #fecdd3;
          color: #e11d48;
        }

        .doc-icon-btn.danger:hover { background: #ffe4e6; }

        /* patient info banner */
        .doc-patient-banner {
          margin: 16px 24px 0;
          padding: 14px 18px;
          background: white;
          border: 1.5px solid var(--border);
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow: var(--shadow-sm);
          flex-shrink: 0;
        }

        .doc-banner-icon {
          width: 36px; height: 36px;
          border-radius: 10px;
          background: var(--purple-100);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .doc-banner-info { flex: 1; min-width: 0; }

        .doc-banner-title {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .doc-banner-sub {
          font-size: 11.5px;
          color: var(--text-muted);
          margin-top: 2px;
          font-family: var(--mono);
        }

        .doc-banner-chip {
          font-size: 11px;
          font-weight: 700;
          border-radius: 8px;
          padding: 4px 10px;
          background: var(--purple-100);
          color: var(--purple-600);
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* messages */
        .doc-messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 20px 28px 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background:
            radial-gradient(ellipse at 5% 90%, rgba(167,139,250,0.07) 0%, transparent 50%),
            radial-gradient(ellipse at 95% 5%, rgba(124,58,237,0.04) 0%, transparent 50%),
            var(--bg-main);
        }

        .doc-messages-area::-webkit-scrollbar { width: 4px; }
        .doc-messages-area::-webkit-scrollbar-track { background: transparent; }
        .doc-messages-area::-webkit-scrollbar-thumb { background: var(--purple-200); border-radius: 4px; }

        .doc-date-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 8px 0 6px;
          color: var(--text-muted);
          font-size: 11px;
          font-family: var(--mono);
          letter-spacing: 0.5px;
        }

        .doc-date-divider::before, .doc-date-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border-strong);
        }

        .doc-message-row {
          display: flex;
          gap: 10px;
          align-items: flex-end;
          animation: docMsgIn 0.2s ease-out;
        }

        @keyframes docMsgIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .doc-message-row.me { flex-direction: row-reverse; }

        .doc-msg-avatar {
          width: 30px; height: 30px;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .doc-bubble {
          max-width: 62%;
          padding: 12px 16px;
          border-radius: 20px;
          font-size: 14px;
          line-height: 1.55;
          word-break: break-word;
        }

        .doc-bubble.them {
          background: white;
          border: 1.5px solid var(--border);
          border-bottom-left-radius: 5px;
          color: var(--text-primary);
          box-shadow: var(--shadow-sm);
        }

        .doc-bubble.me {
          background: var(--bubble-me);
          border-bottom-right-radius: 5px;
          color: white;
          box-shadow: 0 4px 18px var(--purple-glow);
        }

        .doc-bubble-sender {
          font-size: 11px;
          font-weight: 700;
          color: var(--purple-500);
          margin-bottom: 5px;
        }

        .doc-bubble-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 5px;
          margin-top: 6px;
        }

        .doc-bubble-time { font-size: 10px; font-family: var(--mono); }
        .doc-bubble.me .doc-bubble-time { color: rgba(255,255,255,0.55); }
        .doc-bubble.them .doc-bubble-time { color: var(--text-muted); }
        .doc-tick { font-size: 12px; color: rgba(255,255,255,0.65); }

        /* quick replies */
        .doc-quick-replies {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 12px 28px 0;
          flex-shrink: 0;
        }

        .doc-quick-btn {
          background: white;
          border: 1.5px solid var(--border-strong);
          border-radius: 20px;
          padding: 7px 14px;
          font-size: 12.5px;
          color: var(--purple-600);
          font-weight: 600;
          cursor: pointer;
          font-family: var(--font);
          transition: background 0.15s, border-color 0.15s;
          white-space: nowrap;
        }

        .doc-quick-btn:hover {
          background: var(--purple-100);
          border-color: var(--purple-300);
        }

        /* typing */
        .doc-typing-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 0 4px 40px;
          animation: docMsgIn 0.2s ease-out;
        }

        .doc-typing-bubble {
          background: white;
          border: 1.5px solid var(--border);
          border-radius: 18px;
          border-bottom-left-radius: 5px;
          padding: 11px 16px;
          box-shadow: var(--shadow-sm);
          display: flex;
          gap: 4px;
          align-items: center;
        }

        .doc-typing-dots span {
          width: 6px; height: 6px;
          background: var(--purple-400);
          border-radius: 50%;
          display: inline-block;
          animation: docBounce 1.2s infinite ease-in-out;
        }

        .doc-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .doc-typing-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes docBounce {
          0%, 80%, 100% { transform: scale(0.65); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* input */
        .doc-input-area {
          padding: 14px 24px 16px;
          border-top: 1.5px solid var(--border);
          background: white;
          display: flex;
          align-items: flex-end;
          gap: 10px;
        }

        .doc-attach-btn {
          width: 44px; height: 44px;
          border-radius: 14px;
          background: var(--purple-100);
          border: 1.5px solid var(--border-strong);
          color: var(--purple-500);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s;
        }

        .doc-attach-btn:hover { background: var(--purple-200); }

        .doc-input-wrap {
          flex: 1;
          background: var(--bg-input);
          border: 1.5px solid var(--border-strong);
          border-radius: 22px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 8px;
          transition: border-color 0.2s, box-shadow 0.2s;
          min-height: 48px;
        }

        .doc-input-wrap:focus-within {
          border-color: var(--purple-400);
          box-shadow: 0 0 0 3px var(--purple-dim);
          background: white;
        }

        .doc-msg-input {
          flex: 1;
          background: none;
          border: none;
          color: var(--text-primary);
          font-family: var(--font);
          font-size: 14px;
          outline: none;
          padding: 12px 0;
          resize: none;
          line-height: 1.5;
          max-height: 120px;
        }

        .doc-msg-input::placeholder { color: var(--text-muted); }

        .doc-emoji-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 4px;
          opacity: 0.5;
          transition: opacity 0.15s, transform 0.15s;
          flex-shrink: 0;
        }

        .doc-emoji-btn:hover { opacity: 1; transform: scale(1.15); }

        .doc-send-btn {
          width: 48px; height: 48px;
          border-radius: 50%;
          background: var(--purple-500);
          border: none;
          color: white;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 4px 16px var(--purple-glow);
        }

        .doc-send-btn:hover { transform: scale(1.08); box-shadow: 0 6px 24px rgba(124,58,237,0.35); }
        .doc-send-btn:active { transform: scale(0.94); }
        .doc-send-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }

        @media (max-width: 700px) {
          .doc-chat-root { padding: 0; gap: 0; }
          .doc-sidebar, .doc-main-panel { border-radius: 0; border: none; box-shadow: none; }
          .doc-sidebar {
            position: absolute; top: 0; bottom: 0; left: 0;
            z-index: 10; width: 100vw; max-width: 100vw;
            transition: transform 0.3s ease;
          }
          .doc-sidebar.hidden { transform: translateX(-100%); }
        }
      `}</style>

      <div className="doc-chat-root">

        {/* SIDEBAR */}
        <div className={`doc-sidebar${selectedChat ? " hidden" : ""}`}>
          <DoctorChatList onSelectChat={handleSelectChat} selectedChat={selectedChat}  />
        </div>

        {/* MAIN */}
        <div className="doc-main-panel">
         
{selectedChat ? (
  <DoctorChatWindow
    chat={selectedChat}
    onBack={handleBack}
  />
) : (
  <div className="doc-empty-state">
    <div className="doc-empty-icon">🩺</div>
    <div className="doc-empty-title">
      Patient Conversations
    </div>
  </div>
)}        
        </div>

      </div>
    </>
  );
}

export default DoctorChatPage;
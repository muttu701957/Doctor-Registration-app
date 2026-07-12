import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleSelectChat = (chat) => setSelectedChat(chat);
  const handleBack = () => setSelectedChat(null);
  const location = useLocation();

  useEffect(() => {
  if (location.state) {
    console.log("Received chat from appointment:", location.state);
    setSelectedChat(location.state); // 🔥 THIS FIXES EVERYTHING
  }
}, [location.state]);

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

        /* ROOT */
        .chat-root {
          display: flex;
          height: 100vh;
          width: 100vw;
          padding: 20px;
          gap: 18px;
          background: var(--bg-app);
        }

        /* SIDEBAR */
        .sidebar {
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

        .sidebar-header {
          padding: 26px 24px 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1.5px solid var(--border);
        }

        .sidebar-title {
          font-size: 21px;
          font-weight: 800;
          color: var(--text-primary);
          flex: 1;
          letter-spacing: -0.5px;
        }

        .sidebar-badge {
          background: var(--purple-500);
          color: white;
          font-size: 11px;
          font-weight: 700;
          border-radius: 20px;
          padding: 3px 10px;
          font-family: var(--mono);
        }

        .search-wrap {
          padding: 14px 20px;
          border-bottom: 1.5px solid var(--border);
        }

        .search-box {
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

        .search-box:focus {
          border-color: var(--purple-400);
          box-shadow: 0 0 0 3px var(--purple-dim);
          background-color: #ffffff;
        }

        .search-box::placeholder { color: var(--text-muted); }

        .chat-list-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 12px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .chat-list-scroll::-webkit-scrollbar { width: 4px; }
        .chat-list-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-list-scroll::-webkit-scrollbar-thumb { background: var(--purple-200); border-radius: 4px; }

        .section-label {
          padding: 4px 8px 6px;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 1.3px;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .chat-item {
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 12px 14px;
          cursor: pointer;
          border-radius: 14px;
          transition: background 0.15s;
        }

        .chat-item:hover { background: var(--bg-hover); }

        .avatar {
          width: 50px; height: 50px;
          border-radius: 50%;
          flex-shrink: 0;
          position: relative;
        }

        .avatar-inner {
          width: 100%; height: 100%;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          font-weight: 700;
        }

        .online-dot {
          position: absolute;
          bottom: 1px; right: 1px;
          width: 13px; height: 13px;
          background: var(--green);
          border-radius: 50%;
          border: 2.5px solid white;
        }

        .chat-item-info { flex: 1; min-width: 0; }

        .chat-item-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .chat-item-sub {
          font-size: 11.5px;
          color: var(--text-muted);
          margin-top: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: var(--mono);
        }

        .chat-item-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
          flex-shrink: 0;
        }

        .chat-item-time {
          font-size: 10.5px;
          color: var(--text-muted);
          font-family: var(--mono);
        }

        .unread-badge {
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

        /* MAIN */
        .main-panel {
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

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 14px;
        }

        .empty-icon {
          width: 82px; height: 82px;
          border-radius: 50%;
          background: var(--purple-100);
          border: 2px solid var(--purple-200);
          display: flex; align-items: center; justify-content: center;
          font-size: 36px;
        }

        .empty-title {
          font-size: 17px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .empty-sub {
          font-size: 13.5px;
          color: var(--text-muted);
          text-align: center;
          max-width: 240px;
          line-height: 1.6;
        }

        /* CHAT WINDOW */
        .chat-window { display: flex; flex-direction: column; height: 100%; }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 26px;
          border-bottom: 1.5px solid var(--border);
          background: white;
          flex-shrink: 0;
        }

        .back-btn {
          width: 38px; height: 38px;
          border-radius: 12px;
          background: var(--purple-100);
          border: 1.5px solid var(--purple-200);
          color: var(--purple-500);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.15s, transform 0.15s;
          font-size: 20px;
          font-weight: 700;
          line-height: 1;
        }

        .back-btn:hover { background: var(--purple-200); transform: translateX(-2px); }

        .header-avatar {
          width: 44px; height: 44px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 15px;
          flex-shrink: 0;
          border: 2px solid var(--purple-200);
        }

        .header-info { flex: 1; }

        .header-name {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .header-status {
          font-size: 12px;
          color: var(--green);
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 2px;
          font-weight: 500;
        }

        .status-dot {
          width: 7px; height: 7px;
          background: var(--green);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .header-actions { display: flex; gap: 8px; }

        .icon-btn {
          width: 38px; height: 38px;
          border-radius: 12px;
          border: 1.5px solid var(--border-strong);
          background: var(--purple-100);
          color: var(--purple-500);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.15s;
        }

        .icon-btn:hover { background: var(--purple-200); }

        /* MESSAGES */
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 24px 28px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          background:
            radial-gradient(ellipse at 5% 90%, rgba(167,139,250,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 95% 5%, rgba(124,58,237,0.05) 0%, transparent 50%),
            var(--bg-main);
        }

        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-track { background: transparent; }
        .messages-area::-webkit-scrollbar-thumb { background: var(--purple-200); border-radius: 4px; }

        .date-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 10px 0 6px;
          color: var(--text-muted);
          font-size: 11px;
          font-family: var(--mono);
          letter-spacing: 0.5px;
        }

        .date-divider::before, .date-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border-strong);
        }

        .message-row {
          display: flex;
          gap: 10px;
          align-items: flex-end;
          animation: msgIn 0.2s ease-out;
        }

        @keyframes msgIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .message-row.me { flex-direction: row-reverse; }

        .msg-avatar {
          width: 30px; height: 30px;
          border-radius: 50%;
          font-size: 11px;
          font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .bubble {
          max-width: 62%;
          padding: 12px 16px;
          border-radius: 20px;
          font-size: 14px;
          line-height: 1.55;
          word-break: break-word;
        }

        .bubble.them {
          background: white;
          border: 1.5px solid var(--border);
          border-bottom-left-radius: 5px;
          color: var(--text-primary);
          box-shadow: var(--shadow-sm);
        }

        .bubble.me {
          background: var(--bubble-me);
          border-bottom-right-radius: 5px;
          color: white;
          box-shadow: 0 4px 18px var(--purple-glow);
        }

        .bubble-sender {
          font-size: 11px;
          font-weight: 700;
          color: var(--purple-500);
          margin-bottom: 5px;
        }

        .bubble-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 5px;
          margin-top: 6px;
        }

        .bubble-time { font-size: 10px; font-family: var(--mono); }
        .bubble.me .bubble-time { color: rgba(255,255,255,0.55); }
        .bubble.them .bubble-time { color: var(--text-muted); }
        .tick { font-size: 12px; color: rgba(255,255,255,0.65); }

        /* TYPING */
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 0 4px 40px;
          animation: msgIn 0.2s ease-out;
        }

        .typing-bubble {
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

        .typing-dots span {
          width: 6px; height: 6px;
          background: var(--purple-400);
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.2s infinite ease-in-out;
        }

        .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.65); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* INPUT */
        .input-area {
          padding: 16px 24px;
          border-top: 1.5px solid var(--border);
          background: white;
          display: flex;
          align-items: flex-end;
          gap: 10px;
        }

        .attach-btn {
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

        .attach-btn:hover { background: var(--purple-200); }

        .message-input-wrap {
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

        .message-input-wrap:focus-within {
          border-color: var(--purple-400);
          box-shadow: 0 0 0 3px var(--purple-dim);
          background: white;
        }

        .message-input {
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

        .message-input::placeholder { color: var(--text-muted); }

        .emoji-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 4px;
          opacity: 0.5;
          transition: opacity 0.15s, transform 0.15s;
          flex-shrink: 0;
        }

        .emoji-btn:hover { opacity: 1; transform: scale(1.15); }

        .send-btn {
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

        .send-btn:hover { transform: scale(1.08); box-shadow: 0 6px 24px rgba(124,58,237,0.35); }
        .send-btn:active { transform: scale(0.94); }
        .send-btn:disabled { opacity: 0.3; cursor: not-allowed; transform: none; box-shadow: none; }

        @media (max-width: 700px) {
          .chat-root { padding: 0; gap: 0; }
          .sidebar, .main-panel { border-radius: 0; border: none; box-shadow: none; }
          .sidebar { position: absolute; top: 0; bottom: 0; left: 0; z-index: 10; width: 100vw; max-width: 100vw; transition: transform 0.3s ease; }
          .sidebar.hidden { transform: translateX(-100%); }
        }
      `}</style>

      <div className="chat-root">
        <div className={`sidebar${selectedChat ? " hidden" : ""}`}>
          <ChatList onSelectChat={handleSelectChat} selectedChat={selectedChat} />
        </div>

        <div className="main-panel">
          {selectedChat ? (
            <ChatWindow chat={selectedChat} onBack={handleBack} />
          ) : (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <div className="empty-title">Select a conversation</div>
              <div className="empty-sub">Choose an appointment from the sidebar to start chatting</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ChatPage;
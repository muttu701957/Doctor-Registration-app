import { useEffect, useState, useContext } from 'react';
import { DoctorContext } from '../../context/DoctorContest';
import { AppContext } from '../../context/AppContext';

/* ── SVG icon library (inline, no dependencies) ── */
const Icon = {
  clipboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-2"/>
      <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
    </svg>
  ),
  clock: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  checkCircle: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  xCircle: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
  creditCard: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  banknote: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>
    </svg>
  ),
  calendar: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  clockSm: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  check: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  x: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  checkLg: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  xLg: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  calendarEmpty: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      <line x1="9" y1="15" x2="15" y2="15"/>
    </svg>
  ),
  search: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
    </svg>
  ),
  refresh: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
    </svg>
  ),
};

/* ── Helpers ── */
const PALETTE = [
  { bg: '#ede9fe', color: '#7c3aed' },
  { bg: '#dbeafe', color: '#1d4ed8' },
  { bg: '#dcfce7', color: '#15803d' },
  { bg: '#fce7f3', color: '#be185d' },
  { bg: '#fef9c3', color: '#92400e' },
  { bg: '#fff1f2', color: '#e11d48' },
];
const FILTERS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}
function getPalette(name = '') {
  return PALETTE[name.charCodeAt(0) % PALETTE.length];
}

/* ── Component ── */
const DoctorAppointment = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (dToken) getAppointments();
  }, [dToken]);

  const sorted = [...appointments].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filtered = sorted.filter(item => {
    const name = item.userData?.name?.toLowerCase() || '';
    const matchSearch = name.includes(search.toLowerCase());
    if (filter === 'Upcoming')  return matchSearch && !item.isCompleted && !item.cancelled;
    if (filter === 'Completed') return matchSearch &&  item.isCompleted;
    if (filter === 'Cancelled') return matchSearch &&  item.cancelled;
    return matchSearch;
  });

  const stats = {
    total:     appointments.length,
    upcoming:  appointments.filter(a => !a.isCompleted && !a.cancelled).length,
    completed: appointments.filter(a =>  a.isCompleted).length,
    cancelled: appointments.filter(a =>  a.cancelled).length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        .appt-root {
          padding: 28px 28px 40px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          background: #f8f5ff;
        }

        /* HEADER */
        .appt-header {
          display: flex; align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 26px;
          flex-wrap: wrap; gap: 12px;
        }
        .appt-title {
          font-size: 24px; font-weight: 800;
          color: #1e1035; letter-spacing: -0.5px;
        }
        .appt-subtitle {
          font-size: 13px; color: #a899cc;
          margin-top: 3px; font-weight: 500;
        }
        .appt-refresh-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 20px;
          background: #7c3aed; color: white;
          border: none; border-radius: 12px;
          font-size: 13px; font-weight: 700;
          cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.15s, transform 0.15s;
          box-shadow: 0 4px 14px rgba(124,58,237,0.3);
        }
        .appt-refresh-btn:hover { background: #6d28d9; transform: translateY(-1px); }
        .appt-refresh-btn:active { transform: translateY(0); }

        /* STATS */
        .appt-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px; margin-bottom: 24px;
        }
        @media (max-width: 768px) { .appt-stats { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 480px) { .appt-stats { grid-template-columns: 1fr; } }

        .stat-card {
          background: white; border-radius: 18px;
          padding: 20px 22px;
          display: flex; align-items: center; gap: 16px;
          border: 1.5px solid #ede8f8;
          box-shadow: 0 2px 12px rgba(124,58,237,0.06);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(124,58,237,0.12); }

        .stat-icon {
          width: 50px; height: 50px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .stat-icon.purple { background: #ede9fe; color: #7c3aed; }
        .stat-icon.blue   { background: #dbeafe; color: #1d4ed8; }
        .stat-icon.green  { background: #dcfce7; color: #15803d; }
        .stat-icon.red    { background: #fee2e2; color: #dc2626; }

        .stat-num {
          font-size: 28px; font-weight: 800;
          color: #1e1035; line-height: 1; letter-spacing: -0.5px;
        }
        .stat-label {
          font-size: 11.5px; color: #a899cc;
          font-weight: 600; margin-top: 4px;
          text-transform: uppercase; letter-spacing: 0.8px;
        }

        /* TOOLBAR */
        .appt-toolbar {
          display: flex; align-items: center;
          gap: 12px; margin-bottom: 20px; flex-wrap: wrap;
        }
        .appt-search-wrap {
          position: relative; flex: 1; min-width: 200px;
        }
        .appt-search-icon {
          position: absolute; left: 14px; top: 50%;
          transform: translateY(-50%);
          color: #c4b5fd; pointer-events: none;
          display: flex; align-items: center;
        }
        .appt-search {
          width: 100%;
          padding: 11px 14px 11px 42px;
          border: 1.5px solid #ddd6fe; border-radius: 14px;
          font-size: 13.5px; font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1e1035; background: white; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .appt-search:focus {
          border-color: #a78bfa;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
        }
        .appt-search::placeholder { color: #c4b5fd; }

        .appt-filters { display: flex; gap: 6px; flex-wrap: wrap; }
        .filter-tab {
          padding: 9px 16px; border-radius: 12px;
          border: 1.5px solid #ddd6fe; background: transparent;
          color: #a899cc; font-size: 12.5px; font-weight: 700;
          cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.15s; white-space: nowrap;
        }
        .filter-tab:hover { border-color: #a78bfa; color: #7c3aed; background: #f5f3ff; }
        .filter-tab.active {
          background: #7c3aed; border-color: #7c3aed; color: white;
          box-shadow: 0 3px 10px rgba(124,58,237,0.3);
        }

        /* TABLE */
        .appt-table-card {
          background: white; border-radius: 20px;
          border: 1.5px solid #ede8f8;
          box-shadow: 0 4px 24px rgba(124,58,237,0.08);
          overflow: hidden;
        }
        .appt-table-head {
          display: grid;
          grid-template-columns: 48px 1.6fr 110px 60px 170px 90px 130px;
          gap: 12px; padding: 14px 24px;
          background: #faf8ff;
          border-bottom: 1.5px solid #ede8f8;
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.9px; color: #c4b5fd;
        }
        @media (max-width: 900px) { .appt-table-head { display: none; } }

        .appt-row {
          display: grid;
          grid-template-columns: 48px 1.6fr 110px 60px 170px 90px 130px;
          gap: 12px; padding: 15px 24px;
          border-bottom: 1px solid #f3f0fb;
          align-items: center;
          transition: background 0.15s;
        }
        .appt-row:last-child { border-bottom: none; }
        .appt-row:hover { background: #faf8ff; }
        @media (max-width: 900px) {
          .appt-row { grid-template-columns: 1fr 1fr; gap: 10px; padding: 14px 18px; }
        }

        /* Row cells */
        .row-num {
          width: 32px; height: 32px; border-radius: 10px;
          background: #f5f3ff; border: 1.5px solid #ede9fe;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #7c3aed;
        }
        .patient-cell { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .patient-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          object-fit: cover; flex-shrink: 0;
          border: 2.5px solid #ede9fe;
        }
        .patient-initials {
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700; flex-shrink: 0;
        }
        .patient-name {
          font-size: 14px; font-weight: 600; color: #1e1035;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .patient-sub { font-size: 11.5px; color: #a899cc; margin-top: 1px; }

        .badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 11px; border-radius: 20px;
          font-size: 11.5px; font-weight: 700; white-space: nowrap;
        }
        .badge-online  { background: #dbeafe; color: #1d4ed8; }
        .badge-cash    { background: #ffedd5; color: #c2410c; }
        .badge-done    { background: #dcfce7; color: #15803d; }
        .badge-cancel  { background: #fee2e2; color: #b91c1c; }

        .age-chip {
          width: 36px; height: 36px; border-radius: 10px;
          background: #f5f3ff;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: #7c3aed;
        }

        .date-main {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: #1e1035;
        }
        .date-main svg { color: #a78bfa; flex-shrink: 0; }
        .date-time {
          display: flex; align-items: center; gap: 6px;
          font-size: 11.5px; color: #a899cc; margin-top: 4px;
        }
        .date-time svg { color: #c4b5fd; flex-shrink: 0; }

        .fee-cell {
          font-size: 15px; font-weight: 800; color: #1e1035;
        }

        .action-cell { display: flex; align-items: center; gap: 8px; }
        .action-btn {
          width: 36px; height: 36px; border-radius: 10px;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.15s, box-shadow 0.15s;
          flex-shrink: 0;
        }
        .action-btn:hover  { transform: scale(1.1); }
        .action-btn:active { transform: scale(0.93); }
        .action-btn.cancel  {
          background: #fee2e2; color: #dc2626;
          box-shadow: 0 2px 8px rgba(220,38,38,0.12);
        }
        .action-btn.cancel:hover  { background: #fecaca; box-shadow: 0 4px 12px rgba(220,38,38,0.22); }
        .action-btn.complete {
          background: #dcfce7; color: #16a34a;
          box-shadow: 0 2px 8px rgba(22,163,74,0.12);
        }
        .action-btn.complete:hover { background: #bbf7d0; box-shadow: 0 4px 12px rgba(22,163,74,0.22); }

        /* EMPTY STATE */
        .empty-state {
          padding: 64px 20px; text-align: center;
        }
        .empty-icon-wrap {
          width: 80px; height: 80px; border-radius: 24px;
          background: #f5f3ff; border: 1.5px solid #ede9fe;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px; color: #c4b5fd;
        }
        .empty-title {
          font-size: 16px; font-weight: 700; color: #6b5ea8; margin-bottom: 6px;
        }
        .empty-sub { font-size: 13px; color: #a899cc; }
      `}</style>

      <div className="appt-root">

        {/* HEADER */}
        <div className="appt-header">
          <div>
            <div className="appt-title">Appointments</div>
            <div className="appt-subtitle">Manage and track your patient appointments</div>
          </div>
          <button className="appt-refresh-btn" onClick={getAppointments}>
            {Icon.refresh}
            Refresh
          </button>
        </div>

        {/* STATS */}
        <div className="appt-stats">
          <div className="stat-card">
            <div className="stat-icon purple">{Icon.clipboard}</div>
            <div>
              <div className="stat-num">{stats.total}</div>
              <div className="stat-label">Total</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue">{Icon.clock}</div>
            <div>
              <div className="stat-num">{stats.upcoming}</div>
              <div className="stat-label">Upcoming</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">{Icon.checkCircle}</div>
            <div>
              <div className="stat-num">{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">{Icon.xCircle}</div>
            <div>
              <div className="stat-num">{stats.cancelled}</div>
              <div className="stat-label">Cancelled</div>
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="appt-toolbar">
          <div className="appt-search-wrap">
            <span className="appt-search-icon">{Icon.search}</span>
            <input
              className="appt-search"
              placeholder="Search patients by name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="appt-filters">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-tab${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
                {f !== 'All' && (
                  <span style={{ marginLeft: 5, opacity: 0.7 }}>
                    ({f === 'Upcoming' ? stats.upcoming : f === 'Completed' ? stats.completed : stats.cancelled})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="appt-table-card">
          <div className="appt-table-head">
            <span>#</span>
            <span>Patient</span>
            <span>Payment</span>
            <span>Age</span>
            <span>Date &amp; Time</span>
            <span>Fees</span>
            <span>Action</span>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon-wrap">{Icon.calendarEmpty}</div>
              <div className="empty-title">No appointments found</div>
              <div className="empty-sub">
                {search
                  ? `No results for "${search}"`
                  : `No ${filter.toLowerCase()} appointments`}
              </div>
            </div>
          ) : (
            filtered.map((item, index) => {
              const name    = item.userData?.name || 'Patient';
              const palette = getPalette(name);
              const age     = calculateAge(item.userData?.dob);

              return (
                <div className="appt-row" key={item._id || index}>

                  {/* # */}
                  <div className="row-num">{index + 1}</div>

                  {/* Patient */}
                  <div className="patient-cell">
                    {item.userData?.image ? (
                      <img className="patient-avatar" src={item.userData.image} alt={name} />
                    ) : (
                      <div
                        className="patient-initials"
                        style={{ background: palette.bg, color: palette.color }}
                      >
                        {getInitials(name)}
                      </div>
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div className="patient-name">{name}</div>
                      <div className="patient-sub">{item.userData?.email || ''}</div>
                    </div>
                  </div>

                  {/* Payment */}
                  <div>
                    <span className={`badge ${item.payment ? 'badge-online' : 'badge-cash'}`}>
                      {item.payment ? Icon.creditCard : Icon.banknote}
                      {item.payment ? 'Online' : 'Cash'}
                    </span>
                  </div>

                  {/* Age */}
                  <div>
                    <div className="age-chip">{age}</div>
                  </div>

                  {/* Date & Time */}
                  <div>
                    <div className="date-main">
                      {Icon.calendar}
                      {slotDateFormat(item.slotDate)}
                    </div>
                    <div className="date-time">
                      {Icon.clockSm}
                      {item.slotTime}
                    </div>
                  </div>

                  {/* Fee */}
                  <div className="fee-cell">
                    {currency}{item.amount}
                  </div>

                  {/* Action / Status */}
                  <div className="action-cell">
                    {item.cancelled ? (
                      <span className="badge badge-cancel">
                        {Icon.x} Cancelled
                      </span>
                    ) : item.isCompleted ? (
                      <span className="badge badge-done">
                        {Icon.check} Completed
                      </span>
                    ) : (
                      <>
                        <button
                          className="action-btn cancel"
                          title="Cancel appointment"
                          onClick={() => cancelAppointment(item._id)}
                        >
                          {Icon.xLg}
                        </button>
                        <button
                          className="action-btn complete"
                          title="Mark as completed"
                          onClick={() => completeAppointment(item._id)}
                        >
                          {Icon.checkLg}
                        </button>
                      </>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </>
  );
};

export default DoctorAppointment;

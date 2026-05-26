import React, { useContext, useEffect, useMemo } from 'react'
import { DoctorContext } from '../../context/DoctorContest'
import { AppContext } from '../../context/AppContext'
import assets from '../../assets/assets.js'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

import PropTypes from 'prop-types'

/* ── Teal palette ─────────────────────────────── */
const T = {
  teal500:   '#14b8a6',
  teal600:   '#0d9488',
  teal700:   '#0f766e',
  teal900:   '#134e4a',
  tealLight: '#ccfbf1',
  cyan:      '#22d3ee',
  emerald:   '#10b981',
  amber:     '#f59e0b',
  rose:      '#f43f5e',
  slate:     '#64748b',
}

/* ── Helpers ─────────────────────────────────── */
const statusOf = (appt) =>
  appt.cancelled ? 'cancelled' : appt.isCompleted ? 'completed' : 'pending'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/* Custom Donut label */
const DonutLabel = ({ cx, cy, value, name }) => (
  <>
    <text x={cx} y={cy - 8} textAnchor="middle" fill="#0f172a" className="text-xl font-bold" style={{ fontSize: 22, fontFamily: 'DM Serif Display, serif', fontWeight: 700 }}>
      {value}
    </text>
    <text x={cx} y={cy + 14} textAnchor="middle" fill="#64748b" style={{ fontSize: 11 }}>
      {name}
    </text>
  </>
)
DonutLabel.propTypes = {
  cx:    PropTypes.number,
  cy:    PropTypes.number,
  value: PropTypes.number,
  name:  PropTypes.string,
}

/* Custom tooltip */
const TealTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#0f172a', border: '1px solid rgba(20,184,166,0.3)', borderRadius: 10, padding: '8px 14px' }}>
      <p style={{ color: '#99f6e4', fontSize: 11, marginBottom: 4 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color || '#14b8a6', fontSize: 13, fontWeight: 600 }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

TealTooltip.propTypes = {
  active:  PropTypes.bool,
  label:   PropTypes.string,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      name:  PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      color: PropTypes.string,
    })
  ),
}

/* ── Main Component ──────────────────────────── */
const DoctorDashboard = () => {
  const { dashData, getDashData, dToken, completeAppointment, cancelAppointment, profileData, getProfileData } = useContext(DoctorContext)
  const { currency, slotDateFormat } = useContext(AppContext)

  useEffect(() => { if (dToken) getDashData() , getProfileData()  }, [dToken])

  /* ── Derived chart data ─────────────────────── */
  const analytics = useMemo(() => {
    if (!dashData) return null
    const appts = dashData.latestAppointments ?? []

    /* Status breakdown */
    const statusCount = { pending: 0, completed: 0, cancelled: 0 }
    appts.forEach((a) => statusCount[statusOf(a)]++)
    const statusData = [
      { name: 'Pending',   value: statusCount.pending,   color: T.amber   },
      { name: 'Completed', value: statusCount.completed, color: T.emerald },
      { name: 'Cancelled', value: statusCount.cancelled, color: T.rose    },
    ].filter((d) => d.value > 0)

    /* Payment breakdown */
    const paid   = appts.filter((a) => a.payment && !a.cancelled).reduce((s, a) => s + a.amount, 0)
    const unpaid = appts.filter((a) => !a.payment && !a.cancelled).reduce((s, a) => s + a.amount, 0)
    const paymentData = [
      { name: 'Paid',   value: paid,   fill: T.emerald },
      { name: 'Unpaid', value: unpaid, fill: T.amber   },
    ]

    /* Slots by hour — distribution of bookings throughout the day */
    const slotMap = {}
    appts.forEach((a) => {
      const hour = a.slotTime ? a.slotTime.split(':')[0].trim() + ' ' + a.slotTime.split(' ')[1] : 'Other'
      slotMap[hour] = (slotMap[hour] || 0) + 1
    })
    const slotData = Object.entries(slotMap)
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => a.time.localeCompare(b.time))

    /* Weekly trend — build last-7-days labels, fill in from real data */
    const today = new Date()
    const weekly = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today)
      d.setDate(d.getDate() - (6 - i))
      const label = WEEKDAYS[d.getDay()]
      const dateKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
      const cnt = appts.filter((a) => a.slotDate === dateKey).length
      return { day: label, appointments: cnt }
    })

    return { statusData, paymentData, slotData, weekly, totalAppts: appts.length }
  }, [dashData])

  if (!dashData || !analytics) return null

  /* ── Stat cards config ─────────────────────── */
  const statCards = [
    {
      label: 'Total Earnings',
      value: `${currency} ${dashData.earnings}`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: T.emerald,
      bg: 'from-emerald-50 to-white',
      badge: 'Revenue',
    },
    {
      label: 'Appointments',
      value: dashData.appointments,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      accent: T.teal500,
      bg: 'from-teal-50 to-white',
      badge: 'Total',
    },
    {
      label: 'Unique Patients',
      value: dashData.patients,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      accent: T.cyan,
      bg: 'from-cyan-50 to-white',
      badge: 'Registered',
    },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        .dash-ff { font-family: 'DM Sans', sans-serif; }
        .dash-display { font-family: 'DM Serif Display', serif; }
        .stat-card {
          transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1);
        }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.09); }
        .appt-row { transition: background 0.2s; }
        .appt-row:hover { background: #f0fdfa; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .fade-s1 { animation: fadeUp 0.4s 0.05s both; }
        .fade-s2 { animation: fadeUp 0.4s 0.12s both; }
        .fade-s3 { animation: fadeUp 0.4s 0.19s both; }
        .fade-c1 { animation: fadeUp 0.4s 0.26s both; }
        .fade-c2 { animation: fadeUp 0.4s 0.33s both; }
        .fade-c3 { animation: fadeUp 0.4s 0.40s both; }
        .fade-t  { animation: fadeUp 0.4s 0.47s both; }
      `}</style>

      <div className="dash-ff w-full min-h-screen bg-slate-50 p-6">

        {/* ── Page header ───────────────────────────── */}
        <div className="mb-7">
          <p className="text-[10.5px] font-semibold tracking-[0.18em] uppercase text-teal-600 mb-1">Overview</p>
           <h1 className="dash-display text-slate-900 text-3xl leading-none">
   {profileData?.name ?? 'Dashboard'}
  </h1>
          <p className="text-slate-400 text-sm font-light mt-1">Welcome back — here's what's happening today.</p>
        </div>

        {/* ── Stat Cards ────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {statCards.map((s, i) => (
            <div
              key={s.label}
              className={`stat-card bg-gradient-to-br ${s.bg} rounded-2xl p-5 border border-slate-100 fade-s${i + 1}`}
              style={{ borderLeft: `3px solid ${s.accent}` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `${s.accent}18`, color: s.accent }}>
                  {s.icon}
                </div>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full"
                  style={{ background: `${s.accent}15`, color: s.accent }}>
                  {s.badge}
                </span>
              </div>
              <p className="dash-display text-slate-900 text-2xl font-bold leading-none mb-1">{s.value}</p>
              <p className="text-slate-500 text-[12.5px]">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Charts Row 1: Weekly + Status ──────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

          {/* Weekly Appointment Trend — 2/3 width */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 fade-c1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-teal-600 mb-0.5">7-Day View</p>
                <h3 className="dash-display text-slate-800 text-lg leading-none">Weekly Appointments</h3>
              </div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(20,184,166,0.12)', color: T.teal600 }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={analytics.weekly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={T.teal500} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={T.teal500} stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                <Tooltip content={<TealTooltip />} />
                <Area
                  type="monotone"
                  dataKey="appointments"
                  name="Appts"
                  stroke={T.teal500}
                  strokeWidth={2.5}
                  fill="url(#tealGrad)"
                  dot={{ fill: T.teal600, r: 3.5, strokeWidth: 0 }}
                  activeDot={{ r: 5.5, fill: T.teal500, strokeWidth: 2, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Appointment Status Donut — 1/3 width */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 fade-c2 flex flex-col">
            <div className="mb-3">
              <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-teal-600 mb-0.5">Breakdown</p>
              <h3 className="dash-display text-slate-800 text-lg leading-none">Appt. Status</h3>
            </div>
            {analytics.statusData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={analytics.statusData}
                      cx="50%" cy="50%"
                      innerRadius={42} outerRadius={62}
                      paddingAngle={3}
                      dataKey="value"
                      labelLine={false}
                    >
                      {analytics.statusData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip content={<TealTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-auto space-y-1.5 pt-2">
                  {analytics.statusData.map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-[12px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: s.color }} />
                        <span className="text-slate-500">{s.name}</span>
                      </div>
                      <span className="font-semibold text-slate-700">{s.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">No data yet</div>
            )}
          </div>
        </div>

        {/* ── Charts Row 2: Payment + Time Slots ─────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

          {/* Payment Overview Bar */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 fade-c3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-teal-600 mb-0.5">Financials</p>
                <h3 className="dash-display text-slate-800 text-lg leading-none">Payment Overview</h3>
              </div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(16,185,129,0.12)', color: T.emerald }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={165}>
              <BarChart data={analytics.paymentData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                <Tooltip content={<TealTooltip />} formatter={(v) => [`${currency} ${v}`, 'Amount']} />
                <Bar dataKey="value" name="Amount" radius={[8, 8, 0, 0]}>
                  {analytics.paymentData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* Payment summary chips */}
            <div className="flex gap-3 mt-3">
              {analytics.paymentData.map((p) => (
                <div key={p.name} className="flex-1 rounded-xl px-3 py-2.5 text-center"
                  style={{ background: `${p.fill}12`, border: `1px solid ${p.fill}30` }}>
                  <p className="font-semibold text-[13px]" style={{ color: p.fill }}>{currency} {p.value}</p>
                  <p className="text-slate-400 text-[10.5px] mt-0.5">{p.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Time Slot Distribution */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 fade-c3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-teal-600 mb-0.5">Schedule</p>
                <h3 className="dash-display text-slate-800 text-lg leading-none">Slot Distribution</h3>
              </div>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(34,211,238,0.12)', color: T.cyan }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            {analytics.slotData.length > 0 ? (
              <ResponsiveContainer width="100%" height={165}>
                <BarChart data={analytics.slotData} layout="vertical" margin={{ top: 4, right: 12, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="time" tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} width={60} />
                  <Tooltip content={<TealTooltip />} />
                  <Bar dataKey="count" name="Bookings" fill={T.cyan} radius={[0, 6, 6, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-44 flex items-center justify-center text-slate-400 text-sm">No slot data</div>
            )}

            {/* Quick stat: busiest slot */}
            {analytics.slotData.length > 0 && (() => {
              const busiest = [...analytics.slotData].sort((a, b) => b.count - a.count)[0]
              return (
                <div className="mt-3 rounded-xl px-3 py-2.5 flex items-center gap-2"
                  style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)' }}>
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke={T.cyan} strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-[11.5px] text-slate-500">
                    Peak slot: <span className="font-semibold" style={{ color: T.cyan }}>{busiest.time}</span>
                    {' '}— {busiest.count} booking{busiest.count > 1 ? 's' : ''}
                  </p>
                </div>
              )
            })()}
          </div>
        </div>

        {/* ── Latest Bookings Table ──────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden fade-t">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-teal-600 mb-0.5">Recent Activity</p>
              <h3 className="dash-display text-slate-800 text-lg leading-none">Latest Bookings</h3>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(20,184,166,0.1)', color: T.teal600 }}>
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block animate-pulse" />
              Live
            </div>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-12 px-6 py-2 bg-slate-50 border-b border-slate-100 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
            <span className="col-span-4">Patient</span>
            <span className="col-span-3">Doctor</span>
            <span className="col-span-2">Date & Time</span>
            <span className="col-span-1 text-right">Fee</span>
            <span className="col-span-2 text-center">Status / Action</span>
          </div>

          {/* Rows */}
          {dashData.latestAppointments.map((item, i) => {
            const st = statusOf(item)
            return (
              <div
                key={item._id || i}
                className="appt-row grid grid-cols-12 items-center px-6 py-3.5 border-b border-slate-50 last:border-0"
              >
                {/* Patient */}
                <div className="col-span-4 flex items-center gap-3">
                  <img
                    src={item.userData.image}
                    alt={item.userData.name}
                    className="w-9 h-9 rounded-full object-cover border-2"
                    style={{ borderColor: 'rgba(20,184,166,0.3)' }}
                  />
                  <div>
                    <p className="text-slate-800 font-medium text-[13px]">{item.userData.name}</p>
                    <p className="text-slate-400 text-[11px]">{item.userData.gender} · {item.userData.bloodGroup}</p>
                  </div>
                </div>

                {/* Doctor */}
                <div className="col-span-3 flex items-center gap-2">
                  <img src={item.docData.image} alt={item.docData.name}
                    className="w-7 h-7 rounded-full object-cover" />
                  <div>
                    <p className="text-slate-700 text-[12px] font-medium leading-none">{item.docData.name}</p>
                    <p className="text-teal-500 text-[10.5px] mt-0.5">{item.docData.speciality}</p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="col-span-2">
                  <p className="text-slate-700 text-[12px] font-medium">{slotDateFormat(item.slotDate)}</p>
                  <p className="text-slate-400 text-[11px]">{item.slotTime}</p>
                </div>

                {/* Fee */}
                <div className="col-span-1 text-right">
                  <p className="font-semibold text-[13px] text-slate-800">{currency}{item.amount}</p>
                  <p className={`text-[10px] mt-0.5 ${item.payment ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {item.payment ? 'Paid' : 'Pending'}
                  </p>
                </div>

                {/* Status / Action */}
                <div className="col-span-2 flex items-center justify-center">
                  {st === 'cancelled' && (
                    <span className="px-2.5 py-1 rounded-full text-[10.5px] font-semibold"
                      style={{ background: 'rgba(244,63,94,0.1)', color: T.rose }}>
                      Cancelled
                    </span>
                  )}
                  {st === 'completed' && (
                    <span className="px-2.5 py-1 rounded-full text-[10.5px] font-semibold"
                      style={{ background: 'rgba(16,185,129,0.1)', color: T.emerald }}>
                      Completed
                    </span>
                  )}
                  {st === 'pending' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => cancelAppointment(item._id)}
                        title="Cancel"
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: 'rgba(244,63,94,0.1)', color: T.rose }}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <button
                        onClick={() => completeAppointment(item._id)}
                        title="Complete"
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: 'rgba(20,184,166,0.12)', color: T.teal600 }}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </>
  )
}

export default DoctorDashboard
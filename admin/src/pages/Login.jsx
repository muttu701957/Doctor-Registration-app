import React, { useContext, useState } from 'react';
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContest';

const Login = () => {
  const [state, setState] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  const isAdmin = state === 'Admin';

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (isAdmin) {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password });
        if (data.success) {
          localStorage.setItem('aToken', data.token);
          setAToken(data.token);
          toast.success('Login successful!');
        } else {
          toast.error(data.message || 'Login Failed');
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password });
        if (data.success) {
          localStorage.setItem('dToken', data.token);
          setDToken(data.token);
          toast.success('Login successful!');
        } else {
          toast.error(data.message || 'Login Failed');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        .login-ff { font-family: 'DM Sans', sans-serif; }
        .ff-display { font-family: 'DM Serif Display', serif; }

        /* ── Admin Panel Styles ── */
        .adm-grid-pat {
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 38px 38px;
        }
        .glass-stat {
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 14px;
          padding: 12px 14px;
          transition: all 0.3s;
        }
        .glass-stat:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(167,139,250,0.35);
          transform: translateY(-2px);
        }

        /* ── Doctor Panel Styles ── */
        .doc-bg {
          background: linear-gradient(145deg, #0c1a2e 0%, #0a2a3a 40%, #062a2a 100%);
        }
        .cross-pattern {
          background-image:
            linear-gradient(rgba(94,234,212,0.06) 2px, transparent 2px),
            linear-gradient(90deg, rgba(94,234,212,0.06) 2px, transparent 2px),
            linear-gradient(rgba(94,234,212,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(94,234,212,0.025) 1px, transparent 1px);
          background-size: 60px 60px, 60px 60px, 15px 15px, 15px 15px;
        }

        /* ECG line animation */
        .ecg-path {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: ecg-draw 2.5s ease-in-out infinite;
        }
        @keyframes ecg-draw {
          0%   { stroke-dashoffset: 600; opacity: 0.2; }
          30%  { opacity: 1; }
          70%  { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -600; opacity: 0.1; }
        }

        /* Pulse ring */
        .pulse-ring {
          animation: pulse-expand 2s ease-out infinite;
        }
        .pulse-ring-2 {
          animation: pulse-expand 2s ease-out 0.6s infinite;
        }
        @keyframes pulse-expand {
          0%   { r: 28; opacity: 0.7; }
          100% { r: 52; opacity: 0; }
        }

        /* Floating cards on doctor panel */
        .float-card {
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(94,234,212,0.2);
          border-radius: 14px;
          animation: float-bob 4s ease-in-out infinite;
        }
        .float-card-2 { animation-delay: 1.5s; }
        .float-card-3 { animation-delay: 0.8s; }
        @keyframes float-bob {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-6px); }
        }

        /* Orbiting dot */
        .orbit-dot {
          animation: orbit 6s linear infinite;
          transform-origin: center;
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(52px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(52px) rotate(-360deg); }
        }

        /* Fade transitions */
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .panel-enter { animation: fadeSlideIn 0.45s ease both; }

        /* Input focus rings */
        .inp-adm:focus { outline: none; border-color: transparent; box-shadow: 0 0 0 2.5px #7c3aed; }
        .inp-doc:focus { outline: none; border-color: transparent; box-shadow: 0 0 0 2.5px #14b8a6; }

        /* Submit button shimmer */
        .btn-shimmer { position: relative; overflow: hidden; }
        .btn-shimmer::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          background-size: 200% auto;
          animation: shimmer 2.2s linear infinite;
          border-radius: inherit;
        }
        @keyframes shimmer {
          from { background-position: -200% center; }
          to   { background-position:  200% center; }
        }

        /* Stagger animations for stat cards */
        .stat-1 { animation: fadeSlideIn 0.4s 0.05s both; }
        .stat-2 { animation: fadeSlideIn 0.4s 0.15s both; }
        .stat-3 { animation: fadeSlideIn 0.4s 0.25s both; }
        .stat-4 { animation: fadeSlideIn 0.4s 0.35s both; }
      `}</style>

      <div className="login-ff min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-[860px] rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row bg-white min-h-[580px]">

          {/* ══════════════ LEFT PANEL ══════════════ */}
          <div className="lg:w-[44%] flex-shrink-0 relative overflow-hidden">

            {/* ── ADMIN PANEL ── */}
            {isAdmin && (
              <div className="panel-enter absolute inset-0 adm-grid-pat flex flex-col justify-between p-8"
                style={{ background: 'linear-gradient(145deg,#0f0a23 0%,#1e1155 55%,#130d2e 100%)' }}>

                {/* Top badge */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)' }}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#a78bfa" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-violet-300 text-[10px] font-semibold tracking-[0.18em] uppercase">Admin Portal</p>
                    <p className="text-slate-500 text-[10px]">Full platform access</p>
                  </div>
                </div>

                {/* Headline */}
                <div>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.25)' }}>
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#c4b5fd" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="ff-display text-white text-[1.75rem] leading-snug mb-2">
                    Full Control.<br />
                    <span className="text-violet-400">One Dashboard.</span>
                  </h2>
                  <p className="text-slate-400 text-[12.5px] leading-relaxed max-w-[190px]">
                    Manage your entire healthcare platform from a single powerful interface.
                  </p>
                </div>

                {/* Stats grid */}
                {/* <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: 'Doctors',      value: '120+', icon: '👨‍⚕️', cls: 'stat-1' },
                    { label: 'Appointments', value: '3.4k', icon: '📅', cls: 'stat-2' },
                    { label: 'Departments',  value: '18',   icon: '🏥', cls: 'stat-3' },
                    { label: 'Uptime',       value: '99.9%',icon: '⚡', cls: 'stat-4' },
                  ].map((s) => (
                    <div key={s.label} className={`glass-stat ${s.cls}`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-sm">{s.icon}</span>
                        <span className="text-violet-200 font-semibold text-base leading-none">{s.value}</span>
                      </div>
                      <p className="text-slate-500 text-[11px]">{s.label}</p>
                    </div>
                  ))}
                </div> */}
              </div>
            )}

            {/* ── DOCTOR PANEL ── */}
            {!isAdmin && (
              <div className="panel-enter absolute inset-0 doc-bg cross-pattern flex flex-col justify-between p-8">

                {/* Top: live indicator + brand */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(94,234,212,0.25)', borderRadius: 99, padding: '6px 14px' }}>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" style={{ animation: 'pulse-expand 2s ease-out infinite', boxShadow: '0 0 0 0 rgba(52,211,153,0.4)' }} />
                    <span className="text-teal-200 text-[11px] font-medium">System Online</span>
                  </div>
                  {/* Heartbeat icon */}
                  <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>

                {/* Center: ECG animation */}
                <div className="flex flex-col items-center justify-center gap-4">
                  {/* Pulse orb */}
                  <div className="relative flex items-center justify-center mb-2">
                    <svg width="120" height="120" viewBox="0 0 120 120">
                      {/* Outer pulse rings */}
                      <circle cx="60" cy="60" r="28" fill="none" stroke="rgba(20,184,166,0.15)" strokeWidth="1" className="pulse-ring" />
                      <circle cx="60" cy="60" r="28" fill="none" stroke="rgba(20,184,166,0.1)" strokeWidth="1" className="pulse-ring-2" />
                      {/* Static rings */}
                      <circle cx="60" cy="60" r="36" fill="none" stroke="rgba(94,234,212,0.12)" strokeWidth="1" />
                      <circle cx="60" cy="60" r="44" fill="none" stroke="rgba(94,234,212,0.07)" strokeWidth="1" />
                      {/* Center orb */}
                      <circle cx="60" cy="60" r="28" fill="rgba(20,184,166,0.15)" />
                      <circle cx="60" cy="60" r="20" fill="rgba(20,184,166,0.25)" />
                      {/* Cross / plus icon */}
                      <path d="M60 48 L60 72 M48 60 L72 60" stroke="#5eead4" strokeWidth="3" strokeLinecap="round" />
                      {/* Orbiting dot */}
                      <g style={{ transformOrigin: '60px 60px', animation: 'orbit 5s linear infinite' }}>
                        <circle cx="60" cy="8" r="3.5" fill="#14b8a6" />
                      </g>
                    </svg>
                  </div>

                  {/* ECG Line */}
                  <div className="w-full px-2">
                    <svg viewBox="0 0 280 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                      <path
                        className="ecg-path"
                        d="M0 28 L40 28 L52 28 L58 8 L64 48 L70 14 L76 28 L90 28 L100 28 L112 28 L118 8 L124 48 L130 14 L136 28 L150 28 L160 28 L172 28 L178 8 L184 48 L190 14 L196 28 L210 28 L220 28 L280 28"
                        stroke="#14b8a6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Glow line (static, faint) */}
                      <path
                        d="M0 28 L40 28 L52 28 L58 8 L64 48 L70 14 L76 28 L90 28 L100 28 L112 28 L118 8 L124 48 L130 14 L136 28 L150 28 L160 28 L172 28 L178 8 L184 48 L190 14 L196 28 L210 28 L220 28 L280 28"
                        stroke="rgba(94,234,212,0.15)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="text-teal-600 text-[10px] text-center tracking-widest uppercase mt-1">Vital Monitor</p>
                  </div>
                </div>

                {/* Bottom: info cards */}
                <div className="space-y-2.5">
                  <h2 className="ff-display text-white text-[1.6rem] leading-snug mb-3">
                    Your patients.<br />
                    <span className="text-teal-300">Your practice.</span>
                  </h2>
                  {/* <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: '👥', value: '500+', label: 'Patients' },
                      { icon: '⭐', value: '4.9',  label: 'Rating'   },
                      { icon: '🗓️', value: '10yr', label: 'Exp.'     },
                    ].map((c) => (
                      <div key={c.label} className="float-card text-center py-2.5 px-1">
                        <span className="text-base">{c.icon}</span>
                        <p className="text-teal-200 font-semibold text-sm mt-0.5">{c.value}</p>
                        <p className="text-teal-600 text-[10px]">{c.label}</p>
                      </div>
                    ))}
                  </div> */}
                </div>
              </div>
            )}
          </div>

          {/* ══════════════ RIGHT PANEL (FORM) ══════════════ */}
          <div className="flex-1 flex flex-col justify-center px-8 py-10 lg:px-12">

            {/* Header */}
            <div className="mb-7">
              <p className={`text-[10.5px] font-semibold tracking-[0.18em] uppercase mb-1 transition-colors duration-500 ${isAdmin ? 'text-violet-600' : 'text-teal-600'}`}>
                Secure Access
              </p>
              <h1 className="ff-display text-slate-900 text-[1.85rem] leading-none mb-1">
                Welcome back to MediSlot
              </h1>
              <p className="text-slate-400 text-[13px] font-light">
                Sign in as {isAdmin ? 'Admin' : 'Doctor'} to continue
              </p>
            </div>

            {/* Role switcher */}
            <div className="flex bg-slate-100 rounded-xl p-1 mb-6 gap-1">
              {[
                { role: 'Admin',  icon: '🛡️' },
                { role: 'Doctor', icon: '🩺' },
              ].map(({ role, icon }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setState(role)}
                  className={`flex-1 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-300 flex items-center justify-center gap-1.5
                    ${state === role
                      ? role === 'Admin'
                        ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                        : 'bg-teal-600 text-white shadow-md shadow-teal-200'
                      : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <span className="text-base">{icon}</span>
                  {role}
                </button>
              ))}
            </div>

            {/* Fields */}
            <form onSubmit={onSubmitHandler} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isAdmin ? 'admin@hospital.com' : 'doctor@hospital.com'}
                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13.5px] text-slate-800 placeholder-slate-400 transition-all duration-200 ${isAdmin ? 'inp-adm' : 'inp-doc'}`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className={`w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[13.5px] text-slate-800 placeholder-slate-400 transition-all duration-200 ${isAdmin ? 'inp-adm' : 'inp-doc'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPass ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`btn-shimmer w-full py-3.5 rounded-xl text-white text-[13.5px] font-semibold tracking-wide transition-all duration-300 mt-1
                  hover:-translate-y-0.5 active:translate-y-0
                  disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
                  ${isAdmin
                    ? 'bg-gradient-to-r from-violet-600 to-violet-700 shadow-lg shadow-violet-200 hover:shadow-violet-300'
                    : 'bg-gradient-to-r from-teal-600 to-teal-700 shadow-lg shadow-teal-200 hover:shadow-teal-300'
                  }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing in…
                  </span>
                ) : (
                  `Sign in as ${state}`
                )}
              </button>
            </form>

            {/* Switch link */}
            <p className="text-center text-slate-400 text-xs mt-5">
              {isAdmin ? 'Are you a doctor?' : 'Are you an admin?'}{' '}
              <span
                onClick={() => setState(isAdmin ? 'Doctor' : 'Admin')}
                className={`font-semibold cursor-pointer underline underline-offset-2 transition-colors
                  ${isAdmin
                    ? 'text-teal-600 hover:text-teal-700'
                    : 'text-violet-600 hover:text-violet-700'
                  }`}
              >
                Switch to {isAdmin ? 'Doctor' : 'Admin'} Login
              </span>
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader, CalendarCheck, ArrowRight, ShieldCheck, Clock3, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { useNavigate } from 'react-router-dom';

/* ── Google Fonts ── */
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap';
document.head.appendChild(fontLink);

/* ── Mesh gradient blobs ── */
const Blobs = () => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    <div style={{
      position: 'absolute', top: '-120px', left: '-100px',
      width: '500px', height: '500px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(167,139,250,0.45) 0%, transparent 65%)',
      filter: 'blur(50px)',
    }} />
    <div style={{
      position: 'absolute', bottom: '-120px', right: '-80px',
      width: '420px', height: '420px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(196,130,245,0.35) 0%, transparent 65%)',
      filter: 'blur(55px)',
    }} />
    <div style={{
      position: 'absolute', top: '45%', left: '38%',
      width: '300px', height: '300px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(129,140,248,0.2) 0%, transparent 65%)',
      filter: 'blur(40px)',
    }} />
  </div>
);

/* ── Feature row ── */
const Feature = ({ icon: Icon, text, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
  >
    <div style={{
      width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
      background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.25)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon size={16} color="rgba(255,255,255,0.92)" />
    </div>
    <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.83rem', color: 'rgba(255,255,255,0.82)', lineHeight: 1.4 }}>
      {text}
    </span>
  </motion.div>
);

/* ── Input field ── */
const Field = ({ icon: Icon, type, placeholder, value, onChange, autoComplete }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      position: 'relative', marginBottom: '14px', borderRadius: '13px',
      border: focused ? '1.5px solid #7c3aed' : '1.5px solid #ede9f8',
      background: focused ? '#faf8ff' : '#f7f4fd',
      transition: 'all 0.22s ease',
      boxShadow: focused ? '0 0 0 4px rgba(124,58,237,0.08)' : 'none',
    }}>
      <Icon size={16} style={{
        position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)',
        color: focused ? '#7c3aed' : '#b5aecb', transition: 'color 0.2s',
      }} />
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '13px 15px 13px 42px',
          background: 'transparent', border: 'none', outline: 'none',
          fontFamily: 'Outfit, sans-serif', fontSize: '0.88rem', color: '#1a1025', borderRadius: '13px',
        }}
      />
    </div>
  );
};

/* ══════════════════════ Main ══════════════════════ */
const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, setVerificationEmail, clearError, clearVerificationEmail } = useAuthStore();
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    clearError();
    clearVerificationEmail();
  }, [clearError, clearVerificationEmail]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await login(email, password);
    if (response?.user && !response.user.isVerified) {
      setVerificationEmail(email);
      setShowVerificationMessage(true);
      setTimeout(() => navigate('/verify-email', { state: { email } }), 3000);
    } else {
      clearVerificationEmail();
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
     // background: 'linear-gradient(145deg, #f0ebff 0%, #f8eeff 40%, #eaf0ff 100%)',
      padding: '24px', fontFamily: 'Outfit, sans-serif',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: 'flex', width: '100%', maxWidth: '920px',
          borderRadius: '30px', overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(90,50,180,0.16), 0 6px 20px rgba(0,0,0,0.05)',
        }}
      >

        {/* ─── LEFT PANEL ─── */}
        <div style={{
          flex: '0 0 44%',
          background: 'linear-gradient(155deg, #5b21b6 0%, #7c3aed 45%, #a855f7 80%, #c084fc 100%)',
          padding: '52px 46px', display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', position: 'relative', overflow: 'hidden',
        }}>
          <Blobs />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ display: 'flex', alignItems: 'center', gap: '11px', position: 'relative', zIndex: 1 }}
          >
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CalendarCheck size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: '#fff', fontWeight: 600, letterSpacing: '0.02em', lineHeight: 1 }}>
                MediSlot
              </div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.58)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: '3px' }}>
                Patient Portal
              </div>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.65 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <h1 style={{
              fontFamily: 'Cormorant Garamond, serif', fontSize: '2.75rem', fontWeight: 600,
              color: '#fff', lineHeight: 1.18, margin: '0 0 14px',
            }}>
              Book.<br /><em style={{ fontStyle: 'italic', fontWeight: 400 }}>Heal.</em><br />Repeat.
            </h1>
            <p style={{
              fontFamily: 'Outfit, sans-serif', fontSize: '0.84rem',
              color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, maxWidth: '230px', margin: 0,
            }}>
              Your health appointments, organised and at your fingertips — anytime, anywhere.
            </p>
          </motion.div>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative', zIndex: 1 }}>
            <Feature icon={CalendarCheck} text="Instant slot booking with top specialists" delay={0.45} />
            <Feature icon={Clock3}        text="Real-time availability & smart reminders"  delay={0.55} />
            <Feature icon={ShieldCheck}   text="Secure, HIPAA-compliant health records"    delay={0.65} />
          </div>

          {/* Decorative rings */}
          <div style={{ position: 'absolute', bottom: '-90px', right: '-90px', width: '280px', height: '280px', borderRadius: '50%', border: '45px solid rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-30px', right: '-30px', width: '140px', height: '140px', borderRadius: '50%', border: '20px solid rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div style={{
          flex: 1, background: '#ffffff',
          padding: '52px 46px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            style={{ marginBottom: '34px' }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#f3eeff', borderRadius: '20px', padding: '5px 13px', marginBottom: '14px',
            }}>
              <Stethoscope size={12} color="#7c3aed" />
              <span style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase' }}>
                Sign in to continue
              </span>
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.1rem', fontWeight: 600, color: '#1a1025', margin: 0, lineHeight: 1.2 }}>
              Welcome back<br />
              <span style={{ color: '#7c3aed', fontStyle: 'italic', fontWeight: 400 }}>to MediSlot</span>
            </h2>
          </motion.div>

          {/* Form */}
          <motion.form onSubmit={handleLogin} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}>
            <Field icon={Mail} type="email"     placeholder="Email address" value={email}    onChange={(e) => setEmail(e.target.value)}    autoComplete="email" />
            <Field icon={Lock} type="password"  placeholder="Password"      value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />

            <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '-2px 0 18px' }}>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#7c3aed', textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>

            {/* Feedback */}
            <AnimatePresence mode="wait">
              {showVerificationMessage ? (
                <motion.div
                  key="verify"
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    background: 'linear-gradient(135deg, #fffbeb, #fff8e1)',
                    border: '1px solid #fde68a', borderRadius: '12px',
                    padding: '13px 16px', marginBottom: '14px',
                  }}
                >
                  <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: '1px' }}>✉️</span>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#92400e', marginBottom: '2px' }}>Email not verified</div>
                    <div style={{ fontSize: '0.78rem', color: '#b45309', lineHeight: 1.5 }}>Redirecting you to the verification page…</div>
                  </div>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: '#fff1f2', border: '1px solid #fecdd3',
                    borderRadius: '12px', padding: '12px 16px', marginBottom: '14px',
                  }}
                >
                  <span style={{ fontSize: '1rem' }}>⚠️</span>
                  <span style={{ fontSize: '0.82rem', color: '#be123c', fontWeight: 500 }}>{error}</span>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              type="submit" disabled={isLoading}
              whileHover={{ scale: 1.015, boxShadow: '0 12px 32px rgba(109,40,217,0.42)' }}
              whileTap={{ scale: 0.975 }}
              style={{
                width: '100%', padding: '14px 24px',
                background: 'linear-gradient(135deg, #5b21b6 0%, #7c3aed 60%, #9333ea 100%)',
                color: '#fff', border: 'none', borderRadius: '13px',
                fontSize: '0.92rem', fontFamily: 'Outfit, sans-serif', fontWeight: 600,
                letterSpacing: '0.04em', cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 8px 26px rgba(109,40,217,0.32)',
                opacity: isLoading ? 0.75 : 1, transition: 'opacity 0.2s',
              }}
            >
              {isLoading
                ? <Loader size={19} style={{ animation: 'spin 1s linear infinite' }} />
                : <><span>Sign In</span><ArrowRight size={16} /></>
              }
            </motion.button>
          </motion.form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#f0ebfa' }} />
            <span style={{ fontSize: '0.72rem', color: '#c4b5fd', fontWeight: 500, letterSpacing: '0.06em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#f0ebfa' }} />
          </div>

          {/* Sign up */}
          <p style={{ textAlign: 'center', fontSize: '0.84rem', color: '#6b7280', margin: 0 }}>
            New to MediSlot?{' '}
            <Link to="/signUp" style={{ color: '#7c3aed', fontWeight: 600, textDecoration: 'none', borderBottom: '1.5px solid #ddd6fe', paddingBottom: '1px' }}>
              Create a free account
            </Link>
          </p>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '18px', marginTop: '26px', paddingTop: '20px', borderTop: '1px solid #f5f0ff', flexWrap: 'wrap' }}
          >
            {[{ icon: '🔒', label: 'Secure login' }, { icon: '🩺', label: 'HIPAA compliant' }, { icon: '⚡', label: '24 / 7 access' }].map(({ icon, label }) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.71rem', color: '#a78bfa', fontWeight: 500 }}>
                <span>{icon}</span>{label}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LoginComponent;
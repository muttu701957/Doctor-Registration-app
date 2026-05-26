import { AdminContext } from '../../context/AdminContext';
import { useEffect, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import assets from '../../assets/assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '../../context/AppContext';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

/* ─── Tooltips ─── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      {label && <p className="font-semibold text-gray-600 mb-1.5 text-xs uppercase tracking-wide">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <p className="text-xs text-gray-500">{p.name}: <span className="font-bold text-gray-700">{p.value}</span></p>
        </div>
      ))}
    </div>
  );
};
CustomTooltip.propTypes = {
  active: PropTypes.bool, label: PropTypes.string,
  payload: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), color: PropTypes.string })),
};
CustomTooltip.defaultProps = { active: false, label: '', payload: [] };

const SpecialityTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-bold text-gray-700">{payload[0].name}</p>
      <p className="text-xs text-gray-400 mt-0.5">{payload[0].value} appointment{payload[0].value > 1 ? 's' : ''}</p>
    </div>
  );
};
SpecialityTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string, value: PropTypes.number })),
};
SpecialityTooltip.defaultProps = { active: false, payload: [] };

/* ─── Stat Card ─── */
const StatCard = ({ icon, emoji, value, label, sub, accent }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 flex-1 min-w-44 shadow-sm hover:shadow-md transition-shadow cursor-default`}>
    <div className={`w-13 h-13 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
      {emoji
        ? <span className="text-2xl">{emoji}</span>
        : <img src={icon} className="w-8" alt="" />}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800 leading-none">{value}</p>
      <p className="text-sm text-gray-400 mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-300 mt-0.5">{sub}</p>}
    </div>
  </div>
);
StatCard.propTypes = {
  icon: PropTypes.string, emoji: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired, sub: PropTypes.string, accent: PropTypes.string,
};
StatCard.defaultProps = { icon: '', emoji: '', sub: '', accent: 'bg-gray-50' };

/* ─── Section Card ─── */
const SectionCard = ({ title, subtitle, children, className }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
    <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
      <div>
        <p className="font-semibold text-gray-700 text-sm">{title}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="p-5">{children}</div>
  </div>
);
SectionCard.propTypes = {
  title: PropTypes.string.isRequired, subtitle: PropTypes.string,
  children: PropTypes.node.isRequired, className: PropTypes.string,
};
SectionCard.defaultProps = { subtitle: '', className: '' };

/* ══════════════════════════════════════════════════════ */
const Dashboard = () => {
  const { aToken, getDashboard, cancelAppointment, dashData } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) getDashboard();
    else console.log('Admin token is missing. Please authenticate.');
  }, [aToken]);

  const charts = useMemo(() => {
    if (!dashData) return null;
    const appts = dashData.latestAppointments;

    // Speciality pie
    const specMap = {};
    appts.forEach(a => {
      const s = a.docData.speciality || 'Unknown';
      specMap[s] = (specMap[s] || 0) + 1;
    });
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    const specialityData = Object.entries(specMap).map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }));

    // Status
    const completed = appts.filter(a => a.isCompleted).length;
    const cancelled  = appts.filter(a => a.cancelled).length;
    const pending    = appts.filter(a => !a.isCompleted && !a.cancelled).length;
    const statusData = [
      { name: 'Completed', value: completed, color: '#10b981' },
      { name: 'Pending',   value: pending,   color: '#3b82f6' },
      { name: 'Cancelled', value: cancelled,  color: '#ef4444' },
    ].filter(d => d.value > 0);

    // Per-doctor
    const docMap = {};
    appts.forEach(a => {
      const name = a.docData.name.trim();
      if (!docMap[name]) docMap[name] = { total: 0, completed: 0, cancelled: 0 };
      docMap[name].total++;
      if (a.isCompleted) docMap[name].completed++;
      if (a.cancelled)   docMap[name].cancelled++;
    });
    const doctorData = Object.entries(docMap).map(([name, v]) => ({
      name: name.replace(/^Dr\.\s*/i, '').split(' ')[0],
      bookings: v.total, completed: v.completed, cancelled: v.cancelled,
    }));

    // Weekly
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const slotKey = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      const matched = appts.filter(a => a.slotDate === slotKey);
      return {
        date: days[d.getDay()],
        total: matched.length,
        completed: matched.filter(a => a.isCompleted).length,
        cancelled: matched.filter(a => a.cancelled).length,
      };
    });

    const completionRate = appts.length ? Math.round((completed / appts.length) * 100) : 0;
    //const totalRevenue   = appts.filter(a => !a.cancelled).reduce((s, a) => s + a.amount, 0);

    return { statusData, doctorData, weeklyData, specialityData, completionRate, cancelled, pending, completed };
  }, [dashData]);

  if (!dashData || !charts) return null;

  return (
    <div className="min-h-screen bg-gray-50/60 p-6 space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Welcome back, Admin 👋</p>
        </div>
        <div className="text-xs text-gray-400 bg-white border border-gray-100 px-3 py-1.5 rounded-full shadow-sm">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* ── KPI row ── */}
      <div className="flex flex-wrap gap-4">
        <StatCard icon={assets.doctor_icon}      value={dashData.doctors}      label="Total Doctors"       sub="Active practitioners"   accent="bg-blue-50" />
        <StatCard icon={assets.appointment_icon} value={dashData.appointments} label="Total Appointments"  sub="All time"               accent="bg-indigo-50" />
        <StatCard icon={assets.patients_icon}    value={dashData.users}        label="Patients"            sub="Registered users"       accent="bg-emerald-50" />
        {/* <StatCard emoji="✓"  value={`${charts.completionRate}%`} label="Completion Rate" sub={`${charts.completed} completed`}  accent="bg-emerald-50" /> */}
        <StatCard emoji="⏳" value={charts.pending}              label="Pending"         sub="Awaiting completion"              accent="bg-amber-50" />
         {/* <StatCard emoji="₹"  value={`₹${charts.totalRevenue.toLocaleString('en-IN')}`} label="Revenue (Recent)" sub="From latest bookings" accent="bg-violet-50" /> */}
      </div>

      {/* ── Charts row 1: Weekly + Speciality ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <SectionCard title="Weekly Appointments" subtitle="Last 7 days" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={charts.weeklyData} margin={{ top: 5, right: 5, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gCancel" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 4" />
              <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total"     name="Total"     stroke="#3b82f6" strokeWidth={2.5} fill="url(#gTotal)"  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#2563eb' }} />
              <Area type="monotone" dataKey="cancelled" name="Cancelled" stroke="#ef4444" strokeWidth={2}   fill="url(#gCancel)" dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="By Speciality" subtitle="Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={charts.specialityData} cx="50%" cy="44%" innerRadius={52} outerRadius={76} paddingAngle={3} dataKey="value" stroke="none">
                {charts?.specialityData?.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<SpecialityTooltip />} />
              <Legend iconType="circle" iconSize={7} formatter={v => <span className="text-xs text-gray-500">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

      </div>

      {/* ── Charts row 2: Status + Doctor bar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <SectionCard title="Status Breakdown" subtitle="Recent appointments">
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie data={charts.statusData} cx="50%" cy="44%" innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value" stroke="none">
                {charts.statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={7} formatter={v => <span className="text-xs text-gray-500">{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
          {/* summary pills */}
          <div className="flex gap-2 mt-2 flex-wrap">
            {charts.statusData.map((s, i) => (
              <span key={i} className="text-xs font-semibold px-3 py-1 rounded-full border"
                style={{ color: s.color, background: `${s.color}12`, borderColor: `${s.color}30` }}>
                {s.name}: {s.value}
              </span>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Bookings per Doctor" subtitle="Recent activity" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={charts.doctorData} margin={{ top: 5, right: 5, left: -22, bottom: 0 }} barSize={14} barCategoryGap="30%">
              <CartesianGrid stroke="#f1f5f9" strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="bookings"  name="Total"     fill="#3b82f6" radius={[4,4,0,0]} />
              <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4,4,0,0]} />
              <Bar dataKey="cancelled" name="Cancelled" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

      </div>

      {/* ── Latest Bookings ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2.5">
            <img src={assets.list_icon} alt="" className="w-5 opacity-60" />
            <p className="font-semibold text-gray-700">Latest Bookings</p>
          </div>
          <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
            {dashData.latestAppointments.length} records
          </span>
        </div>

        {/* table header */}
        <div className="hidden md:grid grid-cols-12 px-6 py-2.5 bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-3">Doctor</div>
          <div className="col-span-2">Patient</div>
          <div className="col-span-2">Date & Time</div>
          <div className="col-span-2">Speciality</div>
          <div className="col-span-1 text-right">Fee</div>
          <div className="col-span-1 text-right">Status</div>
        </div>

        <div className="divide-y divide-gray-50">
          {dashData.latestAppointments.map((item, index) => (
            <div key={index} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-blue-50/30 transition-colors group gap-2">

              {/* # */}
              <div className="col-span-1">
                <span className="text-xs font-bold text-gray-300">{String(index + 1).padStart(2, '0')}</span>
              </div>

              {/* Doctor */}
              <div className="col-span-3 flex items-center gap-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <img src={item.docData.image} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all" />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${item.cancelled ? 'bg-red-400' : item.isCompleted ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </div>
                <p className="text-sm font-semibold text-gray-700 truncate">{item.docData.name.trim()}</p>
              </div>

              {/* Patient */}
              <div className="col-span-2 min-w-0">
                <p className="text-sm text-gray-600 truncate">{item.userData.name.trim()}</p>
                <p className="text-xs text-gray-300 mt-0.5">Patient</p>
              </div>

              {/* Date & Time */}
              <div className="col-span-2">
                <p className="text-xs font-semibold text-gray-600">{slotDateFormat(item.slotDate)}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.slotTime}</p>
              </div>

              {/* Speciality */}
              <div className="col-span-2">
                <span className="text-xs text-blue-500 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full font-medium">
                  {item.docData.speciality}
                </span>
              </div>

              {/* Fee */}
              <div className="col-span-1 text-right">
                <p className="text-sm font-bold text-gray-700">₹{item.amount}</p>
              </div>

              {/* Status */}
              <div className="col-span-1 flex justify-end">
                {item.cancelled ? (
                  <span className="inline-flex items-center gap-1 bg-red-50 text-red-400 border border-red-100 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Cancelled
                  </span>
                ) : item.isCompleted ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-500 border border-emerald-100 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Done
                  </span>
                ) : (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 border border-red-100 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <FontAwesomeIcon icon={faTimesCircle} className="text-xs" /> Cancel
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
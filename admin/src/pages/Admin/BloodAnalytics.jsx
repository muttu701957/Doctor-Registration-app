import { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import { Droplets, CheckCircle2, ClipboardList, Circle, HeartHandshake, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// Severity color system
const URGENCY_CHART_COLORS = {
  emergency: '#ef4444',
  urgent:    '#f97316',
  normal:    '#22c55e',
};

const BLOOD_GROUP_CHART_COLORS = ['#ef4444', '#f97316', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#6366f1'];

export default function BloodAnalytics() {
  const { backendUrl, aToken } = useContext(AdminContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/blood/admin/analytics`,
          { headers: { atoken: aToken } }
        );
        if (data.success) setAnalytics(data.analytics);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(6)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!analytics) return <div className="flex-1 p-6 text-gray-400">Failed to load analytics</div>;

  const urgencyData = (analytics.requestsByUrgency || []).map((item) => ({
    name: item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : 'Unknown',
    count: item.count,
    fill: URGENCY_CHART_COLORS[item._id] || '#6b7280',
  }));

  const bloodGroupData = (analytics.donorsByBloodGroup || []).map((item, i) => ({
    name: item._id,
    count: item.count,
    fill: BLOOD_GROUP_CHART_COLORS[i % BLOOD_GROUP_CHART_COLORS.length],
  }));

  const statCards = [
    { label: 'Total Donors',     value: analytics.totalDonors,      Icon: Droplets,       color: 'from-red-500 to-rose-400' },
    { label: 'Available Now',    value: analytics.availableDonors,   Icon: CheckCircle2,   color: 'from-green-500 to-emerald-400' },
    { label: 'Total Requests',   value: analytics.totalRequests,     Icon: ClipboardList,  color: 'from-blue-500 to-indigo-400' },
    { label: 'Active Requests',  value: analytics.activeRequests,    Icon: Circle,         color: 'from-orange-500 to-amber-400' },
    { label: 'Fulfilled',        value: analytics.fulfilledRequests, Icon: HeartHandshake, color: 'from-teal-500 to-cyan-400' },
    { label: 'Emergencies',      value: analytics.emergencyRequests, Icon: AlertCircle,    color: 'from-red-700 to-red-500' },
  ];

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Blood Donation Analytics</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className={`bg-gradient-to-br ${card.color} rounded-xl p-4 text-white shadow-sm`}>
            <card.Icon className="w-5 h-5 mb-1" />
            <div className="text-2xl font-extrabold">{card.value ?? 0}</div>
            <div className="text-xs opacity-80 mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Requests by Urgency */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-1">Requests by Urgency</h2>
          <p className="text-xs text-gray-400 mb-4">Color-coded by severity</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={urgencyData} barSize={40}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v, n) => [v, 'Requests']}
                contentStyle={{ borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {urgencyData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex gap-3 mt-2 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-red-700 font-semibold"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Emergency</span>
            <span className="flex items-center gap-1 text-xs text-orange-700 font-semibold"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block" /> Urgent</span>
            <span className="flex items-center gap-1 text-xs text-green-700 font-semibold"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Normal</span>
          </div>
        </div>

        {/* Donors by Blood Group */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-4">Donors by Blood Group</h2>
          {bloodGroupData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={bloodGroupData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, count }) => `${name}: ${count}`} labelLine={false}>
                  {bloodGroupData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">No donor data yet</p>
          )}
        </div>

        {/* Fulfillment Rate */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-4">Request Fulfillment Rate</h2>
          {analytics.totalRequests > 0 ? (
            <div className="space-y-3">
              {[
                { label: 'Fulfilled',  count: analytics.fulfilledRequests, color: 'bg-green-500' },
                { label: 'Active',     count: analytics.activeRequests,    color: 'bg-blue-500'  },
                { label: 'Other',      count: analytics.totalRequests - analytics.fulfilledRequests - analytics.activeRequests, color: 'bg-gray-300' },
              ].map((item) => {
                const pct = Math.round((item.count / analytics.totalRequests) * 100);
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{item.label}</span>
                      <span>{item.count} ({pct}%)</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-6">No requests yet</p>
          )}
        </div>

        {/* Donor Availability */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-bold text-gray-800 mb-4">Donor Availability</h2>
          <div className="flex items-center justify-center gap-8 py-4">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-green-600">{analytics.availableDonors}</div>
              <div className="text-sm text-gray-500 mt-1">Available</div>
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mt-1.5" />
            </div>
            <div className="text-3xl text-gray-300">/</div>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-gray-500">{analytics.totalDonors - analytics.availableDonors}</div>
              <div className="text-sm text-gray-500 mt-1">Unavailable</div>
              <div className="w-3 h-3 bg-gray-400 rounded-full mx-auto mt-1.5" />
            </div>
          </div>
          {analytics.totalDonors > 0 && (
            <div className="mt-2">
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${Math.round((analytics.availableDonors / analytics.totalDonors) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 text-center">
                {Math.round((analytics.availableDonors / analytics.totalDonors) * 100)}% available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

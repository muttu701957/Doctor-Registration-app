import { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AlertCircle, AlertTriangle, Droplets, MapPin, Loader2, X, Radio } from 'lucide-react';

// Severity color system — emergency=red, urgent=orange, normal=green
const URGENCY_CONFIG = {
  emergency: { bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-400',    label: 'EMERGENCY', Icon: AlertCircle,   rowBg: 'bg-red-50'   },
  urgent:    { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-400', label: 'Urgent',    Icon: AlertTriangle, rowBg: 'bg-orange-50' },
  normal:    { bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-300',  label: 'Normal',    Icon: Droplets,      rowBg: ''             },
};

const STATUS_CONFIG = {
  active:    { bg: 'bg-blue-100',  text: 'text-blue-800',  border: 'border-blue-300'  },
  fulfilled: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  cancelled: { bg: 'bg-gray-100',  text: 'text-gray-500',  border: 'border-gray-300'  },
  closed:    { bg: 'bg-gray-100',  text: 'text-gray-500',  border: 'border-gray-300'  },
};

const STATUSES = ['', 'active', 'fulfilled', 'cancelled', 'closed'];
const URGENCIES = ['', 'emergency', 'urgent', 'normal'];
const BLOOD_GROUPS = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodRequests() {
  const { backendUrl, aToken } = useContext(AdminContext);

  const [requests, setRequests] = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [pages, setPages]       = useState(1);
  const [loading, setLoading]   = useState(false);
  const [statusFilter, setStatusFilter]   = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [emergency, setEmergency] = useState({ patientName: '', requiredBloodGroup: '', contactNumber: '', latitude: '', longitude: '', locationName: '', additionalNotes: '' });
  const [locating, setLocating] = useState(false);

  const fetchRequests = async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 20 });
      if (statusFilter)  params.append('status', statusFilter);
      if (urgencyFilter) params.append('urgency', urgencyFilter);

      const { data } = await axios.get(
        `${backendUrl}/api/blood/admin/requests?${params}`,
        { headers: { atoken: aToken } }
      );
      if (data.success) {
        setRequests(data.requests);
        setTotal(data.total);
        setPages(data.pages);
        setPage(p);
      }
    } catch {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(1); }, [statusFilter, urgencyFilter]);

  const handleStatusUpdate = async (requestId, status) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/blood/admin/requests/status`,
        { requestId, status },
        { headers: { atoken: aToken } }
      );
      if (data.success) {
        toast.success('Status updated');
        setRequests((prev) => prev.map((r) => r._id === requestId ? { ...r, status } : r));
      }
    } catch { toast.error('Update failed'); }
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setEmergency((e) => ({ ...e, latitude: pos.coords.latitude.toString(), longitude: pos.coords.longitude.toString() }));
        setLocating(false);
        toast.success('Location captured');
      },
      () => { setLocating(false); toast.error('Location access denied'); }
    );
  };

  const handleEmergencySubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/blood/admin/requests/emergency`,
        emergency,
        { headers: { atoken: aToken } }
      );
      if (data.success) {
        toast.success(`🆘 Emergency broadcast sent to ${data.notifiedCount} donors`);
        setShowEmergencyForm(false);
        setEmergency({ patientName: '', requiredBloodGroup: '', contactNumber: '', latitude: '', longitude: '', locationName: '', additionalNotes: '' });
        fetchRequests(1);
      }
    } catch { toast.error('Failed to broadcast emergency'); }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blood Requests</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} total requests</p>
        </div>
        <button
          onClick={() => setShowEmergencyForm(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-1.5"
        >
          <Radio className="w-4 h-4" /> Emergency Broadcast
        </button>
      </div>

      {/* Urgency legend */}
      <div className="flex gap-2 flex-wrap mb-4">
        <span className="text-xs text-gray-500 self-center font-medium">Severity:</span>
        <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-800 border border-red-400 px-2.5 py-1 rounded-full font-semibold"><AlertCircle className="w-3.5 h-3.5 shrink-0" /> Emergency = Red</span>
        <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-800 border border-orange-400 px-2.5 py-1 rounded-full font-semibold"><AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Urgent = Orange</span>
        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 border border-green-300 px-2.5 py-1 rounded-full font-semibold"><Droplets className="w-3.5 h-3.5 shrink-0" /> Normal = Green</span>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap mb-5">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
          {STATUSES.map((s) => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>
        <select value={urgencyFilter} onChange={(e) => setUrgencyFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300">
          {URGENCIES.map((u) => <option key={u} value={u}>{u ? u.charAt(0).toUpperCase() + u.slice(1) : 'All Urgencies'}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left">Patient</th>
                <th className="px-4 py-3 text-left">Blood Group</th>
                <th className="px-4 py-3 text-left">Urgency</th>
                <th className="px-4 py-3 text-left">Contact</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Notified</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>{[...Array(8)].map((__, j) => <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>)}</tr>
                ))
              ) : requests.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">No requests found</td></tr>
              ) : (
                requests.map((req) => {
                  const uc = URGENCY_CONFIG[req.urgencyType] || URGENCY_CONFIG.normal;
                  const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG.active;
                  return (
                    <tr key={req._id} className={`hover:bg-gray-50 transition-colors ${uc.rowBg}`}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800">{req.patientName}</p>
                        <p className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleDateString('en-IN')}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-sm font-bold text-red-700"><Droplets className="w-3.5 h-3.5 shrink-0" /> {req.requiredBloodGroup}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${uc.bg} ${uc.text} ${uc.border}`}>
                          <uc.Icon className="w-3 h-3 shrink-0" /> {uc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{req.contactNumber}</td>
                      <td className="px-4 py-3 text-xs max-w-[140px]">
                        <p className="text-gray-500 truncate">{req.locationName || '—'}</p>
                        {req.location?.coordinates?.length === 2 && (
                          <a
                            href={`https://www.google.com/maps?q=${req.location.coordinates[1]},${req.location.coordinates[0]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-800 hover:underline font-medium mt-0.5"
                          >
                            <MapPin className="w-3 h-3 shrink-0" />Maps
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-center">{req.notifiedCount ?? 0}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${sc.bg} ${sc.text} ${sc.border}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {req.status === 'active' && (
                          <div className="flex gap-1.5">
                            <button onClick={() => handleStatusUpdate(req._id, 'fulfilled')} className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded-lg">Fulfilled</button>
                            <button onClick={() => handleStatusUpdate(req._id, 'cancelled')} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded-lg">Cancel</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => fetchRequests(page - 1)} className="px-3 py-1 text-xs border rounded-lg disabled:opacity-40 hover:bg-gray-50">← Prev</button>
              <button disabled={page === pages} onClick={() => fetchRequests(page + 1)} className="px-3 py-1 text-xs border rounded-lg disabled:opacity-40 hover:bg-gray-50">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Broadcast Modal */}
      {showEmergencyForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg flex items-center gap-2"><Radio className="w-5 h-5" /> Emergency Blood Broadcast</h2>
              <button onClick={() => setShowEmergencyForm(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleEmergencySubmit} className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 font-medium">
                This will notify ALL compatible donors within 50km immediately via app and email.
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Patient Name *', key: 'patientName', type: 'text', req: true },
                  { label: 'Contact *', key: 'contactNumber', type: 'tel', req: true },
                ].map(({ label, key, type, req }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                    <input type={type} value={emergency[key]} onChange={(e) => setEmergency({ ...emergency, [key]: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" required={req} />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Required Blood Group *</label>
                <select value={emergency.requiredBloodGroup} onChange={(e) => setEmergency({ ...emergency, requiredBloodGroup: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" required>
                  <option value="">Select blood group</option>
                  {BLOOD_GROUPS.filter(Boolean).map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Location</label>
                <button type="button" onClick={handleGeolocate} disabled={locating}
                  className="w-full border-2 border-dashed border-red-300 rounded-lg py-2 text-sm text-red-600 hover:bg-red-50 mb-2">
                  {locating ? <><Loader2 className="w-4 h-4 animate-spin mr-1 inline" />Detecting...</> : <><MapPin className="w-4 h-4 mr-1 inline" />Detect Location</>}
                </button>
                <input type="text" value={emergency.locationName} onChange={(e) => setEmergency({ ...emergency, locationName: e.target.value })}
                  placeholder="Location / Hospital name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Notes</label>
                <textarea value={emergency.additionalNotes} onChange={(e) => setEmergency({ ...emergency, additionalNotes: e.target.value })}
                  rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none" />
              </div>
              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-sm">
                <span className="flex items-center justify-center gap-2"><Radio className="w-4 h-4" /> Broadcast Emergency Alert</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

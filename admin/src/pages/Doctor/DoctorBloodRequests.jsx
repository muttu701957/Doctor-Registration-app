import { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContest';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AlertCircle, AlertTriangle, Droplets, Phone, MapPin, Bell, CheckCircle2, X, Loader2 } from 'lucide-react';

// Severity color system — emergency=red, urgent=orange, normal=green
const URGENCY_CONFIG = {
  emergency: { bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-400',    label: 'EMERGENCY', Icon: AlertCircle,   leftBorder: 'border-l-red-500'   },
  urgent:    { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-400', label: 'Urgent',    Icon: AlertTriangle, leftBorder: 'border-l-orange-500' },
  normal:    { bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-300',  label: 'Normal',    Icon: Droplets,      leftBorder: 'border-l-green-500'  },
};

const STATUS_CONFIG = {
  active:    { bg: 'bg-blue-100',  text: 'text-blue-800',  border: 'border-blue-300'  },
  fulfilled: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  cancelled: { bg: 'bg-gray-100',  text: 'text-gray-500',  border: 'border-gray-300'  },
  closed:    { bg: 'bg-gray-100',  text: 'text-gray-500',  border: 'border-gray-300'  },
};

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const URGENCY_OPTIONS = ['normal', 'urgent', 'emergency'];

export default function DoctorBloodRequests() {
  const { backendUrl, dToken } = useContext(DoctorContext);

  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    patientName: '', requiredBloodGroup: '', contactNumber: '',
    latitude: '', longitude: '', locationName: '',
    urgencyType: 'normal', additionalNotes: '', requiredDate: '',
  });

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/blood/doctor/request/my-requests`,
        { headers: { dtoken: dToken } }
      );
      if (data.success) setRequests(data.requests);
    } catch { toast.error('Could not load requests'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRequests(); }, []);

  useEffect(() => { if (showForm && !form.latitude) handleGeolocate(); }, [showForm]);

  const handleGeolocate = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, latitude: pos.coords.latitude.toString(), longitude: pos.coords.longitude.toString() }));
        setLocating(false);
        toast.success('Location captured');
      },
      () => { setLocating(false); toast.error('Location denied'); }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.requiredBloodGroup) return toast.error('Select blood group');
    if (!form.latitude) return toast.error('Location required');
    setSubmitting(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/blood/doctor/request/create`,
        form,
        { headers: { dtoken: dToken } }
      );
      if (data.success) {
        toast.success(`Request sent! ${data.notifiedCount} donors notified.`);
        setShowForm(false);
        setForm({ patientName: '', requiredBloodGroup: '', contactNumber: '', latitude: '', longitude: '', locationName: '', urgencyType: 'normal', additionalNotes: '', requiredDate: '' });
        fetchRequests();
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const handleClose = async (requestId) => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/blood/doctor/request/close`, { requestId }, { headers: { dtoken: dToken } });
      if (data.success) { toast.success('Marked as fulfilled'); setRequests((prev) => prev.map((r) => r._id === requestId ? { ...r, status: 'fulfilled' } : r)); }
    } catch { toast.error('Failed'); }
  };

  const handleCancel = async (requestId) => {
    if (!window.confirm('Cancel this request?')) return;
    try {
      const { data } = await axios.put(`${backendUrl}/api/blood/doctor/request/cancel`, { requestId }, { headers: { dtoken: dToken } });
      if (data.success) { toast.success('Cancelled'); setRequests((prev) => prev.map((r) => r._id === requestId ? { ...r, status: 'cancelled' } : r)); }
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Blood Requests</h1>
          <p className="text-gray-500 text-sm mt-0.5">{requests.length} requests</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-sm">
          + New Request
        </button>
      </div>

      {/* Urgency Legend */}
      <div className="flex gap-2 flex-wrap mb-5">
        <span className="text-xs text-gray-500 self-center">Severity:</span>
        <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-800 border border-red-400 px-2.5 py-1 rounded-full font-semibold"><AlertCircle className="w-3.5 h-3.5 shrink-0" /> Emergency = Red</span>
        <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-800 border border-orange-400 px-2.5 py-1 rounded-full font-semibold"><AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Urgent = Orange</span>
        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 border border-green-300 px-2.5 py-1 rounded-full font-semibold"><Droplets className="w-3.5 h-3.5 shrink-0" /> Normal = Green</span>
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map((i) => <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <Droplets className="w-12 h-12 text-red-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">No blood requests yet</p>
          <button onClick={() => setShowForm(true)} className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm">Create Request</button>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const uc = URGENCY_CONFIG[req.urgencyType] || URGENCY_CONFIG.normal;
            const sc = STATUS_CONFIG[req.status] || STATUS_CONFIG.active;
            return (
              <div key={req._id} className={`bg-white border border-gray-200 border-l-4 ${uc.leftBorder} rounded-xl p-4 shadow-sm`}>
                <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-sm font-extrabold text-red-700"><Droplets className="w-3.5 h-3.5 shrink-0" /> {req.requiredBloodGroup}</span>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${uc.bg} ${uc.text} ${uc.border}`}><uc.Icon className="w-3 h-3 shrink-0" />{uc.label}</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${sc.bg} ${sc.text} ${sc.border}`}>{req.status}</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">{req.patientName}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3 shrink-0" />{req.contactNumber}</span>
                  {req.locationName && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 shrink-0" />{req.locationName}</span>}
                  {req.location?.coordinates?.length === 2 && (
                    <a
                      href={`https://www.google.com/maps?q=${req.location.coordinates[1]},${req.location.coordinates[0]}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MapPin className="w-3 h-3 shrink-0" />View on Maps
                    </a>
                  )}
                  <span className="flex items-center gap-1"><Bell className="w-3 h-3 shrink-0" />{req.notifiedCount ?? 0} notified</span>
                  <span>{new Date(req.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
                {req.status === 'active' && (
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleClose(req._id)} className="flex-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 py-1.5 rounded-lg font-medium flex items-center justify-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />Mark Fulfilled</button>
                    <button onClick={() => handleCancel(req._id)} className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 py-1.5 rounded-lg font-medium">Cancel</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Request Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 overflow-y-auto py-8">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className={`px-6 py-4 flex items-center justify-between ${form.urgencyType === 'emergency' ? 'bg-red-600' : form.urgencyType === 'urgent' ? 'bg-orange-500' : 'bg-green-600'}`}>
              <h2 className="text-white font-bold text-lg flex items-center gap-2"><Droplets className="w-5 h-5" /> New Blood Request</h2>
              <button onClick={() => setShowForm(false)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Urgency */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Urgency Level</label>
                <div className="flex gap-2">
                  {URGENCY_OPTIONS.map((u) => {
                    const colors = { normal: 'border-green-500 bg-green-50 text-green-700', urgent: 'border-orange-500 bg-orange-50 text-orange-700', emergency: 'border-red-600 bg-red-50 text-red-700' };
                    const icons  = { normal: Droplets, urgent: AlertTriangle, emergency: AlertCircle };
                    return (
                      <button key={u} type="button" onClick={() => setForm({ ...form, urgencyType: u })}
                        className={`flex-1 py-2 rounded-lg border-2 text-xs font-bold transition-all flex items-center justify-center gap-1 ${form.urgencyType === u ? colors[u] : 'border-gray-200 text-gray-500'}`}>
                        {(() => { const I = icons[u]; return <I className="w-3.5 h-3.5" />; })()} {u.charAt(0).toUpperCase() + u.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Required Blood Group *</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {BLOOD_GROUPS.map((g) => (
                    <button key={g} type="button" onClick={() => setForm({ ...form, requiredBloodGroup: g })}
                      className={`py-1.5 rounded-lg border-2 text-xs font-bold transition-all ${form.requiredBloodGroup === g ? 'border-red-500 bg-red-50 text-red-700 scale-105' : 'border-gray-200 text-gray-600'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {[
                { label: 'Patient Name *', key: 'patientName', type: 'text' },
                { label: 'Contact Number *', key: 'contactNumber', type: 'tel' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                  <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" required />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Location *</label>
                <button type="button" onClick={handleGeolocate} disabled={locating}
                  className="w-full border-2 border-dashed border-red-300 rounded-lg py-2 text-sm text-red-600 hover:bg-red-50 mb-1.5">
                  {locating ? <><Loader2 className="w-4 h-4 animate-spin mr-1 inline" />Detecting...</> : form.latitude ? <><CheckCircle2 className="w-4 h-4 mr-1 inline text-green-600" />Location set — click to update</> : <><MapPin className="w-4 h-4 mr-1 inline" />Detect Location</>}
                </button>
                <input type="text" value={form.locationName} onChange={(e) => setForm({ ...form, locationName: e.target.value })}
                  placeholder="Hospital / area name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
              </div>

              <textarea value={form.additionalNotes} onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
                placeholder="Additional notes (optional)" rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none" />

              <button type="submit" disabled={submitting}
                className={`w-full font-bold py-3 rounded-xl text-sm text-white disabled:opacity-60 transition-colors ${form.urgencyType === 'emergency' ? 'bg-red-600 hover:bg-red-700' : form.urgencyType === 'urgent' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}>
                {submitting ? 'Sending...' : `Send ${form.urgencyType.charAt(0).toUpperCase() + form.urgencyType.slice(1)} Blood Request`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

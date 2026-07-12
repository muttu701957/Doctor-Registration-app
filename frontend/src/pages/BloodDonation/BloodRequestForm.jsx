import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Droplets, AlertTriangle, AlertCircle, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useBloodStore } from '../../store/bloodStore';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const URGENCY_OPTIONS = [
  {
    value: 'normal',
    label: 'Normal',
    Icon: Droplets,
    desc: 'Planned — 24 to 48 hour window',
    selectedClass: 'border-green-500 bg-green-50 ring-2 ring-green-400',
    badgeClass: 'bg-green-100 text-green-800',
    radius: '10km',
  },
  {
    value: 'urgent',
    label: 'Urgent',
    Icon: AlertTriangle,
    desc: 'Needed within a few hours',
    selectedClass: 'border-orange-500 bg-orange-50 ring-2 ring-orange-400',
    badgeClass: 'bg-orange-100 text-orange-800',
    radius: '20km',
  },
  {
    value: 'emergency',
    label: 'Emergency',
    Icon: AlertCircle,
    desc: 'Life-threatening — immediate need',
    selectedClass: 'border-red-600 bg-red-50 ring-2 ring-red-500',
    badgeClass: 'bg-red-100 text-red-800',
    radius: '50km',
  },
];

export default function BloodRequestForm() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createBloodRequest, isLoading } = useBloodStore();
  const [locating, setLocating] = useState(false);

  const [form, setForm] = useState({
    patientName:        '',
    requiredBloodGroup: '',
    contactNumber:      user?.phone !== '0000000000' ? user?.phone || '' : '',
    latitude:           '',
    longitude:          '',
    locationName:       '',
    urgencyType:        'normal',
    additionalNotes:    '',
    requiredDate:       '',
    requestorName:      user?.name || '',
  });

  useEffect(() => { handleGeolocate(); }, []);

  const handleGeolocate = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm((f) => ({ ...f, latitude: latitude.toString(), longitude: longitude.toString() }));
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const addr = data.address;
          const name = [addr.suburb, addr.city || addr.town || addr.village, addr.state].filter(Boolean).join(', ');
          setForm((f) => ({ ...f, locationName: name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
        } catch {
          setForm((f) => ({ ...f, locationName: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
        }
        setLocating(false);
        toast.success('Location captured!');
      },
      () => { setLocating(false); toast.error('Could not get location'); }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.requiredBloodGroup) return toast.error('Select required blood group');
    if (!form.latitude || !form.longitude) return toast.error('Location is required');

    try {
      const res = await createBloodRequest(form);
      const count = res.notifiedCount ?? 0;
      toast.success(`Request created! ${count} donor${count !== 1 ? 's' : ''} notified.`);
      navigate(`/blood-donation/requests/${res.requestId}/donors`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create request');
    }
  };

  const selectedUrgency = URGENCY_OPTIONS.find((o) => o.value === form.urgencyType);

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h1 className="text-2xl font-extrabold text-gray-800">Request Blood</h1>
        <p className="text-gray-500 mt-1 text-sm">Fill in the details and we'll notify compatible donors nearby</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Urgency Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Urgency Level *</label>
          <div className="grid grid-cols-3 gap-2">
            {URGENCY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, urgencyType: opt.value })}
                className={`border-2 rounded-xl p-3 text-center transition-all ${
                  form.urgencyType === opt.value ? opt.selectedClass : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-center mb-1"><opt.Icon className="w-6 h-6" /></div>
                <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-1 ${opt.badgeClass}`}>
                  {opt.label}
                </div>
                <div className="text-xs text-gray-400 leading-tight">{opt.radius} radius</div>
              </button>
            ))}
          </div>
          {selectedUrgency && (
            <p className="text-xs text-gray-500 mt-1.5 text-center italic">{selectedUrgency.desc}</p>
          )}
        </div>

        {/* Blood Group */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Required Blood Group *</label>
          <div className="grid grid-cols-4 gap-2">
            {BLOOD_GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setForm({ ...form, requiredBloodGroup: g })}
                className={`py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                  form.requiredBloodGroup === g
                    ? 'border-red-500 bg-red-50 text-red-700 scale-105 shadow'
                    : 'border-gray-200 text-gray-600 hover:border-red-300'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Patient Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Patient Name *</label>
          <input
            type="text"
            value={form.patientName}
            onChange={(e) => setForm({ ...form, patientName: e.target.value })}
            placeholder="Name of the patient"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number *</label>
          <input
            type="tel"
            value={form.contactNumber}
            onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
            placeholder="Number donors can call"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Location *</label>
          <button
            type="button"
            onClick={handleGeolocate}
            disabled={locating}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-red-300 rounded-xl py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
          >
            {locating ? <><Loader2 className="w-4 h-4 animate-spin" /> Detecting...</> : <><MapPin className="w-4 h-4" /> Detect Location</>}
          </button>
          {form.locationName && (
            <p className="mt-2 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> {form.locationName}</p>
          )}
          <input
            type="text"
            value={form.locationName}
            onChange={(e) => setForm({ ...form, locationName: e.target.value })}
            placeholder="Or type hospital/area name"
            className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* Required Date (optional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Required By <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="date"
            value={form.requiredDate}
            onChange={(e) => setForm({ ...form, requiredDate: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Additional Notes <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={form.additionalNotes}
            onChange={(e) => setForm({ ...form, additionalNotes: e.target.value })}
            placeholder="Hospital name, ward number, any special requirements..."
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
          />
        </div>

        {/* Urgency Warning Banner */}
        {form.urgencyType === 'emergency' && (
          <div className="bg-red-50 border-2 border-red-400 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-red-700 font-semibold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            Emergency mode: All compatible donors within 50km will be immediately notified via app and email.
          </div>
        )}
        {form.urgencyType === 'urgent' && (
          <div className="bg-orange-50 border-2 border-orange-400 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-orange-700 font-semibold">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            Urgent mode: Compatible donors within 20km will be notified right away.
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full font-bold py-4 rounded-xl text-base transition-colors shadow-lg text-white disabled:opacity-60 ${
            form.urgencyType === 'emergency' ? 'bg-red-600 hover:bg-red-700'
            : form.urgencyType === 'urgent' ? 'bg-orange-500 hover:bg-orange-600'
            : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isLoading ? 'Sending Request...' : `Send ${selectedUrgency?.label} Blood Request`}
        </button>
      </form>
    </div>
  );
}

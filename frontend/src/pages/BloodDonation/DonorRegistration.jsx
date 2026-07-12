import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MapPin, Loader2, CheckCircle2, Droplets } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useBloodStore } from '../../store/bloodStore';
import AcknowledgementModal from '../../components/blood/AcknowledgementModal';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function DonorRegistration() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { registerDonor, getMyDonorProfile, donorProfile, isLoading } = useBloodStore();

  const [showAcknowledgement, setShowAcknowledgement] = useState(true);
  const [acknowledged, setAcknowledged] = useState(false);
  const [locating, setLocating] = useState(false);

  const [form, setForm] = useState({
    fullName:         user?.name || '',
    mobileNumber:     user?.phone !== '0000000000' ? user?.phone || '' : '',
    bloodGroup:       user?.bloodGroup !== 'Unknown' ? user?.bloodGroup || '' : '',
    latitude:         '',
    longitude:        '',
    locationName:     '',
    lastDonationDate: '',
    emergencyContact: '',
  });

  // Redirect if already registered
  useEffect(() => {
    getMyDonorProfile().then((res) => {
      if (res?.success !== false) navigate('/blood-donation/profile', { replace: true });
    }).catch(() => {});
    handleGeolocate();
  }, []);

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported by your browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm((f) => ({ ...f, latitude: latitude.toString(), longitude: longitude.toString() }));

        // Reverse geocode using browser-native approach
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
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
      () => {
        setLocating(false);
        toast.error('Could not get your location. Please enable location access.');
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acknowledged) { setShowAcknowledgement(true); return; }
    if (!form.bloodGroup) return toast.error('Please select your blood group');
    if (!form.latitude || !form.longitude) return toast.error('Location is required. Click "Detect Location"');
    if (!form.mobileNumber) return toast.error('Mobile number is required');

    try {
      await registerDonor({ ...form, acknowledgementAccepted: true, donorType: 'user' });
      toast.success('🩸 Registered as blood donor!');
      navigate('/blood-donation/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  if (showAcknowledgement && !acknowledged) {
    return (
      <AcknowledgementModal
        onAccept={() => { setAcknowledged(true); setShowAcknowledgement(false); }}
        onDecline={() => navigate('/blood-donation')}
      />
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-3">🩸</div>
        <h1 className="text-2xl font-extrabold text-gray-800">Register as Blood Donor</h1>
        <p className="text-gray-500 mt-1 text-sm">Fill in your details to join the Medislot donor network</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="Your full name"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number *</label>
          <input
            type="tel"
            value={form.mobileNumber}
            onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
            placeholder="10-digit mobile number"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />
        </div>

        {/* Blood Group */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Blood Group *</label>
          <div className="grid grid-cols-4 gap-2">
            {BLOOD_GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setForm({ ...form, bloodGroup: g })}
                className={`py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                  form.bloodGroup === g
                    ? 'border-red-500 bg-red-50 text-red-700 shadow-md scale-105'
                    : 'border-gray-200 text-gray-600 hover:border-red-300'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
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
            {locating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Detecting location...</>
            ) : (
              <><MapPin className="w-4 h-4" /> Detect My Location</>
            )}
          </button>
          {form.locationName && (
            <p className="mt-2 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4 inline mr-1" />{form.locationName}
            </p>
          )}
          <input
            type="text"
            value={form.locationName}
            onChange={(e) => setForm({ ...form, locationName: e.target.value })}
            placeholder="Or type your area/locality name"
            className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* Last Donation Date (optional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Last Donation Date <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="date"
            value={form.lastDonationDate}
            onChange={(e) => setForm({ ...form, lastDonationDate: e.target.value })}
            max={new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* Emergency Contact (optional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Emergency Contact <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="tel"
            value={form.emergencyContact}
            onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
            placeholder="Alternative contact number"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* Acknowledgement reminder */}
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-green-700">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          Acknowledgement accepted — your location and phone will be shared only for blood donation purposes.
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl text-base transition-colors shadow-lg"
        >
          {isLoading ? 'Registering...' : <span className="flex items-center justify-center gap-2"><Droplets className="w-4 h-4" /> Register as Donor</span>}
        </button>
      </form>
    </div>
  );
}

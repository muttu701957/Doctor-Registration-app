import { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContest';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MapPin, Loader2 } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const BLOOD_GROUP_COLORS = {
  'O+': 'border-red-400 bg-red-50 text-red-700', 'O-': 'border-red-500 bg-red-100 text-red-800',
  'A+': 'border-blue-400 bg-blue-50 text-blue-700', 'A-': 'border-blue-500 bg-blue-100 text-blue-800',
  'B+': 'border-purple-400 bg-purple-50 text-purple-700', 'B-': 'border-purple-500 bg-purple-100 text-purple-800',
  'AB+': 'border-pink-400 bg-pink-50 text-pink-700', 'AB-': 'border-pink-500 bg-pink-100 text-pink-800',
};

export default function DoctorBloodDonor() {
  const { backendUrl, dToken } = useContext(DoctorContext);

  const [donor, setDonor]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [toggling, setToggling]   = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [locating, setLocating]   = useState(false);
  const [form, setForm] = useState({
    fullName: '', mobileNumber: '', bloodGroup: '',
    latitude: '', longitude: '', locationName: '',
    lastDonationDate: '', emergencyContact: '',
    acknowledgementAccepted: false,
  });

  useEffect(() => {
    axios.get(`${backendUrl}/api/blood/doctor/donor/me`, { headers: { dtoken: dToken } })
      .then(({ data }) => { if (data.success) setDonor(data.donor); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.bloodGroup) return toast.error('Select blood group');
    if (!form.acknowledgementAccepted) return toast.error('Please accept the acknowledgement');
    if (!form.latitude) return toast.error('Location required');
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/blood/doctor/donor/register`,
        { ...form, donorType: 'doctor' },
        { headers: { dtoken: dToken } }
      );
      if (data.success) { setDonor(data.donor); setShowForm(false); toast.success('Registered as blood donor!'); }
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
  };

  const handleToggle = async () => {
    setToggling(true);
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/blood/doctor/donor/toggle-availability`,
        {},
        { headers: { dtoken: dToken } }
      );
      if (data.success) {
        setDonor((d) => ({ ...d, availabilityStatus: data.availabilityStatus }));
        toast.success(data.message);
      }
    } catch { toast.error('Failed to toggle'); }
    finally { setToggling(false); }
  };

  if (loading) return <div className="flex-1 p-6 text-gray-400">Loading...</div>;

  if (!donor && !showForm) {
    return (
      <div className="flex-1 p-6">
        <div className="max-w-lg mx-auto text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-6xl mb-4">🩸</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Register as Blood Donor</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
            As a doctor, your blood donation can save lives. Register to be part of the Medislot donor network.
          </p>
          <button onClick={() => setShowForm(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl">
            Register Now
          </button>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="flex-1 p-6 max-w-lg">
        <h1 className="text-xl font-bold text-gray-800 mb-5">🩸 Donor Registration</h1>
        <form onSubmit={handleRegister} className="space-y-4 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          {[
            { label: 'Full Name *', key: 'fullName', type: 'text' },
            { label: 'Mobile Number *', key: 'mobileNumber', type: 'tel' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
              <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" required />
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group *</label>
            <div className="grid grid-cols-4 gap-2">
              {BLOOD_GROUPS.map((g) => (
                <button key={g} type="button" onClick={() => setForm({ ...form, bloodGroup: g })}
                  className={`py-2 rounded-lg border-2 text-sm font-bold transition-all ${form.bloodGroup === g ? `${BLOOD_GROUP_COLORS[g]} scale-105 shadow` : 'border-gray-200 text-gray-600'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Location *</label>
            <button type="button" onClick={handleGeolocate} disabled={locating}
              className="w-full border-2 border-dashed border-red-300 rounded-lg py-2.5 text-sm text-red-600 hover:bg-red-50 mb-2">
              {locating ? <><Loader2 className="w-4 h-4 animate-spin mr-1 inline" />Detecting...</> : <><MapPin className="w-4 h-4 mr-1 inline" />Detect Location</>}
            </button>
            <input type="text" value={form.locationName} onChange={(e) => setForm({ ...form, locationName: e.target.value })}
              placeholder="Area / locality name" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={form.acknowledgementAccepted} onChange={(e) => setForm({ ...form, acknowledgementAccepted: e.target.checked })} className="mt-0.5 accent-red-600" />
              <span className="text-xs text-gray-700 leading-relaxed">
                I agree to share my phone number and approximate location with users, doctors, and admins when blood is required.
              </span>
            </label>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl text-sm">Cancel</button>
            <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-sm">Register</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 max-w-lg">
      <h1 className="text-xl font-bold text-gray-800 mb-5">My Donor Profile</h1>

      {/* Profile Card */}
      <div className={`rounded-2xl p-5 mb-5 text-white shadow-lg ${donor.availabilityStatus ? 'bg-gradient-to-br from-red-600 to-rose-500' : 'bg-gradient-to-br from-gray-600 to-gray-500'}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold">{donor.fullName}</h2>
            <p className="text-sm opacity-80">{donor.email}</p>
          </div>
          <span className={`text-base font-extrabold px-3 py-1 rounded-full border-2 border-white/50 bg-white/20`}>
            🩸 {donor.bloodGroup}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-white/20 rounded-lg px-3 py-2">
            <p className="opacity-70 text-xs">Mobile</p>
            <p className="font-semibold">{donor.mobileNumber}</p>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-2">
            <p className="opacity-70 text-xs">Location</p>
            <p className="font-semibold truncate">{donor.locationName || '—'}</p>
          </div>
        </div>
      </div>

      {/* Availability Toggle */}
      <div className={`rounded-xl border-2 p-4 mb-5 flex items-center justify-between ${donor.availabilityStatus ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
        <div>
          <p className="font-bold text-gray-800">Availability</p>
          <p className={`text-sm ${donor.availabilityStatus ? 'text-green-600' : 'text-gray-500'}`}>
            {donor.availabilityStatus
              ? <><span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-1.5" />Available to donate</>
              : <><span className="w-2 h-2 rounded-full bg-gray-400 inline-block mr-1.5" />Marked unavailable</>}
          </p>
        </div>
        <button onClick={handleToggle} disabled={toggling}
          className={`relative w-12 h-6 rounded-full transition-colors ${donor.availabilityStatus ? 'bg-green-500' : 'bg-gray-400'} disabled:opacity-60`}>
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${donor.availabilityStatus ? 'left-6' : 'left-0.5'}`} />
        </button>
      </div>
    </div>
  );
}

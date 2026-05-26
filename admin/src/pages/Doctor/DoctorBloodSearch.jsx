import { useContext, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContest';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MapPin, Loader2, CheckCircle2, Search, Droplets } from 'lucide-react';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const RADII = [3, 5, 10, 20, 50];

const BLOOD_GROUP_COLORS = {
  'O+': 'bg-red-50 text-red-700 border-red-300', 'O-': 'bg-red-100 text-red-800 border-red-400',
  'A+': 'bg-blue-50 text-blue-700 border-blue-300', 'A-': 'bg-blue-100 text-blue-800 border-blue-400',
  'B+': 'bg-purple-50 text-purple-700 border-purple-300', 'B-': 'bg-purple-100 text-purple-800 border-purple-400',
  'AB+': 'bg-pink-50 text-pink-700 border-pink-300', 'AB-': 'bg-pink-100 text-pink-800 border-pink-400',
};

export default function DoctorBloodSearch() {
  const { backendUrl, dToken } = useContext(DoctorContext);

  const [form, setForm] = useState({
    bloodGroup: '', radius: 10, includeCompatible: true,
    latitude: '', longitude: '',
  });
  const [results, setResults]   = useState([]);
  const [locating, setLocating] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);

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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!form.bloodGroup) return toast.error('Select required blood group');
    if (!form.latitude)   return toast.error('Location required — click Detect Location');

    setLoading(true);
    setSearched(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/blood/doctor/search/donors`,
        form,
        { headers: { dtoken: dToken } }
      );
      if (data.success) {
        setResults(data.donors);
        if (data.donors.length === 0) toast.info('No available donors found in this radius');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Search Blood Donors</h1>
      <p className="text-gray-500 text-sm mb-6">Doctors must search first. No donors are pre-loaded.</p>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Blood Group */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Required Blood Group *</label>
            <div className="grid grid-cols-4 gap-1.5">
              {BLOOD_GROUPS.map((g) => (
                <button key={g} type="button" onClick={() => setForm({ ...form, bloodGroup: g })}
                  className={`py-2 rounded-lg border-2 text-xs font-bold transition-all ${form.bloodGroup === g ? `${BLOOD_GROUP_COLORS[g]} scale-105 shadow` : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Radius */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Radius</label>
            <div className="flex flex-wrap gap-2">
              {RADII.map((r) => (
                <button key={r} type="button" onClick={() => setForm({ ...form, radius: r })}
                  className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${form.radius === r ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  {r} km
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 mt-3 cursor-pointer">
              <input type="checkbox" checked={form.includeCompatible} onChange={(e) => setForm({ ...form, includeCompatible: e.target.checked })} className="accent-blue-600" />
              <span className="text-sm text-gray-600">Include compatible blood groups</span>
            </label>
          </div>
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Your Location *</label>
          <button type="button" onClick={handleGeolocate} disabled={locating}
            className="border-2 border-dashed border-blue-300 rounded-lg px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 disabled:opacity-60">
            {locating ? <><Loader2 className="w-4 h-4 animate-spin mr-1" />Detecting...</> : form.latitude ? <><CheckCircle2 className="w-4 h-4 mr-1 text-green-600" />Location captured — click to update</> : <><MapPin className="w-4 h-4 mr-1" />Detect My Location</>}
          </button>
        </div>

        <button type="submit" disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold px-8 py-3 rounded-xl text-sm transition-colors">
          <span className="flex items-center gap-2"><Search className="w-4 h-4" />{loading ? 'Searching...' : 'Search Donors'}</span>
        </button>
      </form>

      {/* Results */}
      {searched && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800">{results.length} Donor{results.length !== 1 ? 's' : ''} Found</h2>
            {results.length > 0 && <p className="text-xs text-gray-400">Sorted by distance — nearest first</p>}
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Search className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No available donors found in this area.</p>
              <p className="text-sm text-gray-400 mt-1">Try increasing the radius or including compatible blood groups.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {results.map((donor) => (
                <div key={donor._id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">{donor.fullName}</p>
                      {donor.donorType === 'doctor' && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-medium">Doctor</span>
                      )}
                    </div>
                    <span className={`inline-flex items-center gap-1 text-sm font-extrabold px-2.5 py-1 rounded-full border ${BLOOD_GROUP_COLORS[donor.bloodGroup] || 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                      <Droplets className="w-3.5 h-3.5 shrink-0" /> {donor.bloodGroup}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 shrink-0" />{donor.distanceKm} km away</span>
                    {donor.locationName && <span className="truncate max-w-[120px]">{donor.locationName}</span>}
                    <span className={`font-medium ${donor.availabilityStatus ? 'text-green-600' : 'text-gray-400'}`}>
                      {donor.availabilityStatus ? '● Available' : '● Unavailable'}
                    </span>
                  </div>
                  {donor.lastDonationDate && (
                    <p className="text-xs text-gray-400 mt-1">
                      Last donated: {new Date(donor.lastDonationDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

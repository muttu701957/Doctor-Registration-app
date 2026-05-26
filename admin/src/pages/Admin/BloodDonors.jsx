import { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Droplets } from 'lucide-react';

const BLOOD_GROUPS = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Severity-based urgency color — reused across admin pages
const BLOOD_GROUP_COLORS = {
  'O+': 'bg-red-50 text-red-700 border-red-300',
  'O-': 'bg-red-100 text-red-800 border-red-400',
  'A+': 'bg-blue-50 text-blue-700 border-blue-300',
  'A-': 'bg-blue-100 text-blue-800 border-blue-400',
  'B+': 'bg-purple-50 text-purple-700 border-purple-300',
  'B-': 'bg-purple-100 text-purple-800 border-purple-400',
  'AB+': 'bg-pink-50 text-pink-700 border-pink-300',
  'AB-': 'bg-pink-100 text-pink-800 border-pink-400',
};

export default function BloodDonors() {
  const { backendUrl, aToken } = useContext(AdminContext);

  const [donors, setDonors]   = useState([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(1);
  const [pages, setPages]     = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch]   = useState('');
  const [bgFilter, setBgFilter] = useState('');

  const fetchDonors = async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 20 });
      if (search)   params.append('search', search);
      if (bgFilter) params.append('bloodGroup', bgFilter);

      const { data } = await axios.get(
        `${backendUrl}/api/blood/admin/donors?${params}`,
        { headers: { atoken: aToken } }
      );
      if (data.success) {
        setDonors(data.donors);
        setTotal(data.total);
        setPages(data.pages);
        setPage(p);
      }
    } catch {
      toast.error('Failed to fetch donors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDonors(1); }, [bgFilter]);

  const handleBlockUnblock = async (donorId, action) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/blood/admin/donors/block-unblock`,
        { donorId, action },
        { headers: { atoken: aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        setDonors((prev) => prev.map((d) => d._id === donorId ? { ...d, isBlocked: action === 'block' } : d));
      }
    } catch {
      toast.error('Action failed');
    }
  };

  const handleToggleAvailability = async (donorId) => {
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/blood/admin/donors/toggle-availability`,
        { donorId },
        { headers: { atoken: aToken } }
      );
      if (data.success) {
        setDonors((prev) => prev.map((d) => d._id === donorId ? { ...d, availabilityStatus: data.availabilityStatus } : d));
      }
    } catch {
      toast.error('Action failed');
    }
  };

  const handleDelete = async (donorId) => {
    if (!window.confirm('Remove this donor permanently?')) return;
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/blood/admin/donors`,
        { headers: { atoken: aToken }, data: { donorId } }
      );
      if (data.success) {
        toast.success('Donor removed');
        setDonors((prev) => prev.filter((d) => d._id !== donorId));
      }
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blood Donors</h1>
          <p className="text-gray-500 text-sm mt-0.5">{total} registered donors</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchDonors(1)}
          placeholder="Search by name..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 w-52"
        />
        <select
          value={bgFilter}
          onChange={(e) => setBgFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          {BLOOD_GROUPS.map((g) => (
            <option key={g} value={g}>{g || 'All Blood Groups'}</option>
          ))}
        </select>
        <button
          onClick={() => fetchDonors(1)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase tracking-wide">
                <th className="px-4 py-3 text-left">Donor</th>
                <th className="px-4 py-3 text-left">Blood Group</th>
                <th className="px-4 py-3 text-left">Contact</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Available</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : donors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">No donors found</td>
                </tr>
              ) : (
                donors.map((donor) => (
                  <tr key={donor._id} className={`hover:bg-gray-50 transition-colors ${donor.isBlocked ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{donor.fullName}</p>
                      <p className="text-xs text-gray-400">{donor.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${BLOOD_GROUP_COLORS[donor.bloodGroup] || 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                        <Droplets className="w-3 h-3 shrink-0" /> {donor.bloodGroup}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{donor.mobileNumber}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-[140px] truncate">{donor.locationName || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${donor.donorType === 'doctor' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {donor.donorType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleAvailability(donor._id)}
                        className={`w-10 h-5 rounded-full transition-colors ${donor.availabilityStatus ? 'bg-green-500' : 'bg-gray-300'} relative`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${donor.availabilityStatus ? 'left-5' : 'left-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${donor.isBlocked ? 'bg-red-100 text-red-700 border-red-300' : 'bg-green-100 text-green-700 border-green-300'}`}>
                        {donor.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBlockUnblock(donor._id, donor.isBlocked ? 'unblock' : 'block')}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${donor.isBlocked ? 'bg-green-100 hover:bg-green-200 text-green-700' : 'bg-orange-100 hover:bg-orange-200 text-orange-700'}`}
                        >
                          {donor.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                        <button
                          onClick={() => handleDelete(donor._id)}
                          className="text-xs px-2.5 py-1 rounded-lg font-medium bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => fetchDonors(page - 1)} className="px-3 py-1 text-xs border rounded-lg disabled:opacity-40 hover:bg-gray-50">← Prev</button>
              <button disabled={page === pages} onClick={() => fetchDonors(page + 1)} className="px-3 py-1 text-xs border rounded-lg disabled:opacity-40 hover:bg-gray-50">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

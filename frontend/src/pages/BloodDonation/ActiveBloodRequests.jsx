import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBloodStore } from '../../store/bloodStore';
import { useAuthStore } from '../../store/authStore';
import BloodGroupBadge from '../../components/blood/BloodGroupBadge';
import {
  Droplets, AlertCircle, AlertTriangle, MapPin, Clock,
  ChevronLeft, ChevronRight, Filter, RefreshCw, Heart,
} from 'lucide-react';
import toast from 'react-hot-toast';

const URGENCY_CONFIG = {
  emergency: { label: 'Emergency', cls: 'bg-red-100 text-red-700 border border-red-300',    Icon: AlertCircle,   dot: 'bg-red-500' },
  urgent:    { label: 'Urgent',    cls: 'bg-orange-100 text-orange-700 border border-orange-300', Icon: AlertTriangle, dot: 'bg-orange-500' },
  normal:    { label: 'Normal',    cls: 'bg-green-100 text-green-700 border border-green-300',    Icon: Droplets,      dot: 'bg-green-500' },
};

const ALL_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ActiveBloodRequests() {
  const navigate  = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { getActiveBloodRequests, respondToRequest, donorProfile, getMyDonorProfile } = useBloodStore();

  useEffect(() => {
    if (isAuthenticated) getMyDonorProfile().catch(() => {});
  }, [isAuthenticated]);

  const [requests,     setRequests]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [page,         setPage]         = useState(1);
  const [totalPages,   setTotalPages]   = useState(1);
  const [total,        setTotal]        = useState(0);
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const [groupFilter,   setGroupFilter]   = useState('');
  const [responding,   setResponding]   = useState(null);

  const fetchRequests = async (p = page) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 9 };
      if (urgencyFilter) params.urgencyType = urgencyFilter;
      if (groupFilter)   params.bloodGroup  = groupFilter;
      const data = await getActiveBloodRequests(params);
      if (data.success) {
        setRequests(data.requests);
        setTotalPages(data.pages);
        setTotal(data.total);
      }
    } catch {
      toast.error('Failed to load blood requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(1); setPage(1); }, [urgencyFilter, groupFilter]);
  useEffect(() => { fetchRequests(page); }, [page]);

  const handleRespond = async (requestId) => {
    if (!isAuthenticated) { toast.error('Please login to respond'); navigate('/login'); return; }
    if (!donorProfile) {
      toast('Register as a donor first to respond to requests', { icon: null });
      navigate('/blood-donation/register');
      return;
    }
    setResponding(requestId);
    try {
      const res = await respondToRequest(requestId, 'accepted');
      if (res.success) toast.success('Response sent! The requester will be notified.');
      else toast.error(res.message || 'Could not respond');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to respond');
    } finally {
      setResponding(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/blood-donation')} className="text-gray-400 hover:text-gray-600">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Active Blood Requests</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} request{total !== 1 ? 's' : ''} need help</p>
        </div>
        <button
          onClick={() => fetchRequests(page)}
          className="ml-auto text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500 font-medium">Urgency:</span>
        </div>
        {['', 'emergency', 'urgent', 'normal'].map((u) => (
          <button
            key={u}
            onClick={() => setUrgencyFilter(u)}
            className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-all ${
              urgencyFilter === u
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:bg-red-50'
            }`}
          >
            {u ? u.charAt(0).toUpperCase() + u.slice(1) : 'All'}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500 font-medium">Blood Group:</span>
        </div>
        <button
          onClick={() => setGroupFilter('')}
          className={`text-sm px-3 py-1 rounded-full border font-medium transition-all ${
            !groupFilter ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
          }`}
        >
          All
        </button>
        {ALL_GROUPS.map((g) => (
          <button
            key={g}
            onClick={() => setGroupFilter(g === groupFilter ? '' : g)}
            className={`text-sm px-3 py-1 rounded-full border font-medium transition-all ${
              groupFilter === g ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Requests Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-200">
          <Droplets className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No active blood requests</p>
          <p className="text-gray-400 text-sm mt-1">Check back later or clear filters</p>
          {(urgencyFilter || groupFilter) && (
            <button
              onClick={() => { setUrgencyFilter(''); setGroupFilter(''); }}
              className="mt-3 text-sm text-red-600 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {requests.map((req) => {
            const urgency = URGENCY_CONFIG[req.urgencyType] || URGENCY_CONFIG.normal;
            const UIcon   = urgency.Icon;
            return (
              <div
                key={req._id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <BloodGroupBadge group={req.requiredBloodGroup} size="md" />
                  <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${urgency.cls}`}>
                    <UIcon className="w-3 h-3" />
                    {urgency.label}
                  </span>
                </div>

                {/* Patient name */}
                {req.patientName && (
                  <p className="font-semibold text-gray-800 text-sm mb-1">For: {req.patientName}</p>
                )}

                {/* Location */}
                {req.locationName && (
                  <p className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                    {req.locationName}
                  </p>
                )}

                {/* Notes */}
                {req.additionalNotes && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{req.additionalNotes}</p>
                )}

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <p className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {timeAgo(req.createdAt)}
                  </p>
                  <button
                    onClick={() => handleRespond(req._id)}
                    disabled={responding === req._id}
                    className={`flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-1.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                      !isAuthenticated || !donorProfile
                        ? 'bg-gray-400 hover:bg-gray-500'
                        : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {responding === req._id ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Heart className="w-3.5 h-3.5" />
                    )}
                    {!isAuthenticated ? 'Login to Help' : !donorProfile ? 'Register to Help' : 'I Can Help'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* CTA for non-donors */}
      {isAuthenticated && (
        <div className="mt-10 bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="font-semibold text-gray-800 mb-1">Want to receive alerts for these requests?</p>
          <p className="text-sm text-gray-500 mb-4">Register as a donor and get notified when someone needs your blood type.</p>
          <button
            onClick={() => navigate('/blood-donation/register')}
            className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2.5 rounded-full transition-colors text-sm"
          >
            Register as Donor
          </button>
        </div>
      )}
    </div>
  );
}

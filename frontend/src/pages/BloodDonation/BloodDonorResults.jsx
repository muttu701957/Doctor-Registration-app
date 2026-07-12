import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Phone, MapPin, CheckCircle2, Clock, XCircle,
  AlertCircle, AlertTriangle, Droplets, ArrowLeft,
  Users, UserCheck, Navigation, RefreshCw,
} from 'lucide-react';
import { useBloodStore } from '../../store/bloodStore';

const URGENCY_STYLE = {
  emergency: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-400', label: 'EMERGENCY', Icon: AlertCircle },
  urgent:    { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-400', label: 'Urgent', Icon: AlertTriangle },
  normal:    { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300', label: 'Normal', Icon: Droplets },
};

const RESPONSE_BADGE = {
  accepted:  { label: 'Agreed to Donate', bg: 'bg-green-100', text: 'text-green-700', Icon: CheckCircle2 },
  declined:  { label: 'Declined',         bg: 'bg-gray-100',  text: 'text-gray-500',  Icon: XCircle },
  notified:  { label: 'Notified',         bg: 'bg-blue-50',   text: 'text-blue-600',  Icon: Clock },
  no_response: { label: 'No Response',    bg: 'bg-gray-100',  text: 'text-gray-400',  Icon: Clock },
};

const RADIUS_OPTIONS = [
  { label: 'All',   value: 9999 },
  { label: '3km',   value: 3 },
  { label: '5km',   value: 5 },
  { label: '10km',  value: 10 },
  { label: '20km',  value: 20 },
];

export default function BloodDonorResults() {
  const { requestId } = useParams();
  const navigate      = useNavigate();
  const { getRequestDonors } = useBloodStore();

  const [request,  setRequest]  = useState(null);
  const [donors,   setDonors]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [radiusKm, setRadiusKm] = useState(9999);
  const [availOnly, setAvailOnly] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getRequestDonors(requestId);
      setDonors(data.donors || []);
      setRequest(data.request);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load donors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [requestId]);

  const filtered = useMemo(() => {
    return donors.filter((d) => {
      if (availOnly && !d.availabilityStatus) return false;
      if (radiusKm < 9999 && (d.distanceKm ?? 999) > radiusKm) return false;
      return true;
    });
  }, [donors, radiusKm, availOnly]);

  const stats = useMemo(() => ({
    total:     donors.length,
    available: donors.filter((d) => d.availabilityStatus).length,
    accepted:  donors.filter((d) => d.responseStatus === 'accepted').length,
    nearest:   donors.filter((d) => (d.distanceKm ?? 999) <= 3).length,
  }), [donors]);

  const urgStyle = request ? (URGENCY_STYLE[request.urgencyType] || URGENCY_STYLE.normal) : URGENCY_STYLE.normal;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Back button */}
      <button
        onClick={() => navigate('/blood-donation/my-requests')}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-5 font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> My Requests
      </button>

      {/* Request summary header */}
      {request && (
        <div className={`rounded-2xl border-2 ${urgStyle.border} ${urgStyle.bg} px-5 py-4 mb-6`}>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${urgStyle.bg} ${urgStyle.text} ${urgStyle.border}`}>
              <urgStyle.Icon className="w-3.5 h-3.5" /> {urgStyle.label}
            </span>
            <span className={`text-sm font-extrabold ${urgStyle.text}`}>{request.requiredBloodGroup} Blood Needed</span>
          </div>
          <p className="text-sm text-gray-700 font-semibold">{request.patientName}</p>
          {request.locationName && (
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 shrink-0" /> {request.locationName}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">{request.contactNumber} &middot; Created {new Date(request.createdAt).toLocaleDateString('en-IN')}</p>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Matched',   value: stats.total,     icon: Users,      color: 'text-blue-600',  bg: 'bg-blue-50' },
          { label: 'Available', value: stats.available, icon: UserCheck,  color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Accepted',  value: stats.accepted,  icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Within 3km', value: stats.nearest,  icon: Navigation, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`${bg} rounded-xl p-3 text-center border border-white shadow-sm`}>
            <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
            <p className={`text-xl font-extrabold ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap mb-5">
        <span className="text-xs text-gray-500 font-medium shrink-0">Radius:</span>
        {RADIUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setRadiusKm(opt.value)}
            className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${
              radiusKm === opt.value
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
        <button
          onClick={() => setAvailOnly((p) => !p)}
          className={`ml-auto text-xs px-3 py-1.5 rounded-full border font-semibold transition-all ${
            availOnly ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          }`}
        >
          Available only
        </button>
        <button
          onClick={load}
          className="text-xs p-1.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
          title="Refresh"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Donor list */}
      {filtered.length === 0 ? (
        <div className="text-center py-14 bg-gray-50 rounded-2xl">
          <Droplets className="w-12 h-12 text-red-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No donors match your filter</p>
          <button
            onClick={() => { setRadiusKm(9999); setAvailOnly(false); }}
            className="mt-3 text-xs text-red-600 underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((donor, idx) => {
            const responseBadge = RESPONSE_BADGE[donor.responseStatus] || RESPONSE_BADGE.notified;
            const [lng, lat] = donor.coordinates?.length === 2 ? donor.coordinates : [null, null];

            return (
              <div
                key={`${donor.donorId}-${idx}`}
                className={`bg-white rounded-xl border shadow-sm p-4 ${
                  donor.availabilityStatus ? 'border-green-200' : 'border-gray-200'
                }`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-2 flex-wrap mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Blood group */}
                    <span className="inline-flex items-center gap-1 text-sm font-extrabold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                      <Droplets className="w-3.5 h-3.5 shrink-0" /> {donor.donorBloodGroup}
                    </span>
                    {/* Availability dot */}
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-full ${
                      donor.availabilityStatus ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${donor.availabilityStatus ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                      {donor.availabilityStatus ? 'Available' : 'Unavailable'}
                    </span>
                    {/* Distance badge */}
                    {donor.distanceKm != null && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full">
                        <Navigation className="w-3 h-3 shrink-0" /> {donor.distanceKm} km away
                      </span>
                    )}
                  </div>
                  {/* Response status */}
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${responseBadge.bg} ${responseBadge.text}`}>
                    <responseBadge.Icon className="w-3 h-3 shrink-0" /> {responseBadge.label}
                  </span>
                </div>

                {/* Donor name */}
                <p className="font-bold text-gray-800 text-sm mb-1">{donor.donorName}</p>

                {/* Location + Maps */}
                {(donor.locationName || (lat && lng)) && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-2 flex-wrap">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {donor.locationName && <span>{donor.locationName}</span>}
                    {lat && lng && (
                      <a
                        href={`https://www.google.com/maps?q=${lat},${lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium ml-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View on Maps
                      </a>
                    )}
                  </p>
                )}

                {/* Last donation */}
                {donor.lastDonationDate && (
                  <p className="text-xs text-gray-400 mb-3">
                    Last donated: {new Date(donor.lastDonationDate).toLocaleDateString('en-IN')}
                  </p>
                )}

                {/* Call button */}
                {donor.mobileNumber ? (
                  <a
                    href={`tel:${donor.mobileNumber}`}
                    className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
                  >
                    <Phone className="w-4 h-4 shrink-0" /> Call {donor.mobileNumber}
                  </a>
                ) : (
                  <div className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-400 font-medium py-2.5 rounded-xl text-sm">
                    <Phone className="w-4 h-4 shrink-0" /> Phone not available
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-center text-xs text-gray-400 mt-5">
          Showing {filtered.length} of {donors.length} donors · Sorted by availability then distance
        </p>
      )}
    </div>
  );
}

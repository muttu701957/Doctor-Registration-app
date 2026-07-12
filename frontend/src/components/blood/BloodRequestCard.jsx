import { MapPin, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UrgencyBadge, { getUrgencyConfig } from './UrgencyBadge';
import BloodGroupBadge from './BloodGroupBadge';

const STATUS_CONFIG = {
  active:    { label: 'Active',    bg: 'bg-blue-100',  text: 'text-blue-800',  border: 'border-blue-300' },
  fulfilled: { label: 'Fulfilled', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  cancelled: { label: 'Cancelled', bg: 'bg-gray-100',  text: 'text-gray-600',  border: 'border-gray-300' },
  closed:    { label: 'Closed',    bg: 'bg-gray-100',  text: 'text-gray-600',  border: 'border-gray-300' },
};

export default function BloodRequestCard({ request, onCancel, onClose, showActions = true }) {
  const navigate    = useNavigate();
  const urgencyCfg  = getUrgencyConfig(request.urgencyType);
  const statusCfg   = STATUS_CONFIG[request.status] || STATUS_CONFIG.active;

  const createdDate = new Date(request.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const borderColor = {
    emergency: 'border-l-red-500',
    urgent:    'border-l-orange-500',
    normal:    'border-l-green-500',
  }[request.urgencyType] || 'border-l-gray-300';

  return (
    <div className={`bg-white border border-gray-200 border-l-4 ${borderColor} rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 flex-wrap mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <BloodGroupBadge group={request.requiredBloodGroup} size="sm" />
          <UrgencyBadge urgency={request.urgencyType} size="sm" />
        </div>
        <span
          className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
        >
          {statusCfg.label}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-sm text-gray-700">
        <p>
          <span className="text-gray-400 font-medium mr-2">Patient:</span>
          <span className="font-semibold">{request.patientName}</span>
        </p>
        <p>
          <span className="text-gray-400 font-medium mr-2">Contact:</span>
          <span>{request.contactNumber}</span>
        </p>
        {request.locationName && (
          <p className="flex items-start gap-1 flex-wrap">
            <span className="inline-flex items-center gap-1 text-gray-400 font-medium mr-1 shrink-0"><MapPin className="w-3.5 h-3.5 shrink-0" /> Location:</span>
            <span>{request.locationName}</span>
            {request.location?.coordinates?.length === 2 && (
              <a
                href={`https://www.google.com/maps?q=${request.location.coordinates[1]},${request.location.coordinates[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-blue-600 hover:text-blue-800 hover:underline text-xs font-medium ml-1"
              >
                <MapPin className="w-3 h-3 shrink-0" />View on Maps
              </a>
            )}
          </p>
        )}
        {request.requiredDate && (
          <p>
            <span className="inline-flex items-center gap-1 text-gray-400 font-medium mr-2"><Calendar className="w-3.5 h-3.5 shrink-0" /> Needed by:</span>
            <span>{new Date(request.requiredDate).toLocaleDateString('en-IN')}</span>
          </p>
        )}
        {request.additionalNotes && (
          <p className="text-gray-500 text-xs italic mt-1">"{request.additionalNotes}"</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">Created {createdDate}</span>
        {request.notifiedCount > 0 && (
          <button
            onClick={() => navigate(`/blood-donation/requests/${request._id}/donors`)}
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold hover:underline"
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            {request.notifiedCount} donor{request.notifiedCount !== 1 ? 's' : ''} — View
          </button>
        )}
      </div>

      {/* Actions */}
      {showActions && request.status === 'active' && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => navigate(`/blood-donation/requests/${request._id}/donors`)}
            className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
          >
            <Users className="w-3.5 h-3.5" /> View Donors
          </button>
          {onClose && (
            <button
              onClick={() => onClose(request._id)}
              className="flex-1 text-xs bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Mark Fulfilled
            </button>
          )}
          {onCancel && (
            <button
              onClick={() => onCancel(request._id)}
              className="flex-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
}

import { MapPin, Calendar } from 'lucide-react';
import BloodGroupBadge from './BloodGroupBadge';

export default function DonorCard({ donor, showDistance = true, onContact }) {
  const lastDonation = donor.lastDonationDate
    ? new Date(donor.lastDonationDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : 'No record';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-gray-800 text-sm truncate">{donor.fullName}</h3>
            <span
              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                donor.availabilityStatus
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-100 text-gray-500 border border-gray-300'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${donor.availabilityStatus ? 'bg-green-500' : 'bg-gray-400'}`}
              />
              {donor.availabilityStatus ? 'Available' : 'Unavailable'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
            {showDistance && donor.distanceKm !== undefined && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" /> {donor.distanceKm} km away
              </span>
            )}
            {donor.locationName && (
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 shrink-0" /> {donor.locationName}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 shrink-0" /> Last donated: {lastDonation}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <BloodGroupBadge group={donor.bloodGroup} size="sm" />
          {donor.donorType === 'doctor' && (
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
              Doctor
            </span>
          )}
        </div>
      </div>

      {onContact && (
        <button
          onClick={() => onContact(donor)}
          className="mt-3 w-full text-xs bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition-colors"
        >
          Contact Donor
        </button>
      )}
    </div>
  );
}

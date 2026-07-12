import { Droplets, Check, AlertTriangle } from 'lucide-react';

export default function AcknowledgementModal({ onAccept, onDecline }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-5 text-center">
          <Droplets className="w-12 h-12 text-white mx-auto mb-2" />
          <h2 className="text-white text-xl font-bold">Donor Acknowledgement</h2>
          <p className="text-red-100 text-sm mt-1">Please read carefully before proceeding</p>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p className="text-gray-800 text-sm leading-relaxed font-medium text-center">
              "I agree to share my phone number and approximate location with users, doctors, and admins
              when blood is required. I understand this information will only be used for blood donation purposes."
            </p>
          </div>

          <ul className="space-y-2 text-sm text-gray-600 mb-5">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              Your phone number will be visible to blood requestors
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              Your approximate location (not exact GPS) is shared
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
              You can withdraw availability at any time from your profile
            </li>
            <li className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              You may receive email and dashboard alerts for blood requests
            </li>
          </ul>

          <div className="flex gap-3">
            <button
              onClick={onDecline}
              className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors shadow-md"
            >
              I Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

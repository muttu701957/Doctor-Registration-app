import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AlertCircle, ClipboardList, Bell } from 'lucide-react';
import { useBloodStore } from '../../store/bloodStore';
import BloodGroupBadge from '../../components/blood/BloodGroupBadge';

export default function DonorProfile() {
  const navigate = useNavigate();
  const { donorProfile, getMyDonorProfile, toggleAvailability, getDonorHistory, isLoading } = useBloodStore();
  const [history, setHistory] = useState([]);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    getMyDonorProfile().then((res) => {
      if (res?.success === false) navigate('/blood-donation/register', { replace: true });
    });
    getDonorHistory().then((res) => {
      if (res?.history) setHistory(res.history);
    }).catch(() => {});
  }, []);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const res = await toggleAvailability();
      toast.success(res.message);
    } catch {
      toast.error('Could not update availability');
    } finally {
      setToggling(false);
    }
  };

  if (!donorProfile && !isLoading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">You are not registered as a donor yet.</p>
        <button onClick={() => navigate('/blood-donation/register')} className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold">
          Register Now
        </button>
      </div>
    );
  }

  if (!donorProfile) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  const joinedDate = new Date(donorProfile.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const lastDonation = donorProfile.lastDonationDate
    ? new Date(donorProfile.lastDonationDate).toLocaleDateString('en-IN')
    : 'Not recorded';

  const acceptedCount = history.filter((h) => h.responseStatus === 'accepted').length;

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      {/* Profile Card */}
      <div className={`rounded-2xl p-6 mb-6 shadow-lg text-white ${donorProfile.availabilityStatus ? 'bg-gradient-to-br from-red-600 to-rose-500' : 'bg-gradient-to-br from-gray-600 to-gray-500'}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-extrabold">{donorProfile.fullName}</h1>
            <p className="text-sm opacity-80 mt-0.5">{donorProfile.email}</p>
          </div>
          <BloodGroupBadge group={donorProfile.bloodGroup} size="lg" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mb-5">
          <div className="bg-white/20 rounded-xl px-3 py-2.5">
            <p className="opacity-70 text-xs mb-0.5">Mobile</p>
            <p className="font-semibold">{donorProfile.mobileNumber}</p>
          </div>
          <div className="bg-white/20 rounded-xl px-3 py-2.5">
            <p className="opacity-70 text-xs mb-0.5">Location</p>
            <p className="font-semibold truncate">{donorProfile.locationName || 'Not set'}</p>
          </div>
          <div className="bg-white/20 rounded-xl px-3 py-2.5">
            <p className="opacity-70 text-xs mb-0.5">Last Donation</p>
            <p className="font-semibold">{lastDonation}</p>
          </div>
          <div className="bg-white/20 rounded-xl px-3 py-2.5">
            <p className="opacity-70 text-xs mb-0.5">Donations Accepted</p>
            <p className="font-bold text-lg">{acceptedCount}</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-2 text-xs opacity-70 text-center">
          Donor since {joinedDate}
        </div>
      </div>

      {/* Availability Toggle */}
      <div className={`rounded-2xl border-2 p-5 mb-6 ${donorProfile.availabilityStatus ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-800 text-base">Availability Status</p>
            <p className={`text-sm font-medium ${donorProfile.availabilityStatus ? 'text-green-600' : 'text-gray-500'}`}>
              {donorProfile.availabilityStatus ? (
                <><span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-1.5" />You are available to donate</>
              ) : (
                <><span className="w-2 h-2 rounded-full bg-gray-400 inline-block mr-1.5" />You are marked unavailable</>
              )}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {donorProfile.availabilityStatus
                ? 'Nearby blood requestors can see you and you will receive alerts'
                : 'You will not receive blood request notifications until re-enabled'}
            </p>
          </div>
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none ${donorProfile.availabilityStatus ? 'bg-green-500' : 'bg-gray-400'} disabled:opacity-60`}
          >
            <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${donorProfile.availabilityStatus ? 'translate-x-7' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button
          onClick={() => navigate('/blood-donation/request')}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          <AlertCircle className="w-4 h-4" /> Request Blood
        </button>
        <button
          onClick={() => navigate('/blood-donation/my-requests')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          <ClipboardList className="w-4 h-4" /> My Requests
        </button>
        <button
          onClick={() => navigate('/blood-donation/notifications')}
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          <Bell className="w-4 h-4" /> Notifications
        </button>
        <button
          onClick={() => navigate('/blood-donation')}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors"
        >
          ← Back to Home
        </button>
      </div>

      {/* Donation History */}
      <div>
        <h2 className="font-bold text-gray-800 text-lg mb-3">Donation Response History</h2>
        {history.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6 bg-gray-50 rounded-xl">
            No donation history yet. Accept a blood request to get started!
          </p>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 10).map((item) => (
              <div key={item._id} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700">{item.donorBloodGroup} blood donation</p>
                  <p className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  item.responseStatus === 'accepted' ? 'bg-green-100 text-green-700 border-green-300'
                  : item.responseStatus === 'declined' ? 'bg-red-100 text-red-600 border-red-300'
                  : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                }`}>
                  {item.responseStatus}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

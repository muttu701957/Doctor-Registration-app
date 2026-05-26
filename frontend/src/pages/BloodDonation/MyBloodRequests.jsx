import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Droplets, ChevronLeft, Plus, Activity, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useBloodStore } from '../../store/bloodStore';
import BloodRequestCard from '../../components/blood/BloodRequestCard';

const FILTERS = ['all', 'active', 'fulfilled', 'cancelled'];

const filterBadge = {
  all:       'bg-gray-100 text-gray-700 border-gray-300',
  active:    'bg-blue-100 text-blue-700 border-blue-300',
  fulfilled: 'bg-green-100 text-green-700 border-green-300',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-300',
};

export default function MyBloodRequests() {
  const navigate = useNavigate();
  const { myRequests, getMyBloodRequests, cancelBloodRequest, closeBloodRequest, isLoading } = useBloodStore();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getMyBloodRequests().catch(() => toast.error('Could not load requests'));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this blood request?')) return;
    try {
      await cancelBloodRequest(id);
      toast.success('Request cancelled');
    } catch {
      toast.error('Could not cancel request');
    }
  };

  const handleClose = async (id) => {
    if (!confirm('Mark this request as fulfilled?')) return;
    try {
      await closeBloodRequest(id);
      toast.success('Marked as fulfilled!');
    } catch {
      toast.error('Could not update request');
    }
  };

  const filtered = filter === 'all' ? myRequests : myRequests.filter((r) => r.status === filter);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === 'all' ? myRequests.length : myRequests.filter((r) => r.status === f).length;
    return acc;
  }, {});

  const totalNotified = myRequests.reduce((sum, r) => sum + (r.notifiedCount || 0), 0);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/blood-donation')} className="text-gray-400 hover:text-gray-600">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-gray-800">My Blood Requests</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track and manage all your blood requests</p>
        </div>
        <button
          onClick={() => navigate('/blood-donation/request')}
          className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      {/* Stats row */}
      {myRequests.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total',     value: counts.all,       Icon: Activity,      cls: 'text-gray-700 bg-gray-50   border-gray-200'  },
            { label: 'Active',    value: counts.active,    Icon: Clock,         cls: 'text-blue-700  bg-blue-50   border-blue-200'  },
            { label: 'Fulfilled', value: counts.fulfilled, Icon: CheckCircle2,  cls: 'text-green-700 bg-green-50  border-green-200' },
            { label: 'Donors Notified', value: totalNotified, Icon: Droplets,   cls: 'text-red-700   bg-red-50    border-red-200'   },
          ].map(({ label, value, Icon, cls }) => (
            <div key={label} className={`border rounded-xl p-3 text-center ${cls}`}>
              <Icon className="w-4 h-4 mx-auto mb-1 opacity-70" />
              <p className="text-xl font-extrabold">{value}</p>
              <p className="text-xs mt-0.5 leading-tight opacity-70">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold capitalize transition-all ${
              filter === f
                ? filterBadge[f] + ' shadow-sm scale-105'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
          <Droplets className="w-10 h-10 text-red-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium mb-1">
            No {filter !== 'all' ? filter : ''} requests found
          </p>
          {filter !== 'all' ? (
            <button onClick={() => setFilter('all')} className="text-sm text-red-600 underline mt-1">
              Show all
            </button>
          ) : (
            <button
              onClick={() => navigate('/blood-donation/request')}
              className="mt-4 bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors"
            >
              Create Your First Request
            </button>
          )}
        </div>
      )}

      {/* Request cards */}
      <div className="space-y-4">
        {filtered.map((request) => (
          <BloodRequestCard
            key={request._id}
            request={request}
            onCancel={handleCancel}
            onClose={handleClose}
            showActions
          />
        ))}
      </div>

    </div>
  );
}

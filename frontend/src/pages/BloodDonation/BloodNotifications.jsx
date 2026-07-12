import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { AlertCircle, AlertTriangle, Droplets, Bell } from 'lucide-react';
import { useBloodStore } from '../../store/bloodStore';
import NotificationItem from '../../components/blood/NotificationItem';

export default function BloodNotifications() {
  const {
    notifications, unreadCount,
    getMyNotifications, markNotificationsRead,
    markAllNotificationsRead, respondToRequest,
    isLoading,
  } = useBloodStore();

  useEffect(() => {
    getMyNotifications()
      .then(() => markAllNotificationsRead())
      .catch(() => {});
  }, []);

  const handleRead = (ids) => markNotificationsRead(ids);

  const handleAccept = async (requestId, notificationId) => {
    try {
      await respondToRequest(requestId, 'accepted');
      await markNotificationsRead([notificationId]);
      toast.success('Donation request accepted! The requestor has been notified.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not respond');
    }
  };

  const handleDecline = async (requestId, notificationId) => {
    try {
      await respondToRequest(requestId, 'declined');
      await markNotificationsRead([notificationId]);
      toast('Declined.');
    } catch {
      toast.error('Could not respond');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">Blood Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-red-600 font-medium mt-0.5">
              {unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllNotificationsRead()}
            className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Urgency Legend */}
      <div className="flex gap-3 flex-wrap mb-6 p-3 bg-gray-50 rounded-xl">
        <span className="text-xs text-gray-500 font-medium self-center">Severity:</span>
        <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 border border-red-300 px-2 py-1 rounded-full font-semibold"><AlertCircle className="w-3.5 h-3.5 shrink-0" /> Emergency = Red</span>
        <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-700 border border-orange-300 px-2 py-1 rounded-full font-semibold"><AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Urgent = Orange</span>
        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 border border-green-300 px-2 py-1 rounded-full font-semibold"><Droplets className="w-3.5 h-3.5 shrink-0" /> Normal = Green</span>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && notifications.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No blood notifications yet</p>
          <p className="text-sm text-gray-400 mt-1">You'll receive alerts here when blood is needed nearby</p>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((notif) => (
          <NotificationItem
            key={notif._id}
            notification={notif}
            onRead={handleRead}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ))}
      </div>
    </div>
  );
}

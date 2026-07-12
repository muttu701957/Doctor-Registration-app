import { MapPin } from 'lucide-react';
import { getUrgencyConfig } from './UrgencyBadge';

export default function NotificationItem({ notification, onRead, onAccept, onDecline }) {
  const cfg = getUrgencyConfig(notification.urgencyType || 'normal');
  const timeAgo = formatTimeAgo(new Date(notification.createdAt));

  const borderColor = {
    emergency: 'border-l-red-500',
    urgent:    'border-l-orange-500',
    normal:    'border-l-green-500',
  }[notification.urgencyType] || 'border-l-gray-300';

  const bgColor = notification.isRead ? 'bg-white' : {
    emergency: 'bg-red-50',
    urgent:    'bg-orange-50',
    normal:    'bg-green-50',
  }[notification.urgencyType] || 'bg-gray-50';

  return (
    <div
      className={`${bgColor} border border-gray-200 border-l-4 ${borderColor} rounded-xl p-4 transition-all`}
      onClick={() => !notification.isRead && onRead && onRead([notification._id])}
    >
      <div className="flex items-start gap-3">
        <cfg.icon className="w-5 h-5 shrink-0 mt-0.5" />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`font-semibold text-sm ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
              {notification.title}
            </p>
            {!notification.isRead && (
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${cfg.dot}`} />
            )}
          </div>

          <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{notification.message}</p>

          {notification.latitude && notification.longitude && (
            <a
              href={`https://www.google.com/maps?q=${notification.latitude},${notification.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 mt-1.5 text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              <MapPin className="w-3 h-3 shrink-0" />
              View on Google Maps
            </a>
          )}

          <p className="text-xs text-gray-400 mt-1">{timeAgo}</p>

          {/* Accept / Decline for new blood requests */}
          {!notification.isRead &&
            ['new_request', 'urgent_request', 'emergency_broadcast'].includes(notification.type) &&
            onAccept && onDecline && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={(e) => { e.stopPropagation(); onAccept(notification.requestId, notification._id); }}
                  className={`flex-1 text-xs text-white py-2 rounded-lg font-semibold transition-colors ${cfg.solidBg} hover:opacity-90`}
                >
                  I Can Donate
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDecline(notification.requestId, notification._id); }}
                  className="flex-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition-colors"
                >
                  Can't Help Now
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

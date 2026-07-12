import mongoose from 'mongoose';

const bloodNotificationSchema = new mongoose.Schema(
  {
    recipientType: { type: String, enum: ['user', 'doctor', 'admin'], required: true },
    recipientId:   { type: String, required: true },

    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'bloodRequest', default: null },

    type: {
      type: String,
      enum: [
        'new_request',
        'urgent_request',
        'emergency_broadcast',
        'donor_accepted',
        'request_fulfilled',
        'request_cancelled',
        'donor_registered',
      ],
      required: true,
    },

    title:   { type: String, required: true },
    message: { type: String, required: true },

    // Severity drives UI color
    urgencyType: {
      type: String,
      enum: ['normal', 'urgent', 'emergency'],
      default: 'normal',
    },

    // Request location — used to render a Google Maps link in the UI
    latitude:  { type: Number, default: null },
    longitude: { type: Number, default: null },

    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Fast unread count + list queries
bloodNotificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

const bloodNotificationModel =
  mongoose.models.bloodNotification ||
  mongoose.model('bloodNotification', bloodNotificationSchema);

export default bloodNotificationModel;

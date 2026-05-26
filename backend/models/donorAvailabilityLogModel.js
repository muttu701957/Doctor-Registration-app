import mongoose from 'mongoose';

const donorAvailabilityLogSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'bloodDonor',
      required: true,
    },
    previousStatus: { type: Boolean, required: true },
    newStatus:      { type: Boolean, required: true },
    changedBy:      { type: String, default: 'self' }, // 'self' | 'admin'
    changedAt:      { type: Date, default: Date.now },
  },
  { timestamps: false }
);

donorAvailabilityLogSchema.index({ donorId: 1, changedAt: -1 });

const donorAvailabilityLogModel =
  mongoose.models.donorAvailabilityLog ||
  mongoose.model('donorAvailabilityLog', donorAvailabilityLogSchema);

export default donorAvailabilityLogModel;

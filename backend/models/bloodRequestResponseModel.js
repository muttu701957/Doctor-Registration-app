import mongoose from 'mongoose';

const bloodRequestResponseSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'bloodRequest',
      required: true,
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'bloodDonor',
      required: true,
    },
    donorUserId: { type: String, default: null },
    donorType:   { type: String, enum: ['user', 'doctor'], required: true },
    donorName:   { type: String },
    donorBloodGroup: { type: String },
    mobileNumber:    { type: String, default: '' },
    distanceKm:      { type: Number, default: null },
    locationName:    { type: String, default: '' },

    responseStatus: {
      type: String,
      enum: ['notified', 'accepted', 'declined', 'no_response'],
      default: 'notified',
    },
    respondedAt: { type: Date, default: null },
    notifiedAt:  { type: Date, default: Date.now },
    notes:       { type: String, default: '' },
  },
  { timestamps: true }
);

bloodRequestResponseSchema.index({ requestId: 1 });
bloodRequestResponseSchema.index({ donorId: 1, createdAt: -1 });
bloodRequestResponseSchema.index({ donorUserId: 1 });

const bloodRequestResponseModel =
  mongoose.models.bloodRequestResponse ||
  mongoose.model('bloodRequestResponse', bloodRequestResponseSchema);

export default bloodRequestResponseModel;

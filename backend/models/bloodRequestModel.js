import mongoose from 'mongoose';

const bloodRequestSchema = new mongoose.Schema(
  {
    requestorType: { type: String, enum: ['user', 'doctor', 'admin'], required: true },
    requestorId:   { type: String, required: true },
    requestorName: { type: String, default: '' },

    patientName:        { type: String, required: true },
    requiredBloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    contactNumber: { type: String, required: true },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    locationName: { type: String, default: '' },

    urgencyType: {
      type: String,
      enum: ['normal', 'urgent', 'emergency'],
      default: 'normal',
    },
    additionalNotes: { type: String, default: '' },
    requiredDate:    { type: Date, default: null },

    status: {
      type: String,
      enum: ['active', 'fulfilled', 'cancelled', 'closed'],
      default: 'active',
    },
    fulfilledAt:  { type: Date, default: null },
    cancelledAt:  { type: Date, default: null },
    closedAt:     { type: Date, default: null },
    notifiedCount:{ type: Number, default: 0 },
  },
  { timestamps: true }
);

bloodRequestSchema.index({ location: '2dsphere' });
bloodRequestSchema.index({ requestorId: 1, status: 1, createdAt: -1 });
bloodRequestSchema.index({ requiredBloodGroup: 1, status: 1 });
bloodRequestSchema.index({ urgencyType: 1, status: 1 });

const bloodRequestModel =
  mongoose.models.bloodRequest || mongoose.model('bloodRequest', bloodRequestSchema);

export default bloodRequestModel;

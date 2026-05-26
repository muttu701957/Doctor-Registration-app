import mongoose from 'mongoose';

const bloodDonorSchema = new mongoose.Schema(
  {
    donorType: { type: String, enum: ['user', 'doctor'], required: true },
    userId:    { type: String, default: null },
    doctorId:  { type: String, default: null },

    fullName:     { type: String, required: true },
    email:        { type: String, required: true },
    mobileNumber: { type: String, required: true },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },

    // GeoJSON Point — required for $geoNear / $nearSphere queries
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    locationName: { type: String, default: '' },

    availabilityStatus: { type: Boolean, default: true },
    isBlocked:          { type: Boolean, default: false },

    lastDonationDate: { type: Date, default: null },
    emergencyContact: { type: String, default: null },

    acknowledgementAccepted:   { type: Boolean, required: true },
    acknowledgementAcceptedAt: { type: Date },
  },
  { timestamps: true }
);

// Geospatial index — mandatory for $geoNear
bloodDonorSchema.index({ location: '2dsphere' });
// Fast filter queries
bloodDonorSchema.index({ bloodGroup: 1, availabilityStatus: 1, isBlocked: 1 });
bloodDonorSchema.index({ userId: 1 });
bloodDonorSchema.index({ doctorId: 1 });

const bloodDonorModel =
  mongoose.models.bloodDonor || mongoose.model('bloodDonor', bloodDonorSchema);

export default bloodDonorModel;

import mongoose from 'mongoose';

const CapabilitySchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
    status: { type: String, enum: ['pending', 'certified'], default: 'pending' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    approvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// One capability record per (employee, device) — re-requesting just flips an
// existing record back to pending rather than creating a duplicate.
CapabilitySchema.index({ employee: 1, device: 1 }, { unique: true });

export default mongoose.models.Capability || mongoose.model('Capability', CapabilitySchema);

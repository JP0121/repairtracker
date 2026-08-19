import mongoose from 'mongoose';

const DeviceSchema = new mongoose.Schema({
  manufacturer: { type: String, required: true },
  name: { type: String, required: true },
  repairType: { type: String, required: true },
});

// A given (manufacturer, model, repair type) combo should only exist once in the catalog.
DeviceSchema.index({ manufacturer: 1, name: 1, repairType: 1 }, { unique: true });

export default mongoose.models.Device || mongoose.model('Device', DeviceSchema);

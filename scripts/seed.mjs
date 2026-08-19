// Run with: node scripts/seed.mjs
// Requires MONGODB_URI (and optionally SEED_MANAGER_EMAIL / SEED_MANAGER_PASSWORD)
// in your environment or a .env.local file in the project root.

import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { DEVICE_CATALOG } from '../src/data/deviceCatalog.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI. Set it in .env.local before seeding.');
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true },
    passwordHash: String,
    role: { type: String, enum: ['manager', 'employee'], default: 'employee' },
    title: { type: String, default: 'Technician' },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const DeviceSchema = new mongoose.Schema({
  manufacturer: String,
  name: String,
  repairType: String,
});
DeviceSchema.index({ manufacturer: 1, name: 1, repairType: 1 }, { unique: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Device = mongoose.models.Device || mongoose.model('Device', DeviceSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB.');

  // Devices — upsert so re-running the script is safe.
  let created = 0;
  for (const device of DEVICE_CATALOG) {
    const result = await Device.updateOne(device, { $setOnInsert: device }, { upsert: true });
    if (result.upsertedCount) created += 1;
  }
  console.log(`Devices: ${created} created, ${DEVICE_CATALOG.length - created} already existed. Total catalog size: ${DEVICE_CATALOG.length}.`);

  // Initial manager account.
  const email = (process.env.SEED_MANAGER_EMAIL || 'manager@ubreakifix.local').toLowerCase();
  const password = process.env.SEED_MANAGER_PASSWORD || 'changeme123';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Manager account already exists for ${email} — skipping.`);
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({
      name: 'Manager',
      email,
      passwordHash,
      role: 'manager',
      title: 'Manager',
    });
    console.log(`Created manager account: ${email} / ${password}`);
    console.log('Log in with this and change the password (or add your real account and archive this one).');
  }

  await mongoose.disconnect();
  console.log('Done.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

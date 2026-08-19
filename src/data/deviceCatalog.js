// Source of truth for the repair catalog. Used by scripts/seed.mjs to
// populate the Device collection. Not imported by the frontend directly —
// the app reads devices from GET /api/devices once seeded.

function expand(manufacturer, models, repairTypes) {
  const rows = [];
  for (const model of models) {
    for (const repairType of repairTypes) {
      rows.push({ manufacturer, name: model, repairType });
    }
  }
  return rows;
}

const PHONE_REPAIRS = ['Screen Replacement', 'Battery Replacement', 'Charging Port Repair'];
const TABLET_REPAIRS = ['Screen Replacement', 'Battery Replacement'];
const CONSOLE_REPAIRS = ['HDMI Port Repair', 'Disc Drive Replacement', 'Power Supply Repair'];

export const DEVICE_CATALOG = [
  // Apple — iPhones (16 down to 5)
  ...expand(
    'Apple',
    [
      'iPhone 16', 'iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone 11',
      'iPhone X', 'iPhone 8', 'iPhone 7', 'iPhone 6', 'iPhone 5',
    ],
    PHONE_REPAIRS
  ),

  // Apple — iPads (similar generations grouped together)
  ...expand(
    'Apple',
    ['iPad (7th/8th/9th Gen)', 'iPad Air', 'iPad Mini', 'iPad Pro'],
    TABLET_REPAIRS
  ),

  // Samsung — Galaxy S phones (24 down to 8; Samsung has no S11–S19, jumps 10 -> 20)
  ...expand(
    'Samsung',
    [
      'Galaxy S24', 'Galaxy S23', 'Galaxy S22', 'Galaxy S21', 'Galaxy S20',
      'Galaxy S10', 'Galaxy S9', 'Galaxy S8',
    ],
    PHONE_REPAIRS
  ),
  ...expand('Samsung', ['Galaxy A Series (common models)'], PHONE_REPAIRS),
  ...expand('Samsung', ['Galaxy Z Fold'], [...PHONE_REPAIRS, 'Hinge / Fold Screen Repair']),
  ...expand('Samsung', ['Galaxy Z Flip'], [...PHONE_REPAIRS, 'Hinge / Fold Screen Repair']),

  // Samsung — tablets
  ...expand('Samsung', ['Galaxy Tab S9', 'Galaxy Tab A Series'], TABLET_REPAIRS),

  // Google — Pixel phones
  ...expand(
    'Google',
    ['Pixel 9', 'Pixel 8', 'Pixel 7', 'Pixel 6', 'Pixel A Series (6a/7a/8a)'],
    PHONE_REPAIRS
  ),

  // Consoles — PlayStation
  ...expand('Consoles', ['PS5', 'PS4', 'PS3'], CONSOLE_REPAIRS),

  // Consoles — Xbox
  ...expand('Consoles', ['Xbox Series X/S', 'Xbox One'], CONSOLE_REPAIRS),

  // Consoles — Nintendo
  ...expand('Consoles', ['Nintendo Switch (OG/OLED)', 'Nintendo Switch Lite'], [
    'Joy-Con Drift Repair',
    'Screen Replacement',
    'Charging Port Repair',
  ]),
];

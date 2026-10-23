// Options for the quote form. Shared by the form (client) and the API (server),
// so stored values stay consistent for Phase 2 (staff app / client records).
export type Option = { value: string; label: string };

export const locations: Option[] = [
  { value: 'uluwatu', label: 'Uluwatu' },
  { value: 'canggu', label: 'Canggu' },
  { value: 'other', label: 'Other (type area)' },
];
export const propertyTypes: Option[] = [
  { value: 'villa', label: 'Villa' },
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'guesthouse', label: 'Guesthouse' },
  { value: 'commercial', label: 'Commercial' },
];
export const bedrooms: Option[] = ['1', '2', '3', '4', '5+'].map((b) => ({ value: b, label: b }));
export const pool: Option[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];
export const gardenSizes: Option[] = [
  { value: 'none', label: 'None' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];
export const services: Option[] = [
  { value: 'housekeeping', label: 'Housekeeping' },
  { value: 'pool-care', label: 'Pool' },
  { value: 'garden-landscape', label: 'Garden' },
  { value: 'property-maintenance', label: 'Maintenance' },
  { value: 'not-sure', label: 'Not sure' },
];
export const packages: Option[] = [
  { value: 'care-basic', label: 'Care Basic' },
  { value: 'care-plus', label: 'Care Plus' },
  { value: 'rental-ready', label: 'Rental Ready' },
  { value: 'custom', label: 'Custom' },
  { value: 'not-sure', label: 'Not sure' },
];
export const residency: Option[] = [
  { value: 'full-time', label: 'Full time' },
  { value: 'part-year', label: 'Part of the year' },
  { value: 'rental', label: 'Rental property' },
  { value: 'not-in-bali', label: 'Not in Bali' },
];
export const frequency: Option[] = [
  { value: 'daily', label: 'Daily' },
  { value: '2-3-week', label: '2–3 times a week' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'one-off', label: 'One-off' },
  { value: 'not-sure', label: 'Not sure' },
];
export const heardFrom: Option[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'google', label: 'Google' },
  { value: 'referral', label: 'Referral' },
  { value: 'other', label: 'Other' },
];

export const LEAD_STATUSES = ['New', 'Contacted', 'Survey booked', 'Quote sent', 'Won', 'Lost'] as const;

export const MAX_PHOTOS = 5;
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

export const labelOf = (list: Option[], value: string) => list.find((o) => o.value === value)?.label ?? value;

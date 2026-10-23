import type { ImageMetadata } from 'astro';

// All photos in src/assets/photos, addressed by file name (without .jpg).
// Placeholder photos for now: replace the files with real ones, keeping the names.
const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.{jpg,jpeg,png,webp}', { eager: true });

export const photos: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(files).map(([path, mod]) => [path.split('/').pop()!.replace(/\.\w+$/, ''), mod.default]),
);

export function photo(name: string): ImageMetadata {
  const p = photos[name];
  if (!p) throw new Error(`Photo "${name}" not found in src/assets/photos`);
  return p;
}

// Alt text per photo (keep in sync when replacing photos)
export const alts: Record<string, string> = {
  'staff': 'Five uniformed staff members standing in a row with white gloves',
  'ba-pool-before': 'Villa pool before cleaning, with debris in the water',
  'ba-pool-after': 'Villa pool after cleaning, clear and sparkling',
  'ba-garden-before': 'Villa garden before the crew arrives, with the lawn needing work',
  'ba-garden-after': 'Villa garden after care, lawn mowed and hedges trimmed',
  'ba-bed-before': 'Bed with rumpled linen before housekeeping',
  'ba-bed-after': 'Bed freshly made with crisp linen after housekeeping',
  'anywhere': 'Guest working on a laptop from the edge of a turquoise villa pool',
  'hk-0': 'Smiling cleaning team in blue uniforms',
  'hk-1': 'Four smiling housekeepers in uniform',
  'hk-2': 'Four smiling housekeepers in green aprons',
  'hk-3': 'Smiling housekeeping team in green aprons',
  'hk-4': 'Four smiling team members in navy uniforms',
  'hk-5': 'Cheerful housekeeping team in green aprons',
  'hk-6': 'Smiling housekeepers in green aprons',
  'hk-7': 'Three smiling housekeepers in navy uniforms',
  'villa-pool': 'Villa with a private pool and palm trees',
  'pool-garden': 'Private pool surrounded by a tropical garden',
  'pool-lush': 'Turquoise pool beside lush tropical plants',
  'pool-deck': 'Villa pool with sun loungers and a parasol',
  'pool-cabana': 'Pool with loungers in front of a timber pavilion',
  'pool-skimmer': 'Pool skimmer net on clear blue water',
  'pool-brush': 'Pool being brushed with a long pole',
  'pool-net-leaf': 'Leaf being lifted out of a pool with a skimmer net',
  'pool-cleaning': 'Pool care worker cleaning a villa pool',
  'bedroom-warm': 'Freshly made bed in a warm-toned villa bedroom',
  'bedroom-gable': 'Bright villa bedroom under a thatched gable roof',
  'bedroom-timber': 'Timber villa bedroom with garden views',
  'housekeeper-bed': 'Housekeeper making a bed in a bright villa room',
  'staff-towels': 'Smiling housekeeper holding a stack of fresh towels',
  'housekeeper-bathroom': 'Housekeeper placing fresh towels in a villa bathroom',
  'housekeeper-curtains': 'Housekeeper opening the curtains in a villa room',
  'team-kitchen': 'Two smiling team members cleaning a villa kitchen',
  'villa-desk': 'Timber villa room with a writing desk and garden view',
  'villa-suite': 'Villa suite with a timber ceiling and woven headboard',
  'bedroom-beams': 'Calm villa bedroom under timber beams',
  'bedroom-linen': 'Freshly made bed with crisp white linen',
  'bedroom-morning': 'Morning light over a freshly made bed',
  'bedroom-nook': 'Cosy bed nook with a woven pendant lamp',
  'towels-bench': 'Rolled white towels on a woven bench',
  'towel-basket': 'Fresh towels and slippers in a woven basket',
  'towels-shelf': 'Folded towels and soap on a bathroom shelf',
  'housekeeper-linen': 'Housekeeper smoothing fresh bed linen',
  'garden-watering': 'Gardener watering a tropical villa garden',
  'garden-rake': 'Gardener raking leaves on a gravel path',
  'garden-mowing': 'Garden crew mowing a villa lawn',
  'hedge-trim': 'Hedge being trimmed with a hedge cutter',
  'lawn-care': 'Gardener tending a lawn in front of a villa',
  'grass-trim': 'Grass being trimmed with a strimmer',
  'garden-frangipani': 'Villa garden with frangipani trees and a lounge chair',
  'garden-villa': 'Villa courtyard garden with stepping stones',
  'door-repair': 'Technician fixing a villa door lock',
  'ac-cleaning': 'Gloved hands cleaning an air conditioning vent',
  'surface-wipe': 'Gloved hands spraying and wiping a wooden surface',
  'bedroom-view': 'Villa bed facing a window with palm trees',
  'bedroom-garden': 'Villa bedroom opening onto a garden',
};

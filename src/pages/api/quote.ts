import type { APIRoute } from 'astro';
import * as O from '../../lib/quote-options';
import { newId, saveRecord, saveUploads, queueNotification } from '../../lib/leads';
import { site } from '../../config';

export const prerender = false;

const THANK_YOU = '/quote/thank-you';
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const inList = (list: O.Option[], v: string) => list.some((o) => o.value === v);

export const POST: APIRoute = async ({ request, redirect }) => {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  const done = () => (wantsJson ? Response.json({ ok: true, redirect: THANK_YOU }) : redirect(THANK_YOU, 303));
  const fail = (status: number, error: string, errors: Record<string, string> = {}) =>
    wantsJson ? Response.json({ ok: false, error, errors }, { status }) : redirect('/quote?error=1', 303);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(400, 'The form could not be read. Please try again.');
  }
  const get = (k: string) => String(form.get(k) ?? '').trim();

  // Spam protection: hidden honeypot field and a minimum fill time. Bots get a fake success.
  const started = Number(get('started'));
  if (get('company_website') || (started && Date.now() - started < 3000)) return done();

  const lead = {
    name: get('name'),
    whatsapp: get('whatsapp'),
    email: get('email'),
    location: get('location'),
    location_other: get('location_other'),
    property_type: get('property_type'),
    bedrooms: get('bedrooms'),
    pool: get('pool'),
    garden_size: get('garden_size'),
    services: form.getAll('services').map(String).filter((s) => inList(O.services, s)),
    package: get('package'),
    residency: get('residency'),
    frequency: get('frequency'),
    start_date: get('start_date'),
    notes: get('notes').slice(0, 3000),
    heard_from: get('heard_from'),
    consent: get('consent') === 'yes',
  };

  const errors: Record<string, string> = {};
  if (lead.name.length < 2) errors.name = 'Please enter your full name.';
  if (lead.whatsapp.replace(/\D/g, '').length < 8) errors.whatsapp = 'Please enter your WhatsApp number with country code.';
  if (!isEmail(lead.email)) errors.email = 'Please enter a valid email address.';
  if (!inList(O.locations, lead.location)) errors.location = 'Please choose a location.';
  if (lead.location === 'other' && !lead.location_other) errors.location_other = 'Please type your area.';
  if (!inList(O.propertyTypes, lead.property_type)) errors.property_type = 'Please choose a property type.';
  if (!inList(O.bedrooms, lead.bedrooms)) errors.bedrooms = 'Please choose the number of bedrooms.';
  if (!inList(O.pool, lead.pool)) errors.pool = 'Please tell us if there is a pool.';
  if (lead.garden_size && !inList(O.gardenSizes, lead.garden_size)) errors.garden_size = 'Please choose a garden size.';
  if (!lead.services.length) errors.services = 'Please choose at least one service.';
  if (lead.package && !inList(O.packages, lead.package)) errors.package = 'Please choose a package.';
  if (!inList(O.residency, lead.residency)) errors.residency = 'Please choose an option.';
  if (lead.frequency && !inList(O.frequency, lead.frequency)) errors.frequency = 'Please choose an option.';
  if (lead.start_date && !/^\d{4}-\d{2}-\d{2}$/.test(lead.start_date)) errors.start_date = 'Please choose a valid date.';
  if (lead.heard_from && !inList(O.heardFrom, lead.heard_from)) errors.heard_from = 'Please choose an option.';
  if (!lead.consent) errors.consent = 'Please agree so we can contact you about your inquiry.';

  const files = form.getAll('photos').filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > O.MAX_PHOTOS) errors.photos = `Please upload up to ${O.MAX_PHOTOS} photos.`;
  else if (files.some((f) => !f.type.startsWith('image/'))) errors.photos = 'Photos must be image files.';
  else if (files.some((f) => f.size > O.MAX_PHOTO_BYTES)) errors.photos = 'Each photo must be under 10 MB.';

  if (Object.keys(errors).length) return fail(422, 'Please check the highlighted fields.', errors);

  const id = newId('Q');
  const createdAt = new Date().toISOString();
  try {
    const photos = await saveUploads(id, files);
    // One column per answer, so Phase 2 can reuse the data for pricing and scheduling.
    await saveRecord('leads', {
      id,
      created_at: createdAt,
      status: 'New',
      name: lead.name,
      whatsapp: lead.whatsapp,
      email: lead.email,
      location: lead.location,
      location_other: lead.location_other,
      property_type: lead.property_type,
      bedrooms: lead.bedrooms,
      pool: lead.pool,
      garden_size: lead.garden_size,
      services: lead.services.join('|'),
      package: lead.package,
      residency: lead.residency,
      frequency: lead.frequency,
      start_date: lead.start_date,
      notes: lead.notes,
      heard_from: lead.heard_from,
      photos: photos.join('|'),
      consent: 'yes',
      source_page: request.headers.get('referer') ?? '',
    });

    const summary = [
      `New quote request ${id}`,
      `Name: ${lead.name}`,
      `WhatsApp: ${lead.whatsapp}`,
      `Email: ${lead.email}`,
      `Location: ${O.labelOf(O.locations, lead.location)}${lead.location_other ? ` (${lead.location_other})` : ''}`,
      `Property: ${O.labelOf(O.propertyTypes, lead.property_type)}, ${lead.bedrooms} bedroom(s), pool: ${lead.pool}, garden: ${lead.garden_size || '-'}`,
      `Services: ${lead.services.map((s) => O.labelOf(O.services, s)).join(', ')}`,
      `Package: ${lead.package ? O.labelOf(O.packages, lead.package) : '-'}`,
      `Lives at property: ${O.labelOf(O.residency, lead.residency)}`,
      `Frequency: ${lead.frequency ? O.labelOf(O.frequency, lead.frequency) : '-'}`,
      `Start date: ${lead.start_date || '-'}`,
      `Heard from: ${lead.heard_from || '-'}`,
      `Photos: ${photos.length}`,
      `Notes: ${lead.notes || '-'}`,
    ].join('\n');

    await queueNotification(id, 'team', `TO: team (email + WhatsApp ${site.whatsappDisplay})\n\n${summary}`);
    await queueNotification(
      id,
      'visitor',
      `TO: ${lead.email}\nSUBJECT: We've received your request\n\nHi ${lead.name.split(' ')[0]},\n\nThank you, we've received your request. We'll reply on WhatsApp within 24 hours.\n\nWhat you sent us:\n${summary.split('\n').slice(4).join('\n')}\n\n${site.name}\n${site.tagline}`,
    );
  } catch (err) {
    console.error('[quote] failed to save lead', err);
    return fail(500, 'Something went wrong on our side. Please message us on WhatsApp.');
  }

  return done();
};

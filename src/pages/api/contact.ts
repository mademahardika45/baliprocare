import type { APIRoute } from 'astro';
import { newId, saveRecord, queueNotification } from '../../lib/leads';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  const done = () => (wantsJson ? Response.json({ ok: true }) : redirect('/contact?sent=1', 303));
  const fail = (status: number, error: string) => (wantsJson ? Response.json({ ok: false, error }, { status }) : redirect('/contact?error=1', 303));

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(400, 'The form could not be read.');
  }
  const get = (k: string) => String(form.get(k) ?? '').trim();
  const started = Number(get('started'));
  if (get('company_website') || (started && Date.now() - started < 3000)) return done();

  const name = get('name');
  const whatsapp = get('whatsapp');
  const email = get('email');
  const message = get('message').slice(0, 3000);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (name.length < 2 || message.length < 5 || !(emailOk || whatsapp.replace(/\D/g, '').length >= 8) || get('consent') !== 'yes') {
    return fail(422, 'Please fill in your name, a way to reach you, a message and tick the consent box.');
  }

  const id = newId('M');
  try {
    await saveRecord('messages', { id, created_at: new Date().toISOString(), status: 'New', name, whatsapp, email, message });
    await queueNotification(id, 'team', `New contact message ${id}\nName: ${name}\nWhatsApp: ${whatsapp || '-'}\nEmail: ${email || '-'}\n\n${message}`);
  } catch (err) {
    console.error('[contact] failed to save message', err);
    return fail(500, 'Something went wrong on our side.');
  }
  return done();
};

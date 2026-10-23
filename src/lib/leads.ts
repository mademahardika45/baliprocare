// Local lead storage (Phase 1, localhost).
// Every submission is saved to <LEADS_DIR>/leads.json and leads.csv (opens in Excel / Google Sheets),
// with a Status column (New, Contacted, Survey booked, Quote sent, Won, Lost).
// Email and WhatsApp notifications are written to <LEADS_DIR>/outbox/ until a sending service
// (e.g. Resend for email, a WhatsApp API provider) is chosen with the hosting.
import { mkdir, readFile, writeFile, appendFile, access } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { LEADS_DIR } from 'astro:env/server';

const root = path.resolve(process.cwd(), LEADS_DIR);

export type Row = Record<string, string>;

const exists = (p: string) => access(p).then(() => true, () => false);

function csvCell(v: string) {
  const s = String(v ?? '').replace(/\r?\n/g, ' ');
  return /[",;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function newId(prefix: string) {
  const d = new Date();
  const stamp = d.toISOString().slice(0, 10).replace(/-/g, '');
  return `${prefix}-${stamp}-${randomUUID().slice(0, 6)}`;
}

export async function saveRecord(kind: 'leads' | 'messages', row: Row) {
  await mkdir(root, { recursive: true });
  // JSON (full history)
  const jsonPath = path.join(root, `${kind}.json`);
  const list: Row[] = (await exists(jsonPath)) ? JSON.parse(await readFile(jsonPath, 'utf8')) : [];
  list.push(row);
  await writeFile(jsonPath, JSON.stringify(list, null, 2));
  // CSV (spreadsheet)
  const csvPath = path.join(root, `${kind}.csv`);
  const cols = Object.keys(row);
  if (!(await exists(csvPath))) await writeFile(csvPath, '﻿' + cols.join(',') + '\n');
  await appendFile(csvPath, cols.map((c) => csvCell(row[c])).join(',') + '\n');
}

export async function saveUploads(id: string, files: File[]) {
  if (!files.length) return [] as string[];
  const dir = path.join(root, 'uploads', id);
  await mkdir(dir, { recursive: true });
  const saved: string[] = [];
  for (const [i, f] of files.entries()) {
    const ext = (f.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5) || 'jpg';
    const name = `photo-${i + 1}.${ext}`;
    await writeFile(path.join(dir, name), Buffer.from(await f.arrayBuffer()));
    saved.push(`uploads/${id}/${name}`);
  }
  return saved;
}

export async function queueNotification(id: string, kind: string, body: string) {
  const dir = path.join(root, 'outbox');
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `${id}-${kind}.txt`), body);
  console.log(`[leads] ${kind} notification queued: outbox/${id}-${kind}.txt`);
}

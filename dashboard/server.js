// Mission Control — zero-dependency Node server (read-only swarm dashboard).
// Run: node dashboard/server.js   →   http://localhost:4317
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const MATE = path.join(ROOT, '.mate');
const PUBLIC = path.join(__dirname, 'public');
const PORT = process.env.PORT || 4317;

const ROLE_MAP = {
  'mate-pm': 'pm', 'pm': 'pm', 'project manager': 'pm',
  'mate-designer': 'designer', 'designer': 'designer',
  'mate-coder': 'coder', 'coder': 'coder',
  'mate-tester': 'tester', 'tester': 'tester',
  'lead': 'lead', 'mate lead': 'lead',
};
const normRole = (r) => { if (!r) return null; const k = String(r).trim().toLowerCase(); return ROLE_MAP[k] || k; };
const readSafe = (p) => { try { return fs.readFileSync(p, 'utf8'); } catch { return ''; } };

function parseTracker(md) {
  const lanes = { backlog: [], inflight: [], blocked: [], done: [], parallel: [] };
  let cur = null;
  for (const raw of md.split(/\r?\n/)) {
    const line = raw.trim();
    if (line.startsWith('## ')) {
      const h = line.toLowerCase();
      if (h.includes('backlog')) cur = 'backlog';
      else if (h.includes('flight')) cur = 'inflight';
      else if (h.includes('blocked')) cur = 'blocked';
      else if (h.includes('shipped') || h.includes('validated') || h.includes('done')) cur = 'done';
      else if (h.includes('parallel')) cur = 'parallel';
      else cur = null;
      continue;
    }
    if (cur && line.startsWith('- ')) {
      const text = line.slice(2).trim();
      if (text && !text.startsWith('(')) lanes[cur].push(text);
    }
  }
  return lanes;
}

function activeRolesFromTracker(md) {
  const set = new Set();
  const re = /\[IN PROGRESS:?\s*([^\]]+)\]/gi; let m;
  while ((m = re.exec(md))) { const r = normRole(m[1]); if (r) set.add(r); }
  return set;
}

function parseWiki(md) {
  const rows = [];
  for (const raw of md.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line.startsWith('|')) continue;
    if (/^\|\s*:?-+/.test(line)) continue;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length >= 4 && cells[0].toLowerCase() !== 'entry stamp') {
      rows.push({ stamp: cells[0], agent: cells[1], discovery: cells[2], impact: cells[3] });
    }
  }
  return rows.slice(-8).reverse();
}

function parseQA(md) {
  const bugs = []; const signoff = [];
  for (const raw of md.split(/\r?\n/)) {
    const line = raw.trim();
    if (line.includes('[FAIL]')) bugs.push(line.replace(/^[*\-]\s*/, ''));
    const cb = line.match(/^- \[( |x|X)\]\s*(.+)$/);
    if (cb) signoff.push({ done: cb[1].toLowerCase() === 'x', label: cb[2] });
  }
  return { bugs, signoff };
}

function parseEvents() {
  const txt = readSafe(path.join(MATE, 'activity_log.jsonl'));
  const events = [];
  for (const line of txt.split(/\r?\n/)) {
    const t = line.trim(); if (!t) continue;
    try { events.push(JSON.parse(t)); } catch { /* skip bad line */ }
  }
  return events;
}

function gitChanges() {
  try {
    const out = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    return out.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).slice(0, 40);
  } catch { return []; }
}

function buildCoderThreads(events, stalems, now) {
  const byTask = {};
  for (const e of events) {
    if (normRole(e.role) !== 'coder') continue;
    const task = (e.task || '').trim() || '_unknown';
    if (!byTask[task]) byTask[task] = [];
    byTask[task].push(e);
  }
  const threads = [];
  for (const [task, evts] of Object.entries(byTask)) {
    const last = evts[evts.length - 1];
    if (last.event === 'start' && (now - new Date(last.ts).getTime()) < stalems) {
      threads.push({ task, since: last.ts });
    }
  }
  return threads.sort((a, b) => new Date(a.since) - new Date(b.since));
}

function buildState() {
  const trackerMd = readSafe(path.join(MATE, '03_TASK_TRACKER.md'));
  const wikiMd = readSafe(path.join(MATE, '04_LLM_WIKI.md'));
  const qaMd = readSafe(path.join(MATE, '05_QA_LOG.md'));
  const events = parseEvents();

  const latest = {};
  for (const e of events) { const r = normRole(e.role); if (!r) continue; latest[r] = e; }
  const fromTracker = activeRolesFromTracker(trackerMd);

  const STALE_MS = 10 * 60 * 1000;
  const now = Date.now();
  const coderThreads = buildCoderThreads(events, STALE_MS, now);
  const agents = ['pm', 'designer', 'coder', 'tester'].map((r) => {
    const le = latest[r];
    const freshStart = !!le && le.event === 'start' && (now - new Date(le.ts).getTime()) < STALE_MS;
    const active = fromTracker.has(r) || freshStart;
    return {
      role: r,
      active,
      task: le ? (le.task || '') : '',
      since: (active && le && le.event === 'start') ? le.ts : null,
    };
  });

  const feed = events.slice(-60).reverse().map((e) => ({
    ts: e.ts, actor: e.actor || e.role || '?', role: normRole(e.role),
    event: e.event, task: e.task || '', status: e.status || '',
  }));

  return {
    now: new Date().toISOString(),
    agents,
    coderThreads,
    lanes: parseTracker(trackerMd),
    wiki: parseWiki(wikiMd),
    qa: parseQA(qaMd),
    changes: gitChanges(),
    feed,
  };
}

const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  if (req.url === '/api/state') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(buildState()));
    return;
  }
  const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const safe = path.normalize(urlPath).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(PUBLIC, safe);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(filePath)] || 'text/plain' });
    res.end(data);
  });
});
// Bind to loopback only — local-only dashboard, avoids public-network firewall prompts.
server.listen(PORT, '127.0.0.1', () => console.log(`Mission Control → http://127.0.0.1:${PORT}`));

const AGENT_META = {
  pm: { icon: '📋', name: 'Project Manager' },
  designer: { icon: '🎨', name: 'Designer' },
  coder: { icon: '🔨', name: 'Coder' },
  tester: { icon: '🧪', name: 'Tester' },
};
let STATE = null;

function fmtElapsed(sinceIso) {
  if (!sinceIso) return '';
  const s = Math.max(0, Math.floor((Date.now() - new Date(sinceIso).getTime()) / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
function hhmm(iso) {
  try { return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
  catch { return ''; }
}
function badge(ev) {
  const map = { start: '▶ started', end: '■ done', info: '·', dispatch: '→ dispatched' };
  return `<span class="b b-${ev}">${map[ev] || ev}</span>`;
}
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

async function poll() {
  const conn = document.getElementById('conn');
  try {
    const r = await fetch('/api/state', { cache: 'no-store' });
    STATE = await r.json();
    conn.className = 'conn ok'; conn.textContent = '● live';
    render();
  } catch {
    conn.className = 'conn err'; conn.textContent = '● disconnected';
  }
}

function render() {
  if (!STATE) return;

  const a = document.getElementById('agents'); a.innerHTML = '';
  const threads = STATE.coderThreads || [];
  for (const ag of STATE.agents) {
    const meta = AGENT_META[ag.role] || { icon: '🤖', name: ag.role };
    const el = document.createElement('div');
    el.className = 'agent' + (ag.active ? ' active' : '');
    el.dataset.role = ag.role;

    if (ag.role === 'coder' && threads.length > 1) {
      const threadHtml = threads.map((t, i) =>
        `<div class="thread">` +
        `<span class="thread-n">Coder ${i + 1}</span>` +
        `<span class="thread-task">${esc(t.task)}</span>` +
        `<span class="thread-timer timer" data-since="${t.since}">${fmtElapsed(t.since)}</span>` +
        `</div>`
      ).join('');
      el.innerHTML =
        `<div class="icon">${meta.icon}</div>` +
        `<div class="name">${meta.name} <span class="thread-count">×${threads.length}</span></div>` +
        `<div class="state">⏳ running in parallel</div>` +
        `<div class="threads">${threadHtml}</div>`;
    } else {
      el.innerHTML =
        `<div class="icon">${meta.icon}</div>` +
        `<div class="name">${meta.name}</div>` +
        `<div class="state">${ag.active ? '⏳ working' : 'idle'}</div>` +
        `<div class="task">${ag.active ? esc(ag.task) : ''}</div>` +
        `<div class="timer" data-since="${ag.since || ''}">${ag.active ? fmtElapsed(ag.since) : ''}</div>`;
    }
    a.appendChild(el);
  }

  const laneDefs = [['backlog', 'Backlog'], ['inflight', 'In Flight'], ['blocked', 'Blocked'], ['done', 'Done']];
  const L = document.getElementById('lanes'); L.innerHTML = '';
  for (const [k, label] of laneDefs) {
    const items = STATE.lanes[k] || [];
    const col = document.createElement('div'); col.className = 'lane lane-' + k;
    col.innerHTML = `<div class="lane-h">${label}<span class="count">${items.length}</span></div>`;
    const wrap = document.createElement('div'); wrap.className = 'cards';
    for (const it of items) { const c = document.createElement('div'); c.className = 'tcard'; c.innerHTML = esc(it); wrap.appendChild(c); }
    col.appendChild(wrap); L.appendChild(col);
  }

  const f = document.getElementById('feed'); f.innerHTML = '';
  for (const e of STATE.feed) {
    const li = document.createElement('li');
    li.innerHTML = `<span class="t">${hhmm(e.ts)}</span><span class="who ${e.role || ''}">${esc(e.actor)}</span>${badge(e.event)}${esc(e.task)}`;
    f.appendChild(li);
  }

  const w = document.getElementById('wiki'); w.innerHTML = '';
  if (!STATE.wiki.length) w.innerHTML = '<li class="muted">no decisions yet</li>';
  for (const row of STATE.wiki) {
    const li = document.createElement('li');
    li.innerHTML = `<span class="stamp">${esc(row.stamp)} · ${esc(row.agent)}</span><br>${esc(row.discovery)}`;
    w.appendChild(li);
  }

  const ch = document.getElementById('changes'); ch.innerHTML = '';
  if (!STATE.changes.length) ch.innerHTML = '<li class="muted">no changes yet</li>';
  for (const c of STATE.changes) { const li = document.createElement('li'); li.textContent = c; ch.appendChild(li); }

  const q = document.getElementById('qa'); q.innerHTML = '';
  const qa = STATE.qa || { bugs: [], signoff: [] };
  if (qa.bugs.length) { for (const b of qa.bugs) { const li = document.createElement('li'); li.className = 'bug'; li.textContent = b; q.appendChild(li); } }
  else { const li = document.createElement('li'); li.className = 'muted'; li.textContent = 'no failures logged'; q.appendChild(li); }
  for (const s of qa.signoff) { const li = document.createElement('li'); li.innerHTML = `${s.done ? '✅' : '⬜'} ${esc(s.label)}`; q.appendChild(li); }
}

function tick() {
  document.getElementById('clock').textContent = new Date().toLocaleTimeString();
  document.querySelectorAll('.timer').forEach((t) => {
    const s = t.getAttribute('data-since'); if (s) t.textContent = fmtElapsed(s);
  });
}

poll();
setInterval(poll, 500);
setInterval(tick, 1000);
tick();

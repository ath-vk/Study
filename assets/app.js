/* Atharva · Prep Tracker — plain JavaScript, no build step, no dependencies. */
(() => {
  'use strict';

  // ------------------------------------------------------------------ constants
  const LS_DATA = 'atharva-prep:data:v1';
  const LS_GH = 'atharva-prep:github:v1';
  const LS_UI = 'atharva-prep:ui:v1';
  const LS_KEY = 'atharva-prep:key:v1';
  const KDF_ITER = 250000;
  const TRACKS = ['DSA', 'LLD', 'HLD'];
  const TMETA = {
    DSA: { route: 'dsa', full: 'Data Structures & Algorithms', tagLabel: 'Topics', icon: 'code', color: 'var(--dsa)', hasTime: true },
    LLD: { route: 'lld', full: 'Low-Level Design', tagLabel: 'Patterns used', icon: 'boxes', color: 'var(--lld)', hasTime: true },
    HLD: { route: 'hld', full: 'High-Level / System Design', tagLabel: 'Concepts used', icon: 'network', color: 'var(--hld)', hasTime: false },
  };
  const DIFFS = ['Easy', 'Medium', 'Hard'];
  const CONFS = ['Low', 'Medium', 'High'];
  const STATUS = { overdue: 'Overdue', today: 'Due today', week: 'Due this week', upcoming: 'Upcoming', attempted: 'Attempted', todo: 'To do' };
  const STATUS_ORD = { overdue: 1, today: 2, week: 3, upcoming: 4, attempted: 5, todo: 6 };
  const DORD = { Easy: 1, Medium: 2, Hard: 3 };
  const CORD = { Low: 1, Medium: 2, High: 3 };
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const ICONS = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
    boxes: '<path d="M21 8 12 3 3 8l9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
    network: '<rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M5 16v-3h14v3M12 8v5"/>',
    repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    ext: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    upload: '<path d="M12 21V9M7 14l5-5 5 5M5 3h14"/>',
    alert: '<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    trend: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    cloud: '<path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.8A6 6 0 0 0 4 12.5 3.5 3.5 0 0 0 6.5 19Z"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
  };
  const ic = (n) => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

  // ------------------------------------------------------------------ helpers
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safeUrl = (u) => (/^https?:\/\//i.test(String(u || '').trim()) ? String(u).trim() : '');
  const pad = (n) => String(n).padStart(2, '0');
  const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => toISO(new Date());
  const parseD = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const fmt = (s) => (s ? s.split('-').reverse().join('/') : '—');        // dd/mm/yyyy
  const parseDMY = (s) => {                                                  // dd/mm/yyyy -> ISO, or null
    const m = String(s || '').trim().match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);
    if (!m) return null;
    const d = +m[1], mo = +m[2], y = +m[3], dt = new Date(y, mo - 1, d);
    return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d ? `${y}-${pad(mo)}-${pad(d)}` : null;
  };
  const dmyInput = (name, iso, id) => `<div class="date-in"><input class="dmy" name="${name}"${id ? ` id="${id}"` : ''} value="${iso ? fmt(iso) : ''}" placeholder="dd/mm/yyyy" inputmode="numeric" maxlength="10" autocomplete="off">
    <button type="button" class="icon-btn" data-action="pick-date" data-for="${name}" title="Pick from calendar">${ic('calendar')}</button>
    <input type="date" class="picker" data-picker-for="${name}" tabindex="-1" aria-hidden="true"></div>`;
  const formField = (name) => $(`#item-form [name="${name}"]`);
  const addDays = (s, n) => { const d = parseD(s); d.setDate(d.getDate() + n); return toISO(d); };
  const diff = (a, b) => Math.round((parseD(b) - parseD(a)) / 864e5);      // days from a to b
  const nextMonth = (m) => { const [y, mo] = m.split('-').map(Number); return mo === 12 ? `${y + 1}-01` : `${y}-${pad(mo + 1)}`; };
  const monthLabel = (k) => `${MONTHS[+k.slice(5, 7) - 1]} ’${k.slice(2, 4)}`;
  const monthLong = (k) => `${MONTHS[+k.slice(5, 7) - 1]} ${k.slice(0, 4)}`;
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const avg = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
  const r0 = (v) => (v == null ? '—' : Math.round(v));
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
  const uid = () => 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const validISO = (s) => (typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const ago = (d, t) => { const n = diff(d, t); return n <= 0 ? 'today' : n === 1 ? 'yesterday' : `${n} days ago`; };
  const greeting = () => { const h = new Date().getHours(); return h >= 5 && h < 12 ? 'Good morning' : h >= 12 && h < 17 ? 'Good afternoon' : 'Good evening'; };

  // ------------------------------------------------------------------ data
  const defaults = () => ({
    version: 1, owner: 'Atharva', updatedAt: null,
    settings: { intervals: { Low: 3, Medium: 7, High: 14 }, goals: { DSA: 191, LLD: null, HLD: null }, dailyRevisionGoal: 10, links: [] },
    items: [],
  });

  function normalize(raw) {
    const base = defaults();
    const d = raw && typeof raw === 'object' ? raw : {};
    const s = { ...base.settings, ...(d.settings || {}) };
    s.intervals = { ...base.settings.intervals, ...(s.intervals || {}) };
    s.goals = { ...base.settings.goals, ...(s.goals || {}) };
    s.links = Array.isArray(s.links) ? s.links.filter((l) => l && typeof l === 'object').map((l) => ({ label: String(l.label || ''), url: String(l.url || '') })) : [];
    const num = (v) => (v === null || v === undefined || v === '' || !Number.isFinite(+v) ? null : +v);
    const items = (Array.isArray(d.items) ? d.items : [])
      .filter((i) => i && TRACKS.includes(i.track) && String(i.name || '').trim())
      .map((i) => ({
        id: String(i.id || uid()), track: i.track, name: String(i.name).trim(), url: String(i.url || ''),
        topics: Array.isArray(i.topics) ? i.topics.map((t) => String(t).trim()).filter(Boolean) : [],
        difficulty: DIFFS.includes(i.difficulty) ? i.difficulty : null,
        attemptDate: validISO(i.attemptDate), solvedDate: validISO(i.solvedDate), timeMin: num(i.timeMin),
        approach: String(i.approach || ''), refUrl: String(i.refUrl || ''), mistakes: String(i.mistakes || ''),
        revisions: [...new Set((Array.isArray(i.revisions) ? i.revisions : []).map(validISO).filter(Boolean))].sort(),
        confidence: CONFS.includes(i.confidence) ? i.confidence : null,
      }));
    return { version: 1, owner: d.owner || 'Atharva', updatedAt: d.updatedAt || null, settings: s, items };
  }

  const parseFile = (text) => JSON.parse(String(text).trim().replace(/^window\.PROGRESS_DATA\s*=\s*/, '').replace(/;\s*$/, ''));
  const serialize = (d) => `window.PROGRESS_DATA = ${JSON.stringify(d, null, 1)};\n`;
  const newer = (a, b) => (!a ? b : !b ? a : (a.updatedAt || '') >= (b.updatedAt || '') ? a : b);

  let state = normalize(defaults());

  // ---- encryption: AES-256-GCM with a key derived from the password (PBKDF2-SHA256)
  let auth = null; // { key: CryptoKey, salt: base64 }
  const te = new TextEncoder(), td = new TextDecoder();
  const bytesToB64 = (u8) => { let bin = ''; for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(bin); };
  const b64ToBytes = (s) => Uint8Array.from(atob(String(s).replace(/\s/g, '')), (c) => c.charCodeAt(0));
  async function deriveKey(pw, saltB64) {
    const base = await crypto.subtle.importKey('raw', te.encode(pw), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64ToBytes(saltB64), iterations: KDF_ITER, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
  }
  async function encryptState(d, a = auth) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, a.key, te.encode(JSON.stringify(d))));
    return { v: 1, kdf: 'PBKDF2-SHA256', iter: KDF_ITER, salt: a.salt, iv: bytesToB64(iv), ct: bytesToB64(ct), updatedAt: d.updatedAt || null };
  }
  async function decryptBlob(blob, key) {
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64ToBytes(blob.iv) }, key, b64ToBytes(blob.ct));
    return normalize(JSON.parse(td.decode(pt)));
  }
  const isEnc = (o) => !!(o && typeof o === 'object' && o.ct && o.iv && o.salt);
  const serializeEnc = (blob) => `window.PROGRESS_ENC = ${JSON.stringify(blob)};\n`;
  function parseAny(text) {
    const t = String(text).trim();
    const m = t.match(/^window\.(PROGRESS_ENC|PROGRESS_DATA)\s*=\s*/);
    const obj = JSON.parse(m ? t.slice(m[0].length).replace(/;\s*$/, '') : t);
    return isEnc(obj) ? { enc: obj } : { plain: obj };
  }
  async function dataFromText(text) {
    const p = parseAny(text);
    if (!p.enc) return normalize(p.plain);
    if (p.enc.salt !== auth.salt) throw new Error('that file is locked with a different password');
    return decryptBlob(p.enc, auth.key);
  }
  const readLocal = () => { try { const raw = localStorage.getItem(LS_DATA); return raw ? JSON.parse(raw) : null; } catch (e) { return null; } };
  const exportRaw = async (k) => bytesToB64(new Uint8Array(await crypto.subtle.exportKey('raw', k)));
  async function rememberKey(remember) {
    const rec = JSON.stringify({ salt: auth.salt, k: await exportRaw(auth.key) });
    try { sessionStorage.setItem(LS_KEY, rec); if (remember) localStorage.setItem(LS_KEY, rec); else localStorage.removeItem(LS_KEY); } catch (e) { /* ignore */ }
  }
  async function storedKey() {
    let rec = null;
    try { rec = JSON.parse(sessionStorage.getItem(LS_KEY) || localStorage.getItem(LS_KEY) || 'null'); } catch (e) { /* ignore */ }
    if (!rec || !rec.k) return null;
    return { key: await crypto.subtle.importKey('raw', b64ToBytes(rec.k), { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']), salt: rec.salt };
  }
  let persistChain = Promise.resolve();
  function persist() {
    if (!auth) return persistChain;
    const snap = state, a = auth;
    persistChain = persistChain
      .then(async () => { localStorage.setItem(LS_DATA, JSON.stringify(await encryptState(snap, a))); })
      .catch(() => toast('This browser blocked saving — export a backup from Settings.', 'error'));
    return persistChain;
  }
  function commit(msg, undo) {
    state.updatedAt = new Date().toISOString();
    persist(); scheduleSync(); render();
    if (msg) toast(msg, 'ok', undo);
  }
  const findItem = (id) => state.items.find((x) => x.id === id);

  // ------------------------------------------------------------------ ui state
  const defaultFilter = () => ({ q: '', diff: 'all', conf: 'all', status: 'all', topic: 'all', sort: 'sr', dir: 1 });
  const ui = { f: { DSA: defaultFilter(), LLD: defaultFilter(), HLD: defaultFilter() }, chart: 'solved', rvTrack: 'all', rvAll: {}, open: new Set() };
  try {
    const saved = JSON.parse(localStorage.getItem(LS_UI) || '{}');
    if (saved.f) TRACKS.forEach((t) => { ui.f[t] = { ...defaultFilter(), ...(saved.f[t] || {}), q: '' }; });
    if (saved.chart) ui.chart = saved.chart;
    if (saved.rvTrack) ui.rvTrack = saved.rvTrack;
  } catch (e) { /* ignore */ }
  const saveUI = () => { try { localStorage.setItem(LS_UI, JSON.stringify({ f: ui.f, chart: ui.chart, rvTrack: ui.rvTrack })); } catch (e) { /* ignore */ } };

  // ------------------------------------------------------------------ derived numbers
  function derive(it, t) {
    const revs = it.revisions;
    const last = revs.length ? revs[revs.length - 1] : null;
    const base = last || it.solvedDate;
    let due = null, late = 0, status = it.attemptDate ? 'attempted' : 'todo';
    if (base) {
      const iv = state.settings.intervals;
      const days = (+iv[it.confidence] || +iv.Medium || 7) * (revs.length + 1);
      due = addDays(base, days);
      const d = diff(t, due);
      status = d < 0 ? 'overdue' : d === 0 ? 'today' : d <= 7 ? 'week' : 'upcoming';
      late = Math.max(0, -d);
    }
    return { revCount: revs.length, last, due, late, status };
  }

  function stats() {
    const t = today();
    const counter = { DSA: 0, LLD: 0, HLD: 0 };
    const rows = state.items.map((it) => ({ it, sr: ++counter[it.track], ...derive(it, t) }));
    const by = { DSA: [], LLD: [], HLD: [] };
    rows.forEach((r) => by[r.it.track].push(r));

    const act = new Map();
    const day = (d) => { let a = act.get(d); if (!a) { a = { s: 0, r: 0 }; act.set(d, a); } return a; };
    rows.forEach((r) => {
      if (r.it.solvedDate) day(r.it.solvedDate).s++;
      r.it.revisions.forEach((d) => { day(d).r++; });
    });
    const days = [...act.keys()].filter((d) => d <= t).sort();
    let streak = 0;
    for (let d = act.has(t) ? t : addDays(t, -1); act.has(d); d = addDays(d, -1)) streak++;
    let longest = 0, run = 0, prev = null;
    days.forEach((d) => { run = prev && diff(prev, d) === 1 ? run + 1 : 1; longest = Math.max(longest, run); prev = d; });
    let bestDay = 0;
    act.forEach((a) => { bestDay = Math.max(bestDay, a.s); });

    const months = [];
    if (days.length) for (let m = days[0].slice(0, 7); m <= t.slice(0, 7); m = nextMonth(m)) months.push(m);
    const monthly = months.slice(-12).map((k) => ({ k, DSA: 0, LLD: 0, HLD: 0, rDSA: 0, rLLD: 0, rHLD: 0 }));
    const mi = new Map(monthly.map((o, i) => [o.k, i]));
    rows.forEach((r) => {
      const k = r.it.track;
      if (r.it.solvedDate && mi.has(r.it.solvedDate.slice(0, 7))) monthly[mi.get(r.it.solvedDate.slice(0, 7))][k]++;
      r.it.revisions.forEach((d) => { if (mi.has(d.slice(0, 7))) monthly[mi.get(d.slice(0, 7))]['r' + k]++; });
    });

    return {
      t, rows, by, act, streak, longest, bestDay, monthly,
      revToday: rows.filter((r) => r.it.revisions.includes(t)).length,
      solvedToday: rows.filter((r) => r.it.solvedDate === t).length,
      lastActivity: days.length ? days[days.length - 1] : null,
    };
  }

  function summary(S, k) {
    const rs = S.by[k];
    const solved = rs.filter((r) => r.it.solvedDate);
    const goal = +state.settings.goals[k] || rs.length;
    const dues = rs.map((r) => r.due).filter(Boolean).sort();
    return {
      listed: rs.length, solved: solved.length, goal,
      pct: goal ? Math.round((solved.length / goal) * 100) : 0,
      hard: rs.filter((r) => r.it.difficulty === 'Hard').length,
      high: rs.filter((r) => r.it.confidence === 'High').length,
      low: rs.filter((r) => r.it.confidence === 'Low').length,
      revised: solved.filter((r) => r.revCount > 0).length,
      revs: rs.reduce((n, r) => n + r.revCount, 0),
      overdue: rs.filter((r) => r.status === 'overdue').length,
      dueToday: rs.filter((r) => r.status === 'today').length,
      dueSoon: rs.filter((r) => r.status === 'today' || r.status === 'week').length,
      avgTime: avg(solved.map((r) => r.it.timeMin).filter((v) => v != null)),
      nextDue: dues[0] || null,
    };
  }

  function topicStats(S, k) {
    const map = new Map();
    S.by[k].forEach((r) => {
      if (!r.it.solvedDate) return;
      r.it.topics.forEach((tg) => {
        const key = tg.toLowerCase();
        let o = map.get(key);
        if (!o) { o = { name: tg, key, n: 0, Easy: 0, Medium: 0, Hard: 0, high: 0, low: 0, times: [], overdue: 0 }; map.set(key, o); }
        o.n++;
        if (r.it.difficulty) o[r.it.difficulty]++;
        if (r.it.confidence === 'High') o.high++;
        if (r.it.confidence === 'Low') o.low++;
        if (r.it.timeMin != null) o.times.push(r.it.timeMin);
        if (r.status === 'overdue') o.overdue++;
      });
    });
    return [...map.values()].map((o) => ({ ...o, highPct: o.high / o.n, lowPct: o.low / o.n, avgT: avg(o.times) }))
      .sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
  }
  const strength = (o) => (o.n < 5 ? ['Few problems', 'todo'] : o.highPct >= 0.7 ? ['Strong', 'upcoming'] : o.highPct >= 0.45 ? ['Okay', 'week'] : ['Needs work', 'overdue']);

  // ------------------------------------------------------------------ small renderers
  const diffBadge = (d) => (d ? `<span class="badge-d d-${d}">${d}</span>` : '<span class="dim">—</span>');
  const confBadge = (c) => (c ? `<span class="badge-c c-${c}">${c}</span>` : '<span class="dim">—</span>');
  const statusBadge = (r) => `<span class="status st-${r.status}">${STATUS[r.status]}</span>`;
  const tagList = (tags, max) => {
    if (!tags.length) return '<span class="dim">—</span>';
    const shown = tags.slice(0, max).map((t) => `<span class="tag" data-action="filter-topic" data-topic="${esc(t.toLowerCase())}">${esc(t)}</span>`).join('');
    return `<div class="tags">${shown}${tags.length > max ? `<span class="tag more">+${tags.length - max}</span>` : ''}</div>`;
  };
  const nameLink = (it, cls = '') => (safeUrl(it.url)
    ? `<a class="pl ${cls}" href="${esc(safeUrl(it.url))}" target="_blank" rel="noopener">${esc(it.name)}${ic('ext')}</a>`
    : `<span class="${cls}">${esc(it.name)}</span>`);
  const ring = (p, c, inner = '') => `<div class="ring" style="--p:${Math.max(0, Math.min(100, p))};--c:${c}"><span>${inner}</span></div>`;

  // ------------------------------------------------------------------ dashboard
  function kpi(label, icon, color, value, sub, extra = '', style = '') {
    return `<div class="card kpi" style="--c:${color};${style}"><div class="kpi-top"><span class="kpi-ic">${ic(icon)}</span>${label}</div>
      <div class="kpi-val">${value}</div><div class="kpi-sub">${sub}</div>${extra}</div>`;
  }

  function heatmap(S, weeks = 26) {
    const t = S.t;
    const dow = (parseD(t).getDay() + 6) % 7; // Monday = 0
    const start = addDays(t, -(dow + 7 * (weeks - 1)));
    let cells = '', months = '', wSolved = 0, wRevs = 0, wDays = 0;
    for (let w = 0; w < weeks; w++) {
      const ws = addDays(start, w * 7);
      let label = '';
      for (let d = 0; d < 7; d++) { const ds = addDays(ws, d); if (ds.endsWith('-01')) label = MONTHS[+ds.slice(5, 7) - 1]; }
      months += `<span>${label}</span>`;
      for (let d = 0; d < 7; d++) {
        const ds = addDays(ws, d);
        const a = S.act.get(ds);
        const n = a ? a.s + a.r : 0;
        if (a && ds <= t) { wSolved += a.s; wRevs += a.r; wDays++; }
        const lv = n === 0 ? 0 : n <= 2 ? 1 : n <= 4 ? 2 : n <= 7 ? 3 : 4;
        const tip = `${fmt(ds)} · ${a ? `${a.s} solved, ${a.r} revised` : 'no activity'}`;
        cells += `<i class="hc l${lv}${ds > t ? ' fut' : ''}${ds === t ? ' now' : ''}" title="${tip}"></i>`;
      }
    }
    return `<div class="heat-wrap"><div class="heat">
        <div class="heat-months">${months}</div>
        <div class="heat-days"><span>Mon</span><span></span><span>Wed</span><span></span><span>Fri</span><span></span><span>Sun</span></div>
        <div class="heat-grid">${cells}</div></div></div>
      <div class="heat-stats" style="margin-top:14px">
        <span><b>${wSolved}</b>solved</span><span><b>${wRevs}</b>revisions</span><span><b>${wDays}</b>active days</span>
        <span><b>${S.streak}</b>day streak</span><span><b>${S.longest}</b>longest streak</span><span><b>${S.bestDay}</b>best day (solved)</span></div>`;
  }

  function monthlyChart(S) {
    const data = S.monthly;
    if (!data.length) return '<div class="empty"><b>No activity yet</b>Solve or revise a problem to see your monthly progress.</div>';
    const val = (o, k) => (ui.chart === 'solved' ? o[k] : o['r' + k]);
    const tot = (o) => TRACKS.reduce((n, k) => n + val(o, k), 0);
    const max = Math.max(1, ...data.map(tot));
    const cols = data.map((o) => {
      const T = tot(o);
      const segs = TRACKS.map((k) => (val(o, k) ? `<i style="height:${(val(o, k) / T) * 100}%;--c:var(--${k.toLowerCase()})"></i>` : '')).join('');
      const tip = `${monthLong(o.k)} — ${TRACKS.map((k) => `${k} ${val(o, k)}`).join(', ')}`;
      return `<div class="bcol" title="${tip}"><span class="v">${T || ''}</span><div class="stack${T ? '' : ' zero'}" style="height:${T ? Math.max(4, Math.round((T / max) * 210)) : 2}px">${segs}</div></div>`;
    }).join('');
    return `<div class="bars">${cols}</div><div class="bar-labels">${data.map((o) => `<span>${monthLabel(o.k)}</span>`).join('')}</div>`;
  }

  function donut(title, parts, center) {
    const total = parts.reduce((n, p) => n + p.n, 0);
    let acc = 0;
    const segs = parts.filter((p) => p.n).map((p) => { const a = (acc / total) * 100; acc += p.n; return `${p.c} ${a}% ${(acc / total) * 100}%`; });
    const g = total ? `conic-gradient(${segs.join(',')})` : 'conic-gradient(var(--line) 0 100%)';
    return `<div class="donut-box"><h3>${title}</h3><div class="donut" style="--g:${g}"><div><b>${total}</b><span>${center}</span></div></div>
      <div class="donut-legend">${parts.map((p) => `<div><i style="--c:${p.c}"></i>${p.name}<b>${p.n}</b><em>${pct(p.n, total)}%</em></div>`).join('')}</div></div>`;
  }

  function insights(S, sum) {
    const out = [];
    const d = sum.DSA, l = sum.LLD, h = sum.HLD;
    const total = d.solved + l.solved + h.solved;
    out.push(['trophy', 'var(--accent)', `You've solved <b>${total}</b> problems — <b>${d.solved}</b> DSA, <b>${l.solved}</b> LLD and <b>${h.solved}</b> HLD. The DSA sheet is <b>${d.pct}%</b> complete.`]);
    const ts = topicStats(S, 'DSA').filter((o) => o.n >= 5);
    if (ts.length) {
      const strong = ts.reduce((a, b) => (b.highPct > a.highPct ? b : a));
      const weak = ts.reduce((a, b) => (b.lowPct > a.lowPct ? b : a));
      out.push(['trend', 'var(--easy)', `Strongest DSA topic: <b>${esc(strong.name)}</b> — ${pct(strong.high, strong.n)}% of its ${strong.n} problems are at High confidence.`]);
      if (weak.low) out.push(['target', 'var(--hard)', `Needs the most work: <b>${esc(weak.name)}</b> — ${pct(weak.low, weak.n)}% of its problems are Low confidence. Revise these first.`]);
      const timed = ts.filter((o) => o.avgT != null);
      if (timed.length) {
        const slow = timed.reduce((a, b) => (b.avgT > a.avgT ? b : a));
        out.push(['clock', 'var(--medium)', `Slowest topic: <b>${esc(slow.name)}</b> at ~${Math.round(slow.avgT)} min per problem (your DSA average is ${r0(d.avgTime)} min).`]);
      }
    }
    if (S.monthly.length) {
      const tot = (o) => o.DSA + o.LLD + o.HLD;
      const best = S.monthly.reduce((a, b) => (tot(b) > tot(a) ? b : a));
      if (tot(best)) out.push(['calendar', 'var(--hld)', `Best month: <b>${monthLong(best.k)}</b> with ${tot(best)} problems solved. Best single day: ${S.bestDay} problems.`]);
    }
    const solvedAll = total, revisedAll = d.revised + l.revised + h.revised, overdue = d.overdue + l.overdue + h.overdue;
    out.push(['repeat', 'var(--lld)', `<b>${pct(revisedAll, solvedAll)}%</b> of solved problems have been revised at least once; <b>${overdue}</b> are overdue right now.`]);
    const goal = +state.settings.dailyRevisionGoal || 10;
    const next = d.solved >= d.goal
      ? `DSA sheet done ✓ — next: clear the revision queue (~${Math.ceil((overdue + d.dueToday) / goal)} days at ${goal}/day) and keep going on LLD (${l.solved}/${l.goal}).`
      : `${d.goal - d.solved} DSA problems left on the sheet — keep the streak going, and squeeze in ${goal} revisions a day.`;
    out.push(['flame', 'var(--warn)', `<b>Next focus:</b> ${next}`]);
    return out;
  }

  function viewDashboard(S) {
    const sum = Object.fromEntries(TRACKS.map((k) => [k, summary(S, k)]));
    const totalSolved = TRACKS.reduce((n, k) => n + sum[k].solved, 0);
    const totalRevs = TRACKS.reduce((n, k) => n + sum[k].revs, 0);
    const revised = TRACKS.reduce((n, k) => n + sum[k].revised, 0);
    const overdue = TRACKS.reduce((n, k) => n + sum[k].overdue, 0);
    const dueSoon = TRACKS.reduce((n, k) => n + sum[k].dueSoon, 0);
    const dueNow = overdue + TRACKS.reduce((n, k) => n + sum[k].dueToday, 0);
    const dsaTimed = S.by.DSA.filter((r) => r.it.solvedDate && r.it.timeMin != null);
    const avgBy = (x) => r0(avg(dsaTimed.filter((r) => r.it.difficulty === x).map((r) => r.it.timeMin)));
    const goal = +state.settings.dailyRevisionGoal || 10;

    const tracks = TRACKS.map((k) => {
      const s = sum[k], m = TMETA[k];
      return `<div class="track-row" data-go="#/${m.route}" style="--c:${m.color}">
        <div class="track-id"><span class="track-ic">${ic(m.icon)}</span><div><b>${k}</b><small>${m.full}</small></div></div>
        <div class="bar-area"><div class="bar"><span style="width:${Math.min(100, s.pct)}%"></span></div>
          <div class="track-meta"><span>Revised <b>${pct(s.revised, s.solved)}%</b></span><span>Overdue <b>${s.overdue}</b></span><span>Low conf. <b>${s.low}</b></span><span>Next due <b>${fmt(s.nextDue)}</b></span></div></div>
        <div class="track-count"><b>${s.solved}</b><span> / ${s.goal}</span><small>${s.pct}%</small></div></div>`;
    }).join('');

    const queue = S.rows.filter((r) => r.due && STATUS_ORD[r.status] <= 3)
      .sort((a, b) => a.due.localeCompare(b.due) || TRACKS.indexOf(a.it.track) - TRACKS.indexOf(b.it.track) || a.sr - b.sr).slice(0, 6);
    const queueHTML = queue.length ? queue.map((r) => `<div class="qrow">
        <span class="tp ${r.it.track}">${r.it.track}</span>
        <div style="min-width:0"><div class="qn">${esc(r.it.name)}</div><div class="qs">${esc(r.it.topics.slice(0, 2).join(', ') || '—')} · ${r.it.confidence || 'no'} confidence · ${r.last ? 'last ' + fmt(r.last) : 'never revised'}</div></div>
        <span class="late${r.late ? '' : ' ok'}">${r.late ? r.late + 'd late' : STATUS[r.status]}</span>
        <button class="icon-btn ok" data-action="revise" data-id="${esc(r.it.id)}" title="Log a revision for today">${ic('check')}</button></div>`).join('')
      : '<div class="empty"><b>All caught up</b>Nothing is due in the next 7 days.</div>';

    const ts = topicStats(S, 'DSA');
    const tmax = Math.max(1, ...ts.map((o) => o.n));
    const topicRows = ts.map((o) => {
      const [label, cls] = strength(o);
      const hp = Math.round(o.highPct * 100);
      const hc = hp >= 70 ? 'var(--easy)' : hp >= 45 ? 'var(--medium)' : 'var(--hard)';
      return `<tr class="row" data-action="topic" data-topic="${esc(o.key)}" title="Show ${esc(o.name)} problems">
        <td class="c-name"><b>${esc(o.name)}</b></td><td class="c-num"><b>${o.n}</b></td>
        <td style="width:20%;min-width:120px"><div class="bar" style="--c:var(--dsa)"><span style="width:${(o.n / tmax) * 100}%"></span></div></td>
        <td class="c-num c-time">${o.Easy}</td><td class="c-num c-time">${o.Medium}</td><td class="c-num c-time">${o.Hard}</td>
        <td class="c-num" style="color:${hc};font-weight:700">${hp}%</td><td class="c-num c-revs">${o.low}</td>
        <td class="c-num c-due">${o.avgT != null ? Math.round(o.avgT) + ' min' : '—'}</td><td class="c-num c-revs">${o.overdue}</td>
        <td><span class="status st-${cls}">${label}</span></td></tr>`;
    }).join('');

    const solvedRows = S.rows.filter((r) => r.it.solvedDate);
    const diffParts = DIFFS.map((x) => ({ name: x, n: solvedRows.filter((r) => r.it.difficulty === x).length, c: `var(--${x.toLowerCase()})` }));
    const confParts = [['High', 'var(--high)'], ['Medium', 'var(--medium)'], ['Low', 'var(--low)']]
      .map(([x, c]) => ({ name: x, n: solvedRows.filter((r) => r.it.confidence === x).length, c }));

    return `
    <section class="kpis">
      ${kpi('Solved', 'trophy', 'var(--accent)', totalSolved, `DSA ${sum.DSA.solved} · LLD ${sum.LLD.solved} · HLD ${sum.HLD.solved}`)}
      ${kpi('DSA sheet', 'code', 'var(--dsa)', `${sum.DSA.pct}<small>%</small>`, `${sum.DSA.solved} of ${sum.DSA.goal} done`, ring(sum.DSA.pct, 'var(--dsa)'), 'padding-right:84px')}
      ${kpi('Revisions', 'repeat', 'var(--lld)', totalRevs, `${pct(revised, totalSolved)}% of solved revised ≥ 1×`)}
      ${kpi('Backlog', 'alert', 'var(--hard)', overdue, `overdue · ${dueSoon} due ≤ 7 days`)}
      ${kpi('Avg DSA time', 'clock', 'var(--hld)', `${r0(sum.DSA.avgTime)}<small>min</small>`, `E ${avgBy('Easy')} · M ${avgBy('Medium')} · H ${avgBy('Hard')} min`)}
      ${kpi('Streak', 'flame', 'var(--medium)', `${S.streak}<small>${S.streak === 1 ? 'day' : 'days'}</small>`, `Longest ${S.longest} · ${S.act.size} active days`)}
    </section>

    <section class="grid g-21">
      <div class="card"><div class="card-head"><div><h2>Track progress</h2><p>Solved vs goal · click a track to open it</p></div></div>${tracks}</div>
      <div class="card today">
        <div class="card-head" style="margin:0"><div><h2>Today</h2><p>${WEEKDAYS[parseD(S.t).getDay()]}, ${fmt(S.t)}</p></div><a class="btn sm" href="#/revise">${ic('repeat')}Revise now</a></div>
        <div class="today-main">${ring(pct(S.revToday, goal), 'var(--accent)', `${S.revToday}<small>of ${goal}</small>`)}
          <div><h3>${S.revToday >= goal ? 'Daily revision goal reached ✓' : `${goal - S.revToday} revisions to go today`}</h3>
          <p>${dueNow ? `${plural(dueNow, 'problem')} waiting for revision — at ${goal}/day that's about ${plural(Math.ceil(dueNow / goal), 'day')} of work.` : 'Nothing is waiting for revision right now.'}</p></div></div>
        <div class="mini-stats"><div class="mini"><b>${S.solvedToday}</b><span>Solved today</span></div><div class="mini"><b>${dueNow}</b><span>Due now</span></div><div class="mini"><b>${S.streak}</b><span>Day streak</span></div></div>
      </div>
    </section>

    <section class="grid g-21">
      <div class="card"><div class="card-head"><div><h2>Activity</h2><p>Problems solved + revisions logged per day · last 26 weeks</p></div>
        <div class="heat-legend">Less <i class="hc"></i><i class="hc l1"></i><i class="hc l2"></i><i class="hc l3"></i><i class="hc l4"></i> More</div></div>${heatmap(S)}</div>
      <div class="card"><div class="card-head"><div><h2>Solved mix</h2><p>Across all ${solvedRows.length} solved problems</p></div></div>
        <div class="donuts">${donut('Difficulty', diffParts, 'solved')}${donut('Confidence', confParts, 'rated')}</div></div>
    </section>

    <section class="grid g-21">
      <div class="card"><div class="card-head"><div><h2>Monthly progress</h2><p>${ui.chart === 'solved' ? 'Problems solved' : 'Revisions logged'} per month, by track</p></div>
        <div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap"><div class="legend">${TRACKS.map((k) => `<span><i style="--c:var(--${k.toLowerCase()})"></i>${k}</span>`).join('')}</div>
        <div class="seg-toggle"><button class="${ui.chart === 'solved' ? 'on' : ''}" data-action="chart" data-mode="solved">Solved</button><button class="${ui.chart === 'revisions' ? 'on' : ''}" data-action="chart" data-mode="revisions">Revisions</button></div></div></div>
        ${monthlyChart(S)}</div>
      <div class="card"><div class="card-head"><div><h2>Revise next</h2><p>Most overdue first · ✓ logs a revision for today</p></div><a class="btn sm ghost" href="#/revise">Open queue →</a></div>
        <div class="qlist">${queueHTML}</div></div>
    </section>

    <section class="card"><div class="card-head"><div><h2>Where you stand</h2><p>Worked out from everything you've logged</p></div></div>
      <ul class="insights" style="grid-template-columns:repeat(auto-fit,minmax(340px,1fr))">${insights(S, sum).map(([i, c, h]) => `<li><span class="ins-ic" style="--c:${c}">${ic(i)}</span><span>${h}</span></li>`).join('')}</ul></section>

    <section class="card"><div class="card-head"><div><h2>DSA topic performance</h2><p>Sorted by problems solved · strength = share of High-confidence problems · click a topic to filter</p></div></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Topic</th><th>Solved</th><th>Volume</th><th class="c-time">Easy</th><th class="c-time">Med</th><th class="c-time">Hard</th><th>High conf</th><th class="c-revs">Low</th><th class="c-due">Avg time</th><th class="c-revs">Overdue</th><th>Strength</th></tr></thead>
      <tbody>${topicRows || '<tr><td colspan="11"><div class="empty">No solved DSA problems yet.</div></td></tr>'}</tbody></table></div></section>`;
  }

  // ------------------------------------------------------------------ track pages
  const SORTS = {
    sr: (r) => r.sr, name: (r) => r.it.name.toLowerCase(), diff: (r) => DORD[r.it.difficulty], solved: (r) => r.it.solvedDate,
    time: (r) => r.it.timeMin, conf: (r) => CORD[r.it.confidence], revs: (r) => r.revCount, due: (r) => r.due, status: (r) => STATUS_ORD[r.status],
  };

  function applyFilters(rows, f) {
    const q = f.q.trim().toLowerCase();
    const out = rows.filter((r) => {
      const it = r.it;
      if (f.diff !== 'all' && it.difficulty !== f.diff) return false;
      if (f.conf !== 'all' && it.confidence !== f.conf) return false;
      if (f.topic !== 'all' && !it.topics.some((t) => t.toLowerCase() === f.topic)) return false;
      switch (f.status) {
        case 'solved': if (!it.solvedDate) return false; break;
        case 'unsolved': if (it.solvedDate) return false; break;
        case 'due': if (!['overdue', 'today', 'week'].includes(r.status)) return false; break;
        case 'overdue': case 'upcoming': if (r.status !== f.status) return false; break;
        case 'never': if (!it.solvedDate || r.revCount) return false; break;
        default: break;
      }
      if (q && !`${it.name} ${it.topics.join(' ')} ${it.approach} ${it.mistakes}`.toLowerCase().includes(q)) return false;
      return true;
    });
    const fn = SORTS[f.sort] || SORTS.sr;
    return out.sort((a, b) => {
      const x = fn(a), y = fn(b);
      if (x == null && y == null) return a.sr - b.sr;
      if (x == null) return 1;
      if (y == null) return -1;
      return (x < y ? -1 : x > y ? 1 : a.sr - b.sr) * f.dir;
    });
  }

  function detailRow(r, k, ncols) {
    const it = r.it;
    const tl = [];
    if (it.attemptDate) tl.push(`<li style="--c:var(--hld)">Attempted <b>${fmt(it.attemptDate)}</b></li>`);
    if (it.solvedDate) tl.push(`<li style="--c:var(--easy)">Solved <b>${fmt(it.solvedDate)}</b>${it.timeMin != null ? ` · ${it.timeMin} min` : ''}</li>`);
    it.revisions.forEach((d, i) => tl.push(`<li style="--c:var(--lld)">Revision ${i + 1} · <b>${fmt(d)}</b></li>`));
    if (r.due) tl.push(`<li class="next">Next revision <b>${fmt(r.due)}</b>${r.late ? ` · ${r.late} days late` : ''}</li>`);
    const ref = safeUrl(it.refUrl);
    return `<tr class="detail"><td colspan="${ncols}"><div class="detail-box">
      ${it.topics.length ? `<div class="tags">${it.topics.map((t) => `<span class="tag" data-action="filter-topic" data-topic="${esc(t.toLowerCase())}">${esc(t)}</span>`).join('')}</div>` : ''}
      <div class="detail-grid">
        <section><h4>Approach</h4><div class="prose">${it.approach ? esc(it.approach) : '<span class="dim">No approach notes yet.</span>'}</div>
          ${ref ? `<a class="btn sm" style="margin-top:12px" href="${esc(ref)}" target="_blank" rel="noopener">${ic('ext')}Reference / solution</a>` : ''}</section>
        <section><h4>Mistakes made</h4><div class="prose">${it.mistakes ? esc(it.mistakes) : '<span class="dim">None recorded.</span>'}</div></section>
        <section><h4>Timeline</h4>${tl.length ? `<ul class="timeline">${tl.join('')}</ul>` : '<span class="dim">Not started yet.</span>'}</section>
      </div>
      <div class="detail-actions">
        <button class="btn sm" data-action="revise" data-id="${esc(it.id)}">${ic('check')}Log revision today</button>
        ${it.solvedDate ? '' : `<button class="btn sm" data-action="solve" data-id="${esc(it.id)}">${ic('trophy')}Mark solved today</button>`}
        <button class="btn sm" data-action="edit" data-id="${esc(it.id)}">${ic('edit')}Edit</button>
        <button class="btn sm danger" style="margin-left:auto" data-action="delete" data-id="${esc(it.id)}">${ic('trash')}Delete</button>
      </div></div></td></tr>`;
  }

  function trackList(k, S) {
    const m = TMETA[k], f = ui.f[k];
    const list = applyFilters(S.by[k], f);
    const cols = [['sr', '#', 'c-sr'], ['name', 'Problem', 'c-name'], [null, m.tagLabel, 'c-tags'], ['diff', 'Difficulty', ''], ['solved', 'Solved', 'c-solved'],
      ...(m.hasTime ? [['time', 'Time', 'c-time']] : []), ['conf', 'Confidence', ''], ['revs', 'Revs', 'c-revs'], ['due', 'Next revision', 'c-next'], [null, '', 'c-act']];
    const th = cols.map(([key, label, cls]) => `<th class="${cls}${key && f.sort === key ? ' sorted' : ''}"${key ? ` data-sort="${key}" title="Sort by ${label}"` : ''}>${label}${key && f.sort === key ? (f.dir > 0 ? ' ↑' : ' ↓') : ''}</th>`).join('');
    const body = list.length ? list.map((r) => {
      const it = r.it, open = ui.open.has(it.id);
      return `<tr class="row${open ? ' open' : ''}" data-id="${esc(it.id)}">
        <td class="c-sr">${r.sr}</td>
        <td class="c-name"><div class="nm">${nameLink(it)}</div></td>
        <td class="c-tags">${tagList(it.topics, k === 'HLD' ? 2 : 3)}</td>
        <td>${diffBadge(it.difficulty)}</td>
        <td class="c-date c-solved">${fmt(it.solvedDate)}</td>
        ${m.hasTime ? `<td class="c-num c-time">${it.timeMin != null ? it.timeMin + ' min' : '—'}</td>` : ''}
        <td>${confBadge(it.confidence)}</td>
        <td class="c-num c-revs">${r.revCount || '—'}</td>
        <td class="c-next">${statusBadge(r)}${r.due ? `<div class="sub">${fmt(r.due)}${r.late ? ` · ${r.late}d late` : ''}</div>` : ''}</td>
        <td class="c-act"><button class="icon-btn ok" data-action="revise" data-id="${esc(it.id)}" title="Log a revision for today">${ic('check')}</button><button class="icon-btn" data-action="edit" data-id="${esc(it.id)}" title="Edit">${ic('edit')}</button></td>
      </tr>${open ? detailRow(r, k, cols.length) : ''}`;
    }).join('') : `<tr><td colspan="${cols.length}"><div class="empty"><b>No problems match these filters</b>Clear the filters or log a new problem.</div></td></tr>`;
    return { html: `<table class="tbl trk"><thead><tr>${th}</tr></thead><tbody>${body}</tbody></table>`, note: `Showing ${list.length} of ${S.by[k].length}` };
  }

  function renderList(k) {
    const res = trackList(k, stats());
    const list = $('#list'), note = $('#count-note');
    if (list) list.innerHTML = res.html;
    if (note) note.textContent = res.note;
  }

  function viewTrack(k, S) {
    const m = TMETA[k], s = summary(S, k), f = ui.f[k];
    const tiles = [['Listed', s.listed], ['Solved', s.solved, 'acc'], ['Hard', s.hard],
      m.hasTime ? ['Avg time', s.avgTime != null ? `${Math.round(s.avgTime)}<small class="muted" style="font-size:13px"> min</small>` : '—'] : ['Low conf.', s.low],
      ['High conf.', s.high], ['Revised ≥ 1×', s.revised], ['Overdue', s.overdue, 'red'], ['Due ≤ 7 days', s.dueSoon]];
    const topics = [...new Map(S.by[k].flatMap((r) => r.it.topics).map((t) => [t.toLowerCase(), t])).entries()].sort((a, b) => a[1].localeCompare(b[1]));
    const sel = (name, opts, cur) => `<select data-filter="${name}" aria-label="${name}">${opts.map(([v, l]) => `<option value="${esc(v)}"${v === cur ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
    const links = k === 'DSA' ? state.settings.links.filter((l) => safeUrl(l.url)) : [];
    const res = trackList(k, S);
    return `
    <section class="tiles" style="--c:${m.color}">${tiles.map(([l, v, c]) => `<div class="tile ${c || ''}"><span>${l}</span><b>${v}</b></div>`).join('')}</section>
    ${links.length ? `<div class="links">${links.map((l) => `<a class="btn sm" href="${esc(safeUrl(l.url))}" target="_blank" rel="noopener">${ic('ext')}${esc(l.label || l.url)}</a>`).join('')}</div>` : ''}
    <section class="card">
      <div class="toolbar">
        <label class="search">${ic('search')}<input id="q" data-filter="q" placeholder="Search names, ${m.tagLabel.toLowerCase()}, notes…  ( / )" value="${esc(f.q)}" autocomplete="off"></label>
        ${sel('diff', [['all', 'All difficulties'], ...DIFFS.map((d) => [d, d])], f.diff)}
        ${sel('conf', [['all', 'All confidence'], ...CONFS.map((c) => [c, `${c} confidence`])], f.conf)}
        ${sel('status', [['all', 'All statuses'], ['solved', 'Solved'], ['unsolved', 'Not solved yet'], ['due', 'Due ≤ 7 days'], ['overdue', 'Overdue'], ['upcoming', 'Upcoming'], ['never', 'Never revised']], f.status)}
        ${sel('topic', [['all', `All ${m.tagLabel.toLowerCase()}`], ...topics], f.topic)}
        <button class="btn ghost sm" data-action="clear-filters">Clear</button>
        <span class="count-note" id="count-note">${res.note}</span>
      </div>
      <div class="tbl-wrap" id="list">${res.html}</div>
    </section>
    <div class="row-actions" style="margin-top:0"><button class="btn sm" data-action="new" data-track="${k}">${ic('plus')}Add ${k} problem</button>
      <button class="btn sm ghost" data-action="csv" data-track="${k}">${ic('download')}Export ${k} as CSV (Excel)</button></div>`;
  }

  // ------------------------------------------------------------------ revision queue
  function viewRevise(S) {
    const tf = ui.rvTrack;
    const goal = +state.settings.dailyRevisionGoal || 10;
    const inTrack = (r) => tf === 'all' || r.it.track === tf;
    const rows = S.rows.filter((r) => r.due && inTrack(r))
      .sort((a, b) => a.due.localeCompare(b.due) || TRACKS.indexOf(a.it.track) - TRACKS.indexOf(b.it.track) || a.sr - b.sr);
    const groups = ['overdue', 'today', 'week', 'upcoming'].map((g) => [g, rows.filter((r) => r.status === g)]);
    const cnt = Object.fromEntries(groups.map(([g, l]) => [g, l.length]));
    const never = rows.filter((r) => !r.revCount).length;
    const iv = state.settings.intervals;
    const item = (r) => {
      const it = r.it;
      return `<div class="rv-item">
        <div style="min-width:0"><div class="rv-title"><span class="tp ${it.track}">${it.track}</span>${nameLink(it, 'nm')}</div>
          <div class="rv-sub">${diffBadge(it.difficulty)}${confBadge(it.confidence)}<span>${r.last ? 'Last revised ' + fmt(r.last) : 'Never revised'}</span><span>${plural(r.revCount, 'revision')}</span>${it.topics.length ? `<span>${esc(it.topics.slice(0, 3).join(' · '))}${it.topics.length > 3 ? ' …' : ''}</span>` : ''}</div></div>
        <div class="rv-meta"><span class="status st-${r.status}">${r.late ? `${r.late} days late` : STATUS[r.status]}</span><span>Due ${fmt(r.due)}</span></div>
        <div class="rate"><span>How did it go?</span>
          <button class="r-Low" data-action="rate" data-id="${esc(it.id)}" data-conf="Low" title="Log today's revision · confidence Low · next in ${iv.Low * (r.revCount + 2)} days">Shaky</button>
          <button class="r-Medium" data-action="rate" data-id="${esc(it.id)}" data-conf="Medium" title="Log today's revision · confidence Medium · next in ${iv.Medium * (r.revCount + 2)} days">Okay</button>
          <button class="r-High" data-action="rate" data-id="${esc(it.id)}" data-conf="High" title="Log today's revision · confidence High · next in ${iv.High * (r.revCount + 2)} days">Nailed it</button>
          <button class="icon-btn" data-action="edit" data-id="${esc(it.id)}" title="Edit">${ic('edit')}</button></div></div>`;
    };
    const groupHTML = groups.filter(([, l]) => l.length).map(([g, l]) => {
      const limit = ui.rvAll[g] ? l.length : 20;
      return `<section class="rv-group"><div class="rv-head"><h2>${STATUS[g]}</h2><span class="status st-${g}">${l.length}</span></div>
        ${l.slice(0, limit).map(item).join('')}
        ${l.length > limit ? `<button class="btn ghost" data-action="rv-all" data-g="${g}">Show all ${l.length}</button>` : ''}</section>`;
    }).join('') || '<div class="card empty"><b>Nothing to revise</b>Solve a problem and it will show up here when it is due.</div>';
    const trackBtn = (t, label) => {
      const n = S.rows.filter((r) => r.due && (t === 'all' || r.it.track === t) && STATUS_ORD[r.status] <= 2).length;
      return `<button class="${tf === t ? 'on' : ''}" data-action="rv-track" data-t="${t}">${label}${n ? ` · ${n}` : ''}</button>`;
    };
    return `
    <section class="tiles" style="grid-template-columns:repeat(6,minmax(0,1fr))">
      <div class="tile red"><span>Overdue</span><b>${cnt.overdue}</b></div>
      <div class="tile"><span>Due today</span><b>${cnt.today}</b></div>
      <div class="tile"><span>This week</span><b>${cnt.week}</b></div>
      <div class="tile"><span>Upcoming</span><b>${cnt.upcoming}</b></div>
      <div class="tile acc" style="--c:var(--accent)"><span>Revised today</span><b>${S.revToday}<small class="muted" style="font-size:13px"> / ${goal}</small></b></div>
      <div class="tile"><span>Never revised</span><b>${never}</b></div>
    </section>
    <div class="card" style="display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap;padding:14px 18px">
      <div class="seg-toggle">${trackBtn('all', 'All tracks')}${TRACKS.map((t) => trackBtn(t, t)).join('')}</div>
      <p class="help" style="margin:0;max-width:640px">Rate each revision: your confidence is updated and the next due date moves out to <b>base days × (revisions + 1)</b> — Low ${iv.Low}d, Medium ${iv.Medium}d, High ${iv.High}d. Change these in Settings.</p>
    </div>
    ${groupHTML}`;
  }

  // ------------------------------------------------------------------ settings
  function viewSettings(S) {
    const s = state.settings, c = ghCfg();
    return `<div class="settings">
      <section class="card"><div class="card-head"><div><h2>Revision schedule</h2><p>Next due = last revision (or solved date) + base days × (revisions done + 1)</p></div></div>
        <div class="form-grid">${CONFS.map((k) => `<label class="lbl"><span>${k} confidence <em>· base days</em></span><input type="number" min="1" max="365" data-set="intervals.${k}" value="${esc(s.intervals[k])}"></label>`).join('')}</div>
        <div class="form-grid" style="margin-top:12px"><label class="lbl">Daily revision goal<input type="number" min="1" max="500" data-set="dailyRevisionGoal" value="${esc(s.dailyRevisionGoal)}"></label></div></section>

      <section class="card"><div class="card-head"><div><h2>Goals</h2><p>Target number of problems per track — leave LLD / HLD empty to use the number listed</p></div></div>
        <div class="form-grid">${TRACKS.map((k) => `<label class="lbl">${k} goal<input type="number" min="1" data-set="goals.${k}" value="${esc(s.goals[k] ?? '')}" placeholder="${S.by[k].length} listed"></label>`).join('')}</div></section>

      <section class="card"><div class="card-head"><div><h2>GitHub sync</h2><p>Optional — saves every change to <code>${esc(c.path)}</code> in your repo so all devices stay in sync</p></div></div>
        <div class="form-grid">
          <label class="lbl">Owner (username)<input data-gh="owner" value="${esc(c.owner)}" placeholder="your-github-username"></label>
          <label class="lbl">Repository<input data-gh="repo" value="${esc(c.repo)}" placeholder="prep-tracker"></label>
          <label class="lbl">Branch<input data-gh="branch" value="${esc(c.branch)}" placeholder="main"></label>
        </div>
        <div class="form-grid" style="margin-top:12px;grid-template-columns:2fr 1fr">
          <label class="lbl"><span>Fine-grained access token <em>(stays in this browser only)</em></span><input type="password" data-gh="token" value="${esc(c.token)}" placeholder="github_pat_…" autocomplete="off"></label>
          <label class="lbl">Data file path<input data-gh="path" value="${esc(c.path)}"></label>
        </div>
        <label class="check" style="margin-top:12px"><input type="checkbox" data-gh="auto"${c.auto ? ' checked' : ''}> Auto-sync after every change</label>
        <div class="row-actions">
          <button class="btn primary sm" data-action="gh-save">${ic('check')}Save & test</button>
          <button class="btn sm" data-action="gh-push">${ic('upload')}Push now</button>
          <button class="btn sm" data-action="gh-pull">${ic('download')}Pull from GitHub</button>
          ${c.token ? `<button class="btn sm ghost" data-action="gh-forget">Forget token</button>` : ''}
        </div>
        <div class="help" style="margin-top:14px">How to get a token:<ol>
          <li>GitHub → Settings → Developer settings → <b>Fine-grained tokens</b> → Generate new token.</li>
          <li>Repository access: <b>Only select repositories</b> → pick this site's repo.</li>
          <li>Repository permissions → <b>Contents: Read and write</b>. Generate, copy, paste above.</li></ol>
          On load the site pulls straight from GitHub, so your phone and laptop always show the latest data. Without a token everything is still saved in this browser.</div></section>

      <section class="card"><div class="card-head"><div><h2>Password & lock</h2><p>Your data is encrypted with this password (AES-256) everywhere it is stored or published</p></div>
        <button class="btn sm" data-action="lock">${ic('x')}Lock now</button></div>
        <div class="form-grid">
          <label class="lbl">Current password<input type="password" data-pw="cur" autocomplete="current-password"></label>
          <label class="lbl">New password<input type="password" data-pw="new" autocomplete="new-password"></label>
          <label class="lbl">Confirm new<input type="password" data-pw="new2" autocomplete="new-password"></label>
        </div>
        <div class="row-actions"><button class="btn sm primary" data-action="change-pw">${ic('check')}Change password</button></div>
        <p class="help" style="margin-top:12px">After changing it, the new locked file is pushed automatically if GitHub sync is on — otherwise use <b>Download data/progress.js</b> below and push it. Note: the <b>.json backup</b> and CSV exports are <b>not</b> encrypted; keep them private.</p></section>

      <section class="card"><div class="card-head"><div><h2>Quick links</h2><p>Shown on the DSA page</p></div><button class="btn sm" data-action="link-add">${ic('plus')}Add link</button></div>
        ${s.links.map((l, i) => `<div class="link-row"><input class="field" data-link="${i}" data-k="label" value="${esc(l.label)}" placeholder="Label">
          <input class="field" data-link="${i}" data-k="url" value="${esc(l.url)}" placeholder="https://…"><button class="icon-btn" data-action="link-rm" data-i="${i}" title="Remove link">${ic('trash')}</button></div>`).join('') || '<p class="help">No links yet.</p>'}</section>

      <section class="card"><div class="card-head"><div><h2>Backup & export</h2><p>${state.items.length} problems · last change ${state.updatedAt ? fmt(toISO(new Date(state.updatedAt))) + ' ' + new Date(state.updatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '—'}</p></div></div>
        <div class="row-actions" style="margin-top:0">
          <button class="btn sm" data-action="export-json">${ic('download')}Backup (.json)</button>
          <button class="btn sm" data-action="export-js">${ic('download')}Download data/progress.js</button>
          <button class="btn sm" data-action="import">${ic('upload')}Import backup</button>
          <input type="file" id="import-file" accept=".json,.js,application/json,text/javascript" hidden>
        </div>
        <div class="row-actions">${TRACKS.map((k) => `<button class="btn sm ghost" data-action="csv" data-track="${k}">${ic('download')}${k} CSV</button>`).join('')}</div>
        <p class="help" style="margin-top:14px">No token? Download <code>data/progress.js</code> and upload it to your repo to update the site for every device. <b>Reset</b> replaces this browser's copy with the one published on the site.</p>
        <div class="row-actions"><button class="btn sm danger" data-action="reset">Reset to site data</button></div></section>
    </div>`;
  }

  // ------------------------------------------------------------------ GitHub sync
  function guessRepo() {
    const h = location.hostname;
    if (!h.endsWith('.github.io')) return {};
    const owner = h.split('.')[0];
    const seg = location.pathname.split('/').filter(Boolean)[0];
    return { owner, repo: seg && !seg.includes('.') ? seg : `${owner}.github.io` };
  }
  function ghCfg() {
    let c = {};
    try { c = JSON.parse(localStorage.getItem(LS_GH) || '{}'); } catch (e) { /* ignore */ }
    const g = guessRepo();
    return { owner: c.owner || g.owner || '', repo: c.repo || g.repo || '', branch: c.branch || 'main', path: c.path || 'data/progress.js', token: c.token || '', auto: c.auto !== false };
  }
  const ghReady = (c) => !!(c.owner && c.repo && c.token);
  const enc = encodeURIComponent;
  const ghHeaders = (c) => ({ Accept: 'application/vnd.github+json', Authorization: `Bearer ${c.token}`, 'X-GitHub-Api-Version': '2022-11-28' });
  const b64e = (s) => { const b = new TextEncoder().encode(s); let bin = ''; for (let i = 0; i < b.length; i += 0x8000) bin += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(bin); };
  const b64d = (s) => new TextDecoder().decode(Uint8Array.from(atob(String(s).replace(/\s/g, '')), (ch) => ch.charCodeAt(0)));

  async function ghContents(c, method, body) {
    const url = `https://api.github.com/repos/${enc(c.owner)}/${enc(c.repo)}/contents/${c.path.split('/').map(enc).join('/')}${method === 'GET' ? `?ref=${enc(c.branch)}` : ''}`;
    const res = await fetch(url, { method, cache: 'no-store', headers: { ...ghHeaders(c), ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined });
    if (method === 'GET' && res.status === 404) return null;
    if (!res.ok) { let m = String(res.status); try { m += ' · ' + (await res.json()).message; } catch (e) { /* ignore */ } throw new Error(m); }
    return res.json();
  }
  async function ghPull() {
    const c = ghCfg();
    const j = await ghContents(c, 'GET');
    if (!j) return { missing: true };
    const p = parseAny(b64d(j.content));
    if (p.enc && p.enc.salt !== auth.salt) throw new Error('the GitHub copy uses a different password — lock, then unlock with that password');
    return { sha: j.sha, data: p.enc ? await decryptBlob(p.enc, auth.key) : normalize(p.plain) };
  }

  let sync = { mode: 'idle', msg: '', at: null };
  let syncTimer = null, pushing = false, pushAgain = false;
  function setSync(mode, msg = '') { sync = { mode, msg, at: new Date() }; renderSync(); }
  function scheduleSync() {
    const c = ghCfg();
    if (!ghReady(c) || !c.auto) return;
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => { syncTimer = null; ghPush(false); }, 2500);
  }
  async function ghPush(manual) {
    const c = ghCfg();
    if (!ghReady(c)) { if (manual) toast('Add your GitHub owner, repo and token first.', 'error'); return; }
    if (pushing) { pushAgain = true; return; }
    pushing = true; setSync('syncing');
    try {
      const remote = await ghPull();
      if (remote.data && (remote.data.updatedAt || '') > (state.updatedAt || '')) {
        state = remote.data; persist(); render(); setSync('ok');
        toast('GitHub had newer progress (from another device) — loaded it instead of overwriting.', 'warn');
        return;
      }
      await ghContents(c, 'PUT', {
        message: `Update progress · ${fmt(today())} ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`,
        content: b64e(serializeEnc(await encryptState(state))), branch: c.branch, ...(remote.sha ? { sha: remote.sha } : {}),
      });
      setSync('ok');
      if (manual) toast('Pushed to GitHub ✓');
    } catch (err) {
      setSync('error', err.message);
      if (manual) toast(`GitHub sync failed: ${esc(err.message)}`, 'error');
    } finally {
      pushing = false;
      if (pushAgain) { pushAgain = false; ghPush(false); }
    }
  }
  function renderSync() {
    const el = $('#sync-pill');
    if (!el) return;
    const c = ghCfg();
    let cls = '', title, sub;
    if (!ghReady(c)) { title = 'Saved in this browser'; sub = 'Set up GitHub sync →'; }
    else if (sync.mode === 'syncing') { cls = 'syncing'; title = 'Syncing…'; sub = `${c.owner}/${c.repo}`; }
    else if (sync.mode === 'error') { cls = 'error'; title = 'Sync failed'; sub = 'Click to retry'; }
    else if (sync.mode === 'ok') { cls = 'ok'; title = 'Synced with GitHub'; sub = sync.at.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); }
    else { cls = 'ok'; title = 'GitHub sync on'; sub = c.auto ? 'Auto-sync' : 'Manual push'; }
    el.className = `sync-pill ${cls}`;
    el.title = sync.msg || title;
    el.innerHTML = `<i></i><span><b>${title}</b>${esc(sub)}</span>`;
  }
  function readGhForm() {
    const c = ghCfg();
    $$('[data-gh]').forEach((el) => { c[el.dataset.gh] = el.type === 'checkbox' ? el.checked : el.value.trim(); });
    return c;
  }
  async function ghSaveTest() {
    const c = readGhForm();
    try { localStorage.setItem(LS_GH, JSON.stringify(c)); } catch (e) { /* ignore */ }
    renderSync();
    if (!ghReady(c)) { toast('Saved. Add owner, repo and token to turn sync on.', 'warn'); return; }
    try {
      const res = await fetch(`https://api.github.com/repos/${enc(c.owner)}/${enc(c.repo)}`, { headers: ghHeaders(c), cache: 'no-store' });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(`${res.status} · ${j.message || 'request failed'}`);
      setSync('ok');
      toast(`Connected to ${esc(j.full_name || c.repo)} ✓ — changes will sync ${c.auto ? 'automatically' : 'when you press Push'}.`);
    } catch (err) { setSync('error', err.message); toast(`GitHub: ${esc(err.message)}`, 'error'); }
  }
  async function ghPullManual() {
    const c = readGhForm();
    if (!ghReady(c)) { toast('Add your GitHub owner, repo and token first.', 'error'); return; }
    try {
      setSync('syncing');
      const res = await ghPull();
      if (res.missing) { setSync('ok'); toast(`${esc(c.path)} isn't in the repo yet — press Push now to create it.`, 'warn'); return; }
      if (!confirm(`Replace this browser's data with the ${res.data.items.length} problems stored on GitHub?`)) { setSync('ok'); return; }
      const prev = state; state = res.data; persist(); render(); setSync('ok');
      toast('Loaded progress from GitHub', 'ok', () => { state = prev; commit('Restored previous data'); });
    } catch (err) { setSync('error', err.message); toast(`GitHub: ${esc(err.message)}`, 'error'); }
  }

  // ------------------------------------------------------------------ files
  function download(name, text, type) {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function exportCSV(k) {
    const cell = (v) => { const s = v == null ? '' : String(v); return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const d = (s) => (s ? fmt(s) : '');
    const head = ['S/R', 'Problem', 'Link', TMETA[k].tagLabel, 'Difficulty', 'Attempt Date', 'Solved Date', 'Solved Time (min)', 'Approach', 'Reference Link', 'Mistakes', 'Revision Dates', 'Confidence', 'Revision Count', 'Last Revised', 'Next Revision Due', 'Status'];
    const lines = stats().by[k].map((r) => {
      const it = r.it;
      return [r.sr, it.name, it.url, it.topics.join(', '), it.difficulty, d(it.attemptDate), d(it.solvedDate), it.timeMin, it.approach, it.refUrl, it.mistakes,
        it.revisions.map(fmt).join('\n'), it.confidence, r.revCount, d(r.last), d(r.due), STATUS[r.status]];
    });
    download(`atharva-${k.toLowerCase()}-${today()}.csv`, '﻿' + [head, ...lines].map((l) => l.map(cell).join(',')).join('\r\n'), 'text/csv;charset=utf-8');
  }
  function importFile(file) {
    if (!file) return;
    const rd = new FileReader();
    rd.onload = async () => {
      try {
        const d = await dataFromText(rd.result);
        if (!confirm(`Replace your current data (${state.items.length} problems) with ${d.items.length} problems from “${file.name}”?`)) return;
        const prev = state; state = d;
        commit(`Imported ${d.items.length} problems`, () => { state = prev; commit('Import undone'); });
      } catch (err) { toast(`Couldn't read that file: ${esc(err.message)}`, 'error'); }
    };
    rd.readAsText(file);
  }

  // ------------------------------------------------------------------ modal form
  let draft = null;
  const closeModal = () => { $('#modal-root').innerHTML = ''; draft = null; };
  function openForm(id, track) {
    const it = id ? findItem(id) : null;
    if (id && !it) return;
    const t = today();
    draft = it ? clone(it) : {
      id: null, track: TRACKS.includes(track) ? track : currentTrack() || 'DSA', name: '', url: '', topics: [], difficulty: 'Medium',
      attemptDate: t, solvedDate: t, timeMin: null, approach: '', refUrl: '', mistakes: '', revisions: [], confidence: 'Medium',
    };
    const d = draft;
    const radios = (name, vals, cur, none) => `<div class="seg">${none ? `<label><input type="radio" name="${name}" value=""${cur ? '' : ' checked'}><span>—</span></label>` : ''}${vals.map((v) => `<label><input type="radio" name="${name}" value="${v}"${cur === v ? ' checked' : ''}><span class="v-${v}">${v}</span></label>`).join('')}</div>`;
    const dateField = (name, label) => `<div class="lbl"><span>${label}</span><div class="with-btn">${dmyInput(name, d[name])}
      <button type="button" class="btn sm" data-action="set-today" data-for="${name}">Today</button><button type="button" class="icon-btn" data-action="clear-date" data-for="${name}" title="Clear date">${ic('x')}</button></div></div>`;
    $('#modal-root').innerHTML = `<div class="modal-back" data-action="modal-back">
      <form class="modal" id="item-form" autocomplete="off" novalidate>
        <div class="modal-head"><h2>${d.id ? 'Edit problem' : 'Log a problem'}</h2><button type="button" class="icon-btn" data-action="close" aria-label="Close">${ic('x')}</button></div>
        <div class="modal-body form">
          <div class="lbl">Track ${radios('track', TRACKS, d.track)}</div>
          <div class="f-row">
            <label class="lbl">Problem name *<input name="name" value="${esc(d.name)}" placeholder="e.g. Median of 2 sorted arrays"></label>
            <label class="lbl">Problem link<input name="url" type="url" value="${esc(d.url)}" placeholder="https://leetcode.com/problems/…"></label>
          </div>
          <div class="lbl"><span id="tag-label">${TMETA[d.track].tagLabel}</span>
            <div class="chip-input"><span id="tag-chips" style="display:contents"></span><input id="tag-in" list="tag-sugg" placeholder="Type, then Enter or comma"></div>
            <datalist id="tag-sugg"></datalist></div>
          <div class="f-row"><div class="lbl">Difficulty ${radios('difficulty', DIFFS, d.difficulty, true)}</div><div class="lbl">Confidence ${radios('confidence', CONFS, d.confidence, true)}</div></div>
          <div class="f-row three">${dateField('attemptDate', 'Attempt date')}${dateField('solvedDate', 'Solved date')}
            <label class="lbl"><span>Solved time <em>(minutes)</em></span><input type="number" min="0" step="1" name="timeMin" value="${d.timeMin ?? ''}" placeholder="e.g. 25"></label></div>
          <label class="lbl">Approach<textarea name="approach" rows="5" placeholder="Brute force → optimal, complexity, key intuition…">${esc(d.approach)}</textarea></label>
          <label class="lbl">Reference / solution link<input name="refUrl" type="url" value="${esc(d.refUrl)}" placeholder="Video or article (optional)"></label>
          <label class="lbl">Mistakes made<textarea name="mistakes" rows="3" placeholder="Edge cases missed, wrong assumptions…">${esc(d.mistakes)}</textarea></label>
          <div class="lbl">Revision dates <div class="chip-input" id="rev-box"></div>
            <div class="with-btn" style="max-width:400px">${dmyInput('revIn', null, 'rev-in')}<button type="button" class="btn sm" data-action="rev-add">Add date</button><button type="button" class="btn sm" data-action="rev-today">+ Today</button></div></div>
        </div>
        <div class="modal-foot"><div>${d.id ? `<button type="button" class="btn danger" data-action="delete" data-id="${esc(d.id)}">${ic('trash')}Delete</button>` : ''}</div>
          <div style="display:flex;gap:8px"><button type="button" class="btn ghost" data-action="close">Cancel</button><button type="submit" class="btn primary">${ic('check')}${d.id ? 'Save changes' : 'Add problem'}</button></div></div>
      </form></div>`;
    renderTagChips(); renderSuggestions(); renderRevChips();
    setTimeout(() => { const n = $('#item-form input[name="name"]'); if (n) n.focus(); }, 30);
  }
  function renderTagChips() {
    const el = $('#tag-chips');
    if (el) el.innerHTML = draft.topics.map((t, i) => `<span class="chip">${esc(t)}<button type="button" data-action="rm-tag" data-i="${i}" aria-label="Remove ${esc(t)}">×</button></span>`).join('');
  }
  function renderSuggestions() {
    const el = $('#tag-sugg');
    if (!el) return;
    const all = [...new Map(state.items.filter((x) => x.track === draft.track).flatMap((x) => x.topics).map((t) => [t.toLowerCase(), t])).values()].sort();
    el.innerHTML = all.map((t) => `<option value="${esc(t)}"></option>`).join('');
  }
  function renderRevChips() {
    const el = $('#rev-box');
    if (el) el.innerHTML = draft.revisions.length ? draft.revisions.map((d, i) => `<span class="chip">${fmt(d)}<button type="button" data-action="rev-rm" data-i="${i}" aria-label="Remove revision">×</button></span>`).join('') : '<span class="dim" style="padding:0 6px;font-weight:400">No revisions logged yet</span>';
  }
  function addTags(str) {
    String(str).split(',').map((s) => s.trim()).filter(Boolean).forEach((t) => {
      if (!draft.topics.some((x) => x.toLowerCase() === t.toLowerCase())) draft.topics.push(t);
    });
    renderTagChips();
  }
  function addRevision(date) {
    if (!validISO(date)) { toast('Enter the revision date as dd/mm/yyyy', 'warn'); return; }
    if (!draft.revisions.includes(date)) draft.revisions = [...draft.revisions, date].sort();
    renderRevChips();
  }
  function addRevisionFromInput() {
    const el = $('#rev-in');
    if (!el) return;
    const iso = parseDMY(el.value);
    if (!iso) { toast(`Type the revision date as dd/mm/yyyy (e.g. ${fmt(today())})`, 'warn'); el.focus(); return; }
    addRevision(iso); el.value = '';
  }
  function submitForm(form) {
    const fd = new FormData(form);
    const pending = $('#tag-in');
    if (pending && pending.value.trim()) { addTags(pending.value); pending.value = ''; }
    const name = String(fd.get('name') || '').trim();
    if (!name) { toast('Give the problem a name', 'error'); form.elements.name.focus(); return; }
    const dates = {};
    for (const [key, label] of [['attemptDate', 'Attempt date'], ['solvedDate', 'Solved date']]) {
      const raw = String(fd.get(key) || '').trim();
      if (!raw) { dates[key] = null; continue; }
      dates[key] = parseDMY(raw);
      if (!dates[key]) { toast(`${label}: use dd/mm/yyyy (e.g. ${fmt(today())})`, 'error'); form.elements[key].focus(); return; }
    }
    const t = String(fd.get('timeMin') || '').trim();
    const d = Object.assign(draft, {
      track: fd.get('track') || draft.track, name, url: String(fd.get('url') || '').trim(),
      difficulty: fd.get('difficulty') || null, confidence: fd.get('confidence') || null,
      attemptDate: dates.attemptDate, solvedDate: dates.solvedDate,
      timeMin: t === '' || !Number.isFinite(+t) ? null : Math.max(0, Math.round(+t)),
      approach: String(fd.get('approach') || '').trim(), refUrl: String(fd.get('refUrl') || '').trim(), mistakes: String(fd.get('mistakes') || '').trim(),
    });
    const isNew = !d.id;
    if (isNew) { d.id = uid(); state.items.push(d); }
    else { const i = state.items.findIndex((x) => x.id === d.id); if (i >= 0) state.items[i] = d; else state.items.push(d); }
    closeModal();
    commit(`${isNew ? 'Added' : 'Saved'} “${esc(name)}”`);
  }

  // ------------------------------------------------------------------ actions
  function restoreItem(before) {
    const i = state.items.findIndex((x) => x.id === before.id);
    if (i >= 0) state.items[i] = before; else state.items.push(before);
    commit('Undone');
  }
  function logRevision(id, conf) {
    const it = findItem(id);
    if (!it) return;
    const t = today(), before = clone(it), already = it.revisions.includes(t);
    if (already && (!conf || conf === it.confidence)) { toast('A revision is already logged for today', 'warn'); return; }
    if (!already) it.revisions = [...it.revisions, t].sort();
    if (conf) it.confidence = conf;
    commit(`Revision logged · “${esc(it.name)}”${conf ? ` · ${conf} confidence` : ''}`, () => restoreItem(before));
  }
  function markSolved(id) {
    const it = findItem(id);
    if (!it) return;
    const before = clone(it);
    it.solvedDate = today();
    if (!it.attemptDate) it.attemptDate = it.solvedDate;
    commit(`Marked “${esc(it.name)}” solved`, () => restoreItem(before));
  }
  function deleteItem(id) {
    const i = state.items.findIndex((x) => x.id === id);
    if (i < 0) return;
    const it = state.items[i];
    if (!confirm(`Delete “${it.name}”? You can undo straight after.`)) return;
    state.items.splice(i, 1); ui.open.delete(id); closeModal();
    commit(`Deleted “${esc(it.name)}”`, () => { state.items.splice(Math.min(i, state.items.length), 0, it); commit('Restored'); });
  }

  function handleAction(a, e) {
    const act = a.dataset.action, id = a.dataset.id, k = currentTrack();
    switch (act) {
      case 'new': openForm(null, a.dataset.track); break;
      case 'edit': openForm(id); break;
      case 'close': case 'modal-back': closeModal(); break;
      case 'revise': logRevision(id); break;
      case 'rate': logRevision(id, a.dataset.conf); break;
      case 'solve': markSolved(id); break;
      case 'delete': deleteItem(id); break;
      case 'clear-filters': if (k) { ui.f[k] = defaultFilter(); saveUI(); render(); } break;
      case 'filter-topic':
        e.stopPropagation();
        if (k) { ui.f[k] = { ...ui.f[k], topic: a.dataset.topic }; saveUI(); render(); }
        break;
      case 'topic': ui.f.DSA = { ...defaultFilter(), topic: a.dataset.topic }; saveUI(); location.hash = '#/dsa'; break;
      case 'chart': ui.chart = a.dataset.mode; saveUI(); render(); break;
      case 'rv-track': ui.rvTrack = a.dataset.t; saveUI(); render(); break;
      case 'rv-all': ui.rvAll[a.dataset.g] = true; render(); break;
      case 'set-today': { const el = formField(a.dataset.for); if (el) el.value = fmt(today()); break; }
      case 'clear-date': { const el = formField(a.dataset.for); if (el) el.value = ''; break; }
      case 'pick-date': {
        const p = $(`#item-form [data-picker-for="${a.dataset.for}"]`), el = formField(a.dataset.for);
        if (!p || !el) break;
        p.value = parseDMY(el.value) || today();
        try { p.showPicker(); } catch (err) { p.focus(); p.click(); }
        break;
      }
      case 'rm-tag': draft.topics.splice(+a.dataset.i, 1); renderTagChips(); break;
      case 'rev-add': addRevisionFromInput(); break;
      case 'rev-today': addRevision(today()); break;
      case 'rev-rm': draft.revisions.splice(+a.dataset.i, 1); renderRevChips(); break;
      case 'link-add': state.settings.links.push({ label: 'New link', url: 'https://' }); commit(); break;
      case 'link-rm': state.settings.links.splice(+a.dataset.i, 1); commit('Link removed'); break;
      case 'gh-save': ghSaveTest(); break;
      case 'gh-push': { const c = readGhForm(); try { localStorage.setItem(LS_GH, JSON.stringify(c)); } catch (err) { /* ignore */ } ghPush(true); break; }
      case 'gh-pull': ghPullManual(); break;
      case 'gh-forget': { const c = ghCfg(); c.token = ''; try { localStorage.setItem(LS_GH, JSON.stringify(c)); } catch (err) { /* ignore */ } setSync('idle'); render(); toast('Token removed from this browser'); break; }
      case 'sync-click': if (ghReady(ghCfg())) ghPush(true); else location.hash = '#/settings'; break;
      case 'export-json': download(`atharva-prep-backup-${today()}.json`, JSON.stringify(state, null, 1), 'application/json'); break;
      case 'export-js': encryptState(state).then((b) => download('progress.js', serializeEnc(b), 'text/javascript')); break;
      case 'lock': lockNow(); break;
      case 'change-pw': changePassword(); break;
      case 'import': $('#import-file').click(); break;
      case 'csv': exportCSV(a.dataset.track); break;
      case 'reset':
        if (!fileBlob && !filePlain) { toast('No data/progress.js found on the site', 'error'); break; }
        if (fileBlob && fileBlob.salt !== auth.salt) { toast('The published file uses a different password', 'error'); break; }
        if (confirm('Replace the data in this browser with the copy published in data/progress.js?')) {
          (fileBlob ? decryptBlob(fileBlob, auth.key) : Promise.resolve(normalize(filePlain))).then((d) => {
            const prev = state; state = d;
            commit('Reset to the published data', () => { state = prev; commit('Restored'); });
          }).catch(() => toast('Could not decrypt the published file', 'error'));
        }
        break;
      default: break;
    }
  }

  // ------------------------------------------------------------------ routing & render
  const ROUTES = ['dashboard', 'dsa', 'lld', 'hld', 'revise', 'settings'];
  function currentRoute() { const r = (location.hash.replace(/^#\/?/, '') || 'dashboard').toLowerCase(); return ROUTES.includes(r) ? r : 'dashboard'; }
  function currentTrack() { const r = currentRoute(); return TRACKS.find((k) => TMETA[k].route === r) || null; }

  function render() {
    if (!auth) return;
    const S = stats(), r = currentRoute(), k = currentTrack();
    $$('#nav a').forEach((a) => a.classList.toggle('active', a.dataset.route === r));
    TRACKS.forEach((t) => { const el = $(`[data-count="${t}"]`); if (el) el.textContent = `${S.by[t].filter((x) => x.it.solvedDate).length}/${S.by[t].length}`; });
    const dueNow = S.rows.filter((x) => x.status === 'overdue' || x.status === 'today').length;
    $('#nav-due').textContent = dueNow ? (dueNow > 99 ? '99+' : dueNow) : '';
    let title, sub, html;
    if (r === 'dashboard') {
      title = `${greeting()}, ${esc(state.owner || 'Atharva')}`;
      sub = `${WEEKDAYS[parseD(S.t).getDay()]}, ${fmt(S.t)} · last activity ${S.lastActivity ? `${fmt(S.lastActivity)} (${ago(S.lastActivity, S.t)})` : '—'}`;
      html = viewDashboard(S);
    } else if (k) {
      title = `${k} tracker`;
      sub = `${TMETA[k].full}${k === 'DSA' ? ' · Striver SDE sheet' : ''} · click a row for approach, mistakes & revision history`;
      html = viewTrack(k, S);
    } else if (r === 'revise') {
      title = 'Revision queue'; sub = 'Spaced repetition: rate each revision and the next due date adjusts itself'; html = viewRevise(S);
    } else {
      title = 'Settings & sync'; sub = 'Revision schedule, goals, GitHub sync and backups'; html = viewSettings(S);
    }
    $('#page-title').innerHTML = title;
    $('#page-sub').textContent = sub;
    const banner = filePlain ? `<div class="banner">${ic('alert')}<div><b>Your published data file is still unencrypted.</b> Download the locked version and replace <code>data/progress.js</code> in your repo, then commit and push.${ghReady(ghCfg()) ? ' (GitHub sync is on, so it is pushed automatically after your next change.)' : ''}</div>
      <button class="btn sm primary" data-action="export-js">${ic('download')}Download locked progress.js</button></div>` : '';
    $('#main').innerHTML = banner + html;
    document.title = `${r === 'dashboard' ? 'Dashboard' : k ? `${k} tracker` : r === 'revise' ? 'Revision queue' : 'Settings'} · Atharva Prep Tracker`;
    renderSync();
  }

  // ------------------------------------------------------------------ events
  function toast(msg, kind = 'ok', undo) {
    const el = document.createElement('div');
    el.className = `toast ${kind}`;
    el.innerHTML = `<span>${msg}</span>${undo ? '<button type="button">Undo</button>' : ''}`;
    if (undo) el.querySelector('button').addEventListener('click', () => { el.remove(); undo(); });
    $('#toasts').appendChild(el);
    setTimeout(() => el.remove(), undo ? 6500 : 3800);
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-action]');
    if (a && !(a.dataset.action === 'modal-back' && e.target !== a)) { handleAction(a, e); return; }
    if (e.target.closest('#modal-root')) return;
    const th = e.target.closest('th[data-sort]');
    if (th) {
      const k = currentTrack();
      if (k) { const f = ui.f[k]; f.dir = f.sort === th.dataset.sort ? -f.dir : 1; f.sort = th.dataset.sort; saveUI(); renderList(k); }
      return;
    }
    if (e.target.closest('a,button,input,select,textarea')) return;
    const go = e.target.closest('[data-go]');
    if (go) { location.hash = go.dataset.go; return; }
    const row = e.target.closest('tr.row[data-id]');
    if (row) {
      const id = row.dataset.id;
      if (ui.open.has(id)) ui.open.delete(id); else ui.open.add(id);
      const k = currentTrack(); if (k) renderList(k);
    }
  });

  document.addEventListener('input', (e) => {
    const el = e.target;
    if (el.classList.contains('dmy')) {              // auto-insert slashes: 22102026 -> 22/10/2026
      if (e.inputType && e.inputType.startsWith('delete')) return;
      const g = el.value.replace(/\D/g, '').slice(0, 8);
      el.value = g.length > 4 ? `${g.slice(0, 2)}/${g.slice(2, 4)}/${g.slice(4)}` : g.length > 2 ? `${g.slice(0, 2)}/${g.slice(2)}` : g;
      return;
    }
    if (el.matches('[data-filter]')) {
      const k = currentTrack();
      if (!k) return;
      ui.f[k][el.dataset.filter] = el.value;
      saveUI(); renderList(k);
    }
  });

  document.addEventListener('change', (e) => {
    const el = e.target;
    if (el.matches('[data-set]')) {
      const path = el.dataset.set.split('.');
      let v = el.value.trim() === '' ? null : Math.round(+el.value);
      if (v !== null && (!Number.isFinite(v) || v < 1)) { toast('Enter a whole number of 1 or more', 'error'); render(); return; }
      if (path[0] === 'intervals' && v === null) v = { Low: 3, Medium: 7, High: 14 }[path[1]];
      if (path[0] === 'dailyRevisionGoal' && v === null) v = 10;
      if (path.length === 2) state.settings[path[0]][path[1]] = v; else state.settings[path[0]] = v;
      commit('Settings saved');
    } else if (el.matches('[data-link]')) {
      const l = state.settings.links[+el.dataset.link];
      if (l) { l[el.dataset.k] = el.value.trim(); commit('Link saved'); }
    } else if (el.matches('[data-picker-for]')) {
      const f = formField(el.dataset.pickerFor);
      if (f && validISO(el.value)) {
        if (el.dataset.pickerFor === 'revIn') { addRevision(el.value); f.value = ''; } else f.value = fmt(el.value);
      }
    } else if (el.id === 'import-file') {
      importFile(el.files[0]); el.value = '';
    } else if (el.name === 'track' && el.closest('#item-form')) {
      draft.track = el.value;
      $('#tag-label').textContent = TMETA[draft.track].tagLabel;
      renderSuggestions();
    }
  });

  document.addEventListener('submit', (e) => {
    if (e.target.id === 'item-form') { e.preventDefault(); submitForm(e.target); }
    if (e.target.id === 'gate-form') { e.preventDefault(); handleGate(e.target); }
  });

  document.addEventListener('keydown', (e) => {
    const el = e.target;
    if (el.id === 'tag-in') {
      if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTags(el.value); el.value = ''; }
      else if (e.key === 'Backspace' && !el.value && draft.topics.length) { draft.topics.pop(); renderTagChips(); }
      return;
    }
    if (el.id === 'rev-in' && e.key === 'Enter') { e.preventDefault(); addRevisionFromInput(); return; }
    if (e.key === 'Escape' && $('#modal-root').children.length) { closeModal(); return; }
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable;
    if (!auth || typing || e.metaKey || e.ctrlKey || e.altKey || $('#modal-root').children.length) return;
    if (e.key === 'n' || e.key === 'N') { e.preventDefault(); openForm(null); }
    else if (e.key === '/') { const q = $('#q'); if (q) { e.preventDefault(); q.focus(); } }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && syncTimer) { clearTimeout(syncTimer); syncTimer = null; ghPush(false); }
  });
  window.addEventListener('hashchange', () => { window.scrollTo(0, 0); render(); });

  // ------------------------------------------------------------------ boot
  // ------------------------------------------------------------------ lock screen & password
  const fileBlob = isEnc(window.PROGRESS_ENC) ? window.PROGRESS_ENC : null;
  const filePlain = !fileBlob && window.PROGRESS_DATA ? window.PROGRESS_DATA : null;
  const gateErr = (m) => { const el = $('.gate-err'); if (el) el.textContent = m; };

  function showGate(mode, err = '') {
    document.body.classList.add('locked');
    const setup = mode === 'setup';
    $('#gate').innerHTML = `<form class="gate-card" id="gate-form">
      <span class="brand-mark">A</span>
      <h1>${setup ? 'Lock your tracker' : 'Welcome back, Atharva'}</h1>
      <p>${setup ? 'Choose a password. All your progress is encrypted with it (AES-256) before it is saved or published, so the public site shows nothing without it.' : 'Enter your password to unlock your prep tracker.'}</p>
      <input type="text" name="username" value="atharva" autocomplete="username" hidden>
      <input type="password" name="pw" placeholder="Password" autocomplete="${setup ? 'new-password' : 'current-password'}" required>
      ${setup ? '<input type="password" name="pw2" placeholder="Confirm password" autocomplete="new-password" required>' : ''}
      <label class="check"><input type="checkbox" name="remember" checked> Remember me on this device</label>
      <button class="btn primary" type="submit">${setup ? 'Set password & encrypt' : 'Unlock'}</button>
      <p class="gate-err">${esc(err)}</p>
      ${setup ? '<p class="help">There is no "forgot password": if you lose it, the data cannot be decrypted. Keep a backup from Settings.</p>' : ''}
    </form>`;
    setTimeout(() => { const f = $('#gate [name="pw"]'); if (f) f.focus(); }, 30);
  }

  async function openWith(cands, extraPlain) {
    const best = cands.reduce((a, b) => ((b.data.updatedAt || '') > (a.data.updatedAt || '') ? b : a));
    auth = { key: best.key, salt: best.salt };
    state = best.data;
    if (extraPlain) { const p = normalize(extraPlain); if ((p.updatedAt || '') > (state.updatedAt || '')) state = p; }
    await persist();
    startApp();
  }
  async function tryUnlock(pw, remember) {
    const local = readLocal();
    const blobs = [isEnc(local) ? local : null, fileBlob].filter(Boolean);
    const out = [];
    for (const salt of new Set(blobs.map((b) => b.salt))) {
      const key = await deriveKey(pw, salt);
      for (const b of blobs.filter((x) => x.salt === salt)) {
        try { out.push({ data: await decryptBlob(b, key), key, salt }); } catch (e) { /* wrong password for this copy */ }
      }
    }
    if (!out.length) return false;
    await openWith(out, local && !isEnc(local) ? local : null);
    await rememberKey(remember);
    return true;
  }
  async function trySilent() {
    const k = await storedKey();
    if (!k) return false;
    const local = readLocal();
    const localEnc = isEnc(local) ? local : null;
    // a newer published copy locked with another password → ask for it
    if (fileBlob && fileBlob.salt !== k.salt && (fileBlob.updatedAt || '') > ((localEnc && localEnc.updatedAt) || '')) return false;
    const out = [];
    for (const b of [localEnc, fileBlob].filter((x) => x && x.salt === k.salt)) {
      try { out.push({ data: await decryptBlob(b, k.key), key: k.key, salt: k.salt }); } catch (e) { /* ignore */ }
    }
    if (!out.length) return false;
    await openWith(out, null);
    return true;
  }
  async function setupPassword(pw, remember) {
    const local = readLocal();
    const plain = newer(local && !isEnc(local) ? normalize(local) : null, filePlain ? normalize(filePlain) : null) || normalize(defaults());
    const salt = bytesToB64(crypto.getRandomValues(new Uint8Array(16)));
    auth = { key: await deriveKey(pw, salt), salt };
    state = plain;
    state.updatedAt = new Date().toISOString();
    await persist();
    await rememberKey(remember);
    startApp();
    scheduleSync();
    toast('Password set — your data is now encrypted. Download the locked file from the banner and push it.', 'ok');
  }
  async function handleGate(form) {
    const el = form.elements, pw = el.pw.value, setup = !!el.pw2;
    const btn = form.querySelector('button[type="submit"]'), label = btn.textContent;
    if (setup && pw.length < 8) { gateErr('Use at least 8 characters.'); return; }
    if (setup && pw !== el.pw2.value) { gateErr("The passwords don't match."); return; }
    btn.disabled = true; btn.textContent = setup ? 'Encrypting…' : 'Unlocking…';
    try {
      if (setup) await setupPassword(pw, el.remember.checked);
      else if (!(await tryUnlock(pw, el.remember.checked))) { btn.disabled = false; btn.textContent = label; el.pw.value = ''; el.pw.focus(); gateErr('Wrong password.'); }
    } catch (err) { btn.disabled = false; btn.textContent = label; gateErr(`Something went wrong: ${err.message}`); }
  }
  async function lockNow() {
    if (syncTimer) { clearTimeout(syncTimer); syncTimer = null; await ghPush(false); }
    await persistChain;
    try { localStorage.removeItem(LS_KEY); sessionStorage.removeItem(LS_KEY); } catch (e) { /* ignore */ }
    location.reload();
  }
  async function changePassword() {
    const v = (n) => ($(`[data-pw="${n}"]`) || {}).value || '';
    const cur = v('cur'), n1 = v('new'), n2 = v('new2');
    if (n1.length < 8) { toast('New password: use at least 8 characters', 'error'); return; }
    if (n1 !== n2) { toast("The new passwords don't match", 'error'); return; }
    if (await exportRaw(await deriveKey(cur, auth.salt)) !== await exportRaw(auth.key)) { toast('Current password is wrong', 'error'); return; }
    const salt = bytesToB64(crypto.getRandomValues(new Uint8Array(16)));
    auth = { key: await deriveKey(n1, salt), salt };
    let remembered = false;
    try { remembered = !!localStorage.getItem(LS_KEY); } catch (e) { /* ignore */ }
    await rememberKey(remembered);
    commit(ghReady(ghCfg()) ? 'Password changed — re-encrypted and syncing to GitHub' : 'Password changed — download the new data/progress.js and push it');
  }

  let started = false;
  function startApp() {
    document.body.classList.remove('locked');
    $('#gate').innerHTML = '';
    render();
    if (started) return;
    started = true;
    if (ghReady(ghCfg())) {
      setSync('syncing');
      ghPull().then((res) => {
        if (res.data && (res.data.updatedAt || '') > (state.updatedAt || '')) { state = res.data; persist(); render(); toast('Loaded your latest progress from GitHub'); }
        setSync('ok');
      }).catch((err) => setSync('error', err.message));
    }
    let day = today();
    setInterval(() => { if (today() !== day && !$('#modal-root').children.length) { day = today(); render(); } }, 60000);
  }

  // ------------------------------------------------------------------ boot
  $$('[data-icon]').forEach((el) => { el.outerHTML = ic(el.dataset.icon); });
  (async () => {
    if (!window.crypto || !crypto.subtle) {
      document.body.classList.add('locked');
      $('#gate').innerHTML = '<div class="gate-card"><h1>Secure connection needed</h1><p>Open the tracker over https (your GitHub Pages link) so it can encrypt your data.</p></div>';
      return;
    }
    if (!fileBlob && !isEnc(readLocal())) { showGate('setup'); return; }
    if (await trySilent().catch(() => false)) return;
    showGate('unlock');
  })();
})();

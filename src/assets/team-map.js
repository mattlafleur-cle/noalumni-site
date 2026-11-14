// Working Genius team map builder. Runs entirely in the browser: nothing is sent anywhere unless the
// visitor submits the optional help form (which sends counts only, never names).
(() => {
  const root = document.getElementById('tm');
  if (!root) return;
  const $ = (id) => document.getElementById(id);
  const TYPES = [
    ['W', 'Wonder', 'Ideation'], ['I', 'Invention', 'Ideation'], ['D', 'Discernment', 'Activation'],
    ['G', 'Galvanizing', 'Activation'], ['E', 'Enablement', 'Implementation'], ['T', 'Tenacity', 'Implementation'],
  ];
  const NAME = Object.fromEntries(TYPES.map(([l, n]) => [l, n]));
  const SLUG = { W: 'wonder', I: 'invention', D: 'discernment', G: 'galvanizing', E: 'enablement', T: 'tenacity' };
  const base = (document.querySelector('link[rel="stylesheet"]')?.getAttribute('href') || '/assets/site.css').replace(/\/assets\/site\.css$/, '');
  const SAMPLE = [
    ['Sample: Alex', 'WI', 'DG', 'ET'], ['Sample: Blair', 'ET', 'WD', 'GI'], ['Sample: Casey', 'TE', 'ID', 'WG'],
    ['Sample: Devon', 'GE', 'TI', 'DW'], ['Sample: Emery', 'DT', 'EW', 'GI'], ['Sample: Frankie', 'ET', 'GD', 'IW'],
  ];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const rowsEl = $('tm-rows');
  let n = 0;

  function addRow(v = ['', '', '', '']) {
    n += 1;
    const id = `p${n}`;
    const row = document.createElement('div');
    row.className = 'tm-row';
    row.innerHTML = `
      <div class="field"><label for="${id}-n">Name</label><input id="${id}-n" data-k="name" value="${esc(v[0])}" autocomplete="off"></div>
      <div class="field"><label for="${id}-g">Genius</label><input id="${id}-g" data-k="g" value="${esc(v[1])}" maxlength="2" placeholder="WI" autocomplete="off"></div>
      <div class="field"><label for="${id}-c">Competency</label><input id="${id}-c" data-k="c" value="${esc(v[2])}" maxlength="2" placeholder="DG" autocomplete="off"></div>
      <div class="field"><label for="${id}-f">Frustration</label><input id="${id}-f" data-k="f" value="${esc(v[3])}" maxlength="2" placeholder="ET" autocomplete="off"></div>
      <button type="button" class="tm-del" aria-label="Remove this person">&times;</button>
      <p class="tm-err" role="alert"></p>`;
    row.querySelector('.tm-del').addEventListener('click', () => { row.remove(); render(); });
    row.querySelectorAll('input').forEach((i) => i.addEventListener('input', () => {
      if (i.dataset.k !== 'name') i.value = i.value.toUpperCase().replace(/[^WIDGET]/g, '');
      render();
    }));
    rowsEl.appendChild(row);
  }

  function readRows() {
    const people = [];
    rowsEl.querySelectorAll('.tm-row').forEach((row, idx) => {
      const get = (k) => row.querySelector(`[data-k="${k}"]`).value.trim();
      const name = get('name') || `Person ${idx + 1}`;
      const g = get('g'), c = get('c'), f = get('f');
      const err = row.querySelector('.tm-err');
      const all = g + c + f;
      if (!g && !c && !f) { err.textContent = ''; return; }
      if (g.length !== 2 || c.length !== 2 || f.length !== 2) { err.textContent = 'Enter two letters in each box.'; return; }
      if (new Set(all).size !== 6) { err.textContent = 'Each of the six letters should appear exactly once across the three boxes.'; return; }
      err.textContent = '';
      people.push({ name, g, c, f });
    });
    return people;
  }

  const list = (names) => (names.length ? names.map(esc).join(', ') : '<span class="muted">None</span>');

  function render() {
    const people = readRows();
    const out = $('tm-out');
    const help = $('tm-help');
    if (people.length < 2) { out.hidden = true; help.hidden = true; return; }
    out.hidden = false; help.hidden = false;
    const total = people.length;
    const stat = Object.fromEntries(TYPES.map(([l]) => [l, { g: [], c: [], f: [] }]));
    people.forEach((p) => { for (const k of ['g', 'c', 'f']) for (const l of p[k]) stat[l][k].push(p.name); });
    $('tm-sub').textContent = `${total} people · every person counted twice in each row (two geniuses, two competencies, two frustrations)`;

    // Insights
    const sorted = TYPES.map(([l]) => l).sort((a, b) => stat[b].g.length - stat[a].g.length);
    const strengths = sorted.filter((l) => stat[l].g.length >= Math.max(2, Math.ceil(total * 0.4))).slice(0, 2);
    const gaps = TYPES.map(([l]) => l).filter((l) => stat[l].g.length <= Math.floor(total * 0.15) || (stat[l].f.length >= total * 0.5 && stat[l].f.length > stat[l].g.length * 2));
    const notes = [];
    if (strengths.length) notes.push(`<div class="tm-note good"><b>Strengths:</b> ${strengths.map((l) => `${NAME[l]} (${stat[l].g.length} of ${total})`).join(' and ')}. Your team gets energy from this work.</div>`);
    gaps.forEach((l) => {
      const who = stat[l].g.length ? `Lean on ${list(stat[l].g)}, who ${stat[l].g.length === 1 ? 'has' : 'have'} this genius.` : `No one has this genius. ${stat[l].c.length ? `${list(stat[l].c)} ${stat[l].c.length === 1 ? 'has' : 'have'} it as a competency.` : 'Consider who could own it, or bring in help.'}`;
      notes.push(`<div class="tm-note gap"><b>Possible gap: ${NAME[l]}</b> (${stat[l].g.length} genius, ${stat[l].f.length} frustration). Work may stall here. ${who} <a href="${base}/working-genius/${SLUG[l]}/">What ${NAME[l]} is</a></div>`);
    });
    if (!gaps.length) notes.push('<div class="tm-note good"><b>Well balanced:</b> every type has at least a few geniuses on this team.</div>');
    $('tm-insights').innerHTML = notes.join('');

    // Map grid: one card per type, with counts, bars, and names
    const max = Math.max(...TYPES.map(([l]) => Math.max(stat[l].g.length, stat[l].f.length)), 1);
    $('tm-grid').innerHTML = TYPES.map(([l, name, stage]) => `
      <div class="tm-card${gaps.includes(l) ? ' is-gap' : ''}">
        <div class="tm-card-h"><span class="letter" aria-hidden="true">${l}</span><div><b>${name}</b><span class="muted">${stage}</span></div></div>
        <div class="tm-bar"><span>Genius ${stat[l].g.length}</span><i class="g" data-w="${Math.round((stat[l].g.length / max) * 100)}"></i></div>
        <div class="tm-bar"><span>Frustration ${stat[l].f.length}</span><i class="f" data-w="${Math.round((stat[l].f.length / max) * 100)}"></i></div>
        <p><b class="gtxt">Genius:</b> ${list(stat[l].g)}</p>
        <p><b class="ftxt">Frustration:</b> ${list(stat[l].f)}</p>
      </div>`).join('');
    // Bar widths are set here rather than inline in the markup.
    $('tm-grid').querySelectorAll('i[data-w]').forEach((i) => { i.style.width = `${i.dataset.w}%`; });

    $('tm-summary').value = `${total} people. ` + TYPES.map(([l, nm]) => `${nm}: ${stat[l].g.length} genius, ${stat[l].c.length} competency, ${stat[l].f.length} frustration`).join('; ');
    saveHash(people);
  }

  // The map can be shared through the link itself (#data). Nothing is stored on a server.
  function saveHash(people) {
    const enc = people.map((p) => [p.name, p.g, p.c, p.f].join('~')).join('|');
    history.replaceState(null, '', `#t=${encodeURIComponent(enc)}`);
  }
  function loadHash() {
    const m = location.hash.match(/#t=(.*)$/);
    if (!m) return false;
    const rows = decodeURIComponent(m[1]).split('|').map((r) => r.split('~')).filter((r) => r.length === 4);
    if (!rows.length) return false;
    rows.forEach(addRow);
    return true;
  }
  function fill(rows) { rowsEl.innerHTML = ''; rows.forEach(addRow); render(); }

  $('tm-add').addEventListener('click', () => { addRow(); rowsEl.lastElementChild.querySelector('input').focus(); });
  $('tm-sample').addEventListener('click', () => fill(SAMPLE));
  $('tm-clear').addEventListener('click', () => { fill([['', '', '', ''], ['', '', '', ''], ['', '', '', '']]); history.replaceState(null, '', location.pathname); });
  $('tm-paste-go').addEventListener('click', () => {
    const rows = $('tm-paste-box').value.split('\n').map((line) => line.split(/[,\t;]/).map((x) => x.trim())).filter((r) => r.length >= 4)
      .map(([nm, g, c, f]) => [nm, g.toUpperCase(), c.toUpperCase(), f.toUpperCase()]);
    if (rows.length) fill(rows);
  });
  $('tm-print').addEventListener('click', () => window.print());
  $('tm-share').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); $('tm-share-status').textContent = 'Link copied. Anyone with the link sees this map, including names.'; }
    catch { $('tm-share-status').textContent = 'Copy the address in your browser bar to share this map.'; }
  });
  $('tm-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target, btn = form.querySelector('button'), status = form.querySelector('.form-status');
    if (!form.reportValidity()) return;
    btn.disabled = true; btn.textContent = 'Sending...';
    try {
      const res = await fetch(root.dataset.endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
      if (!res.ok) throw new Error(String(res.status));
      status.textContent = 'Thanks. A facilitator will reply soon.'; btn.textContent = 'Sent';
    } catch { status.textContent = 'Something went wrong. Please try again, or email connect@noalumni.com.'; btn.disabled = false; btn.textContent = 'Send my team’s numbers'; }
  });

  if (!loadHash()) fill([['', '', '', ''], ['', '', '', ''], ['', '', '', '']]);
  else render();
})();

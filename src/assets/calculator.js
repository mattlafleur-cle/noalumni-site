// Turnover Drag Calculator. Same inputs, cost bands, and recommendations as the Wix version.
(() => {
  const root = document.getElementById('calc');
  if (!root) return;
  const $ = (id) => document.getElementById(id);

  const INDUSTRIES = [
    ['trades', 'Skilled Trades / Construction', 'mid'],
    ['homeservices', 'HVAC / Electrical / Plumbing / Home Services', 'mid'],
    ['manufacturing', 'Manufacturing', 'mid'],
    ['professional', 'Professional Services', 'management'],
    ['nonprofit', 'Nonprofit / Workforce Organization', 'entry'],
    ['privateed', 'Private Education / Charter School', 'education'],
    ['school', 'School / Career-Tech Program', 'education'],
    ['other', 'Other', 'mid'],
  ];
  const LEVELS = {
    entry: { label: 'Entry-level / hourly', low: 0.5, high: 0.75 },
    education: { label: 'Teacher / instructional staff', low: 0.3, high: 0.5 },
    mid: { label: 'Mid-level / skilled trade or technical', low: 1.0, high: 1.5 },
    management: { label: 'Management / specialized', low: 1.5, high: 2.0 },
    executive: { label: 'Executive / leadership', low: 2.0, high: 2.13 },
  };
  const GENERAL_SOURCE = 'Based on published replacement-cost benchmarks of 50% to 200% of annual salary depending on role level (SHRM, Gallup), with executive turnover running as high as 213% (Center for American Progress). This estimate covers replacement cost only. It leaves out lost productivity, customer impact, and management time, so the real figure is usually higher.';
  const EDU_SOURCE = 'Based on research from the Learning Policy Institute, which puts the cost of replacing one teacher at roughly $25,000 in large districts. This estimate covers replacement cost only. It leaves out lost instructional continuity and the effect on students, which most school leaders would say matters more than the dollars.';
  const money = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const tier = (hc) => (hc <= 15 ? [2500, 4000] : hc <= 40 ? [4000, 6000] : hc <= 100 ? [6000, 7500] : [7500, 8500]);

  const ind = $('c-industry'), lvl = $('c-level'), hcEl = $('c-hc'), tcEl = $('c-tc'), salEl = $('c-sal');
  INDUSTRIES.forEach(([v, l]) => ind.add(new Option(l, v)));
  Object.entries(LEVELS).forEach(([v, o]) => lvl.add(new Option(o.label, v)));
  let levelTouched = false;
  const defaultLevel = () => INDUSTRIES.find((i) => i[0] === ind.value)[2];
  lvl.value = defaultLevel();
  let rec = null;

  function render() {
    const hc = Number(hcEl.value) || 0, tc = Number(tcEl.value) || 0, sal = Number(salEl.value) || 0;
    const band = LEVELS[lvl.value];
    $('c-band').textContent = `Replacement cost band used: ${Math.round(band.low * 100)}% to ${Math.round(band.high * 100)}% of annual pay`;
    $('c-warn').hidden = !(hc > 0 && tc > hc);
    const ready = hc > 0 && tc > 0 && sal > 0;
    $('c-empty').hidden = ready;
    $('c-result').hidden = !ready;
    if (!ready) $('c-reveal').hidden = true;
    $('c-gate').hidden = !ready || !$('c-reveal').hidden; // once a lead is sent, the recommendation stays shown
    if (!ready) return;
    const low = tc * sal * band.low, high = tc * sal * band.high;
    const range = `${money(Math.round(low))} to ${money(Math.round(high))}`;
    $('c-range').textContent = range;
    $('c-source').textContent = lvl.value === 'education' ? EDU_SOURCE : GENERAL_SOURCE;
    const [t0, t1] = tier(hc || 1);
    const assessmentFirst = !(hc >= 20 && high >= 150000);
    rec = assessmentFirst
      ? {
          title: 'New Game Readiness Assessment',
          price: 'Typically $495 to $995',
          qual: 'Final scope and price depend on team size, how many people we interview, and what you want out of it. We confirm both before anything is booked.',
          note: `Before committing to anything larger, the assessment gives you a clear picture of where that cost is actually coming from. Most organizations find it is alignment, unclear roles, and communication friction rather than a shortage of talent. From there, a workshop or sprint can be scoped against real findings instead of a guess. For a team your size, that follow-on work typically runs ${money(t0)} to ${money(t1)}.`,
        }
      : {
          title: 'Working Genius and Preemptive Humility Lab',
          price: `Typically ${money(t0)} to ${money(t1)} for a team your size`,
          qual: 'Final scope and price depend on group size, format, travel, and how much follow-up coaching you want. We confirm both before anything is booked.',
          note: 'At this scale, most of the cost traces back to team misalignment, unclear roles, and communication friction rather than a shortage of talent. That is what this Lab is built to address. If you would rather start smaller, the New Game Readiness Assessment is a lower-commitment way in.',
        };
    $('r-title').textContent = rec.title; $('r-price').textContent = rec.price; $('r-qual').textContent = rec.qual; $('r-note').textContent = rec.note;
    const f = $('leadForm').elements;
    // Field names match the Wix calculator, so lead emails from Formspree look the same as before.
    f.industry_value.value = ind.options[ind.selectedIndex].text; f.headcount.value = hc; f.departures.value = tc;
    f.average_pay.value = sal; f.role_level.value = band.label; f.estimated_range.value = range; f.recommended_offer.value = rec.title;
  }

  ind.addEventListener('change', () => { if (!levelTouched) lvl.value = defaultLevel(); render(); });
  lvl.addEventListener('change', () => { levelTouched = true; render(); });
  [hcEl, tcEl, salEl].forEach((el) => el.addEventListener('input', render));
  $('c-reset').addEventListener('click', () => {
    hcEl.value = tcEl.value = salEl.value = ''; levelTouched = false; lvl.value = defaultLevel();
    $('c-reveal').hidden = true; render();
  });

  $('leadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target, btn = form.querySelector('button'), status = form.querySelector('.form-status');
    if (!form.reportValidity()) return;
    btn.disabled = true; btn.textContent = 'Sending...'; status.textContent = '';
    try {
      const res = await fetch(root.dataset.endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
      if (!res.ok) throw new Error(String(res.status));
      $('c-gate').hidden = true; $('c-reveal').hidden = false;
      $('c-reveal').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      status.textContent = 'Something went wrong sending that. Please try again.';
      btn.disabled = false; btn.textContent = 'Show my next step';
    }
  });
  render();
})();

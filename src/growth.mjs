// Growth pages (November 2026): speaking and events offer, the six Working Genius type pages,
// industry pages, and the free team map builder. Copy is original; nothing is copied from
// The Table Group's materials. Claims about clients come only from reviews, surveys, and logos
// No Alumni has permission to show (see src/reviews.mjs).
import { esc, faqSection } from './layout.mjs';
import { reviews, trustpilot, clients, surveyStats, featuredQuotes } from './reviews.mjs';

const logoWall = (link, names) => {
  const list = names ? clients.filter((c) => names.includes(c.name)) : clients;
  return `<ul class="logos">${list.map((c) => `<li${c.tile ? ` class="tile-${c.tile}"` : ''}><img src="${link(c.logo)}" alt="${esc(c.name)}" loading="lazy"></li>`).join('')}</ul>`;
};
const quoteCard = (q) => `<figure class="fq"><blockquote><p>“${esc(q.text)}”</p></blockquote><figcaption>${esc(q.who)}</figcaption></figure>`;
const reviewQuote = (r) => `<figure class="fq"><blockquote><p>“${esc(r.pull)}”</p></blockquote><figcaption>${esc(r.topic)} · <a href="${r.url}" rel="noopener">Trustpilot review, ${r.date}</a></figcaption></figure>`;
const byTitle = (t) => reviews.find((r) => r.title === t);

// ---------------------------------------------------------------- the six types
export const TYPES = [
  {
    slug: 'wonder', letter: 'W', name: 'Wonder', stage: 'Ideation',
    short: 'Pondering the possibility of greater potential and opportunity.',
    what: 'Wonder is the gift of noticing that something could be better and asking the questions that start every improvement. People with this genius get energy from reflecting, wondering out loud, and sensing that “there has to be a better way” long before anyone has a plan.',
    looks: ['Asks “why do we do it this way?” without being asked', 'Notices patterns others walk past: the same callback, the same missed handoff, the same frustrated client', 'Needs quiet time to think, and does some of their best work on a drive or a walk', 'Raises the questions in a meeting that everyone else is too busy to raise'],
    field: 'On a job site, it is the lead who notices the crew keeps losing an hour waiting on materials and asks whether staging could work differently. In an office, it is the person who wonders why new hires keep quitting in month three.',
    genius: 'You find energy and joy in open questions and possibility. You may feel restless when a team only executes and never steps back to ask what could be better.',
    competency: 'You can step back and reflect when the moment calls for it, but you would rather not stay in open-ended thinking for long.',
    frustration: 'Long, open-ended conversations drain you. You want to know what problem you are solving and get moving. That is normal: lean on teammates with Wonder to raise the big questions.',
    team: ['Give people with Wonder time and space to think before decisions get made', 'Ask them what they are noticing, and write it down before it gets lost', 'Pair them with Invention so good questions turn into real ideas'],
  },
  {
    slug: 'invention', letter: 'I', name: 'Invention', stage: 'Ideation',
    short: 'Creating original ideas and solutions.',
    what: 'Invention is the gift of creating original ideas and solutions, usually from scratch. People with this genius light up when there is a blank whiteboard and a real problem to solve.',
    looks: ['Comes up with new approaches instead of tweaking old ones', 'Enjoys designing a process, a product, a schedule, or a pitch', 'Gets bored once the idea is set and the work becomes routine', 'Brings three options to a meeting when others brought none'],
    field: 'In the trades, it is the person who designs a new way to schedule service calls or rigs a better jig in the shop. On a real estate team, it is the agent who invents a new listing presentation.',
    genius: 'Creating something new gives you energy. You may get restless when the work is all maintenance and no invention.',
    competency: 'You can come up with a solid idea when needed, but you would rather refine something that exists than start from nothing.',
    frustration: 'Starting from a blank page wears you out. Hand that work to a teammate with Invention, then bring your own gifts to evaluating, rallying, supporting, or finishing it.',
    team: ['Give inventors real problems, not just tasks', 'Protect them from being the only source of new ideas; it burns them out', 'Pair them with Discernment so the best ideas get picked and refined'],
  },
  {
    slug: 'discernment', letter: 'D', name: 'Discernment', stage: 'Activation',
    short: 'Using intuition and instinct to evaluate ideas and plans.',
    what: 'Discernment is the gift of instinctively evaluating an idea, a plan, or a situation. People with this genius have a gut sense for what will work and what will not, and they can usually tell you how to make a good idea better.',
    looks: ['Reads a plan and immediately spots what is missing', 'Has strong instincts about people, timing, and fit', 'Gives the feedback that saves the team from an expensive mistake', 'Connects the dots across information others see separately'],
    field: 'In construction, it is the estimator who senses a bid will not pencil out before the numbers are finished. In a medical practice, it is the manager who can tell a new workflow will frustrate patients.',
    genius: 'Weighing ideas and giving honest, instinctive feedback energizes you. You may get frustrated when decisions are made without anyone stopping to ask whether they make sense.',
    competency: 'You can evaluate an idea when asked, but you do not need to weigh in on everything.',
    frustration: 'Being asked to judge every idea on instinct drains you. You may prefer clear criteria or data. Lean on teammates with Discernment for a quick read.',
    team: ['Bring people with Discernment in early, before plans harden', 'Ask for their gut reaction, then let them explain it', 'Pair them with Galvanizing so the right ideas actually get moving'],
  },
  {
    slug: 'galvanizing', letter: 'G', name: 'Galvanizing', stage: 'Activation',
    short: 'Rallying and inspiring people to act around an idea.',
    what: 'Galvanizing is the gift of rallying people around an idea and getting them moving. People with this genius create momentum: they enlist others, build enthusiasm, and push a team past the inertia that stalls good plans.',
    looks: ['Gets the room excited about a new direction', 'Recruits the right people to help and makes them want to', 'Pushes for a decision when a team is stuck talking', 'Is comfortable asking people to commit'],
    field: 'In the trades, it is the owner who gets a skeptical crew to try a new process. On a real estate team, it is the leader who rallies agents around a new lead follow-up system.',
    genius: 'Getting people moving gives you energy. You may get impatient when good ideas sit on the shelf.',
    competency: 'You can rally people when it matters, but you do not want to be the one always pushing.',
    frustration: 'Constantly pushing people to act drains you. That is common, and on some teams very few people have this genius. Know who on your team has it, and ask for their help.',
    team: ['Know who your galvanizers are, especially if there are only a few', 'Hand them the launch, not the maintenance', 'Pair them with Enablement so momentum turns into support and follow-through'],
  },
  {
    slug: 'enablement', letter: 'E', name: 'Enablement', stage: 'Implementation',
    short: 'Giving people the support and help they need.',
    what: 'Enablement is the gift of responding to a call for help and giving people the support they need to get work started and keep it going. People with this genius are the human glue on a team: flexible, generous, and quick to jump in.',
    looks: ['Says yes when someone needs a hand', 'Adapts to what the team needs right now', 'Makes other people more effective without needing credit', 'Keeps morale and relationships strong during busy stretches'],
    field: 'In the trades, it is the office manager who rearranges a day to get a crew what it needs. In a practice, it is the team member who covers for a colleague without being asked.',
    genius: 'Helping others succeed gives you energy. You may feel drained if the team never asks for help, or if your support goes unnoticed.',
    competency: 'You can jump in and help when needed, but you need some work that is your own.',
    frustration: 'Constantly responding to other people’s requests wears you down. That is not selfish. It means your best contribution is somewhere else in the work.',
    team: ['Be clear about what you need when you ask for help', 'Recognize enablers; they often discount their own gift', 'Protect them from becoming the default for every request'],
  },
  {
    slug: 'tenacity', letter: 'T', name: 'Tenacity', stage: 'Implementation',
    short: 'Pushing projects and tasks through to completion.',
    what: 'Tenacity is the gift of pushing work through to completion and making sure it meets the standard. People with this genius get real satisfaction from crossing the finish line and are comfortable working through obstacles to get there.',
    looks: ['Owns the punch list and closes it out', 'Holds the team to deadlines and quality standards', 'Pushes through problems instead of stopping at them', 'Feels the satisfaction of a finished job more than the excitement of a new one'],
    field: 'On a job site, it is the project manager who will not call it done until every item is finished right. In an office, it is the person who makes sure the follow-up actually happens.',
    genius: 'Finishing well gives you energy. You may get frustrated by endless brainstorming or by projects that never close.',
    competency: 'You can push to the finish when you must, but you would rather hand off the last mile.',
    frustration: 'Grinding through the final details drains you. Make sure someone with Tenacity owns completion.',
    team: ['Give people with Tenacity clear finish lines and the authority to hold them', 'Do not bury them in brainstorming; bring them in when it is time to deliver', 'Celebrate what gets finished, not just what gets started'],
  },
];

const typePage = (site, link, t, i) => {
  const prev = TYPES[i - 1];
  const next = TYPES[i + 1];
  const faq = [
    [`What is the Working Genius of ${t.name}?`, `${t.name} is one of The 6 Types of Working Genius, the model created by Patrick Lencioni and The Table Group. ${t.what}`],
    [`What does it mean if ${t.name} is my working frustration?`, `${t.frustration} Everyone has two working frustrations; they are not weaknesses to fix, they are work that drains your energy.`],
    [`Where does ${t.name} fit in the work?`, `${t.name} is part of the ${t.stage} stage. The six types follow the natural flow of work: Wonder, Invention, Discernment, Galvanizing, Enablement, and Tenacity.${prev ? ` ${t.name} receives work from ${prev.name}` : ` ${t.name} is where work begins`}${next ? ` and hands it to ${next.name}.` : ' and carries it to completion.'}`],
  ];
  return {
    key: `wg-${t.slug}`,
    crumb: t.name,
    faq,
    path: `/working-genius/${t.slug}/`,
    title: `${t.name}: The 6 Types of Working Genius Explained | No Alumni`,
    description: `What the Working Genius of ${t.name} means, what it looks like at work, and what it means if ${t.name} is your genius or your frustration.`,
    body: `
<section class="hero">
  <div class="wrap narrow">
    <p class="eyebrow">The 6 Types of Working Genius · ${t.stage}</p>
    <h1><span class="type-badge" aria-hidden="true">${t.letter}</span>${t.name}</h1>
    <p class="lead">${t.short}</p>
    <p>${t.what}</p>
  </div>
</section>
<section class="section section-alt">
  <div class="wrap grid grid-2">
    <div>
      <h2>What ${t.name} looks like at work</h2>
      <ul class="checks">${t.looks.map((l) => `<li>${l}</li>`).join('')}</ul>
    </div>
    <div class="card">
      <h3>In the field and in the office</h3>
      <p>${t.field}</p>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <h2>If ${t.name} is your genius, competency, or frustration</h2>
    <div class="grid grid-3">
      <div class="card"><span class="tag">Working genius</span><p>${t.genius}</p></div>
      <div class="card"><span class="tag">Working competency</span><p>${t.competency}</p></div>
      <div class="card"><span class="tag">Working frustration</span><p>${t.frustration}</p></div>
    </div>
  </div>
</section>
<section class="section section-alt">
  <div class="wrap">
    <h2>Where ${t.name} fits in the work</h2>
    <ol class="flow">${TYPES.map((x) => `<li${x.slug === t.slug ? ' class="here" aria-current="true"' : ''}><a href="${link(`/working-genius/${x.slug}/`)}"><b>${x.letter}</b>${x.name}</a></li>`).join('')}</ol>
    <p class="muted">Every piece of work moves through all six, from Ideation (Wonder, Invention) to Activation (Discernment, Galvanizing) to Implementation (Enablement, Tenacity).</p>
    <h3>Using ${t.name} on a team</h3>
    <ul class="checks">${t.team.map((l) => `<li>${l}</li>`).join('')}</ul>
  </div>
</section>
<section class="section">
  <div class="wrap grid grid-2">
    <div class="card">
      <h2 class="card-h">See where ${t.name} lives on your team</h2>
      <p>Enter everyone’s results in our free team map builder to see who has ${t.name} as a genius, who finds it draining, and where work may be getting stuck.</p>
      <a class="btn btn-fill" href="${link('/team-map/')}">Build your team map</a>
    </div>
    <div class="card">
      <h2 class="card-h">Not sure of your types yet?</h2>
      <p>Take the Working Genius assessment, then walk through your results with one of our facilitators.</p>
      <a class="btn btn-outline" href="${site.workingGeniusAssessmentUrl}" rel="noopener">Take the assessment</a>
    </div>
  </div>
</section>
${faqSection(faq, `${t.name} questions`)}
<nav class="section-tight" aria-label="Other types"><div class="wrap type-nav">${prev ? `<a href="${link(`/working-genius/${prev.slug}/`)}">&larr; ${prev.name}</a>` : '<span></span>'}<a href="${link('/working-genius/')}">All six types</a>${next ? `<a href="${link(`/working-genius/${next.slug}/`)}">${next.name} &rarr;</a>` : '<span></span>'}</div></nav>
`,
  };
};

// ---------------------------------------------------------------- industries
const INDUSTRIES = [
  {
    slug: 'construction-and-trades',
    crumb: 'Construction and the trades',
    title: 'Working Genius for Construction, Contractors, and the Trades | No Alumni',
    description: 'Working Genius workshops and team maps for contractors, crews, and the trades: fewer stalled handoffs between office and field, better hires, and people who stay.',
    eyebrow: 'Construction, contractors, and the trades',
    h1: 'Working Genius for crews, contractors, and the trades.',
    lead: 'Built for owners, project managers, office staff, and crews. Plain language, practical examples from the field, and a team map you can use on Monday.',
    why: ['Work stalls between the office, the estimate, and the job site. A team map shows exactly where and who can move it.', 'Good techs and crew leads burn out doing work that drains them. Small changes in who owns what keep them longer.', 'Hiring gets easier when you know which kinds of work your team is missing.', 'It gives the office and the field a shared, judgment-free language for how each person works best.'],
    logos: ['At Your Service Roofing', 'The Roof Detective', 'Lifestyle Landscaping', 'Rush Enterprises', 'Rush Truck Centers'],
    reviewTitles: ['As a small construction company', 'Amazing Training', 'The Best To Do It'],
    faq: [
      ['Does Working Genius work for construction crews and field teams?', 'Yes. The six types describe kinds of work every crew does, from spotting problems and designing fixes to rallying people and finishing the punch list. We use examples from the field, not the boardroom.'],
      ['How long does a Working Genius session for a contracting company take?', 'Every session is custom. Many trades companies start with a short team session after everyone takes the assessment, then add a working session on roles and handoffs.'],
      ['Can Working Genius help with hiring in the trades?', 'Yes. Reviewers describe using it to see what kind of person their team was missing before hiring. It complements, not replaces, skills and experience.'],
    ],
  },
  {
    slug: 'healthcare-practices',
    crumb: 'Healthcare practices',
    title: 'Working Genius for Medical, Therapy, and Healthcare Practices | No Alumni',
    description: 'Working Genius keynotes, team sessions, and team maps for physician and therapy practices: smoother handoffs, better hires, and less burnout among staff.',
    eyebrow: 'Medical, therapy, and healthcare practices',
    h1: 'Working Genius for healthcare practices.',
    lead: 'For physicians, practice leaders, therapists, and front-office teams who want smoother days, better hires, and less burnout.',
    why: ['Practices run on handoffs between providers, front desk, billing, and clinical staff. A team map shows where they break down.', 'Burnout often comes from spending the day in your working frustrations. Seeing it named is the first step to fixing it.', 'Hiring for fit gets clearer when you can see the gaps on your team.', 'Practice owners learn what to delegate, and to whom.'],
    logos: ['Private Physicians Alliance', 'Breaking Through Intensive Therapy'],
    reviewTitles: ['Highly recommend No Alumni!!', 'Insightful and invaluable'],
    quotes: [0],
    faq: [
      ['Is Working Genius useful for small medical and therapy practices?', 'Yes. Small practices feel role gaps quickly. Practice leaders have used it to plan hires and decide what to delegate, and keynote attendees asked to bring the assessment to their whole teams.'],
      ['Can you present Working Genius at a physician or practice association meeting?', 'Yes. We have delivered a Working Genius keynote for a physician practice alliance, with assessments, personal results, and follow-up resources for attendees.'],
      ['Does Working Genius replace clinical skills or credentials?', 'No. It is about the kinds of work that give people energy or drain them, which affects engagement, collaboration, and burnout. It sits alongside skills and credentials.'],
    ],
  },
  {
    slug: 'real-estate-teams',
    crumb: 'Real estate teams',
    title: 'Working Genius for Real Estate Teams and Brokerages | No Alumni',
    description: 'Working Genius workshops for real estate teams and brokerages: agents, ISAs, and operations on the right work, and fewer leads and listings slipping through.',
    eyebrow: 'Real estate teams and brokerages',
    h1: 'Working Genius for real estate teams.',
    lead: 'For team leaders, agents, ISAs, and operations staff who want leads, listings, and follow-up to stop falling through the cracks.',
    why: ['Leads and listings stall at predictable handoffs. A team map shows which kinds of work are missing.', 'Top producers burn out when they are stuck in work that drains them. Rebalancing roles keeps them producing.', 'Team leaders learn who should own new ideas, who should rally the team, and who should finish.', 'It gives agents and staff a shared language for better meetings and follow-up.'],
    logos: ['Jose Medina & Associates'],
    quotes: [1, 2, 3],
    stat: true,
    faq: [
      ['How do real estate teams use Working Genius?', 'Team leaders use the team map to put agents, ISAs, and operations staff on the work that gives them energy, and to see where leads, listings, and follow-up stall.'],
      ['What did participants say after a real estate team workshop?', 'In an anonymous survey after a recent real estate team workshop, every participant rated it 4 or 5 out of 5 for usefulness, for an average of 4.9. Several said they would change who joins which meetings based on their results.'],
      ['Can you run a Working Genius session for a whole brokerage office?', 'Yes. We build each session around the group: a keynote for a large office, a working session for a leadership team, or both.'],
    ],
  },
];

const industryPage = (site, link, ind) => ({
  key: `wg-${ind.slug}`,
  crumb: ind.crumb,
  faq: ind.faq,
  path: `/working-genius/${ind.slug}/`,
  title: ind.title,
  description: ind.description,
  body: `
<section class="hero">
  <div class="wrap narrow">
    <p class="eyebrow">${ind.eyebrow}</p>
    <h1>${ind.h1}</h1>
    <p class="lead">${ind.lead}</p>
    <div class="btn-row">
      <a class="btn btn-fill" href="${link('/speaking/#plan')}">Plan a session</a>
      <a class="btn btn-outline" href="${link('/team-map/')}">Build a free team map</a>
    </div>
  </div>
</section>
<section class="section-tight"><div class="wrap"><h2 class="eyebrow center">Teams we have worked with</h2>${logoWall(link, ind.logos)}</div></section>
<section class="section section-alt">
  <div class="wrap">
    <h2>Why it matters for ${ind.crumb.toLowerCase()}</h2>
    <ul class="checks">${ind.why.map((w) => `<li>${w}</li>`).join('')}</ul>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <p class="eyebrow">In their words</p>
    <h2>What participants say</h2>
    ${ind.stat ? `<ul class="stats"><li><strong>4.9 / 5</strong><span>average usefulness rating from a recent real estate team workshop (anonymous survey, November 2026)</span></li></ul>` : ''}
    <div class="featured${(ind.quotes || []).length === 3 ? " featured-3" : ""}">
      ${(ind.quotes || []).map((n) => quoteCard(featuredQuotes[n])).join('')}
      ${(ind.reviewTitles || []).map((t) => byTitle(t)).filter(Boolean).map(reviewQuote).join('')}
    </div>
    <a class="card-link" href="${link('/our-work/')}">See all reviews and results</a>
  </div>
</section>
<section class="section section-alt">
  <div class="wrap">
    <h2>How it works</h2>
    <ol class="steps">
      <li><b>A short call.</b> Who is in the room, what you want to change, and when.</li>
      <li><b>Assessments.</b> Everyone takes the Working Genius assessment before the session and gets personal results.</li>
      <li><b>The session.</b> Custom built for your team, with examples from your world.</li>
      <li><b>Your team map.</b> See your team’s geniuses, frustrations, and gaps in one picture.</li>
      <li><b>Follow-through.</b> A resource page, a survey, and options for working sessions or coaching.</li>
    </ol>
  </div>
</section>
${faqSection(ind.faq)}
`,
});

// ---------------------------------------------------------------- speaking
const SPEAKING_FAQ = [
  ['How much does a Working Genius keynote or workshop cost?', 'Every engagement is custom, so fees depend on the format, group size, location, and how much follow-up you want. Tell us about your event and we will send a clear proposal.'],
  ['What formats do you offer?', 'Keynotes for conferences and member meetings, interactive workshops, leadership team sessions, multi-session series, and retreats. We build each one around who is in the room, what you want to change, where it is, and when.'],
  ['Do attendees take the Working Genius assessment?', 'Yes, ideally before the event. We set up access, send reminders, and give each attendee a private way to get their personal results. Teams can also get a team map.'],
  ['Who are your Working Genius facilitators?', 'Greg Snyder, Matt LaFleur, and Josh Muller lead our Working Genius keynotes, workshops, and team sessions.'],
  ['Where are you based, and do you travel?', 'We are based in Northeast Ohio and work with clients and companies across the United States and around the world.'],
  ['What industries do you work with?', 'Construction and the trades, landscaping and home services, healthcare and therapy practices, real estate teams, transportation, and education and career-tech programs.'],
];

const speakingPage = (site, link) => ({
  key: 'speaking',
  crumb: 'Speaking and Events',
  faq: SPEAKING_FAQ,
  path: '/speaking/',
  title: 'Working Genius Keynote Speakers, Workshops, and Team Sessions | No Alumni',
  description: 'Book a Working Genius keynote, workshop, or team session. Custom built for associations, conferences, leadership teams, and schools, with assessments and team maps.',
  schema: [{ '@type': 'Service', '@id': `${site.canonicalDomain || ''}/speaking/#service`, name: 'Working Genius keynotes, workshops, and team sessions', serviceType: 'Keynote speaking and team workshops', provider: { '@id': `${site.canonicalDomain || ''}/#organization` }, description: 'Custom Working Genius keynotes, interactive workshops, leadership team sessions, and retreats for associations, conferences, companies, and schools, including assessments, personal results, and team maps.' }],
  body: `
<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <p class="eyebrow">Keynotes · Workshops · Team sessions</p>
      <h1>Bring Working Genius to your group.</h1>
      <p class="lead">Keynotes, workshops, and team sessions built around your people, your industry, and your goals. Every one is custom, and attendees leave knowing what kind of work gives them energy, and what drains it.</p>
      <div class="btn-row">
        <a class="btn btn-fill" href="#plan">Plan your event</a>
        <a class="btn btn-outline" href="${site.booking.call}" rel="noopener">Schedule a quick call</a>
      </div>
      <p class="note-line"><a href="${link('/assets/No-Alumni-Working-Genius-Speaking.pdf')}">Download the one-page overview (PDF)</a></p>
    </div>
    <div>
    <figure class="cert-badge cert-badge-sm"><img src="${link('/assets/brand/working-genius-certified.webp')}" width="400" height="400" alt="The 6 Types of Working Genius Certified badge"><figcaption>Certified Working Genius facilitators</figcaption></figure>
    <ul class="stats stats-stack">
      <li><strong>${clients.length}+</strong><span>organizations, from trades and healthcare to real estate, transportation, and education</span></li>
      <li><strong>${trustpilot.score} / 5</strong><span>on Trustpilot</span></li>
      <li><strong>${surveyStats.pctFive}%</strong><span>of participants at our two most recent events rated their session 5 out of 5</span></li>
    </ul>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <p class="eyebrow">In the room</p>
    <h2>From the main stage to the conference table</h2>
    <div class="photo-grid">
      <figure class="ph ph-wide"><img src="${link('/assets/photos/ppa-keynote-stage.webp')}" width="1600" height="1200" loading="lazy" alt="Working Genius keynote on stage in a hotel ballroom, with a Galvanizing slide on the screens and attendees at round tables"><figcaption>Keynote at the Private Physicians Alliance 2026 Annual Meeting</figcaption></figure>
      <figure class="ph"><img src="${link('/assets/photos/ppa-keynote-room.webp')}" width="1600" height="1200" loading="lazy" alt="A full ballroom answering a live poll on the screens: if your workday had a dashboard warning light, which one would be on?"><figcaption>Live polling keeps a large room involved</figcaption></figure>
      <figure class="ph"><img src="${link('/assets/photos/workshop-cofacilitating.webp')}" width="480" height="640" loading="lazy" alt="Two No Alumni facilitators presenting the three phases of work to a team seated at a conference table"><figcaption>A team workshop on the three phases of work</figcaption></figure>
      <figure class="ph"><img src="${link('/assets/photos/workshop-matt.webp')}" width="370" height="493" loading="lazy" alt="Matt LaFleur facilitating a Working Genius session in front of two screens showing the stages of work"><figcaption>Working sessions for leadership teams</figcaption></figure>
    </div>
  </div>
</section>
<section class="section-tight"><div class="wrap"><h2 class="eyebrow center">Groups we have worked with</h2>${logoWall(link)}</div></section>
<section class="section section-alt">
  <div class="wrap">
    <p class="eyebrow">Built for your room</p>
    <h2>Who we speak to</h2>
    <div class="grid grid-3">
      <div class="card"><h3>Associations and conferences</h3><p>Member meetings, annual conferences, and breakout sessions for trade, professional, and healthcare associations.</p></div>
      <div class="card"><h3>Companies and leadership teams</h3><p>Whole-company sessions that bring the office and the field together, and working sessions for leadership teams.</p></div>
      <div class="card"><h3>Schools and career-tech</h3><p>Students, staff, and career-tech programs exploring what kind of work fits them, with or without a degree.</p></div>
      <div class="card"><h3>Peer groups</h3><p>Owner and executive peer groups that want a practical tool their members can use the next day.</p></div>
      <div class="card"><h3>Practices and small businesses</h3><p>Physician, therapy, and professional practices where every role and handoff matters.</p></div>
      <div class="card"><h3>Retreats and off-sites</h3><p>Guided sessions as part of a leadership retreat, with a plan to carry home.</p></div>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap grid grid-2">
    <div>
      <p class="eyebrow">More than a talk</p>
      <h2>What every attendee gets</h2>
      <ul class="checks">
        <li>The Working Genius assessment, set up and ready before the event</li>
        <li>A private, secure way to get their personal results</li>
        <li>An event page with the slides, resources, and next steps</li>
        <li>For teams: a team map showing geniuses, frustrations, and gaps</li>
        <li>A short follow-up survey, so we can measure what landed</li>
      </ul>
    </div>
    <div>
      <p class="eyebrow">How it works</p>
      <h2>Custom from the first call</h2>
      <ol class="steps">
        <li><b>A short call.</b> Who, what, where, and when.</li>
        <li><b>We design it.</b> Format, length, and examples built for your audience.</li>
        <li><b>Assessments.</b> Attendees take it beforehand; we handle the logistics.</li>
        <li><b>The event.</b> Practical, engaging, and grounded in real work.</li>
        <li><b>Follow-through.</b> Results, resources, and options for teams that want more.</li>
      </ol>
    </div>
  </div>
</section>
<section class="section section-alt">
  <div class="wrap">
    <p class="eyebrow">In their words</p>
    <h2>What attendees told us afterward</h2>
    <div class="featured">${featuredQuotes.slice(0, 2).map(quoteCard).join('')}${[byTitle('Amazing Training'), byTitle('The 6 Types of Working Genius training')].filter(Boolean).map(reviewQuote).join('')}</div>
    <a class="card-link" href="${link('/our-work/')}">See all reviews and results</a>
  </div>
</section>
<section class="section" id="plan">
  <div class="wrap grid grid-2">
    <div>
      <p class="eyebrow">Plan your event</p>
      <h2>Tell us about your group.</h2>
      <p class="lead">Share a few details and we will follow up with ideas and a clear proposal. Prefer to talk? <a href="${site.booking.call}" rel="noopener">Schedule a quick call</a>.</p>
      <p>Our facilitators: <a href="${link('/who-we-are/#greg-snyder')}">Greg Snyder</a>, <a href="${link('/who-we-are/#matt-lafleur')}">Matt LaFleur</a>, and <a href="${link('/who-we-are/#josh-muller')}">Josh Muller</a>.</p>
    </div>
    <form class="calc ajax-form" action="${site.forms.contact}" method="POST">
      <div class="calc-grid">
        <div class="field"><label for="sp-name">Your name</label><input id="sp-name" name="name" autocomplete="name" required></div>
        <div class="field"><label for="sp-email">Email</label><input id="sp-email" name="email" type="email" autocomplete="email" required></div>
      </div>
      <div class="field"><label for="sp-org">Organization</label><input id="sp-org" name="organization" autocomplete="organization" required></div>
      <div class="calc-grid">
        <div class="field"><label for="sp-type">Type of event</label><select id="sp-type" name="event_type"><option>Conference or member meeting</option><option>Company or team session</option><option>Leadership team or retreat</option><option>School or career-tech program</option><option>Peer group</option><option>Not sure yet</option></select></div>
        <div class="field"><label for="sp-size">Approximate group size</label><input id="sp-size" name="group_size" inputmode="numeric"></div>
      </div>
      <div class="calc-grid">
        <div class="field"><label for="sp-date">Date or timeframe</label><input id="sp-date" name="date"></div>
        <div class="field"><label for="sp-where">Location</label><input id="sp-where" name="location"></div>
      </div>
      <div class="field"><label for="sp-notes">What would make this a win?</label><textarea id="sp-notes" name="message" rows="4"></textarea></div>
      <input type="hidden" name="_subject" value="Speaking and event inquiry">
      <input type="hidden" name="source" value="Speaking page">
      <div class="hp" aria-hidden="true"><label for="sp-gotcha">Leave this empty</label><input id="sp-gotcha" type="text" name="_gotcha" tabindex="-1" autocomplete="off"></div>
      <button class="btn btn-fill" type="submit">Send</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>
${faqSection(SPEAKING_FAQ, 'Speaking questions')}
`,
});

// ---------------------------------------------------------------- team map builder
const TEAM_MAP_FAQ = [
  ['What is a Working Genius team map?', 'A team map puts everyone’s Working Genius results in one picture: who has each type as a genius, who finds it frustrating, and where the team has gaps. It shows why work stalls and who can move it.'],
  ['Is the team map builder free?', 'Yes. Enter your team’s results and see the map right away. Your entries stay in your browser; nothing is sent to us unless you ask us for help.'],
  ['Where do I get my team’s results?', 'Each person needs their results from the official Working Genius assessment: two working geniuses, two working competencies, and two working frustrations.'],
  ['What should we do with our team map?', 'Look for types with few or no geniuses, especially where several people find the work frustrating. Then decide who owns that work, or bring in help. Our facilitators can walk your team through it.'],
];

const teamMapPage = (site, link) => ({
  key: 'team-map',
  crumb: 'Team Map Builder',
  faq: TEAM_MAP_FAQ,
  path: '/team-map/',
  title: 'Free Working Genius Team Map Builder | No Alumni',
  description: 'Enter your team’s Working Genius results and instantly see your team map: geniuses, frustrations, gaps, and who can move stalled work. Free, private, and printable.',
  schema: [{ '@type': 'WebApplication', '@id': `${site.canonicalDomain || ''}/team-map/#app`, name: 'Working Genius Team Map Builder', url: `${site.canonicalDomain || ''}/team-map/`, applicationCategory: 'BusinessApplication', operatingSystem: 'Any', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, description: 'Free tool that turns a team’s Working Genius results into a team map showing geniuses, frustrations, and gaps.', publisher: { '@id': `${site.canonicalDomain || ''}/#organization` } }],
  body: `
<section class="hero no-print">
  <div class="wrap narrow">
    <p class="eyebrow">Free tool</p>
    <h1>Working Genius team map builder</h1>
    <p class="lead">Enter each person’s results and see your team map instantly: who has which genius, who finds it draining, and where work is likely to stall.</p>
    <p class="muted">Use results from the official Working Genius assessment. Everything you type stays in your browser.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap" id="tm" data-endpoint="${site.forms.contact}">
    <div class="calc no-print" id="tm-input">
      <div class="tm-head"><h2 class="card-h">Your team</h2><div class="btn-row"><button class="btn btn-outline btn-small" type="button" id="tm-sample">Load a sample team</button><button class="btn btn-outline btn-small" type="button" id="tm-clear">Clear</button></div></div>
      <p class="hint">For each person, type their two letters for each category. Letters: W Wonder, I Invention, D Discernment, G Galvanizing, E Enablement, T Tenacity.</p>
      <div class="tm-rows" id="tm-rows"></div>
      <div class="btn-row"><button class="btn btn-outline btn-small" type="button" id="tm-add">Add a person</button></div>
      <details class="tm-paste"><summary>Or paste a list</summary>
        <p class="hint">One person per line: name, genius, competency, frustration. Example: <code>Jordan, WI, DG, ET</code></p>
        <label for="tm-paste-box" class="sr-only">Paste team results</label>
        <textarea id="tm-paste-box" rows="5"></textarea>
        <button class="btn btn-outline btn-small" type="button" id="tm-paste-go">Use this list</button>
      </details>
    </div>
    <div id="tm-out" class="tm-out" hidden>
      <div class="tm-title"><h2>Your team map</h2><p class="muted" id="tm-sub"></p></div>
      <div class="tm-insights" id="tm-insights"></div>
      <div class="tm-grid" id="tm-grid"></div>
      <div class="btn-row no-print">
        <button class="btn btn-fill" type="button" id="tm-print">Print or save as PDF</button>
        <button class="btn btn-outline" type="button" id="tm-share">Copy a link to this map</button>
      </div>
      <p class="form-status no-print" id="tm-share-status" role="status" aria-live="polite"></p>
      <p class="print-only print-foot">Made with the free Working Genius team map builder at noalumni.com/team-map. The 6 Types of Working Genius is a model by Patrick Lencioni and The Table Group.</p>
    </div>
    <div class="calc no-print" id="tm-help" hidden>
      <h2 class="card-h">Want help reading your map?</h2>
      <p>Send us your team’s numbers (not names) and a facilitator will reply with what we would focus on first.</p>
      <form id="tm-form" method="POST">
        <div class="calc-grid">
          <div class="field"><label for="tm-name">Your name</label><input id="tm-name" name="name" autocomplete="name" required></div>
          <div class="field"><label for="tm-email">Work email</label><input id="tm-email" name="email" type="email" autocomplete="email" required></div>
        </div>
        <div class="field"><label for="tm-org">Organization</label><input id="tm-org" name="organization" autocomplete="organization"></div>
        <input type="hidden" name="team_summary" id="tm-summary">
        <input type="hidden" name="_subject" value="Team map builder: help request">
        <input type="hidden" name="source" value="Team map builder">
        <div class="hp" aria-hidden="true"><label for="tm-gotcha">Leave this empty</label><input id="tm-gotcha" type="text" name="_gotcha" tabindex="-1" autocomplete="off"></div>
        <button class="btn btn-fill" type="submit">Send my team’s numbers</button>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form>
    </div>
  </div>
</section>
<div class="no-print">
${faqSection(TEAM_MAP_FAQ, 'Team map questions')}
</div>
<script src="${link('/assets/team-map.js')}" defer></script>
`,
});

export function growthPages(site, link) {
  return [
    speakingPage(site, link),
    teamMapPage(site, link),
    ...TYPES.map((t, i) => typePage(site, link, t, i)),
    ...INDUSTRIES.map((ind) => industryPage(site, link, ind)),
  ];
}
export { INDUSTRIES };

// ---------------------------------------------------------------- New Game Old Game podcast
// Episode facts from Apple Podcasts and Spotify (captured 2026-11-15); summaries written in our own words.
// Old Game / New Game framework from "The No Alumni Basics" (Main Brain, July 2026).
const APPLE = 'https://podcasts.apple.com/us/podcast/new-game-old-game/id1862546674';
export const EPISODES = [
  { n: 'Episode 6', title: 'When Learning Doesn’t Look Like School', date: '2026-03-03', label: 'March 3, 2026', mins: 55, url: `${APPLE}?i=1000752803796`, summary: 'Our first guest episode. Sheila shares how one son went from homeschooling to a PhD in astroparticle physics and another left high school to grow the business he started as a teenager. Not anti-school: a conversation about alignment, ownership, and letting learning look different.' },
  { n: 'Episode 5', title: 'Re-doing No Alumni Intro & Meet Skullie', date: '2026-02-25', label: 'February 25, 2026', mins: 45, url: `${APPLE}?i=1000751581668`, summary: 'The story behind Skullie, the No Alumni mascot: the forward tilt for momentum, the N and A in the goggles for vision and belonging, and the crack in the skull for scars and shared experience.' },
  { n: 'Episode 4', title: 'No Alumni to the Bone', date: '2026-02-13', label: 'February 13, 2026', mins: 50, url: `${APPLE}?i=1000749645981`, summary: 'What No Alumni is and why it exists: not anti-college, but anti-outdated thinking. Restoring professional dignity, championing nontraditional paths, and helping businesses rethink how they attract, develop, and keep talent.' },
  { n: 'Episode 3', title: 'Defining the New Game', date: '2026-01-29', label: 'January 29, 2026', mins: 33, url: `${APPLE}?i=1000747112582`, summary: 'Lessons from CES, RoofCon, and the International Roofing Expo on what the New Game rewards: adaptability, skills, proof of work, and relationships over credentials and linear career paths.' },
  { n: 'Episode 2, Part II', title: 'Old Game vs. New Game at Work: Linear Careers, Authentic Culture, and AI', date: '2025-12-30', label: 'December 30, 2025', mins: 22, url: `${APPLE}?i=1000743201938`, summary: 'Why linear careers are breaking down, specialists versus generalists, fake “New Game” culture, and why AI raises the premium on human experience and connection.' },
  { n: 'Episode 2, Part I', title: 'What We Mean by “New Game Old Game” and Why Work Feels Broken', date: '2025-12-26', label: 'December 26, 2025', mins: 27, url: `${APPLE}?i=1000742778587`, summary: 'What the Old Game of work looks like and why it is failing, why feeling stuck is often a systems problem rather than a personal one, and what a more human New Game requires.' },
  { n: 'Episode 1', title: 'The New Game Old Game Podcast (Pilot)', date: '2025-12-18', label: 'December 18, 2025', mins: 23, url: `${APPLE}?i=1000741877911`, summary: 'The question behind the show: are we still playing the Old Game of work in a New Game world? Not anti-college, not a hustle-guru show, and not one right path.' },
];

const OLD_NEW = [
  ['Degrees and pedigree', 'Capability and curiosity'],
  ['Titles and hierarchy', 'Real contribution and leadership'],
  ['Test scores and resumes', 'Skills and proof of work'],
  ['Years of experience', 'Adaptability and lifelong learning'],
  ['Linear careers, “wait your turn”', 'Many paths: skilled trades, entrepreneurship, reinvention'],
  ['Compliance and “that’s how we’ve always done it”', 'Human potential, AI readiness, and authentic culture'],
  ['Hustle culture', 'Meaningful work, time, and purpose'],
];

const PODCAST_FAQ = [
  ['What is the New Game Old Game podcast?', 'New Game Old Game is the podcast from No Alumni: conversations about work, skills, alternative careers, leadership, culture, and rehumanizing work in a rapidly changing world. It explores why the Old Game of work (credentials-first thinking, linear careers, and outdated systems) is breaking, and what the New Game requires instead: skills, adaptability, authenticity, and real output.'],
  ['Who hosts New Game Old Game?', 'The show is hosted by Matt LaFleur and Greg Snyder of No Alumni, a Northeast Ohio company that celebrates every path to success.'],
  ['What is the difference between the Old Game and the New Game of work?', 'The Old Game measured credentials: degrees, pedigree, titles, test scores, and years of experience. The New Game measures capability: skills, curiosity, adaptability, proof of work, and real contribution. In short, from pedigree to potential.'],
  ['Is New Game Old Game anti-college?', 'No. The show is not anti-college, not hustle culture, and not about one right path. It is about dignity in work, valuing real skills, and questioning assumptions that no longer serve people or organizations.'],
  ['Where can I listen to New Game Old Game?', 'New Game Old Game is on Spotify, Apple Podcasts, and YouTube. The show is rated 5 out of 5 on Spotify and Apple Podcasts.'],
  ['How can an organization move from the Old Game to the New Game?', 'Start with No Alumni’s New Game Readiness Assessment, a short, practical conversation about talent strategy, team culture, workforce readiness, leadership habits, and AI, with clear next steps.'],
];

export const podcastPage = (site, link, team) => {
  const base = site.canonicalDomain || '';
  const spotify = site.socials.find((s) => s.name === 'Spotify').url;
  const youtube = site.socials.find((s) => s.name === 'YouTube').url;
  const hosts = team.filter((p) => ['greg-snyder', 'matt-lafleur'].includes(p.id));
  return {
    key: 'podcast',
    crumb: 'New Game Old Game Podcast',
    faq: PODCAST_FAQ,
    path: '/new-game-old-game/',
    title: 'New Game Old Game Podcast: Work, Skills, and Careers | No Alumni',
    ogImage: 'podcast/og.jpg',
    ogAlt: 'New Game Old Game, the No Alumni podcast: the old game measured credentials, the new game measures capability.',
    description: 'The New Game Old Game podcast from No Alumni, hosted by Matt LaFleur and Greg Snyder: why the old rules of work are breaking and what the New Game requires.',
    schema: [
      { '@type': 'PodcastSeries', '@id': `${base}/#podcast`, name: 'New Game Old Game', url: `${base}/new-game-old-game/`, image: `${base}/assets/podcast/cover.jpg`, description: PODCAST_FAQ[0][1], inLanguage: 'en-US', publisher: { '@id': `${base}/#organization` }, author: hosts.map((h) => ({ '@id': `${base}/who-we-are/#${h.id}` })), sameAs: [spotify, APPLE, youtube] },
      ...EPISODES.map((e) => ({ '@type': 'PodcastEpisode', name: `${e.n}: ${e.title}`, url: e.url, datePublished: e.date, timeRequired: `PT${e.mins}M`, description: e.summary, partOfSeries: { '@id': `${base}/#podcast` } })),
    ],
    body: `
<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <p class="eyebrow">The No Alumni podcast</p>
      <h1>New Game Old Game</h1>
      <p class="lead">Honest conversations about work, skills, alternative careers, leadership, and culture, and why the old rules no longer add up. Hosted by Matt LaFleur and Greg Snyder.</p>
      <div class="btn-row">
        <a class="btn btn-fill" href="${spotify}" rel="noopener">Listen on Spotify</a>
        <a class="btn btn-outline" href="${APPLE}" rel="noopener">Apple Podcasts</a>
        <a class="btn btn-outline" href="${youtube}" rel="noopener">YouTube</a>
      </div>
      <p class="note-line">Rated 5 out of 5 on Spotify and Apple Podcasts.</p>
    </div>
    <img class="hero-mark podcast-mark" src="${link('/assets/podcast/badge.webp')}" alt="New Game Old Game podcast badge: the No Alumni skull mascot in a hard hat, speaking into a microphone" width="480" height="480">
  </div>
</section>
<section class="section section-alt">
  <div class="wrap narrow">
    <p class="eyebrow">About the show</p>
    <h2>The old game measured credentials. The new game measures capability.</h2>
    <p class="lead">New Game Old Game explores why the Old Game of work (credentials-first thinking, linear careers, and outdated systems) is breaking, and what the New Game requires instead: skills, adaptability, authenticity, and real output.</p>
    <p>This isn’t hype, hustle culture, or anti-college. It’s honest conversation for leaders, trades and technical professionals, parents, educators, and anyone who feels the system no longer works.</p>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <p class="eyebrow">The framework</p>
    <h2>Old Game vs. New Game</h2>
    <p class="lead">The future is not about where someone started. It is about what they are capable of becoming.</p>
    <table class="bands og-ng">
      <caption>What each game values</caption>
      <thead><tr><th scope="col">The Old Game valued</th><th scope="col">The New Game values</th></tr></thead>
      <tbody>${OLD_NEW.map(([o, n]) => `<tr><td>${o}</td><td>${n}</td></tr>`).join('')}</tbody>
    </table>
    <p>You do not have to quit your job or your life to play the New Game. You reorient, build real skills, and stop outsourcing your identity to institutions or titles. <strong>From pedigree to potential.</strong></p>
  </div>
</section>
<section class="section section-alt" id="episodes">
  <div class="wrap">
    <p class="eyebrow">Listen</p>
    <h2>Episodes</h2>
    <ol class="episodes">
      ${EPISODES.map((e) => `<li class="ep"><img class="ep-icon" src="${link('/assets/podcast/icon.webp')}" alt="" width="64" height="64" loading="lazy"><div class="ep-body"><div class="ep-meta"><span class="tag">${e.n}</span><span class="muted">${e.label} · ${e.mins} min</span></div><h3><a href="${e.url}" rel="noopener">${esc(e.title)}</a></h3><p>${esc(e.summary)}</p></div></li>`).join('\n      ')}
    </ol>
    <p class="muted">New to the show? Start with Episode 1 and the two-part Episode 2, which lay out the whole framework. All episodes are on <a href="${spotify}" rel="noopener">Spotify</a>, <a href="${APPLE}" rel="noopener">Apple Podcasts</a>, and <a href="${youtube}" rel="noopener">YouTube</a>.</p>
  </div>
</section>
<section class="section section-alt">
  <div class="wrap">
    <p class="eyebrow">The mindset</p>
    <h2>What the show is about, in a few words</h2>
    <div class="art-quotes art-quotes-3">
      <figure class="art-quote"><img src="${link('/assets/brand-art/quote-make-a-mess.webp')}" width="640" height="640" loading="lazy" alt="No Alumni graphic over tangled wiring: The path to discovery is not pretty. Do not be afraid to make a mess."></figure>
      <figure class="art-quote"><img src="${link('/assets/brand-art/quote-spark-change.webp')}" width="640" height="640" loading="lazy" alt="No Alumni graphic: One person can spark change, but a team can ignite a revolution."></figure>
      <figure class="art-quote"><img src="${link('/assets/brand-art/quote-you-have-value.webp')}" width="640" height="640" loading="lazy" alt="A smiling warehouse worker in a safety vest under the words You have value, with the No Alumni badge"></figure>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <p class="eyebrow">Your hosts</p>
    <h2>Meet Matt and Greg</h2>
    <div class="grid grid-2">
      ${hosts.map((h) => `<div class="person host"><img class="avatar" src="${link(h.photo)}" alt="${esc(h.name)}" width="120" height="120" loading="lazy"><h3>${esc(h.name)}</h3><p class="role">${esc(h.title)}</p><a href="${link(`/who-we-are/#${h.id}`)}">More about ${esc(h.name.split(' ')[0])}</a></div>`).join('')}
    </div>
  </div>
</section>
<section class="section-tight">
  <div class="wrap">
    <div class="band">
      <p class="eyebrow">For leaders and organizations</p>
      <h2>Is your organization still playing the Old Game?</h2>
      <p class="lead">The New Game Readiness Assessment is a short, practical conversation about your talent strategy, team culture, workforce readiness, leadership habits, and AI. Not a high-pressure sales call. The goal is clarity.</p>
      <div class="btn-row">
        <a class="btn btn-fill" href="${site.booking.call}" rel="noopener">Book a New Game Readiness Assessment</a>
        <a class="btn btn-outline" href="${link('/speaking/')}">Bring Matt and Greg to your event</a>
      </div>
    </div>
  </div>
</section>
${faqSection(PODCAST_FAQ, 'Podcast questions')}
<section class="section-tight"><div class="wrap center"><p class="muted">Have a guest or topic idea? <a href="${link('/contact-us/')}">Tell us</a>.</p></div></section>
`,
  };
};

// Collaboration page: No Alumni and Maple Creek Advisors (Matt, 2026-11-15). Unlinked from the menu on purpose;
// share the link directly. Maple Creek facts follow maplecreekadvisors.com (site.config.mjs and content.mjs, 2026-11-15).
const MCA = {
  url: 'https://maplecreekadvisors.com/',
  booking: 'https://fantastical.app/mattlafleur/maple-creek-advisors',
  roles: { 'greg-snyder': 'Chief Culture and Team-Building Engineer', 'matt-lafleur': 'Co-founder: financial clarity, strategy, and operations', 'josh-muller': 'Co-founder: coaching, leadership, and vision' },
};
const MAPLE_FAQ = [
  ['Are No Alumni and Maple Creek Advisors the same company?', 'They are two separate brands led by the same people. Greg Snyder, Matt LaFleur, and Josh Muller lead both. No Alumni focuses on culture, careers, and The 6 Types of Working Genius for teams, schools, and events. Maple Creek Advisors focuses on business coaching, fractional CFO services, and advisory work for owner-led businesses.'],
  ['Should I contact No Alumni or Maple Creek Advisors?', 'Contact No Alumni for a keynote, workshop, team session, school program, or anything about careers and culture. Contact Maple Creek Advisors for ongoing business coaching, fractional CFO support, advisory work, or help preparing to sell a business. If you are not sure, contact either one. You will reach the same people.'],
  ['Do both offer The 6 Types of Working Genius?', 'Yes. Greg Snyder, a Certified Working Genius Facilitator, leads Working Genius work for both. No Alumni brings it to keynotes, workshops, and team sessions. Maple Creek Advisors uses it inside ongoing coaching and advisory work with owner-led companies.'],
  ['Where are No Alumni and Maple Creek Advisors based?', 'Both are based in Northeast Ohio. Maple Creek Advisors has offices in Cuyahoga Falls and Elyria. No Alumni works with clients and companies across the country and around the world.'],
];
export const mapleCreekPage = (site, link, team) => {
  const base = site.canonicalDomain || '';
  const order = ['greg-snyder', 'matt-lafleur', 'josh-muller'];
  const people = order.map((id) => team.find((p) => p.id === id)).filter(Boolean);
  return {
    key: 'maple-creek',
    crumb: 'No Alumni and Maple Creek Advisors',
    faq: MAPLE_FAQ,
    path: '/maple-creek/',
    title: 'No Alumni and Maple Creek Advisors: One Team, Two Missions | No Alumni',
    description: 'No Alumni and Maple Creek Advisors are led by the same people: Greg Snyder, Matt LaFleur, and Josh Muller. Here is how the two brands fit together and which one to call.',
    schema: [{ '@type': 'Organization', '@id': `${base}/maple-creek/#maple-creek-advisors`, name: 'Maple Creek Advisors', url: MCA.url, sameAs: [MCA.url], logo: `${base}/assets/partners/maple-creek-advisors.webp`, description: 'Coaching, financial clarity, and practical operating guidance for owner-led businesses in Northeast Ohio.', areaServed: 'Northeast Ohio', knowsAbout: ['Business coaching', 'Fractional CFO services', 'Business advisory', 'Selling a business', 'The 6 Types of Working Genius'] }],
    body: `
<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <p class="eyebrow">Partnership</p>
      <h1>No Alumni and Maple Creek Advisors: one team, two missions.</h1>
      <p class="lead">Greg Snyder, Matt LaFleur, and Josh Muller lead both. No Alumni helps people and teams find the work that fits them. Maple Creek Advisors helps owners build the business around them. Same people, same values, two ways to help.</p>
      <div class="btn-row">
        <a class="btn btn-fill" href="${site.booking.call}" rel="noopener">Talk with us</a>
        <a class="btn btn-outline" href="${MCA.url}" rel="noopener">Visit Maple Creek Advisors</a>
      </div>
    </div>
    <div class="collab-logos" aria-label="No Alumni and Maple Creek Advisors">
      <img src="${link('/assets/brand/badge.webp')}" width="240" height="240" alt="No Alumni badge, established 2023">
      <span class="collab-plus" aria-hidden="true">+</span>
      <span class="collab-mca"><img src="${link('/assets/partners/maple-creek-advisors.webp')}" width="512" height="550" alt="Maple Creek Advisors logo"></span>
    </div>
  </div>
</section>
<section class="section section-alt">
  <div class="wrap">
    <p class="eyebrow">Two brands, one team</p>
    <h2>What each one does</h2>
    <div class="grid grid-2">
      <div class="card collab-card">
        <p class="tag">No Alumni</p>
        <h3>Careers, culture, and team energy</h3>
        <p>A Northeast Ohio company and movement that celebrates every path to success and helps teams, schools, and organizations build workplaces where people thrive.</p>
        <ul class="arrows">
          <li>Working Genius keynotes, workshops, and team sessions</li>
          <li>Workplace culture consulting and training</li>
          <li>Practical AI consulting and upskilling</li>
          <li>The New Game Old Game podcast and community</li>
        </ul>
        <a href="${link('/what-we-offer/')}">What No Alumni offers</a>
      </div>
      <div class="card collab-card">
        <p class="tag">Maple Creek Advisors</p>
        <h3>Coaching, financial clarity, and operating guidance</h3>
        <p>An advisory firm for owner-led businesses, typically 5 to 50 people, with offices in Cuyahoga Falls and Elyria.</p>
        <ul class="arrows">
          <li>Business coaching and leadership team facilitation</li>
          <li>Fractional CFO support and financial clarity</li>
          <li>Integrated advisory for big decisions</li>
          <li>Help preparing to sell a business, and the BUILD owner community</li>
        </ul>
        <a href="${MCA.url}" rel="noopener">What Maple Creek Advisors offers</a>
      </div>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <p class="eyebrow">The people behind both</p>
    <h2>Same faces, two hats</h2>
    <div class="collab-people">
      ${people.map((p) => `<div class="person"><img class="avatar" src="${link(p.photo)}" alt="${esc(p.name)}" width="120" height="120" loading="lazy"><h3>${esc(p.name)}</h3><dl class="hats"><dt>No Alumni</dt><dd>${esc(p.title)}</dd><dt>Maple Creek Advisors</dt><dd>${esc(MCA.roles[p.id])}</dd></dl></div>`).join('\n      ')}
    </div>
  </div>
</section>
<section class="section section-alt">
  <div class="wrap">
    <p class="eyebrow">Where the work overlaps</p>
    <h2>Why it works better together</h2>
    <div class="grid grid-3">
      <div class="card"><h3>People and numbers in one room</h3><p>Culture problems show up on the financial statements, and financial pressure shows up in the culture. Between the two brands, one team can see both and connect them.</p></div>
      <div class="card"><h3>Working Genius at every level</h3><p>Greg Snyder, a Certified Working Genius Facilitator, leads the work for both: a keynote for a whole association through No Alumni, or a leadership team working session inside a Maple Creek engagement.</p></div>
      <div class="card"><h3>Built by people who have done the work</h3><p>Josh built and sold a construction company. Matt is a CPA and fractional CFO. Greg has spent more than 30 years in entrepreneurship, sales, marketing, and leadership. Both brands rest on that experience.</p></div>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <p class="eyebrow">Which one to call</p>
    <h2>A simple guide</h2>
    <div class="table-wrap">
      <table class="collab-table">
        <thead><tr><th scope="col">If you want</th><th scope="col">Start with</th></tr></thead>
        <tbody>
          <tr><td>A keynote, workshop, or team session</td><td><a href="${link('/speaking/')}">No Alumni</a></td></tr>
          <tr><td>A school, career, or workforce program</td><td><a href="${link('/what-we-offer/')}">No Alumni</a></td></tr>
          <tr><td>Ongoing business coaching for an owner or leadership team</td><td><a href="${MCA.url}" rel="noopener">Maple Creek Advisors</a></td></tr>
          <tr><td>Fractional CFO support or clearer financial reporting</td><td><a href="${MCA.url}" rel="noopener">Maple Creek Advisors</a></td></tr>
          <tr><td>Help preparing to sell a business</td><td><a href="${MCA.url}" rel="noopener">Maple Creek Advisors</a></td></tr>
          <tr><td>Not sure yet</td><td>Either one. You will reach the same people.</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
${faqSection(MAPLE_FAQ, 'Questions about the partnership')}
<section class="section-tight">
  <div class="wrap">
    <div class="band">
      <h2>One conversation is enough to start.</h2>
      <p class="lead">Tell us what is going on with your people, your team, or your business. We will point you to the right place, whichever brand it lives under.</p>
      <div class="btn-row">
        <a class="btn btn-fill" href="${site.booking.call}" rel="noopener">Schedule a call with No Alumni</a>
        <a class="btn btn-outline" href="${MCA.booking}" rel="noopener">Schedule with Maple Creek Advisors</a>
      </div>
    </div>
    <p class="muted small-note center">Maple Creek Advisors is not a registered CPA firm and does not provide attest services.</p>
  </div>
</section>
`,
  };
};

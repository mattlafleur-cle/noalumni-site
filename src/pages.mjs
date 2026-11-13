// Page content. Copy is carried over from the Wix site (captured 2026-11-13), with em dashes removed,
// casing cleaned up, and light structure added. Each page: { key, path, title, description, body }.
import { esc } from './layout.mjs';

const typesList = [
  ['W', 'Wonder', 'Pondering the possibility of greater potential and opportunity.'],
  ['I', 'Invention', 'Creating original and novel ideas and solutions.'],
  ['D', 'Discernment', 'Using intuition and instinct to evaluate ideas and plans.'],
  ['G', 'Galvanizing', 'Rallying and inspiring people to act around an idea.'],
  ['E', 'Enablement', 'Giving people the support and help they need.'],
  ['T', 'Tenacity', 'Pushing projects and tasks through to completion.'],
];

const offers = [
  {
    id: 'ai',
    tag: 'AI',
    name: 'AI consulting, coaching, and services',
    body: 'We help organizations turn AI into real results. From identifying practical use cases to building custom workflows and training your team, we make AI simple, ethical, and effective, so you can work smarter and stay ahead.',
  },
  {
    id: 'training',
    tag: 'Upskilling',
    name: 'Certifications, training, and upskilling',
    body: 'We provide engaging programs that build practical skills for today’s workforce and tomorrow’s opportunities. Through certifications, workshops, and tailored training, we help individuals and teams grow their capabilities, boost performance, and stay competitive in a changing world.',
  },
  {
    id: 'community',
    tag: 'Community',
    name: 'Partner and marketplace community',
    body: 'Our community connects learners, professionals, and organizations in a shared space for growth. It’s where ideas, opportunities, and resources come together, helping people discover new pathways, collaborate across industries, find great talent, and unlock career and business potential.',
  },
  {
    id: 'working-genius',
    tag: 'Team energy',
    name: 'The 6 Types of Working Genius',
    body: 'We use the Working Genius framework to help individuals and teams discover their natural strengths, reduce frustration, and get more done with greater joy. It gives your team a common language for collaboration, showing where each person thrives in the stages of work, so teams can work smarter, faster, and more effectively together.',
    more: '/working-genius/',
  },
  {
    id: 'culture',
    tag: 'Culture',
    name: 'Workplace culture consulting',
    body: 'We partner with organizations to design healthier, more effective workplace cultures. Through practical tools and tailored strategies, we help teams build trust, improve communication, and align around shared values, creating environments where people thrive and performance follows.',
    more: '/drag-calculator/',
    moreLabel: 'See what turnover is costing you',
  },
];

// Team, in the order Matt set on 2026-11-13. Dave's email link pointed to matt@ on Wix; fixed here.
const team = [
  { name: 'Greg Snyder', email: 'greg@noalumni.com', photo: '/assets/team/greg.webp' },
  { name: 'Matt LaFleur', email: 'matt@noalumni.com', photo: '/assets/team/matt.webp' },
  { name: 'Dave Hall', email: 'dave@noalumni.com', photo: '/assets/team/dave.webp' },
  { name: 'Josh Muller', email: 'josh@noalumni.com', photo: '/assets/team/josh.webp' },
  { name: 'Nolan Snyder', email: 'nolan@noalumni.com', photo: '/assets/team/nolan.webp' },
];
const initials = (n) => n.split(' ').map((p) => p[0]).join('');

const ctaBand = (site, link, heading = 'Ready to start a conversation?', text = 'Book a speaker, bring our message to your school, or talk with us about your business or team.') => `
<section class="section-tight">
  <div class="wrap">
    <div class="band">
      <h2>${heading}</h2>
      <p class="lead">${text}</p>
      <div class="btn-row">
        <a class="btn btn-fill" href="${site.booking.call}" rel="noopener">Schedule a quick call</a>
        <a class="btn btn-outline" href="${link('/contact-us/')}">Contact us</a>
      </div>
    </div>
  </div>
</section>`;

export function pages(site, link) {
  const home = {
    key: 'home',
    path: '/',
    title: 'No Alumni | Celebrating Alternative Career Paths and Vocational Joy',
    description: 'No Alumni celebrates skilled trades, modern work, and every path to success, and helps organizations build cultures where people thrive.',
    body: `
<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <p class="eyebrow">Est. 2023 · A national community and movement</p>
      <h1>We modernize culture for people, education, and business.</h1>
      <p class="lead">College isn’t for everyone, and that’s okay. We celebrate every path to success and help teams, schools, and organizations build workplaces where people do their best work.</p>
      <div class="btn-row">
        <a class="btn btn-fill" href="${site.booking.call}" rel="noopener">Schedule a quick call</a>
        <a class="btn btn-outline" href="${link('/what-we-offer/')}">What we offer</a>
      </div>
    </div>
    <img class="hero-mark" src="${link('/assets/brand/badge.webp')}" alt="No Alumni badge, established 2023" width="240" height="240">
  </div>
</section>

<section class="section section-alt">
  <div class="wrap split">
    <div>
      <p class="eyebrow">Who we are</p>
      <h2>A community redefining what success looks like.</h2>
    </div>
    <div>
      <p>A national community, movement, and network. Whether you’re in the field, on the jobsite, or leading a team, you belong here.</p>
      <p>We’re here to promote, illuminate, and equip the next generation of skilled workers, entrepreneurs, and changemakers. We celebrate all paths to success and provide the tools to thrive in a modern, evolving workforce.</p>
      <p><strong>Our community needs you, and you are welcome here.</strong></p>
      <a class="card-link" href="${link('/who-we-are/')}">Our story and our team</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <p class="eyebrow">What we offer</p>
    <h2>New game expertise, tailored to your organization.</h2>
    <p class="lead">AI, culture, and productivity: just what your team needs.</p>
    <div class="grid grid-3">
      ${offers.slice(0, 3).map((o) => `<a class="card card-plain" href="${link(`/what-we-offer/#${o.id}`)}"><span class="tag">${o.tag}</span><h3>${o.name}</h3><p>${o.body.split('. ')[0]}.</p></a>`).join('\n      ')}
    </div>
    <div class="grid grid-2 grid-gap">
      ${offers.slice(3).map((o) => `<a class="card card-plain" href="${link(`/what-we-offer/#${o.id}`)}"><span class="tag">${o.tag}</span><h3>${o.name}</h3><p>${o.body.split('. ')[0]}.</p></a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap split">
    <div>
      <p class="eyebrow">Free tool</p>
      <h2>What is turnover actually costing you?</h2>
      <p>Hiring and retention friction shows up as a number long before it shows up as a crisis. Enter four things about your team and see the range, along with a practical next step.</p>
      <a class="btn btn-outline" href="${link('/drag-calculator/')}">Try the Turnover Drag Calculator</a>
    </div>
    <div>
      <p class="eyebrow">Our story</p>
      <h3>Founded for the builders, creators, leaders, and dreamers.</h3>
      <p>No Alumni was founded for the people who follow a different path and still find success, purpose, and pride in their work. We exist to celebrate those journeys, share real stories, and prove that every path has value. Together, we promote opportunities, illuminate voices, and equip individuals and businesses to thrive.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap split">
    <div>
      <p class="eyebrow">Rep the movement</p>
      <h2>Wear your path with pride.</h2>
      <p>Hoodies, heavyweight tees, trucker hats, beanies, stickers, and more, made on demand to avoid waste.</p>
      <a class="btn btn-outline" href="${site.shopUrl}" rel="noopener">Shop No Alumni gear</a>
    </div>
    <div>
      <p class="eyebrow">Listen</p>
      <h2>New Game Old Game</h2>
      <p>The No Alumni podcast: real stories from people who took a different path.</p>
      <div class="btn-row">
        <a class="btn btn-outline btn-small" href="${site.socials.find((s) => s.name === 'Spotify').url}" rel="noopener">Spotify</a>
        <a class="btn btn-outline btn-small" href="${site.socials.find((s) => s.name === 'Apple Podcasts').url}" rel="noopener">Apple Podcasts</a>
        <a class="btn btn-outline btn-small" href="${site.socials.find((s) => s.name === 'YouTube').url}" rel="noopener">YouTube</a>
      </div>
    </div>
  </div>
</section>
${ctaBand(site, link, 'Get in touch', `For inquiries and partnerships, schedule a quick call or email us at <a href="mailto:${site.contact.email}">${site.contact.email}</a>.`)}
`,
  };

  const whatWeOffer = {
    key: 'what-we-offer',
    path: '/what-we-offer/',
    title: 'What We Offer | No Alumni',
    description: 'AI consulting, training and upskilling, a partner community, Working Genius, and workplace culture consulting from No Alumni.',
    body: `
<section class="hero">
  <div class="wrap narrow">
    <p class="eyebrow">What we offer</p>
    <h1>New game expertise for your team.</h1>
    <p class="lead">Five ways we help people, schools, and businesses work smarter, keep good people, and grow.</p>
    <ul class="pillars">
      <li><strong>AI</strong>Practical tools, done right.</li>
      <li><strong>Culture</strong>Trust, clarity, and shared values.</li>
      <li><strong>Productivity</strong>The right people on the right work.</li>
    </ul>
  </div>
</section>
<section class="section-tight">
  <div class="wrap grid">
    ${offers.map((o) => `<article class="card" id="${o.id}"><span class="tag">${o.tag}</span><h2 class="card-h">${o.name}</h2><p>${o.body}</p>${o.more ? `<a class="card-link" href="${link(o.more)}">${o.moreLabel || 'Learn more'}</a>` : ''}</article>`).join('\n    ')}
  </div>
</section>
${ctaBand(site, link, 'Not sure where to start?', 'Tell us about your team in a short call. You’ll leave with a practical next step, whether or not we ever work together.')}
`,
  };

  const workingGenius = {
    key: 'working-genius',
    path: '/working-genius/',
    title: 'The 6 Types of Working Genius | No Alumni',
    description: 'Working Genius helps teams find their natural strengths, reduce frustration, and build an engaged workforce, no degree required. Take the assessment.',
    body: `
<section class="hero">
  <div class="wrap narrow">
    <p class="eyebrow">Team energy</p>
    <h1>The 6 Types of Working Genius</h1>
    <p class="lead">In today’s world of high turnover and disengagement, the Working Genius framework helps companies build a thriving, empowered workforce. No degree required.</p>
    <div class="btn-row">
      <a class="btn btn-fill" href="${site.workingGeniusAssessmentUrl}" rel="noopener">Take the assessment</a>
      <a class="btn btn-outline" href="${link('/contact-us/')}">Explore partnerships</a>
    </div>
  </div>
</section>
<section class="section section-alt">
  <div class="wrap">
    <h2>What is Working Genius?</h2>
    <p class="lead">A proven framework that helps individuals and teams identify their natural talents across six types of work, helping build stronger, more engaged workplaces. Each person has two areas of genius that give them energy, and two areas of frustration that drain it.</p>
    <ul class="types">
      ${typesList.map(([l, n, d]) => `<li><b><span class="letter" aria-hidden="true">${l}</span>${n}</b><span class="def">${d}</span></li>`).join('\n      ')}
    </ul>
  </div>
</section>
<section class="section">
  <div class="wrap grid grid-2">
    <div>
      <h2>Why it works</h2>
      <ul class="checks">
        <li>Tailored learning with real-world application</li>
        <li>Proven tools for talent retention and satisfaction</li>
        <li>Hands-on training that actually works</li>
        <li>A culture-first mindset that supports every level, from apprentice to executive</li>
      </ul>
    </div>
    <div class="card">
      <h2 class="card-h">What we offer</h2>
      <ul>
        <li><strong>Training programs:</strong> soft skills, digital marketing, and financial literacy.</li>
        <li><strong>Assessments and frameworks:</strong> Working Genius, DiSC, Myers-Briggs, and more.</li>
        <li><strong>Retention and wellness initiatives:</strong> create positive, resilient cultures.</li>
        <li><strong>Tech and education:</strong> AI-powered learning, hybrid training, SEO, and more.</li>
        <li><strong>Strategic growth:</strong> microcredentials and business partnerships.</li>
      </ul>
    </div>
  </div>
</section>
${ctaBand(site, link, 'Bring Working Genius to your team.', 'Start with the assessment, or talk with us about a team map and a working session built around your results.')}
`,
  };

  const whoWeAre = {
    key: 'who-we-are',
    path: '/who-we-are/',
    title: 'Who We Are | No Alumni',
    description: 'No Alumni challenges the idea that college is the only path to a meaningful life. Meet the movement, our mission, and the faces of No Alumni.',
    body: `
<section class="hero">
  <div class="wrap narrow">
    <p class="eyebrow">Who we are</p>
    <h1>You are not less than. We are No Alumni.</h1>
    <p class="lead">No Alumni was created to challenge the idea that college is the only, or best, path to a successful, meaningful life.</p>
    <p>For too long, the trades and other non-college careers have been overlooked, undervalued, and misunderstood. Many people, especially young adults, have been made to feel “less than” because they didn’t follow a traditional academic route. We know that feeling, and we’re here to rewrite the narrative.</p>
    <p>At No Alumni, we exist to build a movement. A lifestyle. A community.</p>
    <p>Because the world doesn’t run without skilled labor, without hands-on work, without people who learn by doing. Whether you’re laying concrete, managing a team, fixing HVAC systems, running a crew, or starting your own business, your story deserves to be told.</p>
  </div>
</section>
<section class="section section-alt">
  <div class="wrap">
    <p class="eyebrow">Our mission</p>
    <h2>Promote. Illuminate. Equip.</h2>
    <div class="grid grid-3 trio">
      <div class="card"><h3>Promote</h3><p>We spotlight the current state of the workforce and elevate the voices of those who’ve chosen a different path, one rooted in grit, skill, and purpose.</p></div>
      <div class="card"><h3>Illuminate</h3><p>We share real stories from real people, not just where they are now, but how they got there. From fast food to foreman. Apprentice to entrepreneur. These stories inspire, unite, and give others the courage to take the first step.</p></div>
      <div class="card"><h3>Equip</h3><p>We provide tools, training, and community resources that help people grow. Whether it’s through soft skills, technical learning, or workplace development, we’re here to help individuals and businesses thrive.</p></div>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap">
    <p class="eyebrow">The many faces of No Alumni</p>
    <h2>Your neighbors, and we need you to join us.</h2>
    <p class="lead">An expert, eclectic, and specialized team of leaders, innovators, and practitioners who bring diverse strengths together to inspire tomorrow’s workforce and redefine what’s possible.</p>
    <div class="people">
      ${team.map((p) => `<div class="person">${p.photo ? `<img class="avatar" src="${link(p.photo)}" alt="${esc(p.name)}" width="120" height="120" loading="lazy">` : `<div class="avatar" aria-hidden="true">${initials(p.name)}</div>`}<h3>${esc(p.name)}</h3><a href="mailto:${p.email}?subject=Email%20from%20Website">${p.email}</a></div>`).join('\n      ')}
    </div>
  </div>
</section>
<section class="section section-alt">
  <div class="wrap narrow">
    <h2>More than a movement</h2>
    <p class="lead">No Alumni is for the ones who didn’t fit (or still don’t fit) the mold. It’s for the ones proving, every single day, that hard work, heart, and hustle still matter.</p>
    <p>We’re not anti-college. We’re pro-options. We’re pro everyone having a seat at the table. And we believe every story has value.</p>
    <a class="btn btn-fill" href="${link('/contact-us/')}">Get involved</a>
  </div>
</section>
`,
  };

  const contact = {
    key: 'contact-us',
    path: '/contact-us/',
    title: 'Contact Us | No Alumni',
    description: 'Book a speaker, bring the No Alumni message to your school, or start a conversation with your business or team. Email, call, or schedule a time.',
    body: `
<section class="hero">
  <div class="wrap grid grid-2">
    <div>
      <p class="eyebrow">Contact us</p>
      <h1>Let’s connect.</h1>
      <ul class="arrows">
        <li>Follow us on social media for stories, updates, and upcoming events.</li>
        <li>Shop No Alumni gear and wear your path with pride.</li>
        <li>Contact us to book a speaker, bring our message to your school, or start a conversation with your business or team.</li>
      </ul>
      <p class="lead">You don’t need a degree to make a difference. You just need a spark.</p>
    </div>
    <div>
      <form class="calc" id="contactForm" action="${site.forms.contact}" method="POST">
        <h2 class="card-h">Send us a message</h2>
        <div class="calc-grid">
          <div class="field"><label for="cf-first">First name</label><input id="cf-first" name="first_name" autocomplete="given-name" required></div>
          <div class="field"><label for="cf-last">Last name</label><input id="cf-last" name="last_name" autocomplete="family-name" required></div>
        </div>
        <div class="field"><label for="cf-email">Email</label><input id="cf-email" name="email" type="email" autocomplete="email" required></div>
        <div class="field"><label for="cf-msg">Message</label><textarea id="cf-msg" name="message" rows="5" required></textarea></div>
        <input type="hidden" name="_subject" value="Website contact form">
        <input type="hidden" name="source" value="Contact page">
        <div class="hp" aria-hidden="true"><label for="cf-gotcha">Leave this empty</label><input id="cf-gotcha" type="text" name="_gotcha" tabindex="-1" autocomplete="off"></div>
        <button class="btn btn-fill" type="submit">Send</button>
        <p class="form-status" role="status" aria-live="polite"></p>
      </form>
    </div>
  </div>
</section>
<section class="section-tight">
  <div class="wrap">
    <ul class="contact-list grid grid-3">
      <li><span class="k">Email</span><a href="mailto:${site.contact.email}?subject=Email%20from%20No%20Alumni%20Website">${site.contact.email}</a></li>
      <li><span class="k">Phone</span><a href="tel:+1${site.contact.phone.replace(/\D/g, '')}">${site.contact.phone}</a></li>
      <li><span class="k">Talk with us</span><a href="${site.booking.call}" rel="noopener">Schedule a quick call</a></li>
    </ul>
  </div>
</section>
`,
  };

  const shop = {
    key: 'shop',
    path: '/shop/',
    title: 'Shop No Alumni Gear | No Alumni',
    description: 'No Alumni hoodies, heavyweight tees, trucker hats, beanies, and stickers, made on demand to avoid waste. Rep the movement.',
    body: `
<section class="hero">
  <div class="wrap narrow">
    <p class="eyebrow">Shop</p>
    <h1>Rep the movement.</h1>
    <p class="lead">Our No Alumni shop carries comfy hoodies, heavyweight tees, trucker hats, beanies, stickers, and more, made on demand to avoid waste.</p>
    <p>Most apparel runs unisex with sizes up to 4XL. Our hoodies have a slimmer fit, so consider sizing up. Built for everyday wear.</p>
    <a class="btn btn-fill" href="${site.shopUrl}" rel="noopener">Visit the shop</a>
  </div>
</section>
`,
  };

  const calculator = {
    key: 'drag-calculator',
    path: '/drag-calculator/',
    title: 'Turnover Drag Calculator: What Is Turnover Costing You? | No Alumni',
    description: 'Estimate what hiring and retention friction is costing your organization each year, and see a practical next step.',
    body: `
<section class="hero">
  <div class="wrap narrow">
    <p class="eyebrow">No Alumni · Value calculator</p>
    <h1>What is turnover actually costing you?</h1>
    <p class="lead">Hiring and retention friction shows up as a number long before it shows up as a crisis. Enter four things about your team and see the range, along with a practical next step.</p>
  </div>
</section>
<section class="section-tight">
  <div class="wrap grid grid-2" id="calc" data-endpoint="${site.forms.calculator}" data-cta="${site.booking.call}">
    <form class="calc" id="calcInputs" novalidate>
      <h2 class="card-h">Your organization</h2>
      <div class="field"><label for="c-industry">Industry</label><select id="c-industry"></select></div>
      <div class="field"><label for="c-hc">Employee headcount</label><input id="c-hc" type="number" inputmode="numeric" min="0" step="1"></div>
      <h2 class="card-h">Turnover in the past year</h2>
      <div class="field"><label for="c-tc">People who left in the past 12 months</label><input id="c-tc" type="number" inputmode="numeric" min="0" step="1"><span class="hint warn" id="c-warn" hidden>That is more than the headcount you entered. Worth double checking.</span></div>
      <div class="field"><label for="c-sal">Average annual pay for those roles</label><input id="c-sal" type="number" inputmode="numeric" min="0" step="1000"></div>
      <div class="field"><label for="c-level">Typical level of the roles that left</label><select id="c-level"></select><span class="hint" id="c-band"></span></div>
      <button class="btn btn-outline btn-small" type="button" id="c-reset">Start over</button>
    </form>
    <div>
      <div class="result" id="c-empty"><p>Fill in the four fields and your estimated annual cost will appear here, along with a recommended next step.</p></div>
      <div class="result" id="c-result" hidden>
        <span class="k">Estimated annual cost of turnover</span>
        <span class="big" id="c-range"></span>
        <p class="fineprint" id="c-source"></p>
      </div>
      <div class="calc" id="c-gate" hidden>
        <h2 class="card-h">See what we would do about it</h2>
        <p>Tell us where to send it and we will show you the specific next step we would recommend for an organization your size, including what it typically costs.</p>
        <form id="leadForm" method="POST">
          <div class="field"><label for="leadName">Name</label><input id="leadName" name="name" autocomplete="name" required></div>
          <div class="field"><label for="leadOrg">Organization</label><input id="leadOrg" name="organization" autocomplete="organization" required></div>
          <div class="field"><label for="leadEmail">Work email</label><input id="leadEmail" name="email" type="email" autocomplete="email" required></div>
          <input type="hidden" name="industry_value"><input type="hidden" name="headcount"><input type="hidden" name="departures"><input type="hidden" name="average_pay"><input type="hidden" name="role_level"><input type="hidden" name="estimated_range"><input type="hidden" name="recommended_offer">
          <input type="hidden" name="_subject" value="New drag calculator submission">
          <div class="hp" aria-hidden="true"><label for="lead-gotcha">Leave this empty</label><input id="lead-gotcha" type="text" name="_gotcha" tabindex="-1" autocomplete="off"></div>
          <button class="btn btn-fill" type="submit">Show my next step</button>
          <p class="form-status" role="status" aria-live="polite"></p>
        </form>
      </div>
      <div class="calc" id="c-reveal" hidden>
        <span class="k">Your recommended next step</span>
        <h2 class="card-h" id="r-title"></h2>
        <p class="price" id="r-price"></p>
        <p class="fineprint" id="r-qual"></p>
        <p id="r-note"></p>
        <a class="btn btn-fill" href="${site.booking.call}" rel="noopener">Schedule a quick call</a>
      </div>
    </div>
  </div>
  <div class="wrap narrow">
    <p class="fineprint">Sources: SHRM and Gallup turnover-cost estimates (50% to 200% of annual salary), Center for American Progress (executive turnover up to 213%), and the Learning Policy Institute (roughly $25,000 to replace one teacher in large districts). These are directional planning figures for your own use, not a quote for any specific organization. Estimates assume each departure had to be replaced.</p>
  </div>
</section>
<script src="${link('/assets/calculator.js')}" defer></script>
`,
  };

  const notFound = {
    key: '404',
    path: '/404',
    hidden: true,
    title: 'Page Not Found | No Alumni',
    description: 'That page moved or no longer exists. Head to the No Alumni home page, see what we offer, or get in touch with our team.',
    body: `
<section class="hero">
  <div class="wrap narrow">
    <p class="eyebrow">404</p>
    <h1>That page took a different path.</h1>
    <p class="lead">It may have moved when we rebuilt the site.</p>
    <div class="btn-row">
      <a class="btn btn-fill" href="${link('/')}">Go to the home page</a>
      <a class="btn btn-outline" href="${link('/contact-us/')}">Contact us</a>
    </div>
  </div>
</section>
`,
  };

  return [home, whatWeOffer, workingGenius, whoWeAre, contact, shop, calculator, notFound];
}

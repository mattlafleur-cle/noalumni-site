// Mobile menu toggle. The menu is fully usable without JavaScript (it simply stays open).
document.documentElement.classList.add('js');
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });
});

// Contact form: send in the background and show a confirmation. Without JavaScript it posts normally.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button'), status = form.querySelector('.form-status');
    if (!form.reportValidity()) return;
    btn.disabled = true; btn.textContent = 'Sending...'; status.textContent = '';
    try {
      const res = await fetch(form.action, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      status.textContent = 'Thanks for reaching out. We will get back to you soon.';
      btn.textContent = 'Sent';
    } catch {
      status.textContent = 'Something went wrong sending that. Please try again, or email connect@noalumni.com.';
      btn.disabled = false; btn.textContent = 'Send';
    }
  });
});

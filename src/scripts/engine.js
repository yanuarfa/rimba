function setMsg(el, txt) { const t = el.querySelector(".msg-txt"); if (t) t.textContent = txt; else el.textContent = txt; }
function playBurst() {
  if (reduceMotion) return;
  const box = document.getElementById("burst");
  if (!box) return;
  box.classList.remove("play");
  void box.offsetWidth;
  box.classList.add("play");
}
const toggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
toggle.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
}));

function wireForm(formId, emailId, msgId, okText) {
  const form = document.getElementById(formId);
  const email = document.getElementById(emailId);
  const msg = document.getElementById(msgId);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const value = email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setMsg(msg, 'That email does not look complete. Check it and try again.');
      msg.className = 'form-msg err';
      form.classList.remove('shake');
      void form.offsetWidth;
      form.classList.add('shake');
      email.focus();
      return;
    }
    setMsg(msg, okText);
    msg.className = 'form-msg ok';
    form.reset();
  });
}
wireForm('heroForm', 'heroEmail', 'heroMsg', "You are on the list. The next Field Notes arrives in the first week of the month.");
wireForm('newsForm', 'newsEmail', 'newsMsg', 'Subscribed. One email a month, starting with the next issue.');

/* Contact form: name, a valid email, and a message with some substance. */
(function wireContact() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const name = document.getElementById('cName');
  const email = document.getElementById('cEmail');
  const message = document.getElementById('cMsg');
  const msg = document.getElementById('contactMsg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fail = text => {
      setMsg(msg, text);
      msg.className = 'form-msg err';
      form.classList.remove('shake');
      void form.offsetWidth;
      form.classList.add('shake');
    };
    if (name.value.trim().length < 2) { fail('Tell us your name first.'); name.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) { fail('That email does not look complete. Check it and try again.'); email.focus(); return; }
    if (message.value.trim().length < 10) { fail('Give us a little more detail, a sentence or two is enough.'); message.focus(); return; }
    setMsg(msg, 'Message received. Expect a reply within two working days.');
    msg.className = 'form-msg ok';
    form.reset();
  });
})();

/* Motion engine (genjutsu cast round 2, variant C "Musim Berganti"): fog reveals, counters,
   header state, scroll-progress contour line, magnetic primaries.
   Everything degrades to static content without IntersectionObserver
   or under prefers-reduced-motion. */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealIO = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); }
  }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('[data-rv]').forEach(el => revealIO.observe(el));

  let countedDone = 0;
  const countIO = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    countIO.unobserve(en.target);
    const el = en.target, target = Number(el.dataset.count), suffix = el.dataset.suffix || '';
    const start = performance.now(), dur = 1300;
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 4))).toLocaleString('en-US') + suffix;
      if (p < 1) requestAnimationFrame(tick); else if (++countedDone === 4) playBurst();
    })(start);
  }), { threshold: .5 });
  document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));
} else {
  document.querySelectorAll('[data-rv]').forEach(el => el.classList.add('in'));
}

const header = document.querySelector('.site-header');
addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* Scrollspy: light up the menu link for the section in view. */
const spyLinks = document.querySelectorAll('.main-nav a[href^="#"], .mobile-menu a[href^="#"]:not([data-cta])');
function setActiveSpy(id) {
  spyLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
}
setActiveSpy('top');
if ('IntersectionObserver' in window) {
  const spyIO = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) setActiveSpy(en.target.dataset.spy || en.target.id);
  }), { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('section[id]').forEach(sec => spyIO.observe(sec));
  const heroSec = document.querySelector('.hero');
  if (heroSec) { heroSec.dataset.spy = 'top'; spyIO.observe(heroSec); }
}

/* Scroll progress fills the contour line under the header. */
const progressBar = document.getElementById('scrollProgress');
if (progressBar && !reduceMotion) {
  let ticking = false;
  const heroPhoto = document.querySelector('.hero-photo');
  const dryLayer = document.querySelector('.ph-dry');
  const paintProgress = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    progressBar.style.transform = 'scaleX(' + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ')';
    if (dryLayer && heroPhoto) {
      const r = heroPhoto.getBoundingClientRect();
      const p = Math.min(Math.max((window.innerHeight * .15 - r.top) / (r.height * .9), 0), 1);
      dryLayer.style.opacity = (1 - p).toFixed(3);
    }
    ticking = false;
  };
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(paintProgress);
  }, { passive: true });
  paintProgress();
}

/* Primary buttons drift at most 4px toward a fine pointer. */
if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.mag').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = 'translate(' + (x * 8).toFixed(1) + 'px,' + (y * 8).toFixed(1) + 'px)';
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

document.getElementById('year').textContent = new Date().getFullYear();

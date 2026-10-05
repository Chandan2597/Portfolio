// ============================================================
// main.js — Chandan Koiri Portfolio v3
// ============================================================

// ── Theme ────────────────────────────────────────────────────
const html = document.documentElement;
const themeBtn = document.getElementById('theme-btn');
html.setAttribute('data-theme', localStorage.getItem('theme') || 'light');
themeBtn.addEventListener('click', () => {
  const t = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
});

// ── Preloader ─────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('preloader').classList.add('gone'), 1500);
});

// ── Custom Cursor ─────────────────────────────────────────────
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function animCursor() {
  rx += (mx - rx) * .14; ry += (my - ry) * .14;
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animCursor);
})();


// ── Navbar scroll ─────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Hamburger ─────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open'); navLinks.classList.remove('open');
}));

// ── Active nav link ───────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) cur = s.id; });
  navAs.forEach(a => { a.classList.toggle('active', a.getAttribute('href') === '#' + cur); });
}, { passive: true });

// ── Reveal on scroll ─────────────────────────────────────────
const revEls = document.querySelectorAll('.reveal-up');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      setTimeout(() => el.classList.add('vis'), Number(el.dataset.delay) || 0);
      revObs.unobserve(el);
    }
  });
}, { threshold: .1 });
revEls.forEach(el => revObs.observe(el));

// ── Typewriter ────────────────────────────────────────────────
const roles = ['Python/Django', 'AI/ML Enthusiast'];
const typedEl = document.getElementById('typed-role');
let ri = 0, ci = 0, deleting = false;
function type() {
  const cur = roles[ri];
  if (!deleting) { ci++; typedEl.textContent = cur.slice(0, ci); if (ci === cur.length) { deleting = true; setTimeout(type, 1800); return; } setTimeout(type, 80 + Math.random() * 40); }
  else { ci--; typedEl.textContent = cur.slice(0, ci); if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(type, 350); return; } setTimeout(type, 42); }
}
setTimeout(type, 1200);

// ── Stat counter ──────────────────────────────────────────────
document.querySelectorAll('.stat-num').forEach(el => {
  const target = +el.dataset.target;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      let n = 0;
      const step = Math.ceil(target / 30);
      const t = setInterval(() => { n = Math.min(n + step, target); el.textContent = n; if (n >= target) clearInterval(t); }, 50);
      obs.unobserve(el);
    }
  });
  obs.observe(el);
});

// ── Read more ─────────────────────────────────────────────────
const rmBtn = document.getElementById('read-more-btn');
const bioMore = document.getElementById('bio-more');
rmBtn.addEventListener('click', () => {
  const open = bioMore.classList.toggle('open');
  rmBtn.classList.toggle('open', open);
  rmBtn.querySelector('.rmbtn-text').textContent = open ? 'Read less' : 'Read more';
});

// ── Magnetic tilt on project cards ───────────────────────────
document.querySelectorAll('.pcard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - .5) * 12;
    const y = ((e.clientY - r.top) / r.height - .5) * -12;
    card.style.transform = `translateY(-8px) scale(1.01) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ── Video modal ───────────────────────────────────────────────
const modal = document.getElementById('video-modal');
const vmVid = document.getElementById('vm-video');
document.querySelectorAll('[data-video]').forEach(btn => {
  btn.addEventListener('click', () => {
    const s = btn.dataset.video; if (!s) return;
    vmVid.src = s; modal.classList.add('open'); vmVid.play().catch(() => { });
  });
});
function closeModal() { modal.classList.remove('open'); vmVid.pause(); vmVid.src = ''; }
document.getElementById('vm-close').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ============================================================
// main.js — Chandan Koiri Portfolio v3
// ============================================================

// ── Theme ────────────────────────────────────────────────────
const html = document.documentElement;
const themeBtn = document.getElementById('theme-btn');
html.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');
themeBtn.addEventListener('click', () => {
  const t = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
});

// ── Preloader ─────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('preloader').classList.add('gone'), 1500);
});

// ── Custom Cursor ─────────────────────────────────────────────
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
(function animCursor(){
  rx += (mx-rx)*.14; ry += (my-ry)*.14;
  dot.style.left  = mx+'px'; dot.style.top  = my+'px';
  ring.style.left = rx+'px'; ring.style.top = ry+'px';
  requestAnimationFrame(animCursor);
})();

// ── Background canvas — flowing particle constellation ────────
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles=[], mouse={x:-9999,y:-9999}, bgT=0;

const PARTICLE_COUNT = 110;
const CONNECT_DIST   = 155;
const MOUSE_DIST     = 180;
const MOUSE_FORCE    = 55;

function resize(){
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  spawnParticles();
}

function spawnParticles(){
  particles = [];
  for(let i=0;i<PARTICLE_COUNT;i++){
    const speed = 0.18 + Math.random()*0.28;
    const angle = Math.random()*Math.PI*2;
    particles.push({
      x: Math.random()*W,
      y: Math.random()*H,
      vx: Math.cos(angle)*speed,
      vy: Math.sin(angle)*speed,
      r:  0.8 + Math.random()*1.6,
      hue: 240 + Math.random()*50,   // violet→cyan range
      phase: Math.random()*Math.PI*2,
      wobble: 0.4 + Math.random()*0.6
    });
  }
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', e=>{ mouse.x=e.clientX; mouse.y=e.clientY; });
resize();

function drawBg(){
  ctx.clearRect(0,0,W,H);
  bgT += 0.012;
  const isDark = html.getAttribute('data-theme') !== 'light';

  // ── Update positions ──────────────────────────────────────
  particles.forEach(p => {
    // Gentle sinusoidal wobble
    p.x += p.vx + Math.sin(bgT*1.1 + p.phase)*0.012*p.wobble;
    p.y += p.vy + Math.cos(bgT*0.9 + p.phase)*0.012*p.wobble;

    // Soft wall wrap with fade-in
    if(p.x < -20) p.x = W+20;
    if(p.x > W+20) p.x = -20;
    if(p.y < -20) p.y = H+20;
    if(p.y > H+20) p.y = -20;

    // Mouse attraction — particles gently drift toward cursor
    const mdx = mouse.x - p.x;
    const mdy = mouse.y - p.y;
    const md  = Math.sqrt(mdx*mdx + mdy*mdy);
    if(md < MOUSE_DIST && md > 1){
      const f = (1 - md/MOUSE_DIST) * MOUSE_FORCE * 0.0006;
      p.vx += mdx/md * f;
      p.vy += mdy/md * f;
    }

    // Speed clamp
    const spd = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
    if(spd > 0.65){ p.vx *= 0.65/spd; p.vy *= 0.65/spd; }
    if(spd < 0.12){ p.vx *= 1.04; p.vy *= 1.04; }
  });

  // ── Draw connections ──────────────────────────────────────
  const baseAlpha = isDark ? 0.55 : 0.35;
  for(let i=0;i<particles.length;i++){
    const a = particles[i];
    for(let j=i+1;j<particles.length;j++){
      const b = particles[j];
      const dx = a.x-b.x, dy = a.y-b.y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      if(dist < CONNECT_DIST){
        const strength = 1 - dist/CONNECT_DIST;
        // Near-mouse lines glow brighter
        const mDistA = Math.hypot(a.x-mouse.x, a.y-mouse.y);
        const glow   = mDistA < MOUSE_DIST ? (1-mDistA/MOUSE_DIST)*0.6 : 0;
        const alpha  = baseAlpha * (0.12 + strength*0.7 + glow);
        const hue    = (a.hue + b.hue) / 2;
        const sat    = isDark ? 72 : 60;
        const lit    = isDark ? 68 : 45;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `hsla(${hue},${sat}%,${lit}%,${Math.min(alpha,0.55)})`;
        ctx.lineWidth = 0.6 + strength*0.6;
        ctx.stroke();
      }
    }
  }

  // ── Draw particles ────────────────────────────────────────
  particles.forEach(p => {
    const mDist = Math.hypot(p.x-mouse.x, p.y-mouse.y);
    const glow  = mDist < MOUSE_DIST ? (1-mDist/MOUSE_DIST) : 0;
    const pulse = 0.7 + 0.3*Math.sin(bgT*2.2 + p.phase);
    const alpha = isDark
      ? 0.5 + 0.35*pulse + glow*0.5
      : 0.35 + 0.25*pulse + glow*0.4;
    const radius = p.r * (1 + glow*0.8);

    // Outer glow ring for lit particles
    if(glow > 0.2){
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius*3.5, 0, Math.PI*2);
      ctx.fillStyle = `hsla(${p.hue},78%,68%,${glow*0.08})`;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI*2);
    ctx.fillStyle = `hsla(${p.hue},78%,${isDark?72:52}%,${alpha})`;
    ctx.fill();
  });

  requestAnimationFrame(drawBg);
}
drawBg();

// ── Navbar scroll ─────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', ()=>{
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, {passive:true});

// ── Hamburger ─────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', ()=>{
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=>{
  hamburger.classList.remove('open'); navLinks.classList.remove('open');
}));

// ── Active nav link ───────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', ()=>{
  let cur='';
  sections.forEach(s=>{ if(window.scrollY>=s.offsetTop-130) cur=s.id; });
  navAs.forEach(a=>{ a.classList.toggle('active', a.getAttribute('href')==='#'+cur); });
},{passive:true});

// ── Reveal on scroll ─────────────────────────────────────────
const revEls = document.querySelectorAll('.reveal-up');
const revObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el=e.target;
      setTimeout(()=>el.classList.add('vis'), Number(el.dataset.delay)||0);
      revObs.unobserve(el);
    }
  });
},{threshold:.1});
revEls.forEach(el=>revObs.observe(el));

// ── Typewriter ────────────────────────────────────────────────
const roles=['Python Developer','AI/ML Engineer'];
const typedEl = document.getElementById('typed-role');
let ri=0, ci=0, deleting=false;
function type(){
  const cur=roles[ri];
  if(!deleting){ ci++; typedEl.textContent=cur.slice(0,ci); if(ci===cur.length){ deleting=true; setTimeout(type,1800); return; } setTimeout(type,80+Math.random()*40); }
  else{ ci--; typedEl.textContent=cur.slice(0,ci); if(ci===0){ deleting=false; ri=(ri+1)%roles.length; setTimeout(type,350); return; } setTimeout(type,42); }
}
setTimeout(type,1200);

// ── Stat counter ──────────────────────────────────────────────
document.querySelectorAll('.stat-num').forEach(el=>{
  const target=+el.dataset.target;
  const obs=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){
      let n=0;
      const step=Math.ceil(target/30);
      const t=setInterval(()=>{ n=Math.min(n+step,target); el.textContent=n; if(n>=target)clearInterval(t); },50);
      obs.unobserve(el);
    }
  });
  obs.observe(el);
});

// ── Read more ─────────────────────────────────────────────────
const rmBtn=document.getElementById('read-more-btn');
const bioMore=document.getElementById('bio-more');
rmBtn.addEventListener('click',()=>{
  const open=bioMore.classList.toggle('open');
  rmBtn.classList.toggle('open',open);
  rmBtn.querySelector('.rmbtn-text').textContent=open?'Read less':'Read more';
});

// ── Magnetic tilt on project cards ───────────────────────────
document.querySelectorAll('.pcard').forEach(card=>{
  card.addEventListener('mousemove', e=>{
    const r=card.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width-.5)*12;
    const y=((e.clientY-r.top)/r.height-.5)*-12;
    card.style.transform=`translateY(-8px) scale(1.01) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave',()=>{ card.style.transform=''; });
});

// ── Video modal ───────────────────────────────────────────────
const modal=document.getElementById('video-modal');
const vmVid=document.getElementById('vm-video');
document.querySelectorAll('[data-video]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const s=btn.dataset.video; if(!s)return;
    vmVid.src=s; modal.classList.add('open'); vmVid.play().catch(()=>{});
  });
});
function closeModal(){ modal.classList.remove('open'); vmVid.pause(); vmVid.src=''; }
document.getElementById('vm-close').addEventListener('click',closeModal);
modal.addEventListener('click', e=>{ if(e.target===modal)closeModal(); });
document.addEventListener('keydown', e=>{ if(e.key==='Escape')closeModal(); });
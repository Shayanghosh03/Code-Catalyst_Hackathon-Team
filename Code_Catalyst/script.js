// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navList = document.getElementById('primary-menu');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('open');
  });
}

// Smooth scroll for in-page links
document.addEventListener('click', (e) => {
  const target = e.target;
  if (target instanceof Element && target.matches('a[href^="#"]')) {
    const id = target.getAttribute('href').slice(1);
    const section = document.getElementById(id);
    if (section) {
      e.preventDefault();
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navList && navList.classList.remove('open');
      navToggle && navToggle.setAttribute('aria-expanded', 'false');
    }
  }
});

// Current year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Particle background in hero
(function initParticles() {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0, height = 0;
  let particles = [];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.floor(rect.width * DPR);
    height = Math.floor(rect.height * DPR);
    canvas.width = width;
    canvas.height = height;
    ctx.scale(DPR, DPR);
  }

  function random(min, max) { return Math.random() * (max - min) + min; }

  function createParticles() {
    const area = canvas.clientWidth * canvas.clientHeight;
    const base = reduceMotion ? 0 : 20;
    const density = reduceMotion ? 0 : Math.floor(area / 9000);
    const count = density + base;
    particles = Array.from({ length: count }, () => ({
      x: random(0, canvas.clientWidth),
      y: random(0, canvas.clientHeight),
      vx: random(-0.2, 0.2) * (reduceMotion ? 0 : 1),
      vy: random(-0.2, 0.2) * (reduceMotion ? 0 : 1),
      r: random(1, 2.2),
      alpha: random(0.4, 0.9),
    }));
  }

  function step() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    // draw connections
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x, dy = p1.y - p2.y;
        const dist2 = dx*dx + dy*dy;
        if (!reduceMotion && dist2 < 120 * 120) {
          const opacity = 1 - dist2 / (120 * 120);
          ctx.strokeStyle = `rgba(108,140,255,${opacity * 0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // draw particles
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.fillStyle = `rgba(155,255,209,${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  const ro = new ResizeObserver(() => { resize(); createParticles(); });
  ro.observe(canvas);
  resize();
  createParticles();
  requestAnimationFrame(step);
})();

// Scroll-reveal using IntersectionObserver
(function initReveal() {
  const items = Array.from(document.querySelectorAll('.reveal'));
  if (!items.length) return;
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = Number(el.getAttribute('data-reveal-delay') || 0);
        setTimeout(() => el.classList.add('is-visible'), delay);
        io.unobserve(el);
      }
    }
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
})();

// Parallax effect on hero background
(function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const orbs = hero.querySelectorAll('.orb');
  const grid = hero.querySelector('.grid');
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 6;
      orb.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
    });
    if (grid) grid.style.transform = `translate(${x * 4}px, ${y * 4}px)`;
  });
  hero.addEventListener('mouseleave', () => {
    orbs.forEach((orb) => { orb.style.transform = ''; });
    if (grid) grid.style.transform = '';
  });
})();

// Typing announcement for upcoming hackathons
(function initTyping() {
  const el = document.getElementById('type-announce');
  if (!el) return;
  const messages = [
    'Recruiting members for upcoming hackathons…',
    'Smart India Hackathon: join our selection round!',
    'We mentor to match our requirements. Apply now.',
  ];
  let msgIndex = 0, charIndex = 0, deleting = false;
  const typingSpeed = 40;
  const pause = 1200;

  function tick() {
    const current = messages[msgIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, pause);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        msgIndex = (msgIndex + 1) % messages.length;
      }
    }
    setTimeout(tick, deleting ? 24 : typingSpeed);
  }
  tick();
})();



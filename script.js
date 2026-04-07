/* ===================================================
   DIKSSHITA T — PORTFOLIO  |  script.js
   =================================================== */

(() => {
  'use strict';

  /* ── Helper ── */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ═══════════════════════════════════════════════
     1.  BUBBLE / CUSTOM CURSOR
  ═══════════════════════════════════════════════ */
  const outer = $('#cursor-outer');
  const dot   = $('#cursor-dot');

  // Only on non-touch devices
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mx = -200, my = -200;
    let ox = -200, oy = -200;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    // Lag the outer ring slightly
    const lerp = (a, b, t) => a + (b - a) * t;
    const trackOuter = () => {
      ox = lerp(ox, mx, 0.12);
      oy = lerp(oy, my, 0.12);
      outer.style.left = ox + 'px';
      outer.style.top  = oy + 'px';
      requestAnimationFrame(trackOuter);
    };
    requestAnimationFrame(trackOuter);

    // Hover state on interactive elements
    const hoverEls = $$('a, button, input, textarea, .glass, .tag, summary');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

    document.addEventListener('mouseleave', () => {
      outer.style.opacity = '0';
      dot.style.opacity   = '0';
    });
    document.addEventListener('mouseenter', () => {
      outer.style.opacity = '1';
      dot.style.opacity   = '1';
    });
  } else {
    // Touch device — hide custom cursors
    if (outer) outer.style.display = 'none';
    if (dot)   dot.style.display   = 'none';
  }

  /* ═══════════════════════════════════════════════
     2.  NAVBAR — scroll shrink + active link
  ═══════════════════════════════════════════════ */
  const navbar   = $('#navbar');
  const navLinks = $$('.nav-links a');

  window.addEventListener('scroll', () => {
    // Shrink on scroll
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Highlight active section link
    let current = '';
    $$('section').forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  /* ═══════════════════════════════════════════════
     3.  MOBILE HAMBURGER
  ═══════════════════════════════════════════════ */
  const hamburger = $('#hamburger');
  const navList   = $('#nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navList.classList.toggle('open');
  });

  // Close on link click
  $$('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navList.classList.remove('open');
    });
  });

  /* ═══════════════════════════════════════════════
     4.  SMOOTH SCROLL (anchor links)
  ═══════════════════════════════════════════════ */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = $(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 12;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });

  /* ═══════════════════════════════════════════════
     5.  REVEAL ON SCROLL (IntersectionObserver)
  ═══════════════════════════════════════════════ */
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  $$('.reveal').forEach(el => revealObserver.observe(el));

  /* ═══════════════════════════════════════════════
     6.  CONTACT FORM
  ═══════════════════════════════════════════════ */
  const form       = $('#contact-form');
  const statusEl   = $('#form-status');
  const sendBtn    = $('#send-btn');

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      // Basic validation
      const name  = $('#cf-name').value.trim();
      const email = $('#cf-email').value.trim();
      const msg   = $('#cf-msg').value.trim();

      if (!name || !email || !msg) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Loading state
      sendBtn.disabled = true;
      sendBtn.querySelector('.btn-text').textContent = 'Sending…';
      sendBtn.querySelector('i').className = 'fas fa-spinner fa-spin';

      // Simulated send (replace with real API / EmailJS / FormSpree)
      await new Promise(res => setTimeout(res, 1600));

      form.reset();
      sendBtn.disabled = false;
      sendBtn.querySelector('.btn-text').textContent = 'Send Message';
      sendBtn.querySelector('i').className = 'fas fa-paper-plane';
      showStatus('✓ Message sent! I\'ll get back to you soon.', 'success');

      setTimeout(() => { statusEl.textContent = ''; }, 6000);
    });
  }

  function showStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.style.color = type === 'success' ? 'var(--accent2)' : '#ff6b6b';
  }

  /* ═══════════════════════════════════════════════
     7.  TYPING EFFECT for hero role
  ═══════════════════════════════════════════════ */
  const roles = ['Student Developer', 'ML Enthusiast', 'IoT Builder', 'Open Source Fan', 'Problem Solver'];
  const roleEl = document.querySelector('.hero-role');

  if (roleEl) {
    let ri = 0, ci = 0, deleting = false;

    const type = () => {
      const current = roles[ri];
      if (!deleting) {
        roleEl.innerHTML = current.slice(0, ++ci) + ' <span class="cursor-blink">_</span>';
        if (ci === current.length) {
          deleting = true;
          setTimeout(type, 2000);
          return;
        }
      } else {
        roleEl.innerHTML = current.slice(0, --ci) + ' <span class="cursor-blink">_</span>';
        if (ci === 0) {
          deleting = false;
          ri = (ri + 1) % roles.length;
        }
      }
      setTimeout(type, deleting ? 55 : 100);
    };
    type();
  }

  /* ═══════════════════════════════════════════════
     8.  PARTICLES in hero background
  ═══════════════════════════════════════════════ */
  const hero = $('.hero');
  if (hero) {
    for (let i = 0; i < 22; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const size  = Math.random() * 3 + 1;
      const left  = Math.random() * 100;
      const delay = Math.random() * 8;
      const dur   = 6 + Math.random() * 6;
      p.style.cssText = `
        position:absolute;
        left:${left}%; bottom:-10px;
        width:${size}px; height:${size}px;
        border-radius:50%;
        background:${Math.random() > .5 ? 'var(--accent)' : 'var(--accent2)'};
        opacity:0;
        animation: particleRise ${dur}s ${delay}s ease-in infinite;
        pointer-events:none;
        z-index:0;
      `;
      hero.appendChild(p);
    }

    // Inject particle keyframes once
    if (!document.getElementById('particle-kf')) {
      const style = document.createElement('style');
      style.id = 'particle-kf';
      style.textContent = `
        @keyframes particleRise {
          0%   { transform: translateY(0) scale(1);   opacity: 0; }
          10%  { opacity: .6; }
          90%  { opacity: .2; }
          100% { transform: translateY(-80vh) scale(.4); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /* ═══════════════════════════════════════════════
     9.  GLITCH on hover (reinforce effect)
  ═══════════════════════════════════════════════ */
  const glitchEl = $('.glitch');
  if (glitchEl) {
    glitchEl.addEventListener('mouseenter', () => {
      glitchEl.style.animationPlayState = 'running';
    });
  }

  /* ═══════════════════════════════════════════════
     10. YEAR auto-update in footer (future-proof)
  ═══════════════════════════════════════════════ */
  const copy = $('.footer-copy');
  if (copy) {
    copy.innerHTML = copy.innerHTML.replace(
      /\d{4}/,
      new Date().getFullYear()
    );
  }

})();

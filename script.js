/* ============================================================
   PORTFOLIO SCRIPT — Van Rayver Villaruz
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Navbar scroll state + back-to-top ---------- */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    backToTop.classList.toggle('visible', y > 500);
    updateActiveLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 2. Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    const open = navMenu.classList.toggle('active');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  navLinks.forEach(link => link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }));

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- 3. Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const pos = window.scrollY + 130;
    let current = '';

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      if (pos >= top && pos < bottom) current = sec.id;
    });

    navLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', active);
    });
  }

  /* ---------- 4. Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  // Safety net: if IntersectionObserver isn't supported,
  // just make everything visible.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    revealEls.forEach(el => observer.observe(el));

    // Failsafe: after 2 seconds, force-reveal anything still hidden
    // (protects against edge cases on slow networks or old browsers)
    setTimeout(() => {
      revealEls.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('visible');
        }
      });
    }, 2000);
  } else {
    // No IntersectionObserver → show everything immediately
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- 5. Typewriter for hero role ---------- */
  const tw = document.getElementById('typewriter');
  const roles = [
    'BSIT Student',
    'Aspiring Web Developer',
    'Problem Solver',
    'Lifelong Learner'
  ];

  if (tw && roles.length) {
    let ri = 0, ci = 0, deleting = false;
    // Start with first role fully typed so there's no empty flash
    tw.textContent = roles[0];
    ci = roles[0].length;

    function type() {
      const word = roles[ri];
      tw.textContent = deleting
        ? word.substring(0, ci - 1)
        : word.substring(0, ci + 1);

      deleting ? ci-- : ci++;

      let speed = deleting ? 35 : 75;

      if (!deleting && ci === word.length) {
        speed = 1800;
        deleting = true;
      } else if (deleting && ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
        speed = 350;
      }
      setTimeout(type, speed);
    }
    setTimeout(type, 1500);
  }

  /* ---------- 6. Contact form validation ---------- */
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.className = `form-feedback ${type}`;
    setTimeout(() => {
      feedback.textContent = '';
      feedback.className = 'form-feedback';
    }, 5500);
  }

  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');

      [name, email, message].forEach(i => i.classList.remove('error'));

      let valid = true;
      if (name.value.trim().length < 2) { name.classList.add('error'); valid = false; }
      if (!emailOk(email.value.trim())) { email.classList.add('error'); valid = false; }
      if (message.value.trim().length < 5) { message.classList.add('error'); valid = false; }

      if (!valid) {
        showFeedback('Please check the highlighted fields.', 'error');
        return;
      }

      showFeedback(`Thanks, ${name.value.trim()}! Message received — I'll reply soon.`, 'success');
      form.reset();
    });

    form.querySelectorAll('input, textarea').forEach(i => {
      i.addEventListener('input', () => i.classList.remove('error'));
    });
  }

  /* ---------- 7. Smooth-scroll fallback ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ---------- 8. Init ---------- */
  onScroll();
});
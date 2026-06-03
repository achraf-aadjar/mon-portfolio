// ============================================
//  MAIN.JS — Portfolio Achraf Aadjar
// ============================================

/* ---- TYPED TEXT ---- */
let typedWords = translations['fr']['hero.typed'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typedEl = null;
let typedTimeout = null;

function typeEffect() {
  if (!typedEl) return;
  const word = typedWords[wordIndex];

  if (isDeleting) {
    typedEl.textContent = word.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = word.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === word.length) {
    speed = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % typedWords.length;
    speed = 400;
  }

  typedTimeout = setTimeout(typeEffect, speed);
}

window.updateTyped = function(newWords) {
  if (!newWords || newWords.length === 0) return;
  typedWords = newWords;
  wordIndex = 0;
  charIndex = 0;
  isDeleting = false;
  clearTimeout(typedTimeout);
  typeEffect();
};

/* ---- NAVBAR ---- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveLink();
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.id;
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

/* ---- THEME TOGGLE ---- */
function initTheme() {
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme') || 'dark';

  applyTheme(saved);

  btn.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-theme');
    applyTheme(isDark ? 'light' : 'dark');
  });
}

function applyTheme(theme) {
  const btn = document.getElementById('themeToggle');
  document.body.classList.toggle('dark-theme', theme === 'dark');
  document.body.classList.toggle('light-theme', theme === 'light');
  const sun  = btn.querySelector('.icon-sun');
  const moon = btn.querySelector('.icon-moon');
  if (sun)  sun.style.display  = theme === 'dark'  ? 'block' : 'none';
  if (moon) moon.style.display = theme === 'light' ? 'block' : 'none';
  localStorage.setItem('theme', theme);
}

/* ---- LANGUAGE SWITCHER ---- */
function initLang() {
  const buttons = document.querySelectorAll('.lang-btn');
  const saved = localStorage.getItem('lang') || 'fr';

  setLang(saved);

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      setLang(btn.dataset.lang);
    });
  });
}

/* ---- SCROLL REVEAL ---- */
function initReveal() {
  const elements = document.querySelectorAll(
    '.section-header, .about-grid, .skill-category, .project-card, .timeline-item, .contact-wrapper'
  );

  elements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ---- SKILL BAR ANIMATION ---- */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
}

/* ---- SMOOTH SCROLL ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ---- CONTACT FORM ---- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = '⏳';

    setTimeout(() => {
      btn.disabled = false;
      btn.setAttribute('data-i18n', 'form.send');
      btn.textContent = getCurrentTranslation('form.send');

      const msgs = {
        fr: '✅ Message envoyé — je vous répondrai bientôt !',
        en: '✅ Message sent — I\'ll reply soon!',
        ar: '✅ تم إرسال الرسالة — سأرد قريباً!'
      };
      note.textContent = msgs[currentLang] || msgs.fr;
      form.reset();

      setTimeout(() => { note.textContent = ''; }, 4000);
    }, 1200);
  });
}

/* ---- CODE CARD ANIMATION ---- */
function initCodeCard() {
  const card = document.querySelector('.code-card');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
    card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = '';
  });
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  typedEl = document.getElementById('typedText');

  initNavbar();
  initTheme();
  initLang();
  initReveal();
  initSkillBars();
  initSmoothScroll();
  initContactForm();
  initCodeCard();

  setTimeout(typeEffect, 1400);
});

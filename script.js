// ── READ PROGRESS BAR ──
const progressBar = document.createElement('div');
progressBar.className = 'read-progress';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
});

// ── INTERSECTION OBSERVER: fade in sections ──
const sections = document.querySelectorAll('.report-section');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);
sections.forEach(s => observer.observe(s));

// ── ACTIVE TOC LINK ──
const tocLinks = document.querySelectorAll('.toc-item');
const sectionEls = document.querySelectorAll('section[id]');

const tocObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  },
  { rootMargin: '-20% 0px -60% 0px' }
);
sectionEls.forEach(s => tocObserver.observe(s));

// ── ANIMATED STAT COUNTERS ──
function animateCounter(el, target, suffix = '') {
  const duration = 1400;
  const startTime = performance.now();
  const isFloat = String(target).includes('.');
  const decimals = isFloat ? String(target).split('.')[1].length : 0;

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = target * ease;
    el.textContent = (isFloat ? value.toFixed(decimals) : Math.floor(value)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-number[data-target]');
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.dataset.target;
        const suffix = el.dataset.suffix || '';
        const num = parseFloat(raw);
        animateCounter(el, num, suffix);
        statObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);
statNums.forEach(el => statObserver.observe(el));

// ── PRINT / SAVE AS PDF BUTTON ──
const printBtn = document.getElementById('printBtn');
if (printBtn) {
  printBtn.addEventListener('click', () => {
    sections.forEach(s => s.classList.add('visible'));
    setTimeout(() => window.print(), 200);
  });
}

// ── SMOOTH SCROLL FOR TOC ──
tocLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = target.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    }
  });
});

console.log('%c🤖 Robotics Research Report', 'font-size:18px;font-weight:bold;color:#b5341c');
console.log('%cLoaded successfully', 'color:#2b3a4a');

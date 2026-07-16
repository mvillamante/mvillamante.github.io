/* -- THEME TOGGLE -- */
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
}

/* -- NAV -- */
const navbar = document.getElementById('nav');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', scrollY > 60);
    const secs = document.querySelectorAll('section[id]');
    let cur = '';
    secs.forEach(s => { if (scrollY > s.offsetTop - 140) cur = s.id });
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
});

/* -- SMOOTH SCROLL (eased, accounts for fixed nav height) -- */
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function smoothScrollTo(targetY, duration = 900) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();
    function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startY + distance * easeInOutCubic(progress));
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}
const navOffset = () => (navbar ? navbar.offsetHeight : 0);
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const t = document.querySelector(href);
        if (!t) return;
        e.preventDefault();
        const targetY = t.getBoundingClientRect().top + window.scrollY - navOffset();
        const distance = Math.abs(targetY - window.scrollY);
        smoothScrollTo(targetY, Math.min(1400, Math.max(500, distance * 0.6)));
    });
});

/* -- PARTICLES -- */
const cv = document.getElementById('particles');
if (cv) {
    const cx = cv.getContext('2d');
    function resize() { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; }
    resize();
    window.addEventListener('resize', resize);
    const pts = Array.from({ length: 50 }, () => ({
        x: Math.random() * cv.offsetWidth,
        y: Math.random() * cv.offsetHeight,
        r: Math.random() * .6 + .3, vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28, a: Math.random() * .5 + .2
    }));
    (function drawPts() {
        cx.clearRect(0, 0, cv.width, cv.height);
        pts.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = cv.width; if (p.x > cv.width) p.x = 0;
            if (p.y < 0) p.y = cv.height; if (p.y > cv.height) p.y = 0;
            cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, Math.PI * 2); cx.fillStyle = `rgba(131,135,195,${p.a})`; cx.fill();
        });
        pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < 120) { cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.strokeStyle = `rgba(131,135,195,${.18 * (1 - d / 120)})`; cx.lineWidth = .5; cx.stroke(); }
        }));
        requestAnimationFrame(drawPts);
    })();
}

/* -- SCROLL REVEAL (replays every time it enters/leaves view) -- */
/* Matches the pattern used in main.js, extended with the hero/summary/
   reflection elements that used to rely on hardcoded fadeUp animations. */
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        entry.target.classList.toggle('visible', entry.isIntersecting);
    });
}, { threshold: 0.15 });

document.querySelectorAll(
    '.reveal, .reveal-left, .hero-title, .hero-company, .hero-subtitle, .hero-meta, .hero-description, .hero-buttons, .summary-grid, .reflection-block p'
).forEach(el => observer.observe(el));

/* -- NAV TOGGLE -- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
const overlay = document.getElementById('navOverlay');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    overlay.classList.toggle('active');
});
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
    });
});

/* -- STAT COUNTERS (replays every time it scrolls into view) -- */
/* Selector matches the practicum HTML: .summary-card h2[data-target] */
const statNumbers = document.querySelectorAll('.summary-card h2[data-target]');
const statAnimId = new WeakMap(); // tracks the running rAF id per counter, so re-entry can cancel a stale run

function animateStat(counter) {
    if (statAnimId.has(counter)) {
        cancelAnimationFrame(statAnimId.get(counter));
    }
    const target = +counter.dataset.target;
    const suffix = counter.dataset.suffix || '';
    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 60));
    const update = () => {
        current += increment;
        if (current >= target) {
            counter.textContent = target + suffix;
            statAnimId.delete(counter);
        } else {
            counter.textContent = current;
            const id = requestAnimationFrame(update);
            statAnimId.set(counter, id);
        }
    };
    update();
}

const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStat(entry.target);
        }
        // no unobserve() here — leaving it in place lets it re-trigger on re-entry
    });
}, { threshold: .6 });
statNumbers.forEach(stat => statObserver.observe(stat));
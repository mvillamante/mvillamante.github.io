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

/* -- SCROLL REVEAL -- */
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal, .reveal-left').forEach(el => observer.observe(el));

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

/* -- STAT COUNTERS -- */
const statNumbers = document.querySelectorAll('.stat-card h2[data-target]');
const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const counter = entry.target;
        const target = +counter.dataset.target;
        const suffix = counter.dataset.suffix || '';
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 60));
        const update = () => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + suffix;
            } else {
                counter.textContent = current;
                requestAnimationFrame(update);
            }
        };
        update();
        statObserver.unobserve(counter);
    });
}, { threshold: .6 });
statNumbers.forEach(stat => statObserver.observe(stat));
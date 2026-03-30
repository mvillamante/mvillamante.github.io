/* -- CURSOR -- */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx - 5 + 'px';
    cursor.style.top = my - 5 + 'px';
});

function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx - 18 + 'px';
    ring.style.top = ry - 18 + 'px';
    requestAnimationFrame(animRing);
}

animRing();

document.querySelectorAll('a, button, .sk-card, .proj-card, .cert-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2.5)';
        ring.style.transform = 'scale(1.5)';
        ring.style.opacity = '0.8';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        ring.style.transform = 'scale(1)';
        ring.style.opacity = '0.5';
    });
});

/* -- NAV -- */
const navbar = document.getElementById('nav');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', scrollY > 60);
    const secs = document.querySelectorAll('section[id]');
    let cur2 = '';
    secs.forEach(s => { if (scrollY > s.offsetTop - 140) cur2 = s.id });
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur2));
})

/* -- SMOOTH SCROLL -- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth' });
    });
});

/* -- PARTICLES -- */
const cv = document.getElementById('particles'), cx = cv.getContext('2d');
function resize() { cv.width = innerWidth; cv.height = innerHeight; } resize();
window.addEventListener('resize', resize);
const pts = Array.from({ length: 65 }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
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
        if (d < 130) { cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.strokeStyle = `rgba(131,135,195,${.14 * (1 - d / 130)})`; cx.lineWidth = .5; cx.stroke(); }
    }));
    requestAnimationFrame(drawPts);
})();

/* -- SCROLL REVEAL -- */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .proj-card, .cert-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
})

/* SK TILE HOVER SHINE */
document.querySelectorAll('.sk').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.transform = 'scale(2.5)'; ring.style.transform = 'scale(1.5)'; ring.style.opacity = '0.9'; });
    el.addEventListener('mouseleave', () => { cursor.style.transform = 'scale(1)'; ring.style.transform = 'scale(1)'; ring.style.opacity = '0.5'; });
});

/* ONE BY ONE APPEARANCE */
document.querySelectorAll('.skill-icons').forEach(container => {
    const items = container.querySelectorAll('.sk');
    items.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.08}s`;
    });
});

/* NAVIGATION TOGGLE */
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
const overlay = document.getElementById('navOverlay');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    overlay.classList.toggle('active');
});

/* CLOSE NAV */
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        overlay.classList.remove('active');
    });
});

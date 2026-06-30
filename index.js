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
    let cur2 = '';
    secs.forEach(s => { if (scrollY > s.offsetTop - 140) cur2 = s.id });
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur2));
})

/* -- SMOOTH SCROLL (custom eased) -- */
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
        const eased = easeInOutCubic(progress);
        window.scrollTo(0, startY + distance * eased);
        if (progress < 1) {
            requestAnimationFrame(step);
        }
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
        // duration scales gently with distance for a more natural feel
        const distance = Math.abs(targetY - window.scrollY);
        const duration = Math.min(1400, Math.max(500, distance * 0.6));
        smoothScrollTo(targetY, duration);
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
        if (d < 130) { cx.beginPath(); cx.moveTo(a.x, a.y); cx.lineTo(b.x, b.y); cx.strokeStyle = `rgba(131,135,195,${.20 * (1 - d / 130)})`; cx.lineWidth = .5; cx.stroke(); }
    }));
    requestAnimationFrame(drawPts);
})();

/* -- SCROLL REVEAL -- */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, {
    threshold: 0.15
});

document.querySelectorAll(".reveal").forEach(el => {
    observer.observe(el);
});

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


document.querySelectorAll(".projects-row").forEach((slider) => {
    let isDown = false;
    let startX;
    let scrollLeft;
    slider.addEventListener("mousedown", (e) => {
        isDown = true;
        slider.classList.add("active");

        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener("mouseleave", () => {
        isDown = false;
    });
    slider.addEventListener("mouseup", () => {
        isDown = false;
    });
    slider.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5; 
        slider.scrollLeft = scrollLeft - walk;
    });
});

document.querySelectorAll(".proj-card").forEach(card => {
    const thumb = card.querySelector(".proj-thumb");
    const info = card.querySelector(".proj-info");
    card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateY = ((x / rect.width) - 0.5) * 10;
        const rotateX = ((y / rect.height) - 0.5) * -10;
        card.style.transform =
            `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        thumb.style.transform =
            `translateZ(25px)`;
        info.style.transform =
            `translateZ(18px)`;
    });
    card.addEventListener("mouseleave", () => {
        card.style.transform = "";
        thumb.style.transform = "";
        info.style.transform = "";
    });
});


const certTabs = document.querySelectorAll(".cert-tab");
const certSliders = document.querySelectorAll(".cert-slider");
certTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        certTabs.forEach(t => t.classList.remove("active"));
        certSliders.forEach(slider => {
            slider.classList.remove("active");
        });
        tab.classList.add("active");
        const target = document.getElementById(tab.dataset.tab);
        if (target) {
            target.classList.add("active");
        }
    });
});



document.querySelectorAll(".cert-slider").forEach(slider => {

    const grid = slider.querySelector(".cert-grid");
    const next = slider.querySelector(".next");
    const prev = slider.querySelector(".prev");

    const scrollAmount = 400;

    function updateButtons() {

        if (grid.scrollLeft <= 5) {
            prev.classList.add("disabled");
        } else {
            prev.classList.remove("disabled");
        }

        if (
            grid.scrollLeft + grid.clientWidth >=
            grid.scrollWidth - 5
        ) {
            next.classList.add("disabled");
        } else {
            next.classList.remove("disabled");
        }

    }
    updateButtons();
    next.addEventListener("click", () => {
        grid.scrollBy({
            left: scrollAmount,
            behavior: "smooth"
        });
    });
    prev.addEventListener("click", () => {

        grid.scrollBy({
            left: -scrollAmount,
            behavior: "smooth"
        });
    });
    grid.addEventListener("scroll", updateButtons);
});

const statNumbers = document.querySelectorAll(".stat-num");
const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const counter = entry.target;
        const target = +counter.dataset.target;
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 60));
        const update = () => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + "+";
            } else {
                counter.textContent = current;
                requestAnimationFrame(update);
            }
        }
        update();
        statObserver.unobserve(counter);
    });
}, {

    threshold: .6
});
statNumbers.forEach(stat => {
    statObserver.observe(stat);
});
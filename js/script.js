/**
 * IAST Quality Portal - script.js v7
 * Handles: navbar scroll/mobile, fixed-navbar hash scrolling, scroll animations,
 * active section links, gate tooltips, counters, and ASPICE PRM modal.
 */

/* ═══════════════════════════════════════════
   Navbar: scroll shadow + mobile toggle
═══════════════════════════════════════════ */
(function () {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.navbar__toggle');
  const nav = document.querySelector('.navbar__nav');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      const spans = toggle.querySelectorAll('span');

      if (open) {
        spans[0].style.transform = 'translateY(7px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        spans.forEach(span => {
          span.style.transform = '';
          span.style.opacity = '';
        });
      }
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.querySelectorAll('span').forEach(span => {
          span.style.transform = '';
          span.style.opacity = '';
        });
      });
    });
  }
})();

/* ═══════════════════════════════════════════
   Smooth section jumps with fixed navbar offset
═══════════════════════════════════════════ */
(function () {
  const getNavbarOffset = () => {
    const navbar = document.querySelector('.navbar');
    return navbar ? navbar.offsetHeight + 18 : 0;
  };

  const scrollToTarget = (hash, updateUrl) => {
    if (!hash || hash === '#') return false;

    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return false;

    const top = target.getBoundingClientRect().top + window.scrollY - getNavbarOffset();
    window.scrollTo({ top, behavior: 'smooth' });

    if (updateUrl) {
      history.pushState(null, '', hash);
    }

    return true;
  };

  document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const url = new URL(link.getAttribute('href'), window.location.href);

      if (url.pathname !== window.location.pathname) return;

      if (scrollToTarget(url.hash, true)) {
        event.preventDefault();
      }
    });
  });

  if (window.location.hash) {
    window.setTimeout(() => scrollToTarget(window.location.hash, false), 80);
  }
})();

/* ═══════════════════════════════════════════
   Intersection Observer: fade-up animations
═══════════════════════════════════════════ */
(function () {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
})();

/* ═══════════════════════════════════════════
   Active nav link based on current section
═══════════════════════════════════════════ */
(function () {
  const path = window.location.pathname;
  const links = Array.from(document.querySelectorAll('.navbar__link'));
  if (!links.length) return;

  const normalizePath = pathname => pathname === '' ? '/' : pathname;

  const setActiveLink = activeLink => {
    links.forEach(link => link.classList.toggle('active', link === activeLink));
  };

  const pageLink = links.find(link => {
    const href = link.getAttribute('href');
    if (!href || href.includes('#')) return false;

    const url = new URL(href, window.location.href);
    return normalizePath(url.pathname) === normalizePath(path);
  });

  if (pageLink) {
    setActiveLink(pageLink);
  }

  const sectionLinks = links
    .map(link => {
      const url = new URL(link.getAttribute('href'), window.location.href);
      if (normalizePath(url.pathname) !== normalizePath(path) || !url.hash) return null;

      const section = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  if (!sectionLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    const current = sectionLinks.find(item => item.section === visible.target);
    setActiveLink(current ? current.link : pageLink);
  }, {
    rootMargin: '-90px 0px -55% 0px',
    threshold: [0.1, 0.25, 0.5]
  });

  sectionLinks.forEach(item => observer.observe(item.section));
})();

/* ═══════════════════════════════════════════
   Gate node tooltip on hover
═══════════════════════════════════════════ */
(function () {
  const nodes = document.querySelectorAll('.gate-node__diamond');
  nodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      node.style.zIndex = '10';
    });
    node.addEventListener('mouseleave', () => {
      node.style.zIndex = '';
    });
  });
})();

/* ═══════════════════════════════════════════
   Smooth counter animation for hero stats
═══════════════════════════════════════════ */
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCounter = el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, step);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ═══════════════════════════════════════════
   Scroll Progress Bar
═══════════════════════════════════════════ */
(function () {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled  = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = scrolled + '%';
  });
})();


/* ═══════════════════════════════════════════
   Hero Particles Background
═══════════════════════════════════════════ */
(async function () {
  const container = document.getElementById('particles');
  if (!container || !window.tsParticles) return;

  try {
    await window.tsParticles.load('particles', {
      fpsLimit: 60,
      particles: {
        number: { value: 45, density: { enable: true, value_area: 800 } },
        color: { value: '#00aabb' },
        shape: { type: 'circle' },
        opacity: {
          value: 0.4,
          animation: { enable: false }
        },
        size: {
          value: { min: 1.5, max: 3.5 },
          animation: { enable: true, speed: 2, minimumValue: 1.5 }
        },
        move: {
          enable: true,
          speed: { min: 0.3, max: 1.2 },
          direction: 'none',
          random: true,
          straight: false,
          outMode: 'out'
        },
        links: {
          enable: true,
          distance: 120,
          color: '#00aabb',
          opacity: 0.25,
          width: 1.2,
          triangles: { enable: false, frequency: 5 }
        }
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: 'grab' },
          onClick: { enable: false }
        },
        modes: {
          grab: {
            distance: 180,
            line_linked: { opacity: 0.5 },
            particle:    { opacity: 0.8 }
          }
        }
      },
      background: { color: 'transparent' },
      detectRetina: true
    });
  } catch (error) {
    console.log('tsParticles initialization skipped or failed gracefully');
  }
})();



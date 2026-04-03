/* ═══════════════════════════════════════════════════════════
   NOVA STUDIO — Script principal
   Versión modular, fácil de ampliar en el futuro
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── Loader ────────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 1600);
  });
})();

/* ─── Custom Cursor ─────────────────────────────────────── */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effect on interactive elements
  const hoverTargets = 'a, button, .service-card, .product-card, .gallery-item, .filter-btn, input, select, textarea';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });
})();

/* ─── Header — scroll & sticky ─────────────────────────── */
(function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─── Hamburger menu ────────────────────────────────────── */
(function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    btn.setAttribute('aria-expanded', isOpen);
  });

  // Close on nav link click
  nav.querySelectorAll('.nav__link, .nav__cta').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !btn.contains(e.target)) {
      nav.classList.remove('open');
      btn.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
})();

/* ─── Reveal on scroll ──────────────────────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally stop observing after reveal
        // observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ─── Smooth active nav link on scroll ──────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();

/* ─── Counter animation ─────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      let current = 0;
      const step = Math.ceil(target / 80);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 20);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ─── Gallery filter ────────────────────────────────────── */
(function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter items with animation
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        if (match) {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          item.classList.remove('hidden');
          requestAnimationFrame(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => item.classList.add('hidden'), 350);
        }
      });
    });
  });
})();

/* ─── Gallery lightbox (simple) ─────────────────────────── */
(function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!galleryItems.length) return;

  // Create lightbox elements
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox__backdrop"></div>
    <div class="lightbox__content">
      <button class="lightbox__close" aria-label="Cerrar">✕</button>
      <img class="lightbox__img" src="" alt="Galería Nova Studio" />
    </div>
  `;
  document.body.appendChild(lightbox);

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    .lightbox {
      position: fixed; inset: 0; z-index: 1000;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; visibility: hidden;
      transition: opacity 0.4s ease, visibility 0.4s ease;
    }
    .lightbox.open { opacity: 1; visibility: visible; }
    .lightbox__backdrop {
      position: absolute; inset: 0;
      background: rgba(26,23,20,0.93);
      backdrop-filter: blur(8px);
    }
    .lightbox__content {
      position: relative; z-index: 1;
      max-width: 90vw; max-height: 90vh;
    }
    .lightbox__img {
      max-width: 90vw; max-height: 85vh;
      object-fit: contain; border-radius: 8px;
      transform: scale(0.9);
      transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
    }
    .lightbox.open .lightbox__img { transform: scale(1); }
    .lightbox__close {
      position: absolute; top: -2.5rem; right: 0;
      color: rgba(255,255,255,0.7); font-size: 1.2rem;
      background: none; border: none; cursor: pointer;
      transition: color 0.2s ease;
    }
    .lightbox__close:hover { color: #fff; }
  `;
  document.head.appendChild(style);

  const lightboxImg = lightbox.querySelector('.lightbox__img');

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImg.src = ''; }, 400);
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src);
    });
  });

  lightbox.querySelector('.lightbox__backdrop').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
})();

/* ─── Testimonios slider ────────────────────────────────── */
(function initTestimonialsSlider() {
  const track   = document.getElementById('testimoniosTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('testimoniosDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonio-card');
  let current = 0;
  let autoPlayTimer;

  // Determine items per view
  function getItemsPerView() {
    if (window.innerWidth <= 560) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function getMaxIndex() {
    return cards.length - getItemsPerView();
  }

  // Create dots
  function createDots() {
    dotsContainer.innerHTML = '';
    const totalDots = getMaxIndex() + 1;
    for (let i = 0; i <= getMaxIndex(); i++) {
      const dot = document.createElement('button');
      dot.className = 'testimonios__dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Ir a testimonio ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.testimonios__dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, getMaxIndex()));
    // Card width + gap
    const cardWidth = cards[0].offsetWidth;
    const gap = 24; // 1.5rem
    track.style.transform = `translateX(-${current * (cardWidth + gap)}px)`;
    updateDots();
    resetAutoPlay();
  }

  function next() { goTo(current >= getMaxIndex() ? 0 : current + 1); }
  function prev() { goTo(current <= 0 ? getMaxIndex() : current - 1); }

  function startAutoPlay() {
    autoPlayTimer = setInterval(next, 4500);
  }
  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  });

  // Init
  createDots();
  startAutoPlay();
  window.addEventListener('resize', () => {
    current = 0;
    goTo(0);
    createDots();
  });
})();

/* ─── Reservation form validation ───────────────────────── */
(function initReservationForm() {
  const form    = document.getElementById('reservaForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  // Set min date to today
  const dateInput = document.getElementById('fecha');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  function showError(fieldId, msg) {
    const el = document.getElementById(fieldId + 'Error');
    const input = document.getElementById(fieldId);
    if (el) el.textContent = msg;
    if (input) input.style.borderColor = '#c0392b';
  }
  function clearError(fieldId) {
    const el = document.getElementById(fieldId + 'Error');
    const input = document.getElementById(fieldId);
    if (el) el.textContent = '';
    if (input) input.style.borderColor = '';
  }

  // Live validation
  ['nombre', 'telefono', 'fecha', 'hora', 'servicio'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearError(id));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const nombre   = document.getElementById('nombre');
    const telefono = document.getElementById('telefono');
    const fecha    = document.getElementById('fecha');
    const hora     = document.getElementById('hora');
    const servicio = document.getElementById('servicio');

    if (!nombre.value.trim() || nombre.value.trim().length < 2) {
      showError('nombre', 'Por favor ingresa tu nombre completo.');
      valid = false;
    } else clearError('nombre');

    if (!telefono.value.trim() || telefono.value.trim().length < 7) {
      showError('telefono', 'Ingresa un número válido.');
      valid = false;
    } else clearError('telefono');

    if (!fecha.value) {
      showError('fecha', 'Selecciona una fecha.');
      valid = false;
    } else clearError('fecha');

    if (!hora.value) {
      showError('hora', 'Selecciona una hora.');
      valid = false;
    } else clearError('hora');

    if (!servicio.value) {
      showError('servicio', 'Elige un servicio.');
      valid = false;
    } else clearError('servicio');

    if (!valid) return;

    // Submit success simulation
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('visible');
      // Reset after 8 seconds
      setTimeout(() => {
        form.reset();
        form.style.display = '';
        success.classList.remove('visible');
        submitBtn.textContent = 'Confirmar Reserva';
        submitBtn.disabled = false;
      }, 8000);
    }, 1200);
  });
})();

/* ─── Add to cart toast ─────────────────────────────────── */
function addToCart(btn) {
  const toast = document.getElementById('cartToast');
  if (!toast) return;

  // Visual feedback on button
  const original = btn.textContent;
  btn.textContent = '✓ Añadido';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
  }, 2000);

  // Show toast
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ─── Newsletter subscribe ──────────────────────────────── */
function subscribeNewsletter(btn) {
  const input = btn.previousElementSibling;
  if (!input || !input.value.trim()) {
    input.style.borderColor = '#c0392b';
    input.placeholder = 'Ingresa tu correo';
    setTimeout(() => { input.style.borderColor = ''; }, 2000);
    return;
  }
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRx.test(input.value)) {
    input.style.borderColor = '#c0392b';
    return;
  }
  btn.textContent = '✓';
  btn.style.background = '#4CAF50';
  input.value = '';
  input.placeholder = '¡Suscripta! Gracias';
  setTimeout(() => {
    btn.textContent = '→';
    btn.style.background = '';
    input.placeholder = 'tu@correo.com';
  }, 4000);
}

/* ─── Back to top ───────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ─── Smooth scroll for all anchor links ────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerHeight = document.getElementById('header')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ─── Parallax on hero image ─────────────────────────────── */
(function initParallax() {
  const heroImg = document.querySelector('.hero__img');
  if (!heroImg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        heroImg.style.transform = `translateY(${scrollY * 0.3}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════
   MÓDULO DE EXPANSIÓN FUTURA
   Para añadir nuevas secciones o funcionalidades:
   1. Crea un nuevo IIFE o función con nombre descriptivo
   2. Añade el HTML en index.html dentro de la sección correcta
   3. Añade estilos en styles.css bajo el comentario de la sección
   4. Importa o agrega el JS aquí abajo
═══════════════════════════════════════════════════════════ */

/* ─── Init all ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Log para desarrollo
  console.log(
    '%cNOVA STUDIO%c — La protagonista eres tú',
    'color:#C4AD97;font-size:1.2rem;font-weight:bold;font-family:Georgia,serif;',
    'color:#6B6460;font-size:0.9rem;'
  );
});
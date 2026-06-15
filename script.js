/* ====================================================================
   Bay Greenery — site scripts
   - Wires up config.js values to links and footer fields across the site
   - Services carousel (advances by 3 on desktop, 2 on tablet, 1 on mobile)
   - Reviews auto-scroll with pause on hover / interaction
   - Project gallery lightbox
   - Smooth scroll for # anchors
   ==================================================================== */

(function () {
  'use strict';

  const config = window.BAY_GREENERY_CONFIG || {};

  document.addEventListener('DOMContentLoaded', function () {
    applyConfigToDom();
    injectAnalytics();
    initServicesCarousel();
    initReviewsAutoScroll();
    initPortfolioRouter();
    initGalleryLightbox();
    initSmoothScroll();
  });

  /* -----------------------------------------------------------------
     Apply config.js values to elements with class hooks.
     ----------------------------------------------------------------- */
  function applyConfigToDom() {
    // Booking form link
    document.querySelectorAll('.js-booking-link').forEach(function (el) {
      if (config.bookingFormUrl) {
        el.setAttribute('href', config.bookingFormUrl);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
      }
    });

    // Google Reviews "Read all" — hide if not configured.
    document.querySelectorAll('.js-reviews-link').forEach(function (el) {
      if (config.googleReviewsUrl) {
        el.setAttribute('href', config.googleReviewsUrl);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
      } else {
        hideElementOrParent(el);
      }
    });

    // "Leave a Review" CTA — hide if not configured.
    document.querySelectorAll('.js-leave-review-link').forEach(function (el) {
      if (config.leaveReviewUrl) {
        el.setAttribute('href', config.leaveReviewUrl);
        el.setAttribute('target', '_blank');
        el.setAttribute('rel', 'noopener');
      } else {
        hideElementOrParent(el);
      }
    });

    // Instagram link — hide if not configured.
    document.querySelectorAll('.js-instagram-link').forEach(function (el) {
      if (config.instagramUrl) {
        el.setAttribute('href', config.instagramUrl);
      } else {
        hideElementOrParent(el);
      }
    });

    // Footer contact wiring
    document.querySelectorAll('.js-email-link').forEach(function (el) {
      if (config.email) {
        el.setAttribute('href', 'mailto:' + config.email);
        el.textContent = config.email;
      }
    });

    document.querySelectorAll('.js-phone-link').forEach(function (el) {
      if (config.phoneTel) el.setAttribute('href', 'tel:' + config.phoneTel);
      if (config.phone) el.textContent = config.phone;
    });

    document.querySelectorAll('[data-config="address"]').forEach(function (el) {
      if (config.address) el.textContent = config.address;
    });

    document.querySelectorAll('[data-config="service-area"]').forEach(function (el) {
      if (Array.isArray(config.serviceArea)) {
        el.textContent = config.serviceArea.join(' • ');
      }
    });

    // License text
    document.querySelectorAll('[data-config="license"]').forEach(function (el) {
      if (config.license) el.textContent = config.license;
    });
  }

  // For inline links inside a single-link <p> we hide the whole paragraph so we
  // don't leave an orphaned em-dash. For standalone buttons we hide just the el.
  function hideElementOrParent(el) {
    const parent = el.parentElement;
    if (parent && parent.tagName === 'P' && parent.children.length === 1) {
      parent.style.display = 'none';
    } else {
      el.style.display = 'none';
    }
  }

  /* -----------------------------------------------------------------
     Inject Google Analytics if a measurement ID is configured.
     ----------------------------------------------------------------- */
  function injectAnalytics() {
    if (!config.googleAnalyticsId) return;
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(config.googleAnalyticsId);
    document.head.appendChild(gtagScript);

    const inline = document.createElement('script');
    inline.textContent =
      'window.dataLayer = window.dataLayer || [];' +
      'function gtag(){dataLayer.push(arguments);}' +
      'gtag("js", new Date());' +
      'gtag("config", "' + config.googleAnalyticsId.replace(/"/g, '') + '");';
    document.head.appendChild(inline);
  }

  /* -----------------------------------------------------------------
     Services carousel — advances by full visible group on each click.
     Falls back gracefully if controls are missing.
     ----------------------------------------------------------------- */
  function initServicesCarousel() {
    const root = document.getElementById('servicesCarousel');
    if (!root) return;
    const track = root.querySelector('.carousel-track');
    const cards = track ? track.querySelectorAll('.service-card') : [];
    const prevBtn = root.querySelector('[data-carousel-prev]');
    const nextBtn = root.querySelector('[data-carousel-next]');
    if (!track || !cards.length || !prevBtn || !nextBtn) return;

    let currentIndex = 0;

    function visibleCount() {
      const w = window.innerWidth;
      if (w <= 600) return 1;
      if (w <= 900) return 2;
      return 3;
    }

    function updateTrack() {
      const groupSize = visibleCount();
      const maxIndex = Math.max(0, cards.length - groupSize);
      if (currentIndex > maxIndex) currentIndex = maxIndex;

      const cardRect = cards[0].getBoundingClientRect();
      const trackStyles = window.getComputedStyle(track);
      const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0') || 0;
      const offset = (cardRect.width + gap) * currentIndex;
      track.style.transform = 'translateX(-' + offset + 'px)';

      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= maxIndex;
    }

    prevBtn.addEventListener('click', function () {
      currentIndex = Math.max(0, currentIndex - visibleCount());
      updateTrack();
    });

    nextBtn.addEventListener('click', function () {
      const maxIndex = Math.max(0, cards.length - visibleCount());
      currentIndex = Math.min(maxIndex, currentIndex + visibleCount());
      updateTrack();
    });

    window.addEventListener('resize', updateTrack);
    updateTrack();
    setTimeout(updateTrack, 100);
    window.addEventListener('load', updateTrack);
  }

  /* -----------------------------------------------------------------
     Reviews auto-scroll — continuous horizontal drift.
     Pauses on hover, touch, or focus.
     ----------------------------------------------------------------- */
  function initReviewsAutoScroll() {
    const root = document.getElementById('reviewsCarousel');
    if (!root) return;
    const viewport = root.querySelector('.reviews-viewport');
    const track = root.querySelector('.reviews-track');
    if (!viewport || !track) return;

    const cards = track.querySelectorAll('.review-card');
    if (!cards.length) return;

    cards.forEach(function (card) {
      track.appendChild(card.cloneNode(true));
    });

    track.style.transition = 'none';
    let offset = 0;
    let paused = false;
    const speedPxPerSecond = 28;
    let lastTimestamp = null;

    function step(timestamp) {
      if (lastTimestamp == null) lastTimestamp = timestamp;
      const dt = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;
      if (!paused) {
        offset += speedPxPerSecond * dt;
        const trackWidth = track.scrollWidth / 2;
        if (offset >= trackWidth) offset -= trackWidth;
        track.style.transform = 'translateX(-' + offset + 'px)';
      }
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);

    function pause()  { paused = true; }
    function resume() { paused = false; lastTimestamp = null; }

    ['mouseenter', 'focusin', 'touchstart'].forEach(function (ev) {
      root.addEventListener(ev, pause, { passive: true });
    });
    ['mouseleave', 'focusout', 'touchend', 'touchcancel'].forEach(function (ev) {
      root.addEventListener(ev, resume, { passive: true });
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) pause();
      else resume();
    });
  }

  /* -----------------------------------------------------------------
     Gallery lightbox — vanilla, no library.
     Any element with .gallery-tile and a data-src attribute opens the
     larger image in a full-bleed overlay with prev/next arrows.
     Keyboard: Esc closes, ← / → navigate.
     ----------------------------------------------------------------- */
  function initGalleryLightbox() {
    const tiles = Array.from(document.querySelectorAll('.gallery-tile[data-src]'));
    if (!tiles.length) return;

    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button type="button" class="lightbox-nav lightbox-prev" aria-label="Previous photo">&#8249;</button>' +
      '<img class="lightbox-img" alt="" />' +
      '<button type="button" class="lightbox-nav lightbox-next" aria-label="Next photo">&#8250;</button>' +
      '<div class="lightbox-counter" aria-live="polite"></div>';
    document.body.appendChild(overlay);

    const img = overlay.querySelector('.lightbox-img');
    const closeBtn = overlay.querySelector('.lightbox-close');
    const prevBtn = overlay.querySelector('.lightbox-prev');
    const nextBtn = overlay.querySelector('.lightbox-next');
    const counter = overlay.querySelector('.lightbox-counter');

    // currentSet is whichever container's tiles we're navigating right now.
    // Re-derived on each open() so arrows stay inside one project / one
    // gallery, even when the page has many photo grids on it.
    let currentSet = [];
    let currentIndex = 0;

    function show(index) {
      if (!currentSet.length) return;
      currentIndex = (index + currentSet.length) % currentSet.length;
      const tile = currentSet[currentIndex];
      img.setAttribute('src', tile.getAttribute('data-src'));
      img.setAttribute('alt', tile.getAttribute('aria-label') || '');
      counter.textContent = (currentIndex + 1) + ' / ' + currentSet.length;
      const single = currentSet.length <= 1;
      prevBtn.style.display = single ? 'none' : '';
      nextBtn.style.display = single ? 'none' : '';
    }

    function open(tile) {
      const scope = tile.closest('.project-photo-grid')
        || tile.closest('.gallery-grid')
        || document;
      currentSet = Array.from(scope.querySelectorAll('.gallery-tile[data-src]'));
      const idx = currentSet.indexOf(tile);
      show(idx >= 0 ? idx : 0);
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      img.setAttribute('src', '');
      document.body.style.overflow = '';
    }

    tiles.forEach(function (tile) {
      tile.addEventListener('click', function () { open(tile); });
    });

    prevBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      show(currentIndex - 1);
    });
    nextBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      show(currentIndex + 1);
    });
    closeBtn.addEventListener('click', close);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(currentIndex - 1);
      else if (e.key === 'ArrowRight') show(currentIndex + 1);
    });
  }

  /* -----------------------------------------------------------------
     Portfolio router — sidebar nav swaps which content section is visible.
     One section visible at a time, hash-routed so direct links work.
     ----------------------------------------------------------------- */
  function initPortfolioRouter() {
    const root = document.querySelector('.portfolio-layout');
    if (!root) return;
    const sections = Array.from(root.querySelectorAll('.portfolio-section'));
    const links = Array.from(root.querySelectorAll('.portfolio-nav-link'));
    if (!sections.length || !links.length) return;

    const defaultId = 'home';
    const known = new Set(sections.map(function (s) { return s.id; }));

    function show(id) {
      if (!known.has(id)) id = defaultId;
      sections.forEach(function (s) {
        s.classList.toggle('is-active', s.id === id);
      });
      links.forEach(function (l) {
        const target = (l.getAttribute('href') || '').replace('#', '');
        l.classList.toggle('is-active', target === id);
      });
      // Mobile: close any open drawer
      root.classList.remove('sidebar-open');
    }

    function hashId() {
      const h = (window.location.hash || '').replace('#', '');
      return known.has(h) ? h : defaultId;
    }

    links.forEach(function (l) {
      l.addEventListener('click', function (e) {
        const href = l.getAttribute('href') || '';
        if (!href.startsWith('#')) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        const target = href.replace('#', '') || defaultId;
        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', '#' + target);
        } else {
          window.location.hash = target;
        }
        show(target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    window.addEventListener('popstate', function () { show(hashId()); });
    window.addEventListener('hashchange', function () { show(hashId()); });

    const toggle = root.querySelector('[data-sidebar-toggle]');
    if (toggle) {
      toggle.addEventListener('click', function () {
        root.classList.toggle('sidebar-open');
      });
    }

    show(hashId());
  }

  /* -----------------------------------------------------------------
     Smooth scroll for in-page anchor links.
     ----------------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

})();

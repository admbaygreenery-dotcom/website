/* ====================================================================
   Bay Greenery — per-page color override applier
   --------------------------------------------------------------------
   Reads color overrides from the URL query string and applies them to
   the page's CSS variables. Used by bg-compare.html to push colors
   into each iframe (via either the URL or postMessage).

   Accepted query params (all optional):
     ?bg=#F2ECE1
     &slate=#3C4A55
     &green=#5A7C3A
     &gold=#C9A04A
     &footer=#3C4A55

   Also listens for { type: 'bgc:colors', colors: {...} } postMessages
   from the parent window so the comparison wrapper can update colors
   live without a reload.

   No-op if neither URL params nor postMessage colors are present.
   Removal: delete this file and its <script> tag in each HTML page.
   ==================================================================== */

(function () {
  'use strict';

  const VAR_MAP = {
    bg:     '--color-bg-main',
    slate:  '--color-brand-slate',
    green:  '--color-accent-green',
    gold:   '--color-accent-gold',
    footer: '--color-footer-bg',
  };

  function normalizeHex(input) {
    if (!input) return null;
    const v = String(input).trim().replace(/^#/, '');
    if (/^[0-9a-fA-F]{6}$/.test(v)) return '#' + v.toUpperCase();
    if (/^[0-9a-fA-F]{3}$/.test(v)) {
      return '#' + v.split('').map(function (c) { return c + c; }).join('').toUpperCase();
    }
    return null;
  }

  function applyColors(colors) {
    if (!colors) return;
    Object.keys(VAR_MAP).forEach(function (key) {
      const hex = normalizeHex(colors[key]);
      if (hex) document.documentElement.style.setProperty(VAR_MAP[key], hex);
    });
  }

  // 1. Apply colors from URL query string on load.
  const params = new URLSearchParams(window.location.search);
  const fromQuery = {};
  Object.keys(VAR_MAP).forEach(function (key) {
    const v = params.get(key);
    if (v) fromQuery[key] = v;
  });
  applyColors(fromQuery);

  // 2. Listen for postMessage updates from the comparison wrapper.
  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'bgc:colors') return;
    applyColors(e.data.colors);
  });

  // 3. Let the parent know we're ready so it can push initial colors.
  if (window.parent !== window) {
    try { window.parent.postMessage({ type: 'bgc:ready' }, '*'); } catch (err) {}
  }
})();

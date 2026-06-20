/* ====================================================================
   Bay Greenery — background color A/B slider
   --------------------------------------------------------------------
   ONLY active when the page URL includes ?compare=1.
   Renders the same page twice — once with the warm background, once with
   the cool background — and overlays a draggable vertical handle that
   reveals more of one or the other.

   Easy to remove later:
     1. Delete this file (bg-compare.js)
     2. Delete the <script src="bg-compare.js"></script> line from each
        HTML page (one line per page)

   Activate from any page by appending ?compare=1 to its URL.
   ==================================================================== */

(function () {
  'use strict';

  const queryParams = new URLSearchParams(window.location.search);
  if (queryParams.get('compare') !== '1') {
    return;
  }

  const DEFAULT_WARM = '#F2ECE1';
  const DEFAULT_COOL = '#DAE0ED';

  // Accept "RRGGBB", "#RRGGBB", or "#RGB"; return normalized "#RRGGBB" or null.
  function normalizeHex(input) {
    if (!input) return null;
    const v = String(input).trim().replace(/^#/, '');
    if (/^[0-9a-fA-F]{6}$/.test(v)) return '#' + v.toUpperCase();
    if (/^[0-9a-fA-F]{3}$/.test(v)) {
      return '#' + v.split('').map(function (c) { return c + c; }).join('').toUpperCase();
    }
    return null;
  }

  // Use the URL params if present, fall back to the defaults Nathan picked.
  let warmHex = normalizeHex(queryParams.get('warm')) || DEFAULT_WARM;
  let coolHex = normalizeHex(queryParams.get('cool')) || DEFAULT_COOL;

  // Apply the warm color to the live page (the natural-flow layer).
  document.documentElement.style.setProperty('--color-bg-main', warmHex);

  function labelText(letter, hex) {
    return letter + ' · ' + hex;
  }

  // Update the URL bar (and the param map) without reloading the page so a
  // shared link reproduces the same comparison.
  function syncUrlParams() {
    const u = new URL(window.location.href);
    u.searchParams.set('compare', '1');
    u.searchParams.set('warm', warmHex);
    u.searchParams.set('cool', coolHex);
    window.history.replaceState(null, '', u.pathname + u.search + u.hash);
  }

  // Persist internal nav inside compare mode (including any custom colors) so
  // Nathan can walk the site without losing the slider state.
  function persistCompareOnLinks() {
    document.querySelectorAll('a[href]').forEach(function (a) {
      const href = a.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#')) return;
      if (/^(https?:|mailto:|tel:|javascript:|data:)/i.test(href)) return;
      try {
        const u = new URL(href, window.location.href);
        if (u.origin !== window.location.origin) return;
        u.searchParams.set('compare', '1');
        u.searchParams.set('warm', warmHex);
        u.searchParams.set('cool', coolHex);
        a.setAttribute('href', u.pathname + u.search + u.hash);
      } catch (e) { /* ignore malformed hrefs */ }
    });
  }

  function buildOverlay() {
    // Step 1: hoist the original page content into a wrapping layer (this
    // becomes the "warm" view; nothing else changes for it).
    const warmLayer = document.createElement('div');
    warmLayer.className = 'bgc-layer bgc-warm';
    const originalChildren = Array.from(document.body.childNodes);
    originalChildren.forEach(function (n) { warmLayer.appendChild(n); });
    document.body.appendChild(warmLayer);

    // Step 2: clone the warm layer for the "cool" view and override its
    // bg variable. The clone is positioned absolutely on top, then clipped
    // to a fraction of the viewport width that the user controls.
    const coolLayer = warmLayer.cloneNode(true);
    coolLayer.className = 'bgc-layer bgc-cool';
    coolLayer.setAttribute('aria-hidden', 'true');
    coolLayer.style.setProperty('--color-bg-main', coolHex);
    // The clone shouldn't intercept input.
    coolLayer.style.pointerEvents = 'none';
    // Remove any scripts in the cloned tree so they don't re-execute.
    coolLayer.querySelectorAll('script').forEach(function (s) { s.remove(); });
    // Strip duplicate IDs from the clone so the original keeps its hash
    // routing on portfolio.html.
    coolLayer.querySelectorAll('[id]').forEach(function (el) {
      el.removeAttribute('id');
    });
    document.body.appendChild(coolLayer);

    // Step 3: shared CSS for the layers + slider chrome.
    const style = document.createElement('style');
    style.textContent = [
      '.bgc-layer { width: 100%; }',
      '.bgc-cool {',
      '  position: absolute;',
      '  top: 0; left: 0;',
      '  clip-path: inset(0 0 0 50%);',
      '  -webkit-clip-path: inset(0 0 0 50%);',
      '}',
      '.bgc-handle {',
      '  position: fixed;',
      '  top: 0; bottom: 0;',
      '  left: 50%;',
      '  width: 2px;',
      '  background: #fff;',
      '  box-shadow: 0 0 12px rgba(0,0,0,0.55);',
      '  z-index: 99998;',
      '  cursor: ew-resize;',
      '  transform: translateX(-1px);',
      '  user-select: none;',
      '}',
      '.bgc-grip {',
      '  position: absolute;',
      '  top: 50%; left: 50%;',
      '  transform: translate(-50%, -50%);',
      '  width: 48px; height: 48px;',
      '  border-radius: 50%;',
      '  background: #fff;',
      '  box-shadow: 0 6px 18px rgba(0,0,0,0.35);',
      '  display: flex; align-items: center; justify-content: center;',
      '  font-family: system-ui, -apple-system, sans-serif;',
      '  font-size: 18px; font-weight: 700; color: #3c4a55;',
      '  cursor: ew-resize;',
      '}',
      '.bgc-label {',
      '  position: fixed; top: 14px;',
      '  background: rgba(255,255,255,0.92);',
      '  color: #3c4a55;',
      '  padding: 6px 12px;',
      '  border-radius: 999px;',
      '  font-family: system-ui, -apple-system, sans-serif;',
      '  font-size: 11px; font-weight: 700; letter-spacing: 0.08em;',
      '  text-transform: uppercase;',
      '  box-shadow: 0 2px 10px rgba(0,0,0,0.18);',
      '  z-index: 99999;',
      '  cursor: pointer;',
      '  border: 0;',
      '  transition: box-shadow 0.18s, transform 0.15s;',
      '}',
      '.bgc-label:hover {',
      '  box-shadow: 0 4px 16px rgba(0,0,0,0.28);',
      '  transform: translateY(-1px);',
      '}',
      '.bgc-label::after {',
      '  content: " ✎";',
      '  opacity: 0.55;',
      '  margin-left: 2px;',
      '}',
      '.bgc-label-warm { left: 14px; }',
      '.bgc-label-cool { right: 14px; }',
      '.bgc-exit {',
      '  position: fixed; bottom: 14px; right: 14px;',
      '  background: #3c4a55; color: #fff;',
      '  padding: 8px 14px;',
      '  border-radius: 999px;',
      '  border: 0; cursor: pointer;',
      '  font-family: system-ui, -apple-system, sans-serif;',
      '  font-size: 12px; font-weight: 700; letter-spacing: 0.06em;',
      '  text-transform: uppercase;',
      '  box-shadow: 0 4px 14px rgba(0,0,0,0.30);',
      '  z-index: 99999;',
      '}',
    ].join('\n');
    document.head.appendChild(style);

    // Step 4: handle + labels + exit button.
    const handle = document.createElement('div');
    handle.className = 'bgc-handle';
    handle.setAttribute('role', 'slider');
    handle.setAttribute('aria-label', 'Background color comparison');
    handle.setAttribute('aria-valuemin', '0');
    handle.setAttribute('aria-valuemax', '100');
    handle.setAttribute('aria-valuenow', '50');
    const grip = document.createElement('div');
    grip.className = 'bgc-grip';
    grip.textContent = '⬌';
    handle.appendChild(grip);
    document.body.appendChild(handle);

    const labelWarm = document.createElement('button');
    labelWarm.className = 'bgc-label bgc-label-warm';
    labelWarm.type = 'button';
    labelWarm.title = 'Click to change this color';
    labelWarm.textContent = labelText('A', warmHex);
    document.body.appendChild(labelWarm);

    const labelCool = document.createElement('button');
    labelCool.className = 'bgc-label bgc-label-cool';
    labelCool.type = 'button';
    labelCool.title = 'Click to change this color';
    labelCool.textContent = labelText('B', coolHex);
    document.body.appendChild(labelCool);

    // Clicking a label prompts for a new hex; updates that side's color,
    // the URL, and any internal links so the choice persists.
    function editColor(side) {
      const current = side === 'warm' ? warmHex : coolHex;
      const raw = window.prompt(
        'Enter a hex color for side ' + (side === 'warm' ? 'A (left)' : 'B (right)') +
        '.\nExamples: #F2ECE1, F2ECE1, #FEC',
        current
      );
      if (raw == null) return; // cancelled
      const next = normalizeHex(raw);
      if (!next) {
        window.alert('That doesn\'t look like a hex color. Try something like #F2ECE1 or FEC.');
        return;
      }
      if (side === 'warm') {
        warmHex = next;
        document.documentElement.style.setProperty('--color-bg-main', warmHex);
        labelWarm.textContent = labelText('A', warmHex);
      } else {
        coolHex = next;
        coolLayer.style.setProperty('--color-bg-main', coolHex);
        labelCool.textContent = labelText('B', coolHex);
      }
      syncUrlParams();
      persistCompareOnLinks();
    }
    labelWarm.addEventListener('click', function () { editColor('warm'); });
    labelCool.addEventListener('click', function () { editColor('cool'); });

    const exit = document.createElement('button');
    exit.className = 'bgc-exit';
    exit.textContent = '✕  Exit Compare';
    exit.addEventListener('click', function () {
      const u = new URL(window.location.href);
      u.searchParams.delete('compare');
      u.searchParams.delete('warm');
      u.searchParams.delete('cool');
      window.location.replace(u.pathname + (u.search ? u.search : '') + u.hash);
    });
    document.body.appendChild(exit);

    // Step 5: dragging.
    let dragging = false;
    function setPosition(clientX) {
      const pct = Math.max(0, Math.min(100, (clientX / window.innerWidth) * 100));
      handle.style.left = pct + '%';
      coolLayer.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
      coolLayer.style.webkitClipPath = 'inset(0 0 0 ' + pct + '%)';
      handle.setAttribute('aria-valuenow', String(Math.round(pct)));
    }

    handle.addEventListener('mousedown', function (e) {
      dragging = true;
      e.preventDefault();
    });
    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      setPosition(e.clientX);
    });
    window.addEventListener('mouseup', function () { dragging = false; });

    handle.addEventListener('touchstart', function (e) {
      dragging = true;
    }, { passive: true });
    window.addEventListener('touchmove', function (e) {
      if (!dragging || !e.touches.length) return;
      setPosition(e.touches[0].clientX);
    }, { passive: true });
    window.addEventListener('touchend', function () { dragging = false; });

    // Keep handle aligned on resize.
    window.addEventListener('resize', function () {
      const pct = parseFloat(handle.style.left) || 50;
      setPosition((pct / 100) * window.innerWidth);
    });
  }

  function init() {
    syncUrlParams();
    persistCompareOnLinks();
    buildOverlay();
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();

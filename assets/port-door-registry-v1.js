/**
 * Clarity Port — Door registry (P1b)
 * Port-owned only. localStorage. Rooms untouched.
 * Tracks last Enter per door. Educational companion only — not a fatwa.
 */
(function () {
  'use strict';
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  var KEY = 'clarity.port.doorRegistry.v1';
  var ROOMS = ['companion', 'yawm', 'amana', 'campus', 'craft'];
  var HREF_ROOM = {
    '/companion/': 'companion',
    '/companion': 'companion',
    '/daily/': 'yawm',
    '/daily': 'yawm',
    '/amana/': 'amana',
    '/amana': 'amana',
    '/campus/': 'campus',
    '/campus': 'campus',
    '/craft/': 'craft',
    '/craft': 'craft'
  };

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return {};
      var o = JSON.parse(raw);
      return o && typeof o === 'object' ? o : {};
    } catch (e) {
      return {};
    }
  }

  function save(map) {
    try {
      localStorage.setItem(KEY, JSON.stringify(map));
    } catch (e) { /* quota / private mode */ }
  }

  function formatStamp(iso) {
    if (!iso) return 'Not yet entered';
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return 'Not yet entered';
      // Local, readable, no scoring language
      var opts = {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      };
      return 'Last entered · ' + d.toLocaleString(undefined, opts);
    } catch (e) {
      return 'Last entered · recorded';
    }
  }

  function ensureStampEl(tower) {
    var el = tower.querySelector('.door-registry-stamp');
    if (el) return el;
    el = document.createElement('div');
    el.className = 'door-registry-stamp';
    el.setAttribute('data-port-owned', 'door-registry-v1');
    el.setAttribute('aria-live', 'polite');
    // Place before tower-actions if present, else append
    var actions = tower.querySelector('.tower-actions');
    if (actions && actions.parentNode === tower) {
      tower.insertBefore(el, actions);
    } else {
      tower.appendChild(el);
    }
    return el;
  }

  function paint() {
    var map = load();
    ROOMS.forEach(function (room) {
      var tower = document.querySelector('.tower[data-room="' + room + '"]');
      if (!tower) return;
      var el = ensureStampEl(tower);
      var iso = map[room] && map[room].lastEntered ? map[room].lastEntered : null;
      el.textContent = formatStamp(iso);
      if (iso) el.classList.add('is-visited');
      else el.classList.remove('is-visited');
    });
  }

  function record(room) {
    if (ROOMS.indexOf(room) < 0) return;
    var map = load();
    map[room] = map[room] || {};
    map[room].lastEntered = new Date().toISOString();
    map[room].enterCount = (map[room].enterCount || 0) + 1;
    save(map);
    paint();
  }

  function roomFromHref(href) {
    if (!href) return null;
    try {
      var u = new URL(href, window.location.origin);
      var path = u.pathname.replace(/\/+$/, '') || '/';
      // normalize trailing
      var withSlash = path.endsWith('/') ? path : path + '/';
      var noSlash = path.replace(/\/$/, '');
      return HREF_ROOM[withSlash] || HREF_ROOM[noSlash] || HREF_ROOM[path] || null;
    } catch (e) {
      return HREF_ROOM[href] || null;
    }
  }

  function onEnterClick(e) {
    var a = e.target && e.target.closest ? e.target.closest('a.enter') : null;
    if (!a) return;
    var room =
      (a.closest('.tower') && a.closest('.tower').getAttribute('data-room')) ||
      roomFromHref(a.getAttribute('href'));
    if (room) record(room);
    // navigation proceeds normally
  }

  function init() {
    paint();
    document.addEventListener('click', onEnterClick, true);
    // Expose minimal debug API (port-owned)
    window.ClarityPortDoorRegistry = {
      version: 'v1',
      key: KEY,
      paint: paint,
      record: record,
      clear: function () {
        try { localStorage.removeItem(KEY); } catch (e) {}
        paint();
      },
      snapshot: function () { return load(); }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

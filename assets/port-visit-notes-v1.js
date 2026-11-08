/**
 * Clarity Port — Visit notepad (P2b)
 * Port-owned only. localStorage. Not Amānah. Rooms untouched.
 * Optional timestamped visit notes. Educational only — not a fatwa.
 */
(function () {
  'use strict';
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  var KEY = 'clarity.port.visitNotes.v1';
  var MAX_NOTES = 30;
  var MAX_LEN = 800;

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return [];
      var a = JSON.parse(raw);
      return Array.isArray(a) ? a : [];
    } catch (e) {
      return [];
    }
  }

  function save(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_NOTES)));
    } catch (e) { /* private mode / quota */ }
  }

  function fmt(iso) {
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return '';
    }
  }

  function uid() {
    return 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function mount() {
    if (document.getElementById('port-visit-notes')) return;

    var root = document.createElement('section');
    root.id = 'port-visit-notes';
    root.className = 'port-visit-notes';
    root.setAttribute('data-port-owned', 'visit-notes-v1');
    root.innerHTML =
      '<div class="pvn-card">' +
      '  <header class="pvn-head">' +
      '    <div class="pvn-titles">' +
      '      <h2 class="pvn-title">Visit notes</h2>' +
      '      <p class="pvn-sub">Optional · on this device · <strong>not Amānah</strong></p>' +
      '    </div>' +
      '    <button type="button" class="pvn-toggle" aria-expanded="false" aria-controls="pvn-body">Open</button>' +
      '  </header>' +
      '  <div id="pvn-body" class="pvn-body" hidden>' +
      '    <p class="pvn-stamp">Educational only — not a fatwa · not a will · formal trusts live in Amānah</p>' +
      '    <label class="pvn-label" for="pvn-input">Note on this visit</label>' +
      '    <textarea id="pvn-input" class="pvn-input" maxlength="' + MAX_LEN + '" rows="3" placeholder="e.g. Return to Yawm after Maghrib · start tree outline later"></textarea>' +
      '    <div class="pvn-meta"><span id="pvn-count">0 / ' + MAX_LEN + '</span></div>' +
      '    <div class="pvn-actions">' +
      '      <button type="button" class="pvn-save">Save with timestamp</button>' +
      '      <button type="button" class="pvn-clear-all" title="Clear all Port visit notes">Clear all</button>' +
      '    </div>' +
      '    <ul id="pvn-list" class="pvn-list" aria-live="polite"></ul>' +
      '  </div>' +
      '</div>';

    // Insert after room grid if present, else before footer, else end of main/body
    var grid = document.querySelector('.sym-grid');
    var main = document.querySelector('main') || document.body;
    if (grid && grid.parentNode) {
      grid.parentNode.insertBefore(root, grid.nextSibling);
    } else {
      main.appendChild(root);
    }

    var body = root.querySelector('#pvn-body');
    var toggle = root.querySelector('.pvn-toggle');
    var input = root.querySelector('#pvn-input');
    var count = root.querySelector('#pvn-count');
    var list = root.querySelector('#pvn-list');
    var saveBtn = root.querySelector('.pvn-save');
    var clearBtn = root.querySelector('.pvn-clear-all');

    function render() {
      var notes = load();
      list.innerHTML = '';
      if (!notes.length) {
        list.innerHTML = '<li class="pvn-empty">No visit notes yet.</li>';
        return;
      }
      notes.forEach(function (n) {
        var li = document.createElement('li');
        li.className = 'pvn-item';
        li.setAttribute('data-id', n.id);
        li.innerHTML =
          '<div class="pvn-item-time">' + fmt(n.at) + '</div>' +
          '<div class="pvn-item-text"></div>' +
          '<button type="button" class="pvn-del" aria-label="Delete note">✕</button>';
        li.querySelector('.pvn-item-text').textContent = n.text;
        li.querySelector('.pvn-del').addEventListener('click', function () {
          save(load().filter(function (x) { return x.id !== n.id; }));
          render();
        });
        list.appendChild(li);
      });
    }

    toggle.addEventListener('click', function () {
      var open = body.hasAttribute('hidden');
      if (open) {
        body.removeAttribute('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.textContent = 'Close';
      } else {
        body.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Open';
      }
    });

    input.addEventListener('input', function () {
      count.textContent = input.value.length + ' / ' + MAX_LEN;
    });

    saveBtn.addEventListener('click', function () {
      var text = (input.value || '').trim();
      if (!text) return;
      if (text.length > MAX_LEN) text = text.slice(0, MAX_LEN);
      var notes = load();
      notes.unshift({ id: uid(), at: new Date().toISOString(), text: text });
      save(notes);
      input.value = '';
      count.textContent = '0 / ' + MAX_LEN;
      render();
      if (body.hasAttribute('hidden')) toggle.click();
    });

    clearBtn.addEventListener('click', function () {
      if (!load().length) return;
      if (window.confirm('Clear all Port visit notes on this device? This does not touch Amānah.')) {
        save([]);
        render();
      }
    });

    render();

    window.ClarityPortVisitNotes = {
      version: 'v1',
      key: KEY,
      list: load,
      clear: function () { save([]); render(); },
      add: function (text) {
        text = String(text || '').trim().slice(0, MAX_LEN);
        if (!text) return;
        var notes = load();
        notes.unshift({ id: uid(), at: new Date().toISOString(), text: text });
        save(notes);
        render();
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();

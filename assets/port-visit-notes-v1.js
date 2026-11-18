/**
 * Clarity Port — Visit notepad (P2b · smoked)
 * Hydrates SSR #port-visit-notes or mounts if missing.
 * Port-owned · localStorage · not Amānah · educational only — not a fatwa.
 */
(function () {
  "use strict";
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.__CLARITY_PORT_VISIT_NOTES_SMOKED__) return;
  window.__CLARITY_PORT_VISIT_NOTES_SMOKED__ = true;

  var KEY = "clarity.port.visitNotes.v1";
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
    } catch (e) {}
  }
  function fmt(iso) {
    try {
      var d = new Date(iso);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleString(undefined, {
        year: "numeric", month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit"
      });
    } catch (e) {
      return "";
    }
  }
  function uid() {
    return "n" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function ensureShell() {
    var root = document.getElementById("port-visit-notes");
    if (root) return root;
    root = document.createElement("section");
    root.id = "port-visit-notes";
    root.className = "port-visit-notes";
    root.setAttribute("data-port-owned", "visit-notes-v1");
    root.innerHTML =
      '<div class="pvn-card">' +
      '  <header class="pvn-head">' +
      '    <div class="pvn-titles">' +
      '      <h2 class="pvn-title">Visit notes</h2>' +
      '      <p class="pvn-sub">Optional · on this device · <strong>not Amānah</strong></p>' +
      "    </div>" +
      '    <button type="button" class="pvn-toggle" aria-expanded="false" aria-controls="pvn-body">Open</button>' +
      "  </header>" +
      '  <div id="pvn-body" class="pvn-body" hidden>' +
      '    <p class="pvn-stamp">Educational only — not a fatwa · not a will · formal trusts live in Amānah</p>' +
      '    <label class="pvn-label" for="pvn-input">Note on this visit</label>' +
      '    <textarea id="pvn-input" class="pvn-input" maxlength="' +
      MAX_LEN +
      '" rows="3" placeholder="e.g. Return to Yawm after Maghrib · start tree outline later"></textarea>' +
      '    <div class="pvn-meta"><span id="pvn-count">0 / ' +
      MAX_LEN +
      "</span></div>" +
      '    <div class="pvn-actions">' +
      '      <button type="button" class="pvn-save">Save with timestamp</button>' +
      '      <button type="button" class="pvn-clear-all">Clear all</button>' +
      "    </div>" +
      '    <ul id="pvn-list" class="pvn-list" aria-label="Saved visit notes"></ul>' +
      "  </div>" +
      "</div>";
    var grid = document.querySelector(
      ".sym-grid-castle, .sym-grid, #castle-main .full-bleed-inner, #castle-main"
    );
    var foot = document.querySelector(".port-foot");
    var wrap = document.querySelector(".port-wrap") || document.body;
    if (grid && grid.parentNode) {
      grid.parentNode.insertBefore(root, grid.nextSibling);
    } else if (foot && foot.parentNode) {
      foot.parentNode.insertBefore(root, foot);
    } else {
      wrap.appendChild(root);
    }
    return root;
  }

  function wire(root) {
    if (root.getAttribute("data-pvn-wired") === "1") return;
    root.setAttribute("data-pvn-wired", "1");
    var body = root.querySelector("#pvn-body");
    var toggle = root.querySelector(".pvn-toggle");
    var input = root.querySelector("#pvn-input");
    var count = root.querySelector("#pvn-count");
    var list = root.querySelector("#pvn-list");
    var saveBtn = root.querySelector(".pvn-save");
    var clearBtn = root.querySelector(".pvn-clear-all");
    if (!body || !toggle) return;

    function render() {
      if (!list) return;
      list.innerHTML = "";
      load().forEach(function (n) {
        var li = document.createElement("li");
        li.className = "pvn-item";
        li.innerHTML =
          '<div class="pvn-item-at"></div><div class="pvn-item-text"></div>' +
          '<button type="button" class="pvn-del" aria-label="Delete note">×</button>';
        li.querySelector(".pvn-item-at").textContent = fmt(n.at) || "Saved";
        li.querySelector(".pvn-item-text").textContent = n.text || "";
        li.querySelector(".pvn-del").addEventListener("click", function () {
          save(load().filter(function (x) { return x.id !== n.id; }));
          render();
        });
        list.appendChild(li);
      });
    }

    toggle.addEventListener("click", function () {
      var open = body.hasAttribute("hidden");
      if (open) {
        body.removeAttribute("hidden");
        toggle.setAttribute("aria-expanded", "true");
        toggle.textContent = "Close";
      } else {
        body.setAttribute("hidden", "");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Open";
      }
    });

    if (input && count) {
      input.addEventListener("input", function () {
        count.textContent = input.value.length + " / " + MAX_LEN;
      });
    }
    if (saveBtn && input) {
      saveBtn.addEventListener("click", function () {
        var text = (input.value || "").trim();
        if (!text) return;
        if (text.length > MAX_LEN) text = text.slice(0, MAX_LEN);
        var notes = load();
        notes.unshift({ id: uid(), at: new Date().toISOString(), text: text });
        save(notes);
        input.value = "";
        if (count) count.textContent = "0 / " + MAX_LEN;
        render();
        if (body.hasAttribute("hidden")) toggle.click();
      });
    }
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        if (!load().length) return;
        if (window.confirm("Clear all Port visit notes on this device? This does not touch Amānah.")) {
          save([]);
          render();
        }
      });
    }
    render();
    window.ClarityPortVisitNotes = {
      version: "v1-smoked",
      key: KEY,
      list: load,
      clear: function () { save([]); render(); },
      add: function (text) {
        text = String(text || "").trim().slice(0, MAX_LEN);
        if (!text) return;
        var notes = load();
        notes.unshift({ id: uid(), at: new Date().toISOString(), text: text });
        save(notes);
        render();
      }
    };
  }

  function boot() {
    try {
      wire(ensureShell());
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
})();

/*! companion-tab-stable-v1 · 10-cycle hardened tab owner
 * - Notes responsive
 * - Tajweed contained inside Action (moved once)
 * - No MutationObserver thrash
 * - Suppress chrome noise without blocking input
 * Educational only — not a fatwa. Companion only.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_TAB_STABLE_V1__) return;
  w.__COMPANION_TAB_STABLE_V1__ = true;

  var KEY = "clarity_companion_tab_v1";
  var VALID = {
    reminder: "tab-reminder",
    reality: "tab-reality",
    reflection: "tab-reflection",
    action: "tab-action",
    notes: "tab-notes",
    about: "tab-about"
  };
  var applying = false;
  var tajweedMoved = false;

  function isCompanion() {
    var room = (d.documentElement.getAttribute("data-clarity-room") || "").toLowerCase();
    var p = location.pathname || "";
    return room === "companion" || p.indexOf("/companion") === 0;
  }

  function normalize(id) {
    id = String(id || "").toLowerCase().replace(/^#/, "");
    if (id === "journey" || id === "commands" || id === "seerah") id = "reminder";
    if (id === "tajweed" || id === "callig" || id === "calligraphy" || id === "meme") id = "action";
    if (!VALID[id]) return null;
    return id;
  }

  function moveTajweedIntoAction() {
    if (tajweedMoved) return;
    var action = d.getElementById("tab-action");
    if (!action) return;
    var nodes = d.querySelectorAll(
      "#tj-deep-studio, #tajweed-live-card, .card-tajweed, [data-tajweed-studio], #nx-tajweed-deep-studio"
    );
    nodes.forEach(function (el) {
      if (action.contains(el)) return;
      try {
        action.appendChild(el);
      } catch (e) {}
    });
    tajweedMoved = true;
  }

  function hideOrphanTajweed(activeId) {
    var show = activeId === "action";
    /* Only hide tajweed that is STILL outside action (leaks) */
    d.querySelectorAll(
      "#tj-deep-studio, #tajweed-live-card, .card-tajweed, [data-tajweed-studio], .tj-sticky, .tajweed-sticky"
    ).forEach(function (el) {
      var inAction = el.closest("#tab-action");
      if (inAction) {
        /* panel visibility owns it */
        el.style.removeProperty("display");
        el.removeAttribute("hidden");
        return;
      }
      if (!show) {
        el.style.setProperty("display", "none", "important");
        el.setAttribute("hidden", "");
      }
    });
  }

  function ensureNotesRailButton() {
    var rail = d.getElementById("clarity-door-rail");
    if (!rail) return;
    if (rail.querySelector('[data-rail-tab="notes"], [data-rrra="notes"]')) return;
    var aboutBtn = rail.querySelector('[data-rail-tab="about"], [data-rrra="about"]');
    var btn = d.createElement("button");
    btn.type = "button";
    btn.className = "door-rail-btn rrra-rail-notes";
    btn.setAttribute("data-rail-tab", "notes");
    btn.setAttribute("data-rrra", "notes");
    btn.innerHTML = '<span class="dr-ico">✎</span><span class="dr-label">Notes</span>';
    btn.addEventListener("click", function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      showTab("notes", true);
    });
    if (aboutBtn) rail.insertBefore(btn, aboutBtn);
    else rail.appendChild(btn);
  }

  function showTab(id, write) {
    if (!isCompanion()) return;
    id = normalize(id) || "reminder";
    if (applying) return;
    applying = true;
    try {
      moveTajweedIntoAction();
      try {
        d.body.setAttribute("data-active-tab", id);
      } catch (e) {}

      var panelId = VALID[id];
      d.querySelectorAll(".tab-panel").forEach(function (panel) {
        var on = panel.id === panelId;
        panel.classList.toggle("is-active", on);
        panel.classList.toggle("active", on);
        panel.setAttribute("aria-hidden", on ? "false" : "true");
        if (on) {
          panel.removeAttribute("hidden");
          panel.style.setProperty("display", "block", "important");
          panel.style.setProperty("visibility", "visible", "important");
          panel.style.setProperty("pointer-events", "auto", "important");
        } else {
          panel.style.setProperty("display", "none", "important");
        }
      });

      d.querySelectorAll("#clarity-door-rail [data-rail-tab], #clarity-door-rail [data-rrra]").forEach(function (btn) {
        var t = (btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || "").toLowerCase();
        btn.classList.toggle("is-active", t === id);
      });

      hideOrphanTajweed(id);

      /* Notes / About must accept input */
      if (id === "notes" || id === "about") {
        var panel = d.getElementById(panelId);
        if (panel) {
          panel.querySelectorAll("textarea, input, button, a, select").forEach(function (el) {
            el.style.pointerEvents = "auto";
            try {
              el.disabled = false;
            } catch (e2) {}
          });
        }
      }

      if (write !== false) {
        try {
          localStorage.setItem(KEY, id);
        } catch (e3) {}
        try {
          var want = "#" + id;
          if ((w.location.hash || "") !== want) history.replaceState(null, "", want);
        } catch (e4) {}
      }
    } finally {
      applying = false;
    }
  }

  function suppressNoise() {
    d.documentElement.classList.add("cc-calm-on");
    ["clarity-global-nav", "clarity-visit-pill-bar", "companion-nav-clean-n34"].forEach(function (id) {
      var el = d.getElementById(id);
      if (el) el.style.display = "none";
    });
    /* Remove share gentle reminder once */
    d.querySelectorAll(".share-light-box, #share-light-text").forEach(function (el) {
      var card = el.closest(".card, .share-light-box") || el;
      try {
        card.remove();
      } catch (e) {
        card.style.display = "none";
      }
    });
  }

  function bindRail() {
    var rail = d.getElementById("clarity-door-rail");
    if (!rail || rail.__stableBound) return;
    rail.__stableBound = true;
    rail.addEventListener(
      "click",
      function (ev) {
        var btn = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab], [data-rrra]");
        if (!btn || !rail.contains(btn)) return;
        var key = (btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || "").toLowerCase();
        var n = normalize(key);
        if (!n) return;
        ev.preventDefault();
        ev.stopPropagation();
        if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
        showTab(n, true);
      },
      true
    );
  }

  function takeOwnership() {
    w.clarityShowCompanionTab = showTab;
    w.clarityOpenSectionDoor = function (id) {
      showTab(id, true);
    };
  }

  function boot() {
    if (!isCompanion()) return;
    suppressNoise();
    ensureNotesRailButton();
    bindRail();
    takeOwnership();
    moveTajweedIntoAction();
    var id =
      normalize((w.location.hash || "").replace(/^#/, "")) ||
      normalize((function () {
        try {
          return localStorage.getItem(KEY);
        } catch (e) {
          return null;
        }
      })()) ||
      "reminder";
    showTab(id, true);
    /* Limited settles — NOT a MutationObserver */
    setTimeout(function () {
      takeOwnership();
      moveTajweedIntoAction();
      showTab(
        normalize((w.location.hash || "").replace(/^#/, "")) ||
          normalize(localStorage.getItem(KEY)) ||
          id,
        false
      );
      suppressNoise();
    }, 300);
    setTimeout(function () {
      takeOwnership();
      moveTajweedIntoAction();
      hideOrphanTajweed(
        normalize(d.body.getAttribute("data-active-tab")) || "reminder"
      );
    }, 1000);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("hashchange", function () {
    var id = normalize((w.location.hash || "").replace(/^#/, ""));
    if (id) showTab(id, true);
  });
})(window, document);

/*! Companion About + tab isolation v5
 * - Reparent #tab-about if nested under another .tab-panel (notes leak)
 * - Force sole visible panel per rail selection
 * - Quarantine Tajweed deep studio to Action tab only
 * Educational only — not a fatwa. Companion only.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_COMPANION_ABOUT_TAB_FIX_V5__) return;
  w.__CLARITY_COMPANION_ABOUT_TAB_FIX_V5__ = true;

  var VALID = {
    reminder: "tab-reminder",
    reality: "tab-reality",
    reflection: "tab-reflection",
    action: "tab-action",
    notes: "tab-notes",
    about: "tab-about"
  };
  var applying = false;

  function normalize(id) {
    id = String(id || "").toLowerCase().replace(/^#/, "");
    if (id === "journey" || id === "commands" || id === "seerah") id = "reminder";
    if (id === "tajweed" || id === "callig" || id === "calligraphy" || id === "meme") id = "action";
    if (id === "info" || id === "meta") id = "about";
    if (!VALID[id]) return null;
    return id;
  }

  function ensureAboutTopLevel() {
    var about = d.getElementById("tab-about");
    var main = d.querySelector("main.main-content") || d.querySelector("main");
    if (!about) {
      if (!main) return null;
      about = d.createElement("div");
      about.id = "tab-about";
      about.className = "tab-panel companion-about-home";
      about.setAttribute("aria-hidden", "true");
      about.style.display = "none";
      main.appendChild(about);
    }
    // CRITICAL: must not live inside another tab-panel
    var parentPanel = about.parentElement && about.parentElement.closest
      ? about.parentElement.closest(".tab-panel")
      : null;
    if (parentPanel && parentPanel.id && parentPanel.id !== "tab-about") {
      if (main) main.appendChild(about);
      else parentPanel.parentNode && parentPanel.parentNode.appendChild(about);
    } else if (about.parentElement && about.parentElement.id === "tab-notes") {
      if (main) main.appendChild(about);
    }
    // If about is child of notes via non-class parent
    var p = about.parentElement;
    while (p && p !== main && p !== d.body) {
      if (p.id && /^tab-/.test(p.id) && p.id !== "tab-about") {
        if (main) main.appendChild(about);
        break;
      }
      p = p.parentElement;
    }
    var root = about.querySelector("#companion-about-enriched-root");
    if (!root) {
      root = d.createElement("div");
      root.id = "companion-about-enriched-root";
      root.className = "companion-about-enriched-root";
      about.appendChild(root);
    }
    return about;
  }

  function showTab(id, write) {
    id = normalize(id) || "reminder";
    var panelId = VALID[id];
    ensureAboutTopLevel();
    applying = true;
    try {
      d.querySelectorAll(".tab-panel").forEach(function (p) {
        // Nested panels that are children of another tab-panel: ignore for sole-active
        var on = p.id === panelId;
        p.classList.toggle("is-active", on);
        p.classList.toggle("active", on);
        p.setAttribute("aria-hidden", on ? "false" : "true");
        if (on) {
          p.removeAttribute("hidden");
          p.style.removeProperty("display");
          p.style.setProperty("display", "block", "important");
          p.style.setProperty("visibility", "visible", "important");
          p.style.setProperty("height", "auto", "important");
          p.style.setProperty("max-height", "none", "important");
          p.style.setProperty("overflow", "visible", "important");
          p.style.setProperty("position", "relative", "important");
        } else {
          p.style.setProperty("display", "none", "important");
        }
      });
      // Quarantine action-only modules when not on action
      quarantineActionModules(id === "action");
      d.querySelectorAll("[data-rail-tab], [data-rrra]").forEach(function (btn) {
        var t = (btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || "").toLowerCase();
        btn.classList.toggle("is-active", t === id);
      });
      try {
        d.body.setAttribute("data-active-tab", id);
      } catch (e) {}
      if (write !== false) {
        try {
          localStorage.setItem("clarity_companion_tab_v1", id);
        } catch (e2) {}
        try {
          var want = "#" + id;
          if ((w.location.hash || "") !== want) history.replaceState(null, "", want);
        } catch (e3) {}
      }
      // Scroll About into view when opened
      if (id === "about") {
        var about = d.getElementById("tab-about");
        if (about && about.scrollIntoView) {
          try {
            about.scrollIntoView({ block: "start" });
          } catch (e4) {}
        }
      }
    } finally {
      applying = false;
    }
  }

  function quarantineActionModules(show) {
    var nodes = d.querySelectorAll(
      "#tj-deep-studio, #tajweed-live-card, #tajweed-path-card, .card-tajweed, [data-tab-home='action']"
    );
    nodes.forEach(function (el) {
      // Only touch nodes that belong under action (or claim to)
      var home = el.getAttribute("data-tab-home");
      var inAction = !!(el.closest && el.closest("#tab-action"));
      if (home === "action" || inAction || /tajweed|tj-deep/i.test(el.id || "")) {
        if (show) {
          el.style.removeProperty("display");
          el.removeAttribute("aria-hidden");
        } else {
          // If module escaped outside tab-action, force hide when not on Action
          if (!inAction || !show) {
            if (!inAction) {
              el.style.setProperty("display", "none", "important");
              el.setAttribute("aria-hidden", "true");
            }
          }
        }
      }
    });
    // If studio escaped the DOM tree of tab-action, reattach
    var studio = d.getElementById("tj-deep-studio");
    var action = d.getElementById("tab-action");
    if (studio && action && !action.contains(studio)) {
      action.appendChild(studio);
      if (!show) {
        studio.style.setProperty("display", "none", "important");
      }
    }
  }

  function desiredFromChrome() {
    var h = normalize((w.location.hash || "").replace(/^#/, ""));
    if (h) return h;
    var body = normalize(d.body && d.body.getAttribute("data-active-tab"));
    if (body) return body;
    return null;
  }

  function assertVisible() {
    var id = desiredFromChrome();
    if (!id) return;
    ensureAboutTopLevel();
    var panel = d.getElementById(VALID[id]);
    if (!panel) return;
    var cs = w.getComputedStyle(panel);
    var wrong =
      cs.display === "none" ||
      panel.getAttribute("aria-hidden") === "true" ||
      !(panel.classList.contains("is-active") || panel.classList.contains("active")) ||
      (id === "about" && panel.offsetHeight === 0 && panel.scrollHeight === 0);
    var conflict = false;
    d.querySelectorAll(".tab-panel.is-active, .tab-panel.active").forEach(function (p) {
      if (p.id !== VALID[id]) conflict = true;
    });
    // Nested about still under notes?
    if (id === "about") {
      var parentPanel = panel.parentElement && panel.parentElement.closest
        ? panel.parentElement.closest(".tab-panel")
        : null;
      if (parentPanel && parentPanel.id !== "tab-about") wrong = true;
    }
    if (wrong || conflict) showTab(id, false);
  }

  function supplementCards(root) {
    if (!root.querySelector("#companion-about-amana")) {
      root.insertAdjacentHTML(
        "beforeend",
        '<div class="card" id="companion-about-amana">' +
          "<h2>Amānah vault · own room</h2>" +
          '<p style="font-size:0.92rem;line-height:1.5">Vault unlock, dayn, heirs, family tree, farāʾiḍ study, and wasiyyah notes live in the <strong>Amānah</strong> room.</p>' +
          '<p><a class="btn-soft" href="/amana/" style="display:inline-block;padding:0.4rem 0.85rem;border-radius:999px;border:1px solid rgba(212,180,90,0.4);text-decoration:none;font-weight:700">Open Amānah →</a></p>' +
          '<p class="td-src">Educational only — not a fatwa · passphrase on this device.</p>' +
          "</div>"
      );
    }
    if (!root.querySelector("#companion-about-rooms")) {
      root.insertAdjacentHTML(
        "beforeend",
        '<div class="card" id="companion-about-rooms">' +
          "<h2>Five rooms</h2>" +
          "<ul class=\"sources-list\">" +
          '<li><a href="/companion/"><strong>Companion</strong></a> — pathways · Reminder · Reality · Reflection · Action · About</li>' +
          '<li><a href="/daily/"><strong>Yawm</strong></a> — today’s portion</li>' +
          '<li><a href="/campus/"><strong>University</strong></a> — ordered learning</li>' +
          '<li><a href="/amana/"><strong>Amānah</strong></a> — trust desk &amp; optional vault</li>' +
          '<li><a href="/craft/"><strong>Craft</strong></a> — atelier</li>' +
          "</ul>" +
          '<p style="font-size:0.85rem">Public page: <a href="/about/">/about/</a> · <a href="/charter/">Charter</a></p>' +
          "</div>"
      );
    }
  }

  function moveAboutCard() {
    var about = ensureAboutTopLevel();
    if (!about) return;
    var root = about.querySelector("#companion-about-enriched-root");
    var card = d.getElementById("about-clarity-card");
    if (card && root && !root.contains(card)) {
      card.setAttribute("data-rrra", "about");
      root.insertBefore(card, root.firstChild);
    }
    supplementCards(root);
  }

  function cleanReality() {
    var reality = d.getElementById("tab-reality");
    if (!reality) return;
    var ptr = d.getElementById("about-moved-pointer");
    if (ptr && ptr.parentNode) ptr.parentNode.removeChild(ptr);
    var stray = reality.querySelector("#about-clarity-card");
    if (stray) {
      var root = d.querySelector("#companion-about-enriched-root");
      if (root) {
        stray.setAttribute("data-rrra", "about");
        root.insertBefore(stray, root.firstChild);
      }
    }
  }

  function wireDoor() {
    w.clarityShowCompanionTab = showTab;
    function wrap(name) {
      var prev = w[name];
      w[name] = function (id) {
        var n = normalize(id);
        if (n) {
          showTab(n, true);
          setTimeout(function () {
            showTab(n, false);
          }, 0);
          setTimeout(assertVisible, 50);
          setTimeout(assertVisible, 200);
          return;
        }
        if (typeof prev === "function") {
          try {
            return prev.apply(this, arguments);
          } catch (e) {}
        }
      };
    }
    wrap("clarityOpenSectionDoor");
    wrap("clarityShowCompanionTab");

    d.querySelectorAll("[data-rail-tab], #clarity-door-rail [data-rrra]").forEach(function (btn) {
      btn.addEventListener(
        "click",
        function (ev) {
          var t = (btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || "").toLowerCase();
          var n = normalize(t);
          if (!n) return;
          ev.preventDefault();
          ev.stopPropagation();
          showTab(n, true);
          setTimeout(assertVisible, 0);
          setTimeout(assertVisible, 50);
          setTimeout(assertVisible, 150);
        },
        true
      );
    });
  }

  function observeConflicts() {
    var main = d.querySelector("main") || d.body;
    if (!main || typeof MutationObserver === "undefined") return;
    var mo = new MutationObserver(function () {
      if (applying) return;
      assertVisible();
      var id = desiredFromChrome();
      quarantineActionModules(id === "action");
    });
    mo.observe(main, {
      attributes: true,
      subtree: true,
      attributeFilter: ["class", "style", "aria-hidden", "hidden"]
    });
  }

  function boot() {
    try {
      ensureAboutTopLevel();
      moveAboutCard();
      cleanReality();
      quarantineActionModules(normalize((w.location.hash || "").replace(/^#/, "")) === "action");
      wireDoor();
      observeConflicts();
      var h = normalize((w.location.hash || "").replace(/^#/, ""));
      if (h) showTab(h, true);
      setTimeout(assertVisible, 100);
      setTimeout(assertVisible, 400);
    } catch (e) {
      console.warn("about-tab-v5", e);
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("hashchange", function () {
    var id = normalize((w.location.hash || "").replace(/^#/, ""));
    if (id) {
      showTab(id, true);
      setTimeout(assertVisible, 0);
      setTimeout(assertVisible, 100);
    }
  });
})(window, document);

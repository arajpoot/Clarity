/*! Companion About tab v3 · move About card out of Reality
 * - Moves #about-clarity-card → #tab-about (explicit tab hygiene override)
 * - About rail opens #tab-about only; Reality opens #tab-reality only
 * - Strips Reality cross-links/pointers to About
 * - Supplements About with purpose / Amānah room / five-room cards if missing
 * Educational only — not a fatwa. Companion only.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_COMPANION_ABOUT_TAB_FIX_V3__) return;
  w.__CLARITY_COMPANION_ABOUT_TAB_FIX_V3__ = true;

  var VALID = {
    reminder: "tab-reminder",
    reality: "tab-reality",
    reflection: "tab-reflection",
    action: "tab-action",
    notes: "tab-notes",
    about: "tab-about"
  };

  function normalize(id) {
    id = String(id || "").toLowerCase().replace(/^#/, "");
    if (id === "journey" || id === "commands" || id === "seerah") id = "reminder";
    if (id === "tajweed" || id === "callig" || id === "calligraphy" || id === "meme") id = "action";
    if (id === "info" || id === "meta") id = "about";
    if (!VALID[id]) return null;
    return id;
  }

  function showTab(id, write) {
    id = normalize(id) || "reminder";
    var panelId = VALID[id];
    d.querySelectorAll(".tab-panel").forEach(function (p) {
      var on = p.id === panelId;
      p.classList.toggle("is-active", on);
      p.classList.toggle("active", on);
      p.setAttribute("aria-hidden", on ? "false" : "true");
      if (on) {
        p.removeAttribute("hidden");
        p.style.removeProperty("display");
        p.style.setProperty("display", "block", "important");
      } else {
        p.style.setProperty("display", "none", "important");
      }
    });
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
  }

  function ensureAbout() {
    var about = d.getElementById("tab-about");
    if (!about) {
      var main = d.querySelector("main.main-content") || d.querySelector("main");
      if (!main) return null;
      about = d.createElement("div");
      about.id = "tab-about";
      about.className = "tab-panel companion-about-home";
      about.setAttribute("aria-hidden", "true");
      about.style.display = "none";
      main.appendChild(about);
    }
    var root = about.querySelector("#companion-about-enriched-root");
    if (!root) {
      root = d.createElement("div");
      root.id = "companion-about-enriched-root";
      root.className = "companion-about-enriched-root";
      about.innerHTML = "";
      about.appendChild(root);
    }
    return about;
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
    var about = ensureAbout();
    if (!about) return;
    var root = about.querySelector("#companion-about-enriched-root");
    var card = d.getElementById("about-clarity-card");
    if (card && root && !root.contains(card)) {
      card.setAttribute("data-rrra", "about");
      card.removeAttribute("hidden");
      card.style.removeProperty("display");
      // Prefer About card first in About tab
      if (root.firstChild) root.insertBefore(card, root.firstChild);
      else root.appendChild(card);
    }
    supplementCards(root);
  }

  function cleanRealityAboutCrossRefs() {
    var reality = d.getElementById("tab-reality");
    if (!reality) return;

    // Remove explicit pointers from older packs
    ["about-moved-pointer", "about-moved-open-btn"].forEach(function (id) {
      var el = d.getElementById(id);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });

    // Remove leftover empty wrappers that only pointed at About
    reality.querySelectorAll("a, button").forEach(function (el) {
      var text = (el.textContent || "").toLowerCase();
      var href = (el.getAttribute("href") || "").toLowerCase();
      var onclick = (el.getAttribute("onclick") || "").toLowerCase();
      if (
        href === "#about" ||
        onclick.indexOf("opensectiondoor('about") >= 0 ||
        onclick.indexOf('opensectiondoor("about') >= 0 ||
        (text.indexOf("open about") >= 0 && text.indexOf("tab") >= 0)
      ) {
        var card = el.closest(".card");
        if (card && card.id !== "about-clarity-card" && /about/i.test(card.textContent || "") && (card.textContent || "").length < 280) {
          if (card.parentNode) card.parentNode.removeChild(card);
        } else if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }
    });

    // If about card somehow still under reality, move again
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
    var prev = w.clarityOpenSectionDoor;
    w.clarityOpenSectionDoor = function (id) {
      var n = normalize(id);
      if (n) {
        showTab(n, true);
        return;
      }
      if (typeof prev === "function") {
        try {
          return prev.apply(this, arguments);
        } catch (e) {}
      }
    };

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
        },
        true
      );
    });
  }

  function boot() {
    try {
      moveAboutCard();
      cleanRealityAboutCrossRefs();
      wireDoor();
      var h = normalize((w.location.hash || "").replace(/^#/, ""));
      if (h) showTab(h, true);
    } catch (e) {
      console.warn("about-tab-v3", e);
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  // Late scripts may re-inject; re-assert move once
  setTimeout(function () {
    try {
      moveAboutCard();
      cleanRealityAboutCrossRefs();
    } catch (e) {}
  }, 600);

  w.addEventListener("hashchange", function () {
    var id = normalize((w.location.hash || "").replace(/^#/, ""));
    if (id) showTab(id, true);
  });
})(window, document);

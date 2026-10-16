/**
 * Module → Lab inject (end of module + flash CTA)
 * Runs on phase rooms only. Does not touch SEAL foundation.
 * Educational only.
 */
(function (g) {
  "use strict";
  if (g.__CU_MODULE_LAB_INJECT_V1__) return;
  g.__CU_MODULE_LAB_INJECT_V1__ = true;

  var STATION = {
    media: { href: "/lab/media/", label: "Lab · Media" },
    tajweed: { href: "/lab/tajweed/", label: "Lab · Tajweed" },
    callig: { href: "/lab/calligraphy/", label: "Lab · Calligraphy" },
    calligraphy: { href: "/lab/calligraphy/", label: "Lab · Calligraphy" },
    arabic: { href: "/lab/arabic/?deck=everyday", label: "Lab · Arabic flash" },
    recite: { href: "/lab/recite/", label: "Lab · Recite" },
    hifz: { href: "/lab/hifz/", label: "Lab · Hifz" }
  };

  var PHASE_ARABIC = {
    seeker: { deck: "everyday", label: "Arabic · Everyday words (flash)" },
    practice: { deck: "salah", label: "Arabic · Ṣalāh lexicon (flash)" },
    consistency: { deck: "stems", label: "Arabic · High-frequency stems" },
    transmission: { deck: "stems", label: "Arabic · Review stems + share carefully" }
  };

  function room() {
    return (document.body && document.body.getAttribute("data-phase-room")) || "";
  }

  function rewriteLabChips(root) {
    root = root || document;
    root.querySelectorAll('a[href*="/lab"]').forEach(function (a) {
      var href = a.getAttribute("href") || "";
      var st = a.getAttribute("data-lab-station") || "";
      var m = href.match(/[?&]station=([a-z]+)/i);
      if (m) st = m[1];
      if (st && STATION[st]) {
        a.setAttribute("href", STATION[st].href);
        if (!(a.textContent || "").trim()) a.textContent = STATION[st].label;
      }
      // legacy /lab/?station=
      if (href.indexOf("/lab/?station=") === 0 || href.indexOf("/lab?station=") === 0) {
        var s = (href.split("station=")[1] || "").split("&")[0];
        if (STATION[s]) a.setAttribute("href", STATION[s].href);
      }
    });
  }

  function injectModuleFooters() {
    var r = room();
    if (!r || !PHASE_ARABIC[r]) return;
    var ar = PHASE_ARABIC[r];
    var arHref = "/lab/arabic/?deck=" + encodeURIComponent(ar.deck);

    /* Open / expanded module blocks */
    var candidates = document.querySelectorAll(
      ".junior-lesson, .junior-module, .cu-module, [data-module], .mv-lesson, article.lesson"
    );
    if (!candidates.length) {
      /* fallback: each completed or open block with practice */
      candidates = document.querySelectorAll(".junior-practice, .cu-stage section");
    }

    candidates.forEach(function (node) {
      var host = node.classList.contains("junior-practice")
        ? node.parentElement
        : node;
      if (!host || host.querySelector(".cu-lab-inject")) return;

      var bar = document.createElement("div");
      bar.className = "cu-lab-inject";
      bar.innerHTML =
        '<p class="cu-lab-inject-kicker">After this module · Lab practice</p>' +
        '<div class="cu-lab-inject-row">' +
        '<a class="mv-chip cu-lab-inject-chip" href="' +
        arHref +
        '">🃏 ' +
        ar.label +
        "</a>" +
        '<a class="mv-chip cu-lab-inject-chip" href="/lab/tajweed/">Lab · Tajweed</a>' +
        '<a class="mv-chip cu-lab-inject-chip ghost" href="/lab/">All stations</a>' +
        "</div>";
      host.appendChild(bar);
    });

    /* Also ensure craft strip has Arabic when phase-room craft exists */
    var craft = document.querySelector(".cu-craft-cta, #cu-craft-cta, .cu-phase-craft");
    if (craft && !craft.querySelector("[data-arabic-flash]")) {
      var a = document.createElement("a");
      a.className = "cu-btn";
      a.href = arHref;
      a.setAttribute("data-arabic-flash", "1");
      a.textContent = ar.label;
      craft.appendChild(a);
    }
  }

  function injectStyles() {
    if (document.getElementById("cu-lab-inject-css")) return;
    var s = document.createElement("style");
    s.id = "cu-lab-inject-css";
    s.textContent =
      ".cu-lab-inject{margin:.65rem 0 .25rem;padding:.65rem .75rem;border-radius:12px;border:1px solid rgba(184,166,135,.35);background:rgba(30,125,94,.08)}" +
      ".cu-lab-inject-kicker{margin:0 0 .35rem;font-size:.72rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase;opacity:.85}" +
      ".cu-lab-inject-row{display:flex;flex-wrap:wrap;gap:.35rem}" +
      ".cu-lab-inject-chip{display:inline-flex;align-items:center;padding:.35rem .7rem;border-radius:999px;background:#1e7d5e;color:#fff!important;text-decoration:none;font-weight:700;font-size:.75rem}" +
      ".cu-lab-inject-chip.ghost{background:transparent;color:inherit!important;border:1px solid rgba(184,166,135,.4)}";
    document.head.appendChild(s);
  }

  function run() {
    if ((location.pathname || "").indexOf("/campus/desk/") < 0) return;
    injectStyles();
    rewriteLabChips(document);
    injectModuleFooters();
  }

  function observe() {
    run();
    var main = document.querySelector("main") || document.body;
    if (!main || typeof MutationObserver === "undefined") return;
    var t = null;
    var obs = new MutationObserver(function () {
      if (t) clearTimeout(t);
      t = setTimeout(function () {
        rewriteLabChips(document);
        injectModuleFooters();
      }, 200);
    });
    obs.observe(main, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", observe);
  else observe();
  setTimeout(run, 800);
  setTimeout(run, 2000);
})(typeof window !== "undefined" ? window : this);

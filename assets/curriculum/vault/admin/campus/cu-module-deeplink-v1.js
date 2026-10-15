/**
 * Phase 4 — module-level deep links to Companion cards
 * University curriculum → Companion tabs / tools (educational only)
 */
(function (g) {
  "use strict";
  if (g.__CU_MODULE_DEEPLINK_V1__) return;
  g.__CU_MODULE_DEEPLINK_V1__ = true;

  /** phase room → default companion focus */
  var PHASE_HOME = {
    seeker: { href: "/#reminder", label: "Companion · Reminder (foundations)" },
    practice: { href: "/#reality", label: "Companion · Reality (what is true)" },
    consistency: { href: "/#reflection", label: "Companion · Reflection (daily)" },
    transmission: { href: "/#action", label: "Companion · Action (share with care)" },
    hub: { href: "/", label: "Companion home" }
  };

  /**
   * Keyword → deep link (checked against module title/text)
   * Prefer stable hashes used by companion bottom nav / cards
   */
  var KEYWORD_LINKS = [
    { re: /tajweed|recit|qir[aā]/i, href: "/lab/tajweed/", label: "Lab · Tajweed booth" },
    { re: /calligraph|khatt|writing/i, href: "/lab/calligraphy/", label: "Lab · Calligraphy" },
    { re: /hifz|memor/i, href: "/lab/hifz/", label: "Lab · Hifz" },
    { re: /arabic|nahw|sarf/i, href: "/lab/arabic/", label: "Lab · Arabic" },
    { re: /meme|poster|reminder card/i, href: "/#reminder", label: "Companion · Meme studio (Reminder)" },
    { re: /command|amr|believer/i, href: "/#reminder", label: "Companion · Commands" },
    { re: /adhkar|dhikr|wird/i, href: "/adhkar/", label: "Adhkār page" },
    { re: /salah|prayer|wudu|wu[dḍ]u/i, href: "/#reality", label: "Companion · Reality" },
    { re: /iman|aqidah|tawhid|tawḥīd|shahada/i, href: "/#reminder", label: "Companion · Reminder" },
    { re: /reflect|tafakkur|grave/i, href: "/#reflection", label: "Companion · Reflection" },
    { re: /action|deed|amal/i, href: "/#action", label: "Companion · Action" },
    { re: /note|journal|amana|vault|wasiyyah|fara/i, href: "/#notes", label: "Companion · Amana notes" },
    { re: /dawah|daʿwah|invite|transmit/i, href: "/#action", label: "Companion · Action (daʿwah care)" }
  ];

  function room() {
    var p = (location.pathname || "").toLowerCase();
    if (p.indexOf("seeker") >= 0) return "seeker";
    if (p.indexOf("practice") >= 0) return "practice";
    if (p.indexOf("consistency") >= 0) return "consistency";
    if (p.indexOf("transmission") >= 0) return "transmission";
    return "hub";
  }

  function matchLink(text) {
    text = text || "";
    for (var i = 0; i < KEYWORD_LINKS.length; i++) {
      if (KEYWORD_LINKS[i].re.test(text)) return KEYWORD_LINKS[i];
    }
    return PHASE_HOME[room()] || PHASE_HOME.hub;
  }

  function ensureStyles() {
    if (document.getElementById("cu-deeplink-css")) return;
    var s = document.createElement("style");
    s.id = "cu-deeplink-css";
    s.textContent =
      ".cu-mod-deeplink{display:inline-flex;align-items:center;gap:.35rem;margin-top:.45rem;padding:.28rem .65rem;" +
      "font-size:.72rem;border-radius:999px;border:1px solid rgba(212,180,90,.4);background:rgba(13,79,60,.3);" +
      "color:#d4e8dc;text-decoration:none}" +
      ".cu-mod-deeplink:hover{border-color:rgba(232,196,122,.75)}" +
      ".cu-phase-deepstrip{margin:0.75rem 0;padding:0.65rem 0.8rem;border-radius:14px;" +
      "border:1px solid rgba(212,180,90,.3);background:rgba(0,0,0,.2);font-size:.8rem;line-height:1.4}" +
      ".cu-phase-deepstrip a{color:#9fd4b8}";
    document.head.appendChild(s);
  }

  function addLinkTo(el, href, label) {
    if (!el || el.querySelector(".cu-mod-deeplink")) return;
    var a = document.createElement("a");
    a.className = "cu-mod-deeplink";
    a.href = href;
    a.textContent = "↗ " + label;
    a.title = "Open related Companion / Lab tool";
    el.appendChild(a);
  }

  function decorateModules() {
    ensureStyles();
    var nodes = document.querySelectorAll(
      ".junior-module, [data-module-id], .curriculum-module, .curriculum-phase-card article, [id$='-curriculum-card'] .card"
    );
    if (!nodes.length) {
      nodes = document.querySelectorAll("[id$='-curriculum-card'] li, [id$='-curriculum-card'] .module");
    }
    nodes.forEach(function (el) {
      if (el.querySelector(".cu-mod-deeplink")) return;
      var text = (el.textContent || "").slice(0, 400);
      var link = matchLink(text);
      addLinkTo(el, link.href, link.label);
    });
  }

  function phaseStrip() {
    if (document.getElementById("cu-phase-deepstrip")) return;
    ensureStyles();
    var home = PHASE_HOME[room()] || PHASE_HOME.hub;
    var box = document.createElement("div");
    box.id = "cu-phase-deepstrip";
    box.className = "cu-phase-deepstrip";
    box.innerHTML =
      "<strong>Companion deep links</strong> — open matching daily tools for this room: " +
      '<a href="' +
      home.href +
      '">' +
      home.label +
      "</a>" +
      ' · <a href="/lab/">Lab stations</a> · <a href="/#notes">Amana notes</a>';
    var craft = document.getElementById("cu-phase-craft");
    var main = document.querySelector("main") || document.body;
    if (craft && craft.parentNode) craft.parentNode.insertBefore(box, craft);
    else {
      var host = document.querySelector("[id$='-curriculum-card']") || main;
      host.appendChild(box);
    }
  }

  function run() {
    var p = (location.pathname || "").toLowerCase();
    if (p.indexOf("/campus") < 0 && p.indexOf("/lab") < 0) return;
    phaseStrip();
    decorateModules();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(run, 400); });
  else setTimeout(run, 400);
  setTimeout(run, 1200);
  setTimeout(run, 2800);
})(typeof window !== "undefined" ? window : this);

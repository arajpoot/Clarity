/*! cu-bots-harmony-v1 · U59 — stronger dedupe + mark surface */
(function (w, d) {
  "use strict";
  if (w.__CU_BOTS_HARMONY_V1__) return;
  w.__CU_BOTS_HARMONY_V1__ = true;

  var p = (location.pathname || "").replace(/\/+$/, "") || "";
  if (p.indexOf("/campus") !== 0) return;

  d.documentElement.setAttribute("data-campus-surface", "1");
  if (p === "/campus/bots") d.documentElement.setAttribute("data-bots-harmony", "1");

  function hide(el) {
    if (!el || el.getAttribute("data-bots-deduped") === "1") return;
    try {
      el.style.setProperty("display", "none", "important");
      el.setAttribute("data-bots-deduped", "1");
    } catch (e) {}
  }

  function keepFirst(sel) {
    var nodes = d.querySelectorAll(sel);
    for (var i = 1; i < nodes.length; i++) hide(nodes[i]);
  }

  function dedupeBots() {
    if (p !== "/campus/bots") return;
    keepFirst("#cu-bots-command");
    keepFirst("#cu-vle-tutorial");
    keepFirst("#cu-vle-faculty-research");
    keepFirst("#cu-vle-research");
    keepFirst("#cu-vle-hud");
    hide(d.getElementById("cit-scan"));

    // Hide SSR legacy cards that repeat "Campus bots · on-device ops" / workers resurrect blurb
    var keepIds = {
      "cu-bots-command": 1,
      "cu-vle-tutorial": 1,
      "cu-vle-faculty-research": 1,
      "cu-vle-research": 1,
      "cu-vle-hud": 1,
      "cu-campus-path-ai": 1
    };
    d.querySelectorAll("main section, main article, main .card, main .panel, main .uni-card, main .cu-card").forEach(function (el) {
      if (el.id && keepIds[el.id]) return;
      if (el.closest("#cu-bots-command, #cu-vle-tutorial, #cu-vle-faculty-research, #cu-vle-research, #cu-vle-hud, #cu-campus-path-ai, footer, .cu-foot, .cu-niyyah-foot, nav, header")) return;
      var t = (el.textContent || "").replace(/\s+/g, " ").slice(0, 280);
      if (/Campus bots\s*·\s*on-device ops/i.test(t)) hide(el);
      if (/Workers ops pack resurrected from vault/i.test(t)) hide(el);
      if (/Bots\s*·\s*on-device path ops/i.test(t) && !el.closest("#cu-bots-command")) hide(el);
      if (/Security\s*·\s*on-device/i.test(t) && /I will not treat bot output as a fatwa/i.test(t)) {
        /* keep one security checklist if present — hide duplicates only */
      }
      if (/VIRTUAL LEARNING EXPERIENCE\s*·\s*ON-DEVICE/i.test(t) && /Nazir al-Tashghil/i.test(t)) {
        /* keep staff personas block once — handled by keepFirst-like scan */
      }
    });

    // Second pass: duplicate staff persona grids
    var personaBlocks = [];
    d.querySelectorAll("main section, main article, main div").forEach(function (el) {
      var t = el.textContent || "";
      if (/Nazir al-Tashghil/i.test(t) && /Amin al-Maktabah/i.test(t) && t.length < 2500) {
        personaBlocks.push(el);
      }
    });
    for (var i = 1; i < personaBlocks.length; i++) hide(personaBlocks[i]);

    // Duplicate security checklists
    var sec = [];
    d.querySelectorAll("main section, main article, main div").forEach(function (el) {
      var t = el.textContent || "";
      if (/I understand progress is stored only on this device/i.test(t) && /I will not treat bot output as a fatwa/i.test(t)) {
        sec.push(el);
      }
    });
    for (var j = 1; j < sec.length; j++) hide(sec[j]);
  }

  function boot() {
    try {
      dedupeBots();
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  [150, 400, 900, 1800, 3500].forEach(function (t) {
    setTimeout(boot, t);
  });
})(window, document);

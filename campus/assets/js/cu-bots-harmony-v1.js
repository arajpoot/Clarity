/*! cu-bots-harmony-v1 · U60 */
(function (w, d) {
  "use strict";
  if (w.__CU_BOTS_HARMONY_U60__) return;
  w.__CU_BOTS_HARMONY_U60__ = true;

  var p = (location.pathname || "").replace(/\/+$/, "") || "";
  if (p.indexOf("/campus") !== 0) return;
  d.documentElement.setAttribute("data-campus-surface", "1");
  if (p !== "/campus/bots") return;
  d.documentElement.setAttribute("data-bots-harmony", "1");

  function hide(el) {
    if (!el) return;
    try {
      el.style.setProperty("display", "none", "important");
      el.setAttribute("data-bots-deduped", "1");
    } catch (e) {}
  }

  function dedupe() {
    ["cu-bots-command", "cu-vle-tutorial", "cu-vle-faculty-research", "cu-vle-research", "cu-vle-hud"].forEach(function (id) {
      var nodes = d.querySelectorAll("#" + id);
      for (var i = 1; i < nodes.length; i++) hide(nodes[i]);
    });
    hide(d.getElementById("cit-scan"));

    var bridge = null;
    d.querySelectorAll("main *, body *").forEach(function (el) {
      if (bridge) return;
      var t = (el.textContent || "").trim();
      if (el.children && el.children.length > 3) return;
      if (/^Bridge$/i.test(t) || /✂\s*Bridge/i.test(t)) bridge = el;
    });

    // Hide main children that are pure legacy ops cards before command center
    var cmd = d.getElementById("cu-bots-command");
    var main = d.querySelector("main") || d.body;
    if (cmd && main) {
      Array.prototype.slice.call(main.children).forEach(function (el) {
        if (el === cmd || el.contains(cmd)) return;
        if (el.id && /cu-vle|cu-bots|cu-path|cu-gate|footer/i.test(el.id)) return;
        var t = (el.textContent || "").replace(/\s+/g, " ").slice(0, 320);
        if (/Campus bots\s*·\s*on-device ops/i.test(t)) hide(el);
        if (/Workers ops pack resurrected/i.test(t)) hide(el);
        if (/Bots\s*·\s*on-device path ops/i.test(t)) hide(el);
      });
    }

    // After tutorial: hide duplicate security / IT / O&M / staff grids if command exists
    var tut = d.getElementById("cu-vle-tutorial");
    if (tut) {
      var hideAfter = false;
      Array.prototype.slice.call(main.children).forEach(function (el) {
        if (el === tut || el.contains(tut)) {
          hideAfter = true;
          return;
        }
        if (!hideAfter) return;
        if (el.tagName === "FOOTER" || (el.className && /foot|niyyah/i.test(String(el.className)))) return;
        var t = (el.textContent || "").replace(/\s+/g, " ").slice(0, 400);
        if (/Security\s*·\s*on-device/i.test(t)) hide(el);
        if (/IT\s*·\s*incomplete module/i.test(t)) hide(el);
        if (/O&M\s*·\s*mark one step/i.test(t)) hide(el);
        if (/Nazir al-Tashghil/i.test(t) && /Amin al-Maktabah/i.test(t)) hide(el);
        if (/Campus bots/i.test(t) && /Local helpers only/i.test(t)) hide(el);
      });
    }
  }

  function boot() {
    try {
      dedupe();
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  [100, 400, 1000, 2000, 4000].forEach(function (t) {
    setTimeout(boot, t);
  });
})(window, document);

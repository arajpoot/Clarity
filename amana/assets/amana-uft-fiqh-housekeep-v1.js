/*! Amānah UFT/Fiqh · housekeeping repair
 * 1) Deduplicate Farāʾiḍ "Tree outline for study" / workflow panels
 * 2) After tree JSON in storage, force pedigree redraw if stage still empty
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_FIQH_HOUSEKEEP_V1__) return;
  w.__CLARITY_AMANA_UFT_FIQH_HOUSEKEEP_V1__ = true;

  function isFiqh() {
    return /\/amana\/fiqh\/?/.test(location.pathname || "");
  }
  function isTree() {
    return /\/amana\/tree\/?/.test(location.pathname || "");
  }

  function dedupeFiqhOutlines() {
    if (!isFiqh()) return;
    var cards = Array.prototype.slice.call(
      d.querySelectorAll(".amana-card, [class*='outline'], #fiqh-workflow-enrich-strip, #uft-fiqh-outline-panel")
    );
    var seen = {};
    var outlineNodes = [];
    cards.forEach(function (el) {
      var h = (el.querySelector("h2,h3,p") && (el.querySelector("h2,h3") || {}).textContent) || el.textContent || "";
      h = String(h).slice(0, 80);
      if (/Tree outline for study/i.test(h) || /Workflow · Farā/i.test(h) || /Workflow · Fara/i.test(h)) {
        outlineNodes.push(el);
      }
    });
    /* Also match by button labels */
    d.querySelectorAll("div,section").forEach(function (el) {
      if (el.dataset && el.dataset.hkOutline) return;
      var t = el.textContent || "";
      if (t.indexOf("Tree outline for study") !== -1 && el.children && el.children.length < 12) {
        if (outlineNodes.indexOf(el) === -1) outlineNodes.push(el);
      }
    });
    if (outlineNodes.length <= 1) {
      /* Keep workflow strip; hide pure duplicates with same Refresh from tree only */
      var blocks = Array.prototype.slice.call(d.querySelectorAll("div,section")).filter(function (el) {
        var tx = el.textContent || "";
        return (
          /^[\s\S]{0,40}Tree outline for study/i.test(tx) &&
          /Refresh from tree/i.test(tx) &&
          el.querySelectorAll("button,a").length >= 2 &&
          el.querySelectorAll("button,a").length <= 6
        );
      });
      if (blocks.length > 1) {
        blocks.slice(1).forEach(function (el) {
          el.style.display = "none";
          el.setAttribute("data-hk-deduped", "1");
        });
      }
      return;
    }
    outlineNodes.slice(1).forEach(function (el) {
      el.style.display = "none";
      el.setAttribute("data-hk-deduped", "1");
    });
  }

  function stageLooksEmpty() {
    var stage = d.getElementById("uft-stage");
    if (!stage) return true;
    var text = (stage.textContent || "").replace(/\s+/g, " ").trim();
    if (/Pedigree empty/i.test(text)) return true;
    if (text.length < 40) return true;
    return false;
  }

  function forcePedigreeFromStorage() {
    if (!isTree()) return;
    var raw = null;
    try {
      raw = localStorage.getItem(w.UFT_KEY || "clarity_user_family_tree_v1");
    } catch (e) {}
    if (!raw) return;
    var data;
    try {
      data = JSON.parse(raw);
    } catch (e2) {
      return;
    }
    if (!data || typeof data !== "object") return;
    var hasPeople =
      data.self ||
      data.father ||
      (Array.isArray(data.registry) && data.registry.length) ||
      data.children;
    if (!hasPeople) return;
    if (!stageLooksEmpty() && data.self) return;
    /* Hydrate backbone from registry if needed */
    if (!data.self && Array.isArray(data.registry)) {
      data.registry.forEach(function (r) {
        if (!r || !r.name) return;
        var role = String(r.role || "").toLowerCase();
        if (role === "self" && !data.self) data.self = r.name;
        if (role === "father" && !data.father) data.father = r.name;
        if (role === "mother" && !data.mother) data.mother = r.name;
        if (role === "spouse" && !data.spouse) data.spouse = r.name;
      });
      try {
        localStorage.setItem(w.UFT_KEY || "clarity_user_family_tree_v1", JSON.stringify(data));
      } catch (e3) {}
    }
    try {
      if (typeof w.uftApplyData === "function") w.uftApplyData(data);
      else {
        if (typeof w.uftLoad === "function") w.uftLoad();
        if (typeof w.uftRender === "function") w.uftRender();
      }
    } catch (e4) {}
  }

  function boot() {
    try {
      dedupeFiqhOutlines();
      forcePedigreeFromStorage();
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 800);
  setTimeout(boot, 2000);
  setTimeout(dedupeFiqhOutlines, 2500);
  d.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) {
      setTimeout(boot, 300);
    }
  });
})(window, document);

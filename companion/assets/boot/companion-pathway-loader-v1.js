/*! companion-pathway-loader-v1 · C2 · selective pathway packs · chrome unchanged · educational only */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_PATHWAY_LOADER_V1__) return;
  w.__COMPANION_PATHWAY_LOADER_V1__ = true;

  var V = "20261108C2";
  var loaded = {};
  var PACK = {
    reminder: "/companion/assets/pathways/reminder/pack-v1.js",
    reality: "/companion/assets/pathways/reality/pack-v1.js",
    reflection: "/companion/assets/pathways/reflection/pack-v1.js",
    action: "/companion/assets/pathways/action/pack-v1.js"
  };

  function normalize(id) {
    id = String(id || "").toLowerCase().replace(/^#/, "");
    if (id.indexOf("remind") >= 0) return "reminder";
    if (id.indexOf("realit") >= 0 || id.indexOf("grave") >= 0) return "reality";
    if (id.indexOf("reflect") >= 0) return "reflection";
    if (id.indexOf("action") >= 0 || id.indexOf("hajj") >= 0) return "action";
    if (PACK[id]) return id;
    return null;
  }

  function loadPack(id) {
    id = normalize(id);
    if (!id || !PACK[id]) return Promise.resolve(null);
    if (loaded[id]) return loaded[id];
    loaded[id] = new Promise(function (resolve) {
      var s = d.createElement("script");
      s.src = PACK[id] + "?v=" + V;
      s.async = true;
      s.setAttribute("data-pathway-loader", id);
      s.onload = function () { resolve(id); };
      s.onerror = function () { resolve(null); };
      d.head.appendChild(s);
    });
    return loaded[id];
  }

  function fromHash() {
    var h = (location.hash || "").toLowerCase();
    return normalize(h) || null;
  }

  function fromDom() {
    var active = d.querySelector("[data-pathway].is-active, [data-path].is-active, .path-tile.active, [aria-current='page'][data-pathway]");
    if (active) {
      return normalize(active.getAttribute("data-pathway") || active.getAttribute("data-path") || active.textContent);
    }
    /* RRRA-style tabs */
    var tab = d.querySelector('[role="tab"][aria-selected="true"], .tab.is-active, .rrra-tab.active');
    if (tab) return normalize(tab.getAttribute("data-pathway") || tab.getAttribute("data-tab") || tab.textContent);
    return null;
  }

  function bootDefault() {
    var id = fromHash() || fromDom() || "reminder";
    loadPack(id);
    /* warm adjacent packs on idle for snappy switch */
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(function () {
        ["reality", "reflection", "action"].forEach(function (p) {
          if (p !== id) loadPack(p);
        });
      }, { timeout: 6000 });
    }
  }

  function onNavigate() {
    var id = fromHash() || fromDom();
    if (id) loadPack(id);
  }

  d.addEventListener("click", function (ev) {
    var t = ev.target && ev.target.closest && ev.target.closest("a, button, [data-pathway], [data-tab], [data-path]");
    if (!t) return;
    var raw = t.getAttribute("data-pathway") || t.getAttribute("data-tab") || t.getAttribute("data-path") || t.getAttribute("href") || t.textContent;
    var id = normalize(raw);
    if (id) loadPack(id);
  }, true);

  w.addEventListener("hashchange", onNavigate);
  d.addEventListener("clarity-companion-tab-change", onNavigate);

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", bootDefault);
  else bootDefault();

  w.ClarityCompanionLoadPathway = loadPack;
})(window, document);

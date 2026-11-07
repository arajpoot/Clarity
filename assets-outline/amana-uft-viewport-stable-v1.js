/*! Amānah UFT viewport stable v1 · Phase 1
 * Merges responsibilities of:
 *  - inline viewport recover
 *  - amana-uft-visual-fix-v1 (ensure #uft-preview, registry→cards sync)
 *  - amana-uft-build-viewport-v1 chrome inject (build panel + chip legend)
 * WITHOUT removing plaque, print, dock, layout-h, or registry-deep.
 *
 * Load AFTER clarity-amana-uft-v1.js and registry-deep.
 * Educational only — not a legal pedigree · not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_VIEWPORT_STABLE_V1__) return;
  w.__CLARITY_AMANA_UFT_VIEWPORT_STABLE_V1__ = true;

  var TREE_KEY = w.UFT_KEY || "clarity_user_family_tree_v1";
  var CARDS_KEY = "clarity_uft_member_cards_v1";

  function isTreePage() {
    try {
      return /\/amana\/tree\/?/.test(location.pathname || "");
    } catch (e) {
      return false;
    }
  }

  function lsGet(k, fb) {
    try {
      var v = localStorage.getItem(k);
      return v == null ? fb : v;
    } catch (e) {
      return fb;
    }
  }

  function lsSet(k, v) {
    try {
      localStorage.setItem(k, v);
    } catch (e) {}
  }

  function readTree() {
    try {
      if (typeof w.uftRead === "function") return w.uftRead() || {};
      return JSON.parse(lsGet(TREE_KEY, "{}") || "{}");
    } catch (e) {
      return {};
    }
  }

  function getCards() {
    if (typeof w.uftGetStoredCards === "function") {
      try {
        return w.uftGetStoredCards() || [];
      } catch (e) {}
    }
    try {
      var a = JSON.parse(lsGet(CARDS_KEY, "[]") || "[]");
      return Array.isArray(a) ? a : [];
    } catch (e) {
      return [];
    }
  }

  function setCards(cards) {
    lsSet(CARDS_KEY, JSON.stringify(cards || []));
    try {
      if (typeof w.uftSetStoredCards === "function") w.uftSetStoredCards(cards);
    } catch (e) {}
  }

  /** Ensure #uft-preview exists inside #uft-stage — required by core uftRender */
  function ensurePreview() {
    var stage = document.getElementById("uft-stage");
    if (!stage) return null;
    var preview = document.getElementById("uft-preview");
    if (preview) return preview;
    preview = document.createElement("div");
    preview.id = "uft-preview";
    preview.className = "uft-preview";
    preview.setAttribute("data-uft", "preview");
    var zoom = document.getElementById("uft-zoom-layer");
    if (zoom && zoom.parentNode === stage) {
      stage.insertBefore(preview, zoom);
    } else {
      stage.insertBefore(preview, stage.firstChild);
    }
    return preview;
  }

  /** Sync registry names into member cards when cards empty or missing entries */
  function syncRegistryToCards() {
    var tree = readTree();
    var registry = Array.isArray(tree.registry) ? tree.registry : [];
    var cards = getCards();
    var byName = {};
    cards.forEach(function (c, i) {
      if (c && c.name) byName[String(c.name).toLowerCase()] = i;
    });
    var changed = false;
    registry.forEach(function (r) {
      if (!r || !r.name) return;
      var k = String(r.name).toLowerCase();
      if (byName[k] == null) {
        cards.push({
          name: r.name,
          role: r.role || "",
          slot: r.role || "",
          gender: r.gender || "",
          vital: r.vital || "",
          note: r.note || ""
        });
        byName[k] = cards.length - 1;
        changed = true;
      }
    });
    // Backbone slots → cards
    ["self", "spouse", "father", "mother", "pgf", "pgm", "mgf", "mgm"].forEach(function (slot) {
      var name = tree[slot];
      if (!name || typeof name !== "string") return;
      var k = name.trim().toLowerCase();
      if (!k) return;
      if (byName[k] == null) {
        cards.push({ name: name.trim(), role: slot, slot: slot, gender: "", vital: "" });
        byName[k] = cards.length - 1;
        changed = true;
      }
    });
    if (changed) setCards(cards);
    return cards;
  }

  /** Lightweight integrity hints for farāʾiḍ readiness (additive UI) */
  function refreshIntegrity() {
    var el = document.getElementById("uft-integrity");
    if (!el) return;
    var tree = readTree();
    var cards = getCards();
    var issues = [];
    if (!tree.self && !cards.length && !(tree.registry && tree.registry.length)) {
      issues.push("Registry empty — add people to outline the family.");
    }
    cards.forEach(function (c) {
      if (!c || !c.name) return;
      if (!c.gender) issues.push("Missing gender: " + c.name);
      if (!c.vital) issues.push("Missing vital status: " + c.name);
    });
    if (!issues.length) {
      el.textContent = "Outline integrity: no obvious gaps for study (educational only).";
      return;
    }
    el.textContent =
      "Farāʾiḍ readiness hints (educational): " +
      issues.slice(0, 6).join(" · ") +
      (issues.length > 6 ? " …" : "");
  }

  /** Ensure build panel host exists; prefer existing build-viewport inject if already run */
  function ensureBuildHost() {
    if (document.getElementById("uft-bc-apply")) return;
    var host = document.getElementById("clarity-family-tree-host") ||
      document.getElementById("user-family-tree-card");
    if (!host) return;
    if (document.querySelector(".uft-build-panel")) return;
    // If legacy build-viewport is still loaded, let it inject; otherwise minimal host only
    var mount = document.createElement("div");
    mount.id = "uft-stable-build-host";
    mount.className = "uft-build-panel-host";
    host.appendChild(mount);
  }

  function setStatus(msg) {
    var s = document.getElementById("uft-status");
    if (s) s.textContent = msg;
  }

  function boot() {
    if (!isTreePage()) return;
    try {
      ensurePreview();
      syncRegistryToCards();
      ensureBuildHost();
      if (typeof w.uftRender === "function") {
        try {
          w.uftRender({ keepScroll: true });
        } catch (e1) {
          try {
            w.uftRender();
          } catch (e2) {}
        }
      }
      if (typeof w.uftRegRender === "function") {
        try {
          w.uftRegRender();
        } catch (e) {}
      }
      refreshIntegrity();
      setStatus("UFT ready · educational outline on this device · not a legal pedigree");
    } catch (err) {
      console.warn("UFT viewport stable boot", err);
      setStatus("UFT stabilising…");
    }
  }

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  onReady(function () {
    boot();
    setTimeout(boot, 400);
    setTimeout(boot, 1200);
  });

  document.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 100);
  });

  // Public hooks for sim / other modules
  w.uftViewportStableBoot = boot;
  w.uftSyncRegistryToCards = syncRegistryToCards;
  w.uftRefreshIntegrityHints = refreshIntegrity;
})(typeof window !== "undefined" ? window : this);

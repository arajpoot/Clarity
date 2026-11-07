/*! Amānah UFT loaded-ops v1 · P3
 * Loaded member cards: scan & delete duplicates · offload · clear
 * Optional build-from-registry helper for backbone slots
 * Keys: clarity_uft_member_cards_v1 · clarity_user_family_tree_v1
 * Educational only — not a legal pedigree · not a fatwa
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_LOADED_OPS_V1__) return;
  w.__CLARITY_AMANA_UFT_LOADED_OPS_V1__ = true;

  var CARDS_KEY = "clarity_uft_member_cards_v1";
  var TREE_KEY = w.UFT_KEY || "clarity_user_family_tree_v1";

  function isTree() {
    try {
      return /\/amana\/tree\/?/.test(location.pathname || "");
    } catch (e) {
      return false;
    }
  }

  function lsGet(k, fb) {
    try {
      if (w.clarityLS && typeof w.clarityLS.getItem === "function") {
        return w.clarityLS.getItem(k) || fb;
      }
      return localStorage.getItem(k) || fb;
    } catch (e) {
      return fb;
    }
  }
  function lsSet(k, v) {
    try {
      if (w.clarityLS && typeof w.clarityLS.setItem === "function") {
        w.clarityLS.setItem(k, v);
        return;
      }
      localStorage.setItem(k, v);
    } catch (e) {}
  }

  function normName(s) {
    return String(s || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function richness(c) {
    if (!c || typeof c !== "object") return 0;
    var n = 0;
    ["name", "role", "gender", "vital", "phone", "email", "city", "note", "kinship", "line"].forEach(function (k) {
      if (c[k] && String(c[k]).trim()) n += 1;
    });
    return n;
  }

  function dedupeKey(c) {
    if (!c) return "";
    return normName(c.name || c.fullName || "");
  }

  function getCards() {
    if (typeof w.uftGetStoredCards === "function") {
      try {
        var c = w.uftGetStoredCards();
        if (Array.isArray(c)) return c;
      } catch (e) {}
    }
    try {
      var raw = JSON.parse(lsGet(CARDS_KEY, "[]") || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch (e2) {
      return [];
    }
  }

  function setCards(cards) {
    cards = Array.isArray(cards) ? cards : [];
    lsSet(CARDS_KEY, JSON.stringify(cards));
    try {
      if (typeof w.uftSetStoredCards === "function") w.uftSetStoredCards(cards);
    } catch (e) {}
  }

  function setStatus(msg) {
    var el = document.getElementById("uft-status") || document.getElementById("uft-loaded-status");
    if (el) el.textContent = msg;
    try {
      if (typeof w.uftSetStatus === "function") w.uftSetStatus(msg);
    } catch (e) {}
  }

  function refreshListUi() {
    try {
      if (typeof w.uftRegRender === "function") w.uftRegRender();
    } catch (e) {}
    try {
      if (typeof w.uftRegRenderLoaded === "function") w.uftRegRenderLoaded();
    } catch (e2) {}
    var count = document.getElementById("uft-reg-loaded-count");
    if (count) count.textContent = getCards().length + " loaded card(s) on this device";
    var badge = document.getElementById("uft-loaded-count-badge");
    if (badge) badge.textContent = String(getCards().length);
  }

  function scanAndDeleteDuplicates() {
    var cards = getCards();
    if (!cards.length) {
      setStatus("No loaded cards to scan.");
      return { removed: 0, kept: 0 };
    }
    var best = {};
    var order = [];
    cards.forEach(function (c) {
      var k = dedupeKey(c);
      if (!k) return;
      if (!best[k]) {
        best[k] = c;
        order.push(k);
      } else if (richness(c) > richness(best[k])) {
        best[k] = c;
      }
    });
    var kept = order.map(function (k) {
      return best[k];
    });
    var removed = cards.length - kept.length;
    if (!removed) {
      setStatus("Scan complete · no duplicate names (" + cards.length + " cards).");
      return { removed: 0, kept: cards.length };
    }
    if (
      !confirm(
        "Scan & delete duplicates\n\nFound " +
          removed +
          " duplicate name(s) among " +
          cards.length +
          " loaded cards.\n\nOK = keep the fullest record for each name and delete " +
          removed +
          " duplicate(s) from this device.\nCancel = leave unchanged."
      )
    ) {
      return { removed: 0, kept: cards.length, cancelled: true };
    }
    setCards(kept);
    refreshListUi();
    setStatus("Removed " + removed + " duplicate(s) · " + kept.length + " unique loaded cards kept.");
    return { removed: removed, kept: kept.length };
  }

  function offloadLoaded() {
    var cards = getCards();
    if (!cards.length) {
      setStatus("No loaded cards to offload.");
      return false;
    }
    var n = cards.length;
    if (
      !confirm(
        "Offload " +
          n +
          " loaded member card(s)?\n\nOK = download JSON backup, then remove them from this device.\nCancel = keep the list.\n\nPedigree tree and registry contacts are not deleted."
      )
    ) {
      return false;
    }
    try {
      var payload = {
        type: "clarity-member-cards",
        version: 1,
        educationalOnly: true,
        exportedAt: new Date().toISOString(),
        count: n,
        cards: cards
      };
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download =
        "clarity-loaded-members-offload-" +
        new Date().toISOString().slice(0, 10) +
        ".json";
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        try {
          URL.revokeObjectURL(a.href);
          a.remove();
        } catch (e) {}
      }, 1500);
    } catch (e) {
      alert("Could not download backup. Cards were not removed.");
      return false;
    }
    setCards([]);
    refreshListUi();
    setStatus("Offloaded " + n + " loaded card(s) · backup downloaded · list cleared on this device.");
    return true;
  }

  function clearLoaded() {
    var cards = getCards();
    if (!cards.length) {
      setStatus("Loaded list already empty.");
      return;
    }
    if (
      !confirm(
        "Clear " +
          cards.length +
          " loaded member card(s) from this device?\n\nDoes not delete the pedigree tree or registry. Tip: Offload first if you need a backup."
      )
    ) {
      return;
    }
    setCards([]);
    refreshListUi();
    setStatus("Loaded cards cleared on this device.");
  }

  /** Pull registry (+ backbone) into cards when cards empty — additive */
  function syncRegistryIntoCards() {
    var tree = {};
    try {
      if (typeof w.uftRead === "function") tree = w.uftRead() || {};
      else tree = JSON.parse(lsGet(TREE_KEY, "{}") || "{}");
    } catch (e) {
      tree = {};
    }
    var reg = Array.isArray(tree.registry) ? tree.registry : [];
    var cards = getCards();
    var by = {};
    cards.forEach(function (c) {
      var k = dedupeKey(c);
      if (k) by[k] = true;
    });
    var added = 0;
    function add(name, role, gender, vital) {
      name = String(name || "").trim();
      if (!name) return;
      var k = normName(name);
      if (by[k]) return;
      cards.push({
        name: name,
        role: role || "",
        gender: gender || "",
        vital: vital || "",
        source: "registry-sync"
      });
      by[k] = true;
      added += 1;
    }
    reg.forEach(function (r) {
      if (r) add(r.name, r.role || r.relation, r.gender, r.vital);
    });
    ["self", "spouse", "father", "mother", "pgf", "pgm", "mgf", "mgm"].forEach(function (slot) {
      if (tree[slot]) add(tree[slot], slot, "", "");
    });
    if (added) {
      setCards(cards);
      refreshListUi();
    }
    setStatus(
      added
        ? "Synced " + added + " registry name(s) into loaded cards (" + cards.length + " total)."
        : "Loaded cards already cover registry names (" + cards.length + ")."
    );
    return added;
  }

  function panelHtml() {
    return (
      '<div class="amana-card uft-loaded-ops" id="uft-loaded-ops" style="margin-top:0.75rem">' +
      '<h3 style="color:#d4b45a;font-size:0.95rem;margin:0 0 0.35rem">Loaded cards · hygiene</h3>' +
      '<p style="font-size:0.78rem;opacity:0.9;margin:0 0 0.45rem">On-device member list for build / Farāʾiḍ readiness. Educational only — not a legal pedigree.</p>' +
      '<p style="font-size:0.78rem;margin:0 0 0.45rem"><span id="uft-loaded-count-badge">0</span> loaded card(s)</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:0.35rem">' +
      '<button type="button" class="btn-soft" id="uft-loaded-scan">Scan &amp; delete duplicates</button>' +
      '<button type="button" class="btn-soft" id="uft-loaded-offload">⬇ Offload loaded</button>' +
      '<button type="button" class="btn-soft" id="uft-loaded-clear">Clear loaded</button>' +
      '<button type="button" class="btn-soft" id="uft-loaded-sync">Sync registry → cards</button>' +
      "</div>" +
      '<p id="uft-loaded-status" style="font-size:0.75rem;opacity:0.85;margin:0.4rem 0 0"></p>' +
      "</div>"
    );
  }

  function mount() {
    if (!isTree()) return;
    if (document.getElementById("uft-loaded-ops")) {
      refreshListUi();
      return;
    }
    var host =
      document.getElementById("clarity-family-tree-host") ||
      document.getElementById("user-family-tree-card");
    if (!host) return;
    var wrap = document.createElement("div");
    wrap.innerHTML = panelHtml();
    var node = wrap.firstChild;
    var regList = document.getElementById("uft-reg-list");
    if (regList && regList.parentNode) {
      regList.parentNode.appendChild(node);
    } else {
      host.appendChild(node);
    }
    document.getElementById("uft-loaded-scan").onclick = function () {
      scanAndDeleteDuplicates();
    };
    document.getElementById("uft-loaded-offload").onclick = function () {
      offloadLoaded();
    };
    document.getElementById("uft-loaded-clear").onclick = function () {
      clearLoaded();
    };
    document.getElementById("uft-loaded-sync").onclick = function () {
      syncRegistryIntoCards();
    };
    refreshListUi();
  }

  /* Public API — Companion parity names */
  w.uftGetStoredCards = w.uftGetStoredCards || getCards;
  w.uftSetStoredCards = w.uftSetStoredCards || setCards;
  w.uftScanLoadedDuplicates = scanAndDeleteDuplicates;
  w.uftOffloadLoadedCards = offloadLoaded;
  w.uftClearLoadedCards = clearLoaded;
  w.uftSyncRegistryToCards = syncRegistryIntoCards;

  function boot() {
    if (!isTree()) return;
    try {
      mount();
    } catch (e) {
      try {
        console.warn("[UFT loaded-ops]", e);
      } catch (err) {}
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 500);
  setTimeout(boot, 1600);
  document.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 120);
  });
})(typeof window !== "undefined" ? window : this);

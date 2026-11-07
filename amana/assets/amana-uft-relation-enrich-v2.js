/*! Amānah UFT + Farāʾiḍ relation enrich v2 · Phase 2
 * Additive only:
 *  - gender / vital / kinship / line fields on registry form
 *  - persist into registry + member cards
 *  - build-panel pool already carries gender/vital; refresh selects after save
 *  - Farāʾiḍ pages: ensure pull path sees updated registry (same TREE_KEY)
 * Educational only — not a fatwa · not a legal pedigree
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_RELATION_ENRICH_V2__) return;
  w.__CLARITY_AMANA_UFT_RELATION_ENRICH_V2__ = true;

  var TREE_KEY = w.UFT_KEY || "clarity_user_family_tree_v1";
  var CARDS_KEY = "clarity_uft_member_cards_v1";

  function path() {
    try {
      return location.pathname || "";
    } catch (e) {
      return "";
    }
  }
  function isTree() {
    return /\/amana\/tree\/?/.test(path());
  }
  function isFiqh() {
    return /\/amana\/fiqh\/?/.test(path());
  }

  function readTree() {
    try {
      if (typeof w.uftRead === "function") return w.uftRead() || {};
      return JSON.parse(localStorage.getItem(TREE_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function writeTree(d) {
    try {
      if (typeof w.uftApplyData === "function") {
        w.uftApplyData(d);
        return true;
      }
    } catch (e) {}
    try {
      localStorage.setItem(TREE_KEY, JSON.stringify(d));
      return true;
    } catch (e2) {
      return false;
    }
  }

  function getCards() {
    try {
      if (typeof w.uftGetStoredCards === "function") return w.uftGetStoredCards() || [];
      var a = JSON.parse(localStorage.getItem(CARDS_KEY) || "[]");
      return Array.isArray(a) ? a : [];
    } catch (e) {
      return [];
    }
  }

  function setCards(cards) {
    try {
      localStorage.setItem(CARDS_KEY, JSON.stringify(cards || []));
      if (typeof w.uftSetStoredCards === "function") w.uftSetStoredCards(cards);
    } catch (e) {}
  }

  function el(id) {
    return document.getElementById(id);
  }

  function ensureField(afterId, fieldHtml, newId) {
    if (el(newId)) return;
    var after = el(afterId);
    if (!after) return;
    var wrap = after.closest(".uft-field") || after.parentNode;
    if (!wrap || !wrap.parentNode) return;
    var div = document.createElement("div");
    div.className = "uft-field";
    div.innerHTML = fieldHtml;
    wrap.parentNode.insertBefore(div, wrap.nextSibling);
  }

  function injectRegistryFields() {
    if (!isTree()) return;
    // After role field
    ensureField(
      "uft-reg-role",
      '<label for="uft-reg-gender">Gender</label>' +
        '<select id="uft-reg-gender">' +
        '<option value="">—</option>' +
        '<option value="male">Male</option>' +
        '<option value="female">Female</option>' +
        "</select>",
      "uft-reg-gender"
    );
    ensureField(
      "uft-reg-gender",
      '<label for="uft-reg-vital">Vital status</label>' +
        '<select id="uft-reg-vital">' +
        '<option value="">—</option>' +
        '<option value="living">Living</option>' +
        '<option value="deceased">Deceased</option>' +
        "</select>",
      "uft-reg-vital"
    );
    ensureField(
      "uft-reg-vital",
      '<label for="uft-reg-kinship">Kinship (siblings study)</label>' +
        '<select id="uft-reg-kinship">' +
        '<option value="">—</option>' +
        '<option value="full">Full</option>' +
        '<option value="paternal_half">Paternal half</option>' +
        '<option value="maternal_half">Maternal half</option>' +
        "</select>",
      "uft-reg-kinship"
    );
    ensureField(
      "uft-reg-kinship",
      '<label for="uft-reg-line">Line (optional)</label>' +
        '<select id="uft-reg-line">' +
        '<option value="">—</option>' +
        '<option value="paternal">Paternal</option>' +
        '<option value="maternal">Maternal</option>' +
        "</select>",
      "uft-reg-line"
    );
  }

  function readFormExtra() {
    return {
      gender: (el("uft-reg-gender") || {}).value || "",
      vital: (el("uft-reg-vital") || {}).value || "",
      kinship: (el("uft-reg-kinship") || {}).value || "",
      line: (el("uft-reg-line") || {}).value || ""
    };
  }

  function fillFormExtra(row) {
    row = row || {};
    if (el("uft-reg-gender")) el("uft-reg-gender").value = row.gender || "";
    if (el("uft-reg-vital")) el("uft-reg-vital").value = row.vital || "";
    if (el("uft-reg-kinship")) el("uft-reg-kinship").value = row.kinship || "";
    if (el("uft-reg-line")) el("uft-reg-line").value = row.line || "";
  }

  function upsertCardFromRow(row) {
    if (!row || !row.name) return;
    var cards = getCards();
    var k = String(row.name).toLowerCase();
    var i,
      found = -1;
    for (i = 0; i < cards.length; i++) {
      if (cards[i] && String(cards[i].name || "").toLowerCase() === k) {
        found = i;
        break;
      }
    }
    var base =
      found >= 0
        ? cards[found]
        : { name: row.name, role: row.role || "", slot: row.role || "" };
    base.name = row.name;
    if (row.role) {
      base.role = row.role;
      base.slot = row.role;
    }
    if (row.gender) base.gender = row.gender;
    if (row.vital) base.vital = row.vital;
    if (row.kinship) base.kinship = row.kinship;
    if (row.line) base.line = row.line;
    if (found >= 0) cards[found] = base;
    else cards.push(base);
    setCards(cards);
  }

  function patchRegistrySave() {
    if (!isTree()) return;
    // Intercept clicks on common save buttons without removing handlers
    document.addEventListener(
      "click",
      function (ev) {
        var t = ev.target;
        if (!t || !t.id) return;
        var id = t.id;
        if (
          id !== "uft-reg-save" &&
          id !== "uft-reg-add" &&
          id !== "uft-save-member" &&
          id !== "uft-reg-save-btn"
        ) {
          // also match button text inside registry card
          if (!(t.tagName === "BUTTON" && /save member|add to registry|save/i.test(t.textContent || ""))) {
            return;
          }
        }
        setTimeout(function () {
          var name = ((el("uft-reg-name") || {}).value || "").trim();
          if (!name) return;
          var extra = readFormExtra();
          var d = readTree();
          d.registry = Array.isArray(d.registry) ? d.registry : [];
          var row = null;
          var editId = ((el("uft-reg-edit-id") || {}).value || "").trim();
          if (editId) {
            row = d.registry.find(function (r) {
              return r && r.id === editId;
            });
          }
          if (!row) {
            row = d.registry.find(function (r) {
              return r && String(r.name || "").toLowerCase() === name.toLowerCase();
            });
          }
          if (row) {
            row.gender = extra.gender || row.gender || "";
            row.vital = extra.vital || row.vital || "";
            row.kinship = extra.kinship || row.kinship || "";
            row.line = extra.line || row.line || "";
            writeTree(d);
            upsertCardFromRow(row);
          } else {
            // Core may have just pushed the row — re-read and patch last matching name
            d = readTree();
            d.registry = Array.isArray(d.registry) ? d.registry : [];
            for (var i = d.registry.length - 1; i >= 0; i--) {
              if (d.registry[i] && String(d.registry[i].name || "").toLowerCase() === name.toLowerCase()) {
                d.registry[i].gender = extra.gender || d.registry[i].gender || "";
                d.registry[i].vital = extra.vital || d.registry[i].vital || "";
                d.registry[i].kinship = extra.kinship || d.registry[i].kinship || "";
                d.registry[i].line = extra.line || d.registry[i].line || "";
                writeTree(d);
                upsertCardFromRow(d.registry[i]);
                break;
              }
            }
          }
          if (typeof w.uftRefreshIntegrityHintsHints === "function") {
            try {
              w.uftRefreshIntegrityHints();
            } catch (e) {}
          }
          // Nudge build selectors if present
          if (typeof w.uftBuildViewportRefresh === "function") {
            try {
              w.uftBuildViewportRefresh();
            } catch (e2) {}
          }
        }, 50);
      },
      true
    );
  }

  function patchRegistryLoadIntoForm() {
    if (!isTree()) return;
    // When edit id or name changes from core load, try fill extras from registry
    document.addEventListener(
      "click",
      function (ev) {
        var t = ev.target;
        if (!t) return;
        var id = t.getAttribute && t.getAttribute("data-reg-edit");
        if (!id && t.id !== "uft-reg-load-card") return;
        setTimeout(function () {
          var d = readTree();
          var editId = ((el("uft-reg-edit-id") || {}).value || "").trim();
          var name = ((el("uft-reg-name") || {}).value || "").trim();
          var row = null;
          (d.registry || []).forEach(function (r) {
            if (!r) return;
            if (editId && r.id === editId) row = r;
            else if (name && String(r.name || "").toLowerCase() === name.toLowerCase()) row = r;
          });
          if (row) fillFormExtra(row);
        }, 30);
      },
      true
    );
  }

  function enhanceBuildSearch() {
    if (!isTree()) return;
    var panel = el("uft-build-section");
    if (!panel || el("uft-bc-filter")) return;
    var hint = panel.querySelector(".uft-hint");
    var bar = document.createElement("div");
    bar.className = "uft-field";
    bar.style.margin = "0.35rem 0";
    bar.innerHTML =
      '<label for="uft-bc-filter">Filter list</label>' +
      '<input id="uft-bc-filter" type="search" placeholder="Name, role, gender…" autocomplete="off"/>';
    if (hint && hint.parentNode) hint.parentNode.insertBefore(bar, hint.nextSibling);
    else panel.appendChild(bar);

    var input = el("uft-bc-filter");
    if (!input) return;
    input.addEventListener("input", function () {
      var q = (input.value || "").toLowerCase().trim();
      ["uft-bc-self", "uft-bc-spouse", "uft-bc-father", "uft-bc-mother"].forEach(function (sid) {
        var sel = el(sid);
        if (!sel) return;
        Array.prototype.forEach.call(sel.options, function (opt, idx) {
          if (idx === 0) return;
          var show = !q || (opt.textContent || "").toLowerCase().indexOf(q) >= 0;
          opt.hidden = !show;
          opt.disabled = !show;
        });
      });
    });
  }

  function fiqhHint() {
    if (!isFiqh()) return;
    var card = el("faraid-card") || document.querySelector(".amana-card");
    if (!card || el("uft-relation-fiqh-hint")) return;
    var p = document.createElement("p");
    p.id = "uft-relation-fiqh-hint";
    p.style.cssText = "font-size:0.82rem;opacity:0.9;margin:0.5rem 0";
    p.innerHTML =
      "Heirs load from the same on-device family tree. Set <strong>gender</strong> and <strong>vital</strong> on Tree registry rows for cleaner study pulls. Educational only — not a fatwa.";
    card.insertBefore(p, card.firstChild);
  }

  function boot() {
    try {
      injectRegistryFields();
      patchRegistrySave();
      patchRegistryLoadIntoForm();
      enhanceBuildSearch();
      fiqhHint();
    } catch (e) {
      console.warn("relation-enrich v2", e);
    }
  }

  function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  onReady(function () {
    boot();
    setTimeout(boot, 500);
  });

  document.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 120);
  });

  w.uftRelationEnrichBoot = boot;
})(typeof window !== "undefined" ? window : this);

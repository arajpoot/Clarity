/*! Amānah UFT build + viewport bridge v1
 * Injects Companion architecture:
 *  - chip legend on pedigree viewport
 *  - Build tree from registry / cards panel (exact IDs for UFT core)
 *  - Populates selectors from registry + member cards
 *  - Fallback apply if core handlers missing
 * Educational only — not a legal pedigree
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_BUILD_VIEWPORT_V1__) return;
  w.__CLARITY_AMANA_UFT_BUILD_VIEWPORT_V1__ = true;

  var TREE_KEY = w.UFT_KEY || "clarity_user_family_tree_v1";
  var CARDS_KEY = "clarity_uft_member_cards_v1";

  function isTree() {
    return /\/amana\/tree\/?/.test(location.pathname || "");
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
    if (typeof w.uftApplyData === "function") {
      try {
        w.uftApplyData(d);
        return true;
      } catch (e) {}
    }
    try {
      localStorage.setItem(TREE_KEY, JSON.stringify(d));
      if (typeof w.uftLoad === "function") w.uftLoad();
      if (typeof w.uftRender === "function") w.uftRender();
      return true;
    } catch (e) {
      return false;
    }
  }

  function getCards() {
    if (typeof w.uftGetStoredCards === "function") {
      try {
        return w.uftGetStoredCards() || [];
      } catch (e) {}
    }
    try {
      var raw = localStorage.getItem(CARDS_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function peoplePool() {
    var tree = readTree();
    var map = {};
    function add(name, role, gender, vital, gen) {
      name = String(name || "").trim();
      if (!name) return;
      var k = name.toLowerCase();
      if (!map[k]) {
        map[k] = {
          name: name,
          role: role || "",
          gender: gender || "",
          vital: vital || "",
          generationHint: gen || ""
        };
      }
    }
    (tree.registry || []).forEach(function (r) {
      if (r) add(r.name, r.role, r.gender, r.vital, r.role);
    });
    getCards().forEach(function (c) {
      if (c) add(c.name, c.slot || c.role, c.gender, c.vital, c.generationHint || c.slot);
    });
    if (tree.self) add(tree.self, "self");
    if (tree.spouse) add(tree.spouse, "spouse");
    if (tree.father) add(tree.father, "father");
    if (tree.mother) add(tree.mother, "mother");
    return Object.keys(map)
      .map(function (k) {
        return map[k];
      })
      .sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
  }

  function legendHtml() {
    return (
      '<div class="uft-chip-legend" id="uft-chip-legend" title="Pedigree legend">' +
      '<span class="uft-leg-item"><span class="uft-leg-chip live">●</span> Alive</span>' +
      '<span class="uft-leg-item"><span class="uft-leg-chip dead">†</span> Deceased</span>' +
      '<span class="uft-leg-item"><span class="uft-leg-chip">♂♀</span> Gender</span>' +
      '<span class="uft-leg-item"><span class="uft-leg-chip">Yr</span> Birth year</span>' +
      '<span class="uft-leg-item"><span class="uft-leg-chip">👪</span> Family</span>' +
      '<span class="uft-leg-item"><span class="uft-leg-chip own">🌳</span> Own Family Tree</span>' +
      '<span class="uft-leg-item"><span class="uft-leg-chip add">＋</span> Add relative</span>' +
      "</div>"
    );
  }

  function buildPanelHtml() {
    return (
      '<details class="uft-build-panel" id="uft-build-section" open>' +
      "<summary>Build tree from registry / loaded list</summary>" +
      '<p class="uft-hint">Map people from the registry (and any uploaded member cards) into generations, then apply to the pedigree workspace.</p>' +
      '<div class="uft-build-cards" id="uft-build-from-cards">' +
      '<div class="uft-reg-section-title">Build pedigree <span class="uft-badge">from list</span></div>' +
      '<p class="uft-hint">Choose the focus person and each generation from the list, then apply.</p>' +
      '<label style="display:block;margin:0 0 0.45rem;font-size:0.78rem;font-weight:600">Search cards' +
      '<input type="search" id="uft-card-search" placeholder="e.g. kar, nad…" autocomplete="off"/></label>' +
      '<div class="uft-build-grid">' +
      '<label>Focus person *<select id="uft-bc-self"><option value="">Select…</option></select></label>' +
      '<label>Spouse<select id="uft-bc-spouse"><option value="">Select…</option></select></label>' +
      '<label>Father<select id="uft-bc-father"><option value="">Select…</option></select></label>' +
      '<label>Mother<select id="uft-bc-mother"><option value="">Select…</option></select></label>' +
      '<label>Father’s father<select id="uft-bc-pgf"><option value="">Select…</option></select></label>' +
      '<label>Father’s mother<select id="uft-bc-pgm"><option value="">Select…</option></select></label>' +
      '<label>Mother’s father<select id="uft-bc-mgf"><option value="">Select…</option></select></label>' +
      '<label>Mother’s mother<select id="uft-bc-mgm"><option value="">Select…</option></select></label>' +
      '<label>Add to G1 (oldest) — multi<select id="uft-bc-g1" multiple size="3"></select></label>' +
      '<label>Add to G2 — multi<select id="uft-bc-g2" multiple size="3"></select></label>' +
      '<label>Add to G3 — multi<select id="uft-bc-g3" multiple size="3"></select></label>' +
      '<label>Siblings of You — multi<select id="uft-bc-siblings" multiple size="3"></select></label>' +
      '<label>Children of You — multi<select id="uft-bc-children" multiple size="3"></select></label>' +
      '<label>Grandchildren — multi<select id="uft-bc-grandchildren" multiple size="3"></select></label>' +
      "</div>" +
      '<div class="uft-build-actions">' +
      '<button type="button" id="uft-bc-apply">Apply selections → pedigree</button>' +
      '<button type="button" class="btn-secondary" id="uft-bc-suggest">Auto-suggest from roles</button>' +
      '<button type="button" class="btn-secondary" id="uft-bc-clear">Clear selectors</button>' +
      '<button type="button" class="btn-secondary" id="uft-bc-refresh">↻ Refresh list</button>' +
      "</div>" +
      '<p class="uft-hint" id="uft-bc-msg" role="status"></p>' +
      '<div class="uft-member-strip" id="uft-member-strip" aria-label="Registry members"></div>' +
      "</div></details>"
    );
  }

  function ensureViewportChrome() {
    var stage = document.getElementById("uft-stage");
    if (!stage) return;

    if (!document.getElementById("uft-chip-legend")) {
      var leg = document.createElement("div");
      leg.innerHTML = legendHtml();
      stage.insertBefore(leg.firstChild, stage.firstChild);
    }

    // Zoom bar if missing
    if (!document.getElementById("uft-zoom-bar-amana")) {
      var zb = document.createElement("div");
      zb.id = "uft-zoom-bar-amana";
      zb.className = "uft-zoom-bar";
      zb.innerHTML =
        '<span style="opacity:.85;margin-right:.25rem">Zoom</span>' +
        '<button type="button" onclick="typeof uftZoomSet===\'function\'&&uftZoomSet(0.75)">75%</button>' +
        '<button type="button" onclick="typeof uftZoomSet===\'function\'&&uftZoomSet(1)">100%</button>' +
        '<button type="button" onclick="typeof uftZoomSet===\'function\'&&uftZoomSet(1.5)">150%</button>' +
        '<button type="button" onclick="typeof uftZoomSet===\'function\'&&uftZoomSet(2)">200%</button>' +
        '<button type="button" onclick="typeof uftZoomFit===\'function\'&&uftZoomFit()">Fit</button>' +
        '<button type="button" onclick="typeof uftZoomReset===\'function\'&&uftZoomReset()">Reset</button>';
      var legend = document.getElementById("uft-chip-legend");
      if (legend && legend.parentNode) legend.parentNode.insertBefore(zb, legend.nextSibling);
      else stage.insertBefore(zb, stage.firstChild);
    }
  }

  function ensureBuildPanel() {
    if (document.getElementById("uft-build-section")) return;
    var card = document.getElementById("user-family-tree-card");
    if (!card) return;
    var wrap = document.createElement("div");
    wrap.innerHTML = buildPanelHtml();
    var node = wrap.firstChild;
    // Place after registry deep or after stage
    var deep = document.getElementById("uft-registry-deep");
    var stage = document.getElementById("uft-stage");
    if (deep && deep.parentNode) deep.parentNode.insertBefore(node, deep.nextSibling);
    else if (stage && stage.parentNode) stage.parentNode.insertBefore(node, stage.nextSibling);
    else card.appendChild(node);

    bindBuild();
  }

  function fillSelect(sel, people, multi) {
    if (!sel) return;
    var prev = multi
      ? Array.prototype.map.call(sel.selectedOptions || [], function (o) {
          return o.value;
        })
      : sel.value;
    var opts =
      (multi ? "" : '<option value="">Select…</option>') +
      people
        .map(function (p) {
          var label = p.name + (p.role ? " · " + p.role : "") + (p.generationHint ? " · " + p.generationHint : "");
          return '<option value="' + escapeAttr(p.name) + '">' + escapeHtml(label) + "</option>";
        })
        .join("");
    sel.innerHTML = opts;
    if (multi) {
      Array.prototype.forEach.call(sel.options, function (o) {
        if (prev.indexOf(o.value) >= 0) o.selected = true;
      });
    } else if (prev) sel.value = prev;
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/"/g, "&quot;");
  }

  function refreshSelectors(filter) {
    var people = peoplePool();
    if (filter) {
      var q = String(filter).toLowerCase();
      people = people.filter(function (p) {
        return (p.name + " " + p.role + " " + p.generationHint).toLowerCase().indexOf(q) >= 0;
      });
    }
    [
      "uft-bc-self",
      "uft-bc-spouse",
      "uft-bc-father",
      "uft-bc-mother",
      "uft-bc-pgf",
      "uft-bc-pgm",
      "uft-bc-mgf",
      "uft-bc-mgm"
    ].forEach(function (id) {
      fillSelect(document.getElementById(id), people, false);
    });
    ["uft-bc-g1", "uft-bc-g2", "uft-bc-g3", "uft-bc-siblings", "uft-bc-children", "uft-bc-grandchildren"].forEach(
      function (id) {
        fillSelect(document.getElementById(id), people, true);
      }
    );

    var strip = document.getElementById("uft-member-strip");
    if (strip) {
      strip.innerHTML = people
        .slice(0, 24)
        .map(function (p) {
          return (
            '<span class="uft-member-chip"><strong>' +
            escapeHtml(p.name) +
            "</strong>" +
            (p.role ? '<span class="meta">' + escapeHtml(p.role) + "</span>" : "") +
            "</span>"
          );
        })
        .join("");
    }
    var msg = document.getElementById("uft-bc-msg");
    if (msg) msg.textContent = people.length ? people.length + " people available to map" : "Add people in the registry first";
  }

  function selectedMulti(id) {
    var sel = document.getElementById(id);
    if (!sel) return [];
    return Array.prototype.map.call(sel.selectedOptions || [], function (o) {
      return o.value;
    }).filter(Boolean);
  }

  function applyFallback() {
    var d = readTree();
    function val(id) {
      var el = document.getElementById(id);
      return el && el.value ? el.value.trim() : "";
    }
    if (val("uft-bc-self")) d.self = val("uft-bc-self");
    if (val("uft-bc-spouse")) d.spouse = val("uft-bc-spouse");
    if (val("uft-bc-father")) d.father = val("uft-bc-father");
    if (val("uft-bc-mother")) d.mother = val("uft-bc-mother");
    if (val("uft-bc-pgf")) d.pgf = val("uft-bc-pgf");
    if (val("uft-bc-pgm")) d.pgm = val("uft-bc-pgm");
    if (val("uft-bc-mgf")) d.mgf = val("uft-bc-mgf");
    if (val("uft-bc-mgm")) d.mgm = val("uft-bc-mgm");
    var sib = selectedMulti("uft-bc-siblings");
    var chi = selectedMulti("uft-bc-children");
    var gc = selectedMulti("uft-bc-grandchildren");
    var g1 = selectedMulti("uft-bc-g1");
    var g2 = selectedMulti("uft-bc-g2");
    var g3 = selectedMulti("uft-bc-g3");
    if (sib.length) d.siblings = sib.join(", ");
    if (chi.length) d.children = chi.join(", ");
    if (gc.length) d.grandchildren = gc.join(", ");
    if (g1.length) d.g1 = g1.join(", ");
    if (g2.length) d.g2 = g2.join(", ");
    if (g3.length) d.g3 = g3.join(", ");
    d.savedAt = new Date().toISOString();
    writeTree(d);
    try {
      if (typeof w.uftSave === "function") w.uftSave();
      if (typeof w.uftRender === "function") w.uftRender();
      if (typeof w.uftLoad === "function") w.uftLoad();
    } catch (e) {}
    var msg = document.getElementById("uft-bc-msg");
    if (msg) msg.textContent = "Applied to pedigree on this device · educational outline only";
  }

  function suggestFromRoles() {
    var people = peoplePool();
    function setIf(id, pred) {
      var el = document.getElementById(id);
      if (!el) return;
      var hit = people.filter(pred)[0];
      if (hit) el.value = hit.name;
    }
    setIf("uft-bc-self", function (p) {
      return /self/i.test(p.role);
    });
    setIf("uft-bc-spouse", function (p) {
      return /spouse|husband|wife/i.test(p.role);
    });
    setIf("uft-bc-father", function (p) {
      return p.role === "father";
    });
    setIf("uft-bc-mother", function (p) {
      return p.role === "mother";
    });
    setIf("uft-bc-pgf", function (p) {
      return p.role === "pgf" || /paternal grandfather/i.test(p.role);
    });
    setIf("uft-bc-pgm", function (p) {
      return p.role === "pgm" || /paternal grandmother/i.test(p.role);
    });
    setIf("uft-bc-mgf", function (p) {
      return p.role === "mgf" || /maternal grandfather/i.test(p.role);
    });
    setIf("uft-bc-mgm", function (p) {
      return p.role === "mgm" || /maternal grandmother/i.test(p.role);
    });
    function multi(id, pred) {
      var el = document.getElementById(id);
      if (!el) return;
      Array.prototype.forEach.call(el.options, function (o) {
        var p = people.filter(function (x) {
          return x.name === o.value;
        })[0];
        o.selected = !!(p && pred(p));
      });
    }
    multi("uft-bc-siblings", function (p) {
      return /sibling|brother|sister/i.test(p.role);
    });
    multi("uft-bc-children", function (p) {
      return /^(son|daughter|child)$/i.test(p.role);
    });
    multi("uft-bc-grandchildren", function (p) {
      return /grandchild|grandson|granddaughter/i.test(p.role);
    });
    var msg = document.getElementById("uft-bc-msg");
    if (msg) msg.textContent = "Suggested from registry roles — review then Apply";
  }

  function bindBuild() {
    var search = document.getElementById("uft-card-search");
    if (search) {
      search.oninput = function () {
        if (typeof w.uftFilterCardSelects === "function") {
          try {
            w.uftFilterCardSelects(search.value);
          } catch (e) {}
        }
        refreshSelectors(search.value);
      };
    }
    var apply = document.getElementById("uft-bc-apply");
    if (apply) {
      apply.onclick = function () {
        if (typeof w.uftApplyBuildFromCards === "function") {
          try {
            w.uftApplyBuildFromCards();
            var msg = document.getElementById("uft-bc-msg");
            if (msg) msg.textContent = "Applied via UFT core → pedigree";
            return;
          } catch (e) {}
        }
        applyFallback();
      };
    }
    var sug = document.getElementById("uft-bc-suggest");
    if (sug) {
      sug.onclick = function () {
        if (typeof w.uftSuggestBuildFromCards === "function") {
          try {
            w.uftSuggestBuildFromCards();
            return;
          } catch (e) {}
        }
        suggestFromRoles();
      };
    }
    var clr = document.getElementById("uft-bc-clear");
    if (clr) {
      clr.onclick = function () {
        if (typeof w.uftClearBuildFromCards === "function") {
          try {
            w.uftClearBuildFromCards();
          } catch (e) {}
        }
        [
          "uft-bc-self",
          "uft-bc-spouse",
          "uft-bc-father",
          "uft-bc-mother",
          "uft-bc-pgf",
          "uft-bc-pgm",
          "uft-bc-mgf",
          "uft-bc-mgm"
        ].forEach(function (id) {
          var el = document.getElementById(id);
          if (el) el.value = "";
        });
        ["uft-bc-g1", "uft-bc-g2", "uft-bc-g3", "uft-bc-siblings", "uft-bc-children", "uft-bc-grandchildren"].forEach(
          function (id) {
            var el = document.getElementById(id);
            if (!el) return;
            Array.prototype.forEach.call(el.options, function (o) {
              o.selected = false;
            });
          }
        );
      };
    }
    var ref = document.getElementById("uft-bc-refresh");
    if (ref) ref.onclick = function () {
      refreshSelectors((document.getElementById("uft-card-search") || {}).value || "");
    };

    // Global aliases for Companion onclick parity
    if (typeof w.uftApplyBuildFromCards !== "function") w.uftApplyBuildFromCards = applyFallback;
    if (typeof w.uftSuggestBuildFromCards !== "function") w.uftSuggestBuildFromCards = suggestFromRoles;
    if (typeof w.uftClearBuildFromCards !== "function") {
      w.uftClearBuildFromCards = function () {
        if (clr) clr.click();
      };
    }
    if (typeof w.uftFilterCardSelects !== "function") {
      w.uftFilterCardSelects = function (q) {
        refreshSelectors(q);
      };
    }
  }

  function boot() {
    if (!isTree()) return;
    try {
      ensureViewportChrome();
      ensureBuildPanel();
      refreshSelectors("");
    } catch (e) {
      try {
        console.warn("[UFT build viewport]", e);
      } catch (err) {}
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 500);
  setTimeout(boot, 1600);
  setTimeout(function () {
    refreshSelectors("");
  }, 2200);
  document.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 120);
  });
})(window);

/*! Amānah UFT visual tree fix v1
 * Why Companion pedigree cards did not appear:
 *  1) uftRender() requires #uft-preview — Amānah only had #uft-stage bands
 *  2) uftApplyBuildFromCards() requires clarity_uft_member_cards_v1
 *  3) Build <select> values must be card INDEXES, not names
 *  4) uftFields() needs elements with .value (inputs)
 * This bridge fixes the DOM, syncs registry→cards, rebinds build, forces render.
 * Educational only — not a legal pedigree
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_VISUAL_FIX_V1__) return;
  w.__CLARITY_AMANA_UFT_VISUAL_FIX_V1__ = true;

  var TREE_KEY = w.UFT_KEY || "clarity_user_family_tree_v1";
  var CARDS_KEY = "clarity_uft_member_cards_v1";
  var FIELD_IDS = [
    "g1",
    "g2",
    "g3",
    "self",
    "selfNote",
    "father",
    "fatherY",
    "mother",
    "motherY",
    "spouse",
    "pgf",
    "pgm",
    "mgf",
    "mgm",
    "children",
    "grandchildren",
    "siblings"
  ];

  function isTree() {
    return /\/amana\/tree\/?/.test(location.pathname || "");
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
      return JSON.parse(lsGet(TREE_KEY, "{}") || "{}");
    } catch (e) {
      return {};
    }
  }

  function getCards() {
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

  /** Ensure #uft-preview canvas exists — required by uftRender */
  function ensurePreview() {
    var stage = document.getElementById("uft-stage");
    if (!stage) return null;
    var preview = document.getElementById("uft-preview");
    if (preview) {
      preview.classList.add("uft-tree");
      return preview;
    }
    preview = document.createElement("div");
    preview.id = "uft-preview";
    preview.className = "uft-tree";
    preview.setAttribute("data-uft", "preview");
    // Prefer insert at top of stage (Companion order: legend, preview)
    var legend = document.getElementById("uft-chip-legend");
    if (legend && legend.parentNode === stage) {
      stage.insertBefore(preview, legend.nextSibling);
    } else {
      stage.insertBefore(preview, stage.firstChild);
    }
    // Hide legacy empty backbone bands so they don't compete with painted pedigree
    stage.querySelectorAll(".uft-band, #uft-backbone").forEach(function (el) {
      el.setAttribute("data-uft-legacy", "1");
      el.style.display = "none";
    });
    return preview;
  }

  /**
   * Backbone slots on Amānah were empty <div id="uft-self">…
   * uftFields/collect need .value → convert to hidden inputs in a data form,
   * keep visual ids available for any CSS that targets them via data-slot.
   */
  function ensureFieldInputs() {
    var host = document.getElementById("user-family-tree-card") || document.body;
    var form = document.getElementById("uft-data-fields");
    if (!form) {
      form = document.createElement("div");
      form.id = "uft-data-fields";
      form.className = "uft-data-fields";
      form.setAttribute("aria-hidden", "true");
      form.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;";
      host.appendChild(form);
    }
    var tree = readTree();
    FIELD_IDS.forEach(function (key) {
      var id = key === "selfNote" ? "uft-self-note" : "uft-" + key.replace(/[A-Z]/g, function (c) {
        return "-" + c.toLowerCase();
      });
      // Map camelCase selfNote already handled; fatherY → uft-father-y
      if (key === "fatherY") id = "uft-father-y";
      if (key === "motherY") id = "uft-mother-y";
      if (key === "selfNote") id = "uft-self-note";

      var existing = document.getElementById(id);
      if (existing && existing.tagName === "INPUT") return;
      if (existing && existing.tagName === "TEXTAREA") return;

      // If a DIV occupies the id (legacy stage slot), retarget it
      if (existing && existing.tagName === "DIV") {
        existing.id = id + "-slot";
        existing.setAttribute("data-uft-slot", key);
      }

      var input = document.createElement(key === "g1" || key === "g2" || key === "g3" || key === "children" || key === "siblings" || key === "grandchildren" ? "textarea" : "input");
      input.id = id;
      input.name = id;
      if (input.tagName === "INPUT") input.type = "text";
      if (tree[key] != null && typeof tree[key] !== "object") input.value = String(tree[key]);
      form.appendChild(input);
    });
  }

  /** Push registry rows into member cards store so Apply Build can run */
  function syncRegistryToCards() {
    var tree = readTree();
    var reg = Array.isArray(tree.registry) ? tree.registry : [];
    var cards = getCards();
    var byName = {};
    cards.forEach(function (c, i) {
      if (c && c.name) byName[String(c.name).trim().toLowerCase()] = i;
    });
    function upsert(row) {
      if (!row || !row.name) return;
      var name = String(row.name).trim();
      var k = name.toLowerCase();
      var payload = {
        name: name,
        role: row.role || "",
        slot: row.role || "",
        gender: row.gender || "",
        vital: row.vital || "",
        phone: row.phone || "",
        email: row.email || "",
        city: row.city || "",
        note: row.note || "",
        generationHint: row.role || row.generationHint || "",
        _fromReg: true
      };
      if (byName[k] != null) {
        var prev = cards[byName[k]] || {};
        cards[byName[k]] = Object.assign({}, prev, payload);
      } else {
        byName[k] = cards.length;
        cards.push(payload);
      }
    }
    reg.forEach(upsert);
    // backbone names
    [
      ["self", tree.self],
      ["spouse", tree.spouse],
      ["father", tree.father],
      ["mother", tree.mother],
      ["pgf", tree.pgf],
      ["pgm", tree.pgm],
      ["mgf", tree.mgf],
      ["mgm", tree.mgm]
    ].forEach(function (pair) {
      if (pair[1]) upsert({ name: pair[1], role: pair[0] });
    });
    function lines(v, role) {
      if (!v) return;
      String(v)
        .split(/[\n,;]+/)
        .map(function (s) {
          return s.trim();
        })
        .filter(Boolean)
        .forEach(function (n) {
          upsert({ name: n, role: role });
        });
    }
    lines(tree.children, "child");
    lines(tree.siblings, "sibling");
    lines(tree.grandchildren, "grandchild");
    lines(tree.g1, "g1");
    lines(tree.g2, "g2");
    lines(tree.g3, "g3");
    setCards(cards);
    return cards;
  }

  function fillCardSelect(sel, cards, multi) {
    if (!sel) return;
    var prev = multi
      ? Array.prototype.map.call(sel.selectedOptions || [], function (o) {
          return o.value;
        })
      : [sel.value];
    var html = multi ? "" : '<option value="">Select…</option>';
    cards.forEach(function (c, i) {
      if (!c || !c.name) return;
      var label = c.name + (c.role || c.slot ? " · " + (c.role || c.slot) : "") + (c.generationHint ? " · " + c.generationHint : "");
      html += '<option value="' + i + '">' + String(label).replace(/</g, "") + "</option>";
    });
    sel.innerHTML = html;
    if (multi) {
      Array.prototype.forEach.call(sel.options, function (o) {
        if (prev.indexOf(o.value) >= 0) o.selected = true;
      });
    } else if (prev[0]) sel.value = prev[0];
  }

  function refreshBuildSelectors() {
    var cards = getCards();
    var panel = document.getElementById("uft-build-from-cards");
    if (panel) panel.hidden = false; // always show — we sync from registry
    ["self", "spouse", "father", "mother", "pgf", "pgm", "mgf", "mgm"].forEach(function (k) {
      fillCardSelect(document.getElementById("uft-bc-" + k), cards, false);
    });
    ["g1", "g2", "g3", "siblings", "children", "grandchildren"].forEach(function (k) {
      fillCardSelect(document.getElementById("uft-bc-" + k), cards, true);
    });
    // Prefer core refresher when present
    try {
      if (typeof w.uftRefreshCardPicker === "function") w.uftRefreshCardPicker();
    } catch (e) {}
  }

  function forceRender() {
    ensurePreview();
    try {
      if (typeof w.uftSave === "function") w.uftSave();
    } catch (e) {}
    try {
      if (typeof w.uftLoad === "function") w.uftLoad();
    } catch (e) {}
    try {
      if (typeof w.uftRender === "function") w.uftRender();
    } catch (e) {
      try {
        console.warn("[UFT visual] render", e);
      } catch (err) {}
    }
  }

  function patchApplyBuild() {
    var core = w.uftApplyBuildFromCards;
    w.uftApplyBuildFromCards = function () {
      syncRegistryToCards();
      refreshBuildSelectors();
      var cards = getCards();
      if (!cards.length) {
        alert("Add people in the registry first (or upload member cards). Then select Focus person and Apply.");
        return;
      }
      // Ensure selects use indexes — re-fill if user still has name values
      var selfSel = document.getElementById("uft-bc-self");
      if (selfSel && selfSel.value && isNaN(parseInt(selfSel.value, 10))) {
        refreshBuildSelectors();
        alert("Selectors refreshed to member-card indexes. Choose Focus person again, then Apply.");
        return;
      }
      ensureFieldInputs();
      ensurePreview();
      if (typeof core === "function") {
        try {
          core();
        } catch (e) {
          try {
            console.warn(e);
          } catch (err) {}
          applyManualFromSelects();
        }
      } else {
        applyManualFromSelects();
      }
      // After core sets field values, save + paint pedigree cards
      try {
        if (typeof w.uftSave === "function") w.uftSave();
      } catch (e) {}
      setTimeout(forceRender, 50);
      setTimeout(forceRender, 300);
      var msg = document.getElementById("uft-bc-msg");
      if (msg) msg.textContent = "Applied · painting pedigree cards in viewport…";
    };
  }

  function selectedNames(selId) {
    var sel = document.getElementById(selId);
    var cards = getCards();
    if (!sel) return [];
    var idxs = sel.multiple
      ? Array.prototype.map.call(sel.selectedOptions || [], function (o) {
          return parseInt(o.value, 10);
        })
      : sel.value === ""
        ? []
        : [parseInt(sel.value, 10)];
    var names = [];
    idxs.forEach(function (i) {
      if (!isNaN(i) && cards[i] && cards[i].name) names.push(String(cards[i].name).trim());
    });
    return names;
  }

  function applyManualFromSelects() {
    ensureFieldInputs();
    function setField(id, val) {
      var el = document.getElementById(id);
      if (el) el.value = val || "";
    }
    var self = selectedNames("uft-bc-self")[0] || "";
    if (!self) {
      alert("Select the focus person.");
      return;
    }
    setField("uft-self", self);
    setField("uft-spouse", selectedNames("uft-bc-spouse")[0] || "");
    setField("uft-father", selectedNames("uft-bc-father")[0] || "");
    setField("uft-mother", selectedNames("uft-bc-mother")[0] || "");
    setField("uft-pgf", selectedNames("uft-bc-pgf")[0] || "");
    setField("uft-pgm", selectedNames("uft-bc-pgm")[0] || "");
    setField("uft-mgf", selectedNames("uft-bc-mgf")[0] || "");
    setField("uft-mgm", selectedNames("uft-bc-mgm")[0] || "");
    setField("uft-g1", selectedNames("uft-bc-g1").join("\n"));
    setField("uft-g2", selectedNames("uft-bc-g2").join("\n"));
    setField("uft-g3", selectedNames("uft-bc-g3").join("\n"));
    setField("uft-siblings", selectedNames("uft-bc-siblings").join("\n"));
    setField("uft-children", selectedNames("uft-bc-children").join("\n"));
    setField("uft-grandchildren", selectedNames("uft-bc-grandchildren").join("\n"));

    // Persist into tree key
    var d = readTree();
    d.self = self;
    d.spouse = selectedNames("uft-bc-spouse")[0] || d.spouse || "";
    d.father = selectedNames("uft-bc-father")[0] || "";
    d.mother = selectedNames("uft-bc-mother")[0] || "";
    d.pgf = selectedNames("uft-bc-pgf")[0] || "";
    d.pgm = selectedNames("uft-bc-pgm")[0] || "";
    d.mgf = selectedNames("uft-bc-mgf")[0] || "";
    d.mgm = selectedNames("uft-bc-mgm")[0] || "";
    d.g1 = selectedNames("uft-bc-g1").join("\n");
    d.g2 = selectedNames("uft-bc-g2").join("\n");
    d.g3 = selectedNames("uft-bc-g3").join("\n");
    d.siblings = selectedNames("uft-bc-siblings").join("\n");
    d.children = selectedNames("uft-bc-children").join("\n");
    d.grandchildren = selectedNames("uft-bc-grandchildren").join("\n");
    d.savedAt = new Date().toISOString();
    // vitals from cards
    d.gender = d.gender || {};
    d.vital = d.vital || {};
    getCards().forEach(function (c) {
      if (!c || !c.name) return;
      if (c.gender) d.gender[c.name] = c.gender;
      if (c.vital) d.vital[c.name] = c.vital;
    });
    lsSet(TREE_KEY, JSON.stringify(d));
  }

  function ensureUploadHint() {
    var panel = document.getElementById("uft-build-section") || document.getElementById("uft-build-from-cards");
    if (!panel || document.getElementById("uft-cards-sync-hint")) return;
    var hint = document.createElement("p");
    hint.id = "uft-cards-sync-hint";
    hint.className = "uft-hint";
    hint.innerHTML =
      "<strong>Member cards:</strong> registry people are synced into the card list automatically. " +
      "You can also paste a Companion member-cards JSON below. " +
      "Build selectors use card indexes (Companion parity). After Apply, pedigree cards paint in the viewport.";
    panel.insertBefore(hint, panel.firstChild.nextSibling);

    if (!document.getElementById("uft-cards-file-amana")) {
      var row = document.createElement("div");
      row.className = "uft-build-actions";
      row.innerHTML =
        '<label class="btn-secondary" style="display:inline-flex;align-items:center;padding:0.4rem 0.85rem;border-radius:999px;border:1px solid rgba(212,180,90,0.4);cursor:pointer;font-weight:700;font-size:0.78rem">' +
        '⬆ Import member cards JSON<input type="file" id="uft-cards-file-amana" accept="application/json,.json,text/csv,.csv" hidden/></label>' +
        '<button type="button" class="btn-secondary" id="uft-cards-sync-reg">Sync registry → cards</button>' +
        '<button type="button" class="btn-secondary" id="uft-force-render">Refresh pedigree view</button>';
      panel.appendChild(row);
      document.getElementById("uft-cards-file-amana").onchange = function (ev) {
        var file = ev.target.files && ev.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            var data = JSON.parse(String(reader.result || "[]"));
            var list = Array.isArray(data) ? data : data.cards || data.members || data.registry || [];
            if (!Array.isArray(list) || !list.length) {
              alert("No member cards found in that file.");
              return;
            }
            var norm = list
              .map(function (c) {
                if (!c) return null;
                if (typeof c === "string") return { name: c };
                return {
                  name: c.name || c.Name || "",
                  role: c.role || c.slot || c.Relation || "",
                  slot: c.slot || c.role || "",
                  gender: c.gender || c.Gender || "",
                  vital: c.vital || c.Vital || c.status || "",
                  phone: c.phone || "",
                  email: c.email || "",
                  city: c.city || "",
                  generationHint: c.generationHint || c.generation || c.Generation || c.slot || "",
                  born: c.born || c.year || ""
                };
              })
              .filter(function (c) {
                return c && c.name;
              });
            setCards(norm);
            refreshBuildSelectors();
            alert("Imported " + norm.length + " member cards. Select Focus person and Apply.");
          } catch (e) {
            alert("Could not parse JSON member cards.");
          }
          ev.target.value = "";
        };
        reader.readAsText(file);
      };
      document.getElementById("uft-cards-sync-reg").onclick = function () {
        var n = syncRegistryToCards().length;
        refreshBuildSelectors();
        alert("Synced registry → " + n + " member cards.");
      };
      document.getElementById("uft-force-render").onclick = function () {
        forceRender();
      };
    }
  }

  function boot() {
    if (!isTree()) return;
    try {
      ensurePreview();
      ensureFieldInputs();
      syncRegistryToCards();
      refreshBuildSelectors();
      patchApplyBuild();
      ensureUploadHint();
      // Paint if data already exists
      setTimeout(forceRender, 400);
      setTimeout(forceRender, 1200);
    } catch (e) {
      try {
        console.warn("[UFT visual fix]", e);
      } catch (err) {}
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 600);
  setTimeout(boot, 2000);
  document.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 150);
  });
})(window);

/*! Amānah Tree → Farāʾiḍ study bridge v1 · Phase 3
 * Builds an educational outline from the on-device family tree
 * and surfaces it on /amana/fiqh/ for study (pull heirs / review).
 * Does NOT compute a binding estate. Not a fatwa · not a court document.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_FIQH_BRIDGE_V1__) return;
  w.__CLARITY_AMANA_UFT_FIQH_BRIDGE_V1__ = true;

  var TREE_KEY = w.UFT_KEY || "clarity_user_family_tree_v1";
  var OUTLINE_KEY = "clarity_amana_fiqh_outline_v1";

  function path() {
    try { return location.pathname || ""; } catch (e) { return ""; }
  }
  function isTree() { return /\/amana\/tree\/?/.test(path()); }
  function isFiqh() { return /\/amana\/fiqh\/?/.test(path()); }

  function readTree() {
    try {
      if (typeof w.uftRead === "function") return w.uftRead() || {};
      return JSON.parse(localStorage.getItem(TREE_KEY) || "{}");
    } catch (e) { return {}; }
  }

  function buildOutline() {
    var tree = readTree();
    var reg = Array.isArray(tree.registry) ? tree.registry : [];
    var people = [];
    function add(name, role, gender, vital, kinship, line) {
      name = String(name || "").trim();
      if (!name) return;
      people.push({
        name: name,
        role: role || "",
        gender: gender || "",
        vital: vital || "",
        kinship: kinship || "",
        line: line || ""
      });
    }
    reg.forEach(function (r) {
      if (r) add(r.name, r.role, r.gender, r.vital, r.kinship, r.line);
    });
    // Backbone names if not already in registry
    var seen = {};
    people.forEach(function (p) { seen[p.name.toLowerCase()] = true; });
    function backbone(slot, role) {
      var n = tree[slot];
      if (n && !seen[String(n).toLowerCase()]) {
        add(n, role, "", "", "", "");
        seen[String(n).toLowerCase()] = true;
      }
    }
    backbone("self", "self");
    backbone("spouse", "spouse");
    backbone("father", "father");
    backbone("mother", "mother");
    backbone("pgf", "paternal grandfather");
    backbone("pgm", "paternal grandmother");
    backbone("mgf", "maternal grandfather");
    backbone("mgm", "maternal grandmother");

    var missing = [];
    people.forEach(function (p) {
      if (!p.gender) missing.push("gender: " + p.name);
      if (!p.vital) missing.push("vital: " + p.name);
    });

    return {
      v: 1,
      createdAt: new Date().toISOString(),
      educationalOnly: true,
      disclaimer: "Educational outline only — not a fatwa, not legal advice, not a court calculation. Confirm with a qualified local scholar.",
      people: people,
      readinessHints: missing.slice(0, 12),
      sourceKey: TREE_KEY
    };
  }

  function saveOutline(o) {
    try {
      localStorage.setItem(OUTLINE_KEY, JSON.stringify(o));
      return true;
    } catch (e) { return false; }
  }

  function loadOutline() {
    try {
      return JSON.parse(localStorage.getItem(OUTLINE_KEY) || "null");
    } catch (e) { return null; }
  }

  function treeUi() {
    if (!isTree()) return;
    if (document.getElementById("uft-fiqh-outline-btn")) return;
    var host =
      document.getElementById("uft-integrity") ||
      document.getElementById("uft-status") ||
      document.getElementById("user-family-tree-card");
    if (!host) return;
    var bar = document.createElement("div");
    bar.id = "uft-fiqh-bridge-bar";
    bar.style.cssText = "margin:0.65rem 0;display:flex;flex-wrap:wrap;gap:0.4rem;align-items:center";
    bar.innerHTML =
      '<button type="button" class="btn-soft" id="uft-fiqh-outline-btn" style="cursor:pointer">Outline for Farāʾiḍ study</button>' +
      '<a class="btn-soft" id="uft-fiqh-outline-link" href="/amana/fiqh/" style="display:none">Open Farāʾiḍ with outline</a>' +
      '<span id="uft-fiqh-outline-msg" style="font-size:0.78rem;opacity:0.9"></span>';
    host.parentNode.insertBefore(bar, host.nextSibling);

    document.getElementById("uft-fiqh-outline-btn").onclick = function () {
      var o = buildOutline();
      saveOutline(o);
      var msg = document.getElementById("uft-fiqh-outline-msg");
      var link = document.getElementById("uft-fiqh-outline-link");
      if (msg) {
        msg.textContent =
          (o.people.length ? o.people.length + " people in outline. " : "Outline empty — add registry rows. ") +
          "Educational only — not a fatwa.";
      }
      if (link) link.style.display = "inline-block";
      if (typeof w.uftSetStatus === "function") {
        try { w.uftSetStatus("Farāʾiḍ study outline saved on this device"); } catch (e) {}
      }
    };
  }

  function outlineHtml(o) {
    if (!o || !o.people) return "<p>No outline saved yet. Open Tree → Outline for Farāʾiḍ study.</p>";
    var rows = o.people.map(function (p) {
      return (
        "<tr><td>" + esc(p.name) + "</td><td>" + esc(p.role) + "</td><td>" +
        esc(p.gender) + "</td><td>" + esc(p.vital) + "</td><td>" +
        esc(p.kinship) + "</td><td>" + esc(p.line) + "</td></tr>"
      );
    }).join("");
    return (
      '<div class="cred-stamp">Educational outline from your on-device family tree — not a fatwa · not a court document</div>' +
      "<p style=\"font-size:0.8rem;opacity:0.9\">" + esc(o.disclaimer) + "</p>" +
      '<div style="overflow:auto"><table style="width:100%;font-size:0.82rem;border-collapse:collapse">' +
      "<thead><tr><th>Name</th><th>Role</th><th>Gender</th><th>Vital</th><th>Kinship</th><th>Line</th></tr></thead>" +
      "<tbody>" + rows + "</tbody></table></div>" +
      ((o.readinessHints && o.readinessHints.length)
        ? "<p style=\"font-size:0.8rem\">Readiness hints: " + esc(o.readinessHints.slice(0, 8).join(" · ")) + "</p>"
        : "") +
      '<p style="font-size:0.78rem;margin-top:0.35rem">Saved: ' + esc(o.createdAt || "") + "</p>"
    );
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fiqhUi() {
    if (!isFiqh()) return;
    if (document.getElementById("amana-fiqh-outline-panel")) return;
    var card = document.getElementById("faraid-card");
    if (!card) return;
    var panel = document.createElement("div");
    panel.id = "amana-fiqh-outline-panel";
    panel.className = "amana-card";
    panel.style.margin = "0.75rem 0";
    panel.innerHTML =
      "<h2 style=\"margin:0 0 0.4rem;color:#d4b45a;font-size:1.05rem\">Tree outline for study</h2>" +
      '<div id="amana-fiqh-outline-body"></div>' +
      '<div style="margin-top:0.5rem;display:flex;flex-wrap:wrap;gap:0.4rem">' +
      '<button type="button" class="btn-soft" id="fiqh-outline-refresh" style="cursor:pointer">Refresh from tree</button>' +
      '<button type="button" class="btn-soft" id="fiqh-outline-to-heirs" style="cursor:pointer">Suggest living heirs into calculator</button>' +
      '<a class="btn-soft" href="/amana/tree/">Edit on Tree</a>' +
      "</div>" +
      '<p style="font-size:0.75rem;opacity:0.85;margin-top:0.4rem">Study aid only. Use calculator “Load heirs” after setting gender/vital on the tree. Not a fatwa.</p>';

    card.parentNode.insertBefore(panel, card);

    function render() {
      var body = document.getElementById("amana-fiqh-outline-body");
      if (!body) return;
      var o = loadOutline();
      if (!o) {
        // auto-build from live tree if no saved outline
        o = buildOutline();
        if (o.people.length) saveOutline(o);
      }
      body.innerHTML = outlineHtml(o);
    }

    document.getElementById("fiqh-outline-refresh").onclick = function () {
      var o = buildOutline();
      saveOutline(o);
      render();
    };

    document.getElementById("fiqh-outline-to-heirs").onclick = function () {
      var o = loadOutline() || buildOutline();
      var living = (o.people || []).filter(function (p) {
        return !/deceased|dead/i.test(p.vital || "");
      });
      // Prefer official pull if present
      var btn = document.getElementById("fc-pull") || document.getElementById("fc-load-heirs");
      if (btn) {
        try { btn.click(); } catch (e) {}
      }
      try {
        var store = JSON.parse(localStorage.getItem("clarity_amana_faraid_calc_v3") || "{}");
        if (!store.heirs || !store.heirs.length) {
          store.heirs = living.map(function (p) {
            return { name: p.name, role: p.role, gender: p.gender, vital: p.vital || "living" };
          });
          localStorage.setItem("clarity_amana_faraid_calc_v3", JSON.stringify(store));
        }
      } catch (e2) {}
      var note = document.createElement("p");
      note.style.cssText = "font-size:0.8rem;color:#c9a84c";
      note.textContent = "Suggested " + living.length + " living names for study. Review each row. Educational only — not a fatwa.";
      panel.appendChild(note);
      // Re-open calc UI if it exposes render
      if (typeof w.amanaFaraidCalcRefresh === "function") {
        try { w.amanaFaraidCalcRefresh(); } catch (e3) {}
      }
    };

    render();
  }

  function boot() {
    try {
      treeUi();
      fiqhUi();
    } catch (e) {
      console.warn("fiqh-bridge", e);
    }
  }

  function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  onReady(function () {
    boot();
    setTimeout(boot, 600);
  });
  document.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 150);
  });

  w.uftBuildFiqhOutline = buildOutline;
  w.uftSaveFiqhOutline = function () {
    var o = buildOutline();
    saveOutline(o);
    return o;
  };
})(typeof window !== "undefined" ? window : this);

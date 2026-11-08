/*! Amānah Tree ↔ Farāʾiḍ workflow enrichment v1
 * Coherent educational flow: registry/tree → outline → fiqh study / load heirs.
 * Keys: clarity_user_family_tree_v1 (read), clarity_amana_fiqh_outline_v1 (outline only).
 * Not a fatwa · not a court calculation · other madhāhib differ.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_FIQH_WORKFLOW_ENRICH_V1__) return;
  w.__CLARITY_AMANA_UFT_FIQH_WORKFLOW_ENRICH_V1__ = true;

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
    if (typeof w.uftSaveFiqhOutline === "function") {
      try {
        var r = w.uftSaveFiqhOutline();
        if (r && r.people) return r;
      } catch (e) {}
    }
    var tree = readTree();
    var reg = Array.isArray(tree.registry) ? tree.registry : [];
    var people = [];
    var seen = {};
    function add(name, role, gender, vital) {
      name = String(name || "").trim();
      if (!name) return;
      var k = name.toLowerCase();
      if (seen[k]) return;
      seen[k] = true;
      people.push({ name: name, role: role || "", gender: gender || "", vital: vital || "" });
    }
    reg.forEach(function (r) { if (r) add(r.name, r.role, r.gender, r.vital); });
    ["self", "spouse", "father", "mother", "pgf", "pgm", "mgf", "mgm"].forEach(function (slot) {
      if (tree[slot]) add(tree[slot], slot, "", "");
    });
    function lines(v, role) {
      String(v || "").split(/\n|,/).map(function (s) { return s.trim(); }).filter(Boolean)
        .forEach(function (n) { add(n, role, "", ""); });
    }
    lines(tree.children, "child");
    lines(tree.siblings, "sibling");
    lines(tree.grandchildren, "grandchild");
    var missingGender = people.filter(function (p) { return !p.gender; }).map(function (p) { return p.name; });
    var o = {
      v: 1,
      createdAt: new Date().toISOString(),
      educationalOnly: true,
      disclaimer: "Educational outline only — not a fatwa, not a court order. Other madhāhib differ. Confirm with a qualified local scholar.",
      people: people,
      missingGender: missingGender,
      sourceKey: TREE_KEY
    };
    try { localStorage.setItem(OUTLINE_KEY, JSON.stringify(o)); } catch (e) {}
    return o;
  }

  function loadOutline() {
    try { return JSON.parse(localStorage.getItem(OUTLINE_KEY) || "null"); } catch (e) { return null; }
  }

  function statusOnTree(msg) {
    var el = d.getElementById("uft-fiqh-workflow-status") || d.getElementById("uft-status");
    if (el) el.textContent = msg;
  }

  function mountTreeStrip() {
    if (!isTree()) return;
    if (d.getElementById("uft-fiqh-workflow-strip")) return;
    var card = d.getElementById("user-family-tree-card");
    if (!card) return;
    var strip = d.createElement("div");
    strip.id = "uft-fiqh-workflow-strip";
    strip.style.cssText = "margin:0.75rem 0;padding:0.75rem 0.9rem;border-radius:12px;border:1px solid rgba(212,180,90,0.35);background:rgba(30,125,94,0.12);";
    strip.innerHTML = '<p style="margin:0 0 0.35rem;font-weight:700;color:#e8d5a3;font-size:0.9rem">Workflow · Tree → Farāʾiḍ study</p>' +
      '<p style="margin:0 0 0.5rem;font-size:0.78rem;opacity:0.9;line-height:1.4">Save an educational outline from this tree, then open Farāʾiḍ to load heirs. Set gender on people so the study aid can classify shares. <strong>Not a fatwa.</strong></p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:0.4rem;align-items:center">' +
      '<button type="button" class="btn-soft" id="uft-wf-save-outline">💾 Save outline for Farāʾiḍ</button>' +
      '<a class="btn-soft" href="/amana/fiqh/">Open Farāʾiḍ study →</a>' +
      '<a class="btn-soft" href="/amana/wasiyyah/">Wasiyyah notes</a></div>' +
      '<p id="uft-fiqh-workflow-status" style="margin:0.45rem 0 0;font-size:0.78rem;opacity:0.9"></p>';
    var host = d.getElementById("clarity-family-tree-host");
    if (host && host.parentNode) host.parentNode.insertBefore(strip, host);
    else card.insertBefore(strip, card.firstChild);
    var btn = d.getElementById("uft-wf-save-outline");
    if (btn) btn.addEventListener("click", function () {
      var o = buildOutline();
      var n = (o.people || []).length;
      var miss = (o.missingGender || []).length;
      statusOnTree("Outline saved (" + n + " people)" + (miss ? " · " + miss + " missing gender" : " · genders complete") + " · educational only");
    });
  }

  function mountFiqhStrip() {
    if (!isFiqh()) return;
    if (d.getElementById("fiqh-workflow-enrich-strip")) return;
    var main = d.querySelector("main.amana-wrap") || d.querySelector("main");
    var card = d.getElementById("faraid-card");
    if (!main && !card) return;
    var strip = d.createElement("div");
    strip.id = "fiqh-workflow-enrich-strip";
    strip.style.cssText = "margin:0.75rem 0;padding:0.75rem 0.9rem;border-radius:12px;border:1px solid rgba(212,180,90,0.35);background:rgba(30,125,94,0.12);";
    var o = loadOutline();
    var summary = o && o.people && o.people.length
      ? o.people.length + " people in saved outline" + (o.missingGender && o.missingGender.length ? " · " + o.missingGender.length + " need gender" : "")
      : "No outline yet — open Family tree, save outline, return here";
    strip.innerHTML = '<p style="margin:0 0 0.35rem;font-weight:700;color:#e8d5a3;font-size:0.9rem">Workflow · Farāʾiḍ study aid</p>' +
      '<p style="margin:0 0 0.45rem;font-size:0.78rem;opacity:0.9;line-height:1.4"><strong>Educational only — not a fatwa · not a court order.</strong> Other madhāhib differ. Debts and funeral costs before bequests.</p>' +
      '<p id="fiqh-wf-outline-summary" style="margin:0 0 0.5rem;font-size:0.8rem">' + summary + "</p>" +
      '<div style="display:flex;flex-wrap:wrap;gap:0.4rem">' +
      '<button type="button" class="btn-soft" id="fiqh-wf-refresh-outline">↻ Refresh outline</button>' +
      '<button type="button" class="btn-soft" id="fiqh-wf-load-heirs">📥 Load heirs into calculator</button>' +
      '<a class="btn-soft" href="/amana/tree/">← Family tree</a>' +
      '<a class="btn-soft" href="/amana/wasiyyah/">Wasiyyah →</a></div>' +
      '<p id="fiqh-wf-status" style="margin:0.45rem 0 0;font-size:0.78rem;opacity:0.9"></p>';
    if (card && card.parentNode) card.parentNode.insertBefore(strip, card);
    else if (main) main.insertBefore(strip, main.firstChild);

    function setSt(m) {
      var el = d.getElementById("fiqh-wf-status");
      if (el) el.textContent = m || "";
    }
    var ref = d.getElementById("fiqh-wf-refresh-outline");
    if (ref) ref.addEventListener("click", function () {
      var o2 = buildOutline();
      var sum = d.getElementById("fiqh-wf-outline-summary");
      if (sum) sum.textContent = (o2.people || []).length + " people in outline" + ((o2.missingGender || []).length ? " · " + o2.missingGender.length + " need gender" : "");
      setSt("Outline refreshed from on-device tree · educational only");
    });
    var loadBtn = d.getElementById("fiqh-wf-load-heirs");
    if (loadBtn) loadBtn.addEventListener("click", function () {
      buildOutline();
      var pulled = false;
      try { if (typeof w.pullHeirs === "function") { w.pullHeirs(); pulled = true; } } catch (e) {}
      try { if (!pulled && typeof w.faraidPullTree === "function") { w.faraidPullTree(); pulled = true; } } catch (e2) {}
      try { var fc = d.getElementById("fc-pull"); if (!pulled && fc) { fc.click(); pulled = true; } } catch (e3) {}
      try { var b = d.getElementById("fiqh-outline-to-heirs"); if (b) b.click(); } catch (e4) {}
      setSt(pulled ? "Heirs load requested · review gender/vital · study aid only — not a fatwa" : "Calculator not ready — set gender on tree or open calculator, then retry");
    });
  }

  function boot() {
    try { mountTreeStrip(); mountFiqhStrip(); } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 600);
  setTimeout(boot, 1600);
  if (d.addEventListener) d.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boot, 200);
  });
  w.clarityAmanaBuildFiqhOutline = buildOutline;
  w.clarityAmanaLoadFiqhOutline = loadOutline;
})(window, document);

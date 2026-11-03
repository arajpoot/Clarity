/*! Amānah Farāʾiḍ calculator v3 · Companion-parity study tool
 * Ported UX from Companion faraid-card · chamber-isolated
 * Educational only — Hanafi-leaning study aid · not a fatwa · not a court order
 * Other madhāhib differ · complex cases need a qualified scholar
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_FARAID_CALC_V3__) return;
  w.__CLARITY_AMANA_FARAID_CALC_V3__ = true;

  var STORE = "clarity_amana_faraid_calc_v3";
  var TREE_KEY = w.UFT_KEY || "clarity_user_family_tree_v1";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORE) || "{}");
    } catch (e) {
      return {};
    }
  }
  function save(o) {
    try {
      localStorage.setItem(STORE, JSON.stringify(o));
    } catch (e) {}
  }
  function money(n) {
    var x = Number(n);
    if (!isFinite(x)) return "0.00";
    return (Math.round(x * 100) / 100).toFixed(2);
  }
  function readTree() {
    try {
      if (typeof w.uftRead === "function") return w.uftRead() || {};
      return JSON.parse(localStorage.getItem(TREE_KEY) || "{}");
    } catch (e) {
      return {};
    }
  }

  function panelHtml() {
    return (
      '<div class="amana-faraid-calc-v3" id="amana-faraid-calc-v3">' +
      '<div class="cred-stamp">Reviewed for educational accuracy · classical farāʾiḍ outlines · Educational only — not a fatwa</div>' +
      "<h3>⚖️ Inheritance (Farāʾiḍ) — from your family tree</h3>" +
      '<details class="fc-tut" open><summary>💡 How to use · quick guide</summary><ol>' +
      "<li><strong>Mark the tree first</strong> — living heirs need gender and vital status where possible.</li>" +
      "<li><strong>Load heirs</strong> — pull living relatives from the tree registry.</li>" +
      "<li><strong>Estate net</strong> — funeral/debts first; optional wasiyyah ≤ ⅓ to non-heirs; then fixed shares (4:11–12, 4:176).</li>" +
      "<li><strong>Review</strong> — ʿawl / radd notes if totals exceed or fall short; print only as a study sheet.</li>" +
      "</ol>" +
      '<p><strong>Educational tool only — not a fatwa, not a court order.</strong> Schools may differ; consult a qualified scholar for a real estate.</p></details>' +
      '<div class="faraid-honest" role="note"><strong>Educational tool only — not a fatwa, not legal advice.</strong> ' +
      "<strong>Hanafi-leaning study aid — other madhāhib differ; no binding distribution.</strong> " +
      "Core shares follow Qurʾān 4:11–12 and 4:176 with a simplified model. " +
      "Complex cases (grandfather with siblings, uterine heirs, ʿUmariyyatān, civil law) need a scholar or local court. " +
      "Debts and funeral costs come <em>before</em> shares; wasiyyah to a non-heir is capped at one-third of what remains after debts.</div>" +
      '<p class="notes-hint">Choose the deceased context, load living close heirs from the pedigree, set the <strong>net estate</strong>, then calculate.</p>' +
      '<div class="fc-form">' +
      '<label>Deceased (label for study)<select id="fc-deceased"></select></label>' +
      '<label>Gender of deceased<select id="fc-gender"><option value="male">Male</option><option value="female">Female</option></select></label>' +
      '<label>Gross estate<input type="number" id="fc-estate" min="0" step="any" placeholder="e.g. 100000"/></label>' +
      '<label>Currency<input type="text" id="fc-currency" placeholder="PKR, USD, CAD…" value="CAD"/></label>' +
      '<label>Funeral / burial costs<input type="number" id="fc-funeral" min="0" step="any" placeholder="0"/></label>' +
      '<label>Debts of the deceased<input type="number" id="fc-debts" min="0" step="any" placeholder="0"/></label>' +
      '<label>Wasiyyah (bequest ≤ ⅓ of remainder, non-heir)<input type="number" id="fc-wasiyyah" min="0" step="any" placeholder="0"/></label>' +
      '<label>Net distributable (auto)<input type="text" id="fc-net" readonly placeholder="Calculated on run"/></label>' +
      "</div>" +
      '<div class="fc-actions">' +
      '<button type="button" id="fc-pull">📥 Load heirs from family tree</button>' +
      '<a class="btn-link" href="/amana/tree/">🌳 Edit tree first</a>' +
      '<button type="button" id="fc-calc">Calculate shares</button>' +
      '<button type="button" class="soft" id="fc-clear">Clear heirs</button>' +
      '<button type="button" class="soft" id="fc-print">🖨️ Print result</button>' +
      '<a class="btn-link" href="/amana/wasiyyah/" id="fc-push-wasi">↗ Push figures to Wasiyyah</a>' +
      "</div>" +
      '<div id="fc-heirs"></div>' +
      '<div id="fc-result" class="fc-result" hidden></div>' +
      '<p class="notes-hint">Set gender on registry rows so heirs load correctly. Further study: ' +
      '<a href="https://getmirath.com/" target="_blank" rel="noopener">Mirath</a> · ' +
      '<a href="https://qurani.io/inheritance-calculator/" target="_blank" rel="noopener">Qurani</a></p>' +
      '<p class="fc-msg" id="fc-msg" role="status"></p>' +
      "</div>"
    );
  }

  function setMsg(t, k) {
    var el = document.getElementById("fc-msg");
    if (!el) return;
    el.textContent = t || "";
    el.className = "fc-msg" + (k ? " " + k : "");
  }

  function refreshDeceasedOptions() {
    var sel = document.getElementById("fc-deceased");
    if (!sel) return;
    var tree = readTree();
    var names = [];
    if (tree.self) names.push(tree.self);
    (tree.registry || []).forEach(function (r) {
      if (r && r.name && names.indexOf(r.name) < 0) names.push(r.name);
    });
    if (!names.length) names = ["(study label)"];
    var cur = sel.value;
    sel.innerHTML = names
      .map(function (n) {
        return "<option value=\"" + escapeAttr(n) + "\">" + escapeHtml(n) + "</option>";
      })
      .join("");
    if (cur) sel.value = cur;
  }

  function netCalc() {
    var gross = Number((document.getElementById("fc-estate") || {}).value) || 0;
    var funeral = Number((document.getElementById("fc-funeral") || {}).value) || 0;
    var debts = Number((document.getElementById("fc-debts") || {}).value) || 0;
    var wasiyyah = Number((document.getElementById("fc-wasiyyah") || {}).value) || 0;
    var after = Math.max(0, gross - funeral - debts);
    var maxW = after / 3;
    if (wasiyyah > maxW + 0.0001) {
      setMsg("Wasiyyah exceeds classical ⅓ of remainder after debts/funeral (" + money(maxW) + "). Confirm with a scholar.", "err");
    }
    var net = Math.max(0, after - wasiyyah);
    var netEl = document.getElementById("fc-net");
    if (netEl) netEl.value = money(net) + " " + ((document.getElementById("fc-currency") || {}).value || "");
    return { net: net, after: after, maxW: maxW, gross: gross, funeral: funeral, debts: debts, wasiyyah: wasiyyah };
  }

  function pullHeirs() {
    var tree = readTree();
    var reg = Array.isArray(tree.registry) ? tree.registry : [];
    var heirs = [];
    var seen = {};
    function add(name, role, gender, vital) {
      name = String(name || "").trim();
      if (!name) return;
      var k = name.toLowerCase();
      if (seen[k]) return;
      if (/self/i.test(role)) return;
      if (/deceased|dead|†/i.test(vital || "")) return;
      seen[k] = true;
      heirs.push({ name: name, role: role || "", gender: gender || "", vital: vital || "living" });
    }
    reg.forEach(function (r) {
      if (!r) return;
      add(r.name, r.role, r.gender, r.vital);
    });
    // backbone fields
    add(tree.spouse, "spouse", "", "");
    add(tree.father, "father", "male", "");
    add(tree.mother, "mother", "female", "");
    function lines(v, role) {
      if (!v) return;
      String(v)
        .split(/[\n,;]+/)
        .forEach(function (n) {
          add(n.trim(), role, "", "");
        });
    }
    lines(tree.children, "child");
    lines(tree.siblings, "sibling");
    var d = load();
    d.heirs = heirs;
    save(d);
    renderHeirs();
    setMsg("Loaded " + heirs.length + " heir candidate(s) from tree.", "ok");
  }

  function renderHeirs() {
    var box = document.getElementById("fc-heirs");
    if (!box) return;
    var d = load();
    var list = d.heirs || [];
    if (!list.length) {
      box.innerHTML = '<p class="fc-empty">No heirs loaded. Use Load heirs from family tree, or edit the tree first.</p>';
      return;
    }
    box.innerHTML =
      '<table class="fc-table"><thead><tr><th>Name</th><th>Role</th><th>Gender</th><th></th></tr></thead><tbody>' +
      list
        .map(function (h, i) {
          return (
            "<tr><td>" +
            escapeHtml(h.name) +
            '</td><td><input data-i="' +
            i +
            '" data-f="role" value="' +
            escapeAttr(h.role) +
            '"/></td><td><select data-i="' +
            i +
            '" data-f="gender"><option value="">—</option><option value="male"' +
            (h.gender === "male" ? " selected" : "") +
            '>Male</option><option value="female"' +
            (h.gender === "female" ? " selected" : "") +
            ">Female</option></select></td><td><button type=\"button\" data-del=\"" +
            i +
            '">✕</button></td></tr>'
          );
        })
        .join("") +
      "</tbody></table>";
    box.querySelectorAll("[data-f]").forEach(function (el) {
      el.onchange = el.oninput = function () {
        var d2 = load();
        var i = Number(el.getAttribute("data-i"));
        if (!d2.heirs || !d2.heirs[i]) return;
        d2.heirs[i][el.getAttribute("data-f")] = el.value;
        save(d2);
      };
    });
    box.querySelectorAll("[data-del]").forEach(function (btn) {
      btn.onclick = function () {
        var d2 = load();
        d2.heirs.splice(Number(btn.getAttribute("data-del")), 1);
        save(d2);
        renderHeirs();
      };
    });
  }

  /** Simplified educational shares — not complete fiqh engine */
  function calculate() {
    var n = netCalc();
    var d = load();
    var heirs = d.heirs || [];
    var genderDec = (document.getElementById("fc-gender") || {}).value || "male";
    var rows = [];
    var notes = [];
    var net = n.net;
    var allocated = 0;

    function isRole(h, re) {
      return re.test(h.role || "");
    }
    var sons = heirs.filter(function (h) {
      return isRole(h, /^(son|grandson)$/i) || (isRole(h, /child/i) && h.gender === "male");
    });
    var daughters = heirs.filter(function (h) {
      return isRole(h, /^(daughter|granddaughter)$/i) || (isRole(h, /child/i) && h.gender === "female");
    });
    var hasDesc = sons.length + daughters.length > 0;
    var spouse = heirs.filter(function (h) {
      return isRole(h, /spouse|husband|wife/i);
    })[0];
    var father = heirs.filter(function (h) {
      return isRole(h, /^father$/i);
    })[0];
    var mother = heirs.filter(function (h) {
      return isRole(h, /^mother$/i);
    })[0];

    if (spouse) {
      var spF;
      if (genderDec === "male") {
        // wife of deceased male
        spF = hasDesc ? 1 / 8 : 1 / 4;
      } else {
        // husband of deceased female
        spF = hasDesc ? 1 / 4 : 1 / 2;
      }
      var spA = net * spF;
      rows.push({ name: spouse.name, role: spouse.role || "spouse", frac: spF, amount: spA, note: "Spouse fixed (study · 4:12)" });
      allocated += spA;
    }
    if (mother) {
      var mF = hasDesc ? 1 / 6 : 1 / 3;
      var mA = net * mF;
      rows.push({ name: mother.name, role: "mother", frac: mF, amount: mA, note: "Mother fixed (study · 4:11)" });
      allocated += mA;
    }
    if (father) {
      if (hasDesc) {
        var fA = net * (1 / 6);
        rows.push({ name: father.name, role: "father", frac: 1 / 6, amount: fA, note: "Father fixed with descendants (study · 4:11)" });
        allocated += fA;
      } else {
        rows.push({ name: father.name, role: "father", frac: null, amount: null, note: "Father may take residue as ʿaṣaba — confirm case" });
      }
    }

    var residue = Math.max(0, net - allocated);
    if (sons.length || daughters.length) {
      notes.push("Children: among residue, classical rule is son : daughter = 2 : 1 (4:11). Residue for children (study): " + money(residue));
      var units = sons.length * 2 + daughters.length;
      if (units > 0 && residue > 0) {
        sons.forEach(function (s) {
          var a = (residue * 2) / units;
          rows.push({ name: s.name, role: s.role || "son", frac: null, amount: a, note: "Son share of residue (study 2:1)" });
        });
        daughters.forEach(function (s) {
          var a = residue / units;
          rows.push({ name: s.name, role: s.role || "daughter", frac: null, amount: a, note: "Daughter share of residue (study 2:1)" });
        });
        allocated += residue;
        residue = 0;
      } else {
        sons.concat(daughters).forEach(function (c) {
          rows.push({ name: c.name, role: c.role, frac: null, amount: null, note: "Child — needs full case review" });
        });
      }
    }

    heirs.forEach(function (h) {
      if (rows.some(function (r) {
        return r.name === h.name;
      }))
        return;
      rows.push({ name: h.name, role: h.role, frac: null, amount: null, note: "Not auto-assigned in this lite model — ask a scholar" });
    });

    if (allocated > net + 0.01) {
      notes.push("ʿAwl may apply (shares exceed estate) — not fully computed here.");
    } else if (residue > 0.01 && !father && !sons.length) {
      notes.push("Possible radd (return to fixed sharers) or residual heirs — not fully computed here.");
    }

    notes.push("Net estate used: " + money(net) + " · Allocated (study): " + money(Math.min(allocated, net)));
    notes.push("This is a simplified educational model. Grandfather/siblings, uterine siblings, and school differences are incomplete.");

    d.lastResult = { rows: rows, notes: notes, net: net, meta: n };
    save(d);
    renderResult(d.lastResult);
    // stash for wasiyyah pull
    try {
      localStorage.setItem(
        "clarity_amana_faraid_push_v1",
        JSON.stringify({
          gross: n.gross,
          funeral: n.funeral,
          debts: n.debts,
          wasiyyah: n.wasiyyah,
          net: net,
          currency: (document.getElementById("fc-currency") || {}).value || "",
          at: new Date().toISOString()
        })
      );
    } catch (e) {}
    setMsg("Study calculation complete · verify with a scholar.", "ok");
  }

  function renderResult(res) {
    var box = document.getElementById("fc-result");
    if (!box || !res) return;
    box.hidden = false;
    box.innerHTML =
      "<h4>Study result (illustrative)</h4>" +
      '<table class="fc-table"><thead><tr><th>Name</th><th>Role</th><th>Fraction</th><th>Amount</th><th>Note</th></tr></thead><tbody>' +
      res.rows
        .map(function (r) {
          return (
            "<tr><td>" +
            escapeHtml(r.name) +
            "</td><td>" +
            escapeHtml(r.role) +
            "</td><td>" +
            (r.frac != null ? (r.frac * 100).toFixed(2) + "%" : "—") +
            "</td><td>" +
            (r.amount != null ? money(r.amount) : "—") +
            "</td><td>" +
            escapeHtml(r.note) +
            "</td></tr>"
          );
        })
        .join("") +
      "</tbody></table><ul>" +
      (res.notes || [])
        .map(function (n) {
          return "<li>" + escapeHtml(n) + "</li>";
        })
        .join("") +
      "</ul>" +
      '<p class="faraid-honest">Not a fatwa · not a court document · confirm every figure with a qualified local scholar.</p>';
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

  function bind() {
    refreshDeceasedOptions();
    var d = load();
    if (d.estate != null) {
      var map = { "fc-estate": "estate", "fc-funeral": "funeral", "fc-debts": "debts", "fc-wasiyyah": "wasiyyah", "fc-currency": "currency", "fc-gender": "gender" };
      Object.keys(map).forEach(function (id) {
        var el = document.getElementById(id);
        if (el && d[map[id]] != null) el.value = d[map[id]];
      });
    }
    renderHeirs();
    if (d.lastResult) renderResult(d.lastResult);
    netCalc();

    document.getElementById("fc-pull").onclick = pullHeirs;
    document.getElementById("fc-calc").onclick = calculate;
    document.getElementById("fc-clear").onclick = function () {
      var d2 = load();
      d2.heirs = [];
      d2.lastResult = null;
      save(d2);
      renderHeirs();
      var box = document.getElementById("fc-result");
      if (box) {
        box.hidden = true;
        box.innerHTML = "";
      }
      setMsg("Heirs cleared.", "ok");
    };
    document.getElementById("fc-print").onclick = function () {
      var box = document.getElementById("fc-result");
      if (!box || box.hidden) {
        setMsg("Run calculate first.", "err");
        return;
      }
      var w2 = window.open("", "_blank");
      if (!w2) return;
      w2.document.write(
        "<!DOCTYPE html><html><head><title>Farāʾiḍ study result</title>" +
          "<style>body{font-family:Georgia,serif;max-width:44rem;margin:1.5rem auto;padding:1rem}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #ccc;padding:.35rem;text-align:left}.disc{font-size:.85rem;opacity:.85}</style></head><body>" +
          "<h1>Farāʾiḍ study result</h1><p class='disc'>Educational only — not a fatwa · not a court order.</p>" +
          box.innerHTML +
          "</body></html>"
      );
      w2.document.close();
      try {
        w2.print();
      } catch (e) {}
    };
    document.getElementById("fc-push-wasi").onclick = function () {
      netCalc();
      var d2 = load();
      d2.estate = (document.getElementById("fc-estate") || {}).value;
      d2.funeral = (document.getElementById("fc-funeral") || {}).value;
      d2.debts = (document.getElementById("fc-debts") || {}).value;
      d2.wasiyyah = (document.getElementById("fc-wasiyyah") || {}).value;
      d2.currency = (document.getElementById("fc-currency") || {}).value;
      d2.gender = (document.getElementById("fc-gender") || {}).value;
      save(d2);
      setMsg("Figures stored for Wasiyyah · open Wasiyyah chamber.", "ok");
    };
    ["fc-estate", "fc-funeral", "fc-debts", "fc-wasiyyah"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("input", netCalc);
    });
  }

  // Global aliases matching Companion onclick names
  w.faraidPullTree = pullHeirs;
  w.faraidCalculate = calculate;
  w.faraidResetHeirs = function () {
    var btn = document.getElementById("fc-clear");
    if (btn) btn.click();
  };
  w.faraidPrintResult = function () {
    var btn = document.getElementById("fc-print");
    if (btn) btn.click();
  };
  w.faraidOnDeceasedChange = function () {};

  function mount() {
    if (!/\/amana\/fiqh\/?/.test(location.pathname || "")) return;
    var host =
      document.getElementById("amana-faraid-calc-root") ||
      document.getElementById("amana-faraid-rich-root") ||
      document.getElementById("faraid-card");
    if (!host) return;
    if (document.getElementById("amana-faraid-calc-v3")) {
      bind();
      return;
    }
    var slot = document.createElement("div");
    slot.id = "amana-faraid-calc-root";
    slot.innerHTML = panelHtml();
    if (host.id === "amana-faraid-rich-root" && host.parentNode) {
      host.parentNode.insertBefore(slot, host);
    } else {
      host.insertAdjacentElement("afterbegin", slot);
    }
    bind();
  }

  function boot() {
    try {
      mount();
    } catch (e) {
      try {
        console.warn("[Farāʾiḍ calc v3]", e);
      } catch (err) {}
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(boot, 1200);
})(window);

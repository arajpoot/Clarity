/*! Farāʾiḍ study tools v2 · educational lite calculator
 * NOT a fatwa · NOT a court calculation · confirm with a qualified scholar
 * Optional pull of names from clarity_user_family_tree_v1 registry
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_FARAID_STUDY_V2__) return;
  w.__CLARITY_AMANA_FARAID_STUDY_V2__ = true;

  var STORE = "clarity_amana_faraid_study_v2";
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

  function treeRegistry() {
    try {
      var d = JSON.parse(localStorage.getItem(TREE_KEY) || "{}");
      return Array.isArray(d.registry) ? d.registry : [];
    } catch (e) {
      return [];
    }
  }

  /* Very simplified educational residues — classical outline only.
   * This is intentionally incomplete (no ʿawl / radd / kalāla edge engine). */
  function studyShares(heirs, net) {
    var notes = [];
    var rows = [];
    var hasSon = heirs.some(function (h) {
      return /son|grandson/i.test(h.role) && h.gender !== "female";
    });
    var hasDaughter = heirs.some(function (h) {
      return /daughter|granddaughter/i.test(h.role) || (h.role === "child" && h.gender === "female");
    });
    var spouse = heirs.filter(function (h) {
      return /spouse|husband|wife/i.test(h.role);
    })[0];
    var father = heirs.filter(function (h) {
      return h.role === "father";
    })[0];
    var mother = heirs.filter(function (h) {
      return h.role === "mother";
    })[0];

    var remaining = net;

    if (spouse) {
      var sp = hasSon || hasDaughter ? 0.25 : 0.5;
      if (/wife/i.test(spouse.role) || spouse.gender === "female") {
        sp = hasSon || hasDaughter ? 0.125 : 0.25;
      }
      var amt = net * sp;
      rows.push({ name: spouse.name, role: spouse.role, fraction: sp, amount: amt, note: "Spouse fixed share (study outline · 4:12)" });
      remaining -= amt;
    }
    if (mother) {
      var mf = hasSon || hasDaughter ? 1 / 6 : 1 / 3;
      var ma = net * mf;
      rows.push({ name: mother.name, role: "mother", fraction: mf, amount: ma, note: "Mother fixed share (study outline · 4:11)" });
      remaining -= ma;
    }
    if (father) {
      var ff = hasSon || hasDaughter ? 1 / 6 : 0;
      if (ff) {
        var fa = net * ff;
        rows.push({ name: father.name, role: "father", fraction: ff, amount: fa, note: "Father fixed share with descendants (study · 4:11)" });
        remaining -= fa;
      } else {
        rows.push({ name: father.name, role: "father", fraction: null, amount: null, note: "Father may take residue as ʿaṣaba when no son — confirm with scholar" });
      }
    }

    var kids = heirs.filter(function (h) {
      return /son|daughter|child/i.test(h.role);
    });
    if (kids.length) {
      notes.push("Children: classical rule is son receives twice daughter among residue (4:11). This tool does not auto-split residue — list names and ask a scholar.");
      kids.forEach(function (k) {
        rows.push({
          name: k.name,
          role: k.role,
          fraction: null,
          amount: null,
          note: "Child · residue / fixed share depends on full case — study only"
        });
      });
    }

    notes.push("Net after listed fixed shares (study math only): " + money(Math.max(0, remaining)));
    notes.push("ʿAwl, radd, kalāla, and school differences are NOT modelled here.");
    return { rows: rows, notes: notes, remaining: remaining };
  }

  function panelHtml() {
    var d = load();
    return (
      '<div class="faraid-study-v2" id="faraid-study-v2">' +
      '<div class="fs-badge">Educational study only · not a fatwa · not a court calculation</div>' +
      "<h3>Study calculator · lite</h3>" +
      '<p class="fs-lead">Illustrative numbers for learning. Real estates need a qualified local scholar and, where required, counsel.</p>' +
      '<details class="fs-tut"><summary>Quick start</summary><ol>' +
      "<li>Optionally pull names from the family tree registry.</li>" +
      "<li>Enter gross estate, funeral costs, debts, and wasiyyah (≤ ⅓ of remainder is the classical discussion for non-heirs).</li>" +
      "<li>Run study calc — read the notes, then verify with a scholar.</li>" +
      "</ol></details>" +
      '<div class="fs-grid">' +
      '<label>Gross estate<input type="number" id="fs-gross" min="0" step="0.01" value="' +
      (d.gross || "") +
      '"/></label>' +
      '<label>Currency<input type="text" id="fs-cur" maxlength="8" value="' +
      (d.currency || "CAD") +
      '"/></label>' +
      '<label>Funeral / burial<input type="number" id="fs-funeral" min="0" step="0.01" value="' +
      (d.funeral || "0") +
      '"/></label>' +
      '<label>Debts of deceased<input type="number" id="fs-debts" min="0" step="0.01" value="' +
      (d.debts || "0") +
      '"/></label>' +
      '<label>Wasiyyah (bequest)<input type="number" id="fs-wasiyyah" min="0" step="0.01" value="' +
      (d.wasiyyah || "0") +
      '"/></label>' +
      '<label>Net (auto)<input type="text" id="fs-net" readonly value=""/></label>' +
      "</div>" +
      '<div class="fs-actions">' +
      '<button type="button" class="btn-soft" id="fs-pull-tree">Pull heirs from tree registry</button>' +
      '<button type="button" class="btn-soft" id="fs-add-heir">Add heir row</button>' +
      '<button type="button" class="btn-soft" id="fs-calc">Run study calc</button>' +
      '<button type="button" class="btn-soft" id="fs-save">Save study inputs</button>' +
      "</div>" +
      '<div id="fs-heirs"></div>' +
      '<div id="fs-result" class="fs-result" hidden></div>' +
      '<p class="fs-msg" id="fs-msg" role="status"></p>' +
      '<p class="fs-disc">Debts and funeral rights come before wasiyyah and inheritance. This panel does not issue a ruling.</p>' +
      "</div>"
    );
  }

  function renderHeirs(list) {
    var box = document.getElementById("fs-heirs");
    if (!box) return;
    if (!list.length) {
      box.innerHTML = '<p class="fs-empty">No heirs listed yet. Pull from tree or add a row.</p>';
      return;
    }
    box.innerHTML =
      '<table class="fs-table"><thead><tr><th>Name</th><th>Role</th><th>Gender</th><th></th></tr></thead><tbody>' +
      list
        .map(function (h, i) {
          return (
            "<tr data-i=\"" +
            i +
            "\"><td>" +
            escape(h.name) +
            "</td><td>" +
            escape(h.role || "") +
            "</td><td>" +
            escape(h.gender || "") +
            '</td><td><button type="button" data-del="' +
            i +
            '">Remove</button></td></tr>'
          );
        })
        .join("") +
      "</tbody></table>";
    box.querySelectorAll("[data-del]").forEach(function (btn) {
      btn.onclick = function () {
        var d = load();
        d.heirs = d.heirs || [];
        d.heirs.splice(Number(btn.getAttribute("data-del")), 1);
        save(d);
        renderHeirs(d.heirs);
      };
    });
  }

  function escape(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function netOf() {
    var gross = Number((document.getElementById("fs-gross") || {}).value) || 0;
    var funeral = Number((document.getElementById("fs-funeral") || {}).value) || 0;
    var debts = Number((document.getElementById("fs-debts") || {}).value) || 0;
    var wasiyyah = Number((document.getElementById("fs-wasiyyah") || {}).value) || 0;
    var afterCosts = Math.max(0, gross - funeral - debts);
    // Classical discussion: wasiyyah up to 1/3 of what remains after debts/funeral
    var maxW = afterCosts / 3;
    if (wasiyyah > maxW + 0.001) {
      setMsg("Wasiyyah exceeds ⅓ of remainder in classical discussion (" + money(maxW) + "). Confirm with a scholar.", "err");
    }
    var net = Math.max(0, afterCosts - wasiyyah);
    var netEl = document.getElementById("fs-net");
    if (netEl) netEl.value = money(net);
    return net;
  }

  function setMsg(t, kind) {
    var el = document.getElementById("fs-msg");
    if (!el) return;
    el.textContent = t || "";
    el.className = "fs-msg" + (kind ? " " + kind : "");
  }

  function bind() {
    var pull = document.getElementById("fs-pull-tree");
    if (pull) {
      pull.onclick = function () {
        var reg = treeRegistry();
        var d = load();
        d.heirs = d.heirs || [];
        var seen = {};
        d.heirs.forEach(function (h) {
          seen[(h.name || "").toLowerCase()] = true;
        });
        reg.forEach(function (r) {
          if (!r || !r.name) return;
          if (seen[r.name.toLowerCase()]) return;
          if (/self/i.test(r.role)) return; // deceased is not an heir of self
          seen[r.name.toLowerCase()] = true;
          d.heirs.push({ name: r.name, role: r.role || "", gender: r.gender || "" });
        });
        save(d);
        renderHeirs(d.heirs);
        setMsg("Pulled " + d.heirs.length + " name(s) from tree registry.", "ok");
      };
    }
    var add = document.getElementById("fs-add-heir");
    if (add) {
      add.onclick = function () {
        var name = prompt("Heir name");
        if (!name) return;
        var role = prompt("Role (e.g. son, daughter, spouse, father, mother)", "son") || "";
        var d = load();
        d.heirs = d.heirs || [];
        d.heirs.push({ name: name.trim(), role: role.trim(), gender: "" });
        save(d);
        renderHeirs(d.heirs);
      };
    }
    var calc = document.getElementById("fs-calc");
    if (calc) {
      calc.onclick = function () {
        var net = netOf();
        var d = load();
        var res = studyShares(d.heirs || [], net);
        var box = document.getElementById("fs-result");
        if (!box) return;
        box.hidden = false;
        box.innerHTML =
          "<h4>Study result (illustrative)</h4>" +
          '<table class="fs-table"><thead><tr><th>Name</th><th>Role</th><th>Fraction</th><th>Amount</th><th>Note</th></tr></thead><tbody>' +
          res.rows
            .map(function (r) {
              return (
                "<tr><td>" +
                escape(r.name) +
                "</td><td>" +
                escape(r.role) +
                "</td><td>" +
                (r.fraction != null ? (r.fraction * 100).toFixed(2) + "%" : "—") +
                "</td><td>" +
                (r.amount != null ? money(r.amount) : "—") +
                "</td><td>" +
                escape(r.note) +
                "</td></tr>"
              );
            })
            .join("") +
          "</tbody></table>" +
          "<ul>" +
          res.notes.map(function (n) {
            return "<li>" + escape(n) + "</li>";
          }).join("") +
          "</ul>" +
          '<p class="fs-disc">Not a fatwa · not a court document · verify every figure with a scholar.</p>';
        setMsg("Study calc complete · verify with a scholar.", "ok");
      };
    }
    var saveBtn = document.getElementById("fs-save");
    if (saveBtn) {
      saveBtn.onclick = function () {
        var d = load();
        d.gross = (document.getElementById("fs-gross") || {}).value;
        d.currency = (document.getElementById("fs-cur") || {}).value;
        d.funeral = (document.getElementById("fs-funeral") || {}).value;
        d.debts = (document.getElementById("fs-debts") || {}).value;
        d.wasiyyah = (document.getElementById("fs-wasiyyah") || {}).value;
        save(d);
        netOf();
        setMsg("Study inputs saved on this device.", "ok");
      };
    }
    ["fs-gross", "fs-funeral", "fs-debts", "fs-wasiyyah"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("input", netOf);
    });
    netOf();
  }

  function mount() {
    var host =
      document.getElementById("amana-faraid-study-root") ||
      document.getElementById("amana-faraid-rich-root") ||
      document.getElementById("faraid-card");
    if (!host) return;
    var wrap = document.getElementById("faraid-study-v2");
    if (!wrap) {
      var slot = document.createElement("div");
      slot.id = "amana-faraid-study-root";
      slot.innerHTML = panelHtml();
      if (host.id === "amana-faraid-rich-root") {
        host.parentNode.insertBefore(slot, host.nextSibling);
      } else {
        host.appendChild(slot);
      }
    }
    var d = load();
    renderHeirs(d.heirs || []);
    bind();
  }

  function boot() {
    if (!/\/amana\/fiqh\/?/.test(location.pathname || "")) return;
    try {
      mount();
    } catch (e) {
      try {
        console.warn("[Farāʾiḍ study v2]", e);
      } catch (err) {}
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 500);
})(window);

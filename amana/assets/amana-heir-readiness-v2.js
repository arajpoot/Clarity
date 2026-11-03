/*! Heir readiness v2 · Companion leftover fields
 * Storage: clarity_amana_heirs_v1 (compatible with existing heirs page)
 * Educational only — not a fatwa
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_HEIR_READINESS_V2__) return;
  w.__CLARITY_AMANA_HEIR_READINESS_V2__ = true;

  var KEY = "clarity_amana_heirs_v1";

  function isHeirs() {
    return /\/amana\/heirs\/?/.test(location.pathname || "");
  }

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch (e) {
      return {};
    }
  }
  function save(o) {
    try {
      localStorage.setItem(KEY, JSON.stringify(o));
    } catch (e) {}
  }

  function fields() {
    return [
      ["ahr-fullname", "fullname"],
      ["ahr-kin", "kin"],
      ["ahr-wasi", "wasi"],
      ["ahr-missed", "missed"],
      ["ahr-letter", "letter"],
      ["ahr-debts", "debts"],
      ["ahr-docs", "docs"],
      ["ahr-spouse", "spouse"],
      ["ahr-children", "children"],
      ["ahr-parents", "parents"],
      ["ahr-siblings", "siblings"],
      ["ahr-other-heirs", "other"]
    ];
  }

  function readiness(d) {
    var keys = fields().map(function (x) {
      return x[1];
    });
    var n = 0;
    keys.forEach(function (k) {
      if (d[k] && String(d[k]).trim()) n++;
    });
    var pct = Math.round((n / keys.length) * 100);
    return { n: n, total: keys.length, pct: pct };
  }

  function panelHtml(d) {
    d = d || {};
    var r = readiness(d);
    return (
      '<section class="amana-card" id="amana-heir-readiness">' +
      "<h2>📋 Heir readiness · for those you leave behind</h2>" +
      '<p class="ahr-disc">On-device only · not a fatwa · fill what you can so next of kin know where to begin. Confirm with a scholar and local counsel.</p>' +
      '<div class="ahr-ready" id="amana-readiness-lab">Readiness: ' +
      r.n +
      "/" +
      r.total +
      " (" +
      r.pct +
      "%)</div>" +
      '<label for="ahr-fullname">Full name (as on documents)</label><input type="text" id="ahr-fullname" value="' +
      esc(d.fullname) +
      '"/>' +
      '<label for="ahr-kin">Next of kin · phone</label><input type="text" id="ahr-kin" value="' +
      esc(d.kin) +
      '"/>' +
      '<label for="ahr-wasi">Executor / wasī · guardian of minors</label><input type="text" id="ahr-wasi" value="' +
      esc(d.wasi) +
      '"/>' +
      '<label for="ahr-missed">Missed obligations (notes only)</label><textarea id="ahr-missed" rows="2">' +
      esc(d.missed) +
      "</textarea>" +
      '<label for="ahr-letter">Letter to my family (optional)</label><textarea id="ahr-letter" rows="3">' +
      esc(d.letter) +
      "</textarea>" +
      '<label for="ahr-debts">Debts / trusts to settle first</label><textarea id="ahr-debts" rows="2">' +
      esc(d.debts) +
      "</textarea>" +
      '<label for="ahr-docs">Where key documents are</label><input type="text" id="ahr-docs" value="' +
      esc(d.docs) +
      '"/>' +
      '<div class="amana-family-tree-lite" style="margin-top:0.85rem;padding-top:0.75rem;border-top:1px solid rgba(212,180,90,0.25)">' +
      "<h3 style=\"color:#d4b45a;font-size:1rem\">🌳 Family outline (educational)</h3>" +
      '<label for="ahr-spouse">Spouse(s)</label><input type="text" id="ahr-spouse" value="' +
      esc(d.spouse) +
      '"/>' +
      '<label for="ahr-children">Children</label><textarea id="ahr-children" rows="2">' +
      esc(d.children) +
      "</textarea>" +
      '<label for="ahr-parents">Parents / grandparents still living</label><input type="text" id="ahr-parents" value="' +
      esc(d.parents) +
      '"/>' +
      '<label for="ahr-siblings">Siblings</label><input type="text" id="ahr-siblings" value="' +
      esc(d.siblings) +
      '"/>' +
      '<label for="ahr-other-heirs">Other possible heirs / notes</label><textarea id="ahr-other-heirs" rows="2">' +
      esc(d.other) +
      "</textarea></div>" +
      '<div style="margin-top:0.65rem;display:flex;flex-wrap:wrap;gap:0.4rem">' +
      '<button type="button" class="btn-soft" id="ahr-save-v2">Save on this device</button>' +
      '<a class="btn-soft" href="/amana/tree/" style="text-decoration:none">Open family tree</a>' +
      '<a class="btn-soft" href="/amana/wasiyyah/" style="text-decoration:none">Wasiyyah notes</a>' +
      "</div>" +
      '<p id="ahr-msg" style="font-size:0.78rem;opacity:0.85;margin-top:0.35rem"></p>' +
      "</section>"
    );
  }

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;");
  }

  function collect() {
    var o = load();
    fields().forEach(function (pair) {
      var el = document.getElementById(pair[0]);
      if (el) o[pair[1]] = el.value;
    });
    return o;
  }

  function bind() {
    var btn = document.getElementById("ahr-save-v2");
    if (btn) {
      btn.onclick = function () {
        var o = collect();
        o.ts = Date.now();
        save(o);
        var r = readiness(o);
        var lab = document.getElementById("amana-readiness-lab");
        if (lab) lab.textContent = "Readiness: " + r.n + "/" + r.total + " (" + r.pct + "%)";
        var msg = document.getElementById("ahr-msg");
        if (msg) msg.textContent = "Saved · " + new Date().toLocaleString();
      };
    }
    fields().forEach(function (pair) {
      var el = document.getElementById(pair[0]);
      if (!el) return;
      el.addEventListener("input", function () {
        var o = collect();
        var r = readiness(o);
        var lab = document.getElementById("amana-readiness-lab");
        if (lab) lab.textContent = "Readiness: " + r.n + "/" + r.total + " (" + r.pct + "%)";
      });
    });
  }

  function mount() {
    if (!isHeirs()) return;
    if (document.getElementById("amana-heir-readiness")) {
      bind();
      return;
    }
    var main = document.querySelector("main.amana-wrap") || document.querySelector("main");
    if (!main) return;
    var d = load();
    var wrap = document.createElement("div");
    wrap.innerHTML = panelHtml(d);
    var node = wrap.firstChild;
    var existing = document.getElementById("heirs");
    if (existing && existing.parentNode) existing.parentNode.insertBefore(node, existing);
    else main.appendChild(node);
    bind();
  }

  function boot() {
    try {
      mount();
    } catch (e) {
      try {
        console.warn("[heir readiness]", e);
      } catch (err) {}
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 500);
})(window);

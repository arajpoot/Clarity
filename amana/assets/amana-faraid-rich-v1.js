/*! amana-faraid-rich-v1 · educational only — not a fatwa or court calculation */
(function (w) {
  "use strict";
  if (w.__AMANA_FARAID_RICH_V1__) return;
  w.__AMANA_FARAID_RICH_V1__ = true;

  var STORE = "clarity_amana_faraid_study_v1";

  var SCENARIOS = [
    { id: "spouse_kids", title: "Spouse + children", body: "Classical teaching discusses fixed shares for a spouse and for children, with remainder patterns addressed in the Sunnah. Exact portions depend on who is present — ask a teacher for any real estate." },
    { id: "parents_only", title: "Parents with no children", body: "Parents have defined shares in the Qurʾān when certain heirs are absent or present. Do not apply a website chart to a real case without qualified guidance." },
    { id: "spouse_parents", title: "Spouse + parents", body: "When a spouse and parents inherit together, fixed shares interact carefully. A teacher maps the case — this is only a study pointer." },
    { id: "kalalah", title: "Kalālah (edge)", body: "Qurʾān 4:176 and related discussion address kalālah. Advanced — educational pointer only." },
    { id: "daughters_only", title: "Daughters without sons", body: "Teaching texts discuss fixed portions for daughters when there is no son, and when multiple daughters share. Confirm every real case with a qualified person." },
    { id: "errors", title: "Common errors checklist", body: "Unborn child, missing persons, prior spouses, non-Muslim relatives, and debts before distribution are frequent sources of confusion. List questions for your teacher." }
  ];

  /* Educational fixed-share study table — NOT a calculator for your estate */
  var SHARE_TABLE = [
    { heir: "Husband", share: "1/2 or 1/4", note: "Depends on whether the deceased left children (study map)." },
    { heir: "Wife", share: "1/4 or 1/8", note: "Depends on whether the deceased left children (study map)." },
    { heir: "Father", share: "Fixed + residual patterns", note: "Varies with presence of children and other heirs." },
    { heir: "Mother", share: "1/3 or 1/6", note: "Classic teaching depends on children / siblings present." },
    { heir: "Son", share: "Residue (ʿaṣabah) patterns", note: "With daughters, classic 2:1 teaching is studied with a teacher." },
    { heir: "Daughter", share: "1/2 (one) · 2/3 (two+)", note: "When no son — study only; real cases need a scholar." }
  ];

  var ERROR_CHECKS = [
    "Debts and funeral costs settled first?",
    "Unborn child possible?",
    "Missing person / prolonged absence?",
    "Prior spouse(s) and their children?",
    "Non-Muslim relatives in the family tree?",
    "Wasiyyah claims within optional third?",
    "Documents located for heirs?"
  ];

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch (e) { return {}; }
  }
  function save(data) {
    try { localStorage.setItem(STORE, JSON.stringify(data)); } catch (e) {}
  }

  function render(root) {
    if (!root) return;
    var data = load();
    var opts = SCENARIOS.map(function (s) {
      return '<option value="' + s.id + '"' + (data.pick === s.id ? ' selected' : '') + '>' + s.title + '</option>';
    }).join('');

    var tableRows = SHARE_TABLE.map(function (r) {
      return '<tr><td>' + r.heir + '</td><td>' + r.share + '</td><td>' + r.note + '</td></tr>';
    }).join('');

    var checks = ERROR_CHECKS.map(function (label, i) {
      var on = data.checks && data.checks[i];
      return '<label style="display:block;margin:0.25rem 0;font-size:0.82rem">' +
        '<input type="checkbox" data-check="' + i + '"' + (on ? ' checked' : '') + '/> ' + label + '</label>';
    }).join('');

    root.innerHTML =
      '<p class="disc" style="font-size:0.78rem;padding:0.55rem 0.7rem;border-radius:10px;border-left:3px solid rgba(212,180,90,0.55);background:rgba(0,0,0,0.25)">' +
      '<strong>Not a fatwa · not a court calculation · not a verdict for your estate.</strong> ' +
      'Use this to prepare questions for a qualified teacher. Local law may also apply.</p>' +

      '<label style="font-weight:700;font-size:0.85rem">Study scenario</label>' +
      '<select id="amana-faraid-pick" style="width:100%;max-width:28rem;margin:0.35rem 0 0.65rem;padding:0.4rem;border-radius:8px;background:#0c1c16;color:inherit;border:1px solid rgba(212,180,90,0.3)">' +
      '<option value="">Choose a map…</option>' + opts + '</select>' +
      '<div id="amana-faraid-body" style="font-size:0.85rem;line-height:1.5;margin-bottom:0.75rem;min-height:2.5rem"></div>' +

      '<h3 style="color:#d4b45a;font-size:0.95rem;margin:0.75rem 0 0.35rem">Fixed-share study table (educational)</h3>' +
      '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:0.78rem">' +
      '<thead><tr style="text-align:left;border-bottom:1px solid rgba(212,180,90,0.35)"><th style="padding:0.35rem">Heir</th><th>Share (study)</th><th>Note</th></tr></thead>' +
      '<tbody>' + tableRows + '</tbody></table></div>' +

      '<h3 style="color:#d4b45a;font-size:0.95rem;margin:1rem 0 0.35rem">Common-error checklist</h3>' +
      '<div id="amana-faraid-checks">' + checks + '</div>' +

      '<label style="display:block;margin-top:0.75rem;font-weight:700;font-size:0.85rem">Questions for a teacher</label>' +
      '<textarea id="amana-faraid-notes" rows="4" style="width:100%;margin:0.35rem 0;padding:0.45rem;border-radius:8px;border:1px solid rgba(212,180,90,0.3);background:#0c1c16;color:inherit">' +
      (data.notes || '').replace(/</g, '&lt;') + '</textarea>' +
      '<button type="button" class="btn-soft" id="amana-faraid-save">Save study notes</button>' +
      '<span id="amana-faraid-msg" style="font-size:0.78rem;opacity:0.85;margin-left:0.5rem"></span>';

    function showBody() {
      var pick = document.getElementById('amana-faraid-pick');
      var body = document.getElementById('amana-faraid-body');
      var sc = SCENARIOS.filter(function (s) { return s.id === (pick && pick.value); })[0];
      body.textContent = sc ? sc.body : 'Select a scenario to read the study map.';
    }
    document.getElementById('amana-faraid-pick').addEventListener('change', function () {
      showBody();
      var d = load();
      d.pick = this.value;
      save(d);
    });
    showBody();

    document.getElementById('amana-faraid-checks').addEventListener('change', function (ev) {
      var t = ev.target;
      if (!t || !t.getAttribute('data-check')) return;
      var d = load();
      d.checks = d.checks || {};
      d.checks[t.getAttribute('data-check')] = !!t.checked;
      save(d);
    });

    document.getElementById('amana-faraid-save').addEventListener('click', function () {
      var d = load();
      d.notes = document.getElementById('amana-faraid-notes').value;
      d.pick = document.getElementById('amana-faraid-pick').value;
      save(d);
      document.getElementById('amana-faraid-msg').textContent = 'Saved · ' + new Date().toLocaleString();
    });
  }

  function boot() {
    render(document.getElementById('amana-faraid-rich-root'));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  w.ClarityAmanaFaraidRender = render;
})(window);

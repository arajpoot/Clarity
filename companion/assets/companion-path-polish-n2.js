/*! companion-path-polish-n2.js · N2 · path focus + ilm 7-day fill
 * Does not replace pathway-bridge / curriculum / governance — fills gaps only.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_PATH_POLISH_N2__) return;
  w.__CLARITY_PATH_POLISH_N2__ = true;

  var LS_ILM = "clarity_ilm_pathway_n2";
  var WEEK = {
    seeker: [
      "Remember death with one short duʿāʾ",
      "Read one short reminder with presence",
      "One seerah spark — character, not trivia",
      "Guard the tongue for one sitting",
      "Give a small hidden charity if able",
      "Review the week with honesty",
      "Rest the heart — gratitude list"
    ],
    new_muslim: [
      "Wudūʾ steps slowly, once with care",
      "One prayer on time with calm",
      "Learn meaning of the shahāda again",
      "Short sūrah practice (al-Fātiḥah focus)",
      "Ask one question to a trusted teacher",
      "Meet a merciful community moment",
      "Review pillars — no overwhelm"
    ],
    practicing: [
      "Qurʾān page with tajweed awareness",
      "One calligraphy or writing of basmala",
      "Deed ledger — one act logged",
      "Seerah mirror — match a trait today",
      "Family kindness as ʿibādah",
      "Weekly review of habits",
      "Teach one small benefit to someone"
    ],
    dai: [
      "Check a source before sharing",
      "Daʿwah with adab — one gentle conversation",
      "Study one evidence with humility",
      "Family legacy note (educational)",
      "Correct a mistake you made publicly, softly",
      "Protect time for your own ʿibādah",
      "Plan next week’s light — not volume"
    ]
  };

  function norm(p) {
    p = String(p || "seeker").toLowerCase();
    if (p === "daily" || p === "daily_muslim") return "practicing";
    if (p === "new" || p === "newmuslim") return "new_muslim";
    if (p === "da'i" || p === "daʿī" || p === "dawah") return "dai";
    return p;
  }

  function currentPath() {
    try {
      var b = d.querySelector("[data-cs-path].is-active, [data-cs-path].active, button[data-cs-path][aria-pressed='true']");
      if (b) return norm(b.getAttribute("data-cs-path"));
    } catch (e) {}
    try {
      return norm(localStorage.getItem("cu_companion_path_v1") || localStorage.getItem("clarity_cs_path") || "seeker");
    } catch (e2) {
      return "seeker";
    }
  }

  function loadIlm() {
    try {
      return JSON.parse(localStorage.getItem(LS_ILM) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function saveIlm(o) {
    try {
      localStorage.setItem(LS_ILM, JSON.stringify(o));
    } catch (e) {}
  }

  function renderIlm() {
    var list = d.getElementById("ilm-pathway-list");
    if (!list) return;
    var path = currentPath();
    var days = WEEK[path] || WEEK.seeker;
    var st = loadIlm();
    var key = path + "_v1";
    var done = (st[key] || {});
    var html = "";
    for (var i = 0; i < 7; i++) {
      var id = "d" + (i + 1);
      var isDone = !!done[id];
      html +=
        '<div class="ilm-day' +
        (isDone ? " done" : "") +
        '" data-ilm-day="' +
        id +
        '">' +
        '<span class="ilm-day-label">Day ' +
        (i + 1) +
        "</span>" +
        '<span class="ilm-day-focus">' +
        days[i] +
        "</span>" +
        '<button type="button" class="btn-soft" data-ilm-toggle="' +
        id +
        '">' +
        (isDone ? "Done ✓" : "Mark done") +
        "</button></div>";
    }
    html +=
      '<p class="td-src" style="font-size:0.78rem;margin-top:0.45rem">Path: <strong>' +
      path +
      "</strong> · local week marks · educational only — not a fatwa.</p>";
    list.innerHTML = html;
    list.querySelectorAll("[data-ilm-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-ilm-toggle");
        var st2 = loadIlm();
        st2[key] = st2[key] || {};
        st2[key][id] = !st2[key][id];
        saveIlm(st2);
        renderIlm();
      });
    });
    var meta = d.getElementById("ilm-pathway-summary-meta");
    if (meta) {
      var n = Object.keys(done).filter(function (k) {
        return done[k];
      }).length;
      meta.textContent = n + "/7 marked · " + path + " · tap to open";
    }
  }

  w.ilmPathwayReset = function () {
    var path = currentPath();
    var st = loadIlm();
    st[path + "_v1"] = {};
    saveIlm(st);
    renderIlm();
  };

  function polishFocus() {
    var path = currentPath();
    var el = d.getElementById("cs-focus-path");
    if (el && el.textContent && el.textContent.indexOf("·") < 0) {
      el.textContent = path + " · focus";
    }
  }

  function boot() {
    renderIlm();
    polishFocus();
    d.addEventListener(
      "click",
      function (ev) {
        var t = ev.target;
        if (!t || !t.closest) return;
        if (t.closest("[data-cs-path]")) {
          setTimeout(function () {
            renderIlm();
            polishFocus();
          }, 80);
        }
      },
      true
    );
    setTimeout(renderIlm, 600);
    setTimeout(renderIlm, 2000);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);

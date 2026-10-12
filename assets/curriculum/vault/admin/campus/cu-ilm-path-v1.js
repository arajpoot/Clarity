/* Clarity University — Ilm Path form factor v1
 * Kulliyyāt ribbon, faculty greeting, shelf links, polite spark tone overlay.
 * Educational personas only — not ijāzah / not fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CU_ILM_PATH_V1__) return;
  g.__CU_ILM_PATH_V1__ = true;

  var ROSTER_URL = "/assets/curriculum/vault/admin/faculty/faculty-roster.json?v=20261012ILM";
  var SHELF_URL = "/assets/curriculum/vault/admin/staff/library/shelves.json?v=20261012ILM";
  var SPARK_URL = "/assets/curriculum/shared/module-spark-quiz-bank.json?v=20261012ILM";

  var roster = null;
  var shelves = null;
  var sparkBank = null;

  function phaseNum() {
    try {
      if (g.ClarityUnivLearner) return g.ClarityUnivLearner.currentPhaseNum();
    } catch (e) {}
    try {
      var u = new URL(location.href);
      var q = (u.searchParams.get("phase") || "").toLowerCase();
      var map = { seeker: 1, "new-muslim": 2, daily: 3, dai: 4, junior: 1 };
      if (map[q]) return map[q];
    } catch (e2) {}
    return 1;
  }

  function phaseId() {
    return ["seeker", "new-muslim", "daily", "dai"][phaseNum() - 1] || "seeker";
  }

  function fetchJson(url) {
    return fetch(url, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("fetch");
      return r.json();
    });
  }

  function teacherForPhase(n) {
    if (!roster || !roster.teachers) return null;
    for (var i = 0; i < roster.teachers.length; i++) {
      if (roster.teachers[i].phase === n) return roster.teachers[i];
    }
    return roster.teachers[0] || null;
  }

  function injectCss() {
    if (document.getElementById("cu-ilm-css")) return;
    var s = document.createElement("style");
    s.id = "cu-ilm-css";
    s.textContent =
      ".cu-ilm-ribbon{display:flex;flex-wrap:wrap;gap:.4rem;justify-content:center;margin:0 0 .85rem}" +
      ".cu-ilm-ribbon a{flex:1 1 6.5rem;min-width:6rem;max-width:10rem;text-align:center;padding:.45rem .4rem;border-radius:14px;border:1px solid rgba(224,197,106,.3);background:rgba(0,0,0,.28);color:#f3e6c0;text-decoration:none;font-size:.68rem;font-weight:700;line-height:1.25}" +
      ".cu-ilm-ribbon a small{display:block;font-size:.58rem;font-weight:600;color:rgba(224,197,106,.9);letter-spacing:.06em;text-transform:uppercase;margin-bottom:.15rem}" +
      ".cu-ilm-ribbon a.on{background:linear-gradient(145deg,rgba(31,166,122,.35),rgba(224,197,106,.12));border-color:rgba(224,197,106,.55);box-shadow:0 0 16px rgba(31,166,122,.15)}" +
      ".cu-ilm-ribbon a.locked{opacity:.45}" +
      ".cu-teacher-card{margin:0 0 .85rem;padding:.85rem 1rem;border-radius:16px;border:1px solid rgba(224,197,106,.32);background:linear-gradient(135deg,rgba(15,76,58,.35),rgba(12,20,16,.95))}" +
      ".cu-teacher-card .rank{font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;color:#e0c56a;font-weight:700}" +
      ".cu-teacher-card h2{margin:.2rem 0 .25rem;font-size:1.05rem;color:#f3e6c0}" +
      ".cu-teacher-card .spec{font-size:.78rem;color:rgba(234,243,238,.78);margin:0 0 .4rem}" +
      ".cu-teacher-card .greet{font-size:.84rem;line-height:1.45;color:#eaf3ee;margin:0}" +
      ".cu-teacher-card .disc{margin:.5rem 0 0;font-size:.68rem;color:rgba(234,243,238,.55);line-height:1.35}" +
      ".cu-shelf-row{display:flex;flex-wrap:wrap;gap:.35rem;margin:.35rem 0 .75rem}" +
      ".cu-shelf-row a{font-size:.72rem;font-weight:600;padding:.28rem .55rem;border-radius:999px;border:1px solid rgba(224,197,106,.28);background:rgba(0,0,0,.25);color:#e0c56a;text-decoration:none}" +
      ".cu-spark-polite{font-size:.78rem;color:#c8e6c9;margin:.35rem 0}" +
      "#cu-ilm-modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:9000;display:flex;align-items:center;justify-content:center;padding:1rem}" +
      "#cu-ilm-modal{max-width:22rem;width:100%;padding:1.15rem 1.2rem;border-radius:18px;border:1px solid rgba(224,197,106,.4);background:linear-gradient(160deg,#122018,#0a1210);color:#eaf3ee;box-shadow:0 16px 40px rgba(0,0,0,.45)}" +
      "#cu-ilm-modal h3{margin:0 0 .4rem;color:#f3e6c0;font-size:1.05rem}" +
      "#cu-ilm-modal p{margin:.35rem 0;font-size:.84rem;line-height:1.45}" +
      "#cu-ilm-modal button{margin-top:.65rem;width:100%;padding:.5rem;border-radius:999px;border:1px solid rgba(224,197,106,.4);background:linear-gradient(135deg,#1fa67a,#0f4c3a);color:#f7f3eb;font-weight:700;cursor:pointer}";
    document.head.appendChild(s);
  }

  function renderRibbon(host) {
    if (!host || host.querySelector(".cu-ilm-ribbon")) return;
    var n = phaseNum();
    var ribbon = document.createElement("nav");
    ribbon.className = "cu-ilm-ribbon";
    ribbon.setAttribute("aria-label", "Ilm path colleges");
    var colleges = [
      { id: "seeker", n: 1, ar: "Uṣūl", en: "Foundations" },
      { id: "new-muslim", n: 2, ar: "ʿIbādah", en: "Practice" },
      { id: "daily", n: 3, ar: "Itqān", en: "Consistency" },
      { id: "dai", n: 4, ar: "Balāgh", en: "Transmission" }
    ];
    colleges.forEach(function (c) {
      var a = document.createElement("a");
      a.href = "/campus/desk/?phase=" + c.id;
      a.innerHTML = "<small>" + c.ar + "</small>" + c.en;
      if (c.n === n) a.classList.add("on");
      try {
        if (g.ClarityUnivLearner && g.ClarityUnivLearner.phaseStatus(c.n) === "locked") {
          a.classList.add("locked");
        }
      } catch (e) {}
      ribbon.appendChild(a);
    });
    host.insertBefore(ribbon, host.firstChild);
  }

  function renderTeacher(host) {
    if (!host || host.querySelector(".cu-teacher-card")) return;
    var t = teacherForPhase(phaseNum());
    if (!t) return;
    var card = document.createElement("section");
    card.className = "cu-teacher-card";
    card.innerHTML =
      '<div class="rank">' +
      escape(t.rank || "Guide") +
      " · " +
      escape(t.college || "") +
      "</div>" +
      "<h2>" +
      escape(t.name || "") +
      "</h2>" +
      '<p class="spec">' +
      escape(t.specialty || "") +
      "</p>" +
      '<p class="greet">' +
      escape(t.greeting || "") +
      "</p>" +
      '<p class="disc">' +
      escape(
        (roster && roster.disclaimer) ||
          "Educational guide only — not ijāzah or fatwa authority."
      ) +
      "</p>";
    var ribbon = host.querySelector(".cu-ilm-ribbon");
    if (ribbon && ribbon.nextSibling) host.insertBefore(card, ribbon.nextSibling);
    else host.insertBefore(card, host.firstChild);
  }

  function renderShelves(host) {
    if (!host || !shelves || !shelves.shelves) return;
    if (host.querySelector(".cu-shelf-row")) return;
    var n = phaseNum();
    var row = document.createElement("div");
    row.className = "cu-shelf-row";
    shelves.shelves.forEach(function (sh) {
      if (sh.phase !== n) return;
      (sh.refs || []).forEach(function (ref) {
        var a = document.createElement("a");
        a.href = ref.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = ref.title;
        row.appendChild(a);
      });
    });
    if (row.children.length) {
      var label = document.createElement("p");
      label.style.cssText = "margin:0 0 .25rem;font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;color:#e0c56a;font-weight:700;text-align:center";
      label.textContent = "Shelf for this college";
      host.appendChild(label);
      host.appendChild(row);
    }
  }

  function escape(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /** Soft overlay: rewrite harsh quiz status text if it appears */
  function politeSparkObserver() {
    if (!sparkBank) return;
    var roots = [
      document.getElementById("campus-stage-body"),
      document.getElementById("clarity-campus-stage"),
      document.body
    ];
    var harsh = /wrong|incorrect|failed|fail/i;
    roots.forEach(function (root) {
      if (!root || root.__cuPoliteObs) return;
      root.__cuPoliteObs = true;
      var mo = new MutationObserver(function () {
        root.querySelectorAll("button, .junior-quiz-msg, .spark-msg, .quiz-status, [data-quiz-status]").forEach(function (el) {
          var t = (el.textContent || "").trim();
          if (!harsh.test(t)) return;
          var retry =
            (sparkBank.gentleRetry && sparkBank.gentleRetry[0]) ||
            "No worry — read the points once more, then try again.";
          el.textContent = retry;
          el.classList.add("cu-spark-polite");
        });
      });
      mo.observe(root, { childList: true, subtree: true, characterData: true });
    });
  }

  function onceGreetingModal() {
    try {
      if (sessionStorage.getItem("cu_ilm_greet_" + phaseId())) return;
    } catch (e) {}
    var t = teacherForPhase(phaseNum());
    if (!t || !document.body) return;
    var bg = document.createElement("div");
    bg.id = "cu-ilm-modal-bg";
    bg.innerHTML =
      '<div id="cu-ilm-modal" role="dialog" aria-modal="true">' +
      "<h3>" +
      escape(t.name) +
      "</h3>" +
      "<p><strong style=\"color:#e0c56a\">" +
      escape(t.title || "") +
      "</strong></p>" +
      "<p>" +
      escape(t.greeting || "") +
      "</p>" +
      "<p style=\"font-size:.72rem;opacity:.7\">On-device educational guide — not a formal scholar appointment or fatwa source.</p>" +
      "<button type=\"button\" id=\"cu-ilm-modal-ok\">Bismillāh — begin</button></div>";
    document.body.appendChild(bg);
    document.getElementById("cu-ilm-modal-ok").onclick = function () {
      try {
        sessionStorage.setItem("cu_ilm_greet_" + phaseId(), "1");
      } catch (e2) {}
      bg.remove();
    };
    bg.addEventListener("click", function (ev) {
      if (ev.target === bg) {
        try {
          sessionStorage.setItem("cu_ilm_greet_" + phaseId(), "1");
        } catch (e3) {}
        bg.remove();
      }
    });
  }

  function paintDesk() {
    var main = document.querySelector(".cu-desk-main") || document.querySelector("main");
    if (!main) return;
    renderRibbon(main);
    renderTeacher(main);
    var stage = document.getElementById("clarity-campus-stage");
    if (stage) renderShelves(stage);
    politeSparkObserver();
    setTimeout(onceGreetingModal, 600);
  }

  function paintMap() {
    var wrap = document.querySelector(".cu-wrap");
    if (!wrap) return;
    renderRibbon(wrap);
  }

  function paintLibrary() {
    var wrap = document.querySelector(".cu-wrap");
    if (!wrap || !shelves) return;
    if (wrap.querySelector(".cu-shelf-full")) return;
    var box = document.createElement("div");
    box.className = "cu-shelf-full";
    shelves.shelves.forEach(function (sh) {
      var h = document.createElement("h2");
      h.style.cssText = "color:#f3e6c0;font-size:.95rem;margin:1rem 0 .35rem";
      h.textContent = sh.title;
      box.appendChild(h);
      var row = document.createElement("div");
      row.className = "cu-shelf-row";
      (sh.refs || []).forEach(function (ref) {
        var a = document.createElement("a");
        a.href = ref.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = ref.title;
        row.appendChild(a);
      });
      box.appendChild(row);
    });
    wrap.appendChild(box);
  }

  function boot() {
    injectCss();
    Promise.all([
      fetchJson(ROSTER_URL).catch(function () { return null; }),
      fetchJson(SHELF_URL).catch(function () { return null; }),
      fetchJson(SPARK_URL).catch(function () { return null; })
    ]).then(function (arr) {
      roster = arr[0];
      shelves = arr[1];
      sparkBank = arr[2];
      if (document.body && document.body.getAttribute("data-campus-page") === "desk") paintDesk();
      else if (document.getElementById("cu-phase-grid")) paintMap();
      if (location.pathname.indexOf("/library") === 0) paintLibrary();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("cu-phase-selected", function () {
    setTimeout(function () {
      document.querySelectorAll(".cu-ilm-ribbon, .cu-teacher-card, .cu-shelf-row").forEach(function (n) {
        n.remove();
      });
      if (document.body && document.body.getAttribute("data-campus-page") === "desk") paintDesk();
    }, 200);
  });
})(typeof window !== "undefined" ? window : this);

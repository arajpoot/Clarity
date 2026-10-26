/**
 * Qaḍāʾ tracker v2 — persistent cursor + progress
 * localStorage:
 *   clarity_qada_log_v1     { "YYYY-MM-DD": { fajr:1, ... }, ... }
 *   clarity_qada_cursor_v1  { y, m, d }  last day user is working on
 * Educational only — not a fatwa
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_QADA_TRACKER_V2__) return;
  w.__CLARITY_QADA_TRACKER_V2__ = true;
  w.__CLARITY_QADA_TRACKER_V1__ = true;

  var KEY = "clarity_qada_log_v1";
  var CURSOR = "clarity_qada_cursor_v1";
  var PRAYERS = [
    { id: "fajr", label: "Fajr" },
    { id: "dhuhr", label: "Dhuhr" },
    { id: "asr", label: "Asr" },
    { id: "maghrib", label: "Maghrib" },
    { id: "isha", label: "Isha" }
  ];

  function readLog() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; }
  }
  function writeLog(obj) {
    try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch (e) {}
  }
  function readCursor() {
    try {
      var c = JSON.parse(localStorage.getItem(CURSOR) || "null");
      if (c && c.y && c.m && c.d) return { y: +c.y, m: +c.m, d: +c.d };
    } catch (e) {}
    return null;
  }
  function writeCursor(y, m, d) {
    try {
      localStorage.setItem(CURSOR, JSON.stringify({ y: +y, m: +m, d: +d }));
    } catch (e) {}
  }
  function pad(n) { n = +n; return n < 10 ? "0" + n : "" + n; }
  function dayKey(y, m, d) { return +y + "-" + pad(m) + "-" + pad(d); }

  function stats(log) {
    var days = Object.keys(log).length;
    var done = 0;
    Object.keys(log).forEach(function (k) {
      var row = log[k] || {};
      PRAYERS.forEach(function (pr) { if (row[pr.id]) done++; });
    });
    return { days: days, done: done };
  }

  function yearsOptions(selected) {
    var y = new Date().getFullYear();
    var html = "";
    for (var i = y; i >= y - 80; i--) {
      html += "<option value=\"" + i + "\"" + (i === +selected ? " selected" : "") + ">" + i + "</option>";
    }
    return html;
  }
  function monthsOptions(selected) {
    var names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return names.map(function (n, i) {
      var v = i + 1;
      return "<option value=\"" + v + "\"" + (v === +selected ? " selected" : "") + ">" + n + "</option>";
    }).join("");
  }
  function daysInMonth(y, m) { return new Date(+y, +m, 0).getDate(); }
  function fillDays(sel, y, m, prefer) {
    var n = daysInMonth(y, m);
    var v = +prefer || +sel.value || 1;
    if (v > n) v = n;
    if (v < 1) v = 1;
    var html = "";
    for (var d = 1; d <= n; d++) {
      html += "<option value=\"" + d + "\"" + (d === v ? " selected" : "") + ">" + d + "</option>";
    }
    sel.innerHTML = html;
    sel.value = String(v);
  }

  function mount() {
    var root = document.getElementById("cdl-qada-root");
    if (!root) return;

    // If already built, only re-bind if selects missing; do NOT reset to today
    if (root.getAttribute("data-ready") === "1" && document.getElementById("qada-y")) {
      return;
    }
    root.setAttribute("data-ready", "1");

    var now = new Date();
    var cur = readCursor();
    var y0 = cur ? cur.y : now.getFullYear();
    var m0 = cur ? cur.m : (now.getMonth() + 1);
    var d0 = cur ? cur.d : now.getDate();
    // clamp day
    var dim = daysInMonth(y0, m0);
    if (d0 > dim) d0 = dim;

    root.innerHTML =
      "<div class=\"qada-guide\">" +
        "<p><strong>Repentance includes repairing what can be repaired.</strong> Prayer is the covenant of the dīn. Neglect without excuse is a major sin among the Muslims.</p>" +
        "<ul>" +
          "<li>Obligation starts at <strong>bulūgh</strong> (puberty) — not from early childhood.</li>" +
          "<li>If you slept or forgot: the Prophet ﷺ said to pray it when you remember — there is no other kaffārah for that case (Bukhārī, Muslim).</li>" +
          "<li>Many teachers of the four schools encourage steady <strong>qaḍāʾ</strong> of missed farḍ from puberty; estimate when unsure.</li>" +
        "</ul>" +
        "<div class=\"qada-diff\"><strong>Scholarly difference (know it, then ask):</strong> " +
          "A strong view among later scholars (including reports from Ibn Taymiyyah, Ibn al-Qayyim, and some contemporary fatāwā) holds that deliberate abandonment is not “made up” like a forgotten prayer — rather sincere tawbah, never returning, and filling the scale with voluntary worship. " +
          "The majority practice in the madhāhib is to make up. <em>This tracker is a private aid for whichever path your teacher confirms — not a ruling.</em></div>" +
        "<p class=\"qada-cal-hint\">Your selected day is remembered on this device. Check off farḍ as you complete them; progress stays across visits.</p>" +
      "</div>" +
      "<div class=\"qada-stats\" id=\"qada-stats\"></div>" +
      "<div class=\"qada-pick\">" +
        "<label>Year<select id=\"qada-y\">" + yearsOptions(y0) + "</select></label>" +
        "<label>Month<select id=\"qada-m\">" + monthsOptions(m0) + "</select></label>" +
        "<label>Day<select id=\"qada-d\"></select></label>" +
        "<button type=\"button\" class=\"primary\" id=\"qada-open-day\">Open day</button>" +
      "</div>" +
      "<p class=\"qada-cal-hint\" id=\"qada-day-label\"></p>" +
      "<div class=\"qada-prayers\" id=\"qada-prayers\"></div>" +
      "<div class=\"qada-actions\">" +
        "<button type=\"button\" class=\"primary\" id=\"qada-mark-all\">Mark all five</button>" +
        "<button type=\"button\" id=\"qada-clear-day\">Clear this day</button>" +
        "<button type=\"button\" id=\"qada-export\">Export CSV</button>" +
      "</div>" +
      "<p class=\"qada-deepen\" style=\"margin-top:0.55rem\">" +
        "<a href=\"https://sunnah.com/bukhari:597\" target=\"_blank\" rel=\"noopener\">Deepen · forgetfulness ḥadīth (Bukhārī) ↗</a> · " +
        "<a href=\"https://islamqa.info/en/answers/111783\" target=\"_blank\" rel=\"noopener\">Overview of views (IslamQA) ↗</a>" +
      "</p>";

    var ySel = document.getElementById("qada-y");
    var mSel = document.getElementById("qada-m");
    var dSel = document.getElementById("qada-d");
    fillDays(dSel, y0, m0, d0);
    ySel.value = String(y0);
    mSel.value = String(m0);

    function currentParts() {
      return { y: +ySel.value, m: +mSel.value, d: +dSel.value };
    }
    function persistCursor() {
      var p = currentParts();
      writeCursor(p.y, p.m, p.d);
    }
    function refreshStats() {
      var st = stats(readLog());
      var el = document.getElementById("qada-stats");
      if (!el) return;
      el.innerHTML =
        "<div class=\"qada-stat\"><b>" + st.days + "</b><span>days logged</span></div>" +
        "<div class=\"qada-stat\"><b>" + st.done + "</b><span>farḍ checked</span></div>" +
        "<div class=\"qada-stat\"><b>" + (st.days ? Math.round((st.done / (st.days * 5)) * 100) : 0) + "%</b><span>fill rate</span></div>";
    }
    function paintPrayers() {
      persistCursor();
      var p = currentParts();
      var k = dayKey(p.y, p.m, p.d);
      var row = readLog()[k] || {};
      var label = document.getElementById("qada-day-label");
      if (label) {
        label.textContent = "Working on " + k + " — checks stay on this device. Change day anytime; progress is kept per date.";
      }
      var box = document.getElementById("qada-prayers");
      box.innerHTML = PRAYERS.map(function (pr) {
        var on = !!row[pr.id];
        return "<label class=\"qada-pray" + (on ? " on" : "") + "\" data-pr=\"" + pr.id + "\">" +
          "<input type=\"checkbox\" " + (on ? "checked" : "") + " />" +
          "<span>" + pr.label + "</span></label>";
      }).join("");
      box.querySelectorAll(".qada-pray").forEach(function (lab) {
        lab.addEventListener("change", function () {
          var id = lab.getAttribute("data-pr");
          var inp = lab.querySelector("input");
          var log = readLog();
          var key = dayKey(currentParts().y, currentParts().m, currentParts().d);
          if (!log[key]) log[key] = {};
          if (inp.checked) log[key][id] = 1;
          else delete log[key][id];
          if (!Object.keys(log[key]).length) delete log[key];
          writeLog(log);
          persistCursor();
          lab.classList.toggle("on", inp.checked);
          refreshStats();
        });
      });
      refreshStats();
    }

    function onYmChange() {
      var p = currentParts();
      fillDays(dSel, p.y, p.m, p.d);
      persistCursor();
      paintPrayers();
    }

    ySel.addEventListener("change", onYmChange);
    mSel.addEventListener("change", onYmChange);
    dSel.addEventListener("change", function () {
      persistCursor();
      paintPrayers();
    });

    var openBtn = document.getElementById("qada-open-day");
    if (openBtn) {
      openBtn.addEventListener("click", function () {
        persistCursor();
        paintPrayers();
        openBtn.textContent = "Day open ✓";
        setTimeout(function () { openBtn.textContent = "Open day"; }, 1200);
      });
    }

    document.getElementById("qada-mark-all").onclick = function () {
      var p = currentParts();
      var k = dayKey(p.y, p.m, p.d);
      var log = readLog();
      log[k] = { fajr: 1, dhuhr: 1, asr: 1, maghrib: 1, isha: 1 };
      writeLog(log);
      persistCursor();
      paintPrayers();
    };
    document.getElementById("qada-clear-day").onclick = function () {
      var p = currentParts();
      var log = readLog();
      delete log[dayKey(p.y, p.m, p.d)];
      writeLog(log);
      persistCursor();
      paintPrayers();
    };
    document.getElementById("qada-export").onclick = function () {
      var log = readLog();
      var lines = ["Date,Fajr,Dhuhr,Asr,Maghrib,Isha"];
      Object.keys(log).sort().forEach(function (k) {
        var r = log[k] || {};
        lines.push([k, r.fajr ? 1 : 0, r.dhuhr ? 1 : 0, r.asr ? 1 : 0, r.maghrib ? 1 : 0, r.isha ? 1 : 0].join(","));
      });
      var blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "clarity-qada-log.csv";
      document.body.appendChild(a); a.click(); a.remove();
    };

    // initial paint with restored cursor
    paintPrayers();
  }

  function boot() { try { mount(); } catch (e) {} }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 600); });
  } else setTimeout(boot, 600);
  w.addEventListener("load", function () { setTimeout(boot, 1200); });

  // Only mount if root empty / not ready — never reset cursor
  var obs = new MutationObserver(function () {
    var root = document.getElementById("cdl-qada-root");
    if (root && root.getAttribute("data-ready") !== "1") boot();
  });
  try { obs.observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}

  w.ClarityQada = { mount: mount, read: readLog, cursor: readCursor };
})(typeof window !== "undefined" ? window : this);

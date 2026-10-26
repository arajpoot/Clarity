/**
 * Qaḍāʾ tracker v3 — sticky working day + persistent checks
 * clarity_qada_log_v1, clarity_qada_cursor_v1
 * Educational only — not a fatwa
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_QADA_TRACKER_V3__) return;
  w.__CLARITY_QADA_TRACKER_V3__ = true;

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
  function writeLog(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }
  function pad(n) { n = +n; return (n < 10 ? "0" : "") + n; }
  function dayKey(y, m, d) { return +y + "-" + pad(m) + "-" + pad(d); }
  function parseKey(k) {
    var p = String(k || "").split("-");
    if (p.length !== 3) return null;
    return { y: +p[0], m: +p[1], d: +p[2] };
  }
  function readCursor() {
    try {
      var c = JSON.parse(localStorage.getItem(CURSOR) || "null");
      if (c && +c.y > 0 && +c.m >= 1 && +c.m <= 12 && +c.d >= 1) {
        return { y: +c.y, m: +c.m, d: +c.d };
      }
    } catch (e) {}
    return null;
  }
  function writeCursor(y, m, d) {
    y = +y; m = +m; d = +d;
    if (!(y > 0 && m >= 1 && m <= 12 && d >= 1)) return;
    try { localStorage.setItem(CURSOR, JSON.stringify({ y: y, m: m, d: d })); } catch (e) {}
  }
  function daysInMonth(y, m) { return new Date(+y, +m, 0).getDate(); }
  function clampDay(y, m, d) {
    var max = daysInMonth(y, m);
    if (d > max) d = max;
    if (d < 1) d = 1;
    return d;
  }
  function toDateInput(y, m, d) { return dayKey(y, m, d); }
  function fromDateInput(val) {
    var p = parseKey(val);
    if (!p || !p.y) return null;
    p.d = clampDay(p.y, p.m, p.d);
    return p;
  }
  function stats(log) {
    var days = Object.keys(log).length, done = 0;
    Object.keys(log).forEach(function (k) {
      var row = log[k] || {};
      PRAYERS.forEach(function (pr) { if (row[pr.id]) done++; });
    });
    return { days: days, done: done, pct: days ? Math.round((done / (days * 5)) * 100) : 0 };
  }

  function mount() {
    var root = document.getElementById("cdl-qada-root");
    if (!root) return;

    var now = new Date();
    var cur = readCursor();
    var y0 = cur ? cur.y : now.getFullYear();
    var m0 = cur ? cur.m : (now.getMonth() + 1);
    var d0 = cur ? cur.d : now.getDate();
    d0 = clampDay(y0, m0, d0);

    // Rebuild UI every time root is empty; if ready and date input exists, just sync from cursor
    if (root.getAttribute("data-ready") === "1" && document.getElementById("qada-date")) {
      var existing = document.getElementById("qada-date");
      var c2 = readCursor();
      if (c2) existing.value = toDateInput(c2.y, c2.m, c2.d);
      paint();
      return;
    }

    root.setAttribute("data-ready", "1");
    root.innerHTML =
      "<div class=\"qada-guide\">" +
        "<p><strong>Repentance includes repairing what can be repaired.</strong> Prayer is the covenant of the dīn.</p>" +
        "<ul>" +
          "<li>Obligation from <strong>bulūgh</strong> (puberty).</li>" +
          "<li>Forgot / slept: pray when you remember (Bukhārī, Muslim).</li>" +
          "<li>Scholars differ on deliberate long neglect — ask a local teacher. This log is a private aid only.</li>" +
        "</ul>" +
        "<p class=\"qada-cal-hint\">Pick a working day once — it stays selected on this device while you check off farḍ.</p>" +
      "</div>" +
      "<div class=\"qada-stats\" id=\"qada-stats\"></div>" +
      "<div class=\"qada-pick\">" +
        "<label style=\"flex:1;min-width:11rem\">Working day" +
          "<input type=\"date\" id=\"qada-date\" value=\"" + toDateInput(y0, m0, d0) + "\" max=\"" + toDateInput(now.getFullYear(), now.getMonth()+1, now.getDate()) + "\" />" +
        "</label>" +
        "<button type=\"button\" class=\"primary\" id=\"qada-prev-day\" title=\"Previous day\">←</button>" +
        "<button type=\"button\" class=\"primary\" id=\"qada-next-day\" title=\"Next day\">→</button>" +
      "</div>" +
      "<p class=\"qada-cal-hint\" id=\"qada-day-label\"></p>" +
      "<div class=\"qada-prayers\" id=\"qada-prayers\"></div>" +
      "<div class=\"qada-actions\">" +
        "<button type=\"button\" class=\"primary\" id=\"qada-mark-all\">Mark all five</button>" +
        "<button type=\"button\" id=\"qada-clear-day\">Clear this day</button>" +
        "<button type=\"button\" id=\"qada-export\">Export CSV</button>" +
      "</div>";

    var dateInp = document.getElementById("qada-date");

    function current() {
      var p = fromDateInput(dateInp && dateInp.value);
      if (!p) {
        var n = new Date();
        p = { y: n.getFullYear(), m: n.getMonth() + 1, d: n.getDate() };
      }
      return p;
    }
    function persist() {
      var p = current();
      writeCursor(p.y, p.m, p.d);
      return p;
    }
    function shiftDay(delta) {
      var p = current();
      var dt = new Date(p.y, p.m - 1, p.d);
      dt.setDate(dt.getDate() + delta);
      var y = dt.getFullYear(), m = dt.getMonth() + 1, d = dt.getDate();
      dateInp.value = toDateInput(y, m, d);
      writeCursor(y, m, d);
      paint();
    }
    function refreshStats() {
      var st = stats(readLog());
      var el = document.getElementById("qada-stats");
      if (!el) return;
      el.innerHTML =
        "<div class=\"qada-stat\"><b>" + st.days + "</b><span>days logged</span></div>" +
        "<div class=\"qada-stat\"><b>" + st.done + "</b><span>farḍ checked</span></div>" +
        "<div class=\"qada-stat\"><b>" + st.pct + "%</b><span>fill rate</span></div>";
    }
    function paint() {
      var p = persist();
      var k = dayKey(p.y, p.m, p.d);
      var row = readLog()[k] || {};
      var label = document.getElementById("qada-day-label");
      if (label) label.textContent = "Working on " + k + " — progress is saved per date on this device.";
      var box = document.getElementById("qada-prayers");
      if (!box) return;
      box.innerHTML = PRAYERS.map(function (pr) {
        var on = !!row[pr.id];
        return "<label class=\"qada-pray" + (on ? " on" : "") + "\" data-pr=\"" + pr.id + "\">" +
          "<input type=\"checkbox\" " + (on ? "checked" : "") + " /><span>" + pr.label + "</span></label>";
      }).join("");
      box.querySelectorAll(".qada-pray").forEach(function (lab) {
        lab.addEventListener("change", function () {
          var id = lab.getAttribute("data-pr");
          var inp = lab.querySelector("input");
          var p2 = persist();
          var key = dayKey(p2.y, p2.m, p2.d);
          var log = readLog();
          if (!log[key]) log[key] = {};
          if (inp.checked) log[key][id] = 1;
          else delete log[key][id];
          if (!Object.keys(log[key]).length) delete log[key];
          writeLog(log);
          lab.classList.toggle("on", !!inp.checked);
          refreshStats();
        });
      });
      refreshStats();
    }

    dateInp.addEventListener("change", function () {
      var p = fromDateInput(dateInp.value);
      if (p) writeCursor(p.y, p.m, p.d);
      paint();
    });
    document.getElementById("qada-prev-day").onclick = function () { shiftDay(-1); };
    document.getElementById("qada-next-day").onclick = function () { shiftDay(1); };
    document.getElementById("qada-mark-all").onclick = function () {
      var p = persist();
      var k = dayKey(p.y, p.m, p.d);
      var log = readLog();
      log[k] = { fajr: 1, dhuhr: 1, asr: 1, maghrib: 1, isha: 1 };
      writeLog(log);
      paint();
    };
    document.getElementById("qada-clear-day").onclick = function () {
      var p = persist();
      var log = readLog();
      delete log[dayKey(p.y, p.m, p.d)];
      writeLog(log);
      paint();
    };
    document.getElementById("qada-export").onclick = function () {
      var log = readLog();
      var lines = ["Date,Fajr,Dhuhr,Asr,Maghrib,Isha"];
      Object.keys(log).sort().forEach(function (k) {
        var r = log[k] || {};
        lines.push([k, r.fajr?1:0, r.dhuhr?1:0, r.asr?1:0, r.maghrib?1:0, r.isha?1:0].join(","));
      });
      var blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "clarity-qada-log.csv";
      document.body.appendChild(a); a.click(); a.remove();
    };

    writeCursor(y0, m0, d0);
    paint();
  }

  function boot() { try { mount(); } catch (e) {} }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 500); });
  else setTimeout(boot, 500);
  w.addEventListener("load", function () { setTimeout(boot, 1000); });
  var obs = new MutationObserver(function () {
    var root = document.getElementById("cdl-qada-root");
    if (root && root.getAttribute("data-ready") !== "1") boot();
  });
  try { obs.observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}
  w.ClarityQada = { mount: mount, read: readLog, cursor: readCursor };
})(typeof window !== "undefined" ? window : this);

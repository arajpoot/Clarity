/**
 * Qaḍāʾ missed-ṣalāh tracker · educational only — not a fatwa
 * localStorage: clarity_qada_log_v1
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_QADA_TRACKER_V1__) return;
  w.__CLARITY_QADA_TRACKER_V1__ = true;

  var KEY = "clarity_qada_log_v1";
  var PRAYERS = [
    { id: "fajr", label: "Fajr" },
    { id: "dhuhr", label: "Dhuhr" },
    { id: "asr", label: "Asr" },
    { id: "maghrib", label: "Maghrib" },
    { id: "isha", label: "Isha" }
  ];

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) { return {}; }
  }
  function write(obj) {
    try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch (e) {}
  }
  function dayKey(y, m, d) {
    function p(n) { n = +n; return n < 10 ? "0" + n : "" + n; }
    return y + "-" + p(m) + "-" + p(d);
  }
  function stats(log) {
    var days = 0, done = 0, totalSlots = 0;
    Object.keys(log).forEach(function (k) {
      var row = log[k] || {};
      var any = false;
      PRAYERS.forEach(function (pr) {
        totalSlots++;
        if (row[pr.id]) { done++; any = true; }
      });
      // count day only if any prayer marked (or if object exists with keys)
      if (Object.keys(row).length) days++;
    });
    // fix: days = number of day keys
    days = Object.keys(log).length;
    return { days: days, done: done };
  }

  function yearsOptions() {
    var y = new Date().getFullYear();
    var html = "";
    for (var i = y; i >= y - 80; i--) html += "<option value=\"" + i + "\">" + i + "</option>";
    return html;
  }
  function monthsOptions() {
    var names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return names.map(function (n, i) {
      return "<option value=\"" + (i + 1) + "\">" + n + "</option>";
    }).join("");
  }
  function daysInMonth(y, m) {
    return new Date(y, m, 0).getDate();
  }
  function fillDays(sel, y, m, prefer) {
    var n = daysInMonth(y, m);
    var v = prefer || sel.value || 1;
    if (v > n) v = n;
    var html = "";
    for (var d = 1; d <= n; d++) {
      html += "<option value=\"" + d + "\"" + (d == v ? " selected" : "") + ">" + d + "</option>";
    }
    sel.innerHTML = html;
  }

  function mount() {
    var root = document.getElementById("cdl-qada-root");
    if (!root || root.getAttribute("data-ready") === "1") return;
    root.setAttribute("data-ready", "1");

    var now = new Date();
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
        "<p class=\"qada-cal-hint\">Suggested routine: after each farḍ today, add one qaḍāʾ of the same prayer (or a small daily set). Avoid disputed times (sunrise, zenith, sunset) if your school dislikes nafl then — qaḍāʾ of farḍ is widely allowed outside those windows. Confirm with a local scholar.</p>" +
      "</div>" +
      "<div class=\"qada-stats\" id=\"qada-stats\"></div>" +
      "<div class=\"qada-pick\">" +
        "<label>Year<select id=\"qada-y\">" + yearsOptions() + "</select></label>" +
        "<label>Month<select id=\"qada-m\">" + monthsOptions() + "</select></label>" +
        "<label>Day<select id=\"qada-d\"></select></label>" +
        "<button type=\"button\" class=\"primary\" id=\"qada-load-day\" style=\"padding:0.4rem 0.75rem;border-radius:999px;border:none;background:#0f4c3a;color:#f5e6b8;font-weight:700;cursor:pointer\">Open day</button>" +
      "</div>" +
      "<p class=\"qada-cal-hint\" id=\"qada-day-label\">Select a past date, then check each farḍ you have completed as qaḍāʾ for that day.</p>" +
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
    ySel.value = String(now.getFullYear());
    mSel.value = String(now.getMonth() + 1);
    fillDays(dSel, +ySel.value, +mSel.value, now.getDate());

    function currentKey() {
      return dayKey(ySel.value, mSel.value, dSel.value);
    }
    function refreshStats() {
      var st = stats(read());
      var el = document.getElementById("qada-stats");
      if (!el) return;
      el.innerHTML =
        "<div class=\"qada-stat\"><b>" + st.days + "</b><span>days logged</span></div>" +
        "<div class=\"qada-stat\"><b>" + st.done + "</b><span>farḍ checked</span></div>" +
        "<div class=\"qada-stat\"><b>" + Math.min(5, Math.round((st.done / Math.max(1, st.days * 5)) * 5)) + "/5</b><span>avg density</span></div>";
    }
    function paintPrayers() {
      var log = read();
      var k = currentKey();
      var row = log[k] || {};
      var box = document.getElementById("qada-prayers");
      var label = document.getElementById("qada-day-label");
      if (label) label.textContent = "Qaḍāʾ log for " + k + " — check each farḍ completed as make-up for that calendar day.";
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
          var log2 = read();
          var key = currentKey();
          if (!log2[key]) log2[key] = {};
          if (inp.checked) log2[key][id] = 1;
          else delete log2[key][id];
          if (!Object.keys(log2[key]).length) delete log2[key];
          write(log2);
          lab.classList.toggle("on", inp.checked);
          refreshStats();
        });
      });
      refreshStats();
    }

    function onYmChange() {
      fillDays(dSel, +ySel.value, +mSel.value, +dSel.value);
      paintPrayers();
    }
    ySel.onchange = onYmChange;
    mSel.onchange = onYmChange;
    dSel.onchange = paintPrayers;
    document.getElementById("qada-load-day").onclick = paintPrayers;

    document.getElementById("qada-mark-all").onclick = function () {
      var log = read();
      var k = currentKey();
      log[k] = { fajr: 1, dhuhr: 1, asr: 1, maghrib: 1, isha: 1 };
      write(log);
      paintPrayers();
    };
    document.getElementById("qada-clear-day").onclick = function () {
      var log = read();
      delete log[currentKey()];
      write(log);
      paintPrayers();
    };
    document.getElementById("qada-export").onclick = function () {
      var log = read();
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

    paintPrayers();
  }

  function boot() { try { mount(); } catch (e) {} }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 600); });
  else setTimeout(boot, 600);
  w.addEventListener("load", function () { setTimeout(boot, 1200); });
  var obs = new MutationObserver(function () {
    if (document.getElementById("cdl-qada-root") && !document.querySelector("#cdl-qada-root[data-ready='1']")) boot();
  });
  try { obs.observe(document.documentElement, { childList: true, subtree: true }); } catch (e) {}
  w.ClarityQada = { mount: mount, read: read };
})(typeof window !== "undefined" ? window : this);

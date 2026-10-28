/**
 * Day landing flow v3 · independent module
 * Ensures wuḍūʾ, qaḍāʾ calendar, footer copyright, logical order
 * Scoped only to #clarity-day-landing-room — no outside HTML dependency
 * Educational only — not a fatwa
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAY_FLOW_V3__) return;
  g.__CLARITY_DAY_FLOW_V3__ = true;

  var QADA_CAL = "clarity_qada_cal_v1";
  var QADA_CNT = "clarity_qada_counts_v1";

  function room() {
    return document.getElementById("clarity-day-landing-room");
  }
  function inner() {
    var r = room();
    return r ? r.querySelector(".day-room-inner") || r : null;
  }
  function unhide() {
    var r = room();
    if (!r) return;
    try {
      r.removeAttribute("hidden");
      r.hidden = false;
      if (document.documentElement.getAttribute("data-shell-mode") !== "companion") {
        r.style.setProperty("display", "block", "important");
        r.style.setProperty("visibility", "visible", "important");
        r.style.setProperty("opacity", "1", "important");
      }
    } catch (e) {}
  }

  function readCal() {
    try { return JSON.parse(localStorage.getItem(QADA_CAL) || "{}") || {}; } catch (e) { return {}; }
  }
  function writeCal(o) {
    try { localStorage.setItem(QADA_CAL, JSON.stringify(o)); } catch (e) {}
  }

  function ensureWudu() {
    var root = inner();
    if (!root) return;
    var wuduCard = document.getElementById("cdl-wudu-card");
    var hasSteps = document.querySelectorAll("#cdl-wudu-card li, #cdl-wudu-body li").length >= 6;
    if (wuduCard && hasSteps) {
      var b = document.getElementById("cdl-wudu-body");
      if (b) { b.hidden = false; b.removeAttribute("hidden"); }
      return;
    }
    var existing = document.getElementById("cdl-wudu-card");
    if (existing) existing.remove();
    var card = document.createElement("div");
    card.className = "cdl-card cdl-wudu-card";
    card.id = "cdl-wudu-card";
    card.setAttribute("data-day-slot", "wudu");
    card.innerHTML =
      '<div class="cdl-head"><h2>💧 Wuḍūʾ steps</h2></div>' +
      '<p class="cdl-sub">Educational outline · confirm with a local teacher · not a fatwa.</p>' +
      '<ol class="cdl-steps">' +
      "<li><strong>Intention &amp; Basmala</strong> — Intend wuḍūʾ; begin with Bismillāh.</li>" +
      "<li><strong>Hands</strong> — Wash both hands to the wrists three times.</li>" +
      "<li><strong>Mouth</strong> — Rinse the mouth three times.</li>" +
      "<li><strong>Nose</strong> — Sniff water and expel, three times.</li>" +
      "<li><strong>Face</strong> — Wash the face three times.</li>" +
      "<li><strong>Arms</strong> — To the elbows, right then left, three times.</li>" +
      "<li><strong>Head &amp; ears</strong> — Wipe the head once; wipe the ears.</li>" +
      "<li><strong>Feet</strong> — To the ankles, right then left, three times.</li>" +
      "</ol>" +
      '<p class="cdl-sub"><a href="https://sunnah.com/search?q=wudu" target="_blank" rel="noopener">Sunnah.com · wuḍūʾ</a></p>';
    root.appendChild(card);
  }

  function ensureQadaCalendar() {
    var root = inner();
    if (!root) return;
    var qadaCard = null;
    root.querySelectorAll(".cdl-card").forEach(function (c) {
      if (/Qaḍā|Qada/i.test(c.textContent || "")) qadaCard = c;
    });
    if (!qadaCard) {
      qadaCard = document.createElement("div");
      qadaCard.className = "cdl-card";
      qadaCard.id = "cdl-qada-card";
      qadaCard.setAttribute("data-day-slot", "qada");
      qadaCard.innerHTML =
        '<div class="cdl-head"><h2>🕌 Qaḍāʾ tracker</h2></div>' +
        '<p class="cdl-sub">Educational only — <strong>not a fatwa</strong>. Ask a local teacher for your case.</p>' +
        '<div class="cdl-qada-row">' +
        ["fajr", "dhuhr", "asr", "maghrib", "isha"]
          .map(function (k) {
            return "<label>" + k + ' <input type="number" min="0" data-qada="' + k + '" value="0"></label>';
          })
          .join("") +
        '<button type="button" class="cdl-btn" id="cdl-qada-save">Save</button></div>';
      root.appendChild(qadaCard);
      var save = qadaCard.querySelector("#cdl-qada-save");
      if (save) {
        save.addEventListener("click", function () {
          var o = {};
          try { o = JSON.parse(localStorage.getItem(QADA_CNT) || "{}") || {}; } catch (e) {}
          qadaCard.querySelectorAll("input[data-qada]").forEach(function (inp) {
            o[inp.getAttribute("data-qada")] = parseInt(inp.value, 10) || 0;
          });
          try { localStorage.setItem(QADA_CNT, JSON.stringify(o)); } catch (e) {}
          save.textContent = "Saved ✓";
          setTimeout(function () { save.textContent = "Save"; }, 1000);
        });
      }
    }
    var box = qadaCard.querySelector("#cdl-qada-calendar");
    if (!box) {
      box = document.createElement("div");
      box.id = "cdl-qada-calendar";
      box.className = "cdl-qada-cal";
      qadaCard.appendChild(box);
    }
    renderCal(box);
  }

  function renderCal(box) {
    if (!box) return;
    var now = new Date();
    var y = now.getFullYear(), m = now.getMonth();
    var first = new Date(y, m, 1);
    var startPad = first.getDay();
    var daysInMonth = new Date(y, m + 1, 0).getDate();
    var marks = readCal();
    var monthKey = y + "-" + String(m + 1).padStart(2, "0");
    var html =
      "<div class='cdl-qada-cal-head'><strong>" +
      first.toLocaleString(undefined, { month: "long", year: "numeric" }) +
      "</strong><span class='cdl-sub'> · tap a day to mark qaḍāʾ work · educational only</span></div>";
    html += "<div class='cdl-qada-cal-grid'>";
    ["S", "M", "T", "W", "T", "F", "S"].forEach(function (d) {
      html += "<span class='cdl-qada-dow'>" + d + "</span>";
    });
    for (var i = 0; i < startPad; i++) html += "<span class='cdl-qada-empty'></span>";
    for (var d = 1; d <= daysInMonth; d++) {
      var key = monthKey + "-" + String(d).padStart(2, "0");
      var on = !!marks[key];
      var isToday = d === now.getDate();
      html +=
        "<button type='button' class='cdl-qada-day" +
        (on ? " is-marked" : "") +
        (isToday ? " is-today" : "") +
        "' data-qada-day='" +
        key +
        "'>" +
        d +
        "</button>";
    }
    html += "</div>";
    var markedCount = Object.keys(marks).filter(function (k) { return marks[k]; }).length;
    html +=
      "<p class='cdl-sub cdl-qada-cal-foot'>Marked days on this device: " +
      markedCount +
      " · Not a fatwa · confirm makeup with a local teacher</p>";
    box.innerHTML = html;
    box.querySelectorAll("[data-qada-day]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var k = btn.getAttribute("data-qada-day");
        var o = readCal();
        if (o[k]) delete o[k];
        else o[k] = true;
        writeCal(o);
        renderCal(box);
      });
    });
  }

  function ensureFooter() {
    var root = inner();
    if (!root) return;
    var foot = document.getElementById("cdl-footer-plaque");
    if (!foot) {
      foot = document.createElement("div");
      foot.className = "cdl-footer-plaque";
      foot.id = "cdl-footer-plaque";
      foot.setAttribute("role", "contentinfo");
      foot.innerHTML =
        "<p><strong>© Clarity Dawah · Educational companion</strong></p>" +
        "<p>Furnish your grave · prepare for the long stay · not a fatwa · not legal advice</p>" +
        '<p><a href="https://quran.com" target="_blank" rel="noopener">Quran.com</a> · ' +
        '<a href="https://sunnah.com" target="_blank" rel="noopener">Sunnah.com</a> · ' +
        '<a href="/campus/">Campus</a></p>';
      root.appendChild(foot);
    }
    /* always last */
    root.appendChild(foot);
  }

  /** Logical daily flow order */
  var ORDER = [
    /dual-tiles|Companion path|University path/i,
    /cdl-verse|Today · Day landing|يَا أَيُّ/i,
    /Do this today/i,
    /Next ṣalāh|Next salah/i,
    /Adhkār|Adhkar/i,
    /Wuḍū|Wudu|cdl-wudu/i,
    /Prayer outline|ṣalāh steps|Salah steps/i,
    /Tasbeeh|Tasbih/i,
    /Soft streak|streak/i,
    /Qaḍā|Qada|cdl-qada/i,
    /Amānah Dayn|Dayn|Qard/i,
    /Vault note/i,
    /Send light ahead/i,
    /Remember the long stay/i,
    /Reward that may continue/i,
    /Qibla/i,
    /Core protection/i,
    /Auto review/i,
    /Built for trust|Sources in the open|Scholarly humility/i,
    /cdl-footer|© Clarity|Educational companion/i
  ];

  function score(el) {
    if (el.id === "cdl-footer-plaque" || /cdl-footer/i.test(el.className || "")) return 1000;
    var t = (el.id || "") + " " + (el.className || "") + " " + (el.textContent || "").slice(0, 140);
    for (var i = 0; i < ORDER.length; i++) {
      if (ORDER[i].test(t)) return i;
    }
    return 50;
  }

  function rearrange() {
    var root = inner();
    if (!root) return;
    /* verse plaque early */
    var verse = root.querySelector("#cdl-verse, .cdl-verse");
    var kids = Array.prototype.slice.call(root.children);
    if (kids.length < 2) return;
    kids.sort(function (a, b) {
      return score(a) - score(b);
    });
    kids.forEach(function (k) {
      root.appendChild(k);
    });
    root.setAttribute("data-day-flow", "v3");
    if (verse) {
      var paths = root.querySelector(".dual-tiles");
      if (paths && paths.nextSibling) root.insertBefore(verse, paths.nextSibling);
      else if (paths) root.appendChild(verse);
    }
  }

  function ensureFilled() {
    var r = room();
    if (!r) return;
    var inn = inner();
    if (inn && inn.children.length >= 5) return;
    try {
      r.removeAttribute("data-day-fortified");
      r.removeAttribute("data-room-filled");
      if (g.ClarityDayRoom && g.ClarityDayRoom.fill) g.ClarityDayRoom.fill();
    } catch (e) {}
  }

  function boot() {
    try {
      unhide();
      ensureFilled();
      ensureWudu();
      ensureQadaCalendar();
      ensureFooter();
      rearrange();
      ensureFooter(); /* footer last again after sort */
      unhide();
    } catch (e) {
      console.warn("[day-flow-v3]", e);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 400); });
  else setTimeout(boot, 400);
  document.addEventListener("clarity:day-room-ready", function () { setTimeout(boot, 100); });
  document.addEventListener("clarity:day-registry-scan", function () { setTimeout(boot, 150); });
  [900, 2000, 4500].forEach(function (ms) { setTimeout(boot, ms); });

  g.ClarityDayFlow = { boot: boot, version: 3 };
})(typeof window !== "undefined" ? window : this);

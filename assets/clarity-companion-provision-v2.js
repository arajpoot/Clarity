/**
 * Companion provision · 20261020FIX
 * Today card: salah icon + countdown | title + solar date | tasbih icon + count
 * Fixes mobile icon paint · local only · educational — not a fatwa
 */
(function (w) {
  "use strict";
  w.__CLARITY_COMPANION_PROVISION_V1__ = "20261020FIX";

  var KEY_CONT = "clarity_continue_v1";
  var KEY_PROV = "clarity_provision_day_v1";
  var KEY_TAS = "clarity_cph_tasbeeh_v1";

  var PROVISIONS = [
    { lane: "jariyah", text: "Do one small ongoing good: teach a useful thing, plant or water something living, or give a quiet ṣadaqah." },
    { lane: "knowledge", text: "Share one beneficial sentence from Qur’ān or Sunnah with sincerity — or learn one āyah with meaning." },
    { lane: "duʿāʾ", text: "Make duʿāʾ for your parents or a deceased relative; ask Allah to make you a source of ongoing good." },
    { lane: "rights", text: "Settle or note one right: a debt, a trust, or an apology you still owe." },
    { lane: "ṣalāh", text: "Pray the next ṣalāh on time with presence; say Bismillāh before your next ordinary task." },
    { lane: "character", text: "Guard the tongue for one hour: no mockery, no gossip; replace with istighfār." }
  ];

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function readJSON(k) {
    try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; }
  }
  function writeJSON(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }
  function hash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
    return h;
  }
  function todayProvision() {
    var day = todayKey();
    var saved = readJSON(KEY_PROV);
    if (saved && saved.day === day && saved.text) return saved;
    var idx = Math.abs(hash(day)) % PROVISIONS.length;
    var pick = PROVISIONS[idx];
    var out = { day: day, lane: pick.lane, text: pick.text };
    writeJSON(KEY_PROV, out);
    return out;
  }
  function tasState() {
    var day = todayKey();
    var s = readJSON(KEY_TAS) || {};
    if (s.day !== day) s = { day: day, count: 0 };
    return s;
  }
  function tasSave(s) { writeJSON(KEY_TAS, s); }

  function solarDateLabel() {
    try {
      return new Date().toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (e) {
      var d = new Date();
      return d.toDateString();
    }
  }

  function readNextSalah() {
    var map = {};
    var text = "";
    try {
      text = (document.getElementById("clarity-top-duo") || document.body).innerText || "";
    } catch (e) {}
    var re = /(Fajr|Sunrise|Dhuhr|Asr|Maghrib|Isha)\s*[:\s]*([0-2]?\d:[0-5]\d)/gi;
    var m;
    while ((m = re.exec(text))) {
      var key = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
      if (key === "Dhuhr" || m[1].toLowerCase() === "dhuhr") key = "Dhuhr";
      if (m[1].toLowerCase() === "isha") key = "Isha";
      map[key] = m[2];
    }
    var order = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    var now = new Date();
    var best = null;
    order.forEach(function (name) {
      var hm = map[name];
      if (!hm) return;
      var parts = hm.split(":");
      var dt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), +parts[0], +parts[1], 0);
      if (dt <= now) return;
      if (!best || dt < best.at) best = { name: name, at: dt, hm: hm };
    });
    if (!best && map.Fajr) {
      var p2 = map.Fajr.split(":");
      best = {
        name: "Fajr",
        at: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, +p2[0], +p2[1], 0),
        hm: map.Fajr
      };
    }
    return best;
  }

  function formatCountdown(target) {
    if (!target || !target.at) return "—";
    var ms = target.at - new Date();
    if (ms < 0) return "now";
    var s = Math.floor(ms / 1000);
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    if (h > 0) return h + "h " + m + "m";
    return m + "m " + sec + "s";
  }

  /* Large emoji + optional SVG — emoji always paints on mobile */
  function iconSalahHtml() {
    return (
      '<span class="cph-ico cph-ico-salah" aria-hidden="true">' +
      '<span class="cph-ico-emoji">🕌</span>' +
      '<svg class="cph-ico-svg" viewBox="0 0 24 24" width="28" height="28" focusable="false">' +
      '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 20h16M6 20V10l6-4 6 4v10M12 20v-6"/>' +
      '<circle cx="12" cy="8.2" r="1.5" fill="currentColor"/>' +
      "</svg></span>"
    );
  }
  function iconTasbihHtml() {
    return (
      '<span class="cph-ico cph-ico-tasbih" aria-hidden="true">' +
      '<span class="cph-ico-emoji">📿</span>' +
      '<svg class="cph-ico-svg" viewBox="0 0 24 24" width="28" height="28" focusable="false">' +
      '<g fill="none" stroke="currentColor" stroke-width="2">' +
      '<circle cx="12" cy="5" r="2"/><circle cx="7.5" cy="8.5" r="1.7"/><circle cx="16.5" cy="8.5" r="1.7"/>' +
      '<circle cx="6" cy="13" r="1.7"/><circle cx="18" cy="13" r="1.7"/>' +
      '<circle cx="8.5" cy="17.5" r="1.6"/><circle cx="15.5" cy="17.5" r="1.6"/>' +
      '<circle cx="12" cy="20.5" r="1.5"/>' +
      "</g></svg></span>"
    );
  }

  function buildHTML() {
    var prov = todayProvision();
    var cont = readJSON(KEY_CONT) || {};
    var contLabel =
      cont.path || cont.tab || cont.stage
        ? "Continue · " + (cont.label || cont.path || cont.tab || "where you left off")
        : "Open today’s path · Reminder";
    var tas = tasState();
    var next = readNextSalah();
    var nextLabel = next ? next.name + " · " + formatCountdown(next) : "Next ṣalāh · …";
    var solar = solarDateLabel();

    return (
      '<div class="cph-card cph-provision">' +
      '<div class="cph-headline-row">' +
      '<span class="cph-salah" id="cph-next-salah">' +
      iconSalahHtml() +
      '<span class="cph-salah-txt">' +
      nextLabel +
      "</span></span>" +
      '<div class="cph-title-block">' +
      '<h2 class="cph-title-center">Do this today</h2>' +
      '<p class="cph-solar-date" id="cph-solar-date">' +
      solar +
      "</p>" +
      '<p class="cph-period" id="cph-period">' +
      dayPeriodLabel() +
      "</p></div>" +
      '<span class="cph-tasbeeh" id="cph-tasbeeh-wrap">' +
      '<button type="button" class="cph-tas-btn" id="cph-tas-inc" aria-label="Tasbeeh +1">' +
      iconTasbihHtml() +
      "</button>" +
      '<span id="cph-tas-count" class="cph-tas-count">' +
      (tas.count || 0) +
      "</span>" +
      '<button type="button" class="cph-tas-btn ghost" id="cph-tas-reset" aria-label="Reset">↺</button>' +
      "</span></div>" +
      '<p class="cph-lane">' +
      (prov.lane || "provision") +
      "</p>" +
      "<p>" +
      prov.text +
      "</p>" +
      '<p class="cph-note">Toward ongoing good, beneficial knowledge, and a life that invites duʿāʾ — acceptance is with Allah.</p>' +
      "</div>" +
      '<div class="cph-row">' +
      '<a class="cph-btn" href="#reminder" data-cph-tab="reminder">' +
      contLabel +
      "</a>" +
      '<a class="cph-btn ghost" href="#action" data-cph-tab="action">Action drills</a>' +
      '<a class="cph-btn ghost" href="#notes" data-cph-tonight="1">Prepare tonight</a>' +
      "</div>" +
      '<div class="cph-row cph-drills">' +
      '<a class="cph-chip" href="#action" data-cph-tab="action" data-cph-scroll="meme-card">استوديو التبليغ</a>' +
      '<a class="cph-chip" href="#reminder" data-cph-tab="reminder" data-cph-scroll="tajweed-live-card">Tajweed</a>' +
      '<a class="cph-chip" href="#action" data-cph-tab="action" data-cph-scroll="callig-lab-card">Calligraphy</a>' +
      "</div>" +
      '<p class="cph-mirror">Streak is a mirror, not a scoreboard. Educational only — not a fatwa.</p>'
    );
  }

  function wire(wrap) {
    if (!wrap) return;
    wrap.querySelectorAll("[data-cph-tab]").forEach(function (a) {
      a.addEventListener("click", function (ev) {
        var tab = a.getAttribute("data-cph-tab");
        var sid = a.getAttribute("data-cph-scroll");
        if (tab && typeof w.switchTab === "function") {
          ev.preventDefault();
          w.switchTab(tab);
        }
        if (sid) {
          setTimeout(function () {
            var el = document.getElementById(sid);
            if (el) {
              el.removeAttribute("hidden");
              el.style.removeProperty("display");
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 220);
        }
      });
    });
    wrap.querySelectorAll("[data-cph-tonight]").forEach(function (a) {
      a.addEventListener("click", function (ev) {
        if (typeof w.switchTab === "function") {
          ev.preventDefault();
          w.switchTab("notes");
        }
        setTimeout(function () {
          var gate = document.getElementById("amana-vault-gate");
          if (gate) gate.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 220);
      });
    });
    var inc = wrap.querySelector("#cph-tas-inc");
    var reset = wrap.querySelector("#cph-tas-reset");
    var countEl = wrap.querySelector("#cph-tas-count");
    if (inc) {
      inc.addEventListener("click", function () {
        var s = tasState();
        s.count = (s.count || 0) + 1;
        tasSave(s);
        if (countEl) countEl.textContent = String(s.count);
      });
    }
    if (reset) {
      reset.addEventListener("click", function () {
        var s = { day: todayKey(), count: 0 };
        tasSave(s);
        if (countEl) countEl.textContent = "0";
      });
    }
  }

  function tickSalah() {
    var el = document.getElementById("cph-next-salah");
    if (!el) return;
    var next = readNextSalah();
    var txt = el.querySelector(".cph-salah-txt");
    var label = next ? next.name + " · " + formatCountdown(next) : "Next ṣalāh · …";
    if (txt) txt.textContent = label;
    else {
      /* keep icons, only update text node at end */
      var nodes = el.childNodes;
      var last = nodes[nodes.length - 1];
      if (last && last.nodeType === 3) last.textContent = " " + label;
    }
  }

  
  function dayPeriodLabel() {
    var now = new Date();
    var h = now.getHours();
    var period =
      h >= 4 && h < 12
        ? "Morning"
        : h >= 12 && h < 15
          ? "Afternoon"
          : h >= 15 && h < 18
            ? "Late afternoon"
            : h >= 18 && h < 20
              ? "Evening"
              : "Night";
    var clock;
    try {
      clock = now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    } catch (e) {
      var m = now.getMinutes();
      clock = now.getHours() + ":" + (m < 10 ? "0" : "") + m;
    }
    return period + " · " + clock;
  }

  function ensureSurface() {
    var host =
      document.getElementById("main-application-workspace") ||
      document.querySelector("main") ||
      document.body;
    var existing = document.getElementById("clarity-provision-home");
    if (existing) {
      existing.innerHTML = buildHTML();
      wire(existing);
      return;
    }
    var wrap = document.createElement("section");
    wrap.id = "clarity-provision-home";
    wrap.className = "clarity-provision-home";
    wrap.setAttribute("aria-label", "Today’s companion surface");
    wrap.innerHTML = buildHTML();
    /* PERF4b: always after .banner so calendar/salah stay on top */
    var banner = document.querySelector("#clarity-top-duo .banner, .banner");
    var after = null;
    if (banner) {
      after = banner;
      /* if banner is inside top-duo, insert after banner still inside parent */
      if (banner.parentNode) {
        if (banner.nextSibling) banner.parentNode.insertBefore(wrap, banner.nextSibling);
        else banner.parentNode.appendChild(wrap);
      } else {
        host.appendChild(wrap);
      }
    } else {
      after =
        document.getElementById("clarity-visit-pill-bar") ||
        document.getElementById("clarity-top-duo");
      if (after && after.parentNode) {
        if (after.nextSibling) after.parentNode.insertBefore(wrap, after.nextSibling);
        else after.parentNode.appendChild(wrap);
      } else {
        host.appendChild(wrap);
      }
    }
    wire(wrap);
  }

  function tagTabs() {
    var map = {
      reminder: "Reminder · āyah or ṣaḥīḥ + small deed",
      reality: "Reality · rights, janāzah literacy, death without despair",
      reflection: "Reflection · muḥāsabah of heart, tongue, hands",
      action: "Action · one drill only"
    };
    Object.keys(map).forEach(function (id) {
      var panel = document.getElementById("tab-" + id);
      if (!panel || panel.querySelector(".cph-tab-hint")) return;
      var hint = document.createElement("p");
      hint.className = "cph-tab-hint";
      hint.textContent = map[id];
      panel.insertBefore(hint, panel.firstChild);
    });
  }

  function boot() {
    try {
      ensureSurface();
      tagTabs();
      tickSalah();
    } catch (e) {
      try {
        console.warn("provision boot", e);
      } catch (e2) {}
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
  /* PERF4 removed stacked boot */
  setInterval(tickSalah, 1000);
  setInterval(function () {
    try {
      var el = document.getElementById("cph-period");
      if (el) el.textContent = dayPeriodLabel();
    } catch (e) {}
  }, 30000);
})(typeof window !== "undefined" ? window : this);

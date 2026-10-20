/**
 * Companion provision surface · 20261020DAY
 * Do this today + استوديو التبليغ chips + tasbeeh + next ṣalāh countdown
 * Local only · educational — not a fatwa
 */
(function (g) {
  "use strict";
  /* allow re-boot after label upgrades */
  g.__CLARITY_COMPANION_PROVISION_V1__ = "20261020NUR";

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

  /** Read next prayer from existing banner DOM if present */
  function readNextSalah() {
    var names = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
    var found = [];
    names.forEach(function (n) {
      var el =
        document.getElementById("salah-" + n.toLowerCase()) ||
        document.querySelector("[data-prayer='" + n.toLowerCase() + "']");
      /* banner list: look for text labels */
    });
    /* Parse salah panel rows: "Fajr 06:34" style */
    var panel = document.querySelector(".salah-times, #salah-panel, .banner-salah, [class*='salah']");
    var rows = document.querySelectorAll("#clarity-top-duo li, #clarity-top-duo .salah-row, .salah-box span, .salah-box div");
    var map = {};
    var text = (document.getElementById("clarity-top-duo") || document.body).innerText || "";
    var re = /(Fajr|Sunrise|Dhuhr|Asr|Maghrib|Isha)\s*[:\s]*([0-2]?\d:[0-5]\d)/gi;
    var m;
    while ((m = re.exec(text))) {
      map[m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase()] = m[2];
      if (m[1].toLowerCase() === "dhuhr") map.Dhuhr = m[2];
      if (m[1].toLowerCase() === "isha") map.Isha = m[2];
    }
    /* normalize keys */
    var order = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    var now = new Date();
    var best = null;
    order.forEach(function (name) {
      var hm = map[name];
      if (!hm) return;
      var p = hm.split(":");
      var dt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), +p[0], +p[1], 0);
      if (dt <= now) return;
      if (!best || dt < best.at) best = { name: name, at: dt, hm: hm };
    });
    if (!best) {
      /* next day Fajr */
      var f = map.Fajr;
      if (f) {
        var p2 = f.split(":");
        var dt2 = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, +p2[0], +p2[1], 0);
        best = { name: "Fajr", at: dt2, hm: f };
      }
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

    return (
      '<div class="cph-card cph-provision">' +
      '<div class="cph-headline-row">' +
      '<span class="cph-salah" id="cph-next-salah"><i class="nuros-icon nuros-icon-salah" aria-hidden="true"></i> ' + nextLabel + "</span>" +
      '<h2 class="cph-title-center">Do this today</h2>' +
      '<span class="cph-tasbeeh" id="cph-tasbeeh-wrap">' +
      '<button type="button" class="cph-tas-btn" id="cph-tas-inc" aria-label="Tasbeeh +1"><i class="nuros-icon nuros-icon-tasbih" aria-hidden="true"></i></button>' +
      '<span id="cph-tas-count">' + (tas.count || 0) + "</span>" +
      '<button type="button" class="cph-tas-btn ghost" id="cph-tas-reset" aria-label="Reset tasbeeh">↺</button>' +
      "</span></div>" +
      '<p class="cph-lane">' + (prov.lane || "provision") + "</p>" +
      "<p>" + prov.text + "</p>" +
      '<p class="cph-note">Toward ongoing good, beneficial knowledge, and a life that invites duʿāʾ — acceptance is with Allah.</p>' +
      "</div>" +
      '<div class="cph-row">' +
      '<a class="cph-btn" href="#reminder" data-cph-tab="reminder">' + contLabel + "</a>" +
      '<a class="cph-btn ghost" href="#action" data-cph-tab="action">Action drills</a>' +
      '<a class="cph-btn ghost" href="#notes" data-cph-tonight="1">Prepare tonight</a>' +
      "</div>" +
      '<div class="cph-row cph-drills">' +
      '<a class="cph-chip" href="#action" data-cph-tab="action" data-cph-scroll="meme-card">استوديو التبليغ</a>' +
      '<a class="cph-chip" href="#action" data-cph-tab="reminder" data-cph-scroll="tajweed-live-card">Tajweed</a>' +
      '<a class="cph-chip" href="#action" data-cph-tab="action" data-cph-scroll="callig-lab-card">Calligraphy</a>' +
      "</div>" +
      '<p class="cph-mirror">Streak is a mirror, not a scoreboard. Tablīgh · Tajweed · Calligraphy under Action. Educational only — not a fatwa.</p>'
    );
  }

  function wire(wrap) {
    wrap.querySelectorAll("[data-cph-tab]").forEach(function (a) {
      a.addEventListener("click", function (ev) {
        var tab = a.getAttribute("data-cph-tab");
        var sid = a.getAttribute("data-cph-scroll");
        if (tab && typeof g.switchTab === "function") {
          ev.preventDefault();
          g.switchTab(tab);
        }
        if (sid) {
          setTimeout(function () {
            var el = document.getElementById(sid);
            if (el) {
              el.style.removeProperty("display");
              el.removeAttribute("hidden");
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 200);
        }
      });
    });
    wrap.querySelectorAll("[data-cph-tonight]").forEach(function (a) {
      a.addEventListener("click", function (ev) {
        if (typeof g.switchTab === "function") {
          ev.preventDefault();
          g.switchTab("notes");
        }
        var gate = document.getElementById("amana-vault-gate");
        if (gate && gate.scrollIntoView) setTimeout(function () { gate.scrollIntoView({ behavior: "smooth", block: "start" }); }, 200);
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
    el.textContent = next ? next.name + " · " + formatCountdown(next) : "Next ṣalāh · …";
  }

  function ensureSurface() {
    var existing = document.getElementById("clarity-provision-home");
    var host =
      document.getElementById("main-application-workspace") ||
      document.querySelector("main") ||
      document.body;

    if (existing) {
      /* always refresh labels (kills fighter استوديو التبليغ chip) */
      existing.innerHTML = buildHTML();
      wire(existing);
      return;
    }

    var wrap = document.createElement("section");
    wrap.id = "clarity-provision-home";
    wrap.className = "clarity-provision-home";
    wrap.setAttribute("aria-label", "Today’s companion surface");
    wrap.innerHTML = buildHTML();

    var after =
      document.getElementById("clarity-visit-pill-bar") ||
      document.getElementById("clarity-top-duo");
    if (after && after.parentNode) {
      if (after.nextSibling) after.parentNode.insertBefore(wrap, after.nextSibling);
      else after.parentNode.appendChild(wrap);
    } else {
      host.insertBefore(wrap, host.firstChild);
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
    ensureSurface();
    tagTabs();
    tickSalah();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 800);
  setTimeout(boot, 2500);
  setInterval(tickSalah, 1000);
})(typeof window !== "undefined" ? window : this);

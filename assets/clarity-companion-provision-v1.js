/**
 * Companion provision surface · 20261020CH
 * Gate-on: next salah strip stays; add Today’s provision, Continue, Tonight link.
 * Tabs: Reminder · Reality · Reflection · Action as living cycle.
 * One streak language. Local only. Educational — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_COMPANION_PROVISION_V1__) return;
  g.__CLARITY_COMPANION_PROVISION_V1__ = true;

  var KEY_CONT = "clarity_continue_v1";
  var KEY_DRILL = "clarity_daily_drill_v1";
  var KEY_PROV = "clarity_provision_day_v1";

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
    try {
      return JSON.parse(localStorage.getItem(k) || "null");
    } catch (e) {
      return null;
    }
  }
  function writeJSON(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  }

  function todayProvision() {
    var day = todayKey();
    var saved = readJSON(KEY_PROV);
    if (saved && saved.day === day && saved.text) return saved;
    var idx = 0;
    try {
      idx = Math.abs(hash(day)) % PROVISIONS.length;
    } catch (e) {
      idx = day.length % PROVISIONS.length;
    }
    var pick = PROVISIONS[idx];
    var out = { day: day, lane: pick.lane, text: pick.text };
    writeJSON(KEY_PROV, out);
    return out;
  }

  function hash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
    return h;
  }

  function ensureSurface() {
    if (document.getElementById("clarity-provision-home")) return;
    var host =
      document.getElementById("main-application-workspace") ||
      document.querySelector("main") ||
      document.body;

    var prov = todayProvision();
    var cont = readJSON(KEY_CONT) || {};
    var contLabel =
      cont.path || cont.tab || cont.stage
        ? "Continue · " + (cont.label || cont.path || cont.tab || "where you left off")
        : "Open today’s path · Reminder";

    var wrap = document.createElement("section");
    wrap.id = "clarity-provision-home";
    wrap.className = "clarity-provision-home";
    wrap.setAttribute("aria-label", "Today’s companion surface");
    wrap.innerHTML =
      '<div class="cph-card cph-provision">' +
      "<h2>Do this today</h2>" +
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
      '<a class="cph-chip" href="#action" data-cph-tab="action" data-cph-scroll="tajweed-live-card">Tajweed</a>' +
      '<a class="cph-chip" href="#action" data-cph-tab="action" data-cph-scroll="callig-lab-card">Calligraphy</a>' +
      "</div>" +
      '<p class="cph-mirror">Streak is a mirror, not a scoreboard. Tablīgh · Tajweed · Calligraphy — tools at the foot of Action (daily &amp; daʿī). Educational only — not a fatwa.</p>';

    // insert after banner / visit pills if possible
    var after =
      document.getElementById("clarity-visit-pill-bar") ||
      document.getElementById("clarity-top-duo");
    if (after && after.parentNode) {
      if (after.nextSibling) after.parentNode.insertBefore(wrap, after.nextSibling);
      else after.parentNode.appendChild(wrap);
    } else {
      host.insertBefore(wrap, host.firstChild);
    }

    wrap.querySelectorAll("[data-cph-tab]").forEach(function (a) {
      a.addEventListener("click", function (ev) {
        var tab = a.getAttribute("data-cph-tab");
        if (tab && typeof g.switchTab === "function") {
          ev.preventDefault();
          g.switchTab(tab);
        }
      });
    });
    wrap.querySelectorAll("[data-cph-tonight]").forEach(function (a) {
      a.addEventListener("click", function (ev) {
        // Prefer notes/vault gate surface
        if (typeof g.switchTab === "function") {
          ev.preventDefault();
          g.switchTab("notes");
        }
        var gate = document.getElementById("amana-vault-gate") || document.querySelector(".amana-gate");
        if (gate && gate.scrollIntoView) gate.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
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

  function softHideSecondaryOnGate() {
    // Do not destroy — only collapse long lists when body has gate-on if class exists
    try {
      if (!document.body.classList.contains("gate-on") && !document.querySelector(".clarity-gate-switcher"))
        return;
    } catch (e) {}
  }

  function boot() {
    ensureSurface();
    tagTabs();
    softHideSecondaryOnGate();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  // late SPA paints
  setTimeout(boot, 1200);
})(typeof window !== "undefined" ? window : this);

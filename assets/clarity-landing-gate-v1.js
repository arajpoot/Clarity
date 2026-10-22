/**
 * Companion landing · four path doors + Stay · 20261022GATES
 * Skip-to-main replaced by choosing a learning gate.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LANDING_GATE_V1__ === "20261022GATES") return;
  w.__CLARITY_LANDING_GATE_V1__ = "20261022GATES";

  var KEY = "clarity_landing_gate_v1";

  var DOORS = [
    {
      id: "seeker",
      title: "Seeker · Wake the heart",
      goal: "Remember death. Send small light ahead. No overwhelm.",
      tag: "Soul audit · short reminders · seerah spark",
      ico: "🔭"
    },
    {
      id: "new_muslim",
      title: "New Muslim · Establish pillars",
      goal: "Wudu, salah, short surahs, clear belief — stability first.",
      tag: "Prayer · purification · basic fiqh · gentle path",
      ico: "🌱"
    },
    {
      id: "practicing",
      title: "Daily Muslim · Craft & consistency",
      goal: "Habits that outlive you: Qur’an craft, character, weekly review.",
      tag: "Tajweed · calligraphy · deed ledger · seerah mirror",
      ico: "📿"
    },
    {
      id: "dai",
      title: "Aspiring Da’i · Transmit light",
      goal: "Teach with adab. Guard sources. Leave beneficial knowledge.",
      tag: "Dawah tools · critical study · family legacy",
      ico: "🕊️"
    }
  ];

  function day() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function write(o) {
    try {
      localStorage.setItem(KEY, JSON.stringify(o));
    } catch (e) {}
  }

  function setMode(mode) {
    var root = document.documentElement;
    var body = document.body;
    root.classList.remove("clarity-landing-active", "clarity-landing-done", "clarity-main-active");
    if (body) {
      body.classList.remove("clarity-landing-active", "clarity-landing-done", "clarity-main-active");
    }
    if (mode === "landing") {
      root.classList.add("clarity-landing-active");
      if (body) body.classList.add("clarity-landing-active");
    } else {
      root.classList.add("clarity-landing-done", "clarity-main-active");
      if (body) body.classList.add("clarity-landing-done", "clarity-main-active");
    }
  }

  function resolveMode() {
    var q = w.location.search || "";
    if (/[?&]main=1(?:&|$)/.test(q) || /[?&]landing=0(?:&|$)/.test(q)) return "main";
    if (/[?&]landing=1(?:&|$)/.test(q)) return "landing";
    var s = read();
    if (s.skipDay === day()) return "main";
    if (s.stayDay === day()) return "landing";
    return "landing";
  }

  function removePill() {
    var pill = document.getElementById("clarity-landing-pill");
    if (pill) pill.remove();
  }

  function ensureDoors() {
    var host = document.getElementById("clarity-landing-doors");
    if (host) return host;

    host = document.createElement("section");
    host.id = "clarity-landing-doors";
    host.className = "clarity-landing-doors";
    host.setAttribute("aria-label", "Choose your learning path");

    var html =
      '<div class="cld-head">' +
      "<h2>Choose your path</h2>" +
      '<p class="cld-sub">Four doors. One aim: send light ahead. Educational only — not a fatwa. Stored on this device.</p>' +
      "</div>" +
      '<div class="cld-grid" role="group">';

    DOORS.forEach(function (d) {
      html +=
        '<button type="button" class="cld-door cld-door-' +
        d.id +
        '" data-gate="' +
        d.id +
        '">' +
        '<span class="cld-ico" aria-hidden="true">' +
        d.ico +
        "</span>" +
        '<span class="cld-title">' +
        d.title +
        "</span>" +
        '<span class="cld-goal">' +
        d.goal +
        "</span>" +
        '<span class="cld-tag">' +
        d.tag +
        "</span>" +
        "</button>";
    });

    html +=
      "</div>" +
      '<div class="cld-foot">' +
      '<button type="button" class="clp-btn" id="clp-stay">Stay on day surface</button>' +
      '<p class="cld-note">Stay keeps Today &amp; adhkār in focus. A path door opens the full Companion on that track.</p>' +
      "</div>";

    host.innerHTML = html;

    var after =
      document.getElementById("clarity-adhkar-daily") ||
      document.getElementById("clarity-provision-home");
    if (after && after.parentNode) {
      if (after.nextSibling) after.parentNode.insertBefore(host, after.nextSibling);
      else after.parentNode.appendChild(host);
    } else {
      document.body.appendChild(host);
    }

    host.querySelectorAll("[data-gate]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        enterGate(btn.getAttribute("data-gate"));
      });
    });
    var stay = document.getElementById("clp-stay");
    if (stay) {
      stay.onclick = function () {
        stayOnLanding();
      };
    }

    return host;
  }

  function applyTrack(gate) {
    gate = (gate || "seeker").toLowerCase();
    try {
      if (typeof w.clarityWelcomePickTrack === "function") {
        w.clarityWelcomePickTrack(gate);
        return;
      }
      if (typeof w.claritySwitchGate === "function") {
        w.claritySwitchGate(gate);
        return;
      }
      if (typeof w.clarityCommitGate === "function") {
        w.clarityCommitGate(gate);
        return;
      }
    } catch (e) {}
    try {
      localStorage.setItem("clarity_active_gate", gate);
      localStorage.setItem("clarity_welcome_track", gate);
    } catch (e2) {}
  }

  function enterGate(gate) {
    applyTrack(gate);
    var s = read();
    s.skipDay = day();
    s.lastGate = gate;
    write(s);
    setMode("main");
    removePill();
    hideDoors();
    ensureOpenDayBtn();
    try {
      if (typeof w.switchTab === "function") w.switchTab("reminder");
    } catch (e) {}
    try {
      w.dispatchEvent(
        new CustomEvent("clarity-landing-done", { detail: { reason: "gate", gate: gate } })
      );
    } catch (e2) {}
    try {
      w.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e3) {
      w.scrollTo(0, 0);
    }
  }

  function stayOnLanding() {
    var s = read();
    s.stayDay = day();
    if (s.skipDay === day()) delete s.skipDay;
    write(s);
    setMode("landing");
    ensureDoors();
  }

  function hideDoors() {
    var host = document.getElementById("clarity-landing-doors");
    if (host) host.style.display = "none";
  }

  function showDoors() {
    var host = ensureDoors();
    host.style.display = "";
  }

  function ensureOpenDayBtn() {
    if (document.getElementById("clarity-open-day-wrap")) return;
    var banner = document.querySelector("#clarity-top-duo .banner, .banner");
    var wrap = document.createElement("div");
    wrap.id = "clarity-open-day-wrap";
    wrap.className = "clarity-open-day-btn";
    wrap.innerHTML =
      '<button type="button" id="clarity-open-day-btn" title="Day surface &amp; path doors">☀ Day surface</button>';
    if (banner && banner.parentNode) {
      if (banner.nextSibling) banner.parentNode.insertBefore(wrap, banner.nextSibling);
      else banner.parentNode.appendChild(wrap);
    } else document.body.appendChild(wrap);
    document.getElementById("clarity-open-day-btn").onclick = function () {
      openLanding();
    };
  }

  function openLanding() {
    var s = read();
    s.stayDay = day();
    if (s.skipDay === day()) delete s.skipDay;
    write(s);
    setMode("landing");
    removePill();
    showDoors();
    try {
      w.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      w.scrollTo(0, 0);
    }
  }

  function boot() {
    var mode = resolveMode();
    setMode(mode);
    if (mode === "landing") {
      removePill(); /* no skip pill */
      showDoors();
    } else {
      hideDoors();
      ensureOpenDayBtn();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else boot();
  w.addEventListener("load", function () {
    if (document.documentElement.classList.contains("clarity-landing-active")) {
      showDoors();
    }
  });

  w.clarityLandingStay = stayOnLanding;
  w.clarityLandingSkip = function () {
    enterGate("seeker");
  };
  w.clarityOpenDaySurface = openLanding;
  w.clarityLandingEnterGate = enterGate;
})(typeof window !== "undefined" ? window : this);

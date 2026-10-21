/**
 * Companion daily landing · 20261021L2
 * Banner stays. Today + Adhkar + routine chips stay.
 * Everything below is dimmed until Stay / Skip / countdown ends.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LANDING_GATE_V1__ === "20261021L2") return;
  w.__CLARITY_LANDING_GATE_V1__ = "20261021L2";

  var KEY = "clarity_landing_gate_v1";
  var SEC = 12;
  var timer = null;
  var left = SEC;
  var active = false;

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

  function shouldShow() {
    var q = w.location.search || "";
    if (/[?&]landing=0(?:&|$)/.test(q)) return false;
    if (/[?&]landing=1(?:&|$)/.test(q)) return true;
    var s = read();
    if (s.stayDay === day() || s.skipDay === day()) return false;
    return true;
  }

  function exit(reason) {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    active = false;
    var s = read();
    if (reason === "stay") s.stayDay = day();
    else s.skipDay = day();
    write(s);
    document.documentElement.classList.remove("clarity-landing-active");
    document.body.classList.remove("clarity-landing-active");
    document.documentElement.classList.add("clarity-landing-done");
    var pill = document.getElementById("clarity-landing-pill");
    if (pill) pill.remove();
  }

  function ensurePill() {
    var pill = document.getElementById("clarity-landing-pill");
    if (pill) return pill;
    pill = document.createElement("div");
    pill.id = "clarity-landing-pill";
    pill.className = "clarity-landing-pill";
    pill.setAttribute("role", "dialog");
    pill.setAttribute("aria-label", "Continue to main Companion");
    pill.innerHTML =
      '<span class="clp-label">Opening main page in <strong id="clp-count">' +
      SEC +
      "</strong>s</span>" +
      '<div class="clp-actions">' +
      '<button type="button" class="clp-btn" id="clp-stay" type="button">Stay</button>' +
      '<button type="button" class="clp-btn primary" id="clp-skip">Skip to main</button>' +
      "</div>";
    document.body.appendChild(pill);
    document.getElementById("clp-stay").onclick = function () {
      exit("stay");
    };
    document.getElementById("clp-skip").onclick = function () {
      exit("skip");
    };
    return pill;
  }

  function tick() {
    var el = document.getElementById("clp-count");
    if (el) el.textContent = String(Math.max(0, left));
    if (left <= 0) {
      exit("auto");
      return;
    }
    left -= 1;
  }

  function start() {
    if (active) return true;
    if (!shouldShow()) {
      document.documentElement.classList.add("clarity-landing-done");
      return true;
    }
    var prov = document.getElementById("clarity-provision-home");
    if (!prov) return false;
    /* content may be injected async */
    if ((prov.innerHTML || "").length < 30) return false;

    active = true;
    document.documentElement.classList.add("clarity-landing-active");
    document.body.classList.add("clarity-landing-active");
    document.documentElement.classList.remove("clarity-landing-done");
    ensurePill();
    left = SEC;
    if (timer) clearInterval(timer);
    timer = setInterval(tick, 1000);
    tick();
    return true;
  }

  function schedule() {
    if (document.documentElement.classList.contains("clarity-landing-done") && !shouldShow())
      return;
    if (start()) return;
    var n = 0;
    var id = setInterval(function () {
      n++;
      if (start() || n > 40) clearInterval(id);
    }, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedule);
  } else schedule();
  w.addEventListener("load", function () {
    setTimeout(schedule, 300);
  });

  w.clarityLandingStay = function () {
    exit("stay");
  };
  w.clarityLandingSkip = function () {
    exit("skip");
  };
})(typeof window !== "undefined" ? window : this);

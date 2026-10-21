/**
 * Landing L5 · works with early head class · 20261021L5
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LANDING_GATE_V1__ === "20261021L5") return;
  w.__CLARITY_LANDING_GATE_V1__ = "20261021L5";

  var KEY = "clarity_landing_gate_v1";
  var SEC = 12;
  var timer = null;
  var left = SEC;

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

  function exit(reason) {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
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
    if (document.getElementById("clarity-landing-pill")) return;
    var pill = document.createElement("div");
    pill.id = "clarity-landing-pill";
    pill.className = "clarity-landing-pill";
    pill.innerHTML =
      '<span class="clp-label">Opening main page in <strong id="clp-count">' +
      SEC +
      "</strong>s</span>" +
      '<div class="clp-actions">' +
      '<button type="button" class="clp-btn" id="clp-stay">Stay</button>' +
      '<button type="button" class="clp-btn primary" id="clp-skip">Skip to main</button>' +
      "</div>";
    document.body.appendChild(pill);
    document.getElementById("clp-stay").onclick = function () {
      exit("stay");
    };
    document.getElementById("clp-skip").onclick = function () {
      exit("skip");
    };
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

  function run() {
    if (!document.documentElement.classList.contains("clarity-landing-active")) {
      if (!document.documentElement.classList.contains("clarity-landing-done")) {
        document.documentElement.classList.add("clarity-landing-done");
      }
      return;
    }
    document.body.classList.add("clarity-landing-active");
    ensurePill();
    left = SEC;
    if (timer) clearInterval(timer);
    timer = setInterval(tick, 1000);
    tick();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else run();
  w.addEventListener("load", function () {
    if (document.documentElement.classList.contains("clarity-landing-active") && !document.getElementById("clarity-landing-pill")) {
      run();
    }
  });
})(typeof window !== "undefined" ? window : this);

/**
 * Landing gate R3 · 20261021R
 * Under banner: Today + Adhkar as first surface
 * Stay / Skip / countdown · local day key
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LANDING_GATE_V1__ === "20261021R") return;
  w.__CLARITY_LANDING_GATE_V1__ = "20261021R";

  var KEY = "clarity_landing_gate_v1";
  var SEC = 12;

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
    if (/[?&]landing=1(?:&|$)/.test(w.location.search || "")) return true;
    if (/[?&]landing=0(?:&|$)/.test(w.location.search || "")) return false;
    var s = read();
    if (s.stayDay === day() || s.skipDay === day()) return false;
    return true;
  }

  function exit(reason) {
    var s = read();
    if (reason === "stay") s.stayDay = day();
    else s.skipDay = day();
    write(s);
    document.documentElement.classList.remove("clarity-landing-active");
    document.body.classList.remove("clarity-landing-active");
    document.documentElement.classList.add("clarity-landing-done");
    var pill = document.getElementById("clarity-landing-pill");
    if (pill) pill.remove();
    try {
      w.dispatchEvent(new CustomEvent("clarity-landing-done", { detail: { reason: reason } }));
    } catch (e) {}
  }

  function ensurePill() {
    var host = document.getElementById("clarity-provision-home");
    if (!host) return null;
    var pill = document.getElementById("clarity-landing-pill");
    if (pill) return pill;
    pill = document.createElement("div");
    pill.id = "clarity-landing-pill";
    pill.className = "clarity-landing-pill";
    pill.innerHTML =
      '<span class="clp-label">Main page in <strong id="clp-count">' +
      SEC +
      "</strong>s</span>" +
      '<div class="clp-actions">' +
      '<button type="button" class="clp-btn" id="clp-stay">Stay</button>' +
      '<button type="button" class="clp-btn primary" id="clp-skip">Skip to main</button>' +
      "</div>";
    host.appendChild(pill);
    return pill;
  }

  var timer = null;
  var left = SEC;

  function tick() {
    var el = document.getElementById("clp-count");
    if (el) el.textContent = String(Math.max(0, left));
    if (left <= 0) {
      if (timer) clearInterval(timer);
      exit("auto");
      return;
    }
    left -= 1;
  }

  function boot() {
    if (!shouldShow()) {
      document.documentElement.classList.add("clarity-landing-done");
      return;
    }
    var prov = document.getElementById("clarity-provision-home");
    if (!prov || !prov.innerHTML || prov.innerHTML.length < 40) return false;

    document.documentElement.classList.add("clarity-landing-active");
    document.body.classList.add("clarity-landing-active");
    ensurePill();
    var stay = document.getElementById("clp-stay");
    var skip = document.getElementById("clp-skip");
    if (stay)
      stay.onclick = function () {
        if (timer) clearInterval(timer);
        exit("stay");
      };
    if (skip)
      skip.onclick = function () {
        if (timer) clearInterval(timer);
        exit("skip");
      };
    left = SEC;
    if (timer) clearInterval(timer);
    timer = setInterval(tick, 1000);
    tick();
    return true;
  }

  function tryBoot() {
    if (document.documentElement.classList.contains("clarity-landing-done")) return;
    if (document.documentElement.classList.contains("clarity-landing-active")) return;
    boot();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(tryBoot, 600);
    });
  } else setTimeout(tryBoot, 600);
  setTimeout(tryBoot, 1200);
  setTimeout(tryBoot, 2200);
})(typeof window !== "undefined" ? window : this);

/**
 * Companion landing gate · 20261021LAND
 * One first surface: Do this today + Adhkār + daily routines
 * Auto-advance to main with Stay / Skip + countdown pill
 * Local only · educational — not a fatwa
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_LANDING_GATE_V1__) return;
  w.__CLARITY_LANDING_GATE_V1__ = "20261021LAND";

  var KEY = "clarity_landing_gate_v1";
  var DEFAULT_SEC = 12;

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null") || {};
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
    var s = read();
    /* once per local day unless user chose Stay */
    if (s.stayDay === todayKey()) return false;
    if (s.skipDay === todayKey() && s.force !== true) return false;
    return true;
  }

  function collectLandingNodes() {
    var nodes = [];
    var prov = document.getElementById("clarity-provision-home");
    var adh =
      document.getElementById("clarity-adhkar-daily") ||
      document.querySelector(".cph-adhkar, [data-adhkar-card]");
    var drills =
      document.querySelector(".cph-drills, .cph-row.cph-drills") ||
      document.querySelector("#clarity-provision-home .cph-drills");
    if (prov) nodes.push(prov);
    if (adh && adh !== prov && !prov?.contains(adh)) nodes.push(adh);
    return { prov: prov, adh: adh, drills: drills, nodes: nodes };
  }

  function ensurePill(root) {
    var pill = document.getElementById("clarity-landing-pill");
    if (pill) return pill;
    pill = document.createElement("div");
    pill.id = "clarity-landing-pill";
    pill.className = "clarity-landing-pill";
    pill.setAttribute("role", "region");
    pill.setAttribute("aria-label", "Continue to main page");
    pill.innerHTML =
      '<span class="clp-label">Opening main page in <strong id="clp-count">' +
      DEFAULT_SEC +
      "</strong>s</span>" +
      '<div class="clp-actions">' +
      '<button type="button" class="clp-btn" id="clp-stay">Stay</button>' +
      '<button type="button" class="clp-btn primary" id="clp-skip">Skip to main</button>' +
      "</div>";
    root.appendChild(pill);
    return pill;
  }

  function enterLanding() {
    document.documentElement.classList.add("clarity-landing-active");
    document.body.classList.add("clarity-landing-active");
    var host =
      document.getElementById("clarity-landing-host") ||
      (function () {
        var h = document.createElement("div");
        h.id = "clarity-landing-host";
        h.className = "clarity-landing-host";
        h.setAttribute("aria-label", "Daily landing");
        var banner = document.querySelector("#clarity-top-duo .banner, .banner");
        var parent = (banner && banner.parentNode) || document.body;
        if (banner && banner.nextSibling) parent.insertBefore(h, banner.nextSibling);
        else if (banner) parent.appendChild(h);
        else {
          var main =
            document.getElementById("main-application-workspace") || document.body;
          main.insertBefore(h, main.firstChild);
        }
        return h;
      })();

    var col = collectLandingNodes();
    col.nodes.forEach(function (n) {
      if (n && n.parentNode !== host) host.appendChild(n);
    });
    ensurePill(host);
    return host;
  }

  function exitLanding(reason) {
    var s = read();
    s.day = todayKey();
    if (reason === "stay") s.stayDay = todayKey();
    else s.skipDay = todayKey();
    write(s);

    document.documentElement.classList.remove("clarity-landing-active");
    document.body.classList.remove("clarity-landing-active");

    var host = document.getElementById("clarity-landing-host");
    var pill = document.getElementById("clarity-landing-pill");
    if (pill) pill.remove();

    /* move cards back below banner for normal browsing */
    var banner = document.querySelector("#clarity-top-duo .banner, .banner");
    var parent = (banner && banner.parentNode) || document.body;
    if (host) {
      while (host.firstChild) {
        var child = host.firstChild;
        if (banner && banner.parentNode === parent) {
          if (banner.nextSibling) parent.insertBefore(child, banner.nextSibling);
          else parent.appendChild(child);
        } else parent.appendChild(child);
      }
      host.remove();
    }

    /* reveal main chrome */
    document.documentElement.classList.add("clarity-landing-done");
    try {
      w.dispatchEvent(new CustomEvent("clarity-landing-done", { detail: { reason: reason } }));
    } catch (e) {}
  }

  var timer = null;
  var left = DEFAULT_SEC;

  function tick() {
    var el = document.getElementById("clp-count");
    if (el) el.textContent = String(left);
    if (left <= 0) {
      clearInterval(timer);
      timer = null;
      exitLanding("auto");
      return;
    }
    left -= 1;
  }

  function wirePill() {
    var stay = document.getElementById("clp-stay");
    var skip = document.getElementById("clp-skip");
    if (stay) {
      stay.onclick = function () {
        if (timer) clearInterval(timer);
        timer = null;
        exitLanding("stay");
      };
    }
    if (skip) {
      skip.onclick = function () {
        if (timer) clearInterval(timer);
        timer = null;
        exitLanding("skip");
      };
    }
  }

  function boot() {
    try {
      if (!shouldShow()) {
        document.documentElement.classList.add("clarity-landing-done");
        return;
      }
      enterLanding();
      wirePill();
      left = DEFAULT_SEC;
      if (timer) clearInterval(timer);
      timer = setInterval(tick, 1000);
      tick();
    } catch (e) {
      try {
        console.warn("landing gate", e);
      } catch (e2) {}
      document.documentElement.classList.add("clarity-landing-done");
    }
  }

  /* wait for provision paint */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(boot, 500);
    });
  } else setTimeout(boot, 500);
  setTimeout(function () {
    if (!document.documentElement.classList.contains("clarity-landing-done") &&
        !document.documentElement.classList.contains("clarity-landing-active")) {
      boot();
    }
  }, 1500);

  w.clarityLandingStay = function () {
    if (timer) clearInterval(timer);
    exitLanding("stay");
  };
  w.clarityLandingSkip = function () {
    if (timer) clearInterval(timer);
    exitLanding("skip");
  };
})(typeof window !== "undefined" ? window : this);

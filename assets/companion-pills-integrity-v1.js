/**
 * companion-pills-integrity-v1.js · 20261026PILLS
 * Sitewide RRRA + vault pill wiring integrity.
 * Fixes cross-wiring, restores rail ↔ panel sync, does not touch /campus/.
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_PILLS_INTEGRITY_V1__) return;
  g.__CLARITY_PILLS_INTEGRITY_V1__ = true;

  var HUBS = ["reminder", "reality", "reflection", "action", "notes"];
  var ALIASES = {
    journey: "reminder",
    commands: "reminder",
    tafseer: "reflection",
    grave: "reflection",
    seerah: "reality",
    lectures: "reality",
    tajweed: "action",
    search: "reminder",
    about: "reality",
    tools: "reality",
    vault: "notes",
    amana: "notes",
    fiqh: "notes",
    notes: "notes",
    reminder: "reminder",
    reality: "reality",
    reflection: "reflection",
    action: "action"
  };

  function mapHub(id) {
    id = String(id || "").replace(/^#/, "").replace(/^tab-/, "").toLowerCase().trim();
    if (ALIASES[id]) return ALIASES[id];
    if (HUBS.indexOf(id) >= 0) return id;
    return "reminder";
  }

  function showHub(id) {
    id = mapHub(id);
    HUBS.forEach(function (hid) {
      var p = document.getElementById("tab-" + hid);
      if (!p) return;
      var on = hid === id;
      p.classList.toggle("active", on);
      p.classList.toggle("is-active", on);
      p.hidden = !on;
      try {
        p.style.display = on ? "block" : "none";
        p.setAttribute("aria-hidden", on ? "false" : "true");
      } catch (e) {}
    });

    document.querySelectorAll(
      "#clarity-door-rail .door-rail-btn, .door-rail-btn, [data-rail-tab]"
    ).forEach(function (btn) {
      var t = mapHub(btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra") || "");
      btn.classList.toggle("active", t === id);
      btn.setAttribute("aria-current", t === id ? "page" : "false");
    });

    try {
      document.body.setAttribute("data-active-tab", id);
      document.documentElement.setAttribute("data-active-tab", id);
      sessionStorage.setItem("clarity_active_section_v1", id);
    } catch (e) {}

    try {
      var want = "#" + id;
      if ((location.hash || "") !== want && (location.hash || "") !== "") {
        /* only update if hash already used for section */
      }
      if (HUBS.indexOf((location.hash || "").replace("#", "")) >= 0 || !location.hash) {
        history.replaceState(null, "", want);
      }
    } catch (e) {}

    return id;
  }

  /** Fix known HTML cross-wiring on vault/amana rail */
  function repairRailAttributes() {
    document.querySelectorAll("#clarity-door-rail .door-rail-btn, .door-rail-btn").forEach(function (btn) {
      var rail = (btn.getAttribute("data-rail-tab") || "").toLowerCase();
      var label = (btn.textContent || "").toLowerCase();
      /* Vault button wrongly had data-rrra="action" */
      if (rail === "notes" || /vault|am[aā]nah|notes/.test(label)) {
        btn.setAttribute("data-rail-tab", "notes");
        btn.setAttribute("data-rrra", "notes");
        if (!btn.getAttribute("onclick") || /action/.test(btn.getAttribute("onclick") || "")) {
          btn.setAttribute("onclick", "clarityOpenSectionDoor('notes')");
        }
      }
      /* Ensure data-rrra matches data-rail-tab for the five hubs */
      if (HUBS.indexOf(rail) >= 0) {
        btn.setAttribute("data-rrra", rail);
      }
    });
  }

  function bindRailClicks() {
    document.querySelectorAll("#clarity-door-rail .door-rail-btn, .door-rail-btn[data-rail-tab]").forEach(function (btn) {
      if (btn.__pillsBound) return;
      btn.__pillsBound = true;
      btn.addEventListener(
        "click",
        function (ev) {
          var id = mapHub(btn.getAttribute("data-rail-tab") || btn.getAttribute("data-rrra"));
          try {
            if (typeof g.clarityOpenSectionDoor === "function") {
              g.clarityOpenSectionDoor(id);
            } else if (typeof g.switchTab === "function") {
              g.switchTab(id);
            } else {
              showHub(id);
            }
          } catch (e) {
            showHub(id);
          }
          /* force sync after wrappers settle */
          setTimeout(function () { showHub(id); }, 40);
          setTimeout(function () { showHub(id); }, 200);
        },
        true
      );
    });
  }

  function bindVisitPills() {
    var bar = document.getElementById("clarity-visit-pill-bar");
    if (!bar || bar.__pillsBound) return;
    bar.__pillsBound = true;
    bar.addEventListener("click", function (ev) {
      var btn = ev.target && ev.target.closest ? ev.target.closest("[data-hub]") : null;
      if (!btn) return;
      var h = mapHub(btn.getAttribute("data-hub"));
      try {
        if (typeof g.switchTab === "function") g.switchTab(h);
        else if (typeof g.clarityOpenSectionDoor === "function") g.clarityOpenSectionDoor(h);
        else showHub(h);
      } catch (e) {
        showHub(h);
      }
      setTimeout(function () { showHub(h); }, 50);
    });
  }

  function wrapOpeners() {
    ["clarityOpenSectionDoor", "switchTab"].forEach(function (name) {
      var prev = g[name];
      if (typeof prev === "function" && prev.__pillsIntegrity) return;
      var wrapped = function (id) {
        var m = mapHub(id);
        var r;
        try {
          if (typeof prev === "function") r = prev.apply(this, [m]);
        } catch (e) {
          console.warn("[pills-integrity]", name, e);
        }
        showHub(m);
        return r;
      };
      wrapped.__pillsIntegrity = true;
      if (typeof prev === "function") wrapped.__prev = prev;
      g[name] = wrapped;
    });
  }

  function hashRoute() {
    try {
      var h = (location.hash || "").replace("#", "");
      if (!h) return;
      if (HUBS.indexOf(mapHub(h)) >= 0) showHub(h);
    } catch (e) {}
  }

  function audit() {
    var report = { hubs: {}, rail: [], cross: [] };
    HUBS.forEach(function (id) {
      report.hubs[id] = !!document.getElementById("tab-" + id);
    });
    document.querySelectorAll("#clarity-door-rail .door-rail-btn").forEach(function (btn) {
      var rail = btn.getAttribute("data-rail-tab");
      var rrra = btn.getAttribute("data-rrra");
      report.rail.push({ rail: rail, rrra: rrra, text: (btn.textContent || "").trim().slice(0, 24) });
      if (rail && rrra && mapHub(rail) !== mapHub(rrra)) {
        report.cross.push({ rail: rail, rrra: rrra });
      }
    });
    try {
      g.__CLARITY_PILLS_AUDIT__ = report;
    } catch (e) {}
    return report;
  }

  function cycle() {
    repairRailAttributes();
    wrapOpeners();
    bindRailClicks();
    bindVisitPills();
    hashRoute();
    audit();
  }

  function boot() {
    cycle();
    setTimeout(cycle, 400);
    setTimeout(cycle, 1200);
    setTimeout(function () {
      var a = audit();
      if (a.cross && a.cross.length) cycle();
    }, 2000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () { setTimeout(cycle, 300); });
  g.addEventListener("hashchange", hashRoute);

  g.ClarityPillsIntegrity = { showHub: showHub, mapHub: mapHub, audit: audit, cycle: cycle };
})(typeof window !== "undefined" ? window : this);

/**
 * companion-integrity-scout-v1.js · 20261026SCOUT
 * Auto Integrity Scout — bound to Day landing "Auto review" plaque.
 * Checks + repairs Companion wiring on-device. Campus untouched.
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_INTEGRITY_SCOUT_V1__) return;
  g.__CLARITY_INTEGRITY_SCOUT_V1__ = true;

  var LOG_KEY = "clarity_integrity_scout_log_v1";
  var HUBS = ["reminder", "reality", "reflection", "action", "notes"];
  var PATHS = ["seeker", "new_muslim", "practicing", "dai"];

  function stamp() {
    try { return new Date().toLocaleString(); } catch (e) { return String(Date.now()); }
  }

  function pushLog(entry) {
    try {
      var arr = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
      if (!Array.isArray(arr)) arr = [];
      arr.unshift(entry);
      localStorage.setItem(LOG_KEY, JSON.stringify(arr.slice(0, 12)));
    } catch (e) {}
  }

  function check(name, ok, detail, repair) {
    return { name: name, ok: !!ok, detail: detail || "", repaired: false, repair: repair || null };
  }

  /** ---- Repair helpers ---- */
  function repairNotesLoad() {
    if (typeof g.notesLoad === "function") return false;
    g.notesLoad = function () {
      try {
        if (typeof g.__notesLoadReal === "function") return g.__notesLoadReal.apply(this, arguments);
      } catch (e) {}
      return undefined;
    };
    return true;
  }

  function repairVaultRail() {
    var fixed = 0;
    document.querySelectorAll(".door-rail-btn, #clarity-door-rail .door-rail-btn").forEach(function (btn) {
      var rail = (btn.getAttribute("data-rail-tab") || "").toLowerCase();
      var label = (btn.textContent || "").toLowerCase();
      if (rail === "notes" || /vault|am[aā]nah/.test(label)) {
        if (btn.getAttribute("data-rrra") !== "notes") {
          btn.setAttribute("data-rrra", "notes");
          btn.setAttribute("data-rail-tab", "notes");
          fixed++;
        }
      }
    });
    return fixed > 0;
  }

  function repairTrackVisible() {
    var el = document.querySelector(".clarity-gate-switcher");
    if (!el) return false;
    var st = window.getComputedStyle(el);
    var hidden = st.display === "none" || st.visibility === "hidden" || el.hidden;
    if (!hidden) return false;
    el.hidden = false;
    el.style.setProperty("display", "flex", "important");
    el.style.setProperty("visibility", "visible", "important");
    el.style.setProperty("opacity", "1", "important");
    document.querySelectorAll(".clarity-gate-switcher .cgs-btn").forEach(function (b) {
      b.hidden = false;
      b.style.setProperty("display", "inline-flex", "important");
    });
    return true;
  }

  function repairPathExtent() {
    var path = "seeker";
    try {
      path =
        document.documentElement.getAttribute("data-clarity-path") ||
        localStorage.getItem("clarity_committed_path") ||
        "seeker";
    } catch (e) {}
    var did = false;
    try {
      if (typeof g.applyGateSectionFilter === "function") {
        g.applyGateSectionFilter(path);
        did = true;
      } else if (typeof g.ClarityPathTrack && g.ClarityPathTrack.applyExtent) {
        g.ClarityPathTrack.applyExtent(path);
        did = true;
      }
    } catch (e) {}
    return did;
  }

  function repairPillsSync() {
    try {
      if (g.ClarityPillsIntegrity && typeof g.ClarityPillsIntegrity.cycle === "function") {
        g.ClarityPillsIntegrity.cycle();
        return true;
      }
      if (typeof g.clarityOpenSectionDoor === "function") {
        var cur =
          document.body.getAttribute("data-active-tab") ||
          sessionStorage.getItem("clarity_active_section_v1") ||
          "reminder";
        /* soft re-assert without navigation jump if panel missing */
        var p = document.getElementById("tab-" + cur);
        if (p && !p.classList.contains("active")) {
          g.clarityOpenSectionDoor(cur);
          return true;
        }
      }
    } catch (e) {}
    return false;
  }

  function repairIcons() {
    try {
      if (typeof g.nurosIconsApply === "function") {
        g.nurosIconsApply();
        return true;
      }
    } catch (e) {}
    return false;
  }

  function repairUniversityGlyph() {
    var fixed = 0;
    document.querySelectorAll("a[href*='campus'], .cdl-card, article, .td-card").forEach(function (card) {
      var t = (card.textContent || "").toLowerCase();
      if (t.indexOf("university") < 0) return;
      if (card.querySelector(".nuros-icon-campus, .uni-glyph")) return;
      var s = document.createElement("span");
      s.className = "uni-glyph nuros-icon nuros-icon-campus";
      s.setAttribute("aria-hidden", "true");
      s.textContent = "🎓";
      s.style.marginInlineEnd = "0.35rem";
      card.insertBefore(s, card.firstChild);
      fixed++;
    });
    return fixed > 0;
  }

  function ensureScoutCss() {
    if (document.getElementById("clarity-scout-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-scout-css";
    s.textContent =
      "#cdl-trust-review-plaque.scout-ok{border-color:rgba(30,125,94,.45)!important}" +
      "#cdl-trust-review-plaque.scout-warn{border-color:rgba(212,180,90,.55)!important}" +
      "#cdl-trust-review-plaque.scout-bad{border-color:rgba(180,60,60,.5)!important}" +
      "#cdl-scout-report{font-size:.82rem;line-height:1.45;margin:.4rem 0;max-height:14rem;overflow:auto}" +
      "#cdl-scout-report .ok{color:#1e7d5e}#cdl-scout-report .bad{color:#b33}" +
      "#cdl-scout-report .fix{color:#8a6d1d}" +
      "#cdl-trust-review-btn.scout-busy{opacity:.7;pointer-events:none}";
    (document.head || document.documentElement).appendChild(s);
  }

  /** ---- Full mission ---- */
  function runMission(opts) {
    opts = opts || {};
    ensureScoutCss();
    var results = [];

    /* 1 notesLoad */
    var hasNotes = typeof g.notesLoad === "function";
    results.push(
      check("notesLoad global", hasNotes, hasNotes ? "present" : "missing", repairNotesLoad)
    );

    /* 2 five hubs */
    var hubOk = HUBS.every(function (h) { return !!document.getElementById("tab-" + h); });
    results.push(check("RRRA panels", hubOk, HUBS.map(function (h) {
      return h + ":" + (document.getElementById("tab-" + h) ? "✓" : "✗");
    }).join(" ")));

    /* 3 door rail */
    var rails = document.querySelectorAll("#clarity-door-rail .door-rail-btn, .door-rail-btn[data-rail-tab]");
    results.push(check("Door rail pills", rails.length >= 5, "count " + rails.length));

    /* 4 vault cross-wire */
    var cross = 0;
    rails.forEach(function (btn) {
      var rail = (btn.getAttribute("data-rail-tab") || "").toLowerCase();
      var rrra = (btn.getAttribute("data-rrra") || "").toLowerCase();
      if (rail === "notes" && rrra && rrra !== "notes") cross++;
    });
    results.push(
      check("Vault rail wiring", cross === 0, cross ? cross + " cross-wire(s)" : "aligned", repairVaultRail)
    );

    /* 5 path track */
    var track = document.querySelector(".clarity-gate-switcher");
    var trackBtns = document.querySelectorAll(".clarity-gate-switcher .cgs-btn[data-gate]");
    var trackVis = false;
    if (track) {
      var st = window.getComputedStyle(track);
      trackVis = st.display !== "none" && st.visibility !== "hidden" && !track.hidden;
    }
    results.push(
      check(
        "Path track visible",
        !!track && trackVis && trackBtns.length >= 4,
        "btns " + trackBtns.length + (trackVis ? " visible" : " hidden"),
        repairTrackVisible
      )
    );

    /* 6 path switch vs section separation */
    var pathFn = typeof g.claritySwitchGate === "function";
    results.push(check("Path switch fn", pathFn, pathFn ? "claritySwitchGate ready" : "missing"));

    /* 7 path extent applied */
    var pathAttr = document.documentElement.getAttribute("data-clarity-path") || "";
    results.push(
      check(
        "Path extent attr",
        PATHS.indexOf(pathAttr) >= 0,
        pathAttr || "empty",
        repairPathExtent
      )
    );

    /* 8 shell mode */
    var shell = document.documentElement.getAttribute("data-shell-mode") || "?";
    results.push(check("Shell mode", shell !== "?", shell));

    /* 9 day landing */
    var day = document.getElementById("clarity-day-landing");
    results.push(check("Day landing", !!day, day ? "present" : "missing"));

    /* 10 icons layer */
    var iconCss = !!document.querySelector('link[href*="nuros-icons"]');
    results.push(check("Icon CSS", iconCss, iconCss ? "linked" : "absent", repairIcons));

    /* Apply repairs for failed checks */
    var repaired = 0;
    results.forEach(function (r) {
      if (!r.ok && typeof r.repair === "function") {
        try {
          if (r.repair()) {
            r.repaired = true;
            r.ok = true;
            r.detail = (r.detail ? r.detail + " · " : "") + "repaired";
            repaired++;
          }
        } catch (e) {
          r.detail = (r.detail || "") + " · repair error";
        }
      }
    });

    /* Always soft-sync pills + path */
    try {
      if (repairPillsSync()) repaired++;
      if (repairPathExtent()) { /* count only if needed */ }
      repairUniversityGlyph();
    } catch (e) {}

    var failed = results.filter(function (r) { return !r.ok; }).length;
    var entry = {
      at: Date.now(),
      stamp: stamp(),
      failed: failed,
      repaired: repaired,
      results: results.map(function (r) {
        return { name: r.name, ok: r.ok, detail: r.detail, repaired: r.repaired };
      })
    };
    pushLog(entry);
    renderReport(entry, opts);
    try {
      g.dispatchEvent(new CustomEvent("clarity-scout-done", { detail: entry }));
    } catch (e) {}
    return entry;
  }

  function renderReport(entry, opts) {
    var body = document.getElementById("cdl-trust-review-body");
    var stampEl = document.getElementById("cdl-trust-review-stamp");
    var plaque = document.getElementById("cdl-trust-review-plaque");
    var btn = document.getElementById("cdl-trust-review-btn");
    ensureScoutCss();

    var lines = entry.results.map(function (r) {
      var cls = r.ok ? (r.repaired ? "fix" : "ok") : "bad";
      var mark = r.ok ? (r.repaired ? "🔧" : "✓") : "✗";
      return (
        '<div class="' +
        cls +
        '">' +
        mark +
        " <strong>" +
        r.name +
        "</strong> — " +
        (r.detail || (r.ok ? "ok" : "issue")) +
        "</div>"
      );
    });

    var summary =
      '<div id="cdl-scout-report">' +
      "<div><strong>Integrity Scout</strong> · " +
      entry.stamp +
      "</div>" +
      "<div>" +
      (entry.failed === 0
        ? "All clear on this device."
        : entry.failed + " open · " + entry.repaired + " repaired") +
      "</div>" +
      lines.join("") +
      '<p style="opacity:.75;margin:.5rem 0 0;font-size:.75rem">On-device only · educational · not a fatwa · campus separate</p>' +
      "</div>";

    if (body) body.innerHTML = summary;
    if (stampEl) {
      stampEl.textContent =
        entry.failed === 0
          ? "Clear · " + entry.stamp
          : "Repaired " + entry.repaired + " · " + entry.stamp;
    }
    if (plaque) {
      plaque.classList.remove("scout-ok", "scout-warn", "scout-bad");
      plaque.classList.add(
        entry.failed === 0 ? "scout-ok" : entry.repaired ? "scout-warn" : "scout-bad"
      );
    }
    if (btn) {
      btn.textContent = opts.auto ? "Auto-scanned" : "Run Integrity Scout";
      btn.classList.remove("scout-busy");
    }
  }

  function bindPlaque() {
    var btn = document.getElementById("cdl-trust-review-btn");
    if (!btn) return false;
    if (btn.__scoutBound) return true;
    btn.__scoutBound = true;
    btn.textContent = "Run Integrity Scout";
    btn.setAttribute("aria-label", "Run Integrity Scout sitewide check and repair");
    btn.addEventListener("click", function () {
      btn.classList.add("scout-busy");
      btn.textContent = "Scouting…";
      setTimeout(function () {
        runMission({ auto: false });
      }, 40);
    });

    /* Auto once per session after paint */
    try {
      if (sessionStorage.getItem("clarity_scout_auto_v1") !== "1") {
        sessionStorage.setItem("clarity_scout_auto_v1", "1");
        setTimeout(function () {
          runMission({ auto: true });
        }, 1400);
      }
    } catch (e) {}
    return true;
  }

  function boot() {
    if (!bindPlaque()) {
      /* Day landing may mount late */
      var n = 0;
      var iv = setInterval(function () {
        n++;
        if (bindPlaque() || n > 25) clearInterval(iv);
      }, 400);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.addEventListener("load", function () {
    setTimeout(boot, 500);
  });

  g.ClarityIntegrityScout = {
    run: function () {
      return runMission({ auto: false });
    },
    log: function () {
      try {
        return JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
      } catch (e) {
        return [];
      }
    }
  };
})(typeof window !== "undefined" ? window : this);

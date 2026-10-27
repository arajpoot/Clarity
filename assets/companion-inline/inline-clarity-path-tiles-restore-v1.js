/**
 * Restore 4 path tiles — Path to furnish the grave
 * Seeker · New Muslim · Daily Muslim · Aspiring Da'i
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_PATH_TILES_RESTORE_V1__) return;
  g.__CLARITY_PATH_TILES_RESTORE_V1__ = true;

  var PHASES = [
    {
      id: "seeker",
      gate: "seeker",
      title: "Seeker · Wake the heart",
      goal: "Remember death. Send small light ahead. No overwhelm.",
      focus: "SOUL AUDIT · SHORT REMINDERS · SEERAH SPARK",
      ico: "🔭"
    },
    {
      id: "new_muslim",
      gate: "new_muslim",
      title: "New Muslim · Establish pillars",
      goal: "Wudu, salah, short surahs, clear belief — stability first.",
      focus: "PRAYER · PURIFICATION · BASIC FIQH · GENTLE PATH",
      ico: "🌱"
    },
    {
      id: "practicing",
      gate: "practicing",
      title: "Daily Muslim · Craft & consistency",
      goal: "Habits that outlive you: Qur'an craft, character, weekly review.",
      focus: "TAJWEED · CALLIGRAPHY · DEED LEDGER · SEERAH MIRROR",
      ico: "📿"
    },
    {
      id: "dai",
      gate: "dai",
      title: "Aspiring Da'i · Transmit light",
      goal: "Teach with adab. Guard sources. Leave beneficial knowledge.",
      focus: "DAWAH TOOLS · CRITICAL STUDY · FAMILY LEGACY",
      ico: "🕊️"
    }
  ];

  function ensureStrip() {
    var strip = document.getElementById("clarity-grave-path-strip");
    if (!strip) {
      strip = document.createElement("section");
      strip.id = "clarity-grave-path-strip";
      strip.className = "grave-path-strip path-to-grave";
      strip.setAttribute("aria-label", "Path to furnish the grave");
      // Insert: after companion return ribbon if present, else before main-content
      var ribbon = document.querySelector(".companion-return-ribbon, #clarity-shell-ribbon, [data-shell-ribbon]");
      var main = document.getElementById("main-content");
      var host = document.getElementById("main-application-workspace") || document.body;
      if (ribbon && ribbon.parentNode) {
        ribbon.parentNode.insertBefore(strip, ribbon.nextSibling);
      } else if (main && main.parentNode) {
        main.parentNode.insertBefore(strip, main);
      } else {
        host.insertBefore(strip, host.firstChild);
      }
    }
    return strip;
  }

  function currentGate() {
    try {
      return (
        document.documentElement.getAttribute("data-clarity-path") ||
        localStorage.getItem("clarity_committed_path") ||
        localStorage.getItem("clarity_gate") ||
        "seeker"
      );
    } catch (e) {
      return "seeker";
    }
  }

  function activate(gate) {
    try {
      if (typeof g.claritySwitchGate === "function") {
        g.claritySwitchGate(gate);
      } else {
        document.documentElement.setAttribute("data-clarity-path", gate);
        try {
          localStorage.setItem("clarity_committed_path", gate);
        } catch (e) {}
        document.dispatchEvent(
          new CustomEvent("clarity:path-change", { detail: { gate: gate } })
        );
      }
      paint();
    } catch (e) {}
  }

  function paint() {
    try {
      var mode = document.documentElement.getAttribute("data-shell-mode");
      // Show on companion primarily; also ok on landing if strip wanted
      var strip = ensureStrip();
      if (mode === "landing") {
        // keep strip available but don't force over dual paths
      }
      var active = currentGate();
      var html =
        '<div class="gps-head">' +
        '<h3 class="gps-title">Path to furnish the grave</h3>' +
        '<p class="gps-goal">Four doors. One aim: send light ahead — not a fatwa path.</p>' +
        "</div>" +
        '<div class="gps-phases" role="list">';
      PHASES.forEach(function (p) {
        var on = p.gate === active || p.id === active ? " is-active" : "";
        html +=
          '<button type="button" class="gps-phase' +
          on +
          '" role="listitem" data-gate="' +
          p.gate +
          '" data-phase="' +
          p.id +
          '">' +
          '<span class="gps-ico" aria-hidden="true">' +
          p.ico +
          "</span>" +
          '<span class="gps-phase-title">' +
          p.title +
          "</span>" +
          '<span class="gps-phase-goal">' +
          p.goal +
          "</span>" +
          '<span class="gps-phase-focus">' +
          p.focus +
          "</span>" +
          "</button>";
      });
      html += "</div>";
      strip.innerHTML = html;
      strip.style.setProperty("display", "block", "important");
      strip.style.setProperty("visibility", "visible", "important");
      strip.style.setProperty("opacity", "1", "important");
      strip.hidden = false;

      strip.querySelectorAll(".gps-phase").forEach(function (btn) {
        btn.addEventListener(
          "click",
          function () {
            activate(btn.getAttribute("data-gate"));
          },
          { passive: true }
        );
      });

      // Hide redundant TRACK pills when strip is live
      var gate = document.querySelector(".clarity-gate-switcher");
      if (gate && strip.querySelectorAll(".gps-phase").length >= 4) {
        gate.style.setProperty("display", "none", "important");
      }
    } catch (e) {
      console.warn("[Clarity path tiles]", e);
    }
  }

  function boot() {
    paint();
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
  [400, 1000, 2000, 3500].forEach(function (ms) {
    setTimeout(boot, ms);
  });
  document.addEventListener("clarity:companion-ready", boot);
  document.addEventListener("clarity:landing-ready", boot);
  try {
    new MutationObserver(function () {
      if (document.documentElement.getAttribute("data-shell-mode") === "companion")
        paint();
    }).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-shell-mode", "data-clarity-path"]
    });
  } catch (e) {}
})(typeof window !== "undefined" ? window : this);

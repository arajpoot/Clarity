/*! companion-final-repair-v1
 * Path pills bar · hard meme hide on Seeker/New Muslim · type/city polish
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_FINAL_REPAIR_V1__) return;
  w.__COMPANION_FINAL_REPAIR_V1__ = true;

  var ORDER = ["seeker", "new_muslim", "practicing", "dai"];
  var LABELS = {
    seeker: "1 Seeker",
    new_muslim: "2 New Muslim",
    practicing: "3 Daily",
    dai: "4 Da’i"
  };

  var ALLOW = {
    seeker: {
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "about-clarity-card": 1,
      "soul-compass-card": 1, "hell-sins-card": 1, "night-breath-card": 1, "seerah-live-card": 1,
      "creation-tongue-reflection": 1, "grave-path-card": 1
    },
    new_muslim: {
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "ilm-pathway-card": 1,
      "about-clarity-card": 1, "soul-compass-card": 1, "seerah-live-card": 1, "night-breath-card": 1,
      "hajj-guide-card": 1, "fiqh-quiz-card": 1, "grave-path-card": 1,
      "new-muslim-foundations-card": 1, "salah-starter-card": 1
    },
    practicing: {
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "ilm-pathway-card": 1,
      "about-clarity-card": 1, "soul-compass-card": 1, "seerah-live-card": 1, "hell-sins-card": 1,
      "night-breath-card": 1, "weekly-review-card": 1, "tajweed-live-card": 1, "tajweed-path-card": 1,
      "tj-deep-studio": 1, "tj-lmr-score-card": 1, "callig-lab-card": 1, "meme-card": 1,
      "tibbe-nabwi-card": 1, "seerah-mirror-card": 1, "najiha-tafseer-card": 1,
      "tafseer-resources-card": 1, "deepen-study-card": 1, "asma-names-lecture-card": 1,
      "creation-tongue-reflection": 1, "hajj-checklist-card": 1, "grave-path-card": 1,
      "daily-deed-ledger-card": 1
    },
    dai: {
      "commands-card": 1, "samina-verse-card": 1, "samina-card": 1, "ilm-pathway-card": 1,
      "about-clarity-card": 1, "soul-compass-card": 1, "seerah-live-card": 1, "hell-sins-card": 1,
      "night-breath-card": 1, "deepen-study-card": 1, "asma-names-lecture-card": 1,
      "tafseer-resources-card": 1, "creation-tongue-reflection": 1, "hajj-guide-card": 1,
      "hajj-checklist-card": 1, "fiqh-quiz-card": 1, "meme-card": 1, "callig-lab-card": 1,
      "tweet-desk-card": 1, "tajweed-live-card": 1, "tajweed-path-card": 1, "tj-deep-studio": 1,
      "weekly-review-card": 1, "grave-path-card": 1, "daily-deed-ledger-card": 1
    }
  };

  function gate() {
    try {
      var g =
        localStorage.getItem("clarity_path_override") ||
        localStorage.getItem("clarity_committed_path") ||
        "seeker";
      return ORDER.indexOf(g) >= 0 ? g : "seeker";
    } catch (e) {
      return "seeker";
    }
  }

  function maxUnlocked() {
    try {
      var n = parseInt(localStorage.getItem("clarity_path_unlocked_max") || "0", 10);
      return isNaN(n) ? 0 : Math.max(0, Math.min(3, n));
    } catch (e) {
      return 0;
    }
  }

  function hardHideMeme(g) {
    var hide = g === "seeker" || g === "new_muslim";
    var nodes = d.querySelectorAll(
      "#meme-card, .meme-card-realigned, #meme-studio-root, .card.meme-card-realigned, [id='meme-card']"
    );
    nodes.forEach(function (el) {
      if (hide) {
        el.classList.add("path-filtered-out");
        el.hidden = true;
        el.style.setProperty("display", "none", "important");
      } else if (ALLOW[g] && ALLOW[g]["meme-card"]) {
        el.classList.remove("path-filtered-out");
        el.hidden = false;
        el.style.removeProperty("display");
      }
    });
  }

  function applyPath(g) {
    g = ORDER.indexOf(g) >= 0 ? g : gate();
    d.documentElement.setAttribute("data-clarity-path", g);
    d.documentElement.setAttribute("data-path-filter", "selected-only");
    var allow = ALLOW[g] || ALLOW.seeker;
    d.querySelectorAll("[id$='-card'], #tj-deep-studio, #grave-path-card, #creation-tongue-reflection").forEach(function (el) {
      var id = el.id || "";
      if (!id) return;
      if (allow[id] === 1) {
        el.classList.remove("path-filtered-out");
        el.hidden = false;
        el.style.removeProperty("display");
      } else {
        el.classList.add("path-filtered-out");
        el.hidden = true;
        el.style.setProperty("display", "none", "important");
      }
    });
    hardHideMeme(g);
    paintPills(g);
  }

  function ensurePills() {
    var bar = d.getElementById("clarity-path-pills");
    if (bar) return bar;
    bar = d.createElement("div");
    bar.id = "clarity-path-pills";
    bar.setAttribute("role", "navigation");
    bar.setAttribute("aria-label", "Learning paths");
    var host =
      d.querySelector(".clarity-gate-switcher") ||
      d.querySelector("[data-path-track]") ||
      d.getElementById("commands-card");
    if (host && host.parentNode) {
      host.parentNode.insertBefore(bar, host);
    } else {
      var main = d.querySelector("main") || d.body;
      main.insertBefore(bar, main.firstChild);
    }
    d.documentElement.setAttribute("data-path-pills", "1");
    return bar;
  }

  function paintPills(current) {
    var bar = ensurePills();
    var max = maxUnlocked();
    current = current || gate();
    var html = '<span class="cpp-label">TRACK</span>';
    ORDER.forEach(function (g, i) {
      var locked = i > max;
      var active = g === current;
      html +=
        '<button type="button" class="cpp-pill' +
        (active ? " is-active" : "") +
        (locked ? " path-locked" : "") +
        '" data-gate="' +
        g +
        '">' +
        LABELS[g] +
        (locked ? " 🔒" : "") +
        "</button>";
    });
    html += '<button type="button" class="cpp-reset" id="cpp-reset">Reset</button>';
    bar.innerHTML = html;
    bar.querySelectorAll("button.cpp-pill").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var g = btn.getAttribute("data-gate");
        if (typeof w.clarityRequestPath === "function") w.clarityRequestPath(g);
        else {
          try {
            localStorage.setItem("clarity_path_override", g);
            localStorage.setItem("clarity_committed_path", g);
          } catch (e) {}
          applyPath(g);
        }
        setTimeout(function () {
          applyPath(g);
        }, 100);
        setTimeout(function () {
          applyPath(gate());
        }, 400);
      });
    });
    var reset = d.getElementById("cpp-reset");
    if (reset) {
      reset.onclick = function () {
        try {
          localStorage.setItem("clarity_path_unlocked_max", "0");
          localStorage.setItem("clarity_path_override", "seeker");
          localStorage.setItem("clarity_committed_path", "seeker");
        } catch (e) {}
        applyPath("seeker");
      };
    }
  }

  function installOverrides() {
    w.applyAdditiveFilter = function (g) {
      applyPath(g || gate());
    };
    w.applyGateSectionFilter = function (g) {
      applyPath(g || gate());
    };
  }

  function boot() {
    installOverrides();
    applyPath(gate());
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 100);
    setTimeout(boot, 500);
    setTimeout(boot, 1200);
  });
  setInterval(function () {
    installOverrides();
    hardHideMeme(gate());
    if (!d.getElementById("clarity-path-pills")) paintPills(gate());
  }, 2000);
})(window, document);

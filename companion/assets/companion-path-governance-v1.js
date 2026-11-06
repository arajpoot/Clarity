/*! companion-path-governance-v1
 * Single gardener for four-path module wiring.
 * Source of truth: clarity-path-progress ALLOW (window.ALLOW) when present.
 * - Selected path only (no additive leak)
 * - All live module cards mapped
 * - Vault cards stay suppressed on Companion (Amānah owns)
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_PATH_GOVERNANCE_V1__) return;
  w.__COMPANION_PATH_GOVERNANCE_V1__ = true;

  var ORDER = ["seeker", "new_muslim", "practicing", "dai"];
  var LABELS = {
    seeker: "1 Seeker",
    new_muslim: "2 New Muslim",
    practicing: "3 Daily",
    dai: "4 Da’i"
  };

  /* Fallback = path-progress governance (kept in sync with live ALLOW) */
  var ALLOW_FALLBACK = {
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
      "tj-lmr-score-card": 1, "weekly-review-card": 1, "tibbe-nabwi-card": 1, "seerah-mirror-card": 1,
      "najiha-tafseer-card": 1, "israeliyat-card": 1, "sealed-nectar-card": 1,
      "tajalliyat-lecture-card": 1, "tafseer-live-card": 1, "authentic-learning-stack": 1,
      "voice-translator-card": 1, "grave-path-card": 1, "daily-deed-ledger-card": 1,
      "dai-transmit-card": 1, "new-muslim-foundations-card": 1, "salah-starter-card": 1
    }
  };

  var VAULT = {
    "user-family-tree-card": 1, "faraid-card": 1, "wasiyyah-card": 1,
    "uft-cards-file": 1, "uft-build-from-cards": 1, "uft-card-search": 1,
    "uft-rel-card-search": 1, "uft-rel-cards": 1
  };

  function allowMap() {
    try {
      if (w.ALLOW && w.ALLOW.seeker && w.ALLOW.dai) return w.ALLOW;
    } catch (e) {}
    return ALLOW_FALLBACK;
  }

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

  function injectCss() {
    if (d.getElementById("path-gov-css")) return;
    var s = d.createElement("style");
    s.id = "path-gov-css";
    s.textContent = [
      ".path-filtered-out,.path-vault-suppressed{display:none!important;visibility:hidden!important;height:0!important;max-height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;border:none!important;}",
      "html[data-clarity-path=seeker] #meme-card,html[data-clarity-path=seeker] .meme-card-realigned,html[data-clarity-path=seeker] #meme-studio-root,",
      "html[data-clarity-path=new_muslim] #meme-card,html[data-clarity-path=new_muslim] .meme-card-realigned,html[data-clarity-path=new_muslim] #meme-studio-root",
      "{display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important;}",
      "#clarity-path-pills{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.4rem;max-width:42rem;margin:.65rem auto .85rem;padding:.45rem .55rem;border-radius:999px;border:1px solid rgba(212,180,90,.35);background:linear-gradient(180deg,rgba(18,40,32,.92),rgba(8,20,16,.96));}",
      "#clarity-path-pills .cpp-label{font-size:.68rem;font-weight:800;letter-spacing:.06em;color:#e8d5a3;}",
      "#clarity-path-pills button.cpp-pill{border-radius:999px;border:1px solid rgba(212,180,90,.35);background:rgba(0,0,0,.28);color:#eef6f0;font-size:.78rem;font-weight:700;padding:.35rem .75rem;cursor:pointer;}",
      "#clarity-path-pills button.cpp-pill.is-active{background:rgba(30,125,94,.55);border-color:rgba(180,240,200,.45);}",
      "#clarity-path-pills button.cpp-pill.path-locked{opacity:.55;}",
      "#clarity-path-pills button.cpp-reset{border-radius:999px;border:1px solid rgba(212,180,90,.4);background:rgba(180,140,40,.35);color:#fff8e0;font-size:.75rem;font-weight:700;padding:.35rem .7rem;cursor:pointer;}"
    ].join("");
    (d.head || d.documentElement).appendChild(s);
  }

  function setVisible(el, on) {
    if (!el) return;
    if (on) {
      el.classList.remove("path-filtered-out", "path-vault-suppressed");
      el.hidden = false;
      el.style.removeProperty("display");
      el.removeAttribute("aria-hidden");
    } else {
      el.classList.add("path-filtered-out");
      el.hidden = true;
      el.style.setProperty("display", "none", "important");
      el.setAttribute("aria-hidden", "true");
    }
  }

  function apply(g) {
    injectCss();
    g = ORDER.indexOf(g) >= 0 ? g : gate();
    var ALLOW = allowMap();
    var allow = ALLOW[g] || ALLOW.seeker || {};
    d.documentElement.setAttribute("data-clarity-path", g);
    d.documentElement.setAttribute("data-path-filter", "governance-selected");
    d.documentElement.setAttribute("data-path-gov", "v1");

    var nodes = d.querySelectorAll(
      "[id$='-card'], #tj-deep-studio, #grave-path-card, #creation-tongue-reflection, #authentic-learning-stack, #meme-studio-root, .meme-card-realigned"
    );
    nodes.forEach(function (el) {
      var id = el.id || "";
      if (!id && el.classList.contains("meme-card-realigned")) id = "meme-card";
      if (!id) return;
      if (VAULT[id]) {
        el.classList.add("path-vault-suppressed");
        setVisible(el, false);
        return;
      }
      /* meme studio root follows meme-card */
      if (id === "meme-studio-root") {
        setVisible(el, !!allow["meme-card"]);
        return;
      }
      setVisible(el, allow[id] === 1);
    });

    /* Explicit meme hard rule */
    if (g === "seeker" || g === "new_muslim") {
      d.querySelectorAll("#meme-card, .meme-card-realigned, #meme-studio-root").forEach(function (el) {
        setVisible(el, false);
      });
    }

    paintPills(g);
  }

  function ensurePills() {
    var bar = d.getElementById("clarity-path-pills");
    if (bar) return bar;
    bar = d.createElement("div");
    bar.id = "clarity-path-pills";
    bar.setAttribute("role", "navigation");
    bar.setAttribute("aria-label", "Learning paths");
    var host = d.querySelector(".clarity-gate-switcher") || d.getElementById("commands-card");
    if (host && host.parentNode) host.parentNode.insertBefore(bar, host);
    else (d.querySelector("main") || d.body).appendChild(bar);
    return bar;
  }

  function paintPills(current) {
    var bar = ensurePills();
    var max = maxUnlocked();
    current = current || gate();
    var html = '<span class="cpp-label">TRACK</span>';
    ORDER.forEach(function (g, i) {
      html +=
        '<button type="button" class="cpp-pill' +
        (g === current ? " is-active" : "") +
        (i > max ? " path-locked" : "") +
        '" data-gate="' +
        g +
        '">' +
        LABELS[g] +
        (i > max ? " 🔒" : "") +
        "</button>";
    });
    html += '<button type="button" class="cpp-reset" id="cpp-reset-gov">Reset</button>';
    bar.innerHTML = html;
    bar.querySelectorAll("button.cpp-pill").forEach(function (btn) {
      btn.onclick = function () {
        var g = btn.getAttribute("data-gate");
        if (typeof w.clarityRequestPath === "function") w.clarityRequestPath(g);
        else {
          try {
            localStorage.setItem("clarity_path_override", g);
            localStorage.setItem("clarity_committed_path", g);
          } catch (e) {}
        }
        setTimeout(function () { apply(g); }, 50);
        setTimeout(function () { apply(gate()); }, 300);
      };
    });
    var reset = d.getElementById("cpp-reset-gov");
    if (reset) {
      reset.onclick = function () {
        try {
          localStorage.setItem("clarity_path_unlocked_max", "0");
          localStorage.setItem("clarity_path_override", "seeker");
          localStorage.setItem("clarity_committed_path", "seeker");
        } catch (e) {}
        apply("seeker");
      };
    }
  }

  function install() {
    w.applyAdditiveFilter = function (g) { apply(g || gate()); };
    w.applyGateSectionFilter = function (g) { apply(g || gate()); };
    var prev = w.clarityRequestPath;
    if (typeof prev === "function" && !prev.__gov) {
      w.clarityRequestPath = function (g) {
        var r = prev.apply(this, arguments);
        setTimeout(function () { apply(g || gate()); }, 40);
        setTimeout(function () { apply(gate()); }, 250);
        setTimeout(function () { apply(gate()); }, 700);
        return r;
      };
      w.clarityRequestPath.__gov = true;
    }
  }

  function boot() {
    install();
    apply(gate());
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 100);
    setTimeout(boot, 600);
    setTimeout(boot, 1500);
  });
  setInterval(function () {
    install();
    apply(gate());
  }, 2500);

  w.ClarityPathGovernance = {
    version: "v1",
    apply: apply,
    current: gate,
    allow: allowMap,
    order: ORDER
  };
})(window, document);

/**
 * U2 Module completion contract + Lab inject
 * Phase rooms only. Companion untouched. Educational only.
 */
(function (g) {
  "use strict";
  if (g.__CU_MODULE_LAB_INJECT_V1__) return;
  g.__CU_MODULE_LAB_INJECT_V1__ = true;


  function safeHref(h, fallback) {
    if (h == null || h === "" || h !== h /* NaN */) return fallback || "/lab/";
    h = String(h);
    if (h.indexOf("NaN") >= 0 || h.indexOf("undefined") >= 0) return fallback || "/lab/";
    if (h.charAt(0) !== "/" && h.indexOf("http") !== 0) return fallback || "/lab/";
    return h;
  }
  function safeLabel(s, fallback) {
    if (s == null || s !== s) return fallback || "Open";
    s = String(s);
    if (!s.trim() || s.indexOf("NaN") >= 0) return fallback || "Open";
    return s;
  }

  var STATION = {
    media: { href: "/lab/media/", label: "Lab · Media" },
    tajweed: { href: "/lab/recite/", label: "Lab · Recite (tajweed practice)" },
    callig: { href: "/lab/calligraphy/", label: "Lab · Calligraphy" },
    calligraphy: { href: "/lab/calligraphy/", label: "Lab · Calligraphy" },
    arabic: { href: "/lab/arabic/?deck=everyday", label: "Lab · Arabic flash" },
    recite: { href: "/lab/recite/", label: "Lab · Recite" },
    hifz: { href: "/lab/hifz/", label: "Lab · Hifz" }
  };

  var PHASE = {
    seeker: {
      labHref: "/lab/arabic/?deck=everyday",
      labLabel: "Lab · Arabic flash",
      libHref: "/library/#aqidah",
      libLabel: "Library · ʿAqīdah shelf",
      practiceHint: "Write one honest line: what changes if Allah is One?"
    },
    practice: {
      labHref: "/lab/recite/",
      labLabel: "Lab · Recite (tajweed practice)",
      labHref2: "/lab/arabic/?deck=salah",
      labLabel2: "Arabic · ṣalāh words",
      libHref: "/library/#fiqh",
      libLabel: "Library · Fiqh shelf",
      practiceHint: "Practise one rule or one short āyah with presence."
    },
    consistency: {
      labHref: "/lab/recite/",
      labLabel: "Lab · Recite",
      labHref2: "/lab/arabic/?deck=stems",
      labLabel2: "Arabic · stems",
      libHref: "/library/#quran",
      libLabel: "Library · Qurʾān shelf",
      practiceHint: "Repeat a small portion you can keep tomorrow."
    },
    transmission: {
      labHref: "/lab/media/",
      labLabel: "Lab · Media (source-checked)",
      libHref: "/library/#hadith",
      libLabel: "Library · Hadith shelf",
      practiceHint: "Share only with a clear source — or do not share yet."
    }
  };

  function room() {
    return (document.body && document.body.getAttribute("data-phase-room")) || "";
  }

  function rewriteLabChips(root) {
    root = root || document;
    root.querySelectorAll('a[href*="/lab"]').forEach(function (a) {
      var href = a.getAttribute("href") || "";
      var st = a.getAttribute("data-lab-station") || "";
      var m = href.match(/[?&]station=([a-z]+)/i);
      if (m) st = m[1];
      if (st && STATION[st]) {
        a.setAttribute("href", STATION[st].href);
        if (!(a.textContent || "").trim()) a.textContent = STATION[st].label;
      }
      if (href.indexOf("/lab/?station=") === 0 || href.indexOf("/lab?station=") === 0) {
        var s = (href.split("station=")[1] || "").split("&")[0];
        if (STATION[s]) a.setAttribute("href", STATION[s].href);
      }
    });
  }

  function contractHtml(cfg) {
    var extra = "";
    if (cfg.labHref2) {
      extra =
        '<a class="cu-contract-chip" href="' +
        safeHref(cfg.labHref2, "/lab/") +
        '">' +
        cfg.labLabel2 +
        "</a>";
    }
    return (
      '<div class="cu-contract">' +
      '<p class="cu-contract-kicker">After this module · completion contract</p>' +
      '<ol class="cu-contract-steps">' +
      "<li><strong>Understood?</strong> Pause until the idea is clear — not rushed.</li>" +
      "<li><strong>One practice:</strong> " +
      (cfg.practiceHint || "One small honest act.") +
      "</li>" +
      "<li><strong>Lab:</strong> skill the hands and tongue.</li>" +
      "<li><strong>Library (optional):</strong> pin a primary source. <a href=\"/vault/#locker\">Vault locker</a>.</li>" +
      "</ol>" +
      '<div class="cu-contract-row">' +
      '<a class="cu-contract-chip primary" href="' +
      safeHref(cfg.labHref, "/lab/") +
      '">' +
      cfg.labLabel +
      "</a>" +
      extra +
      '<a class="cu-contract-chip ghost" href="' +
      safeHref(cfg.libHref, "/library/") +
      '">' +
      cfg.libLabel +
      "</a>" +
      '<a class="cu-contract-chip ghost" href="/lab/">All Lab stations</a>' +
      "</div>" +
      '<p class="cu-contract-note">Educational only — not a fatwa. The tick is practice on this device, not a witness.</p>' +
      "</div>"
    );
  }

  function injectContracts() {
    var r = room();
    var cfg = PHASE[r];
    if (!cfg) return;

    var candidates = document.querySelectorAll(
      ".junior-lesson, .junior-module, .cu-module, [data-module], .mv-lesson, article.lesson"
    );
    if (!candidates.length) {
      candidates = document.querySelectorAll(".junior-practice");
    }
    /* If curriculum uses nested practice, attach to parent module-like node */
    var hosts = [];
    candidates.forEach(function (node) {
      var host = node.classList.contains("junior-practice") ? node.parentElement : node;
      if (host && hosts.indexOf(host) < 0) hosts.push(host);
    });
    if (!hosts.length) {
      var stage = document.getElementById("cu-stage");
      if (stage && !stage.querySelector(".cu-contract")) {
        var wrap = document.createElement("div");
        wrap.className = "cu-contract-mount";
        wrap.innerHTML = contractHtml(cfg);
        stage.appendChild(wrap);
      }
      return;
    }
    hosts.forEach(function (host) {
      if (!host || host.querySelector(".cu-contract")) return;
      var bar = document.createElement("div");
      bar.innerHTML = contractHtml(cfg);
      host.appendChild(bar.firstChild);
    });
  }

  function injectStyles() {
    if (document.getElementById("cu-contract-css")) return;
    var s = document.createElement("style");
    s.id = "cu-contract-css";
    s.textContent =
      ".cu-contract{margin:.75rem 0 .35rem;padding:.85rem .9rem;border-radius:14px;border:1px solid rgba(184,166,135,.4);background:rgba(30,125,94,.1)}" +
      ".cu-contract-kicker{margin:0 0 .4rem;font-size:.7rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#d4b45a}" +
      ".cu-contract-steps{margin:.2rem 0 .55rem 1.1rem;font-size:.86rem;line-height:1.45}" +
      ".cu-contract-steps li{margin:.2rem 0}" +
      ".cu-contract-row{display:flex;flex-wrap:wrap;gap:.35rem}" +
      ".cu-contract-chip{display:inline-flex;align-items:center;padding:.4rem .75rem;border-radius:999px;font-size:.76rem;font-weight:700;text-decoration:none;color:inherit;border:1px solid rgba(184,166,135,.4)}" +
      ".cu-contract-chip.primary{background:#1e7d5e;color:#fff!important;border-color:#1e7d5e}" +
      ".cu-contract-chip.ghost{background:transparent}" +
      ".cu-contract-note{margin:.45rem 0 0;font-size:.72rem;opacity:.8}";
    document.head.appendChild(s);
  }

  function run() {
    if ((location.pathname || "").indexOf("/campus/desk/") < 0) return;
    injectStyles();
    rewriteLabChips(document);
    injectContracts();
  }

  function observe() {
    run();
    var main = document.querySelector("main") || document.body;
    if (!main || typeof MutationObserver === "undefined") return;
    var t = null;
    var obs = new MutationObserver(function () {
      if (t) clearTimeout(t);
      t = setTimeout(run, 220);
    });
    obs.observe(main, { childList: true, subtree: true });
  }


  /* U-B: stronger handoff strip when phase room stage is live */
  function paintLabHandoffStrip() {
    try {
      var stage = document.getElementById("cu-stage");
      if (!stage) return;
      if (document.getElementById("cu-ub-lab-handoff")) return;
      var phase = (document.body && document.body.getAttribute("data-phase-room")) || "seeker";
      var conf = PHASE[phase] || PHASE.seeker;
      var strip = document.createElement("div");
      strip.id = "cu-ub-lab-handoff";
      strip.className = "cu-plaque";
      strip.setAttribute("style", "margin:0.75rem 0;padding:0.75rem 0.9rem;border:1px solid rgba(15,76,58,0.25);border-radius:12px;background:rgba(15,76,58,0.06)");
      strip.innerHTML =
        "<strong>After this module · skill in the Lab</strong>" +
        "<p style=\"margin:0.35rem 0 0.55rem;font-size:0.88rem;opacity:0.9\">Desk teaches. Lab practices. One short station — no second streak.</p>" +
        "<div class=\"cu-row\" style=\"flex-wrap:wrap;gap:0.4rem\">" +
        "<a class=\"cu-main-link\" href=\"" + (safeHref(conf.labHref, "/lab/")) + "\">" + (conf.labLabel || "Open Lab") + "</a>" +
        (safeHref(conf.labHref2, "")
          ? "<a href=\"" + safeHref(conf.labHref2, "") + "\">" + (conf.labLabel2 || "More lab") + "</a>"
          : "") +
        (conf.libHref
          ? "<a href=\"" + conf.libHref + "\">" + (conf.libLabel || "Library") + "</a>"
          : "") +
        "<a href=\"/campus/buddy/\">Ask Buddy</a>" +
        "</div>" +
        (conf.practiceHint
          ? "<p style=\"margin:0.5rem 0 0;font-size:0.82rem;opacity:0.85\">" + conf.practiceHint + "</p>"
          : "");
      stage.parentNode.insertBefore(strip, stage.nextSibling);
    } catch (e) {}
  }

  var _runOrig = run;
  run = function () {
    _runOrig();
    paintLabHandoffStrip();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", observe);
  else observe();
  setTimeout(run, 600);
  setTimeout(run, 1800);
})(typeof window !== "undefined" ? window : this);

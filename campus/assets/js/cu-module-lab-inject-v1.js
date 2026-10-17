/**
 * U2 Module completion contract + Lab inject
 * Phase rooms only. Companion untouched. Educational only.
 */
(function (g) {
  "use strict";
  if (g.__CU_MODULE_LAB_INJECT_V1__) return;
  g.__CU_MODULE_LAB_INJECT_V1__ = true;

  var STATION = {
    media: { href: "/lab/media/", label: "Lab · Media" },
    tajweed: { href: "/lab/tajweed/", label: "Lab · Tajweed" },
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
      labHref: "/lab/tajweed/",
      labLabel: "Lab · Tajweed",
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
        cfg.labHref2 +
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
      cfg.labHref +
      '">' +
      cfg.labLabel +
      "</a>" +
      extra +
      '<a class="cu-contract-chip ghost" href="' +
      cfg.libHref +
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

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", observe);
  else observe();
  setTimeout(run, 600);
  setTimeout(run, 1800);
})(typeof window !== "undefined" ? window : this);

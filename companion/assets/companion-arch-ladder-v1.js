/*! companion-arch-ladder-v3 · repair: pinned-only shelves · hero stays top
 * No empty shelf noise · no tab-hero in buckets · educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_ARCH_LADDER_V3__) return;
  w.__COMPANION_ARCH_LADDER_V3__ = true;
  w.__COMPANION_ARCH_LADDER_V2__ = true;
  w.__COMPANION_ARCH_LADDER_V1__ = true;

  var LEVELS = {
    1: { label: "Īmān & Tawḥīd", short: "Foundation", jibril: "Īmān", hint: "Know Allah · believe · orient the heart", color: "#3d7ea6" },
    2: { label: "Islām · farḍ practice", short: "Obligations", jibril: "Islām", hint: "Pillars · protect what is required", color: "#1f8f6a" },
    3: { label: "Sunnah & character", short: "Prophetic path", jibril: "Sunnah", hint: "Seerah · adab · tongue · household", color: "#8b6b2e" },
    4: { label: "Iḥsān · purification", short: "Excellence", jibril: "Iḥsān", hint: "Tawbah · dhikr · night · grave focus", color: "#6b4ea6" },
    5: { label: "Tools & craft", short: "Aids", jibril: "—", hint: "Studios serve learning — not the goal", color: "#2a6b7a" },
    6: { label: "Transmission with adab", short: "Daʿwah aid", jibril: "—", hint: "Source · audience · limit", color: "#8a4a3a" }
  };

  var PIN = { "action-studios-board": 5,
    "asma-box": 1,
    "asma-names-lecture-card": 1,
    "beautiful-names-card": 1,
    "building-pillars-card": 2,
    "calling-adab-card": 6,
    "commands-card": 1,
    "craft-bridge-pack": 5,
    "dai-transmit-card": 6,
    "daily-deed-ledger-card": 2,
    "deepen-study-card": 3,
    "fiqh-quiz-card": 5,
    "furnish-grave-card": 4,
    "grave-path-card": 4,
    "guard-tongue-card": 3,
    "hadith": 1,
    "hajj-checklist-card": 2,
    "hajj-guide-card": 2,
    "hell-sins-card": 4,
    "hifz-coach-card": 5,
    "ilm-pathway-card": 3,
    "israeliyat-card": 3,
    "ledger-return-card": 4,
    "mercy-path-card": 3,
    "najiha-tafseer-card": 3,
    "new-muslim-foundations-card": 2,
    "night-breath-card": 4,
    "prophet-name-box": 1,
    "reminder-deepen-exercise": 4,
    "salah-starter-card": 2,
    "samina-ataana-card": 1,
    "samina-card": 1,
    "samina-verse-card": 1,
    "sealed-nectar-card": 3,
    "seerah-live-card": 3,
    "seerah-mirror-card": 3,
    "soul-compass-card": 4,
    "steady-deeds-card": 2,
    "tafseer-live-card": 3,
    "tafseer-resources-card": 3,
    "tajalliyat-lecture-card": 3,
    "tajweed-live-card": 5,
    "tajweed-path-card": 5,
    "tawbah-nasuhah-card": 4,
    "tibbe-nabwi-card": 3,
    "tj-deep-studio": 5,
    "voice-translator-card": 5,
    "weekly-review-card": 3 };

  var EXCLUDE_IDS = {
    "cs-tab-hero": 1,
    "cs-mount-status": 1,
    "clarity-door-rail": 1,
    "arch-ladder-root": 1,
    "daily-muslim-foundation": 1
  };

  function pathBias() {
    try {
      return localStorage.getItem("clarity.companion.path") || localStorage.getItem("cs_path") || "seeker";
    } catch (e) {
      return "seeker";
    }
  }

  function isHeroLike(el) {
    if (!el) return true;
    if (EXCLUDE_IDS[el.id]) return true;
    if (el.classList && (el.classList.contains("cs-tab-hero") || el.classList.contains("cs-path") || el.classList.contains("cs-door"))) return true;
    if (el.getAttribute && el.getAttribute("data-arch-skip") === "1") return true;
    var h = ((el.querySelector && (el.querySelector("h1,h2") || {}).textContent) || "") + " " + (el.id || "");
    // Tab chrome titles
    if (/^\s*(Reminder|Reality|Reflection|Action|Notes|About)\s*$/i.test(h.trim())) return true;
    if (/What Allah.*Messenger|Section\s*·\s*Educational only/i.test(el.textContent || "")) {
      // only if short intro plaque
      if ((el.textContent || "").length < 420) return true;
    }
    return false;
  }

  function classify(el) {
    if (el.id && PIN[el.id]) return PIN[el.id];
    var forced = el.getAttribute("data-arch-level");
    if (forced && LEVELS[parseInt(forced, 10)]) return parseInt(forced, 10);
    return 0; // unpinned → do not force into shelf
  }

  function candidates(root) {
    var out = [];
    var seen = {};
    // ONLY pinned IDs + elements already data-arch-level 1-6 that are not hero
    Object.keys(PIN).forEach(function (id) {
      var el = d.getElementById(id);
      if (!el || !root.contains(el)) return;
      if (el.closest && el.closest("#arch-ladder-root")) return;
      if (isHeroLike(el)) return;
      if (seen[id]) return;
      seen[id] = 1;
      out.push(el);
    });
    Array.prototype.forEach.call(root.querySelectorAll("[data-arch-level]"), function (el) {
      if (el.closest && el.closest("#arch-ladder-root")) return;
      if (isHeroLike(el)) return;
      var lv = parseInt(el.getAttribute("data-arch-level"), 10);
      if (!LEVELS[lv]) return;
      var key = el.id || ("x" + out.length);
      if (seen[key]) return;
      // skip thin dl stubs only if no id pin — still allow if data-arch-level set by content team
      if (!el.id && (el.textContent || "").trim().length < 60) return;
      seen[key] = 1;
      out.push(el);
    });
    return out;
  }

  function ensureLadder(host) {
    var root = d.getElementById("arch-ladder-root");
    if (root && host.contains(root)) return root;
    if (root) try { root.remove(); } catch (e) {}
    root = d.createElement("div");
    root.id = "arch-ladder-root";
    root.className = "arch-ladder-root";
    root.setAttribute("data-arch-skip", "1");
    root.innerHTML =
      '<nav class="arch-ladder-nav" aria-label="Higher Arch levels">' +
      '<div class="arch-ladder-nav-title">Higher Arch · L1–L6</div>' +
      '<p class="arch-ladder-nav-hint">Rich sections only. Empty levels stay hidden. Educational only — not a fatwa.</p>' +
      '<div class="arch-ladder-chips" role="tablist"></div></nav>';
    var chips = root.querySelector(".arch-ladder-chips");
    var all = d.createElement("button");
    all.type = "button";
    all.className = "arch-chip is-all is-active";
    all.setAttribute("data-chip-level", "all");
    all.textContent = "All levels";
    chips.appendChild(all);
    [1, 2, 3, 4, 5, 6].forEach(function (lv) {
      var meta = LEVELS[lv];
      var shelf = d.createElement("section");
      shelf.className = "arch-level-shelf is-empty";
      shelf.setAttribute("data-arch-shelf", String(lv));
      shelf.setAttribute("data-arch-skip", "1");
      shelf.style.setProperty("--arch-lv-color", meta.color);
      shelf.innerHTML =
        '<header class="arch-shelf-head"><button type="button" class="arch-shelf-toggle" aria-expanded="true" data-toggle-shelf="' +
        lv +
        '"><span class="ash-lv">L' +
        lv +
        '</span><span class="ash-label">' +
        meta.label +
        '</span><span class="ash-jibril">' +
        meta.jibril +
        '</span><span class="ash-count" data-count-for="' +
        lv +
        '">0</span><span class="ash-chev">▾</span></button><p class="ash-hint">' +
        meta.hint +
        '</p></header><div class="arch-shelf-body" data-shelf-body="' +
        lv +
        '"></div>';
      root.appendChild(shelf);
      var chip = d.createElement("button");
      chip.type = "button";
      chip.className = "arch-chip";
      chip.setAttribute("data-chip-level", String(lv));
      chip.innerHTML = "<span>L" + lv + "</span> " + meta.short;
      chips.appendChild(chip);
    });

    // Place ladder AFTER hero / intro blocks, not before everything
    var hero =
      host.querySelector(".cs-tab-hero, #cs-tab-hero, [data-cs-hero]") ||
      host.querySelector("section.cs-plaque, .card");
    // Prefer first element that looks like tab intro
    var kids = Array.prototype.slice.call(host.children || []);
    var insertBefore = null;
    for (var i = 0; i < kids.length; i++) {
      var k = kids[i];
      if (k.id === "arch-ladder-root") continue;
      if (isHeroLike(k) || (k.querySelector && k.querySelector(".cs-tab-hero"))) continue;
      // path cards often after hero
      if (k.classList && k.classList.contains("cs-path")) continue;
      insertBefore = k;
      break;
    }
    if (insertBefore) host.insertBefore(root, insertBefore);
    else host.appendChild(root);

    if (!root.__bound) {
      root.__bound = true;
      root.addEventListener("click", function (ev) {
        var t = ev.target.closest("[data-toggle-shelf]");
        if (t) {
          var shelf = root.querySelector('[data-arch-shelf="' + t.getAttribute("data-toggle-shelf") + '"]');
          if (!shelf) return;
          var col = shelf.classList.toggle("is-collapsed");
          t.setAttribute("aria-expanded", col ? "false" : "true");
          return;
        }
        var chip = ev.target.closest("[data-chip-level]");
        if (!chip) return;
        var level = chip.getAttribute("data-chip-level");
        root.querySelectorAll(".arch-chip").forEach(function (c) {
          c.classList.toggle("is-active", c === chip);
        });
        root.querySelectorAll(".arch-level-shelf").forEach(function (s) {
          if (s.classList.contains("is-empty")) return;
          if (level === "all") s.classList.remove("is-filtered-out");
          else s.classList.toggle("is-filtered-out", s.getAttribute("data-arch-shelf") !== level);
        });
      });
    }
    return root;
  }

  function align(mount) {
    if (!mount) return;
    var host = mount.querySelector("article, [data-cs-mounted], .tab-panel") || mount;
    var cards = candidates(host);
    var ladder = ensureLadder(host);
    var buckets = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

    cards.forEach(function (el) {
      var lv = classify(el);
      if (!LEVELS[lv]) return;
      el.setAttribute("data-arch-level", String(lv));
      // single badge
      var old = el.querySelectorAll(".arch-badge-inline");
      for (var i = 1; i < old.length; i++) try { old[i].remove(); } catch (e) {}
      if (!el.querySelector(".arch-badge-inline")) {
        var b = d.createElement("div");
        b.className = "arch-badge-inline";
        b.innerHTML = '<span class="abi-lv">L' + lv + '</span><span class="abi-name">' + LEVELS[lv].short + "</span>";
        el.insertBefore(b, el.firstChild);
      }
      buckets[lv].push(el);
    });

    [1, 2, 3, 4, 5, 6].forEach(function (lv) {
      var body = ladder.querySelector('[data-shelf-body="' + lv + '"]');
      var countEl = ladder.querySelector('[data-count-for="' + lv + '"]');
      var shelf = ladder.querySelector('[data-arch-shelf="' + lv + '"]');
      if (!body || !shelf) return;
      var list = buckets[lv];
      if (countEl) countEl.textContent = String(list.length);
      if (!list.length) {
        shelf.classList.add("is-empty");
        shelf.classList.remove("is-filtered-out");
        body.innerHTML = "";
      } else {
        shelf.classList.remove("is-empty");
        list.forEach(function (el) {
          body.appendChild(el);
        });
      }
    });

    // Path: expand primary non-empty
    var path = pathBias();
    var primary = { seeker: { 1: 1, 4: 1 }, new_muslim: { 1: 1, 2: 1 }, practicing: { 2: 1, 3: 1 }, dai: { 1: 1, 6: 1 } }[path] || { 1: 1 };
    ladder.querySelectorAll(".arch-level-shelf").forEach(function (s) {
      if (s.classList.contains("is-empty")) return;
      var lv = s.getAttribute("data-arch-shelf");
      if (primary[lv]) s.classList.remove("is-collapsed");
    });

    w.__COMPANION_ARCH_LADDER_AUDIT__ = {
      version: "v3-repair",
      path: path,
      counts: {
        1: buckets[1].length,
        2: buckets[2].length,
        3: buckets[3].length,
        4: buckets[4].length,
        5: buckets[5].length,
        6: buckets[6].length
      },
      placed: cards.map(function (c) { return c.id; }).filter(Boolean)
    };
  }

  var running = false;
  function run() {
    if (running) return;
    running = true;
    try {
      align(d.getElementById("cs-mount"));
    } finally {
      running = false;
    }
  }

  function boot() {
    run();
    d.addEventListener("clarity:tab-mounted", function () {
      setTimeout(run, 100);
      setTimeout(run, 400);
      setTimeout(run, 1000);
    });
    var mount = d.getElementById("cs-mount");
    if (mount && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function (muts) {
        // ignore our own ladder mutations
        var skip = true;
        for (var i = 0; i < muts.length; i++) {
          var n = muts[i].target;
          if (!n.closest || !n.closest("#arch-ladder-root")) {
            skip = false;
            break;
          }
        }
        if (skip) return;
        if (t) clearTimeout(t);
        t = setTimeout(run, 200);
      }).observe(mount, { childList: true, subtree: true });
    }
  }

  w.ClarityArchLadder = { run: run, levels: LEVELS, pin: PIN };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);

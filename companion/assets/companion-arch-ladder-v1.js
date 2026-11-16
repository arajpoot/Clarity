/*! companion-arch-ladder-v2 · full-section shelves · restore richness
 * Moves complete Reminder modules into L1–L6 — no empty fake cards
 * Educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_ARCH_LADDER_V2__) return;
  w.__COMPANION_ARCH_LADDER_V2__ = true;
  // supersede v1 flag so we own align
  w.__COMPANION_ARCH_LADDER_V1__ = true;

  var LEVELS = {
    1: { id: "iman_tawhid", label: "Īmān & Tawḥīd", short: "Foundation", jibril: "Īmān", hint: "Know Allah · believe · orient the heart", color: "#3d7ea6" },
    2: { id: "islam_fard", label: "Islām · farḍ practice", short: "Obligations", jibril: "Islām", hint: "Pillars · protect what is required", color: "#1f8f6a" },
    3: { id: "sunnah_character", label: "Sunnah & character", short: "Prophetic path", jibril: "Sunnah", hint: "Seerah · adab · tongue · household", color: "#8b6b2e" },
    4: { id: "ihsan_tazkiya", label: "Iḥsān · purification", short: "Excellence", jibril: "Iḥsān", hint: "Tawbah · dhikr · night · grave focus", color: "#6b4ea6" },
    5: { id: "tools_craft", label: "Tools & craft", short: "Aids", jibril: "—", hint: "Studios serve learning — not the goal", color: "#2a6b7a" },
    6: { id: "transmission", label: "Transmission with adab", short: "Daʿwah aid", jibril: "—", hint: "Source · audience · limit", color: "#8a4a3a" }
  };

  /* Explicit richness map — complete sections, not thin stubs */
  var PIN = {
    "beautiful-names-card": 1,
    "samina-ataana-card": 1,
    "commands-card": 1,
    "samina-verse-card": 1,
    "command-box": 1,
    "hadith": 1,
    "prophet-name-box": 1,
    "grave-path-card": 4,
    "ilm-pathway-card": 3,
    "tafseer-resources-card": 3,
    "najiha-tafseer-card": 3,
    "craft-bridge-pack": 5,
    "reminder-deepen-exercise": 4,
    "daily-muslim-foundation": 1
  };

  var RULES = [
    { level: 1, re: /command|sami.?n|beautiful names|asma|tawhid|iman|belief|ya ayyuh|allah.?s commands|daily name of the prophet|hadith spark|live [aā]yah|why we were created|remember me/i },
    { level: 2, re: /pillar|fard|farḍ|wudu|salah|salat|prayer|hajj|intentions|actions are by/i },
    { level: 3, re: /seerah|s[iī]rah|prophetic|character|household|tafseer|tafsīr|ilm pathway|najiha/i },
    { level: 4, re: /tawbah|grave|istighfar|dhikr|zikr|night|deepen|furnish|ihsan|purif/i },
    { level: 5, re: /meme|callig|tweet|studio|tajweed|hifz|quiz|atelier|craft bridge|tools/i },
    { level: 6, re: /da.?i|transmit|transmission|teach names with humility|shareable/i }
  ];

  function pathBias() {
    try {
      return localStorage.getItem("clarity.companion.path") || localStorage.getItem("cs_path") || "seeker";
    } catch (e) {
      return "seeker";
    }
  }

  function textOf(el) {
    return ((el.getAttribute("data-arch-title") || el.id || "") + " " + (el.textContent || "")).slice(0, 1200);
  }

  function classify(el) {
    if (el.id && PIN[el.id]) return PIN[el.id];
    var forced = el.getAttribute("data-arch-level");
    if (forced && LEVELS[parseInt(forced, 10)]) return parseInt(forced, 10);
    var t = textOf(el);
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i].re.test(t)) return RULES[i].level;
    }
    return 5;
  }

  function isInsideLadder(el) {
    return !!(el.closest && el.closest("#arch-ladder-root"));
  }

  function cardCandidates(root) {
    var out = [];
    var seen = {};

    // 1) Pinned rich IDs always
    Object.keys(PIN).forEach(function (id) {
      var el = root.querySelector("#" + id) || d.getElementById(id);
      if (el && root.contains(el) && !isInsideLadder(el)) {
        seen[id] = 1;
        out.push(el);
      }
    });

    // 2) Broad section selectors
    var nodes = root.querySelectorAll(
      ".card, [data-rrra], section.cs-plaque, section.card, [id$='-card'], .craft-bridge-pack, .deepen-exercise, .daily-muslim-foundation, .dl-card, [data-dl-card]"
    );
    Array.prototype.forEach.call(nodes, function (n) {
      if (isInsideLadder(n)) return;
      if (n.id === "arch-ladder-root") return;
      if ((n.textContent || "").trim().length < 24) return;
      // skip nested inside another out candidate
      for (var i = 0; i < out.length; i++) {
        if (out[i] !== n && out[i].contains(n)) return;
      }
      var key = n.id || textOf(n).slice(0, 40);
      if (seen[key]) return;
      seen[key] = 1;
      out.push(n);
    });
    return out;
  }

  function ensureLadder(host) {
    var root = d.getElementById("arch-ladder-root");
    if (root && host.contains(root)) return root;
    if (root && !host.contains(root)) {
      try { root.remove(); } catch (e) {}
    }
    root = d.createElement("div");
    root.id = "arch-ladder-root";
    root.className = "arch-ladder-root";
    root.innerHTML =
      '<nav class="arch-ladder-nav" aria-label="Higher Arch levels">' +
      '<div class="arch-ladder-nav-title">Higher Arch · L1–L6</div>' +
      '<p class="arch-ladder-nav-hint">Full sections sorted by learning ladder. Empty levels stay quiet. Educational only — not a fatwa.</p>' +
      '<div class="arch-ladder-chips" role="tablist"></div></nav>';

    var chips = root.querySelector(".arch-ladder-chips");
    var path = pathBias();
    var focus = {
      seeker: [1, 4, 3, 2, 5, 6],
      new_muslim: [2, 1, 3, 4, 5, 6],
      practicing: [2, 3, 4, 1, 5, 6],
      dai: [1, 6, 3, 4, 2, 5]
    };
    var order = focus[path] || [1, 2, 3, 4, 5, 6];

    var all = d.createElement("button");
    all.type = "button";
    all.className = "arch-chip is-all is-active";
    all.setAttribute("data-chip-level", "all");
    all.textContent = "All levels";
    chips.appendChild(all);

    order.forEach(function (lv) {
      var meta = LEVELS[lv];
      var shelf = d.createElement("section");
      shelf.className = "arch-level-shelf";
      shelf.setAttribute("data-arch-shelf", String(lv));
      shelf.style.setProperty("--arch-lv-color", meta.color);
      shelf.innerHTML =
        '<header class="arch-shelf-head">' +
        '<button type="button" class="arch-shelf-toggle" aria-expanded="true" data-toggle-shelf="' + lv + '">' +
        '<span class="ash-lv">L' + lv + "</span>" +
        '<span class="ash-label">' + meta.label + "</span>" +
        '<span class="ash-jibril">' + meta.jibril + "</span>" +
        '<span class="ash-count" data-count-for="' + lv + '">0</span>' +
        '<span class="ash-chev" aria-hidden="true">▾</span></button>' +
        '<p class="ash-hint">' + meta.hint + "</p></header>" +
        '<div class="arch-shelf-body" data-shelf-body="' + lv + '"></div>';
      root.appendChild(shelf);

      var chip = d.createElement("button");
      chip.type = "button";
      chip.className = "arch-chip";
      chip.setAttribute("data-chip-level", String(lv));
      chip.innerHTML = "<span>L" + lv + "</span> " + meta.short;
      chips.appendChild(chip);
    });

    host.insertBefore(root, host.firstChild);
    bindNav(root);
    return root;
  }

  function bindNav(root) {
    if (root.__bound) return;
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
        if (level === "all") s.classList.remove("is-filtered-out");
        else s.classList.toggle("is-filtered-out", s.getAttribute("data-arch-shelf") !== level);
      });
    });
  }

  function dedupeBadges(el) {
    var badges = el.querySelectorAll(".arch-badge-inline, .arch-badge, [class*='arch-badge']");
    if (badges.length > 1) {
      for (var i = 1; i < badges.length; i++) {
        try { badges[i].remove(); } catch (e) {}
      }
    }
  }

  function align(mount) {
    if (!mount) return;
    var host =
      mount.querySelector("article[data-cs-mounted], article, [data-cs-mounted], .tab-panel") || mount;
    var cards = cardCandidates(host);
    if (!cards.length) return;

    var ladder = ensureLadder(host);
    var buckets = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

    cards.forEach(function (el) {
      var lv = classify(el);
      el.setAttribute("data-arch-level", String(lv));
      dedupeBadges(el);
      if (!el.querySelector(".arch-badge-inline")) {
        var b = d.createElement("div");
        b.className = "arch-badge-inline";
        b.innerHTML =
          '<span class="abi-lv">L' + lv + '</span><span class="abi-name">' + LEVELS[lv].short + "</span>";
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
        shelf.classList.add("is-empty", "is-collapsed");
        if (!body.querySelector(".arch-empty-note")) {
          body.innerHTML =
            '<p class="arch-empty-note">Nothing on this level in this tab right now.</p>';
        }
      } else {
        shelf.classList.remove("is-empty");
        var note = body.querySelector(".arch-empty-note");
        if (note) note.remove();
        list.forEach(function (el) {
          body.appendChild(el);
        });
      }
    });

    var path = pathBias();
    var primary = { seeker: { 1: 1, 4: 1 }, new_muslim: { 1: 1, 2: 1 }, practicing: { 2: 1, 3: 1 }, dai: { 1: 1, 6: 1 } }[path] || { 1: 1 };
    ladder.querySelectorAll(".arch-level-shelf").forEach(function (s) {
      var lv = s.getAttribute("data-arch-shelf");
      if (s.classList.contains("is-empty")) return;
      if (primary[lv]) s.classList.remove("is-collapsed");
    });

    w.__COMPANION_ARCH_LADDER_AUDIT__ = {
      version: "v2-rich",
      path: path,
      counts: {
        1: buckets[1].length,
        2: buckets[2].length,
        3: buckets[3].length,
        4: buckets[4].length,
        5: buckets[5].length,
        6: buckets[6].length
      },
      ids: cards.map(function (c) { return c.id || c.className.slice(0, 24); })
    };
  }

  function run() {
    align(d.getElementById("cs-mount"));
  }

  function boot() {
    run();
    d.addEventListener("clarity:tab-mounted", function () {
      setTimeout(run, 80);
      setTimeout(run, 350);
      setTimeout(run, 900);
    });
    var mount = d.getElementById("cs-mount");
    if (mount && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(run, 160);
      }).observe(mount, { childList: true, subtree: true });
    }
  }

  w.ClarityArchLadder = { run: run, levels: LEVELS, pin: PIN };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);

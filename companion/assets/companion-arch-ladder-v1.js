/*! companion-arch-ladder-v1 · real L1–L6 content groups (not empty count cards)
 * Uses Higher Arch taxonomy · moves real cards into level shelves
 * Path soft-emphasis · educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_ARCH_LADDER_V1__) return;
  w.__COMPANION_ARCH_LADDER_V1__ = true;

  var LEVELS = {
    1: { id: "iman_tawhid", label: "Īmān & Tawḥīd", short: "Foundation", jibril: "Īmān", hint: "Know Allah · believe · orient the heart", color: "#3d7ea6" },
    2: { id: "islam_fard", label: "Islām · farḍ practice", short: "Obligations", jibril: "Islām", hint: "Pillars · protect what is required", color: "#1f8f6a" },
    3: { id: "sunnah_character", label: "Sunnah & character", short: "Prophetic path", jibril: "Sunnah", hint: "Seerah · adab · tongue · household", color: "#8b6b2e" },
    4: { id: "ihsan_tazkiya", label: "Iḥsān · purification", short: "Excellence", jibril: "Iḥsān", hint: "Tawbah · dhikr · night · grave focus", color: "#6b4ea6" },
    5: { id: "tools_craft", label: "Tools & craft", short: "Aids", jibril: "—", hint: "Studios serve learning — not the goal", color: "#2a6b7a" },
    6: { id: "transmission", label: "Transmission with adab", short: "Daʿwah aid", jibril: "—", hint: "Source · audience · limit", color: "#8a4a3a" }
  };

  var RULES = [
    { level: 1, re: /command|sami.?n|beautiful names|asma|tawhid|iman|belief|ya ayyuh|allah.?s commands|daily name of the prophet|hadith spark|live [aā]yah|foundation for a daily|one name|hear first/i },
    { level: 2, re: /pillar|fard|farḍ|wudu|wu[dḍ]u|salah|salat|prayer|hajj checklist|building on pillars|stability before|protect the five/i },
    { level: 3, re: /seerah|s[iī]rah|prophetic|mercy on the path|previous nations|character lesson|model consistency|household|adab of speech/i },
    { level: 4, re: /tawbah|soul compass|grave|istighfar|dhikr|zikr|night|if i die|furnishing|ihsan|purif|deepen exercise|one-minute deepen/i },
    { level: 5, re: /meme|callig|tweet desk|studio|tajweed|hifz|quiz|sharia iq|atelier|craft bridge|tools/i },
    { level: 6, re: /da.?i|transmit|transmission|shareable|calling with adab|teach names with humility/i }
  ];

  function pathBias() {
    try {
      return (
        localStorage.getItem("clarity.companion.path") ||
        localStorage.getItem("cs_path") ||
        "seeker"
      );
    } catch (e) {
      return "seeker";
    }
  }

  function textOf(el) {
    return ((el.getAttribute("data-arch-title") || el.id || "") + " " + (el.textContent || "")).slice(0, 900);
  }

  function classify(el) {
    var forced = el.getAttribute("data-arch-level");
    if (forced && LEVELS[parseInt(forced, 10)]) return parseInt(forced, 10);
    var t = textOf(el);
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i].re.test(t)) return RULES[i].level;
    }
    return 5;
  }

  function cardCandidates(root) {
    var nodes = root.querySelectorAll(
      ".card, [data-rrra], section.cs-plaque, section.card, [id$='-card'], .craft-bridge-pack, .deepen-exercise, .daily-muslim-foundation"
    );
    var out = [];
    var seen = {};
    Array.prototype.forEach.call(nodes, function (n) {
      if (n.closest && n.closest("#arch-ladder-root")) return;
      if (n.id === "arch-ladder-root" || n.classList.contains("arch-level-shelf")) return;
      if ((n.textContent || "").trim().length < 28) return;
      // skip nested cards inside another candidate
      var parentCard = n.parentElement && n.parentElement.closest && n.parentElement.closest(".card, [data-rrra], section.cs-plaque");
      if (parentCard && parentCard !== n && root.contains(parentCard) && parentCard !== root) {
        // allow if parent is mount/article wrapper
        var pTag = (parentCard.tagName || "").toLowerCase();
        if (pTag !== "article" && pTag !== "main") {
          // if parent is also a candidate type, skip child
          if (parentCard.classList.contains("card") || parentCard.hasAttribute("data-rrra") || parentCard.classList.contains("cs-plaque")) {
            return;
          }
        }
      }
      var key = n.id || textOf(n).slice(0, 48);
      if (seen[key]) return;
      seen[key] = 1;
      out.push(n);
    });
    return out;
  }

  function ensureLadder(host) {
    var root = d.getElementById("arch-ladder-root");
    if (root && host.contains(root)) return root;
    root = d.createElement("div");
    root.id = "arch-ladder-root";
    root.className = "arch-ladder-root";
    root.setAttribute("data-arch-ladder", "1");

    var nav = d.createElement("nav");
    nav.className = "arch-ladder-nav";
    nav.setAttribute("aria-label", "Higher Arch levels");
    nav.innerHTML =
      '<div class="arch-ladder-nav-title">Higher Arch · L1–L6</div>' +
      '<p class="arch-ladder-nav-hint">Content is grouped by learning ladder — not empty shells. Educational only — not a fatwa.</p>' +
      '<div class="arch-ladder-chips" role="tablist"></div>';
    root.appendChild(nav);

    var chips = nav.querySelector(".arch-ladder-chips");
    var path = pathBias();
    // path soft order of attention
    var focus = {
      seeker: [1, 4, 3, 2, 5, 6],
      new_muslim: [2, 1, 3, 4, 5, 6],
      practicing: [2, 3, 4, 1, 5, 6],
      dai: [1, 6, 3, 4, 2, 5]
    };
    var order = focus[path] || [1, 2, 3, 4, 5, 6];

    order.forEach(function (lv) {
      var meta = LEVELS[lv];
      var shelf = d.createElement("section");
      shelf.className = "arch-level-shelf";
      shelf.id = "arch-shelf-L" + lv;
      shelf.setAttribute("data-arch-shelf", String(lv));
      shelf.setAttribute("data-arch-id", meta.id);
      shelf.style.setProperty("--arch-lv-color", meta.color);
      shelf.innerHTML =
        '<header class="arch-shelf-head">' +
        '<button type="button" class="arch-shelf-toggle" aria-expanded="true" data-toggle-shelf="' + lv + '">' +
        '<span class="ash-lv">L' + lv + "</span>" +
        '<span class="ash-label">' + meta.label + "</span>" +
        '<span class="ash-jibril">' + meta.jibril + "</span>" +
        '<span class="ash-count" data-count-for="' + lv + '">0</span>' +
        '<span class="ash-chev" aria-hidden="true">▾</span>' +
        "</button>" +
        '<p class="ash-hint">' + meta.hint + "</p>" +
        "</header>" +
        '<div class="arch-shelf-body" data-shelf-body="' + lv + '"></div>';
      root.appendChild(shelf);

      var chip = d.createElement("button");
      chip.type = "button";
      chip.className = "arch-chip";
      chip.setAttribute("data-chip-level", String(lv));
      chip.setAttribute("aria-pressed", "false");
      chip.innerHTML = "<span>L" + lv + "</span> " + meta.short;
      chips.appendChild(chip);
    });

    // All chip
    var all = d.createElement("button");
    all.type = "button";
    all.className = "arch-chip is-all is-active";
    all.setAttribute("data-chip-level", "all");
    all.setAttribute("aria-pressed", "true");
    all.textContent = "All levels";
    chips.insertBefore(all, chips.firstChild);

    // Insert ladder at top of host content (after hero if present)
    var hero = host.querySelector(".cs-tab-hero, #cs-tab-hero, [data-cs-hero]");
    if (hero && hero.parentNode === host) {
      if (hero.nextSibling) host.insertBefore(root, hero.nextSibling);
      else host.appendChild(root);
    } else {
      host.insertBefore(root, host.firstChild);
    }

    bindNav(root);
    return root;
  }

  function bindNav(root) {
    if (root.__ladderBound) return;
    root.__ladderBound = true;
    root.addEventListener("click", function (ev) {
      var t = ev.target.closest("[data-toggle-shelf]");
      if (t) {
        var lv = t.getAttribute("data-toggle-shelf");
        var shelf = root.querySelector('[data-arch-shelf="' + lv + '"]');
        if (!shelf) return;
        var open = shelf.classList.toggle("is-collapsed");
        t.setAttribute("aria-expanded", open ? "false" : "true");
        return;
      }
      var chip = ev.target.closest("[data-chip-level]");
      if (chip) {
        var level = chip.getAttribute("data-chip-level");
        root.querySelectorAll(".arch-chip").forEach(function (c) {
          c.classList.toggle("is-active", c === chip);
          c.setAttribute("aria-pressed", c === chip ? "true" : "false");
        });
        root.querySelectorAll(".arch-level-shelf").forEach(function (s) {
          if (level === "all") {
            s.classList.remove("is-filtered-out");
          } else {
            s.classList.toggle("is-filtered-out", s.getAttribute("data-arch-shelf") !== level);
          }
        });
      }
    });
  }

  function align(mount) {
    if (!mount) return;
    var host =
      mount.querySelector("article, [data-cs-mounted], .tab-panel, .cs-tab-body") || mount;
    var cards = cardCandidates(host);
    if (!cards.length) return;

    var ladder = ensureLadder(host);
    var buckets = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

    cards.forEach(function (el) {
      if (el.id === "arch-ladder-root") return;
      var lv = classify(el);
      el.setAttribute("data-arch-level", String(lv));
      if (!el.querySelector(":scope > .arch-badge-inline")) {
        var b = d.createElement("div");
        b.className = "arch-badge-inline";
        b.innerHTML =
          '<span class="abi-lv">L' +
          lv +
          '</span><span class="abi-name">' +
          LEVELS[lv].short +
          "</span>";
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
        // keep shelf but collapsed + empty state (not fake cards)
        if (!body.querySelector(".arch-empty-note")) {
          body.innerHTML =
            '<p class="arch-empty-note">No cards on this level in the current tab — the ladder stays honest.</p>';
        }
        shelf.classList.add("is-collapsed");
      } else {
        shelf.classList.remove("is-empty");
        // clear empty note
        var note = body.querySelector(".arch-empty-note");
        if (note) note.remove();
        list.forEach(function (el) {
          body.appendChild(el);
        });
      }
    });

    // Path primary: expand focus levels
    var path = pathBias();
    var primary = {
      seeker: { 1: 1, 4: 1 },
      new_muslim: { 2: 1, 1: 1 },
      practicing: { 2: 1, 3: 1 },
      dai: { 1: 1, 6: 1 }
    }[path] || { 1: 1, 2: 1 };
    ladder.querySelectorAll(".arch-level-shelf").forEach(function (s) {
      var lv = s.getAttribute("data-arch-shelf");
      if (s.classList.contains("is-empty")) return;
      if (primary[lv]) s.classList.remove("is-collapsed");
    });

    w.__COMPANION_ARCH_LADDER_AUDIT__ = {
      path: path,
      counts: {
        1: buckets[1].length,
        2: buckets[2].length,
        3: buckets[3].length,
        4: buckets[4].length,
        5: buckets[5].length,
        6: buckets[6].length
      }
    };
  }

  function run() {
    var mount = d.getElementById("cs-mount");
    if (!mount) return;
    align(mount);
  }

  function boot() {
    run();
    d.addEventListener("clarity:tab-mounted", function () {
      setTimeout(run, 100);
      setTimeout(run, 400);
    });
    var mount = d.getElementById("cs-mount");
    if (mount && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(run, 140);
      }).observe(mount, { childList: true });
    }
  }

  w.ClarityArchLadder = { run: run, levels: LEVELS };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);

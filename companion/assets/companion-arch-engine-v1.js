/*! companion-arch-engine-v1 · Higher Arch of a practicing Muslim (educational)
 *
 * Grounding (not a fatwa):
 * - Hadith Jibrīl: Islām · Īmān · Iḥsān (Muslim 8 / Bukhārī 50)
 * - Educational priority: practical obedience & farḍ ʿayn before volume of optional detail
 *   (classical adab of learning; e.g. īmān before over-stacking information)
 * - Life values: adab, sincerity, consistency, transmission with sources
 *
 * Engine: scans mounted cards, tags arch level, stable-reorders DOM, paints ribbon + audit.
 * Enrichment hold: never deletes content. Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_ARCH_ENGINE_V1__) return;
  w.__COMPANION_ARCH_ENGINE_V1__ = true;

  var LOG = (w.__COMPANION_ARCH_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  /* Arch levels — lower number = higher priority in the educational ladder */
  var LEVELS = {
    1: { id: "iman_tawhid", label: "Īmān & Tawḥīd", short: "Foundation", jibril: "Īmān", hint: "Know Allah · believe · orient the heart" },
    2: { id: "islam_fard", label: "Islām · farḍ practice", short: "Obligations", jibril: "Islām", hint: "Pillars · prayer · protect what is required" },
    3: { id: "sunnah_character", label: "Sunnah & character", short: "Prophetic path", jibril: "Islām/Īmān", hint: "Seerah · adab · tongue · household" },
    4: { id: "ihsan_tazkiya", label: "Iḥsān · purification", short: "Excellence", jibril: "Iḥsān", hint: "Tawbah · dhikr · night watch · grave focus" },
    5: { id: "tools_craft", label: "Tools & craft", short: "Aids", jibril: "—", hint: "Studios that serve learning — not the goal" },
    6: { id: "transmission", label: "Transmission with adab", short: "Daʿwah aid", jibril: "—", hint: "Share only with source · audience · limit" }
  };

  /* Keyword → level (first match wins by rule order below) */
  var RULES = [
    { level: 1, re: /command|sami.?n|beautiful names|asma|asm[aā]|tawhid|iman|belief|ya ayyuh|allah.?s commands|daily name of the prophet|hadith spark|live [aā]yah/i },
    { level: 2, re: /pillar|fard|farḍ|wudu|wu[dḍ]u|salah|salat|prayer|hajj|building on pillars|stability before|guarding the tongue|small deeds steady|protect the five/i },
    { level: 3, re: /seerah|s[iī]rah|prophetic|mercy on the path|family tree|previous nations|life events|tibb|tongue|household|character lesson|model consistency/i },
    { level: 4, re: /tawbah|soul compass|grave|istighfar|dhikr|zikr|night|if i die|furnishing|deposit|ihsan|purif/i },
    { level: 5, re: /meme|callig|tweet desk|studio|tajweed deep|voice translator|hifz|quiz|sharia iq|guided search|search the quran|search authentic|masn[uū]n/i },
    { level: 6, re: /da.?i|transmit|transmission|shareable|source · audience|calling with adab|tweet desk|open in grok/i }
  ];

  function textOf(el) {
    return ((el && (el.getAttribute("data-arch-title") || el.getAttribute("aria-label") || el.id || "")) + " " + (el && el.textContent || "")).slice(0, 800);
  }

  function classify(el) {
    var t = textOf(el);
    var forced = el.getAttribute("data-arch-level");
    if (forced && LEVELS[parseInt(forced, 10)]) return parseInt(forced, 10);
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i].re.test(t)) return RULES[i].level;
    }
    return 5; /* default: tools/secondary until known */
  }

  function cardCandidates(root) {
    var sel = [
      ".card",
      "[data-rrra]",
      "section.card",
      "#cs-mount article",
      "#cs-mount .cs-plaque",
      "#cs-mount [id$='-card']",
      "#cs-mount details.card"
    ].join(",");
    var nodes = root.querySelectorAll(sel);
    var out = [];
    var seen = {};
    Array.prototype.forEach.call(nodes, function (n) {
      /* prefer outermost cards — skip nested .card inside .card */
      if (n.parentElement && n.parentElement.closest && n.parentElement.closest(".card, [data-rrra]") && n.parentElement.closest(".card, [data-rrra]") !== n) {
        /* still allow if direct section */
      }
      if (n.offsetParent === null && n.getClientRects().length === 0) {
        /* may still reorder hidden */
      }
      var key = n.id || n.getAttribute("data-rrra") || tHash(textOf(n).slice(0, 60));
      if (seen[key]) return;
      seen[key] = 1;
      /* must be under mount and reasonably substantial */
      if ((n.textContent || "").trim().length < 40) return;
      out.push(n);
    });
    return out;
  }

  function tHash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return "t" + h;
  }

  function pathBias() {
    try {
      return localStorage.getItem("clarity.companion.path") || localStorage.getItem("cs_path") || "seeker";
    } catch (e) {
      return "seeker";
    }
  }

  /* Path soft preference: seekers keep L6 lower; dai may surface transmission earlier in ribbon only */
  function sortKey(level, path) {
    if (path === "dai" && level === 6) return 3.5; /* interleave transmission with character for dai emphasis */
    if ((path === "seeker" || path === "new_muslim") && level === 6) return 6.5;
    return level;
  }

  function ensureRibbon(root) {
    var mount = d.getElementById("cs-mount");
    if (!mount) return null;
    var rib = d.getElementById("companion-arch-ribbon");
    if (!rib) {
      rib = d.createElement("div");
      rib.id = "companion-arch-ribbon";
      rib.className = "companion-arch-ribbon";
      rib.setAttribute("role", "navigation");
      rib.setAttribute("aria-label", "Educational priority ladder — not a fatwa");
      mount.parentNode.insertBefore(rib, mount);
    }
    return rib;
  }

  function paintRibbon(audit, path) {
    var rib = ensureRibbon();
    if (!rib) return;
    var counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    audit.forEach(function (a) { counts[a.level] = (counts[a.level] || 0) + 1; });
    var html =
      '<div class="car-head"><strong>Higher arch</strong> · educational ladder · <span class="car-disc">not a fatwa</span></div>' +
      '<div class="car-jibril">Hadith Jibrīl frame: <em>Islām</em> → <em>Īmān</em> → <em>Iḥsān</em> · farḍ before volume · adab in transmission</div>' +
      '<div class="car-steps">';
    Object.keys(LEVELS).forEach(function (k) {
      var L = LEVELS[k];
      html +=
        '<button type="button" class="car-step" data-arch-jump="' +
        k +
        '" title="' +
        L.hint +
        '"><span class="car-num">' +
        k +
        "</span><span class="car-lab">' +
        L.short +
        '</span><span class="car-count">' +
        (counts[k] || 0) +
        "</span></button>";
    });
    html += "</div>";
    html +=
      '<p class="car-foot">Path: <strong>' +
      (path || "seeker") +
      "</strong> · content is tagged &amp; ordered — nothing removed · verify with Qur’an, Sunnah, and a local scholar</p>";
    rib.innerHTML = html;
    rib.querySelectorAll("[data-arch-jump]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lv = btn.getAttribute("data-arch-jump");
        var first = d.querySelector('#cs-mount [data-arch-level="' + lv + '"]');
        if (first && first.scrollIntoView) first.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function tagAndOrder(root) {
    var path = pathBias();
    var cards = cardCandidates(root);
    var audit = [];
    cards.forEach(function (el, idx) {
      var level = classify(el);
      el.setAttribute("data-arch-level", String(level));
      el.setAttribute("data-arch-id", LEVELS[level].id);
      /* badge */
      var badge = el.querySelector(":scope > .arch-badge");
      if (!badge) {
        badge = d.createElement("div");
        badge.className = "arch-badge";
        el.insertBefore(badge, el.firstChild);
      }
      badge.innerHTML =
        '<span class="ab-lv">L' +
        level +
        "</span> <span class="ab-name">' +
        LEVELS[level].label +
        '</span> <span class="ab-j">' +
        LEVELS[level].jibril +
        "</span>";
      audit.push({
        level: level,
        id: el.id || null,
        title: (el.querySelector("h2,h3") && el.querySelector("h2,h3").textContent || "").trim().slice(0, 80),
        path: path
      });
    });

    /* Stable reorder: group by parent to avoid breaking nested structures */
    var parents = [];
    var pseen = {};
    cards.forEach(function (el) {
      var p = el.parentNode;
      if (!p) return;
      var pk = p.id || tHash(p.className || "p");
      if (pseen[pk]) return;
      pseen[pk] = 1;
      parents.push(p);
    });
    parents.forEach(function (parent) {
      var kids = Array.prototype.filter.call(parent.children, function (ch) {
        return ch.hasAttribute && ch.hasAttribute("data-arch-level");
      });
      if (kids.length < 2) return;
      kids
        .slice()
        .sort(function (a, b) {
          var ka = sortKey(parseInt(a.getAttribute("data-arch-level"), 10), path);
          var kb = sortKey(parseInt(b.getAttribute("data-arch-level"), 10), path);
          if (ka !== kb) return ka - kb;
          return 0;
        })
        .forEach(function (ch) {
          parent.appendChild(ch);
        });
    });

    paintRibbon(audit, path);
    w.__COMPANION_ARCH_AUDIT__ = {
      version: "v1-20261116A1",
      path: path,
      count: audit.length,
      items: audit,
      disclaimer: "Educational hierarchy only — not a fatwa. Verify with primary texts and a local scholar."
    };
    log("arch-scan:" + audit.length);
    return audit;
  }

  function run() {
    var mount = d.getElementById("cs-mount");
    if (!mount) return;
    var root = mount.querySelector("[data-cs-mounted]") || mount;
    tagAndOrder(root);
  }

  function watch() {
    var mount = d.getElementById("cs-mount");
    if (!mount) return;
    var t = null;
    new MutationObserver(function () {
      if (t) clearTimeout(t);
      t = setTimeout(run, 80);
    }).observe(mount, { childList: true, subtree: true });
    run();
    setTimeout(run, 600);
    setTimeout(run, 1800);
  }

  w.ClarityArchEngine = {
    scan: run,
    levels: LEVELS,
    audit: function () {
      return w.__COMPANION_ARCH_AUDIT__ || null;
    }
  };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", watch);
  else watch();
})(window, document);

/*! companion-arch-engine-v1 · A2
 * Higher Arch L1–L6 + Daily Muslim Foundation plaque
 * Governance §6 · enrichment hold · educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_ARCH_ENGINE_V1__) {
    /* allow A2 upgrade by version stamp */
    if (w.__COMPANION_ARCH_ENGINE_VER__ === "A2") return;
  }
  w.__COMPANION_ARCH_ENGINE_V1__ = true;
  w.__COMPANION_ARCH_ENGINE_VER__ = "A2";

  var LOG = (w.__COMPANION_ARCH_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  var LEVELS = {
    1: { id: "iman_tawhid", label: "Īmān & Tawḥīd", short: "Foundation", jibril: "Īmān", hint: "Know Allah · believe · orient the heart" },
    2: { id: "islam_fard", label: "Islām · farḍ practice", short: "Obligations", jibril: "Islām", hint: "Pillars · protect what is required" },
    3: { id: "sunnah_character", label: "Sunnah & character", short: "Prophetic path", jibril: "Sunnah", hint: "Seerah · adab · tongue · household" },
    4: { id: "ihsan_tazkiya", label: "Iḥsān · purification", short: "Excellence", jibril: "Iḥsān", hint: "Tawbah · dhikr · night · grave focus" },
    5: { id: "tools_craft", label: "Tools & craft", short: "Aids", jibril: "—", hint: "Studios serve learning — not the goal" },
    6: { id: "transmission", label: "Transmission with adab", short: "Daʿwah aid", jibril: "—", hint: "Source · audience · limit" }
  };

  var RULES = [
    { level: 1, re: /command|sami.?n|beautiful names|asma|asm[aā]|tawhid|iman|belief|ya ayyuh|allah.?s commands|daily name of the prophet|hadith spark|live [aā]yah|foundation for a daily/i },
    { level: 2, re: /pillar|fard|farḍ|wudu|wu[dḍ]u|salah|salat|prayer|hajj checklist|building on pillars|stability before|guarding the tongue|small deeds steady|protect the five|one pause/i },
    { level: 3, re: /seerah|s[iī]rah|prophetic|mercy on the path|family tree|previous nations|life events|tibb|household|character lesson|model consistency|public speech/i },
    { level: 4, re: /tawbah|soul compass|grave|istighfar|dhikr|zikr|night|if i die|furnishing|deposit|ihsan|purif|note for the grave/i },
    { level: 5, re: /meme|callig|tweet desk|studio|tajweed|voice translator|hifz|quiz|sharia iq|guided search|search the quran|search authentic|masn[uū]n|pedigree/i },
    { level: 6, re: /da.?i|transmit|transmission|shareable|source · audience|calling with adab|open in grok|tweet desk/i }
  ];

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
  function sortKey(level, path) {
    if (path === "dai" && level === 6) return 3.5;
    if ((path === "seeker" || path === "new_muslim") && level === 6) return 6.5;
    if (path === "practicing" && level === 5) return 5.2;
    return level;
  }
  function tHash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return "t" + h;
  }

  function cardCandidates(root) {
    var nodes = root.querySelectorAll(
      ".card, [data-rrra], section.card, #cs-mount [id$='-card'], #cs-mount details.card"
    );
    var out = [];
    var seen = {};
    Array.prototype.forEach.call(nodes, function (n) {
      if (n.id === "daily-muslim-foundation") return;
      if ((n.textContent || "").trim().length < 40) return;
      var key = n.id || n.getAttribute("data-rrra") || tHash(textOf(n).slice(0, 50));
      if (seen[key]) return;
      seen[key] = 1;
      out.push(n);
    });
    return out;
  }

  /* —— Surprise: Daily Muslim Foundation plaque —— */
  function ensureFoundation(mount) {
    var existing = d.getElementById("daily-muslim-foundation");
    if (existing) return existing;
    var el = d.createElement("section");
    el.id = "daily-muslim-foundation";
    el.className = "card daily-muslim-foundation";
    el.setAttribute("data-arch-level", "1");
    el.setAttribute("data-arch-id", "iman_tawhid");
    el.innerHTML =
      '<div class="arch-badge"><span class="ab-lv">L1</span> <span class="ab-name">Foundation for a daily Muslim life</span> <span class="ab-j">Jibrīl frame</span></div>' +
      "<h2>A day ordered toward Allah</h2>" +
      '<p class="dmf-lead">Educational mirror only — not a fatwa. Live the ladder; tools stay servants.</p>' +
      '<ol class="dmf-ladder">' +
      "<li><strong>Īmān</strong> — Begin with Allah: a verse, a Name, a ḥadīth that orients the heart.</li>" +
      "<li><strong>Islām</strong> — Protect the farḍ: prayer, purity, and the duties you already know. Stability before volume.</li>" +
      "<li><strong>Sunnah character</strong> — Walk with the Prophet ﷺ: tongue, household, mercy without ugliness.</li>" +
      "<li><strong>Iḥsān</strong> — Return often: tawbah, dhikr, one deed you would want in the grave.</li>" +
      "<li><strong>Aids</strong> — Tajweed, ḥifẓ, search, studios — only to serve the above.</li>" +
      "<li><strong>Transmission</strong> — Share with source, audience, and adab — after you practice.</li>" +
      "</ol>" +
      '<p class="dmf-sunnah">The most beloved deeds to Allah are those done consistently, even if small. Prefer ṣaḥīḥ reports; verify on Sunnah.com and with a teacher.</p>' +
      '<p class="disc">Educational only — not a fatwa. Qur’an · Sunnah · local scholar.</p>';
    /* insert at top of mounted wrap if possible */
    var wrap = mount.querySelector("[data-cs-mounted]") || mount;
    if (wrap.firstChild) wrap.insertBefore(el, wrap.firstChild);
    else wrap.appendChild(el);
    return el;
  }

  function ensureRibbon(mount) {
    var rib = d.getElementById("companion-arch-ribbon");
    if (!rib) {
      rib = d.createElement("div");
      rib.id = "companion-arch-ribbon";
      rib.className = "companion-arch-ribbon";
      rib.setAttribute("role", "navigation");
      rib.setAttribute("aria-label", "Educational priority ladder — not a fatwa");
      if (mount.parentNode) mount.parentNode.insertBefore(rib, mount);
    }
    return rib;
  }

  function paintRibbon(audit, path) {
    var rib = ensureRibbon(d.getElementById("cs-mount"));
    if (!rib) return;
    var counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    audit.forEach(function (a) {
      counts[a.level] = (counts[a.level] || 0) + 1;
    });
    var html =
      '<div class="car-head"><strong>Higher arch</strong> · governance L1–L6 · <span class="car-disc">not a fatwa</span></div>' +
      '<div class="car-jibril">Hadith Jibrīl: <em>Islām</em> → <em>Īmān</em> → <em>Iḥsān</em> · farḍ before volume · adab in transmission</div>' +
      '<div class="car-steps">';
    Object.keys(LEVELS).forEach(function (k) {
      var L = LEVELS[k];
      html +=
        '<button type="button" class="car-step" data-arch-jump="' +
        k +
        '" title="' +
        L.hint +
        '"><span class="car-num">L' +
        k +
        '</span><span class="car-lab">' +
        L.short +
        '</span><span class="car-count">' +
        (counts[k] || 0) +
        "</span></button>";
    });
    html +=
      "</div><p class=\"car-foot\">Path <strong>" +
      path +
      "</strong> · ordered for deep learning continuity · nothing removed · verify with Qur’an, Sunnah, scholar</p>";
    rib.innerHTML = html;
    rib.querySelectorAll("[data-arch-jump]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lv = btn.getAttribute("data-arch-jump");
        var first = d.querySelector('#cs-mount [data-arch-level="' + lv + '"]');
        if (first && first.scrollIntoView) first.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function tagAndOrder(root, path) {
    var cards = cardCandidates(root);
    var audit = [];
    cards.forEach(function (el) {
      var level = classify(el);
      el.setAttribute("data-arch-level", String(level));
      el.setAttribute("data-arch-id", LEVELS[level].id);
      var badge = el.querySelector(":scope > .arch-badge");
      if (!badge) {
        badge = d.createElement("div");
        badge.className = "arch-badge";
        el.insertBefore(badge, el.firstChild);
      }
      badge.innerHTML =
        '<span class="ab-lv">L' +
        level +
        '</span> <span class="ab-name">' +
        LEVELS[level].label +
        '</span> <span class="ab-j">' +
        LEVELS[level].jibril +
        "</span>";
      audit.push({
        level: level,
        id: el.id || null,
        title: ((el.querySelector("h2,h3") || {}).textContent || "").trim().slice(0, 80)
      });
    });

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
          /* foundation plaque always first */
          if (a.id === "daily-muslim-foundation") return -1;
          if (b.id === "daily-muslim-foundation") return 1;
          var ka = sortKey(parseInt(a.getAttribute("data-arch-level"), 10), path);
          var kb = sortKey(parseInt(b.getAttribute("data-arch-level"), 10), path);
          return ka - kb;
        })
        .forEach(function (ch) {
          parent.appendChild(ch);
        });
    });

    paintRibbon(audit, path);
    w.__COMPANION_ARCH_AUDIT__ = {
      version: "A2-20261116",
      path: path,
      count: audit.length,
      items: audit,
      governance: "GOVERNANCE_CONTRACT.md §6 Higher Arch",
      disclaimer: "Educational hierarchy only — not a fatwa."
    };
    log("arch-scan:" + audit.length);
  }

  function run() {
    var mount = d.getElementById("cs-mount");
    if (!mount) return;
    var path = pathBias();
    ensureFoundation(mount);
    var root = mount.querySelector("[data-cs-mounted]") || mount;
    tagAndOrder(root, path);
  }

  function watch() {
    var mount = d.getElementById("cs-mount");
    if (!mount) return;
    var t = null;
    new MutationObserver(function () {
      if (t) clearTimeout(t);
      t = setTimeout(run, 90);
    }).observe(mount, { childList: true, subtree: true });
    run();
    setTimeout(run, 500);
    setTimeout(run, 1600);
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

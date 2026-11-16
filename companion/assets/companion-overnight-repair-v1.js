/*! companion-overnight-repair-v1
 * Honest hold: path may emphasize — must not empty the room.
 * Re-asserts enrichment, deep-learn cards, icons after every mount race.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_OVERNIGHT_REPAIR_V1__) return;
  w.__COMPANION_OVERNIGHT_REPAIR_V1__ = true;

  var LOG = (w.__COMPANION_OVERNIGHT_LOG = []);
  function log(m) {
    try {
      LOG.push(String(m));
    } catch (e) {}
  }

  var HERO = {
    reminder: { ico: "✦", title: "Reminder", lead: "What Allah and His Messenger taught — Qur’ān, commands, Names, and living words.", chips: ["Section", "Educational only"] },
    reality: { ico: "◉", title: "Reality", lead: "Walk with the Prophet ﷺ — seerah, mercy, and lessons from the path.", chips: ["Section", "Educational only"] },
    reflection: { ico: "☾", title: "Reflection", lead: "Return and prepare — tawbah, dhikr, and light for the grave.", chips: ["Section", "Educational only"] },
    action: { ico: "➤", title: "Action", lead: "Practice — deeds, tajweed, ḥifẓ, and tools you can use today.", chips: ["Section", "Educational only"] },
    notes: { ico: "✎", title: "Notes", lead: "Private ledger of return — short lines, not rulings.", chips: ["On-device", "Educational only"] },
    about: { ico: "ℹ", title: "About", lead: "Companion charter — educational only, not a fatwa.", chips: ["Charter"] }
  };

  var CARDS = {
    reminder: [
      { id: "dl-purpose-worship", arch: 1, title: "Why we were created", body: "Allah created jinn and mankind only to worship Him. Renew that purpose before the day’s tasks fill the mind.", ref: "Qur’an 51:56", link: "https://quran.com/51/56" },
      { id: "dl-remember-allah", arch: 1, title: "Remember Me — I will remember you", body: "Dhikr is reciprocal remembrance. A short tasbīḥ after ṣalāh is a practical start.", ref: "Qur’an 2:152", link: "https://quran.com/2/152" },
      { id: "dl-intentions", arch: 2, title: "Actions are by intentions", body: "Every deed turns on intention. Before a reply or a plan, ask: for Whom is this?", ref: "Bukhārī 1 · Muslim 1907", link: "https://sunnah.com/bukhari:1" }
    ],
    reality: [
      { id: "dl-mercy-prophet", arch: 3, title: "A mercy to the worlds", body: "The Prophet ﷺ was sent as a mercy. Take one seerah moment into the tongue and the home.", ref: "Qur’an 21:107", link: "https://quran.com/21/107" },
      { id: "dl-follow-prophet", arch: 3, title: "If you love Allah — follow the Messenger", body: "Love is proven in following. One sunnah in manners outweighs many arguments.", ref: "Qur’an 3:31", link: "https://quran.com/3/31" }
    ],
    reflection: [
      { id: "dl-hearts-rest", arch: 4, title: "Hearts find rest in dhikr", body: "The Qur’an ties tranquil hearts to the remembrance of Allah.", ref: "Qur’an 13:28", link: "https://quran.com/13/28" },
      { id: "dl-with-hardship", arch: 4, title: "With hardship, ease", body: "Ease is paired with hardship. Hold this when the night feels long.", ref: "Qur’an 94:5–6", link: "https://quran.com/94/5" },
      { id: "dl-continuing-charity", arch: 4, title: "Deeds that continue after death", body: "Ongoing charity, beneficial knowledge, and a righteous child who prays for them benefit after death.", ref: "Muslim 1631", link: "https://sunnah.com/muslim:1631" }
    ],
    action: [
      { id: "dl-establish-prayer", arch: 2, title: "Establish the prayer", body: "Protect the five first. Optional volume never replaces a neglected farḍ.", ref: "Qur’an 2:43", link: "https://quran.com/2/43" },
      { id: "dl-quran-guides", arch: 2, title: "This Qur’an guides to what is most upright", body: "Open a page intending to act on one line — not only to finish a portion.", ref: "Qur’an 17:9", link: "https://quran.com/17/9" },
      { id: "dl-do-not-burden", arch: 2, title: "Allah does not burden a soul beyond its capacity", body: "Prefer a small consistent deed over a plan you will abandon.", ref: "Qur’an 2:286", link: "https://quran.com/2/286" }
    ],
    notes: [
      { id: "dl-write-return", arch: 5, title: "Write what helps you return", body: "One honest line after a slip beats a long unused journal. Private aid — not a ruling.", ref: "Educational practice", link: "https://sunnah.com/" }
    ],
    about: [
      { id: "dl-verify-sources", arch: 1, title: "Verify before you share", body: "Prefer primary texts. Confirm on Quran.com and Sunnah.com. Ask a local scholar for rulings.", ref: "Room charter", link: "https://quran.com/" }
    ]
  };

  function showAll() {
    var root = d.getElementById("cs-mount");
    if (!root) return 0;
    var n = 0;
    root.querySelectorAll("*").forEach(function (el) {
      if (el.classList && el.classList.contains("cpp-path-hidden")) {
        el.classList.remove("cpp-path-hidden");
        n++;
      }
      if (el.hasAttribute && el.hasAttribute("hidden") && (el.classList.contains("card") || el.id || el.getAttribute("data-rrra") || el.id === "dl-deep-learn-host")) {
        el.removeAttribute("hidden");
        n++;
      }
      if (el.style && (el.style.display === "none" || /display:\s*none/i.test(el.getAttribute("style") || ""))) {
        /* unhide educational surfaces only */
        if (
          el.classList.contains("card") ||
          el.classList.contains("cs-plaque") ||
          el.getAttribute("data-rrra") ||
          (el.id && /card|box|studio|host|hero|command|hadith|seerah|lesson|verse|asma|zikr|quiz|hifz|hajj|meme|callig/i.test(el.id)) ||
          el.id === "dl-deep-learn-host"
        ) {
          el.style.removeProperty("display");
          n++;
        }
      }
    });
    return n;
  }

  function killPathHide() {
    var G = w.ClarityPathGovernanceShell;
    if (!G) return;
    if (G.__overnightPatched) return;
    G.apply = function () {
      showAll();
      softPath();
      log("gov-apply-neutralized");
    };
    G.__overnightPatched = true;
    log("gov-killed-hide");
  }

  function softPath() {
    /* no-op visual: all visible; optional emphasis class cleared of hides */
    var root = d.getElementById("cs-mount");
    if (!root) return;
    root.querySelectorAll(".cpp-path-hidden").forEach(function (el) {
      el.classList.remove("cpp-path-hidden");
      el.style.removeProperty("display");
      el.removeAttribute("hidden");
    });
  }

  function tabName() {
    var mount = d.getElementById("cs-mount");
    if (!mount) return "reminder";
    var body = mount.querySelector("[data-tab], [data-cs-tab-body]");
    if (body) {
      var t = body.getAttribute("data-tab");
      if (t) return t;
    }
    var act = d.querySelector("#clarity-door-rail button.is-active, [data-rail-tab].is-active");
    if (act) return act.getAttribute("data-rail-tab") || "reminder";
    return "reminder";
  }

  function ensureHero(root, tab) {
    var meta = HERO[tab] || HERO.reminder;
    var hero = root.querySelector("#cs-tab-hero, header.cs-tab-hero");
    if (!hero) {
      hero = d.createElement("header");
      hero.id = "cs-tab-hero";
      hero.className = "cs-plaque cs-tab-hero dl-tab-hero on-tab-hero";
      root.insertBefore(hero, root.firstChild);
    }
    hero.classList.add("dl-tab-hero", "on-tab-hero");
    /* always refresh so content is never blank */
    hero.innerHTML =
      '<div class="cs-plaque-head"><span class="cs-ico" aria-hidden="true">' +
      meta.ico +
      "</span><div><h1>" +
      meta.title +
      '</h1><p class="lead">' +
      meta.lead +
      '</p><div class="cs-chip-row">' +
      meta.chips
        .map(function (c) {
          return '<span class="cs-chip">' + c + "</span>";
        })
        .join("") +
      "</div></div></div>";
  }

  function ensureDeepLearn(root, tab) {
    var list = CARDS[tab] || CARDS.reminder;
    var host = d.getElementById("dl-deep-learn-host");
    if (!host || !root.contains(host)) {
      host = d.createElement("section");
      host.id = "dl-deep-learn-host";
      host.className = "dl-deep-learn-host";
      host.setAttribute("data-arch-level", "1");
      var hero = root.querySelector("#cs-tab-hero");
      if (hero && hero.parentNode === root) hero.insertAdjacentElement("afterend", host);
      else root.insertBefore(host, root.firstChild);
    }
    host.style.removeProperty("display");
    host.removeAttribute("hidden");
    host.classList.remove("cpp-path-hidden");
    var sig = tab + ":" + list.length;
    if (host.getAttribute("data-on-sig") === sig && host.querySelector(".dl-card")) return;
    var html =
      '<div class="dl-host-head"><strong>Deep learning · primary texts</strong> <span class="disc">Educational only — not a fatwa</span></div>';
    list.forEach(function (c) {
      html +=
        '<article class="card dl-card" id="' +
        c.id +
        '" data-arch-level="' +
        c.arch +
        '"><h2>' +
        c.title +
        "</h2><p>" +
        c.body +
        '</p><p class="dl-ref"><a href="' +
        c.link +
        '" target="_blank" rel="noopener noreferrer">' +
        c.ref +
        "</a></p><p class=\"disc\">Verify on the source site · not a ruling</p></article>";
    });
    host.innerHTML = html;
    host.setAttribute("data-on-sig", sig);
    log("deep-learn:" + tab + ":" + list.length);
  }

  function iconizePaths() {
    var MAP = {
      seeker: "✦",
      new_muslim: "▮",
      practicing: "◎",
      daily: "◎",
      dai: "⬡"
    };
    d.querySelectorAll("[data-cs-path]").forEach(function (btn) {
      if (btn.querySelector(".on-path-ico")) return;
      var p = (btn.getAttribute("data-cs-path") || "").toLowerCase();
      var s = d.createElement("span");
      s.className = "on-path-ico";
      s.setAttribute("aria-hidden", "true");
      s.textContent = MAP[p] || "•";
      btn.insertBefore(s, btn.firstChild);
    });
  }

  function iconizeDoor() {
    d.querySelectorAll("#clarity-door-rail [data-rail-tab]").forEach(function (btn) {
      btn.classList.add("cs-door-btn");
      if (!btn.querySelector(".dr-label") && btn.childNodes.length) {
        /* leave ux-rail / iconize to handle; ensure label class */
      }
    });
  }

  function run() {
    killPathHide();
    var restored = showAll();
    softPath();
    var mount = d.getElementById("cs-mount");
    if (!mount) return;
    var root = mount.querySelector("[data-cs-tab-body]")
      ? mount.querySelector("[data-cs-tab-body]").parentElement || mount
      : mount.querySelector("[data-cs-mounted]") || mount;
    /* prefer the element that contains tab body */
    var body = mount.querySelector("[data-cs-tab-body], [data-tab]");
    if (body) root = body.parentElement || body;
    var tab = tabName();
    ensureHero(body || root, tab);
    ensureDeepLearn(body || root, tab);
    iconizePaths();
    iconizeDoor();
    w.__COMPANION_OVERNIGHT_STATUS__ = {
      version: "ON1",
      tab: tab,
      restored: restored,
      deepLearn: !!(d.getElementById("dl-deep-learn-host") && d.querySelector("#dl-deep-learn-host .dl-card")),
      pathHideDisabled: !!(w.ClarityPathGovernanceShell && w.ClarityPathGovernanceShell.__overnightPatched)
    };
    log("run:" + tab + ":restored=" + restored);
  }

  function boot() {
    run();
    var n = 0;
    var iv = setInterval(function () {
      n++;
      run();
      if (n > 40) clearInterval(iv);
    }, 250);
    var mount = d.getElementById("cs-mount");
    if (mount) {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(run, 40);
      }).observe(mount, { childList: true, subtree: true });
    }
    d.addEventListener(
      "click",
      function (ev) {
        if (ev.target && ev.target.closest && ev.target.closest("[data-rail-tab],[data-cs-path]")) {
          setTimeout(run, 60);
          setTimeout(run, 300);
        }
      },
      true
    );
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);

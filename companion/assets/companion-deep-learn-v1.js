/*! companion-deep-learn-v1
 * Archive3-style tab heroes + sourced deep-learning cards (Qur'an & well-known ṣaḥīḥ reports).
 * Educational only — not a fatwa. Verify on Quran.com / Sunnah.com / local scholar.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_DEEP_LEARN_V1__) return;
  w.__COMPANION_DEEP_LEARN_V1__ = true;

  var HERO = {
    reminder: {
      ico: "✦",
      title: "Reminder",
      lead: "Orient the heart — commands, Names, and ḥadīth sparks for the day.",
      chips: ["Īmān", "Commands", "Educational only"]
    },
    reality: {
      ico: "◉",
      title: "Reality",
      lead: "Walk with the Prophet ﷺ — seerah, mercy, and lessons from the path.",
      chips: ["Seerah", "Character", "Educational only"]
    },
    reflection: {
      ico: "☾",
      title: "Reflection",
      lead: "Return and prepare — tawbah, dhikr, and light for the grave.",
      chips: ["Iḥsān", "Night", "Educational only"]
    },
    action: {
      ico: "➤",
      title: "Action",
      lead: "Practice today — deeds, tajweed, ḥifẓ, and tools that serve obedience.",
      chips: ["Practice", "Tools", "Educational only"]
    },
    notes: {
      ico: "✎",
      title: "Notes",
      lead: "Private ledger of return — short lines, not rulings.",
      chips: ["On-device", "Educational only"]
    },
    about: {
      ico: "ℹ",
      title: "About",
      lead: "Companion charter — five rooms, educational only, not a fatwa.",
      chips: ["Charter", "Sources"]
    }
  };

  /* Sourced educational cards — short, primary-text oriented */
  var CARDS = {
    reminder: [
      {
        id: "dl-purpose-worship",
        arch: 1,
        title: "Why we were created",
        body: "Allah says that He created jinn and mankind only to worship Him. Begin the day by renewing that purpose before tasks fill the mind.",
        ref: "Qur’an 51:56",
        link: "https://quran.com/51/56"
      },
      {
        id: "dl-remember-allah",
        arch: 1,
        title: "Remember Me — I will remember you",
        body: "Dhikr is not decoration. It is the reciprocal remembrance Allah promised. A short tasbīḥ after ṣalāh is a practical start.",
        ref: "Qur’an 2:152",
        link: "https://quran.com/2/152"
      },
      {
        id: "dl-intentions",
        arch: 2,
        title: "Actions are by intentions",
        body: "Every deed turns on intention. Before a reply, a post, or a plan, ask: for Whom is this?",
        ref: "Bukhārī 1 · Muslim 1907",
        link: "https://sunnah.com/bukhari:1"
      }
    ],
    reality: [
      {
        id: "dl-mercy-prophet",
        arch: 3,
        title: "A mercy to the worlds",
        body: "The Prophet ﷺ was sent as a mercy. Study one seerah moment not to collect stories, but to soften the tongue and the home.",
        ref: "Qur’an 21:107",
        link: "https://quran.com/21/107"
      },
      {
        id: "dl-best-character",
        arch: 3,
        title: "The most complete in faith",
        body: "The Prophet ﷺ linked completeness of īmān to good character. Character is not optional polish after ritual.",
        ref: "Well-known ḥadīth on character (see graded collections)",
        link: "https://sunnah.com/"
      },
      {
        id: "dl-follow-prophet",
        arch: 3,
        title: "If you love Allah — follow the Messenger",
        body: "Love of Allah is proven in following the Prophet ﷺ. One sunnah revived in manners outweighs many arguments.",
        ref: "Qur’an 3:31",
        link: "https://quran.com/3/31"
      }
    ],
    reflection: [
      {
        id: "dl-hearts-rest",
        arch: 4,
        title: "Hearts find rest in dhikr",
        body: "Anxiety is not cured by more noise. The Qur’an ties tranquil hearts to the remembrance of Allah.",
        ref: "Qur’an 13:28",
        link: "https://quran.com/13/28"
      },
      {
        id: "dl-with-hardship",
        arch: 4,
        title: "With hardship, ease",
        body: "Ease is paired with hardship — not always after everything ends, but alongside the trial. Hold this when the night feels long.",
        ref: "Qur’an 94:5–6",
        link: "https://quran.com/94/5"
      },
      {
        id: "dl-continuing-charity",
        arch: 4,
        title: "Deeds that continue after death",
        body: "Among what benefits a person after death is ongoing charity, beneficial knowledge, and a righteous child who prays for them.",
        ref: "Muslim 1631",
        link: "https://sunnah.com/muslim:1631"
      }
    ],
    action: [
      {
        id: "dl-establish-prayer",
        arch: 2,
        title: "Establish the prayer",
        body: "Protect the five first. Volume of optional deeds never replaces a neglected farḍ. Stability before intensity.",
        ref: "Qur’an 2:43 · pillars of Islām (Jibrīl)",
        link: "https://quran.com/2/43"
      },
      {
        id: "dl-quran-guides",
        arch: 2,
        title: "This Qur’an guides to what is most upright",
        body: "Open a page with the intention to act on one line — not only to finish a portion.",
        ref: "Qur’an 17:9",
        link: "https://quran.com/17/9"
      },
      {
        id: "dl-do-not-burden",
        arch: 2,
        title: "Allah does not burden a soul beyond its capacity",
        body: "Build streaks you can keep. A small consistent deed is beloved; abandonable mega-plans are not strength.",
        ref: "Qur’an 2:286",
        link: "https://quran.com/2/286"
      }
    ],
    notes: [
      {
        id: "dl-write-what-benefits",
        arch: 5,
        title: "Write what helps you return",
        body: "A single line after a slip — what happened, what you will do next — is better than a long unused journal. This is a private aid, not a record for others.",
        ref: "Educational practice note",
        link: "https://sunnah.com/"
      }
    ],
    about: [
      {
        id: "dl-verify-sources",
        arch: 1,
        title: "Verify before you share",
        body: "Clarity is an educational companion. Prefer primary texts. Confirm verses on Quran.com and reports on Sunnah.com, and ask a local scholar for rulings.",
        ref: "Room charter · not a fatwa",
        link: "https://quran.com/"
      }
    ]
  };

  function enhanceHero(root, tab) {
    var meta = HERO[tab];
    if (!meta) return;
    var hero = root.querySelector("#cs-tab-hero, header.cs-tab-hero, .cs-plaque.cs-tab-hero");
    if (!hero) {
      hero = d.createElement("header");
      hero.id = "cs-tab-hero";
      hero.className = "cs-plaque cs-tab-hero dl-tab-hero";
      if (root.firstChild) root.insertBefore(hero, root.firstChild);
      else root.appendChild(hero);
    }
    hero.classList.add("dl-tab-hero");
    if (!hero.querySelector(".cs-plaque-head")) {
      hero.innerHTML =
        '<div class="cs-plaque-head">' +
        '<span class="cs-ico" aria-hidden="true">' +
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
    } else {
      /* polish existing */
      var h1 = hero.querySelector("h1");
      if (h1 && !h1.textContent.trim()) h1.textContent = meta.title;
      hero.classList.add("dl-tab-hero");
    }
  }

  function injectCards(root, tab) {
    var list = CARDS[tab] || [];
    if (!list.length) return;
    var host = root.querySelector("#dl-deep-learn-host");
    if (!host) {
      host = d.createElement("section");
      host.id = "dl-deep-learn-host";
      host.className = "dl-deep-learn-host";
      host.setAttribute("data-arch-level", "1");
      var hero = root.querySelector("#cs-tab-hero, .cs-tab-hero");
      if (hero && hero.nextSibling) root.insertBefore(host, hero.nextSibling);
      else if (hero) hero.after(host);
      else root.insertBefore(host, root.firstChild);
    }
    if (host.getAttribute("data-dl-filled") === "1") return;
    var html =
      '<div class="dl-host-head"><strong>Deep learning · primary texts</strong> <span class="disc">Educational only — not a fatwa</span></div>';
    list.forEach(function (c) {
      html +=
        '<article class="card dl-card" id="' +
        c.id +
        '" data-arch-level="' +
        c.arch +
        '">' +
        '<div class="arch-badge"><span class="ab-lv">L' +
        c.arch +
        '</span> <span class="ab-name">Deep learning</span></div>' +
        "<h2>" +
        c.title +
        "</h2>" +
        "<p>" +
        c.body +
        "</p>" +
        '<p class="dl-ref"><a href="' +
        c.link +
        '" target="_blank" rel="noopener noreferrer">' +
        c.ref +
        "</a> · verify wording on the source site</p>" +
        '<p class="disc">Not a ruling. Ask a local teacher when practice needs detail.</p>' +
        "</article>";
    });
    host.innerHTML = html;
    host.setAttribute("data-dl-filled", "1");
  }

  function detectTab(root) {
    var body = root.querySelector("[data-cs-tab-body], [data-tab]");
    if (body) {
      return body.getAttribute("data-tab") || body.getAttribute("data-cs-tab-body") || "";
    }
    var active = d.querySelector("#clarity-door-rail .is-active, [data-rail-tab].is-active");
    if (active) return active.getAttribute("data-rail-tab") || "";
    return "reminder";
  }

  function run() {
    var mount = d.getElementById("cs-mount");
    if (!mount) return;
    var root = mount.querySelector("[data-cs-mounted]") || mount;
    var tab = detectTab(root) || "reminder";
    enhanceHero(root, tab);
    injectCards(root, tab);
  }

  function boot() {
    run();
    var mount = d.getElementById("cs-mount");
    if (mount) {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(run, 80);
      }).observe(mount, { childList: true, subtree: true });
    }
    setTimeout(run, 500);
    setTimeout(run, 1500);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);

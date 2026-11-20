/* Admin Staff — Resource Scout
 * Crawls ALLOWLISTED authentic learning resources and proposes
 * daily module material upgrades into a local "inbox" — never mutates
 * sealed foundation files. Human (you) remains the registrar.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_STAFF_SCOUT__) return;
  g.__CLARITY_STAFF_SCOUT__ = true;

  var INBOX_KEY = "clarity_staff_scout_inbox_v1";
  var LAST_KEY = "clarity_staff_scout_last_v1";
  var DAY_MS = 86400000;

  var ALLOW = {
    "quran.com": 1,
    "www.quran.com": 1,
    "sunnah.com": 1,
    "www.sunnah.com": 1,
    "seekersguidance.org": 1,
    "www.seekersguidance.org": 1,
    "yaqeeninstitute.org": 1,
    "www.yaqeeninstitute.org": 1,
    "beginislam.org": 1,
    "www.beginislam.org": 1
  };

  /** Curated seed catalog — scout "crawls" these endpoints for freshness signals */
  var CATALOG = [
    {
      id: "quran-fatiha",
      phase: 1,
      title: "Qur'an — Al-Fatiha",
      url: "https://quran.com/1",
      moduleHint: "u1-l1",
      kind: "quran"
    },
    {
      id: "quran-ikhlas",
      phase: 1,
      title: "Qur'an — Al-Ikhlas",
      url: "https://quran.com/112",
      moduleHint: "u1-l1",
      kind: "quran"
    },
    {
      id: "quran-2-286",
      phase: 2,
      title: "Qur'an 2:286 capacity",
      url: "https://quran.com/2/286",
      moduleHint: "jh-u1-l1",
      kind: "quran"
    },
    {
      id: "seekers-new-muslim",
      phase: 2,
      title: "SeekersGuidance — New Muslims",
      url: "https://seekersguidance.org/",
      moduleHint: "jh-u1-l1",
      kind: "institute"
    },
    {
      id: "beginislam",
      phase: 2,
      title: "BeginIslam foundations",
      url: "https://beginislam.org/",
      moduleHint: "jh-u2-l1",
      kind: "institute"
    },
    {
      id: "yaqeen",
      phase: 3,
      title: "Yaqeen Institute",
      url: "https://yaqeeninstitute.org/",
      moduleHint: "hs-u2-l1",
      kind: "institute"
    },
    {
      id: "sunnah",
      phase: 4,
      title: "Sunnah.com — prophetic library",
      url: "https://sunnah.com/",
      moduleHint: "dai-u2-l1",
      kind: "hadith"
    },
    {
      id: "quran-16-125",
      phase: 4,
      title: "Qur'an 16:125 — call with wisdom",
      url: "https://quran.com/16/125",
      moduleHint: "dai-u1-l1",
      kind: "quran"
    }
  ];

  var state = {
    id: "scout",
    name: "Resource Scout",
    lastRun: 0,
    proposed: 0,
    errors: 0
  };

  function hostOk(url) {
    try {
      var u = new URL(url);
      return !!ALLOW[u.hostname];
    } catch (e) {
      return false;
    }
  }

  function readInbox() {
    try {
      return JSON.parse(localStorage.getItem(INBOX_KEY) || "[]") || [];
    } catch (e) {
      return [];
    }
  }
  function writeInbox(arr) {
    try {
      localStorage.setItem(INBOX_KEY, JSON.stringify(arr.slice(-50)));
    } catch (e) {}
  }

  function propose(item, meta) {
    var inbox = readInbox();
    var proposal = {
      id: item.id + "-" + Date.now(),
      sourceId: item.id,
      at: Date.now(),
      phase: item.phase,
      title: item.title,
      url: item.url,
      moduleHint: item.moduleHint,
      kind: item.kind,
      status: "proposed",
      note:
        "Scout proposal only — review before teaching. Does not alter sealed foundation. Verify with a qualified teacher for rulings.",
      meta: meta || {}
    };
    inbox.push(proposal);
    writeInbox(inbox);
    state.proposed += 1;
    return proposal;
  }

  /** HEAD/GET allowlisted URL — record status as freshness signal */
  function probe(item) {
    if (!hostOk(item.url)) {
      state.errors += 1;
      return Promise.resolve(null);
    }
    return fetch(item.url, { method: "GET", mode: "cors", cache: "no-cache" })
      .then(function (r) {
        return propose(item, {
          http: r.status,
          ok: r.ok,
          probed: true,
          contentType: r.headers.get("content-type")
        });
      })
      .catch(function () {
        /* CORS may block body — still propose as scheduled study link */
        state.errors += 1;
        return propose(item, {
          probed: false,
          ok: null,
          note: "Probe limited by browser CORS — link kept for manual study"
        });
      });
  }

  function runDaily(force) {
    var now = Date.now();
    try {
      var last = parseInt(localStorage.getItem(LAST_KEY) || "0", 10) || 0;
      if (!force && last && now - last < DAY_MS * 0.9) {
        try {
          console.info("%c Resource Scout ", "background:#1a4a6b;color:#e8f0ff", "already ran today");
        } catch (e) {}
        return Promise.resolve(readInbox());
      }
    } catch (e2) {}

    state.lastRun = now;
    try {
      localStorage.setItem(LAST_KEY, String(now));
    } catch (e3) {}

    /* Rotate: probe up to 3 catalog items per day based on day number */
    var day = Math.floor(now / DAY_MS);
    var picks = [];
    for (var i = 0; i < 3; i++) {
      picks.push(CATALOG[(day + i) % CATALOG.length]);
    }
    return Promise.all(picks.map(probe)).then(function () {
      try {
        console.info(
          "%c Resource Scout ",
          "background:#1a4a6b;color:#e8f0ff",
          "proposed",
          state.proposed,
          "inbox",
          readInbox().length
        );
      } catch (e4) {}
      try {
        g.dispatchEvent(
          new CustomEvent("clarity-staff-scout", { detail: { inbox: readInbox(), state: state } })
        );
      } catch (e5) {}
      return readInbox();
    });
  }

  g.ClarityStaffScout = {
    runDaily: runDaily,
    inbox: readInbox,
    catalog: CATALOG,
    state: function () {
      return state;
    },
    acceptProposal: function (id) {
      var inbox = readInbox();
      inbox.forEach(function (p) {
        if (p.id === id) p.status = "accepted-review";
      });
      writeInbox(inbox);
      return inbox;
    }
  };

  function boot() {
    setTimeout(function () {
      runDaily(false);
    }, 4000);
  }
  g.addEventListener("clarity-vault-ready", function () {
    setTimeout(function () {
      runDaily(false);
    }, 2500);
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);

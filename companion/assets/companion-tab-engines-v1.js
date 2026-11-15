/*! companion-tab-engines-v1 · Phase 4 live re-bind for shell mounts
 * Quran (alquran.cloud) · simple ḥadīth sparks · dhikr counters · seerah rotation
 * Educational only — not a fatwa. Companion isolation only.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_TAB_ENGINES_V1__) return;
  w.__COMPANION_TAB_ENGINES_V1__ = true;

  var QURAN_API = "https://api.alquran.cloud/v1/ayah/";
  /* Educational sample set — well-known short āyāt (not a fatwa corpus) */
  var AYAH_POOL = [
    "1:1", "1:5", "2:152", "2:186", "3:8", "3:173", "13:28", "16:125",
    "17:80", "18:10", "20:25", "21:87", "33:56", "39:53", "55:1", "94:5", "112:1", "113:1", "114:1"
  ];
  var HADITH_SPARKS = [
    { t: "Actions are but by intention.", s: "Bukhārī & Muslim — educational wording; verify on Sunnah.com" },
    { t: "The strong person is the one who controls himself when angry.", s: "Bukhārī & Muslim — educational; verify on Sunnah.com" },
    { t: "Make things easy and do not make them difficult.", s: "Bukhārī — educational; verify on Sunnah.com" },
    { t: "None of you truly believes until he loves for his brother what he loves for himself.", s: "Bukhārī & Muslim — educational; verify on Sunnah.com" },
    { t: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.", s: "Bukhārī & Muslim — educational; verify on Sunnah.com" }
  ];
  var SEERAH_MOMENTS = [
    { t: "Cave of Ḥirāʾ", b: "The first revelation began with Iqraʾ — read, in the name of your Lord who created." },
    { t: "Migration to Madinah", b: "Trust in Allah while tying the camel — tawakkul with means." },
    { t: "Treaty of Ḥudaybiyyah", b: "What looked like a setback opened a clear victory — patience with wisdom." },
    { t: "Conquest of Makkah", b: "Mercy at the peak of strength — go, for you are free." },
    { t: "Farewell Sermon", b: "Blood, property, and honour are sacred — a charter of human dignity." }
  ];
  var TAJWEED_RULES = [
    { t: "Ikhfāʾ", b: "Noon sākinah / tanwīn before the ikhfāʾ letters — hide the nūn with nasalisation." },
    { t: "Idghām", b: "Merging when noon sākinah / tanwīn meets ي ن م و (with ghunnah) or ل ر (without)." },
    { t: "Qalqalah", b: "Echo on ق ط ب ج د when sākin — lighter in middle, fuller at stop." },
    { t: "Ghunnah", b: "Nasalisation held on م and ن when shaddah — approximately two counts." },
    { t: "Madd ṭabīʿī", b: "Natural elongation of two counts on و ي ا when the conditions are met." }
  ];

  function $(sel, root) {
    return (root || d).querySelector(sel);
  }
  function dayIndex(n) {
    var day = Math.floor(Date.now() / 86400000);
    return ((day % n) + n) % n;
  }
  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function mountRoot() {
    return d.getElementById("cs-mount") || d;
  }

  /* —— Quran verse —— */
  function bindVerse(root) {
    var host = root.querySelector("[data-engine='verse']");
    if (!host) return;
    var refEl = host.querySelector("[data-verse-ref]");
    var arEl = host.querySelector("[data-verse-ar]");
    var enEl = host.querySelector("[data-verse-en]");
    var status = host.querySelector("[data-verse-status]");
    var btn = host.querySelector("[data-verse-next]");
    var i = dayIndex(AYAH_POOL.length);

    function load(idx) {
      var ref = AYAH_POOL[((idx % AYAH_POOL.length) + AYAH_POOL.length) % AYAH_POOL.length];
      if (status) status.textContent = "Loading " + ref + "…";
      if (refEl) refEl.textContent = ref;
      Promise.all([
        fetch(QURAN_API + ref + "/ar.uthmani", { cache: "force-cache" }).then(function (r) { return r.json(); }),
        fetch(QURAN_API + ref + "/en.sahih", { cache: "force-cache" }).then(function (r) { return r.json(); })
      ])
        .then(function (pair) {
          var ar = pair[0], en = pair[1];
          if (arEl) arEl.textContent = (ar.data && ar.data.text) || "";
          if (enEl) enEl.textContent = (en.data && en.data.text) || "";
          if (status) status.textContent = "Educational rendering · verify in a muṣḥaf";
        })
        .catch(function () {
          if (status) status.textContent = "Offline — open Quran.com for " + ref;
          if (enEl) enEl.textContent = "Could not fetch translation. Educational only — not a fatwa.";
        });
    }
    load(i);
    if (btn) {
      btn.addEventListener("click", function () {
        i = (i + 1) % AYAH_POOL.length;
        load(i);
      });
    }
  }

  /* —— Hadith spark —— */
  function bindHadith(root) {
    var host = root.querySelector("[data-engine='hadith']");
    if (!host) return;
    var t = host.querySelector("[data-hadith-text]");
    var s = host.querySelector("[data-hadith-src]");
    var btn = host.querySelector("[data-hadith-next]");
    var i = dayIndex(HADITH_SPARKS.length);
    function paint() {
      var h = HADITH_SPARKS[i % HADITH_SPARKS.length];
      if (t) t.textContent = h.t;
      if (s) s.textContent = h.s;
    }
    paint();
    if (btn) {
      btn.addEventListener("click", function () {
        i = (i + 1) % HADITH_SPARKS.length;
        paint();
      });
    }
  }

  /* —— Seerah —— */
  function bindSeerah(root) {
    var host = root.querySelector("[data-engine='seerah']");
    if (!host) return;
    var t = host.querySelector("[data-seerah-title]");
    var b = host.querySelector("[data-seerah-body]");
    var btn = host.querySelector("[data-seerah-next]");
    var i = dayIndex(SEERAH_MOMENTS.length);
    function paint() {
      var m = SEERAH_MOMENTS[i % SEERAH_MOMENTS.length];
      if (t) t.textContent = m.t;
      if (b) b.textContent = m.b;
    }
    paint();
    if (btn) {
      btn.addEventListener("click", function () {
        i = (i + 1) % SEERAH_MOMENTS.length;
        paint();
      });
    }
  }

  /* —— Dhikr counters —— */
  function bindDhikr(root) {
    var host = root.querySelector("[data-engine='dhikr']");
    if (!host) return;
    ["istighfar", "salawat", "zikr"].forEach(function (key) {
      var el = host.querySelector("[data-dhikr='" + key + "']");
      var btn = host.querySelector("[data-dhikr-inc='" + key + "']");
      var reset = host.querySelector("[data-dhikr-reset='" + key + "']");
      var LS = "cu_dhikr_" + key + "_v1";
      function read() {
        try {
          return parseInt(localStorage.getItem(LS) || "0", 10) || 0;
        } catch (e) {
          return 0;
        }
      }
      function write(n) {
        try {
          localStorage.setItem(LS, String(n));
        } catch (e) {}
        if (el) el.textContent = String(n);
      }
      write(read());
      if (btn)
        btn.addEventListener("click", function () {
          write(read() + 1);
        });
      if (reset)
        reset.addEventListener("click", function () {
          write(0);
        });
    });
  }

  /* —— Tajweed rule —— */
  function bindTajweed(root) {
    var host = root.querySelector("[data-engine='tajweed']");
    if (!host) return;
    var t = host.querySelector("[data-tj-title]");
    var b = host.querySelector("[data-tj-body]");
    var btn = host.querySelector("[data-tj-next]");
    var i = dayIndex(TAJWEED_RULES.length);
    function paint() {
      var r = TAJWEED_RULES[i % TAJWEED_RULES.length];
      if (t) t.textContent = r.t;
      if (b) b.textContent = r.b;
    }
    paint();
    if (btn) {
      btn.addEventListener("click", function () {
        i = (i + 1) % TAJWEED_RULES.length;
        paint();
      });
    }
  }

  /* —— Soul compass —— */
  function bindCompass(root) {
    var host = root.querySelector("[data-engine='compass']");
    if (!host) return;
    var status = host.querySelector("[data-compass-status]");
    host.querySelectorAll("[data-compass-gate]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var g = btn.getAttribute("data-compass-gate");
        if (status) {
          status.textContent =
            g === "hope"
              ? "Hold one hope for Allah’s mercy — and act on a small good."
              : g === "fear"
              ? "Name one fear honestly — then seek protection and istighfār."
              : "Return: say Lā ilāha illā Allāh with presence.";
        }
      });
    });
  }

  function hydrate() {
    var root = mountRoot();
    bindVerse(root);
    bindHadith(root);
    bindSeerah(root);
    bindDhikr(root);
    bindTajweed(root);
    bindCompass(root);
  }

  /* Observe shell mounts */
  function watch() {
    var mount = d.getElementById("cs-mount");
    if (!mount) return;
    var timer = null;
    var mo = new MutationObserver(function () {
      if (timer) clearTimeout(timer);
      timer = setTimeout(hydrate, 50);
    });
    mo.observe(mount, { childList: true });
    hydrate();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", watch);
  else watch();
  w.ClarityTabEngines = { hydrate: hydrate };
})(window, document);

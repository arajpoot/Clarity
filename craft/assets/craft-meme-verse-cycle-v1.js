/*! craft-meme-verse-cycle-v1.js · unstick verse · bank rotation
 * Problem: Companion sync / first-bank line always won → Qur’an 2:152 stuck on every scene.
 * Fix: rotate section bank; avoid last ref; scene-only must not re-fetch verse.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_VERSE_CYCLE_V1__) return;
  w.__CRAFT_MEME_VERSE_CYCLE_V1__ = true;

  var LAST_KEY = "clarity.craft.meme.last_ref.v1";

  function status(msg) {
    var el = d.getElementById("meme-source-status") || d.getElementById("meme-fetch-status");
    if (el) el.textContent = msg || "";
  }

  function getLastRef() {
    try {
      return w.localStorage.getItem(LAST_KEY) || "";
    } catch (e) {
      return "";
    }
  }
  function setLastRef(ref) {
    try {
      w.localStorage.setItem(LAST_KEY, ref || "");
    } catch (e) {}
  }

  function pickRotating(lines) {
    if (!lines || !lines.length) return null;
    var last = getLastRef();
    var pool = lines.filter(function (L) {
      return (L.ref || "") !== last;
    });
    if (!pool.length) pool = lines.slice();
    var line = pool[Math.floor(Math.random() * pool.length)];
    setLastRef(line.ref || line.en || "");
    return line;
  }

  function activeSection() {
    var active = d.querySelector("[data-meme-section].active, [data-rrra].active");
    if (active)
      return active.getAttribute("data-meme-section") || active.getAttribute("data-rrra") || "reminder";
    return "reminder";
  }

  function applyLine(line, sectionId, paint) {
    if (!line) return;
    w.__memeLayers = {
      ar: line.ar || "",
      en: line.en || "",
      ur: "",
      ref: line.ref || ""
    };
    /* clear sticky companion flag */
    try {
      var st = {};
      if (w.CraftMemeSource && w.CraftMemeSource.loadState) st = w.CraftMemeSource.loadState() || {};
      st.fromCompanion = false;
      st.layers = w.__memeLayers;
      st.section = sectionId;
      if (w.CraftMemeSource && w.CraftMemeSource.saveState) w.CraftMemeSource.saveState(st);
    } catch (e) {}
    try {
      if (w.CraftMemeSource && w.CraftMemeSource.formatLine && w.CraftMemeSource.applyToDesks) {
        w.CraftMemeSource.applyToDesks(w.CraftMemeSource.formatLine(line));
      }
    } catch (e2) {}
    try {
      if (w.CraftMemeUrduFetch) w.CraftMemeUrduFetch.loadForCurrentLayers(true);
    } catch (e3) {}
    if (paint !== false) {
      try {
        if (typeof w.craftMemeRepaintStandard === "function") w.craftMemeRepaintStandard();
        else if (typeof w.memeDraw === "function") w.memeDraw();
      } catch (e4) {}
    }
    status("Verse · " + (line.ref || sectionId) + " · rotated · educational only");
  }

  function loadFreshVerse(sectionId, paint) {
    sectionId = sectionId || activeSection();
    var secs =
      (w.CraftMemeSource && w.CraftMemeSource.sections) ||
      null;
    var lines = secs && secs[sectionId] && secs[sectionId].lines;
    if (!lines || !lines.length) {
      /* minimal fallback bank */
      lines = [
        { ar: "فَاذْكُرُونِي أَذْكُرْكُمْ", en: "So remember Me; I will remember you.", ref: "Qur’an 2:152" },
        { ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", en: "Verily, in the remembrance of Allah do hearts find rest.", ref: "Qur’an 13:28" },
        { ar: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ", en: "Every soul will taste death.", ref: "Qur’an 3:185" },
        { ar: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", en: "Indeed, Allah is with the patient.", ref: "Qur’an 2:153" },
        { ar: "فَاسْتَبِقُوا الْخَيْرَاتِ", en: "So race to [all that is] good.", ref: "Qur’an 2:148" }
      ];
    }
    var line = pickRotating(lines);
    applyLine(line, sectionId, paint);
    return line;
  }

  /* Patch fetchSection so companion does not permanently pin first line */
  function patchSource() {
    if (!w.CraftMemeSource || !w.CraftMemeSource.fetchSection) return;
    if (w.CraftMemeSource.fetchSection.__cycle) return;
    var orig = w.CraftMemeSource.fetchSection;
    w.CraftMemeSource.fetchSection = function (sectionId) {
      sectionId = sectionId || "reminder";
      var sec =
        (w.CraftMemeSource.sections && w.CraftMemeSource.sections[sectionId]) ||
        null;
      var line = pickRotating(sec && sec.lines ? sec.lines : null);
      if (!line) {
        try {
          return orig.call(w.CraftMemeSource, sectionId);
        } catch (e) {
          line = pickRotating(null);
        }
      }
      return {
        section: sectionId,
        label: (sec && sec.label) || sectionId,
        line: line,
        text: w.CraftMemeSource.formatLine
          ? w.CraftMemeSource.formatLine(line)
          : (line.en || "")
      };
    };
    w.CraftMemeSource.fetchSection.__cycle = true;

    if (w.CraftMemeSource.loadSection && !w.CraftMemeSource.loadSection.__cycle) {
      w.CraftMemeSource.loadSection = function (sectionId, paint) {
        var result = w.CraftMemeSource.fetchSection(sectionId || "reminder");
        if (result && result.line) applyLine(result.line, result.section, paint);
        return result;
      };
      w.CraftMemeSource.loadSection.__cycle = true;
    }
  }

  function bind() {
    patchSource();

    function rebind(id, handler) {
      var el = d.getElementById(id);
      if (!el) return;
      var clone = el.cloneNode(true);
      el.parentNode.replaceChild(clone, el);
      clone.addEventListener("click", handler);
    }

    rebind("meme-refresh-source", function () {
      loadFreshVerse(activeSection(), true);
    });
    rebind("meme-surprise-verse-only", function () {
      loadFreshVerse(activeSection(), true);
    });
    rebind("meme-full-surprise", function () {
      loadFreshVerse(activeSection(), true);
      try {
        if (typeof w.memeFetchBg === "function") w.memeFetchBg("surprise");
        else if (typeof w.__memeOnlineFetch === "function") w.__memeOnlineFetch("nature");
      } catch (e) {}
    });

    /* Scene-only / next bg: paint bg only — do NOT reload verse */
    rebind("meme-surprise-scene-only", function () {
      try {
        if (typeof w.memeFetchBg === "function") w.memeFetchBg("surprise");
        else if (typeof w.__memeOnlineFetch === "function") w.__memeOnlineFetch("nature");
      } catch (e) {}
      status("Scene only · verse held · educational only");
    });
    rebind("meme-next-bg", function () {
      try {
        if (typeof w.memeFetchBg === "function") w.memeFetchBg("nature");
        else if (typeof w.__memeOnlineFetch === "function") w.__memeOnlineFetch("nature");
      } catch (e) {}
      status("Next background · verse held");
    });
    rebind("meme-surprise-bg", function () {
      try {
        if (typeof w.memeFetchBg === "function") w.memeFetchBg("surprise");
      } catch (e) {}
      status("Scenery · verse held");
    });

    /* section chips — force rotation each click */
    d.querySelectorAll("[data-meme-section], [data-rrra]").forEach(function (btn) {
      if (btn.__cycle_bound) return;
      btn.__cycle_bound = true;
      btn.addEventListener(
        "click",
        function () {
          setTimeout(function () {
            var id = btn.getAttribute("data-meme-section") || btn.getAttribute("data-rrra") || "reminder";
            loadFreshVerse(id, true);
          }, 0);
        },
        true
      );
    });
  }

  function boot() {
    bind();
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(boot, 1200);
})(window, document);

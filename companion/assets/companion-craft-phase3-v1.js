/*! companion-craft-phase3-v1 · Phase 3
 * Meme/craft API integrity after a2 spine — companion room only.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_CRAFT_PHASE3_V1__) return;
  w.__CLARITY_CRAFT_PHASE3_V1__ = true;

  function roomOk() {
    try {
      var p = (w.location && w.location.pathname) || "";
      return p.indexOf("/companion") === 0;
    } catch (e) { return false; }
  }
  if (!roomOk()) return;

  var DAILY = [
    { ar: "فَاذْكُرُونِي أَذْكُرْكُمْ", en: "So remember Me; I will remember you.", ref: "Qur'an 2:152" },
    { ar: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", en: "Verily, in the remembrance of Allah do hearts find rest.", ref: "Qur'an 13:28" }
  ];

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function applyLine(line, bg) {
    if (!line) return;
    var ar = line.ar || "", en = line.en || "", ref = line.ref || "";
    try {
      if (typeof w.clarityMemeFill === "function") w.clarityMemeFill(ar, en, ref);
      else if (typeof w.memeApplyVerseCard === "function") w.memeApplyVerseCard(ar, en, "", ref);
      else {
        var t = d.getElementById("meme-top-input");
        var m = d.getElementById("meme-mid-input");
        var b = d.getElementById("meme-bottom-input");
        if (t) t.value = ar;
        if (m) m.value = en;
        if (b) b.value = ref;
        if (typeof w.memeDraw === "function") w.memeDraw();
      }
    } catch (e) {}
    if (bg && typeof w.memeFetchBg === "function") {
      try { w.memeFetchBg(bg); } catch (e2) {}
    }
  }

  function ensureApis() {
    if (typeof w.memeFetchBg !== "function") {
      w.memeFetchBg = function (kind) {
        kind = String(kind || "nature");
        var url = "https://picsum.photos/seed/c-" + kind + "-" + (Date.now() % 9999) + "/1200/900.jpg";
        try {
          if (typeof w.memeSetBackgroundUrl === "function") w.memeSetBackgroundUrl(url);
          else {
            var img = d.getElementById("meme-bg-img") || d.querySelector("#meme-stage-wrap img");
            if (img) img.src = url;
          }
        } catch (e) {}
        return Promise.resolve(url);
      };
    }
    if (typeof w.memeFetchRrra !== "function") {
      w.memeFetchRrra = function (lane) {
        applyLine(pick(DAILY), lane === "night" ? "night" : "holy");
        return Promise.resolve(true);
      };
    }
    if (typeof w.memeDailyVerse !== "function") {
      w.memeDailyVerse = function () { applyLine(pick(DAILY), "holy"); };
    }
    /* Reveal meme tools if CSS hid icons */
    try {
      d.querySelectorAll(".meme-chip-row .mv-chip, #meme-card .mv-chip").forEach(function (el) {
        el.style.display = "";
        el.removeAttribute("hidden");
      });
    } catch (e) {}
  }

  function boot() {
    ensureApis();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 60); });
  else setTimeout(boot, 60);
  d.addEventListener("clarity-a2-spine-ready", function () { setTimeout(boot, 40); });
  d.addEventListener("clarity-core-ready", function () { setTimeout(boot, 40); });
  w.addEventListener("load", function () { setTimeout(boot, 300); });
})(window, document);

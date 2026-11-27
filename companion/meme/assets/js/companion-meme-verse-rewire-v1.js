/*! companion-meme-verse-rewire-v1.js
 * Rewire verse packs + text areas for Reminder / Meme embed.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_MEME_VERSE_REWIRE_V1__) return;
  w.__CLARITY_MEME_VERSE_REWIRE_V1__ = true;

  var PACKS = {
    daily: {
      ar: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      en: "Indeed, with hardship comes ease.",
      ref: "Qur’an 94:6 · quran.com/94/6"
    },
    fatiha: {
      ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      en: "All praise is due to Allah, Lord of the worlds.",
      ref: "Qur’an 1:2 · quran.com/1/2",
      bot: "تمام تعریف اللہ کے لیے ہے، جو تمام جہانوں کا رب ہے۔"
    },
    ikhlas: {
      ar: "قُلْ هُوَ اللَّهُ أَحَدٌ",
      en: "Say, He is Allah, [who is] One.",
      ref: "Qur’an 112:1 · quran.com/112/1"
    },
    kursi: {
      ar: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
      en: "Allah — there is no deity except Him, the Ever-Living, the Sustainer.",
      ref: "Qur’an 2:255 · quran.com/2/255"
    },
    adhkar: {
      ar: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      en: "Glory be to Allah and praise be to Him.",
      ref: "Bukhārī & Muslim · educational wording"
    }
  };

  function $(id) { return d.getElementById(id); }

  function setText(ar, en, ref) {
    var top = $("meme-top") || $("meme-top-input");
    var mid = $("meme-mid") || $("meme-mid-input");
    var bottom = $("meme-ref") || $("meme-bottom-input") || $("meme-bottom");
    if (top) top.value = ar || "";
    if (mid) mid.value = en || "";
    if (bottom) bottom.value = ref || "";
    try {
      if (!w.memeState) w.memeState = {};
      w.memeState.top = ar || "";
      w.memeState.mid = en || "";
      w.memeState.ref = ref || "";
      w.memeState.bottom = ref || "";
    } catch (e) {}
    try {
      if (typeof w.memeRender === "function") w.memeRender();
      else if (typeof w.memePaint === "function") w.memePaint();
    } catch (e2) {}
    var st = $("meme-fetch-status");
    if (st && (ar || en)) st.textContent = "Verse loaded · educational only — not a fatwa";
  }

  function applyPack(name) {
    var p = PACKS[String(name || "daily").toLowerCase()] || PACKS.daily;
    setText(p.ar, p.en, p.ref);
  }

  function wire() {
    d.querySelectorAll("[data-meme-pack]").forEach(function (btn) {
      if (btn.__verseWired) return;
      btn.__verseWired = true;
      btn.addEventListener("click", function () {
        applyPack(btn.getAttribute("data-meme-pack"));
      });
    });
    d.querySelectorAll("[data-meme-bg]").forEach(function (btn) {
      if (btn.__bgWired) return;
      btn.__bgWired = true;
      btn.addEventListener("click", function () {
        var kind = btn.getAttribute("data-meme-bg") || "nature";
        if (kind === "wikimedia" || kind === "wiki") {
          if (typeof w.memeFetchWikimedia === "function") w.memeFetchWikimedia();
          else if (typeof w.memeFetchBg === "function") w.memeFetchBg("free");
          return;
        }
        if (typeof w.memeFetchBg === "function") w.memeFetchBg(kind);
      });
    });
    var next = $("meme-bg-next");
    if (next && !next.__bgWired) {
      next.__bgWired = true;
      next.addEventListener("click", function () {
        if (typeof w.memeWikimediaNext === "function") w.memeWikimediaNext();
        else if (typeof w.memeFetchBg === "function") w.memeFetchBg("free");
      });
    }
    var wiki = $("meme-bg-wikimedia");
    if (wiki && !wiki.__bgWired) {
      wiki.__bgWired = true;
      wiki.addEventListener("click", function () {
        if (typeof w.memeFetchWikimedia === "function") w.memeFetchWikimedia();
      });
    }
    ["meme-top", "meme-mid", "meme-ref", "meme-top-input", "meme-mid-input", "meme-bottom-input"].forEach(function (id) {
      var el = $(id);
      if (!el || el.__verseInputWired) return;
      el.__verseInputWired = true;
      el.addEventListener("input", function () {
        try {
          if (!w.memeState) w.memeState = {};
          if (id.indexOf("top") >= 0) w.memeState.top = el.value;
          if (id.indexOf("mid") >= 0) w.memeState.mid = el.value;
          if (id.indexOf("ref") >= 0 || id.indexOf("bottom") >= 0) {
            w.memeState.ref = el.value;
            w.memeState.bottom = el.value;
          }
          if (typeof w.memeRender === "function") w.memeRender();
        } catch (e) {}
      });
    });
  }

  w.memeApplyVersePack = applyPack;
  w.memeSetVerseText = setText;

  function boot() { wire(); }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  d.addEventListener("clarity:tab-mounted", function () { setTimeout(boot, 80); });
  w.addEventListener("clarity:tab-mounted", function () { setTimeout(boot, 80); });
  setTimeout(boot, 400);
})(window, document);

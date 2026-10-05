/**
 * Clarity Meme Confidence v1
 * - Keeps watermark citation = applied verse ref (no stale 2:201)
 * - Re-injects section "Use in Meme" pills and ensures clicks work
 * - Re-runs after path unlock / tab switch
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_MEME_CONFIDENCE_V1__) return;
  g.__CLARITY_MEME_CONFIDENCE_V1__ = true;

  function setRef(ref) {
    ref = String(ref || "").trim();
    if (typeof g.memeState !== "object" || !g.memeState) g.memeState = {};
    g.memeState.ref = ref;
    g.memeState._lastRef = ref;
  }

  function extractRefFromBottom() {
    try {
      var bot = (g.memeState && g.memeState.bottom) || "";
      var lines = String(bot).split(/\n/).map(function (x) { return x.trim(); }).filter(Boolean);
      var last = lines.length ? lines[lines.length - 1] : "";
      if (/^Qur[\u2019'`]?an\s+\d+/i.test(last) || /^\d+:\d+/.test(last) || /Bukhari|Muslim|Tirmidh|Abu Dawud/i.test(last))
        return last;
    } catch (e) {}
    return "";
  }

  /** Wrap memeDraw so watermark never shows a ref that contradicts bottom */
  function wrapDraw() {
    var prev = g.memeDraw;
    if (typeof prev !== "function" || prev.__memeConf) return;
    g.memeDraw = function () {
      try {
        if (g.memeState) {
          var bottomRef = extractRefFromBottom();
          if (bottomRef) setRef(bottomRef);
          else if (g.memeState.bottom && g.memeState._lastRef) {
            /* bottom is non-ref text (e.g. urdu only) — keep explicit _lastRef */
          } else if (!g.memeState.bottom) {
            setRef("");
          }
        }
      } catch (e) {}
      return prev.apply(this, arguments);
    };
    g.memeDraw.__memeConf = true;
    if (prev.__smoothWrapped) g.memeDraw.__smoothWrapped = true;
  }

  function pushPayload(payload) {
    payload = payload || {};
    var ar = String(payload.arabic || payload.ar || "").trim();
    var en = String(payload.en || payload.english || "").trim();
    var ur = String(payload.ur || "").trim();
    var ref = String(payload.ref || "").trim();
    try {
      document.documentElement.setAttribute("data-clarity-meme-ok", "1");
    } catch (e) {}
    if (typeof g.memeApplyVerseCard === "function") {
      g.memeApplyVerseCard(ar, en, ur, ref);
    } else {
      if (!g.memeState) g.memeState = {};
      g.memeState.top = ar;
      g.memeState.mid = en;
      g.memeState.bottom = [ur, ref].filter(Boolean).join("\n");
      setRef(ref);
      if (typeof g.memeDraw === "function") g.memeDraw();
    }
    try {
      if (typeof g.switchTab === "function") g.switchTab("reminder");
    } catch (e2) {}
    setTimeout(function () {
      var card = document.getElementById("meme-card");
      if (card) {
        card.classList.remove("gate-hidden");
        card.style.removeProperty("display");
        card.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 120);
  }

  function ensurePills() {
    try {
      if (typeof g.ensureSectionMemePills === "function") {
        g.ensureSectionMemePills();
      }
      /* Bind any orphan pills that lost listeners after re-render */
      document.querySelectorAll(".clarity-to-meme-pill").forEach(function (btn) {
        if (btn.__memeBound) return;
        btn.__memeBound = true;
        btn.addEventListener("click", function (ev) {
          try { ev.preventDefault(); ev.stopPropagation(); } catch (e0) {}
          var card = btn.closest(".card, [id$='-card'], .search-result, .question");
          if (!card) return;
          var arEl = card.querySelector(".arabic, .rabbana-arabic, [lang='ar'], .cmd-ar, .sr-ar");
          var enEl = card.querySelector(".cmd-en, .sr-en, .verse-en, .translation, .english");
          var refEl = card.querySelector(".ref, .verse-ref, .sr-ref, .citation, [data-ref]");
          var ar = arEl ? arEl.textContent.trim() : "";
          var en = enEl ? enEl.textContent.trim() : "";
          var ref = refEl ? (refEl.textContent || refEl.getAttribute("data-ref") || "").trim() : "";
          pushPayload({ arabic: ar, en: en, ref: ref });
        });
      });
    } catch (e) {}
  }

  function boot() {
    wrapDraw();
    ensurePills();
    /* Override push desk to always set ref */
    var prevPush = g.clarityPushToMemeDesk;
    g.clarityPushToMemeDesk = function (payload) {
      if (typeof prevPush === "function") {
        try { prevPush(payload); } catch (e) {}
      }
      pushPayload(payload);
    };
    setTimeout(ensurePills, 600);
    setTimeout(ensurePills, 2000);
    g.addEventListener("clarity-path-changed", function () {
      setTimeout(ensurePills, 300);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
  g.addEventListener("load", function () {
    setTimeout(boot, 200);
    setTimeout(ensurePills, 1500);
  });
  g.ClarityMemeConfidence = { ensurePills: ensurePills, setRef: setRef, push: pushPayload };
})(typeof window !== "undefined" ? window : this);

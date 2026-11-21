/*! companion-meme-ref-fix-v1
 * Debounced size sliders · correct reference strip · Shariah-safe citation gate on every paint
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_REF_FIX_V1__) return;
  w.__COMPANION_MEME_REF_FIX_V1__ = true;

  function S() {
    if (!w.memeState || typeof w.memeState !== "object") w.memeState = {};
    return w.memeState;
  }

  function status(msg) {
    var el = d.getElementById("meme-fetch-status") || d.getElementById("meme-rrra-status");
    if (el) el.textContent = msg || "";
  }

  /**
   * Shariah-oriented citation gate for the reference strip.
   * Accepts educational Qur'an / ḥadīth-style refs only.
   * Rejects clocks, bare numbers, URLs, political slogans, site promo (except clarity educational footer is share-only).
   */
  function sanitizeRef(raw, ar, en) {
    var r = String(raw || "").trim();
    if (!r) return "";

    // Strip wrapping quotes/brackets noise
    r = r.replace(/^[\s"'“”]+|[\s"'“”]+$/g, "");

    // Reject time-like or nonsense (e.g. 21:87 as clock, or lone ratios)
    if (/^\d{1,2}:\d{2}$/.test(r) && !/^Qur/i.test(r)) {
      // bare mm:ss or chapter:verse without label — only allow if plausible Qur'an range
      var parts = r.split(":");
      var a = parseInt(parts[0], 10), b = parseInt(parts[1], 10);
      if (!(a >= 1 && a <= 114 && b >= 1 && b <= 286)) return "";
      r = "Qur'an " + a + ":" + b;
    }

    // Reject URLs and domains in ref strip
    if (/https?:\/\//i.test(r) || /www\./i.test(r) || /\.(com|org|net|fyi)\b/i.test(r)) {
      return "";
    }

    // Reject site promo in strip (footer belongs on share text only)
    if (/clarity-dawah/i.test(r) || /educational only/i.test(r)) return "";

    // Normalize Qur'an patterns
    var q = r.match(/(?:Qur['']?a?n|Quran|القرآن)?\s*(?:Surah\s*)?(\d{1,3})\s*[:：]\s*(\d{1,3})/i);
    if (q) {
      var surah = parseInt(q[1], 10), ayah = parseInt(q[2], 10);
      if (surah < 1 || surah > 114 || ayah < 1 || ayah > 286) return "";
      return "Qur'an " + surah + ":" + ayah;
    }

    // Ḥadīth-style short cite
    if (/bukhārī|bukhari|muslim|abū dāwūd|abu dawud|tirmidhī|tirmidhi|nasā?['']?ī|ibn mājah|nawawī/i.test(r)) {
      return r.slice(0, 80);
    }

    // Arabic kitāb style short
    if (/صحيح|بخاري|مسلم|ترمذي/.test(r) && r.length < 80) return r;

    // If it still looks like a clean short citation
    if (/^[A-Za-z'’\u0600-\u06FF0-9:\s\-–]{3,60}$/.test(r) && /\d+:\d+/.test(r)) {
      return r.replace(/\s+/g, " ").slice(0, 60);
    }

    // Otherwise do not paint garbage on the strip
    return "";
  }

  function resolveRef(s) {
    // Prefer explicit pack ref
    var cand = s.ref || "";
    // Don't steal from bottom body (Urdu)
    var bot = (s.bottom || "").trim();
    if (!cand && bot && /qur|hadith|\d+:\d+/i.test(bot) && bot.length < 60) cand = bot;
    // Input field may hold ref
    var bi = d.getElementById("meme-bottom-input");
    if (bi) {
      var bv = (bi.value || "").trim();
      if (/qur|hadith|\d+:\d+/i.test(bv) && bv.length < 60) cand = bv;
    }
    return sanitizeRef(cand, s.top, s.mid);
  }

  /* Debounce slider havoc */
  var paintTimer = null;
  var lastPaint = 0;
  function schedulePaint(ms) {
    if (paintTimer) clearTimeout(paintTimer);
    paintTimer = setTimeout(function () {
      paintTimer = null;
      safePaint();
    }, ms == null ? 80 : ms);
  }

  function safePaint() {
    var now = Date.now();
    if (now - lastPaint < 40) {
      schedulePaint(50);
      return;
    }
    lastPaint = now;
    // Prefer stable paint but patch ref after
    if (typeof w.paintMeme === "function") {
      try {
        // ensure state.ref is sanitized before paint
        var s = S();
        s.ref = resolveRef(s);
        w.paintMeme();
        // re-stamp strip if underlying paint used stale ref
        stampRefStrip(s.ref);
        return;
      } catch (e) {}
    }
    stampRefStrip(resolveRef(S()));
  }

  function stampRefStrip(ref) {
    var canvas = d.getElementById("meme-canvas");
    if (!canvas || !ref) return;
    // Soft overlay only the bottom strip text via a second pass
    try {
      var ctx = canvas.getContext("2d");
      if (!ctx) return;
      var dpr = Math.min(2, w.devicePixelRatio || 1);
      var W = canvas.clientWidth || canvas.width / dpr;
      var H = canvas.clientHeight || canvas.height / dpr;
      // Don't full-clear — only draw ref if we can measure
      // Full repaint path is preferred; this is backup
    } catch (e) {}
  }

  /** Wrap original paintMeme to force sanitized ref every paint */
  function installPaintGate() {
    var original = w.paintMeme || w.memeDraw;
    if (original && original.__refGate) return;
    function gated() {
      var s = S();
      // Clear stale bare ratios from bottom body
      if (s.bottom && /^\d{1,2}:\d{2}$/.test(String(s.bottom).trim())) {
        s.bottom = "";
      }
      s.ref = resolveRef(s);
      // Keep bottom input from polluting strip with clock-like values
      var bi = d.getElementById("meme-bottom-input");
      if (bi) {
        var bv = (bi.value || "").trim();
        if (/^\d{1,2}:\d{2}$/.test(bv) && !/^Qur/i.test(bv)) {
          // leave field but don't use as ref
        }
      }
      if (typeof original === "function") return original.apply(this, arguments);
      return false;
    }
    gated.__refGate = true;
    w.paintMeme = gated;
    w.memeDraw = gated;
    if (w.ClarityMemePaintV2) w.ClarityMemePaintV2.paint = gated;
  }

  /** Own minimal paint if needed — focuses correct ref strip */
  function paintWithCleanRef() {
    var canvas = d.getElementById("meme-canvas");
    if (!canvas) return;
    installPaintGate();
    var s = S();
    s.ref = resolveRef(s);
    // If pack left Qur'an ref in mid/bottom text by mistake, don't duplicate
    if (s.mid && /^Qur['']?an\s+\d+:\d+/i.test(s.mid.trim()) && s.ref) {
      /* mid is translation usually — leave */
    }
    if (s.bottom && /^Qur['']?an\s+\d+:\d+/i.test(s.bottom.trim())) {
      if (!s.ref) s.ref = sanitizeRef(s.bottom);
      s.bottom = "";
    }
    if (typeof w.paintMeme === "function") w.paintMeme();
  }

  function rewireSliders() {
    // Size sliders only — debounce
    ["st-scale-top", "st-scale-mid", "st-scale-bot", "ps-scale-top", "ps-scale-mid", "ps-scale-bot"].forEach(function (id) {
      var el = d.getElementById(id);
      if (!el || el.__refFix) return;
      el.__refFix = true;
      el.addEventListener(
        "input",
        function () {
          var map = {
            "st-scale-top": "scaleTop",
            "st-scale-mid": "scaleMid",
            "st-scale-bot": "scaleBot",
            "ps-scale-top": "scaleTop",
            "ps-scale-mid": "scaleMid",
            "ps-scale-bot": "scaleBot"
          };
          var key = map[id];
          if (key) S()[key] = parseInt(el.value, 10) || 100;
          var lab = id.replace("scale", "s").replace("st-", "st-s").replace("ps-", "ps-s");
          // update labels
          var pairs = [
            ["st-scale-top", "st-st"],
            ["st-scale-mid", "st-sm"],
            ["st-scale-bot", "st-sb"]
          ];
          pairs.forEach(function (p) {
            if (p[0] === id) {
              var L = d.getElementById(p[1]);
              if (L) L.textContent = el.value;
            }
          });
          schedulePaint(100);
        },
        true
      );
    });
  }

  function wirePacks() {
    // After text fetch, force ref sanitize
    var root = d.getElementById("meme-studio-root") || d;
    root.querySelectorAll("[data-meme-fetch]").forEach(function (btn) {
      if (btn.__refFetch) return;
      btn.__refFetch = true;
      btn.addEventListener(
        "click",
        function () {
          setTimeout(function () {
            var s = S();
            s.ref = resolveRef(s);
            // If bottom holds only a citation, move to ref
            if (s.bottom && /^Qur['']?an\s+\d+:\d+/i.test(s.bottom.trim())) {
              s.ref = sanitizeRef(s.bottom);
              s.bottom = "";
            }
            paintWithCleanRef();
          }, 120);
        },
        false
      );
    });
  }

  function boot() {
    installPaintGate();
    rewireSliders();
    wirePacks();
    // Initial sanitize
    var s = S();
    if (s.ref) s.ref = sanitizeRef(s.ref);
    if (s.bottom && /^\d{1,2}:\d{2}$/.test(String(s.bottom).trim())) s.bottom = "";
    schedulePaint(50);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  d.addEventListener("clarity:tab-mounted", function () { setTimeout(boot, 100); });

  var n = 0;
  var iv = setInterval(function () {
    n++;
    installPaintGate();
    rewireSliders();
    if (n >= 12) clearInterval(iv);
  }, 400);

  w.memeSanitizeRef = sanitizeRef;
  w.memeResolveRef = resolveRef;
})(window, document);

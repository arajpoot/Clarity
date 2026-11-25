/*! companion-meme-contract-g1 · single paint path + host + share ref-only
 * G1 glory · educational only — not a fatwa. Companion only.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_CONTRACT_G1__) return;
  w.__COMPANION_MEME_CONTRACT_G1__ = true;

  function loadScript(src) {
    return new Promise(function (resolve) {
      if (d.querySelector('script[src*="' + src.split("?")[0].split("/").pop() + '"]'))
        return resolve();
      var s = d.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = function () { resolve(); };
      s.onerror = function () { resolve(); };
      d.head.appendChild(s);
    });
  }

  function ensurePaint() {
    if (w.ClarityMemePaintV2 && typeof w.ClarityMemePaintV2.paint === "function")
      return Promise.resolve();
    return loadScript("/companion/assets/companion-meme-paint-v2.js?v=20261125G12");
  }

  function readFields() {
    function val(id) {
      var el = d.getElementById(id);
      return el ? (el.value || el.textContent || "").trim() : "";
    }
    var top = val("meme-top-input") || val("meme-top");
    var mid = val("meme-mid-input") || val("meme-mid");
    var bot = val("meme-bottom-input") || val("meme-bottom");
    var ref = "";
    var refEl = d.querySelector("[data-verse-ref], #meme-ref");
    if (refEl) ref = (refEl.value || refEl.textContent || "").trim();
    if (!ref && bot && /qur.?n|ḥadīth|hadith|bukhār|muslim|sunnah|:\s*\d/i.test(bot))
      ref = bot;
    return { top: top, mid: mid, bot: bot, ref: ref };
  }

  /** Share payload: verse / translation / reference only — no site promo line */
  function sharePayload() {
    var f = readFields();
    var parts = [];
    if (f.top) parts.push(f.top);
    if (f.mid) parts.push(f.mid);
    if (f.ref) parts.push(f.ref);
    else if (f.bot && f.bot !== f.mid) parts.push(f.bot);
    var t = parts.join("\n\n").trim();
    if (t.length > 280) t = t.slice(0, 277) + "…";
    return t;
  }

  w.tdPost = function () {
    var text = sharePayload();
    if (!text) text = "Educational reminder — verify with Qurʾān and Sunnah";
    var url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
    try {
      w.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      w.location.href = url;
    }
    var st = d.getElementById("meme-fetch-status") || d.getElementById("meme-rrra-status");
    if (st) st.textContent = "Share opened with verse/ref only · educational only — not a fatwa";
  };

  w.clarityMemeFill = function (ar, en, ref) {
    var t = d.getElementById("meme-top-input") || d.getElementById("meme-top");
    var m = d.getElementById("meme-mid-input") || d.getElementById("meme-mid");
    var b = d.getElementById("meme-bottom-input") || d.getElementById("meme-bottom");
    if (t) t.value = ar || "";
    if (m) m.value = en || "";
    if (b) b.value = ref || "";
    if (w.memeState) {
      w.memeState.top = ar || "";
      w.memeState.mid = en || "";
      w.memeState.ref = ref || "";
      w.memeState.bottom = ref || "";
    }
    if (w.ClarityMemePaintV2 && w.ClarityMemePaintV2.paint) w.ClarityMemePaintV2.paint();
    else if (typeof w.paintMeme === "function") w.paintMeme();
  };

  function wireHost() {
    var root = d.getElementById("cs-mount") || d;
    if (!root.querySelector("#meme-canvas")) return;
    // Tweet desk buttons
    root.querySelectorAll("#tweet-desk-card button, .tweet-desk button, [data-meme-act='tweet']").forEach(function (btn) {
      if (btn.__g1) return;
      btn.__g1 = true;
      var lab = (btn.textContent || "").toLowerCase();
      if (/post on x|tweet/.test(lab) || btn.getAttribute("data-meme-act") === "tweet") {
        btn.addEventListener("click", function (ev) {
          ev.preventDefault();
          w.tdPost();
        });
      }
    });
    // Full studio link badge
    var card = root.querySelector("#meme-card, #companion-meme-studio, .meme-card");
    if (card && !card.querySelector("[data-g1-studio-link]")) {
      var a = d.createElement("a");
      a.href = "/companion/meme/";
      a.setAttribute("data-g1-studio-link", "1");
      a.className = "btn-soft";
      a.style.cssText = "display:inline-block;margin:.35rem 0;font-size:.85rem";
      a.textContent = "Open full Meme Studio →";
      card.appendChild(a);
    }
    if (w.ClarityMemePaintV2 && w.ClarityMemePaintV2.paint) {
      try { w.ClarityMemePaintV2.paint(); } catch (e) {}
    }
  }

  function boot() {
    ensurePaint().then(function () {
      wireHost();
    });
    d.addEventListener("clarity:tab-mounted", function () {
      setTimeout(function () {
        ensurePaint().then(wireHost);
      }, 50);
    });
    var m = d.getElementById("cs-mount");
    if (m && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(wireHost, 80);
      }).observe(m, { childList: true });
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityMemeContractG1 = { sharePayload: sharePayload, version: "G1" };
})(window, document);

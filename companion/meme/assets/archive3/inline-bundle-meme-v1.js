/**
 * Named bundle: meme cluster · v1
 * Includes nuros_meme_ratio_unlock. Order preserved.
 */


;/* ==== inline-nuros_meme_ratio_unlock.js ==== */
(function(){
  "use strict";
  if (window.__NUROS_MEME_RATIO_UNLOCK__) return;
  window.__NUROS_MEME_RATIO_UNLOCK__ = true;

  function applyRatio(r) {
    r = r || "twitter";
    var st = document.getElementById("meme-stage") || document.querySelector(".meme-stage");
    var map = { "1:1": "1/1", twitter: "16/9", facebook: "1.91/1", "16:9": "16/9", "4:5": "4/5" };
    var dims = { "1:1": [1080,1080], twitter: [1200,675], facebook: [1200,630], "16:9": [1200,675], "4:5": [1080,1350] };
    if (st) {
      st.style.setProperty("aspect-ratio", map[r] || "16/9", "important");
      st.style.setProperty("height", "auto", "important");
      st.style.setProperty("min-height", "0", "important");
      st.style.setProperty("max-height", "52vh", "important");
      st.style.setProperty("width", "100%", "important");
      st.style.setProperty("max-width", "min(100%, 520px)", "important");
    }
    var canvas = document.getElementById("meme-canvas") || (st && st.querySelector("canvas"));
    if (canvas && dims[r]) {
      canvas.width = dims[r][0];
      canvas.height = dims[r][1];
    }
    try { if (typeof memeState === "object" && memeState) memeState.ratio = r; } catch(e){}
    try { if (typeof memePositionBoxes === "function") memePositionBoxes(); } catch(e){}
    try { if (typeof memeDraw === "function") memeDraw(); } catch(e){}
  }

  function wire() {
    var sel = null;
    document.querySelectorAll("select").forEach(function(s){
      if (/Twitter|16:9|Instagram|Canvas size/i.test((s.innerHTML || "") + (s.title || ""))) sel = s;
    });
    if (sel && !sel._ratioUnlock) {
      sel._ratioUnlock = true;
      sel.addEventListener("change", function(){ applyRatio(sel.value); });
      applyRatio(sel.value || "twitter");
    }
    if (typeof window.memeSetRatio === "function" && !window.memeSetRatio._unlocked) {
      var prev = window.memeSetRatio;
      window.memeSetRatio = function(r) {
        applyRatio(r);
        try { return prev.apply(this, arguments); } catch(e) {}
      };
      window.memeSetRatio._unlocked = true;
    } else if (typeof window.memeSetRatio !== "function") {
      window.memeSetRatio = applyRatio;
    }
  }

  function tighten() {
    try {
      [".page-wrapper", "#main-content", ".main-content"].forEach(function(q){
        var el = document.querySelector(q);
        if (el) { el.style.marginTop = "0"; el.style.paddingTop = "0.2rem"; }
      });
    } catch(e){}
  }

  function boot(){ wire(); tighten(); }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 120); });
  else setTimeout(boot, 120);
  window.addEventListener("load", function(){ setTimeout(boot, 350); });
})();


;/* ==== inline-clarity_meme_layout_fix_v1.js ==== */
(function(){
  "use strict";
  if (window.__CLARITY_MEME_LAYOUT_FIX_V1__) return;
  window.__CLARITY_MEME_LAYOUT_FIX_V1__ = true;

  var CSS = [
    "#meme-card .meme-studio, #meme-card .meme-below { display:flex; flex-direction:column; gap:0.45rem; }",
    "#meme-card .meme-bg-bar, #meme-card [class*='background'], #meme-card .meme-stage-wrap, #meme-card .meme-stage { order: 1; }",
    "#meme-card .meme-stage-wrap { order: 2; }",
    "#meme-card .meme-tool-label, #meme-card .meme-bar, #meme-card .meme-chip-row { order: 3; }",
    "#meme-card .meme-scale-bar, #meme-card [class*='scale'], #meme-card .meme-actions-row { order: 4; }",
    ".clarity-to-meme-pill { display:inline-flex!important; visibility:visible!important; opacity:1!important;",
    "  font-size:0.72rem; font-weight:700; padding:0.28rem 0.6rem; border-radius:999px;",
    "  background:linear-gradient(180deg,#e8f5ee,#d4ecd8); color:#0a3d2e; border:1px solid #8fd4b0; cursor:pointer; }",
    "html[data-theme=dark] .clarity-to-meme-pill { background:rgba(212,180,90,0.15); color:#e8d48a; border-color:rgba(212,180,90,0.35); }",
    "#meme-card:not([data-gate-hidden='1']) { display:block!important; }"
  ].join("\n");

  function injectCss(){
    if (document.getElementById("clarity-meme-layout-fix-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-meme-layout-fix-css";
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  /** Reorder: background chips + canvas above scale/export */
  function reorderMeme(){
    try {
      var card = document.getElementById("meme-card");
      if (!card) return;
      var studio = card.querySelector(".meme-studio, .meme-below") || card;
      var stage = card.querySelector(".meme-stage-wrap, #meme-stage-wrap, .meme-stage");
      var bg = card.querySelector(".meme-bg-bar, [aria-label*='Background'], [aria-label*='background']");
      if (!bg) {
        /* find row containing Nature/Flickr chips */
        card.querySelectorAll(".meme-chip-row, .meme-bar").forEach(function(row){
          if (/Nature|Flickr|Background/i.test(row.textContent || "")) bg = row;
        });
      }
      if (stage && stage.parentNode) {
        if (bg && bg.parentNode === stage.parentNode) {
          stage.parentNode.insertBefore(bg, stage);
        }
        /* move scale bars after stage */
        var parent = stage.parentNode;
        parent.querySelectorAll(".meme-chip-row, .meme-bar, .meme-actions-row").forEach(function(el){
          if (el === bg) return;
          if (/SCALE|Outline|Auto-scale|PNG|Share|FORMAT/i.test(el.textContent || "") || el.classList.contains("meme-actions-row")) {
            if (stage.nextSibling) parent.insertBefore(el, stage.nextSibling.nextSibling);
            else parent.appendChild(el);
          }
        });
      }
    } catch(e){}
  }

  function ensureSectionMemePills(){
    try {
      var max = 0;
      try { max = parseInt(localStorage.getItem("clarity_path_unlocked_max") || "0", 10) || 0; } catch(e){}
      document.querySelectorAll(".card[id], [id$='-card']").forEach(function(card){
        if (card.id === "meme-card") return;
        if (card.getAttribute("data-gate-hidden") === "1" || card.classList.contains("gate-hidden")) return;
        if (card.querySelector(".clarity-to-meme-pill")) return;
        var arEl = card.querySelector(".arabic, .arabic-calligraphy, .rabbana-arabic, [lang='ar'], .cmd-ar, .sr-ar");
        var enEl = card.querySelector(".cmd-en, .sr-en, .verse-en, .translation, .verse-en");
        if (!arEl && !enEl) return;
        /* only when Daily+ (index >= 2) or meme already unlocked in allow */
        if (max < 2 && !document.getElementById("meme-card")) return;
        var row = card.querySelector(".sr-actions, .card-actions, .gpc-links");
        if (!row) {
          row = document.createElement("div");
          row.className = "clarity-meme-pill-row";
          row.style.cssText = "display:flex;flex-wrap:wrap;gap:0.35rem;margin-top:0.55rem";
          card.appendChild(row);
        }
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn-soft clarity-to-meme-pill";
        btn.textContent = "🖼️ Use in Meme";
        btn.addEventListener("click", function(){
          var ar = arEl ? (arEl.textContent || "").trim() : "";
          var en = enEl ? (enEl.textContent || "").trim() : "";
          var refEl = card.querySelector(".ref, .verse-ref");
          var ref = refEl ? (refEl.textContent || "").trim() : "";
          if (typeof window.clarityPushToMemeDesk === "function") {
            window.clarityPushToMemeDesk({ arabic: ar, en: en, ref: ref });
          } else if (typeof window.memeApplyVerseCard === "function") {
            try { if (typeof switchTab === "function") switchTab("reminder"); } catch(e){}
            window.memeApplyVerseCard(ar, en, "", ref);
          }
        });
        row.appendChild(btn);
      });
    } catch(e){}
  }

  function boot(){
    injectCss();
    reorderMeme();
    ensureSectionMemePills();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 200); });
  else setTimeout(boot, 200);
  window.addEventListener("load", function(){ setTimeout(boot, 600); });
  document.addEventListener("clarity-core-ready", function(){ setTimeout(boot, 300); });
})();


;/* ==== inline-clarity_meme_push_cards.js ==== */
(function(){
  "use strict";
  if (window.__CLARITY_MEME_PUSH_CARDS__) return;
  window.__CLARITY_MEME_PUSH_CARDS__ = true;

  function hasAr(s){ return /[\u0600-\u06FF]/.test(s || ""); }

  window.clarityMemeFromCommand = function(){
    var box = document.getElementById("command-box");
    if (!box) return;
    var arEl = box.querySelector(".arabic-calligraphy .tts-body, .arabic-calligraphy, .arabic, [lang='ar']");
    var ar = arEl ? arEl.textContent : "";
    var en = "";
    box.querySelectorAll("p").forEach(function(p){
      if (en) return;
      var t = (p.textContent || "").trim();
      if (t && !hasAr(t) && t.length > 20 && !/educational|recommended|live the command/i.test(t)) en = t;
    });
    var ref = "";
    var m = (box.textContent || "").match(/Qur['']?\s*[aā]?n?\s*\d+:\d+/i) || (box.textContent || "").match(/\b\d+:\d+\b/);
    if (m) ref = m[0];
    if (typeof clarityMemePush === "function") clarityMemePush(ar, en, ref);
  };

  window.clarityMemeFromHadith = function(){
    var box = document.getElementById("hadith");
    if (!box) return;
    var arEl = box.querySelector(".arabic, [lang='ar']");
    var ar = arEl ? arEl.textContent : "";
    var en = "";
    box.querySelectorAll("p").forEach(function(p){
      if (en) return;
      var t = (p.textContent || "").trim().replace(/^["“]|["”]$/g, "");
      if (t && !hasAr(t) && t.length > 20 && !/educational|verify|pondering/i.test(t)) en = t;
    });
    var coll = box.querySelector(".hadith-coll-pill");
    var num = box.querySelector(".hadith-num-pill");
    var ref = [(coll && coll.textContent || "").replace(/^📚\s*/, "").trim(),
               (num && num.textContent || "").trim()].filter(Boolean).join(" · ");
    if (typeof clarityMemePush === "function") clarityMemePush(ar, en, ref || "Hadith");
  };

  window.memeFromCommand = function(){ if (typeof clarityMemeFromCommand === "function") clarityMemeFromCommand(); };

  function addButtons(){
    document.querySelectorAll(".card").forEach(function(card){
      if (card.querySelector(".clarity-meme-btn")) return;
      if (card.id === "meme-card" || (card.closest && card.closest("#meme-card"))) return;
      if (card.querySelector("#meme-canvas, #callig-canvas")) return;
      var txt = card.textContent || "";
      var has = card.querySelector(".arabic-calligraphy, .arabic, [dir='rtl']") || /\d+:\d+/.test(txt) || /Hadith|Qur.?an|Prophet/i.test(txt);
      if (!has) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn-soft clarity-meme-btn";
      btn.textContent = "🎨 Meme";
      btn.addEventListener("click", function(ev){
        ev.preventDefault();
        ev.stopPropagation();
        if (card.id === "hadith" || card.querySelector("#hadith")) { clarityMemeFromHadith(); return; }
        if (card.id === "command-box" || card.querySelector("#command-box")) { clarityMemeFromCommand(); return; }
        var arEl = card.querySelector(".arabic-calligraphy .tts-body, .arabic-calligraphy, .arabic, [lang='ar']");
        var ar = arEl ? arEl.textContent : "";
        var en = "";
        card.querySelectorAll("p").forEach(function(p){
          if (en) return;
          var t = (p.textContent || "").trim();
          if (t && !hasAr(t) && t.length > 20 && !/educational|pondering|verify/i.test(t)) en = t;
        });
        var ref = "";
        var m = txt.match(/Qur['']?\s*[aā]?n?\s*\d+:\d+/i) || txt.match(/\b\d+:\d+\b/);
        if (m) ref = m[0];
        if (ar || en) clarityMemePush(ar, en, ref);
      });
      var row = card.querySelector(".command-status, .card-actions");
      if (row) row.appendChild(btn);
      else card.appendChild(btn);
    });
  }

  function boot(){ addButtons(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 600); });
  else setTimeout(boot, 600);
  window.addEventListener("load", function(){ setTimeout(boot, 1200); });
})();


;/* ==== inline-clarity_meme_shariah_scan_v1.js ==== */
(function(){
"use strict";
if (window.__CLARITY_MEME_SHARIAH_SCAN_V1__) return;
window.__CLARITY_MEME_SHARIAH_SCAN_V1__ = true;

/** Auto-scan URLs / metadata before applying meme backgrounds */
var BLOCK = /\b(nude|naked|lingerie|bikini|swimwear|porn|xxx|sensual|erotic|kiss|romance-couple|beer|wine|alcohol|party-crowd|tattoo-body|idol|statue-buddha|crucifix|christmas-party|halloween-costume|gambling|casino)\b/i;
var PEOPLE = /\b(portrait|selfie|face-closeup|woman-model|man-model|girl-boy|fashion-model|celebrity|actress|actor)\b/i;
var ALLOW = /\b(nature|landscape|mountain|forest|sky|cloud|flower|garden|mosque|minaret|islamic|geometry|arabesque|pattern|tile|architecture|ocean|river|lake|desert|sunrise|sunset|night-sky|waterfall|abstract-geometry)\b/i;

window.clarityShariahScanUrl = function(url, meta){
  var blob = String(url || "") + " " + String(meta || "");
  blob = blob.toLowerCase().replace(/[_\-\/]/g, " ");
  if (BLOCK.test(blob)) return { ok: false, reason: "blocked-theme" };
  if (PEOPLE.test(blob) && !ALLOW.test(blob)) return { ok: false, reason: "people-focus" };
  /* Prefer allow keywords when present; neutral landscape URLs still OK */
  return { ok: true, reason: ALLOW.test(blob) ? "allow-theme" : "neutral" };
};

window.clarityShariahFilterUrls = function(urls, metaList){
  var out = [];
  (urls || []).forEach(function(u, i){
    var meta = (metaList && metaList[i]) || "";
    var r = window.clarityShariahScanUrl(u, meta);
    if (r.ok) out.push(u);
  });
  return out;
};

/* Wrap image loader */
var _load = window.memeLoadImageFromUrl;
if (typeof _load === "function") {
  window.memeLoadImageFromUrl = function(url, onFailMsg){
    var scan = window.clarityShariahScanUrl(url, "");
    if (!scan.ok) {
      try {
        if (typeof memeFetchStatus === "function") memeFetchStatus("Skipped non-compliant image — fetching another…");
      } catch(e){}
      try {
        if (typeof window.__memeOnlineFetch === "function") {
          setTimeout(function(){ window.__memeOnlineFetch("nature"); }, 120);
        }
      } catch(e2){}
      return;
    }
    return _load(url, onFailMsg);
  };
}

/* Patch commons/flickr caches through filter when engine exposes cache */
var _applyFilterToCache = function(){
  try {
    var c = window._memeOnlineCache;
    if (!c) return;
    Object.keys(c).forEach(function(k){
      if (Array.isArray(c[k])) c[k] = window.clarityShariahFilterUrls(c[k]);
    });
  } catch(e){}
};
setInterval(_applyFilterToCache, 4000);
})();


;/* ==== inline-clarity_meme_unlock_v2.js ==== */
(function(){
"use strict";
if (window.__CLARITY_MEME_UNLOCK_V2__) return;
window.__CLARITY_MEME_UNLOCK_V2__ = true;

function pathNow(){
  try {
    return document.documentElement.getAttribute("data-clarity-path")
      || localStorage.getItem("clarity_committed_path")
      || "seeker";
  } catch(e){ return "seeker"; }
}
function unlocked(){
  var p = pathNow();
  return p === "practicing" || p === "dai";
}
function isMemeControl(el){
  if (!el) return false;
  if (el.closest && el.closest("#meme-card")) return false;
  var oc = (el.getAttribute && el.getAttribute("onclick")) || "";
  var tx = (el.textContent || "").replace(/\s+/g," ").trim();
  if (/meme/i.test(oc)) return true;
  if (/^🎨?\s*Meme\s*$/i.test(tx) || /To Meme Studio/i.test(tx)) return true;
  if (/\bMeme\b/i.test(tx) && tx.length < 28 && el.tagName === "BUTTON") return true;
  if (el.classList && (el.classList.contains("meme-push") || el.classList.contains("clarity-meme-push-pill"))) return true;
  return false;
}
function syncMemeUi(){
  var open = unlocked();
  try { document.body.setAttribute("data-meme-studio-open", open ? "1" : "0"); } catch(e){}
  var card = document.getElementById("meme-card");
  if (card) {
    if (open) {
      card.classList.remove("gate-hidden");
      card.removeAttribute("data-gate-hidden");
      card.hidden = false;
      card.style.removeProperty("display");
      card.style.removeProperty("visibility");
      card.style.removeProperty("height");
      card.style.removeProperty("opacity");
    } else {
      card.classList.add("gate-hidden");
      card.setAttribute("data-gate-hidden", "1");
      card.style.setProperty("display", "none", "important");
    }
  }
  document.querySelectorAll("button, a.btn-soft, .btn-soft, .btn-secondary").forEach(function(el){
    if (!isMemeControl(el)) return;
    if (open) el.classList.remove("clarity-meme-ui-hidden");
    else el.classList.add("clarity-meme-ui-hidden");
  });
  /* also show calligraphy / tweet when unlocked */
  if (open) {
    ["callig-lab-card","tweet-desk-card","tajweed-path-card","tj-deep-studio","tajweed-live-card"].forEach(function(id){
      var el = document.getElementById(id);
      if (!el) return;
      el.classList.remove("gate-hidden");
      el.removeAttribute("data-gate-hidden");
      el.style.removeProperty("display");
    });
  }
}
function boot(){ syncMemeUi(); }
if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 250); });
else setTimeout(boot, 250);
window.addEventListener("load", function(){ setTimeout(boot, 700); setTimeout(boot, 1500); });

var _rp = window.clarityRequestPath;
if (typeof _rp === "function" && !_rp.__memeUnlockV2) {
  window.clarityRequestPath = function(){
    var r = _rp.apply(this, arguments);
    setTimeout(boot, 60);
    setTimeout(boot, 350);
    setTimeout(boot, 900);
    return r;
  };
  window.clarityRequestPath.__memeUnlockV2 = true;
}
var _af = window.applyGateSectionFilter;
if (typeof _af === "function" && !_af.__memeUnlockV2) {
  window.applyGateSectionFilter = function(){
    var r = _af.apply(this, arguments);
    setTimeout(boot, 40);
    setTimeout(boot, 300);
    return r;
  };
  window.applyGateSectionFilter.__memeUnlockV2 = true;
}
document.addEventListener("click", function(ev){
  if (ev.target && ev.target.closest && ev.target.closest("[data-gate], .cgs-btn")) {
    setTimeout(boot, 100);
    setTimeout(boot, 500);
  }
}, true);

window.clarityMemeUiSync = syncMemeUi;
})();


;/* ==== inline-clarity_meme_interlink_v1.js ==== */
(function(){
  "use strict";
  if (window.__CLARITY_MEME_INTERLINK_V1__) return;
  window.__CLARITY_MEME_INTERLINK_V1__ = true;

  /** Online background fetch with multiple safe scenery sources (no figurative lists) */
  window.__memeOnlineFetch = window.__memeOnlineFetch || function(kind){
    kind = String(kind || "nature").toLowerCase();
    if (kind === "blank") {
      if (typeof memeShowBlankPalette === "function") memeShowBlankPalette();
      return;
    }
    var seeds = {
      nature: ["forest","mountains","ocean","desert-dunes","green-hills"],
      flowers: ["garden-flowers","wildflowers","spring-meadow"],
      holy: ["mosque-architecture","islamic-geometry","arabesque"],
      night: ["starry-night","night-sky","moonlit"],
      water: ["clear-water","river","lake"],
      flickr: ["nature-landscape","architecture-stone"]
    };
    var list = seeds[kind] || seeds.nature;
    var seed = list[Math.floor(Math.random() * list.length)] + "-" + (Date.now() % 9973);
    var urls = [
      "https://picsum.photos/seed/clarity-" + encodeURIComponent(seed) + "/1280/900.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons.jpg/1280px-Tour_Eiffel_Wikimedia_Commons.jpg"
    ];
    // Prefer picsum; geometry-safe fallbacks for décor
    if (kind === "holy" || kind === "pattern") {
      urls = [
        "https://picsum.photos/seed/clarity-geom-" + (Date.now()%5000) + "/1280/900.jpg"
      ];
    }
    var u = urls[0];
    function apply(url){
      if (typeof memeLoadImageFromUrl === "function") memeLoadImageFromUrl(url);
      else if (window.memeState) {
        var img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = function(){
          memeState.img = img;
          if (typeof memeDraw === "function") memeDraw();
        };
        img.src = url;
      }
    }
    apply(u);
    try {
      var st = document.getElementById("meme-rrra-status") || document.getElementById("meme-fetch-status");
      if (st) st.textContent = "Background: " + kind + " · loaded";
    } catch(e){}
  };

  if (typeof window.memeFetchBg === "function" && !window.memeFetchBg.__online) {
    var prev = window.memeFetchBg;
    window.memeFetchBg = function(kind){
      try { return window.__memeOnlineFetch(kind); }
      catch(e){ try { return prev(kind); } catch(e2){} }
    };
    window.memeFetchBg.__online = true;
  } else if (typeof window.memeFetchBg !== "function") {
    window.memeFetchBg = window.__memeOnlineFetch;
  }

  /** Interlink pills: rail ↔ tabs ↔ meme/tweet */
  function wirePills(){
    document.querySelectorAll("[data-rail-tab]").forEach(function(btn){
      if (btn.__wired) return;
      btn.addEventListener("click", function(){
        var t = btn.getAttribute("data-rail-tab");
        if (typeof switchTab === "function") switchTab(t);
        else if (typeof clarityOpenSectionDoor === "function") clarityOpenSectionDoor(t);
      });
      btn.__wired = true;
    });
    // "To Meme" / From studio bridges
    document.querySelectorAll("[data-to-meme], .to-meme-btn").forEach(function(btn){
      if (btn.__wired) return;
      btn.addEventListener("click", function(){
        if (typeof claritySendToMeme === "function") claritySendToMeme();
        else if (typeof switchTab === "function") switchTab("reminder");
      });
      btn.__wired = true;
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", function(){ setTimeout(wirePills, 300); });
  else setTimeout(wirePills, 300);
  window.addEventListener("load", function(){ setTimeout(wirePills, 800); });
})();

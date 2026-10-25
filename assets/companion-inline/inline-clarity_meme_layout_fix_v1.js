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

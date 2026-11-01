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
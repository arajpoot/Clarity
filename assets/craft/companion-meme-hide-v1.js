/* Phase 3 — hide meme studio entry points on Companion only. Safe no-op on University pages. */
(function (g) {
  "use strict";
  if (g.__CU_MEME_HIDE_V1__) return;
  g.__CU_MEME_HIDE_V1__ = true;

  /* University paths: do nothing */
  var path = (location.pathname || "").toLowerCase();
  if (
    path.indexOf("/campus") === 0 ||
    path.indexOf("/lab") === 0 ||
    path.indexOf("/library") === 0 ||
    path.indexOf("/journey") === 0 ||
    path.indexOf("/vault") === 0 ||
    path.indexOf("/charter") === 0 ||
    path.indexOf("/systems") === 0
  ) {
    return;
  }

  var css = document.createElement("style");
  css.id = "cu-meme-hide-css";
  css.textContent =
    "#meme-card,[data-meme],.meme-studio-entry,.meme-card-realigned," +
    "a[href*='#meme'],a[href='/meme'],a[href*='/meme']," +
    "button[data-action='meme'],[data-rrra-pin='meme']," +
    ".meme-chip-wrap{display:none!important;visibility:hidden!important;height:0!important;overflow:hidden!important}" +
    "/* optional quiet lab bridge */" +
    "";
  document.documentElement.appendChild(css);

  function injectLabHint() {
    if (document.getElementById("cu-lab-craft-hint")) return;
    var card = document.getElementById("meme-card");
    if (!card || !card.parentNode) return;
    var hint = document.createElement("div");
    hint.id = "cu-lab-craft-hint";
    hint.setAttribute(
      "style",
      "margin:.5rem 0;padding:.65rem .85rem;border-radius:12px;border:1px solid rgba(224,197,106,.35);" +
        "background:rgba(13,79,60,.12);font-size:.82rem;line-height:1.4"
    );
    hint.innerHTML =
      "<strong>Craft tools</strong> (calligraphy, tajweed, media reminder) live in " +
      '<a href="/lab/" style="color:#0d4f3c;font-weight:700">University Lab</a>. Educational only.';
    try {
      card.parentNode.insertBefore(hint, card);
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectLabHint);
  } else injectLabHint();
  setTimeout(injectLabHint, 1500);
})(typeof window !== "undefined" ? window : this);

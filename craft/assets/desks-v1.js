/**
 * Shared 𝕏 + Facebook desks · Craft Meme Studio · C13
 * Educational only — not a fatwa. Sources only.
 */
(function () {
  "use strict";
  if (window.__CLARITY_CRAFT_DESKS_V1_C13__) return;
  window.__CLARITY_CRAFT_DESKS_V1_C13__ = true;

  function bindDesk(prefix, maxLen, openUrl) {
    var draft = document.getElementById(prefix + "-draft");
    var count = document.getElementById(prefix + "-count");
    var status = document.getElementById(prefix + "-status");
    if (!draft) return;

    function update() {
      var n = draft.value.length;
      if (count) count.textContent = n + " / " + maxLen;
      if (status) status.textContent = n ? "Draft ready" : "Ready";
    }
    draft.addEventListener("input", update);

    function doCopy() {
      var t = draft.value.trim();
      if (!t) { if (status) status.textContent = "Nothing to copy"; return; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(function () {
          if (status) status.textContent = "Copied ✓";
        }).catch(function () {
          draft.select();
          try { document.execCommand("copy"); if (status) status.textContent = "Copied ✓"; } catch (_) {}
        });
      } else {
        draft.select();
        try { document.execCommand("copy"); if (status) status.textContent = "Copied ✓"; } catch (_) {}
      }
    }

    function doOpen() {
      var t = draft.value.trim();
      if (t && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).catch(function () {});
      }
      if (openUrl.indexOf("twitter") !== -1 || openUrl.indexOf("x.com") !== -1) {
        window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(t), "_blank", "noopener");
      } else {
        window.open(openUrl, "_blank", "noopener");
      }
      if (status) status.textContent = "Opened · paste if needed";
    }

    var copyBtn = document.getElementById(prefix + "-copy");
    if (copyBtn) copyBtn.addEventListener("click", doCopy);
    var openBtn = document.getElementById(prefix + "-open");
    if (openBtn) openBtn.addEventListener("click", doOpen);

    /* data-desk / data-action fallback used by meme page */
    document.querySelectorAll('[data-desk="' + prefix + '"]').forEach(function (btn) {
      var act = btn.getAttribute("data-action");
      if (act === "copy") btn.addEventListener("click", doCopy);
      if (act === "open") btn.addEventListener("click", doOpen);
    });

    var clearBtn = document.getElementById(prefix + "-clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        draft.value = "";
        update();
      });
    }
    update();
  }

  function boot() {
    bindDesk("x", 280, "https://twitter.com/intent/tweet");
    bindDesk("tw", 280, "https://twitter.com/intent/tweet");
    bindDesk("fb", 2000, "https://www.facebook.com/");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

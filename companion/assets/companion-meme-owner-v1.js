/*! Meme owner lock · #meme-card is sole Reminder studio · path must not hide it */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_OWNER_V1__) return;
  w.__COMPANION_MEME_OWNER_V1__ = true;

  function onReminder() {
    return (d.body && d.body.getAttribute("data-active-tab")) === "reminder";
  }

  function forceOwner() {
    if (!onReminder()) return;
    var r = d.getElementById("cs-mount");
    if (!r) return;

    // sole owner
    var card = r.querySelector("#meme-card");
    if (card) {
      card.setAttribute("data-meme-owner", "clarity-full");
      card.style.setProperty("display", "block", "important");
      card.style.setProperty("visibility", "visible", "important");
      card.style.setProperty("opacity", "1", "important");
      card.style.setProperty("height", "auto", "important");
      card.style.setProperty("max-height", "none", "important");
      // undo path-governance inline hides on ancestors up to mount
      var el = card.parentElement;
      var n = 0;
      while (el && el.id !== "cs-mount" && n < 10) {
        if (el.nodeType === 1) {
          var cs = w.getComputedStyle(el);
          if (cs.display === "none") el.style.setProperty("display", "block", "important");
          if (cs.visibility === "hidden") el.style.setProperty("visibility", "visible", "important");
        }
        el = el.parentElement;
        n++;
      }
    }

    r.querySelectorAll("#cs-meme-compact, [data-meme-compact]").forEach(function (el) {
      el.style.setProperty("display", "none", "important");
    });

    var stage = r.querySelector("#meme-stage");
    var canvas = r.querySelector("#meme-canvas");
    var wrap = r.querySelector("#meme-stage-wrap, .meme-preview-only");
    if (wrap) {
      wrap.style.setProperty("display", "block", "important");
      wrap.style.setProperty("width", "100%", "important");
    }
    if (stage) {
      stage.style.setProperty("display", "block", "important");
      stage.style.setProperty("min-height", "240px", "important");
      stage.style.setProperty("width", "100%", "important");
    }
    if (canvas) {
      canvas.style.setProperty("display", "block", "important");
      canvas.style.setProperty("width", "100%", "important");
      canvas.style.setProperty("min-height", "220px", "important");
      if (!canvas.width || canvas.width < 8) canvas.width = 1200;
      if (!canvas.height || canvas.height < 8) canvas.height = 675;
      try {
        if (w.ClarityMemePaintV2 && w.ClarityMemePaintV2.paint) w.ClarityMemePaintV2.paint();
        else if (typeof w.paintMeme === "function") w.paintMeme();
      } catch (e) {}
    }

    // desks: only first #tweet-desk-card
    var desks = r.querySelectorAll(".tweet-desk, #tweet-desk-card");
    var kept = false;
    desks.forEach(function (desk) {
      if (desk.id === "tweet-desk-card-dup") {
        desk.style.setProperty("display", "none", "important");
        return;
      }
      if (!kept && desk.id === "tweet-desk-card") {
        desk.style.setProperty("display", "block", "important");
        kept = true;
      } else if (kept) {
        desk.style.setProperty("display", "none", "important");
      }
    });
  }

  function boot() {
    forceOwner();
    d.addEventListener("clarity:tab-mounted", function () {
      setTimeout(forceOwner, 40);
      setTimeout(forceOwner, 200);
    });
    d.addEventListener(
      "click",
      function (ev) {
        if (ev.target && ev.target.closest && ev.target.closest("[data-cs-path],[data-rail-tab]")) {
          setTimeout(forceOwner, 100);
        }
      },
      true
    );
    var m = d.getElementById("cs-mount");
    if (m && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(forceOwner, 50);
      }).observe(m, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class", "hidden"] });
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityMemeOwner = { force: forceOwner, owner: "clarity-full", version: "MO1" };
})(window, document);

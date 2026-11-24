/*! companion-meme-spine-v1 · Phase 3 single spine · educational only */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_SPINE_V1__) return;
  w.__COMPANION_MEME_SPINE_V1__ = true;

  /** Allowed Companion meme surface: isolated SoT + thin host only */
  var ALLOW = {
    host: true,           // companion-meme-host-v1
    iso: "/companion/meme/",
    paintOwner: "companion-meme-owner-v1" // only inside /companion/meme/
  };

  var BLOCK = [
    "companion-meme-studio-v1",
    "companion-meme-solid",
    "companion-meme-peace",
    "companion-craft-studios-v1",
    "inline-bundle-meme",
    "companion-meme-final",
    "companion-meme-merge",
    "companion-meme-lock"
  ];

  function blockedSrc(src) {
    src = String(src || "").toLowerCase();
    for (var i = 0; i < BLOCK.length; i++) {
      if (src.indexOf(BLOCK[i]) >= 0) return true;
    }
    return false;
  }

  /** Prevent late injection of legacy paint engines into Companion shell */
  var obs = new MutationObserver(function (muts) {
    muts.forEach(function (m) {
      m.addedNodes && m.addedNodes.forEach(function (n) {
        if (!n || n.tagName !== "SCRIPT") return;
        var src = n.src || n.getAttribute("src") || "";
        if (blockedSrc(src)) {
          try { n.type = "text/blocked-legacy-meme"; n.remove(); } catch (e) {}
          try { console.info("[Clarity meme spine] blocked legacy script", src); } catch (e2) {}
        }
      });
    });
  });
  try {
    obs.observe(d.documentElement, { childList: true, subtree: true });
  } catch (e) {}

  // Flag page
  try { d.documentElement.setAttribute("data-meme-spine", "v1-host-iso"); } catch (e3) {}

  w.ClarityMemeSpine = {
    version: "P3",
    allow: ALLOW,
    blocked: BLOCK,
    isBlocked: blockedSrc
  };
})(window, document);

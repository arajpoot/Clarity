/**
 * Tweet Desk + Facebook Desk · linked to Tablīgh (meme) studio · 20261020TABLIGH
 * Educational · text from canvas only · opens native share/intent URLs
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_SHARE_DESKS_V1__) return;
  g.__CLARITY_SHARE_DESKS_V1__ = true;

  function canvasLines() {
    var lines = [];
    ["meme-top-input", "meme-mid-input", "meme-bottom-input"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.value && el.value.trim()) lines.push(el.value.trim());
    });
    if (!lines.length) {
      ["meme-box-top", "meme-box-mid", "meme-box-bottom"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el && el.textContent && el.textContent.trim()) lines.push(el.textContent.trim());
      });
    }
    return lines;
  }

  function packText(max) {
    var lines = canvasLines();
    var t = lines.join("\n\n");
    if (t.length > max) t = t.slice(0, max - 1) + "…";
    return t;
  }

  g.memeSendToTweetDesk = function () {
    var t = packText(260);
    var inp = document.getElementById("td-text") || document.getElementById("td-compose");
    if (inp) { inp.value = t; try { if (typeof tdCount === "function") tdCount(); } catch (e) {} }
    var card = document.getElementById("tweet-desk-card");
    if (card) {
      card.removeAttribute("hidden");
      card.style.removeProperty("display");
      if (typeof g.switchTab === "function") g.switchTab("action");
      setTimeout(function () {
        card.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
    var prev = document.getElementById("td-preview");
    if (prev) prev.textContent = t || "Paste or pull from Tablīgh studio.";
  };

  g.memeSendToFacebookDesk = function () {
    var t = packText(2000);
    var inp = document.getElementById("fb-compose");
    if (inp) inp.value = t;
    var card = document.getElementById("facebook-desk-card");
    if (card) {
      card.removeAttribute("hidden");
      card.style.removeProperty("display");
      if (typeof g.switchTab === "function") g.switchTab("action");
      setTimeout(function () {
        card.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  };

  g.tweetDeskPost = function () {
    var text = ((document.getElementById("td-text") || document.getElementById("td-compose") || {}).value) || packText(260);
    var url =
      "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
    g.open(url, "_blank", "noopener,noreferrer");
  };

  g.facebookDeskPost = function () {
    var text = (document.getElementById("fb-compose") || {}).value || packText(500);
    /* Facebook sharer prefers URL; quote via feed dialog text fallback */
    var url =
      "https://www.facebook.com/sharer/sharer.php?u=" +
      encodeURIComponent("https://clarity-dawah.fyi/") +
      "&quote=" +
      encodeURIComponent(text);
    g.open(url, "_blank", "noopener,noreferrer");
  };

  g.shareDesksPullFromStudio = function (which) {
    if (which === "fb") g.memeSendToFacebookDesk();
    else g.memeSendToTweetDesk();
  };
})(typeof window !== "undefined" ? window : this);

  g.tdPost = g.tdPost || function () { return g.tweetDeskPost(); };
  g.tweetDeskPost = function () {
    var el = document.getElementById("td-text") || document.getElementById("td-compose");
    var text = (el && el.value) || packText(260);
    g.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(text), "_blank", "noopener,noreferrer");
  };

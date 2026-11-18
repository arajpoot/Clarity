/*! companion-tweet-desk-restore-v1 · full Tweet desk: canvas verse → Post on X
 * Educational only — not a fatwa. Companion only.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_TWEET_DESK_RESTORE_V1__) return;
  w.__COMPANION_TWEET_DESK_RESTORE_V1__ = true;

  function textOf(id) {
    var el = d.getElementById(id);
    return el ? (el.value || el.textContent || "").trim() : "";
  }

  function buildShareText() {
    var top = textOf("meme-top-input") || textOf("meme-box-top");
    var mid = textOf("meme-mid-input") || textOf("meme-box-mid");
    var bot = textOf("meme-bottom-input") || textOf("meme-box-bottom");
    // also try live verse hosts
    var ar = (d.querySelector("[data-verse-ar]") || {}).textContent || "";
    var en = (d.querySelector("[data-verse-en]") || {}).textContent || "";
    var ref = (d.querySelector("[data-verse-ref]") || {}).textContent || "";
    var lines = [];
    if (top) lines.push(top);
    else if (ar) lines.push(ar.trim());
    if (mid) lines.push(mid);
    else if (en) lines.push(en.trim());
    if (bot) lines.push(bot);
    else if (ref) lines.push(ref.trim());
    if (!lines.length) {
      lines = [
        "Educational reminder from Clarity",
        "https://clarity-dawah.fyi/companion/#reminder"
      ];
    }
    var body = lines.join("\n\n");
    if (body.length > 260) body = body.slice(0, 257) + "…";
    if (body.indexOf("clarity-dawah.fyi") < 0) {
      body += "\n\nclarity-dawah.fyi/companion · educational only — not a fatwa";
    }
    return body;
  }

  function openTweetIntent(text) {
    var url =
      "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text);
    try {
      w.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      w.location.href = url;
    }
  }

  function fromCanvasPng() {
    var canvas = d.getElementById("meme-canvas");
    if (!canvas || !canvas.toDataURL) return null;
    try {
      return canvas.toDataURL("image/png");
    } catch (e) {
      return null;
    }
  }

  w.tdPost = function () {
    var text = buildShareText();
    // Prefer intent with text; image stays on-device (X intent does not accept data URLs)
    openTweetIntent(text);
    var st = d.getElementById("meme-rrra-status") || d.getElementById("cs-mount-status");
    if (st) {
      st.textContent =
        "Tweet desk opened with verse/text from canvas fields. Attach PNG from Download if needed. Educational only.";
    }
  };

  w.tdCopy = function () {
    var text = buildShareText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(
        function () {
          var st = d.getElementById("meme-rrra-status");
          if (st) st.textContent = "Copied share text.";
        },
        function () {}
      );
    }
  };

  function restoreLabels(root) {
    root = root || d.getElementById("cs-mount") || d;
    if (!root.querySelectorAll) return;
    root.querySelectorAll("h2,button,a,span,label").forEach(function (el) {
      var t = el.textContent || "";
      var n = t
        .replace(/Share desk/gi, "Tweet desk")
        .replace(/Copy share card/gi, "Post on X")
        .replace(/Landscape 16:9/gi, "𝕏 Twitter 16:9")
        .replace(/Open share draft/gi, "Open X login");
      if (n !== t) el.textContent = n;
    });
    // wire unlabeled post buttons near tweet desk
    var desk = root.querySelector("#tweet-desk-card, .tweet-desk");
    if (desk) {
      desk.querySelectorAll("button").forEach(function (btn) {
        var lab = (btn.textContent || "").toLowerCase();
        if (/post on x|tweet/.test(lab) && !btn.__tdBound) {
          btn.__tdBound = true;
          btn.addEventListener("click", function (ev) {
            ev.preventDefault();
            w.tdPost();
          });
        }
      });
    }
  }

  function pullVerseToMeme() {
    if (typeof w.clarityMemeFill === "function") {
      var ar = (d.querySelector("[data-verse-ar]") || {}).textContent || "";
      var en = (d.querySelector("[data-verse-en]") || {}).textContent || "";
      var ref = (d.querySelector("[data-verse-ref]") || {}).textContent || "";
      if (ar || en) w.clarityMemeFill(ar.trim(), en.trim(), ref.trim());
    }
  }

  function boot() {
    restoreLabels();
    d.addEventListener("clarity:tab-mounted", function () {
      setTimeout(restoreLabels, 40);
    });
    var m = d.getElementById("cs-mount");
    if (m && typeof MutationObserver !== "undefined") {
      var t = null;
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(restoreLabels, 50);
      }).observe(m, { childList: true });
    }
    // Fetch → canvas helper on meme bars
    d.addEventListener(
      "click",
      function (ev) {
        var b = ev.target && ev.target.closest && ev.target.closest("[data-meme-act='tweet'], [data-meme-act=\"tweet\"]");
        if (b) {
          pullVerseToMeme();
          setTimeout(function () {
            w.tdPost();
          }, 120);
        }
      },
      true
    );
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.ClarityTweetDesk = { post: w.tdPost, copy: w.tdCopy, version: "TD1" };
})(window, document);

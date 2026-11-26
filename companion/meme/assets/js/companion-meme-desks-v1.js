/*! companion-meme-desks-v1 · X/FB publish helpers · no second paint owner
 * Download / copy image / copy caption / open intent · educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_MEME_DESKS_V1__) return;
  w.__COMPANION_MEME_DESKS_V1__ = true;

  function canvas() {
    return d.getElementById("meme-canvas");
  }

  function status(id, msg) {
    var el = d.getElementById(id);
    if (el) el.textContent = msg || "";
  }

  function caption(which) {
    var id = which === "fb" ? "desk-fb-caption" : "desk-x-caption";
    var el = d.getElementById(id);
    return el ? String(el.value || "").trim() : "";
  }

  function downloadPng(which) {
    var c = canvas();
    if (!c) {
      status("desk-" + which + "-status", "Canvas not ready");
      return;
    }
    try {
      if (typeof w.schedulePaint === "function") w.schedulePaint();
    } catch (e) {}
    try {
      var a = d.createElement("a");
      a.download = "clarity-meme-" + which + ".png";
      a.href = c.toDataURL("image/png");
      a.click();
      status("desk-" + which + "-status", "PNG downloaded — attach in the app");
    } catch (err) {
      status("desk-" + which + "-status", "Download blocked — try another browser");
    }
  }

  function copyText(which) {
    var t = caption(which);
    if (!t) {
      status("desk-" + which + "-status", "Caption empty");
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(
        function () {
          status("desk-" + which + "-status", "Caption copied");
        },
        function () {
          status("desk-" + which + "-status", "Copy failed — select caption manually");
        }
      );
    } else {
      status("desk-" + which + "-status", "Clipboard unavailable");
    }
  }

  function copyImage(which) {
    var c = canvas();
    if (!c) {
      status("desk-" + which + "-status", "Canvas not ready");
      return;
    }
    if (!navigator.clipboard || !window.ClipboardItem) {
      status("desk-" + which + "-status", "Copy image unsupported — use Download PNG");
      return;
    }
    c.toBlob(function (blob) {
      if (!blob) {
        status("desk-" + which + "-status", "Could not export image");
        return;
      }
      navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]).then(
        function () {
          status("desk-" + which + "-status", "Image copied — paste into the app");
        },
        function () {
          status("desk-" + which + "-status", "Copy image failed — use Download PNG");
        }
      );
    }, "image/png");
  }

  function openX() {
    var t = caption("x");
    var url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(t || "Educational share — clarity-dawah.fyi");
    w.open(url, "_blank", "noopener,noreferrer");
    status("desk-x-status", "X opened — attach the PNG if needed");
  }

  function openFB() {
    // Facebook sharer cannot attach local PNG; open facebook.com with guidance
    var url = "https://www.facebook.com/";
    w.open(url, "_blank", "noopener,noreferrer");
    status("desk-fb-status", "Facebook opened — upload the PNG + paste caption");
  }

  function syncPreviews() {
    var c = canvas();
    if (!c) return;
    try {
      var url = c.toDataURL("image/png");
      ["desk-x-preview", "desk-fb-preview"].forEach(function (id) {
        var img = d.getElementById(id);
        if (img && img.tagName === "IMG") img.src = url;
      });
    } catch (e) {}
  }

  function wire() {
    var map = [
      ["desk-x-download", function () { downloadPng("x"); }],
      ["desk-fb-download", function () { downloadPng("fb"); }],
      ["desk-x-copy-text", function () { copyText("x"); }],
      ["desk-fb-copy-text", function () { copyText("fb"); }],
      ["desk-x-copy-img", function () { copyImage("x"); }],
      ["desk-fb-copy-img", function () { copyImage("fb"); }],
      ["desk-x-open", openX],
      ["desk-fb-open", openFB]
    ];
    map.forEach(function (p) {
      var el = d.getElementById(p[0]);
      if (el) el.addEventListener("click", p[1]);
    });
    // refresh previews after paints
    var t = null;
    var obsTarget = d.getElementById("meme-canvas") || d.body;
    if (w.MutationObserver && obsTarget) {
      new MutationObserver(function () {
        if (t) clearTimeout(t);
        t = setTimeout(syncPreviews, 200);
      }).observe(obsTarget.parentNode || obsTarget, { attributes: true, childList: true, subtree: true });
    }
    w.addEventListener("load", function () {
      setTimeout(syncPreviews, 400);
    });
    // hook after owner paint if available
    var prev = w.schedulePaint;
    if (typeof prev === "function") {
      w.schedulePaint = function () {
        var r = prev.apply(this, arguments);
        setTimeout(syncPreviews, 50);
        return r;
      };
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", wire);
  else wire();
})(window, document);

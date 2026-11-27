/*! craft-meme-export-watermark-v1.js · Phase A full
 * Watermark spine + robust PNG export/copy for Craft Meme
 * Default mark: clarity-dawah.fyi/craft/meme · educational only — not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CRAFT_MEME_EXPORT_WM_V1__) return;
  w.__CRAFT_MEME_EXPORT_WM_V1__ = true;

  var DEFAULT_WM = "clarity-dawah.fyi/craft/meme · educational only";

  function $(id) { return d.getElementById(id); }
  function status(msg) {
    var el = $("meme-export-status");
    if (el) el.textContent = msg || "";
  }

  function canvas() {
    return $("meme-canvas") || $("mr-canvas") ||
      d.querySelector("#mr-root canvas") || d.querySelector("canvas.meme-canvas");
  }

  function wmEnabled() {
    var t = $("meme-opt-watermark");
    if (t) return !!t.checked;
    return true; // default on
  }

  function wmText() {
    var custom = $("meme-wm-text");
    var t = custom && custom.value ? String(custom.value).trim() : "";
    return t || DEFAULT_WM;
  }

  /** Draw watermark onto a *copy* canvas so live stage is unchanged unless paint already baked it */
  function bakeWatermark(sourceCanvas) {
    var c = d.createElement("canvas");
    c.width = sourceCanvas.width;
    c.height = sourceCanvas.height;
    var ctx = c.getContext("2d");
    ctx.drawImage(sourceCanvas, 0, 0);
    if (!wmEnabled()) return c;

    var text = wmText();
    var pad = Math.max(10, Math.round(c.height * 0.02));
    var fontSize = Math.max(12, Math.round(c.width * 0.018));
    ctx.save();
    ctx.font = "600 " + fontSize + "px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    // soft bar
    var barH = fontSize + pad * 1.4;
    ctx.fillStyle = "rgba(8, 28, 22, 0.45)";
    ctx.fillRect(0, c.height - barH, c.width, barH);
    ctx.fillStyle = "rgba(246, 241, 231, 0.92)";
    ctx.fillText(text, c.width / 2, c.height - pad * 0.85);
    // thin gold line
    ctx.strokeStyle = "rgba(184, 146, 42, 0.55)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(c.width * 0.2, c.height - barH);
    ctx.lineTo(c.width * 0.8, c.height - barH);
    ctx.stroke();
    ctx.restore();
    return c;
  }

  function toBlob(c, type, quality) {
    return new Promise(function (resolve, reject) {
      try {
        if (c.toBlob) {
          c.toBlob(function (b) {
            if (b) resolve(b);
            else reject(new Error("toBlob empty"));
          }, type || "image/png", quality);
        } else {
          var data = c.toDataURL(type || "image/png");
          var arr = data.split(",");
          var mime = arr[0].match(/:(.*?);/)[1];
          var bstr = atob(arr[1]);
          var n = bstr.length;
          var u8 = new Uint8Array(n);
          while (n--) u8[n] = bstr.charCodeAt(n);
          resolve(new Blob([u8], { type: mime }));
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = d.createElement("a");
    a.href = url;
    a.download = filename;
    d.body.appendChild(a);
    a.click();
    setTimeout(function () {
      try { URL.revokeObjectURL(url); a.remove(); } catch (e) {}
    }, 1500);
  }

  function exportPng() {
    var src = canvas();
    if (!src) {
      status("Canvas not ready");
      return;
    }
    status("Exporting PNG…");
    try {
      var baked = bakeWatermark(src);
      toBlob(baked, "image/png")
        .then(function (blob) {
          downloadBlob(blob, "clarity-meme-" + Date.now() + ".png");
          status("PNG downloaded · watermark " + (wmEnabled() ? "on" : "off") + " · educational only");
        })
        .catch(function () {
          // last resort data URL
          try {
            var a = d.createElement("a");
            a.href = baked.toDataURL("image/png");
            a.download = "clarity-meme-" + Date.now() + ".png";
            a.click();
            status("PNG downloaded (fallback) · educational only");
          } catch (e2) {
            status("Export blocked — canvas may be tainted. Use Blank gradient, then re-paint.");
          }
        });
    } catch (e) {
      status("Export blocked — try Blank gradient scenery, then re-paint.");
    }
  }

  function copyPng() {
    var src = canvas();
    if (!src) {
      status("Canvas not ready");
      return;
    }
    if (!w.navigator.clipboard || !w.ClipboardItem) {
      status("Clipboard PNG not supported — use Download PNG");
      return;
    }
    status("Copying…");
    try {
      var baked = bakeWatermark(src);
      toBlob(baked, "image/png")
        .then(function (blob) {
          return w.navigator.clipboard.write([
            new w.ClipboardItem({ "image/png": blob })
          ]);
        })
        .then(function () {
          status("Copied PNG · watermark " + (wmEnabled() ? "on" : "off"));
        })
        .catch(function () {
          status("Copy failed — use Download PNG (browser permission or tainted canvas)");
        });
    } catch (e) {
      status("Copy failed");
    }
  }

  // Override thin export
  w.craftMemeExportPng = exportPng;
  w.craftMemeCopyPng = copyPng;
  w.memeExportPng = exportPng;

  function ensureControls() {
    var actions = $("meme-export-png") && $("meme-export-png").parentElement;
    if (!actions) return;
    if (!$("meme-opt-watermark")) {
      var label = d.createElement("label");
      label.style.cssText = "display:inline-flex;align-items:center;gap:.3rem;font-size:.8rem;margin-left:.35rem";
      label.innerHTML =
        '<input type="checkbox" id="meme-opt-watermark" checked /> Watermark';
      actions.appendChild(label);
    }
    if (!$("meme-wm-text")) {
      var inp = d.createElement("input");
      inp.type = "text";
      inp.id = "meme-wm-text";
      inp.value = DEFAULT_WM;
      inp.title = "Watermark text on export";
      inp.style.cssText = "display:block;width:100%;max-width:28rem;margin:.35rem 0 0;font-size:.78rem;padding:.3rem .45rem;border-radius:8px;border:1px solid rgba(184,146,42,.35)";
      actions.parentNode.insertBefore(inp, $("meme-export-status") || actions.nextSibling);
    }
  }

  function bind() {
    ensureControls();
    var exp = $("meme-export-png");
    if (exp && !exp._wmBound) {
      exp._wmBound = true;
      exp.addEventListener("click", function (e) {
        e.preventDefault();
        exportPng();
      });
    }
    var copy = $("meme-copy-png");
    if (copy && !copy._wmBound) {
      copy._wmBound = true;
      copy.addEventListener("click", function (e) {
        e.preventDefault();
        copyPng();
      });
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", bind);
  else bind();
  setTimeout(bind, 300);
  setTimeout(bind, 1200);
  try {
    var mo = new MutationObserver(bind);
    mo.observe(d.documentElement, { childList: true, subtree: true });
    setTimeout(function () { try { mo.disconnect(); } catch (e) {} }, 10000);
  } catch (e) {}
})(window, document);

/*! Amānah UFT PNG export v1 · P5
 * Pedigree workspace snapshot of #uft-preview (not name-list only)
 * Overrides uftDownloadPng when possible; falls back to prior core handler
 * Educational only — not a legal pedigree · not a fatwa
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_PNG_V1__) return;
  w.__CLARITY_AMANA_UFT_PNG_V1__ = true;

  var prior = typeof w.uftDownloadPng === "function" ? w.uftDownloadPng : null;

  function isTree() {
    try {
      return /\/amana\/tree\/?/.test(location.pathname || "");
    } catch (e) {
      return false;
    }
  }

  function setStatus(msg) {
    var s = document.getElementById("uft-status") || document.getElementById("uft-fo-status");
    if (s) s.textContent = msg;
  }

  function downloadDataUrl(dataUrl, name) {
    var a = document.createElement("a");
    a.href = dataUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      try {
        a.remove();
      } catch (e) {}
    }, 500);
  }

  function fileName() {
    var self = "family";
    try {
      if (typeof w.uftRead === "function") {
        var d = w.uftRead() || {};
        if (d.self) self = String(d.self);
      }
    } catch (e) {}
    return (
      "clarity-pedigree-workspace-" +
      self.replace(/[^\w\-]+/g, "_").slice(0, 36) +
      "-" +
      new Date().toISOString().slice(0, 10) +
      ".png"
    );
  }

  /** Clone visible workspace into an SVG foreignObject and rasterize */
  function snapshotWorkspace() {
    var target =
      document.getElementById("uft-preview") ||
      document.getElementById("uft-zoom-layer") ||
      document.getElementById("uft-stage");
    if (!target) return Promise.reject(new Error("No pedigree workspace host"));

    var rect = target.getBoundingClientRect();
    var wdt = Math.max(320, Math.ceil(rect.width) || target.scrollWidth || 640);
    var hgt = Math.max(240, Math.ceil(Math.max(target.scrollHeight, rect.height)) || 480);
    // Cap extreme heights for mobile memory
    if (hgt > 2400) hgt = 2400;
    if (wdt > 1600) wdt = 1600;

    var clone = target.cloneNode(true);
    clone.style.background = "#0c1c16";
    clone.style.color = "#e8f0ec";
    clone.style.width = wdt + "px";
    clone.style.minHeight = hgt + "px";
    clone.style.padding = "12px";
    clone.style.boxSizing = "border-box";
    clone.style.transform = "none";

    var stamp =
      '<div xmlns="http://www.w3.org/1999/xhtml" style="font:12px system-ui,sans-serif;color:#c9a84c;margin:0 0 8px">' +
      "Clarity Amānah · educational pedigree outline — not a legal pedigree · not a fatwa" +
      "</div>";

    var serializer = new XMLSerializer();
    var inner = serializer.serializeToString(clone);
    // Ensure xhtml namespace on root if missing
    if (inner.indexOf("xmlns") === -1) {
      inner = inner.replace(
        /^<([a-zA-Z0-9-]+)/,
        '<$1 xmlns="http://www.w3.org/1999/xhtml"'
      );
    }
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="' +
      wdt +
      '" height="' +
      (hgt + 28) +
      '">' +
      '<rect width="100%" height="100%" fill="#0c1c16"/>' +
      '<foreignObject width="100%" height="100%">' +
      '<div xmlns="http://www.w3.org/1999/xhtml" style="background:#0c1c16;color:#e8f0ec;font:14px system-ui,sans-serif;padding:8px">' +
      stamp +
      inner +
      "</div></foreignObject></svg>";

    var svgUrl =
      "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);

    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        try {
          var canvas = document.createElement("canvas");
          canvas.width = wdt;
          canvas.height = hgt + 28;
          var ctx = canvas.getContext("2d");
          ctx.fillStyle = "#0c1c16";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = function () {
        reject(new Error("SVG raster failed"));
      };
      img.src = svgUrl;
    });
  }

  function downloadPng() {
    if (!isTree()) {
      if (prior) return prior.apply(this, arguments);
      return;
    }
    setStatus("Building pedigree PNG snapshot…");
    snapshotWorkspace()
      .then(function (dataUrl) {
        downloadDataUrl(dataUrl, fileName());
        setStatus("Pedigree workspace PNG downloaded · educational outline only.");
      })
      .catch(function (err) {
        try {
          console.warn("[UFT png]", err);
        } catch (e) {}
        if (prior) {
          setStatus("Workspace snapshot failed — using outline export.");
          try {
            prior();
          } catch (e2) {
            alert("Could not export PNG. Try again after the pedigree has rendered.");
          }
        } else {
          alert("Could not export workspace PNG.");
        }
      });
  }

  w.uftDownloadPng = downloadPng;
  w.uftDownloadPedigreeWorkspacePng = downloadPng;
})(typeof window !== "undefined" ? window : this);

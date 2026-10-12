/* Media Reminder Bench — Lab-native (replaces public "Meme Studio" naming) */
(function (g) {
  "use strict";
  if (g.__CLARITY_MEDIA_REMINDER_V1__) return;
  g.__CLARITY_MEDIA_REMINDER_V1__ = true;

  var KEY = "cu_craft_media_log_v1";

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function open(root) {
    if (!root) return;
    root.innerHTML = "";
    var box = el("div", "craft-root");
    box.innerHTML =
      "<h2>🎨 Media Reminder Bench</h2>" +
      '<p class="craft-lead">One truthful reminder with a <strong>verified</strong> Qurʾān or ḥadīth source line. No mockery, no fabricated text.</p>' +
      '<div class="craft-toolbar" style="flex-direction:column;align-items:stretch">' +
      '<input class="craft-field" id="mr-text" type="text" maxlength="280" placeholder="Reminder text (your words, polite)" />' +
      '<input class="craft-field" id="mr-src" type="text" maxlength="120" placeholder="Source e.g. Qurʾān 2:152 or Bukhārī…" />' +
      "</div>" +
      '<div class="craft-toolbar">' +
      '<button type="button" id="mr-render">Preview card</button>' +
      '<button type="button" class="secondary" id="mr-dl">Download PNG</button>' +
      '<button type="button" class="secondary" id="mr-log">Complete &amp; log</button>' +
      "</div>" +
      '<div class="craft-canvas-wrap"><canvas id="mr-canvas" width="720" height="405" aria-label="Reminder preview"></canvas></div>' +
      '<p class="craft-log" id="mr-status"></p>' +
      '<p class="craft-note">Educational media only. Not affiliated with any seminary. Verify wording with a teacher when unsure.</p>';
    root.appendChild(box);

    var canvas = box.querySelector("#mr-canvas");
    var ctx = canvas.getContext("2d");

    function paint() {
      var text = (box.querySelector("#mr-text").value || "").trim() || "Remember Allah with a calm heart.";
      var src = (box.querySelector("#mr-src").value || "").trim() || "Add source before sharing";
      var w = canvas.width, h = canvas.height;
      var g1 = ctx.createLinearGradient(0, 0, w, h);
      g1.addColorStop(0, "#0d3d32");
      g1.addColorStop(1, "#071410");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(224,197,106,0.55)";
      ctx.lineWidth = 4;
      ctx.strokeRect(16, 16, w - 32, h - 32);
      ctx.fillStyle = "#f3e6c0";
      ctx.font = "600 28px Inter, system-ui, sans-serif";
      wrap(ctx, text, w / 2, h * 0.38, w - 100, 36);
      ctx.fillStyle = "rgba(224,197,106,0.9)";
      ctx.font = "16px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(src, w / 2, h * 0.72);
      ctx.fillStyle = "rgba(234,243,238,0.45)";
      ctx.font = "12px Inter, system-ui, sans-serif";
      ctx.fillText("Clarity University · educational reminder", w / 2, h * 0.88);
    }

    function wrap(ctx, text, x, y, maxW, lineH) {
      ctx.textAlign = "center";
      var words = text.split(/\s+/);
      var line = "";
      var yy = y;
      for (var i = 0; i < words.length; i++) {
        var test = line ? line + " " + words[i] : words[i];
        if (ctx.measureText(test).width > maxW && line) {
          ctx.fillText(line, x, yy);
          line = words[i];
          yy += lineH;
        } else line = test;
      }
      if (line) ctx.fillText(line, x, yy);
    }

    paint();
    box.querySelector("#mr-render").onclick = function () {
      paint();
      box.querySelector("#mr-status").textContent = "Preview updated.";
    };
    box.querySelector("#mr-dl").onclick = function () {
      paint();
      var src = (box.querySelector("#mr-src").value || "").trim();
      if (!src) {
        box.querySelector("#mr-status").textContent = "Add a source line before download.";
        return;
      }
      var a = document.createElement("a");
      a.download = "clarity-reminder.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
      box.querySelector("#mr-status").textContent = "Download started.";
    };
    box.querySelector("#mr-log").onclick = function () {
      var src = (box.querySelector("#mr-src").value || "").trim();
      if (!src) {
        box.querySelector("#mr-status").textContent = "Source required to log.";
        return;
      }
      var log = {
        at: Date.now(),
        station: "media",
        text: (box.querySelector("#mr-text").value || "").trim(),
        source: src
      };
      try {
        var arr = JSON.parse(localStorage.getItem(KEY) || "[]");
        arr.unshift(log);
        localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 40)));
      } catch (e) {}
      box.querySelector("#mr-status").textContent = "Logged with source · on this device.";
      try {
        g.dispatchEvent(new CustomEvent("cu-craft-complete", { detail: log }));
      } catch (e2) {}
    };
  }

  g.ClarityMediaReminder = { open: open };
})(typeof window !== "undefined" ? window : this);

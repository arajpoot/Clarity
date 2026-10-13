/* Media Reminder — enriched Phase B + portfolio */
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
      '<p class="craft-lead">Truthful reminder with a <strong>verified</strong> source. Log for O&amp;M → teacher score. No mockery.</p>' +
      '<div class="craft-toolbar" style="flex-direction:column;align-items:stretch">' +
      '<input class="craft-field" id="mr-text" type="text" maxlength="280" placeholder="Reminder text (polite, your words)" />' +
      '<input class="craft-field" id="mr-src" type="text" maxlength="120" placeholder="Source e.g. Qurʾān 2:152 or Bukhārī…" />' +
      "</div>" +
      '<div class="craft-toolbar">' +
      '<button type="button" id="mr-render">Preview</button>' +
      '<button type="button" class="secondary" id="mr-dl">Download PNG</button>' +
      '<button type="button" class="secondary" id="mr-log">Complete &amp; log</button></div>' +
      '<div class="craft-canvas-wrap"><canvas id="mr-canvas" width="720" height="405"></canvas></div>' +
      '<p class="craft-log" id="mr-status"></p>' +
      '<p class="craft-note">Educational media only. Verify wording with a teacher when unsure.</p>';
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
      var words = text.split(/\s+/), line = "", yy = y;
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
    box.querySelector("#mr-render").onclick = function () { paint(); box.querySelector("#mr-status").textContent = "Preview updated."; };
    box.querySelector("#mr-dl").onclick = function () {
      paint();
      var src = (box.querySelector("#mr-src").value || "").trim();
      if (!src) { box.querySelector("#mr-status").textContent = "Add a source before download."; return; }
      var a = document.createElement("a");
      a.download = "clarity-reminder.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    box.querySelector("#mr-log").onclick = function () {
      var src = (box.querySelector("#mr-src").value || "").trim();
      var text = (box.querySelector("#mr-text").value || "").trim();
      if (!src) { box.querySelector("#mr-status").textContent = "Source required to log."; return; }
      try {
        var arr = JSON.parse(localStorage.getItem(KEY) || "[]");
        arr.unshift({ at: Date.now(), text: text, source: src });
        localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 40)));
      } catch (e) {}
      if (g.ClarityLabPortfolio) {
        g.ClarityLabPortfolio.submit({ station: "media", title: "Media reminder", note: text + " [" + src + "]", meta: { source: src } });
        box.querySelector("#mr-status").textContent = "Logged with source · O&M review queue.";
      } else box.querySelector("#mr-status").textContent = "Logged on device.";
    };
  }

  g.ClarityMediaReminder = { open: open };
})(typeof window !== "undefined" ? window : this);

/**
 * Day landing fortify controller · recovery fix
 * Never seal empty room · fill first · then optional one-time order
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAY_FORTIFY_CTRL_V2__) return;
  g.__CLARITY_DAY_FORTIFY_CTRL_V2__ = true;
  g.__CLARITY_DAY_FORTIFY_CTRL__ = true;
  g.__CLARITY_DAY_SECTION_ORDER_V1__ = true;
  g.__CLARITY_DAY_SECTION_ORDER_DISABLED__ = true;

  function roomEl() {
    return document.getElementById("clarity-day-landing-room");
  }

  function unhide(r) {
    if (!r) return;
    try {
      r.removeAttribute("hidden");
      r.hidden = false;
      r.style.setProperty("display", "block", "important");
      r.style.setProperty("visibility", "visible", "important");
      r.style.setProperty("opacity", "1", "important");
    } catch (e) {}
  }

  function ensureFilled() {
    var r = roomEl();
    if (!r) return false;
    unhide(r);
    var inner = r.querySelector(".day-room-inner");
    if (inner && inner.children.length >= 3) return true;
    /* force day-room fill */
    try {
      r.removeAttribute("data-day-fortified");
      r.removeAttribute("data-room-filled");
      if (g.ClarityDayRoom && typeof g.ClarityDayRoom.fill === "function") {
        g.ClarityDayRoom.fill();
      }
    } catch (e) {}
    inner = r.querySelector(".day-room-inner");
    return !!(inner && inner.children.length >= 3);
  }

  function promoteWudu() {
    var r = roomEl();
    if (!r) return;
    var inner = r.querySelector(".day-room-inner");
    if (!inner || inner.children.length < 3) return;
    if (document.getElementById("cdl-wudu-card")) return;

    var btn = document.getElementById("cdl-wudu-btn");
    var body = document.getElementById("cdl-wudu-body");
    var card = document.createElement("div");
    card.className = "cdl-card cdl-wudu-card";
    card.id = "cdl-wudu-card";
    card.setAttribute("data-day-slot", "wudu");

    if (body) {
      var wrap = document.createElement("div");
      wrap.className = "cdl-head";
      wrap.innerHTML = "<h2>💧 Wuḍūʾ steps</h2>";
      card.appendChild(wrap);
      var sub = document.createElement("p");
      sub.className = "cdl-sub";
      sub.textContent = "Educational outline · confirm with a local teacher · not a fatwa.";
      card.appendChild(sub);
      body.hidden = false;
      body.removeAttribute("hidden");
      card.appendChild(body);
      if (btn) btn.style.display = "none";
    } else {
      card.innerHTML =
        '<div class="cdl-head"><h2>💧 Wuḍūʾ steps</h2></div>' +
        '<p class="cdl-sub">Educational outline · not a fatwa.</p>' +
        "<ol class=\"cdl-steps\"><li>Intention &amp; Basmala</li><li>Hands</li><li>Mouth</li><li>Nose</li>" +
        "<li>Face</li><li>Arms</li><li>Head &amp; ears</li><li>Feet</li></ol>" +
        '<p class="cdl-sub"><a href="https://sunnah.com/search?q=wudu" target="_blank" rel="noopener">Sunnah.com · wuḍūʾ</a></p>';
    }
    var after = null;
    inner.querySelectorAll(".cdl-card, .cdl-deed").forEach(function (c) {
      if (/Adhkār|Adhkar|Tasbeeh/i.test(c.textContent || "")) after = c;
    });
    if (after) inner.insertBefore(card, after.nextSibling);
    else inner.appendChild(card);
  }

  function bakeOrderOnce() {
    var r = roomEl();
    if (!r || r.getAttribute("data-day-order-baked") === "1") return;
    var inner = r.querySelector(".day-room-inner");
    if (!inner || inner.children.length < 5) return; /* need real content */
    var orderRe = [
      /dual-tiles|Companion path/i,
      /Do this today/i,
      /Next ṣalāh|Next salah/i,
      /Adhkār|Adhkar/i,
      /Wuḍū|Wudu|cdl-wudu/i,
      /Tasbeeh|streak/i,
      /Qaḍā|Qada/i,
      /Dayn/i,
      /Vault note/i,
      /Send light/i,
      /long stay/i,
      /Reward that may/i,
      /Qibla/i,
      /Core protection/i,
      /Auto review/i,
      /Built for trust/i
    ];
    function sc(el) {
      var t = (el.id || "") + " " + (el.textContent || "").slice(0, 100);
      for (var i = 0; i < orderRe.length; i++) if (orderRe[i].test(t)) return i;
      return 40;
    }
    var kids = Array.prototype.slice.call(inner.children);
    kids.sort(function (a, b) {
      return sc(a) - sc(b);
    });
    kids.forEach(function (k) {
      inner.appendChild(k);
    });
    r.setAttribute("data-day-order-baked", "1");
  }

  function seal() {
    var r = roomEl();
    if (!r) return;
    var inner = r.querySelector(".day-room-inner");
    if (!inner || inner.children.length < 5) return; /* never seal empty/sparse */
    r.setAttribute("data-day-fortified", "1");
    r.setAttribute("data-room-filled", "9");
    unhide(r);
  }

  function boot() {
    try {
      if (!ensureFilled()) return;
      promoteWudu();
      bakeOrderOnce();
      seal();
      unhide(roomEl());
    } catch (e) {
      console.warn("[day fortify v2]", e);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  document.addEventListener("clarity:day-room-ready", function () {
    setTimeout(boot, 40);
  });
  [300, 1000, 2500, 5000].forEach(function (ms) {
    setTimeout(boot, ms);
  });
})(typeof window !== "undefined" ? window : this);

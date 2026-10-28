/**
 * Day landing fortify controller F1–F5
 * Single-owner seal · no external reorder · wuḍūʾ card recovery
 * Educational only — not a fatwa
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAY_FORTIFY_CTRL__) return;
  g.__CLARITY_DAY_FORTIFY_CTRL__ = true;

  /* Phase 1: neutralize section-order shuffler */
  g.__CLARITY_DAY_SECTION_ORDER_V1__ = true; // claim flag so late order script no-ops if it checks
  var _append = Node.prototype.appendChild;
  var sealing = false;

  function room() {
    return document.getElementById("clarity-day-landing-room");
  }

  function seal() {
    var r = room();
    if (!r) return;
    var inner = r.querySelector(".day-room-inner");
    if (!inner || !inner.children.length) return;
    r.setAttribute("data-day-fortified", "1");
    r.setAttribute("data-room-filled", "9");
    /* freeze child list length marker */
    r.setAttribute("data-day-child-lock", String(inner.children.length));
  }

  /* Phase 2: promote wuḍūʾ to first-class card if only a buried fold */
  function promoteWudu() {
    var r = room();
    if (!r) return;
    var inner = r.querySelector(".day-room-inner");
    if (!inner) return;
    if (document.getElementById("cdl-wudu-card")) return;

    var btn = document.getElementById("cdl-wudu-btn");
    var body = document.getElementById("cdl-wudu-body");
    var card = document.createElement("div");
    card.className = "cdl-card cdl-wudu-card";
    card.id = "cdl-wudu-card";
    card.setAttribute("data-day-slot", "wudu");

    if (btn && body) {
      /* lift existing fold into dedicated card without destroying steps */
      var wrap = document.createElement("div");
      wrap.className = "cdl-head";
      wrap.innerHTML = "<h2>💧 Wuḍūʾ steps</h2>";
      card.appendChild(wrap);
      var sub = document.createElement("p");
      sub.className = "cdl-sub";
      sub.textContent = "Educational outline · confirm details with a local teacher · not a fatwa.";
      card.appendChild(sub);
      body.hidden = false;
      body.removeAttribute("hidden");
      card.appendChild(body);
      /* hide old button row if orphan */
      if (btn.parentElement && btn.parentElement !== card) {
        btn.style.display = "none";
      }
    } else {
      card.innerHTML =
        '<div class="cdl-head"><h2>💧 Wuḍūʾ steps</h2></div>' +
        '<p class="cdl-sub">Educational outline · not a fatwa.</p>' +
        "<ol class=\"cdl-steps\">" +
        "<li>Intention &amp; Basmala</li><li>Hands</li><li>Mouth</li><li>Nose</li>" +
        "<li>Face</li><li>Arms</li><li>Head &amp; ears</li><li>Feet</li></ol>" +
        '<p class="cdl-sub"><a href="https://sunnah.com/search?q=wudu" target="_blank" rel="noopener">Sunnah.com · wuḍūʾ</a></p>';
    }

    /* place after adhkar / before qada or after do-today */
    var after = null;
    inner.querySelectorAll(".cdl-card, .cdl-deed").forEach(function (c) {
      var t = c.textContent || "";
      if (/Adhkār|Adhkar|Tasbeeh/i.test(t)) after = c;
    });
    if (after && after.nextSibling) inner.insertBefore(card, after.nextSibling);
    else if (after) inner.appendChild(card);
    else {
      var qada = null;
      inner.querySelectorAll(".cdl-card").forEach(function (c) {
        if (/Qaḍā|Qada/i.test(c.textContent || "")) qada = c;
      });
      if (qada) inner.insertBefore(card, qada);
      else inner.appendChild(card);
    }
  }

  /* Phase 1: one-time baked order without continuous shuffle */
  function bakeOrderOnce() {
    var r = room();
    if (!r || r.getAttribute("data-day-order-baked") === "1") return;
    var inner = r.querySelector(".day-room-inner");
    if (!inner) return;
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
    sealing = true;
    kids.forEach(function (k) {
      inner.appendChild(k);
    });
    sealing = false;
    r.setAttribute("data-day-order-baked", "1");
  }

  function boot() {
    try {
      promoteWudu();
      bakeOrderOnce();
      seal();
    } catch (e) {
      console.warn("[day fortify]", e);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  document.addEventListener("clarity:day-room-ready", function () {
    setTimeout(boot, 30);
  });
  [400, 1200].forEach(function (ms) {
    setTimeout(boot, ms);
  });

  /* Block section-order if it loads later: monkey-patch flag */
  Object.defineProperty(g, "__CLARITY_DAY_SECTION_ORDER_DISABLED__", {
    value: true,
    writable: false
  });
})(typeof window !== "undefined" ? window : this);

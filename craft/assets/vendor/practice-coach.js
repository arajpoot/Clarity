/**
 * Tajweed practice-coach panel · 20261019REC2
 * MUST sit under studio title / lab station bar — never above university banner.
 */
(function (g) {
  "use strict";
  if (g.__TJ_PRACTICE_COACH_V1__) return;
  g.__TJ_PRACTICE_COACH_V1__ = true;

  var TIPS = [
    { t: "Listen first", b: "Play the master example 2–3 times. Slow attention beats fast imitation." },
    { t: "Match gently", b: "Echo with the text visible. One rule focus per session (madd, qalqalah, ghunnah…)." },
    { t: "Record for you only", b: "Recording stays on this device. Score is a practice helper — not a qāriʾ verdict. Nothing is uploaded." },
    { t: "Loop the hard bar", b: "Digital aids that work best use A–B style focus: repeat the difficult phrase before the full āyah." }
  ];

  function buildPanel() {
    var panel = document.createElement("section");
    panel.id = "tj-coach-panel";
    panel.setAttribute("aria-label", "Practice coach");
    panel.style.cssText =
      "width:100%;max-width:48rem;margin:0.75rem auto 1rem;padding:0.85rem 1rem;" +
      "border-radius:16px;border:1px solid rgba(201,162,39,0.3);" +
      "background:rgba(255,255,255,0.06);box-sizing:border-box";

    var h = document.createElement("h2");
    h.textContent = "Practice coach · Listen · Match · Record";
    h.style.cssText = "margin:0 0 0.4rem;font-size:1rem;color:#c9a227";
    panel.appendChild(h);

    var p = document.createElement("p");
    p.style.cssText = "margin:0 0 0.55rem;font-size:0.82rem;opacity:0.9;line-height:1.45";
    p.textContent =
      "Drawn from common digital recitation aids: slow listen, visible echo, self-record, one focus rule. A teacher still leads.";
    panel.appendChild(p);

    var row = document.createElement("div");
    row.style.cssText = "display:flex;flex-wrap:wrap;gap:0.35rem";

    var detail = document.createElement("p");
    detail.style.cssText = "margin:0.55rem 0 0;font-size:0.84rem;line-height:1.45;opacity:0.92";
    detail.textContent = TIPS[0].b;

    TIPS.forEach(function (tip, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = tip.t;
      b.style.cssText =
        "border-radius:999px;padding:0.35rem 0.7rem;font-size:0.75rem;font-weight:700;cursor:pointer;" +
        "border:1px solid rgba(201,162,39,0.3);background:rgba(255,255,255,0.1);color:inherit";
      b.addEventListener("click", function () {
        detail.textContent = tip.b;
        row.querySelectorAll("button").forEach(function (x) {
          x.style.background = x === b ? "#2d6a4f" : "rgba(255,255,255,0.1)";
          x.style.color = x === b ? "#fff" : "inherit";
        });
      });
      if (i === 0) {
        b.style.background = "#2d6a4f";
        b.style.color = "#fff";
      }
      row.appendChild(b);
    });
    panel.appendChild(row);
    panel.appendChild(detail);

    var link = document.createElement("p");
    link.style.cssText = "margin:0.55rem 0 0;font-size:0.8rem";
    link.innerHTML =
      '<a href="/lab/recite/" style="color:inherit;font-weight:700">← Recite studio</a> · ' +
      '<a href="/library/" style="color:inherit;font-weight:700">Library AV</a>';
    panel.appendChild(link);

    try {
      var u = new URL(location.href);
      var s = u.searchParams.get("surah");
      var a = u.searchParams.get("ayah");
      if (s && a) {
        var note = document.createElement("p");
        note.style.cssText = "margin:0.5rem 0 0;font-size:0.8rem;color:#c9a227";
        note.textContent = "Opened from Recite · focus " + s + ":" + a;
        panel.appendChild(note);
        setTimeout(function () {
          var chip = document.querySelector('[data-lab-load="' + s + ":" + a + '"]');
          if (chip) chip.click();
        }, 200);
      }
    } catch (e) {}

    return panel;
  }

  function placePanel(panel) {
    var main = document.querySelector("main");
    if (!main) return false;

    /* Never attach to body / header */
    var h1 = main.querySelector("h1");
    if (h1 && h1.parentNode && main.contains(h1)) {
      if (h1.nextSibling) h1.parentNode.insertBefore(panel, h1.nextSibling);
      else h1.parentNode.appendChild(panel);
      return true;
    }

    var station = main.querySelector(".lab-station-nav");
    if (station && station.parentNode) {
      if (station.nextSibling) station.parentNode.insertBefore(panel, station.nextSibling);
      else station.parentNode.appendChild(panel);
      return true;
    }

    var col = main.querySelector("[style*='max-width']") || main.querySelector(".lab-studio-body");
    if (col) {
      col.insertBefore(panel, col.firstChild);
      return true;
    }

    main.appendChild(panel);
    return true;
  }

  function isAboveBanner(panel) {
    var banner = document.querySelector("header.cu-banner, header .cu-banner, .cu-banner");
    if (!banner || !panel) return false;
    /* If panel precedes banner in document order, it is above the header */
    return !!(panel.compareDocumentPosition(banner) & Node.DOCUMENT_POSITION_FOLLOWING);
  }

  function inject() {
    var old = document.getElementById("tj-coach-panel");
    if (old) old.parentNode.removeChild(old);

    var panel = buildPanel();
    if (!placePanel(panel)) return;

    if (isAboveBanner(panel)) {
      panel.parentNode.removeChild(panel);
      var main = document.querySelector("main");
      if (main) main.appendChild(panel);
    }
  }

  function boot() {
    inject();
    requestAnimationFrame(function () {
      var panel = document.getElementById("tj-coach-panel");
      if (panel && isAboveBanner(panel)) inject();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);

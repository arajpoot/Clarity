/**
 * Tajweed practice-coach panel · 20261019REC
 * Soft modal tips for Listen · Match · Record — does not replace studio.js
 */
(function (g) {
  "use strict";
  if (g.__TJ_PRACTICE_COACH_V1__) return;
  g.__TJ_PRACTICE_COACH_V1__ = true;

  var TIPS = [
    {
      t: "Listen first",
      b: "Play the master example 2–3 times. Slow attention beats fast imitation."
    },
    {
      t: "Match gently",
      b: "Echo with the text visible. One rule focus per session (madd, qalqalah, ghunnah…)."
    },
    {
      t: "Record for you only",
      b: "Recording stays on this device. Score is a practice helper — not a qāriʾ verdict. Nothing is uploaded."
    },
    {
      t: "Loop the hard bar",
      b: "Digital aids that work best use A–B style focus: repeat the difficult phrase before the full āyah."
    }
  ];

  function inject() {
    if (document.getElementById("tj-coach-panel")) return;
    var host =
      document.querySelector("[data-campus-page], .lab-studio-body, main > div") ||
      document.querySelector("main");
    if (!host) return;

    var panel = document.createElement("section");
    panel.id = "tj-coach-panel";
    panel.setAttribute("aria-label", "Practice coach");
    panel.style.cssText =
      "max-width:48rem;margin:0 auto .9rem;padding:.85rem 1rem;border-radius:16px;" +
      "border:1px solid rgba(201,162,39,.3);background:rgba(255,255,255,.06);box-sizing:border-box";

    var h = document.createElement("h2");
    h.textContent = "Practice coach · Listen · Match · Record";
    h.style.cssText = "margin:0 0 .4rem;font-size:1rem;color:#c9a227";
    panel.appendChild(h);

    var p = document.createElement("p");
    p.style.cssText = "margin:0 0 .55rem;font-size:.82rem;opacity:.9;line-height:1.45";
    p.textContent =
      "Drawn from common digital recitation aids: slow listen, visible echo, self-record, one focus rule. A teacher still leads.";
    panel.appendChild(p);

    var row = document.createElement("div");
    row.style.cssText = "display:flex;flex-wrap:wrap;gap:.35rem";
    TIPS.forEach(function (tip, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = tip.t;
      b.style.cssText =
        "border-radius:999px;padding:.35rem .7rem;font-size:.75rem;font-weight:700;cursor:pointer;" +
        "border:1px solid rgba(201,162,39,.3);background:rgba(255,255,255,.1);color:inherit";
      b.addEventListener("click", function () {
        detail.textContent = tip.b;
        row.querySelectorAll("button").forEach(function (x) {
          x.style.background = x === b ? "#2d6a4f" : "rgba(255,255,255,.1)";
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

    var detail = document.createElement("p");
    detail.style.cssText = "margin:.55rem 0 0;font-size:.84rem;line-height:1.45;opacity:.92";
    detail.textContent = TIPS[0].b;
    panel.appendChild(detail);

    var link = document.createElement("p");
    link.style.cssText = "margin:.55rem 0 0;font-size:.8rem";
    link.innerHTML =
      '<a href="/lab/recite/" style="color:inherit;font-weight:700">← Recite studio</a> · ' +
      '<a href="/library/" style="color:inherit;font-weight:700">Library AV</a>';
    panel.appendChild(link);

    var title = host.querySelector("h1");
    if (title && title.parentNode === host) {
      if (title.nextSibling) host.insertBefore(panel, title.nextSibling);
      else host.appendChild(panel);
    } else {
      host.insertBefore(panel, host.firstChild);
    }

    /* URL surah/ayah handoff from Recite */
    try {
      var u = new URL(location.href);
      var s = u.searchParams.get("surah");
      var a = u.searchParams.get("ayah");
      if (s && a) {
        var note = document.createElement("p");
        note.style.cssText = "margin:.5rem 0 0;font-size:.8rem;color:#c9a227";
        note.textContent = "Opened from Recite · focus " + s + ":" + a + " when your studio supports load.";
        panel.appendChild(note);
        var chip = document.querySelector('[data-lab-load="' + s + ":" + a + '"]');
        if (chip) chip.click();
      }
    } catch (e) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inject);
  else inject();
})(typeof window !== "undefined" ? window : this);

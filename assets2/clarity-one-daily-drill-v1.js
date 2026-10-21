/**
 * Clarity One Daily Drill v1 — Companion Learn surface
 * One primary drill only; no second streak. Educational only.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_ONE_DRILL_V1__) return;
  g.__CLARITY_ONE_DRILL_V1__ = true;

  var KEY = "clarity_one_drill_day_v1";
  function todayKey() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function pickKind() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || "null");
      if (o && o.day === todayKey() && o.kind) return o.kind;
    } catch (e) {}
    var kinds = ["tajweed", "quiz", "callig"];
    var kind = kinds[Math.floor(Math.random() * kinds.length)];
    try {
      localStorage.setItem(KEY, JSON.stringify({ day: todayKey(), kind: kind }));
    } catch (e2) {}
    return kind;
  }

  function ensureCard() {
    if (document.getElementById("clarity-one-daily-drill")) return;
    var host =
      document.querySelector("#tab-reminder .rrra-hub-hero") ||
      document.querySelector("#tab-reminder") ||
      document.querySelector("[data-rrra-hub='reminder']") ||
      document.getElementById("tab-reminder");
    if (!host) return;
    var kind = pickKind();
    var card = document.createElement("div");
    card.id = "clarity-one-daily-drill";
    card.className = "card clarity-one-drill";
    card.style.cssText = "margin:0.75rem 0 1rem;padding:0.9rem 1rem;border-radius:14px;border:1px solid rgba(212,180,90,0.35);background:rgba(13,79,60,0.12)";
    var title = "Today's one drill";
    var body = "";
    var primary = "";
    if (kind === "tajweed") {
      body = "Tajweed · about 5 minutes. Uses your existing practice streak — no second streak.";
      primary = '<button type="button" class="btn" id="cod-go-tajweed">Open Tajweed practice</button>';
    } else if (kind === "quiz") {
      body = "Three short questions from today's path theme (educational only).";
      primary = '<button type="button" class="btn" id="cod-go-quiz">Start 3-question pause</button>';
    } else {
      body = "One calligraphy letter · slow and present.";
      primary = '<button type="button" class="btn" id="cod-go-callig">Open calligraphy</button>';
    }
    card.innerHTML =
      '<div style="font-size:0.68rem;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#d4b45a;margin-bottom:0.35rem">One daily drill</div>' +
      "<strong style=\"display:block;margin-bottom:0.25rem\">" + title + "</strong>" +
      '<p style="margin:0 0 0.65rem;font-size:0.88rem;line-height:1.45;opacity:0.9">' + body + "</p>" +
      primary +
      '<div style="margin-top:0.75rem;font-size:0.78rem;opacity:0.8">Other studios (secondary): ' +
      '<a href="#tajweed-live-card">Tajweed</a> · <a href="#callig-lab-card">Calligraphy</a> · <a href="#tab-action">Action tools</a></div>';
    /* insert after hub hero if possible */
    if (host.classList && host.classList.contains("rrra-hub-hero") && host.parentNode) {
      host.parentNode.insertBefore(card, host.nextSibling);
    } else {
      host.insertBefore(card, host.firstChild);
    }
    var goT = document.getElementById("cod-go-tajweed");
    var goQ = document.getElementById("cod-go-quiz");
    var goC = document.getElementById("cod-go-callig");
    if (goT)
      goT.onclick = function () {
        try {
          if (typeof g.clarityOpenSectionDoor === "function") g.clarityOpenSectionDoor("action");
          var el = document.getElementById("tajweed-live-card") || document.getElementById("tajweed-path-card");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          if (typeof g.clarityLiveTajweed === "function") g.clarityLiveTajweed(true);
        } catch (e) {}
      };
    if (goC)
      goC.onclick = function () {
        try {
          if (typeof g.clarityOpenSectionDoor === "function") g.clarityOpenSectionDoor("action");
          var el = document.getElementById("callig-lab-card");
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        } catch (e) {}
      };
    if (goQ)
      goQ.onclick = function () {
        runMiniQuiz();
      };
  }

  function runMiniQuiz() {
    var qs = [
      {
        q: "A fitting first step when remembering death is:",
        opts: ["Repent and do a small good today", "Panic and abandon prayer", "Ignore rights of others", "Invent a fatwa"],
        a: 0
      },
      {
        q: "Educational pages on this site are:",
        opts: ["Not a fatwa — ask a trusted teacher for your case", "Binding court documents", "A replacement for scholars", "Secret knowledge"],
        a: 0
      },
      {
        q: "Deeds that continue after death are discussed in reports such as:",
        opts: ["Ongoing charity, beneficial knowledge, righteous child who prays (verify sources)", "Only wealth left behind", "Whatever social media says", "Nothing continues"],
        a: 0
      }
    ];
    var score = 0;
    for (var i = 0; i < qs.length; i++) {
      var msg = qs[i].q + "\n\n0) " + qs[i].opts[0] + "\n1) " + qs[i].opts[1] + "\n2) " + qs[i].opts[2] + "\n3) " + qs[i].opts[3];
      var ans = prompt(msg, "0");
      if (ans === null) return;
      if (parseInt(ans, 10) === qs[i].a) score++;
    }
    alert("Reflection pause: " + score + " / " + qs.length + " aligned. Educational only — not a test of faith.");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ensureCard);
  else ensureCard();
  g.addEventListener("load", function () {
    setTimeout(ensureCard, 400);
  });
  g.ClarityOneDrill = { ensure: ensureCard, pickKind: pickKind };
})(typeof window !== "undefined" ? window : this);

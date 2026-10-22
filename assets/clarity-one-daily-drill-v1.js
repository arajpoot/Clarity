/**
 * One Daily Drill v1 · Phase 1 rewire · 20261022P17
 * Tajweed → Reminder · Calligraphy → Action
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_ONE_DRILL_V1__ === "20261022P17") return;
  g.__CLARITY_ONE_DRILL_V1__ = "20261022P17";

  var KEY = "clarity_one_drill_day_v1";
  function todayKey() {
    var d = new Date();
    return (
      d.getFullYear() +
      "-" +
      String(d.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(d.getDate()).padStart(2, "0")
    );
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

  function goTab(tab, scrollId) {
    tab = (tab || "reminder").toLowerCase();
    try {
      if (typeof g.switchTab === "function") {
        g.switchTab(tab, scrollId || undefined);
        return;
      }
      if (typeof g.clarityOpenSectionDoor === "function") {
        g.clarityOpenSectionDoor(tab);
      } else if (typeof g.claritySwitchTab === "function") {
        g.claritySwitchTab(tab);
      } else {
        g.location.hash = tab;
      }
    } catch (e) {}
    if (scrollId) {
      setTimeout(function () {
        var el = document.getElementById(scrollId);
        if (el) {
          try {
            el.removeAttribute("hidden");
            el.style.removeProperty("display");
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          } catch (e2) {
            try {
              el.scrollIntoView(true);
            } catch (e3) {}
          }
        }
      }, 180);
    }
  }

  function ensureCard() {
    if (document.getElementById("clarity-one-daily-drill")) return;
    var host =
      document.querySelector("#tab-reminder .rrra-hub-body") ||
      document.querySelector("#tab-reminder .rrra-hub-hero") ||
      document.querySelector("#tab-reminder") ||
      document.getElementById("tab-reminder");
    if (!host) return;
    var kind = pickKind();
    var card = document.createElement("div");
    card.id = "clarity-one-daily-drill";
    card.className = "card clarity-one-drill";
    card.setAttribute("data-rrra", "reminder");
    card.style.cssText =
      "margin:0.75rem 0 1rem;padding:0.9rem 1rem;border-radius:14px;border:1px solid rgba(212,180,90,0.35);background:rgba(13,79,60,0.12)";
    var body = "";
    var primary = "";
    if (kind === "tajweed") {
      body =
        "Tajweed · about 5 minutes. Uses your existing practice streak — no second streak.";
      primary =
        '<button type="button" class="btn" id="cod-go-tajweed">Open Tajweed practice</button>';
    } else if (kind === "quiz") {
      body = "Three short questions from today's path theme (educational only).";
      primary =
        '<button type="button" class="btn" id="cod-go-quiz">Start 3-question pause</button>';
    } else {
      body = "One calligraphy letter · slow and present.";
      primary =
        '<button type="button" class="btn" id="cod-go-callig">Open calligraphy</button>';
    }
    card.innerHTML =
      '<div style="font-size:0.68rem;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:#d4b45a;margin-bottom:0.35rem">One daily drill</div>' +
      "<strong style=\"display:block;margin-bottom:0.25rem\">Today's one drill</strong>" +
      "<p style=\"margin:0 0 0.65rem;font-size:0.92rem;line-height:1.45\">" +
      body +
      "</p>" +
      primary +
      '<p class="td-src" style="margin:0.55rem 0 0;font-size:0.8rem">Other studios (secondary): ' +
      '<a href="#tajweed-live-card" id="cod-sec-tajweed">Tajweed</a> · ' +
      '<a href="#callig-lab-card" id="cod-sec-callig">Calligraphy</a> · ' +
      '<a href="#action" id="cod-sec-action">Action tools</a></p>';

    if (host.classList && host.classList.contains("rrra-hub-body")) {
      host.insertBefore(card, host.firstChild);
    } else {
      host.appendChild(card);
    }

    var goT = document.getElementById("cod-go-tajweed");
    var goC = document.getElementById("cod-go-callig");
    var goQ = document.getElementById("cod-go-quiz");
    var secT = document.getElementById("cod-sec-tajweed");
    var secC = document.getElementById("cod-sec-callig");
    var secA = document.getElementById("cod-sec-action");

    if (goT)
      goT.onclick = function (ev) {
        if (ev) ev.preventDefault();
        /* Phase 1: Reminder — not Action */
        goTab("reminder", "tajweed-live-card");
        setTimeout(function () {
          try {
            if (typeof g.clarityLiveTajweed === "function") g.clarityLiveTajweed(false);
          } catch (e) {}
        }, 250);
      };
    if (goC)
      goC.onclick = function (ev) {
        if (ev) ev.preventDefault();
        goTab("action", "callig-lab-card");
      };
    if (goQ)
      goQ.onclick = function () {
        runMiniQuiz();
      };
    if (secT)
      secT.onclick = function (ev) {
        ev.preventDefault();
        goTab("reminder", "tajweed-live-card");
      };
    if (secC)
      secC.onclick = function (ev) {
        ev.preventDefault();
        goTab("action", "callig-lab-card");
      };
    if (secA)
      secA.onclick = function (ev) {
        ev.preventDefault();
        goTab("action");
      };
  }

  function runMiniQuiz() {
    var qs = [
      {
        q: "A fitting first step when remembering death is:",
        opts: [
          "Repent and do a small good today",
          "Panic and abandon prayer",
          "Ignore rights of others",
          "Invent a fatwa"
        ],
        a: 0
      },
      {
        q: "Educational pages on this site are:",
        opts: [
          "Not a fatwa — ask a trusted teacher for your case",
          "Binding court documents",
          "A replacement for scholars",
          "Secret knowledge"
        ],
        a: 0
      },
      {
        q: "Deeds that continue after death are discussed in reports such as:",
        opts: [
          "Ongoing charity, beneficial knowledge, righteous child who prays (verify sources)",
          "Only wealth left behind",
          "Whatever social media says",
          "Nothing continues"
        ],
        a: 0
      }
    ];
    var score = 0;
    for (var i = 0; i < qs.length; i++) {
      var msg =
        qs[i].q +
        "\n\n0) " +
        qs[i].opts[0] +
        "\n1) " +
        qs[i].opts[1] +
        "\n2) " +
        qs[i].opts[2] +
        "\n3) " +
        qs[i].opts[3];
      var ans = prompt(msg, "0");
      if (ans === null) return;
      if (parseInt(ans, 10) === qs[i].a) score++;
    }
    alert(
      "Reflection pause: " +
        score +
        " / " +
        qs.length +
        " aligned. Educational only — not a test of faith."
    );
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ensureCard);
  else ensureCard();
  g.addEventListener("load", function () {
    setTimeout(ensureCard, 400);
  });
  g.ClarityOneDrill = { ensure: ensureCard, pickKind: pickKind };
})(typeof window !== "undefined" ? window : this);

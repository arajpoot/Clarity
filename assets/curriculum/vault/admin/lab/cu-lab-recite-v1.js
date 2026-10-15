/* Recitation lab — bite-size interactive path (Duolingo-like steps, no XP/leaderboard) */
(function (g) {
  "use strict";
  if (g.__CU_LAB_RECITE_V1__) return;
  g.__CU_LAB_RECITE_V1__ = true;

  var UNITS = [
    {
      id: "fatiha1",
      title: "Al-Fātiḥah 1",
      ar: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
      en: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
      sura: 1,
      ayah: 1,
      quiz: {
        q: "This āyah is primarily…",
        options: ["A name and praise of Allah before reading", "A law about inheritance", "A story of a prophet"],
        answer: 0
      }
    },
    {
      id: "ikhlas1",
      title: "Al-Ikhlāṣ 1",
      ar: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
      en: "Say: He is Allah, One.",
      sura: 112,
      ayah: 1,
      quiz: {
        q: "The core teaching here is…",
        options: ["Tawḥīd — Allah is One", "Rules of fasting", "Travel manners"],
        answer: 0
      }
    },
    {
      id: "asr1",
      title: "Al-ʿAṣr 1",
      ar: "وَٱلْعَصْرِ",
      en: "By time.",
      sura: 103,
      ayah: 1,
      quiz: {
        q: "Allah swears by…",
        options: ["Time", "The mountain", "The sea"],
        answer: 0
      }
    }
  ];

  var idx = 0;
  var step = "listen"; // listen | read | check | quiz

  function $(id) {
    return document.getElementById(id);
  }

  function unit() {
    return UNITS[idx];
  }

  function render() {
    var u = unit();
    $("rc-title").textContent = u.title;
    $("rc-ar").textContent = u.ar;
    $("rc-en").textContent = u.en;
    $("rc-step").textContent =
      step === "listen"
        ? "Step 1 · Listen"
        : step === "read"
          ? "Step 2 · Read along"
          : step === "check"
            ? "Step 3 · Self-check"
            : "Step 4 · Meaning check";
    $("rc-status").textContent = "";
    $("rc-quiz").hidden = step !== "quiz";
    $("rc-actions").hidden = step === "quiz";
    if (step === "quiz") {
      $("rc-q").textContent = u.quiz.q;
      var box = $("rc-options");
      box.innerHTML = "";
      u.quiz.options.forEach(function (opt, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = opt;
        b.addEventListener("click", function () {
          if (i === u.quiz.answer) {
            b.classList.add("ok");
            $("rc-status").textContent = "Correct — reflect, then continue.";
            try {
              localStorage.setItem("clarity_lab_last_v1", String(Date.now()));
            } catch (e) {}
          } else {
            b.classList.add("bad");
            $("rc-status").textContent = "Not that — read the āyah once more.";
          }
        });
        box.appendChild(b);
      });
    }
  }

  function speak() {
    var u = unit();
    if (g.ClarityLabAV) {
      g.ClarityLabAV.playMaster(u.sura, u.ayah);
      return;
    }
    if (g.speechSynthesis) {
      try {
        var ut = new SpeechSynthesisUtterance(u.ar);
        ut.lang = "ar-SA";
        g.speechSynthesis.speak(ut);
      } catch (e) {}
    }
  }

  function boot() {
    document.querySelectorAll("[data-rc-unit]").forEach(function (b) {
      b.addEventListener("click", function () {
        idx = +b.getAttribute("data-rc-unit") || 0;
        step = "listen";
        document.querySelectorAll("[data-rc-unit]").forEach(function (x) {
          x.classList.toggle("here", x === b);
        });
        render();
      });
    });
    if ($("rc-hear")) $("rc-hear").onclick = speak;
    if ($("rc-continue")) $("rc-continue").onclick=function(){idx=(idx+1)%UNITS.length;step="listen";document.querySelectorAll("[data-rc-unit]").forEach(function(x,i){x.classList.toggle("here",i===idx);});render();};
    if ($("rc-next")) {
      $("rc-next").onclick = function () {
        if (step === "listen") step = "read";
        else if (step === "read") step = "check";
        else if (step === "check") step = "quiz";
        else {
          idx = (idx + 1) % UNITS.length;
          step = "listen";
          document.querySelectorAll("[data-rc-unit]").forEach(function (x, i) {
            x.classList.toggle("here", i === idx);
          });
        }
        render();
      };
    }
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);

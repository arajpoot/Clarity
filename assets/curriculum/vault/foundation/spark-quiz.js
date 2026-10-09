/* Clarity Module Spark Quiz v1
 * Replaces simple checkmarks: answer to unlock the next module.
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_MODULE_SPARK_QUIZ_V1__) return;
  g.__CLARITY_MODULE_SPARK_QUIZ_V1__ = true;

  var BANK = null;
  var BANK_URL = "./assets/curriculum/shared/module-spark-quiz-bank.json";
  var ENCOURAGE = [
    "Beautiful — knowledge opened the next door.",
    "May Allah increase you. Next module unlocked.",
    "You proved you read with care. Walk on.",
    "Sincere effort is beloved. Continue with adab.",
    "One step of light at a time. Module unlocked."
  ];

  function loadBank(cb) {
    if (BANK) {
      cb(BANK);
      return;
    }
    fetch(BANK_URL)
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        BANK = data || {};
        if (BANK.encouragement) ENCOURAGE = BANK.encouragement;
        cb(BANK);
      })
      .catch(function () {
        BANK = { modules: {}, passNeed: 2 };
        cb(BANK);
      });
  }

  /** Auto-generate up to 3 MCQs from lesson points + title */
  function autoQuiz(lesson) {
    var pts = (lesson && lesson.points) || [];
    var title = (lesson && lesson.title) || "this module";
    var qs = [];
    if (pts.length) {
      var p0 = String(pts[0]).replace(/[—–].*$/, "").trim();
      if (p0.length > 12) {
        qs.push({
          q: "A key point of \u201c" + title + "\u201d is closest to:",
          opts: [p0.slice(0, 110), "Ignore this lesson", "Replace worship with trends", "Mock seekers of knowledge"],
          a: 0
        });
      }
    }
    if (pts.length > 1) {
      var p1 = String(pts[1]).replace(/[—–].*$/, "").trim();
      qs.push({
        q: "From this module, which action fits best?",
        opts: [
          p1.slice(0, 110),
          "Skip reflection entirely",
          "Share unverified claims",
          "Abandon sincerity"
        ],
        a: 0
      });
    }
    qs.push({
      q: "Before teaching others from this module you should:",
      opts: [
        "Understand with humility and verify with a teacher when unsure",
        "Post confident guesses online",
        "Invent rulings",
        "Hide all sources"
      ],
      a: 0
    });
    return qs.slice(0, 3);
  }

  function getQuestions(lessonId, lesson, cb) {
    loadBank(function (bank) {
      var custom = bank.modules && bank.modules[lessonId];
      if (custom && custom.length) cb(custom, bank.passNeed || 2);
      else cb(autoQuiz(lesson || {}), bank.passNeed || 2);
    });
  }

  function shuffleOpts(item) {
    /* keep correct answer text; shuffle display order */
    var opts = (item.opts || []).slice();
    var correct = opts[item.a];
    for (var i = opts.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = opts[i];
      opts[i] = opts[j];
      opts[j] = tmp;
    }
    var newA = opts.indexOf(correct);
    if (newA < 0) newA = 0;
    return { q: item.q, opts: opts, a: newA };
  }

  function ensureModal() {
    var m = document.getElementById("clarity-spark-quiz-modal");
    if (m) return m;
    m = document.createElement("div");
    m.id = "clarity-spark-quiz-modal";
    m.className = "clarity-spark-quiz-modal";
    m.hidden = true;
    m.innerHTML =
      '<div class="csq-backdrop" data-csq-close="1"></div>' +
      '<div class="csq-card" role="dialog" aria-modal="true" aria-labelledby="csq-title">' +
      '<div class="csq-spark" aria-hidden="true">✦</div>' +
      '<button type="button" class="csq-x" data-csq-close="1" aria-label="Close">×</button>' +
      '<h2 id="csq-title">Spark check</h2>' +
      '<p class="csq-lead" id="csq-lead">Answer to unlock the next module. Educational only.</p>' +
      '<div id="csq-body"></div>' +
      '<div class="csq-actions">' +
      '<button type="button" class="csq-submit" id="csq-submit">Unlock next module</button>' +
      "</div>" +
      '<p class="csq-result" id="csq-result" hidden></p>' +
      '<div class="csq-celebrate" id="csq-celebrate" hidden></div>' +
      "</div>";
    document.body.appendChild(m);
    m.addEventListener("click", function (ev) {
      if (ev.target && ev.target.getAttribute("data-csq-close")) close();
    });
    return m;
  }

  function close() {
    var m = document.getElementById("clarity-spark-quiz-modal");
    if (m) {
      m.hidden = true;
      m.classList.remove("show", "csq-pass-glow");
    }
  }

  function burstCelebrate(el) {
    if (!el) return;
    el.hidden = false;
    el.innerHTML = "";
    var symbols = ["✦", "✧", "·", "∗", "☆"];
    for (var i = 0; i < 18; i++) {
      var s = document.createElement("span");
      s.className = "csq-particle";
      s.textContent = symbols[i % symbols.length];
      s.style.setProperty("--dx", (Math.random() * 160 - 80).toFixed(1) + "px");
      s.style.setProperty("--dy", (Math.random() * -120 - 20).toFixed(1) + "px");
      s.style.setProperty("--delay", (Math.random() * 0.25).toFixed(2) + "s");
      el.appendChild(s);
    }
    setTimeout(function () {
      el.hidden = true;
      el.innerHTML = "";
    }, 1600);
  }

  /**
   * Open spark quiz for a lesson.
   * onPass(lessonId) called when student passes.
   */
  g.clarityOpenModuleSparkQuiz = function (lessonId, lesson, onPass) {
    var m = ensureModal();
    var body = document.getElementById("csq-body");
    var result = document.getElementById("csq-result");
    var title = document.getElementById("csq-title");
    var lead = document.getElementById("csq-lead");
    var celebrate = document.getElementById("csq-celebrate");
    if (title) title.textContent = "Spark check — " + ((lesson && lesson.title) || "module");
    if (lead)
      lead.textContent =
        "Show you understood this module. Pass to unlock the next. Educational only — not a fatwa.";
    if (result) {
      result.hidden = true;
      result.textContent = "";
      result.className = "csq-result";
    }
    if (celebrate) {
      celebrate.hidden = true;
      celebrate.innerHTML = "";
    }
    body.innerHTML = "<p class=\"csq-loading\">Preparing questions…</p>";
    m.hidden = false;
    m.classList.add("show");
    m.classList.remove("csq-pass-glow");

    getQuestions(lessonId, lesson, function (qs, passNeed) {
      if (!qs.length) {
        body.innerHTML = "<p>No questions — unlocking by sincerity path.</p>";
        if (typeof onPass === "function") onPass(lessonId);
        setTimeout(close, 600);
        return;
      }
      var prepared = qs.map(shuffleOpts);
      var html = "";
      prepared.forEach(function (item, i) {
        html += '<fieldset class="csq-q" data-qi="' + i + '">';
        html += "<legend>" + (i + 1) + ". " + item.q + "</legend>";
        item.opts.forEach(function (opt, oi) {
          var id = "csq-" + i + "-" + oi;
          html +=
            '<label class="csq-opt" for="' +
            id +
            '"><input type="radio" name="csq-' +
            i +
            '" id="' +
            id +
            '" value="' +
            oi +
            '"/> <span>' +
            opt +
            "</span></label>";
        });
        html += "</fieldset>";
      });
      body.innerHTML = html;
      body._prepared = prepared;
      body._passNeed = passNeed;
      body._lessonId = lessonId;
      body._onPass = onPass;

      var sub = document.getElementById("csq-submit");
      if (sub) {
        sub.textContent = "Unlock next module";
        sub.disabled = false;
        sub.onclick = function () {
          var correct = 0;
          prepared.forEach(function (item, i) {
            var picked = body.querySelector('input[name="csq-' + i + '"]:checked');
            if (picked && parseInt(picked.value, 10) === item.a) correct++;
          });
          var need = Math.min(passNeed || 2, prepared.length);
          /* allow full pass if only 2 questions */
          if (prepared.length <= 2) need = prepared.length;
          result.hidden = false;
          if (typeof g.clarityRecordUniversityScore === "function") {
            var phaseNow = 1;
            try {
              phaseNow = parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1;
            } catch (eP) {}
            g.clarityRecordUniversityScore({
              phase: phaseNow,
              moduleId: lessonId,
              kind: "spark",
              correct: correct,
              total: prepared.length
            });
          }
          if (correct >= need) {
            result.textContent =
              ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)] +
              " (" +
              correct +
              "/" +
              prepared.length +
              ")";
            result.className = "csq-result pass";
            m.classList.add("csq-pass-glow");
            burstCelebrate(celebrate);
            sub.disabled = true;
            if (typeof onPass === "function") onPass(lessonId);
            setTimeout(close, 1400);
          } else {
            result.textContent =
              "Not yet (" +
              correct +
              "/" +
              prepared.length +
              "). Re-read the points above, then try again. Need " +
              need +
              "+ correct.";
            result.className = "csq-result fail";
            /* gentle hint: reveal first point */
            if (lesson && lesson.points && lesson.points[0]) {
              result.textContent += " Hint: “" + String(lesson.points[0]).slice(0, 80) + "…”";
            }
          }
        };
      }
    });
  };

  /* Prefetch bank */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      loadBank(function () {});
    });
  } else loadBank(function () {});
})(typeof window !== "undefined" ? window : this);

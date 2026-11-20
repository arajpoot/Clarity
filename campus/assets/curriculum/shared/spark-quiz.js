/* Clarity Module Spark Quiz v2 — adab gate
 * Answer to unlock next module. Shows lesson adab before questions.
 * Educational only — not a fatwa. Not a grade of iman.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_MODULE_SPARK_QUIZ_V1__) return;
  g.__CLARITY_MODULE_SPARK_QUIZ_V1__ = true;

  var BANK = null;
  /* absolute path — relative ./ broke on /campus/desk/seeker/ */
  var BANK_URL = "/assets/curriculum/shared/module-spark-quiz-bank.json";
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
        opts: [p1.slice(0, 110), "Skip reflection entirely", "Share unverified claims", "Abandon sincerity"],
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
      '<p class="csq-lead" id="csq-lead">Answer with adab to unlock the next module. Educational only — not a grade of īmān.</p>' +
      '<div id="csq-adab" class="csq-adab" hidden></div>' +
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
    el.textContent = "✦";
    setTimeout(function () {
      el.hidden = true;
    }, 1200);
  }

  function adabText(lesson) {
    if (lesson && lesson.adab) return String(lesson.adab);
    return "Sit with a calm heart. This is knowledge — not debate sport. Answer sincerely.";
  }

  /** Public API used by college-seeker Prove it button */
  g.ClaritySparkQuiz = g.ClaritySparkQuiz || {};
  g.ClaritySparkQuiz.open = function (lessonId, lesson, onPass) {
    var m = ensureModal();
    var body = document.getElementById("csq-body");
    var result = document.getElementById("csq-result");
    var celebrate = document.getElementById("csq-celebrate");
    var adabEl = document.getElementById("csq-adab");
    var title = document.getElementById("csq-title");
    var lead = document.getElementById("csq-lead");
    if (title) title.textContent = "Spark check · " + ((lesson && lesson.title) || "module");
    if (lead)
      lead.textContent =
        "Read the adab line, then answer to unlock the next module. Educational only — not a grade of īmān.";
    if (adabEl) {
      adabEl.hidden = false;
      adabEl.innerHTML =
        "<strong>Adab</strong>" +
        "<p>“" +
        adabText(lesson) +
        "”</p>" +
        '<label class="csq-adab-check"><input type="checkbox" id="csq-adab-ok"/> I will answer with this adab</label>';
    }
    if (result) {
      result.hidden = true;
      result.textContent = "";
      result.className = "csq-result";
    }
    if (celebrate) celebrate.hidden = true;
    body.innerHTML = "<p class=\"csq-loading\">Preparing questions…</p>";
    m.hidden = false;
    m.classList.add("show");

    getQuestions(lessonId, lesson, function (questions, passNeed) {
      var prepared = (questions || []).map(shuffleOpts);
      if (!prepared.length) {
        body.innerHTML = "<p>No questions available. Re-read the module, then try again.</p>";
        return;
      }
      var html = prepared
        .map(function (item, i) {
          var opts = (item.opts || [])
            .map(function (opt, j) {
              return (
                '<label class="csq-opt"><input type="radio" name="csq-' +
                i +
                '" value="' +
                j +
                '"/> <span>' +
                opt +
                "</span></label>"
              );
            })
            .join("");
          return (
            '<fieldset class="csq-q"><legend>' +
            (i + 1) +
            ". " +
            item.q +
            "</legend>" +
            opts +
            "</fieldset>"
          );
        })
        .join("");
      body.innerHTML = html;

      var sub = document.getElementById("csq-submit");
      if (sub) {
        sub.textContent = "Unlock next module";
        sub.disabled = false;
        sub.onclick = function () {
          var ok = document.getElementById("csq-adab-ok");
          if (ok && !ok.checked) {
            result.hidden = false;
            result.className = "csq-result fail";
            result.textContent = "Tick the adab line first — then answer the questions.";
            return;
          }
          var correct = 0;
          prepared.forEach(function (item, i) {
            var picked = body.querySelector('input[name="csq-' + i + '"]:checked');
            if (picked && parseInt(picked.value, 10) === item.a) correct++;
          });
          var need = Math.min(passNeed || 2, prepared.length);
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
            if (lesson && lesson.points && lesson.points[0]) {
              result.textContent += " Hint: “" + String(lesson.points[0]).slice(0, 80) + "…”";
            }
          }
        };
      }
    });
  };

  /* aliases used by older college builds */
  g.clarityOpenSparkQuiz = g.ClaritySparkQuiz.open;
  g.openSparkQuiz = g.ClaritySparkQuiz.open;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      loadBank(function () {});
    });
  } else loadBank(function () {});
})(typeof window !== "undefined" ? window : this);

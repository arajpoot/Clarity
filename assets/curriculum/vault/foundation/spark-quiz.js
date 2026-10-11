/* Clarity Nur Reflection Gate v2
 * Humble, educative pause before the next module.
 * Not a test of faith. Not "reflect." Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_MODULE_SPARK_QUIZ_V1__) return;
  g.__CLARITY_MODULE_SPARK_QUIZ_V1__ = true;

  var BANK = null;
  var BANK_URL = "./assets/curriculum/shared/module-spark-quiz-bank.json";
  var ENCOURAGE = [
    "May Allah increase you in beneficial knowledge.",
    "A calm step is still a step. The next section is open.",
    "Understanding with humility is beloved. Continue gently.",
    "You reflected with care. Walk on with adab.",
    "Knowledge is light when paired with sincerity."
  ];
  var GENTLE_RETRY = [
    "No worry — read the points once more, then try again.",
    "Learning is a journey. Review the lesson and return.",
    "Take a breath. The aim is understanding, not speed."
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
        if (BANK.gentleRetry) GENTLE_RETRY = BANK.gentleRetry;
        cb(BANK);
      })
      .catch(function () {
        BANK = { modules: {}, passNeed: 2 };
        cb(BANK);
      });
  }

  /** Soft reflection prompts from lesson points — educational, not adversarial */
  function autoQuiz(lesson) {
    var pts = (lesson && lesson.points) || [];
    var title = (lesson && lesson.title) || "this section";
    var qs = [];
    if (pts.length) {
      var p0 = String(pts[0]).replace(/[—–].*$/, "").trim();
      if (p0.length > 12) {
        qs.push({
          q: "Which idea best matches what we studied in \u201c" + title + "\u201d?",
          opts: [
            p0.slice(0, 110),
            "That this lesson can be skipped without reading",
            "That sincerity does not matter in learning",
            "That we should mock those who ask questions"
          ],
          a: 0
        });
      }
    }
    if (pts.length > 1) {
      var p1 = String(pts[1]).replace(/[—–].*$/, "").trim();
      qs.push({
        q: "A fitting next step after this section is:",
        opts: [
          p1.slice(0, 110),
          "To invent a ruling without a teacher",
          "To share claims we have not checked",
          "To abandon humility"
        ],
        a: 0
      });
    }
    qs.push({
      q: "How should we carry knowledge from this section?",
      opts: [
        "With humility — and ask a qualified teacher when unsure",
        "By posting confident guesses online",
        "By inventing rulings for others",
        "By hiding every source we used"
      ],
      a: 0
    });
    return qs.slice(0, 3);
  }

  function getQuestions(lessonId, lesson, cb) {
    loadBank(function (bank) {
      var custom = bank.modules && bank.modules[lessonId];
      if (custom && custom.length) cb(custom, bank.passNeed || 2);
      else cb(autoQuiz(lesson), bank.passNeed || 2);
    });
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)] || arr[0];
  }

  function ensureStyles() {
    if (document.getElementById("clarity-reflect-css")) return;
    var s = document.createElement("style");
    s.id = "clarity-reflect-css";
    s.textContent =
      ".nur-reflect-overlay{position:fixed;inset:0;z-index:99990;background:rgba(4,10,8,.72);display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(6px)}" +
      ".nur-reflect-card{max-width:26rem;width:100%;max-height:90vh;overflow:auto;border-radius:18px;border:1px solid rgba(224,197,106,.35);" +
      "background:linear-gradient(165deg,#0e1a16,#0a1210);color:#eaf3ee;padding:1.15rem 1.2rem;box-shadow:0 20px 50px rgba(0,0,0,.45)}" +
      ".nur-reflect-card h3{margin:0 0 .35rem;font-size:1.05rem;color:#e0c56a;font-weight:800}" +
      ".nur-reflect-card .nr-sub{font-size:.78rem;opacity:.78;margin:0 0 1rem;line-height:1.4}" +
      ".nr-q{margin:0 0 .65rem;font-size:.9rem;font-weight:650;line-height:1.4}" +
      ".nr-opt{display:block;width:100%;text-align:left;margin:.35rem 0;padding:.55rem .7rem;border-radius:12px;" +
      "border:1px solid rgba(255,255,255,.1);background:rgba(20,32,28,.9);color:#eaf3ee;font:inherit;cursor:pointer}" +
      ".nr-opt:hover{border-color:rgba(224,197,106,.4)}" +
      ".nr-opt.is-pick{border-color:#1fa67a;background:rgba(31,166,122,.15)}" +
      ".nr-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}" +
      ".nr-actions button{font:inherit;font-weight:700;padding:.45rem .9rem;border-radius:999px;cursor:pointer;border:1px solid rgba(224,197,106,.35)}" +
      ".nr-go{background:#0d4f3c;color:#f0e6c8}" +
      ".nr-soft{background:transparent;color:#c5d4cc}" +
      ".nr-msg{font-size:.85rem;margin-top:.75rem;line-height:1.4}" +
      ".nr-msg.ok{color:#8fdfc0}" +
      ".nr-msg.soft{color:#e0c56a}" +
      ".nr-progress{font-size:.72rem;opacity:.7;margin-bottom:.5rem}";
    document.head.appendChild(s);
  }

  /**
   * Open humble reflection gate.
   * onPass() called when enough answers match.
   */
  function openSparkQuiz(lesson, onPass, onCancel) {
    ensureStyles();
    var lessonId = (lesson && lesson.id) || "unknown";
    getQuestions(lessonId, lesson, function (questions, passNeed) {
      if (!questions || !questions.length) {
        if (typeof onPass === "function") onPass({ skipped: true });
        return;
      }
      var picks = {};
      var overlay = document.createElement("div");
      overlay.className = "nur-reflect-overlay";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-label", "Reflection pause");

      var card = document.createElement("div");
      card.className = "nur-reflect-card";
      card.innerHTML =
        "<h3>Reflection pause</h3>" +
        '<p class="nr-sub">A short, gentle check so the next section opens with understanding — not to prove yourself. Educational only; not a test of faith.</p>' +
        '<p class="nr-progress" id="nr-prog"></p>' +
        '<div id="nr-body"></div>' +
        '<div class="nr-actions">' +
        '<button type="button" class="nr-go" id="nr-submit">Continue with understanding</button>' +
        '<button type="button" class="nr-soft" id="nr-later">Return to lesson</button>' +
        "</div>" +
        '<p class="nr-msg" id="nr-msg" hidden></p>';

      overlay.appendChild(card);
      document.body.appendChild(overlay);

      var body = card.querySelector("#nr-body");
      var msg = card.querySelector("#nr-msg");
      var prog = card.querySelector("#nr-prog");
      prog.textContent =
        "Choose the answer that best reflects the lesson (" + passNeed + " of " + questions.length + " to proceed).";

      questions.forEach(function (Q, qi) {
        var block = document.createElement("div");
        block.style.marginBottom = "1rem";
        var qel = document.createElement("p");
        qel.className = "nr-q";
        qel.textContent = Q.q || Q.question || "Reflect:";
        block.appendChild(qel);
        (Q.opts || Q.options || []).forEach(function (opt, oi) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "nr-opt";
          b.textContent = opt;
          b.addEventListener("click", function () {
            picks[qi] = oi;
            block.querySelectorAll(".nr-opt").forEach(function (x) {
              x.classList.remove("is-pick");
            });
            b.classList.add("is-pick");
          });
          block.appendChild(b);
        });
        body.appendChild(block);
      });

      function close() {
        try {
          overlay.remove();
        } catch (e) {}
      }

      card.querySelector("#nr-later").onclick = function () {
        close();
        if (typeof onCancel === "function") onCancel();
      };

      card.querySelector("#nr-submit").onclick = function () {
        var need = passNeed || 2;
        var ok = 0;
        questions.forEach(function (Q, qi) {
          var ans = typeof Q.a === "number" ? Q.a : Q.answer;
          if (picks[qi] === ans) ok++;
        });
        msg.hidden = false;
        if (ok >= need) {
          msg.className = "nr-msg ok";
          msg.textContent = pick(ENCOURAGE);
          setTimeout(function () {
            close();
            if (typeof onPass === "function") onPass({ score: ok, total: questions.length });
          }, 900);
        } else {
          msg.className = "nr-msg soft";
          msg.textContent = pick(GENTLE_RETRY) + " (" + ok + "/" + questions.length + " aligned)";
        }
      };

      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) {
          /* soft: do not force close on backdrop — encourage return to lesson */
        }
      });
    });
  }

  g.ClaritySparkQuiz = {
    open: openSparkQuiz,
    openReflection: openSparkQuiz,
    autoQuiz: autoQuiz
  };
  try {
    console.info("%c Nur Reflection ", "background:#0d4f3c;color:#f0e6c8", "humble gate ready");
  } catch (e) {}
})(typeof window !== "undefined" ? window : this);

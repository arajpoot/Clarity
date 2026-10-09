/* Clarity Da'i University Curriculum v1
 * Under existing Da'i path umbrella
 * Informed by: IU Madinah Aqeedah & Da'wah plan, UQU Da'wah & Culture,
 * Dawah Academy diploma (methods, rhetoric, misconceptions), UM Dakwah Development (media, psychology)
 * Pedagogy: authentic tasks, reflection, portfolio (non-test + self-check) — educational only
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_DAI_UNIVERSITY_V1__) return;
  g.__CLARITY_DAI_UNIVERSITY_V1__ = true;

  var PK = "clarity_dai_uni_progress_v1";
  var PORT = "clarity_dai_portfolio_v1";

  var UNITS = [
    {
      id: "dai-u1",
      title: "Unit 1 — Usūl al-Daʿwah & ethics of the caller",
      goal: "Know what daʿwah is, its rank, and the character required of a dāʿī.",
      lessons: [
        {
          id: "dai-u1-l1",
          title: "Definition & intention",
          minutes: 12,
          points: [
            "Daʿwah is inviting to Allah with knowledge, wisdom, and beautiful counsel (16:125).",
            "Intention: for Allah alone — not status or argument wins.",
            "University bar: define daʿwah in one paragraph in your own words."
          ],
          ayah: { ref: "Qur'an 16:125", en: "Invite to the way of your Lord with wisdom and good instruction..." },
          openCard: "dai-transmit-card",
          activity: {
            type: "write",
            prompt: "Write 4–6 lines: What is daʿwah, and what intention will you protect?",
            rubric: "Clear definition · sincere intention · no harshness"
          },
          links: [{ label: "Qur'an 16:125", href: "https://quran.com/16/125" }]
        },
        {
          id: "dai-u1-l2",
          title: "Adab of the dāʿī",
          minutes: 10,
          points: [
            "Knowledge before speech; patience; humility; respect for the audience.",
            "Avoid mockery and compulsion — guidance is from Allah.",
            "Activity: list 5 character traits you will practice this week."
          ],
          openCard: "cw-card",
          activity: {
            type: "checklist",
            prompt: "Tick traits you will practice",
            items: ["Patience", "Humility", "Truthfulness", "Listening first", "Soft speech"]
          },
          links: []
        }
      ]
    },
    {
      id: "dai-u2",
      title: "Unit 2 — Prophetic method in daʿwah",
      goal: "Extract methods from the Seerah for real conversations.",
      lessons: [
        {
          id: "dai-u2-l1",
          title: "Seerah as method lab",
          minutes: 15,
          points: [
            "Study one Seerah episode: audience, message, tone, outcome.",
            "Prophets used hikmah, stories, questions, and lived example.",
            "Assignment: one-page method note from Seerah Mirror or Seerah Live."
          ],
          openCard: "seerah-mirror-card",
          activity: {
            type: "write",
            prompt: "Method note: Audience / Message / Tone / One lesson for today",
            rubric: "Specific Seerah scene · transferable method · respectful tone"
          },
          links: [{ label: "Qur'an 33:21", href: "https://quran.com/33/21" }]
        },
        {
          id: "dai-u2-l2",
          title: "Samiʿnā — living transmission",
          minutes: 10,
          points: [
            "Daʿwah begins with personal obedience.",
            "Open Samiʿnā / Commands; teach one verse meaning to a family member (with adab)."
          ],
          openCard: "samina-verse-card",
          activity: {
            type: "teachback",
            prompt: "Teach-back: explain one verse to someone (or record for yourself).",
            rubric: "Accurate meaning · soft tone · invited questions"
          },
          links: []
        }
      ]
    },
    {
      id: "dai-u3",
      title: "Unit 3 — Content craft (media-aware daʿwah)",
      goal: "Produce truthful, beautiful, Shariah-safe reminders.",
      lessons: [
        {
          id: "dai-u3-l1",
          title: "Meme Studio as reminder lab",
          minutes: 15,
          points: [
            "Design one scenery-backed reminder (verse + translation).",
            "No prophet likeness; no Quran as decoration; scenery only.",
            "University skill: clarity + beauty + accuracy."
          ],
          openCard: "meme-card",
          activity: {
            type: "project",
            prompt: "Export one meme; note the verse ref in Notes portfolio.",
            rubric: "Correct text · readable · Shariah-safe background"
          },
          links: []
        },
        {
          id: "dai-u3-l2",
          title: "Notes portfolio",
          minutes: 10,
          points: [
            "Keep a daʿwah journal: questions heard, answers researched, sources.",
            "Cite Qur'an/hadith carefully; mark weak claims for later verification."
          ],
          openCard: "notes-shell",
          activity: {
            type: "write",
            prompt: "Portfolio entry: one question + one sourced answer outline.",
            rubric: "Source named · humble language · next research step"
          },
          links: []
        }
      ]
    },
    {
      id: "dai-u4",
      title: "Unit 4 — Clarity vs confusion (Isrāʾīliyyāt & caution)",
      goal: "Prefer authentic reports; flag weak stories gently.",
      lessons: [
        {
          id: "dai-u4-l1",
          title: "Isrāʾīliyyāt awareness",
          minutes: 12,
          points: [
            "Open Israeliyat module: learn what to accept, reject, or pause.",
            "University rule: do not transmit doubtful stories as certain din.",
            "Quiz yourself: when do we suspend judgment?"
          ],
          openCard: "israeliyat-card",
          activity: {
            type: "quiz",
            prompt: "Self-check",
            questions: [
              {
                q: "A dramatic story has no isnād and contradicts Qur'an. You should:",
                options: ["Share widely", "Reject or suspend", "Argue online"],
                answer: 1
              },
              {
                q: "Best first source for creed issues:",
                options: ["Random clip", "Qur'an & authentic Sunnah via reliable teachers", "Anonymous forum"],
                answer: 1
              }
            ]
          },
          links: []
        }
      ]
    },
    {
      id: "dai-u5",
      title: "Unit 5 — Voice, Asma, sealed nectar depth",
      goal: "Deepen content quality: Names of Allah, Sealed Nectar, careful speech.",
      lessons: [
        {
          id: "dai-u5-l1",
          title: "Asmāʾ — knowing Allah to call to Him",
          minutes: 12,
          points: [
            "Study one Name; connect it to hope and worship.",
            "Daʿwah without knowing Allah becomes empty rhetoric."
          ],
          openCard: "asma-names-lecture-card",
          activity: {
            type: "write",
            prompt: "One Name: meaning · how it changes your call this week",
            rubric: "Accurate · practical · humble"
          },
          links: []
        },
        {
          id: "dai-u5-l2",
          title: "Sealed Nectar / timeline study",
          minutes: 15,
          points: [
            "Open Sealed Nectar card if available; map one Makkan and one Madinan skill of the Prophet ﷺ as caller."
          ],
          openCard: "sealed-nectar-card",
          activity: {
            type: "write",
            prompt: "Two skills from Seerah for a modern dāʿī",
            rubric: "Historically grounded · transferable · ethical"
          },
          links: []
        }
      ]
    },
    {
      id: "dai-u6",
      title: "Unit 6 — Capstone portfolio",
      goal: "Assemble a small daʿwah portfolio (university-style product).",
      lessons: [
        {
          id: "dai-u6-l1",
          title: "Capstone checklist",
          minutes: 20,
          points: [
            "1 definition of daʿwah · 1 Seerah method note · 1 meme · 1 Notes research entry · 1 Name reflection",
            "Review ethics: no compulsion, no mockery, no weak stories as certainty.",
            "Optional: share portfolio with a mentor at your mosque."
          ],
          openCard: "dai-transmit-card",
          activity: {
            type: "portfolio",
            prompt: "Mark each artifact ready in the portfolio panel below.",
            items: ["Definition note", "Seerah method", "Meme export", "Research entry", "Asmāʾ reflection"]
          },
          links: [{ label: "Qur'an 41:33", href: "https://quran.com/41/33" }]
        }
      ]
    }
  ];

  function load(key, fb) {
    try {
      return JSON.parse(localStorage.getItem(key) || fb || "{}");
    } catch (e) {
      return {};
    }
  }
  function save(key, v) {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch (e) {}
  }
  function markDone(id) {
    var p = load(PK, "{}");
    p[id] = { done: true, at: Date.now() };
    save(PK, p);
    render();
  }
  function isDone(id) {
    var p = load(PK, "{}");
    return !!(p[id] && p[id].done);
  }
  function portGet() {
    return load(PORT, "{}");
  }
  function portSet(k, v) {
    var p = portGet();
    p[k] = v;
    save(PORT, p);
  }

  function openCard(id) {
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    try {
      el.classList.remove("gate-hidden", "hidden");
      el.hidden = false;
      el.style.removeProperty("display");
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {}
  }

  function ensureCard() {
    var card = document.getElementById("dai-university-curriculum-card");
    if (card) return card;
    card = document.createElement("section");
    card.id = "dai-university-curriculum-card";
    card.className = "card";
    card.setAttribute("data-clarity-path", "dai");
    card.setAttribute("data-clarity-curriculum", "university");
    card.innerHTML =
      '<h2 class="card-title">University track — Daʿī</h2>' +
      '<p class="card-lead">Usūl, prophetic method, media craft, caution with weak reports, Asmāʾ/Seerah depth, and a portfolio capstone. Under the existing Daʿī path. Educational only.</p>' +
      '<div id="dai-uni-progress" class="junior-progress"></div>' +
      '<div id="dai-uni-body" class="junior-body"></div>' +
      '<p class="junior-footnote">Informed by Madinah / UQU-style daʿwah course maps & Dawah Academy method modules. Not a degree or ijāzah.</p>';
    var anchor =
      document.getElementById("dai-transmit-card") ||
      document.getElementById("israeliyat-card") ||
      document.getElementById("meme-card");
    if (anchor && anchor.parentNode) {
      if (anchor.nextSibling) anchor.parentNode.insertBefore(card, anchor.nextSibling);
      else anchor.parentNode.appendChild(card);
    } else (document.getElementById("main") || document.body).appendChild(card);
    return card;
  }

  function renderActivity(les) {
    var a = les.activity;
    if (!a) return "";
    var h = '<div class="curr-activity" data-act="' + les.id + '">';
    h += '<div class="curr-act-label">Activity · ' + a.type + "</div>";
    h += "<p>" + a.prompt + "</p>";
    if (a.type === "write" || a.type === "project" || a.type === "teachback") {
      h +=
        '<textarea class="curr-textarea" data-port="' +
        les.id +
        '" rows="3" placeholder="Your notes stay on this device…">' +
        (portGet()[les.id] || "") +
        "</textarea>";
      if (a.rubric) h += '<p class="curr-rubric">Rubric: ' + a.rubric + "</p>";
      h +=
        '<button type="button" class="mv-chip" data-save-port="' +
        les.id +
        '">Save draft</button>';
    } else if (a.type === "checklist" || a.type === "portfolio") {
      var items = a.items || [];
      var saved = portGet()[les.id] || {};
      items.forEach(function (it, i) {
        var on = saved[i] ? " checked" : "";
        h +=
          '<label class="curr-check"><input type="checkbox" data-check="' +
          les.id +
          '" data-i="' +
          i +
          '"' +
          on +
          "/> " +
          it +
          "</label>";
      });
    } else if (a.type === "quiz" && a.questions) {
      a.questions.forEach(function (qq, qi) {
        h += '<div class="curr-quiz-q"><strong>Q' + (qi + 1) + ".</strong> " + qq.q + "<br/>";
        (qq.options || []).forEach(function (op, oi) {
          h +=
            '<button type="button" class="mv-chip" data-quiz="' +
            les.id +
            '" data-qi="' +
            qi +
            '" data-oi="' +
            oi +
            '" data-ans="' +
            qq.answer +
            '">' +
            op +
            "</button> ";
        });
        h += '<span class="curr-quiz-fb" data-fb="' + les.id + "-" + qi + '"></span></div>';
      });
    }
    h += "</div>";
    return h;
  }

  function render() {
    ensureCard();
    var prog = document.getElementById("dai-uni-progress");
    var body = document.getElementById("dai-uni-body");
    if (!prog || !body) return;
    var total = 0,
      done = 0;
    UNITS.forEach(function (u) {
      u.lessons.forEach(function (l) {
        total++;
        if (isDone(l.id)) done++;
      });
    });
    var pct = total ? Math.round((100 * done) / total) : 0;
    prog.innerHTML =
      '<div class="junior-bar"><div class="junior-bar-fill" style="width:' +
      pct +
      '%"></div></div><span>' +
      done +
      " / " +
      total +
      " · " +
      pct +
      "%</span>";

    var html = "";
    UNITS.forEach(function (unit) {
      html += '<article class="junior-unit"><h3>' + unit.title + "</h3>";
      html += '<p class="junior-goal">' + unit.goal + "</p>";
      unit.lessons.forEach(function (les) {
        var d = isDone(les.id);
        html += '<div class="junior-lesson' + (d ? " is-done" : "") + '">';
        html += "<h4>" + (d ? "✓ " : "") + les.title + " <small>(" + les.minutes + " min)</small></h4><ul>";
        (les.points || []).forEach(function (pt) {
          html += "<li>" + pt + "</li>";
        });
        html += "</ul>";
        if (les.ayah)
          html +=
            '<blockquote class="junior-ayah"><strong>' +
            les.ayah.ref +
            "</strong> — " +
            les.ayah.en +
            "</blockquote>";
        html += renderActivity(les);
        html += '<div class="junior-actions">';
        if (les.openCard)
          html +=
            '<button type="button" class="mv-chip" data-open-card="' +
            les.openCard +
            '">Open module</button>';
        (les.links || []).forEach(function (lk) {
          html +=
            '<a class="mv-chip" href="' +
            lk.href +
            '" target="_blank" rel="noopener noreferrer">' +
            lk.label +
            "</a>";
        });
        if (!d)
          html +=
            '<button type="button" class="mv-chip" data-mark="' +
            les.id +
            '">Mark done</button>';
        else html += '<span class="junior-done-label">Completed</span>';
        html += "</div></div>";
      });
      html += "</article>";
    });
    body.innerHTML = html;

    body.onclick = function (ev) {
      var t = ev.target;
      if (!t) return;
      if (t.getAttribute("data-open-card")) {
        openCard(t.getAttribute("data-open-card"));
        return;
      }
      if (t.getAttribute("data-mark")) {
        markDone(t.getAttribute("data-mark"));
        return;
      }
      if (t.getAttribute("data-save-port")) {
        var id = t.getAttribute("data-save-port");
        var ta = body.querySelector('textarea[data-port="' + id + '"]');
        if (ta) {
          portSet(id, ta.value);
          t.textContent = "Saved";
        }
        return;
      }
      if (t.getAttribute("data-quiz") != null) {
        var qi = +t.getAttribute("data-qi");
        var oi = +t.getAttribute("data-oi");
        var ans = +t.getAttribute("data-ans");
        var fb = body.querySelector('[data-fb="' + t.getAttribute("data-quiz") + "-" + qi + '"]');
        if (fb) fb.textContent = oi === ans ? " ✓" : " try again";
        return;
      }
    };
    body.onchange = function (ev) {
      var t = ev.target;
      if (t && t.getAttribute("data-check") != null) {
        var id = t.getAttribute("data-check");
        var i = +t.getAttribute("data-i");
        var saved = portGet()[id] || {};
        saved[i] = !!t.checked;
        portSet(id, saved);
      }
    };
  }

  function boot() {
    render();
    g.addEventListener("clarity-path-changed", render);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  g.ClarityDaiUniversity = { UNITS: UNITS, render: render };
})(typeof window !== "undefined" ? window : this);

/* mountBoost — pin curriculum card under path rail */
(function (g) {
    function mountBoost(){
    var card=document.getElementById("dai-university-card");
    if(!card)return;
    var pathI=0;
    try{
      pathI=parseInt((document.documentElement&&document.documentElement.getAttribute("data-path-i"))||"0",10)||0;
    }catch(e0){}
    try{
      card.setAttribute("data-min-i","3");
      card.setAttribute("data-clarity-path","dai");
      card.setAttribute("data-curriculum-phase","dai");
      card.setAttribute("data-curriculum-exclusive","1");
    }catch(e1){}
    /* Phase 2: exclusive — only the active learning path shows this curriculum */
    if(pathI!==3){
      try{
        card.classList.add("gate-hidden");
        card.setAttribute("data-gate-hidden","1");
        card.style.setProperty("display","none","important");
      }catch(e2){}
      return;
    }
    try{
      card.classList.remove("gate-hidden","hidden");
      card.removeAttribute("data-gate-hidden");
      card.hidden=false;
      card.style.removeProperty("display");
      card.style.visibility="visible";
    }catch(e3){}
    /* Phase 1+2: never reparent under #clarity-path-rail */
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(mountBoost, 200);
      setTimeout(mountBoost, 1000);
      setTimeout(mountBoost, 2500);
    });
  else {
    setTimeout(mountBoost, 200);
    setTimeout(mountBoost, 1000);
  }
  g.addEventListener("clarity-path-changed", function () {
    setTimeout(mountBoost, 80);
  });
})(typeof window !== "undefined" ? window : this);

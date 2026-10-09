/* Clarity Junior-High Curriculum (New Muslim) v1
 * Level: Junior high — practice foundations after Seeker junior
 * Patterns: Kuttab Level 1–2, Nawara weeks 2–3, NewMuslims.com, How-to-Muslim practical
 * Educational reflection only — not a fatwa service.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_JUNIOR_HIGH_CURRICULUM_V1__) return;
  g.__CLARITY_JUNIOR_HIGH_CURRICULUM_V1__ = true;

  var PROGRESS_KEY = "clarity_junior_high_progress_v1";

  var UNITS = [
    {
      id: "jh-u1-welcome",
      title: "Unit 1 — Welcome & confidence",
      goal: "Settle the heart after curiosity or Shahādah; know where to ask.",
      lessons: [
        {
          id: "jh-u1-l1",
          title: "You are not alone",
          minutes: 8,
          points: [
            "Learning is gradual — Allah does not burden a soul beyond its capacity.",
            "Mistakes in practice are part of growth; sincerity matters.",
            "Keep Junior units as your belief base; this track is about doing."
          ],
          ayah: { ref: "Qur'an 2:286", en: "Allah does not charge a soul except [with that within] its capacity." },
          openCard: "new-muslim-foundations-card",
          links: [
            { label: "Qur'an 2:286", href: "https://quran.com/2/286" },
            { label: "SeekersGuidance", href: "https://seekersguidance.org/" }
          ]
        },
        {
          id: "jh-u1-l2",
          title: "Shahādah living meaning",
          minutes: 10,
          points: [
            "Lā ilāha illā Allāh — no deity worthy of worship except Allah.",
            "Muḥammadun rasūl Allāh — Muhammad ﷺ is His messenger.",
            "It is a contract of loyalty and a door to mercy."
          ],
          openCard: "soul-compass-card",
          links: [{ label: "Qur'an 3:18", href: "https://quran.com/3/18" }]
        }
      ]
    },
    {
      id: "jh-u2-taharah",
      title: "Unit 2 — Purification (ṭahārah)",
      goal: "Know why purity matters and the main types (wuḍūʾ, ghusl overview).",
      lessons: [
        {
          id: "jh-u2-l1",
          title: "Cleanliness is half of faith",
          minutes: 10,
          points: [
            "Prayer needs purity of body and place.",
            "Wuḍūʾ: wash face, arms, wipe head, wash feet — learn steps with a teacher or reliable guide.",
            "Junior-high goal: understand the map; perfect form with practice."
          ],
          openCard: "salah-starter-card",
          links: [
            { label: "BeginIslam — Worship guide", href: "https://beginislam.org/" }
          ]
        },
        {
          id: "jh-u2-l2",
          title: "When to renew",
          minutes: 8,
          points: [
            "Wuḍūʾ breaks with certain events (e.g. using the toilet, deep sleep) — confirm details with a local teacher.",
            "Ghusl is required after major impurity — learn the obligation list carefully.",
            "When unsure, ask — do not guess on worship."
          ],
          openCard: "fiqh-quiz-card",
          links: []
        }
      ]
    },
    {
      id: "jh-u3-salah",
      title: "Unit 3 — Prayer (ṣalāh)",
      goal: "Build a working daily prayer habit with correct outline.",
      lessons: [
        {
          id: "jh-u3-l1",
          title: "Five prayers — the spine of the day",
          minutes: 12,
          points: [
            "Fajr, Ẓuhr, ʿAṣr, Maghrib, ʿIshāʾ structure the day.",
            "Open Salah Starter and follow one prayer slowly.",
            "Minimum: facing Qiblah, intention, Takbīr, Fātiḥah, rukūʿ, sujūd, salām — verify with a guide."
          ],
          openCard: "salah-starter-card",
          links: [
            { label: "Qur'an 4:103", href: "https://quran.com/4/103" }
          ]
        },
        {
          id: "jh-u3-l2",
          title: "What to recite first",
          minutes: 10,
          points: [
            "Al-Fātiḥah is required in every unit of prayer.",
            "Add short sūrahs as you learn (e.g. Al-Ikhlāṣ).",
            "Use Notes to write lines you are memorizing."
          ],
          openCard: "commands-card",
          links: [
            { label: "Qur'an 1 — Al-Fātiḥah", href: "https://quran.com/1" },
            { label: "Qur'an 112", href: "https://quran.com/112" }
          ]
        },
        {
          id: "jh-u3-l3",
          title: "Fiqh quiz — check yourself",
          minutes: 10,
          points: [
            "Take the Fiqh Quiz module to spot gaps.",
            "Wrong answers are teachers — review, then retest.",
            "Local mosque class beats internet alone for prayer form."
          ],
          openCard: "fiqh-quiz-card",
          links: []
        }
      ]
    },
    {
      id: "jh-u4-halal-day",
      title: "Unit 4 — Daily ḥalāl map",
      goal: "Food, speech, and earnings — simple boundaries.",
      lessons: [
        {
          id: "jh-u4-l1",
          title: "Eat of the good things",
          minutes: 8,
          points: [
            "Ḥalāl food and drink matter; avoid what is clearly forbidden (e.g. pork, alcohol).",
            "When labels are unclear, ask and choose the safer option.",
            "Gratitude before and after eating is Prophetic adab."
          ],
          openCard: "tibbe-nabwi-card",
          links: [{ label: "Qur'an 2:168", href: "https://quran.com/2/168" }]
        },
        {
          id: "jh-u4-l2",
          title: "Speech and screens",
          minutes: 8,
          points: [
            "Truthfulness and avoiding mockery protect the heart.",
            "Backbiting and gossip harm; silence can be worship.",
            "One honest conversation is better than an hour of empty scroll."
          ],
          openCard: "cw-card",
          links: []
        }
      ]
    },
    {
      id: "jh-u5-calendar",
      title: "Unit 5 — Ramadan, Zakāh, Ḥajj (overview)",
      goal: "Know the yearly pillars at junior-high depth.",
      lessons: [
        {
          id: "jh-u5-l1",
          title: "Fasting — why and how (overview)",
          minutes: 10,
          points: [
            "Ramadan trains taqwā and empathy.",
            "Who must fast and who is excused needs a teacher’s detail.",
            "Start by respecting the month and learning the timetable."
          ],
          openCard: "commands-card",
          links: [{ label: "Qur'an 2:183", href: "https://quran.com/2/183" }]
        },
        {
          id: "jh-u5-l2",
          title: "Zakāh & Ḥajj — maps for later",
          minutes: 8,
          points: [
            "Zakāh purifies wealth; thresholds and rates need calculation help.",
            "Ḥajj is once in a lifetime for those able — see Hajj Guide for the journey map.",
            "Junior-high: know they exist and why; details when you are ready."
          ],
          openCard: "hajj-guide-card",
          links: []
        }
      ]
    },
    {
      id: "jh-u6-seerah-practice",
      title: "Unit 6 — Seerah into practice",
      goal: "Connect the Prophet’s life ﷺ to daily choices.",
      lessons: [
        {
          id: "jh-u6-l1",
          title: "Mercy in action",
          minutes: 10,
          points: [
            "Read one Seerah Live segment slowly.",
            "Extract one behavior to try today (patience, honesty, kindness).",
            "Mark the lesson done only after the action."
          ],
          openCard: "seerah-live-card",
          links: [{ label: "Qur'an 33:21", href: "https://quran.com/33/21" }]
        },
        {
          id: "jh-u6-l2",
          title: "Promotion checkpoint",
          minutes: 5,
          points: [
            "If prayer outline is stable and Units 1–5 feel familiar, you are ready for Daily (high-school) track.",
            "Keep Notes of questions for a teacher.",
            "Junior high is practice; high school adds tajweed, tafseer, and depth."
          ],
          openCard: "ilm-pathway-card",
          links: []
        }
      ]
    }
  ];

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function saveProgress(p) {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
    } catch (e) {}
  }
  function markDone(lessonId) {
    var p = loadProgress();
    p[lessonId] = { done: true, at: Date.now() };
    saveProgress(p);
    render();
  }
  function isDone(lessonId) {
    var p = loadProgress();
    return !!(p[lessonId] && p[lessonId].done);
  }
  function totalLessons() {
    var n = 0;
    UNITS.forEach(function (u) {
      n += u.lessons.length;
    });
    return n;
  }
  function doneCount() {
    var n = 0;
    UNITS.forEach(function (u) {
      u.lessons.forEach(function (l) {
        if (isDone(l.id)) n++;
      });
    });
    return n;
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
    var card = document.getElementById("junior-high-curriculum-card") || document.getElementById("jh-curriculum-card");
    if (card) {
      try {
        card.id = "junior-high-curriculum-card";
        card.setAttribute("data-min-i", "1");
        card.setAttribute("data-clarity-path", "new-muslim");
        card.setAttribute("data-curriculum-phase", "new-muslim");
        card.setAttribute("data-rrra", "action");
        card.setAttribute("data-curriculum-exclusive", "1");
      } catch (e) {}
      return card;
    }
    card = document.createElement("section");
    card.id = "junior-high-curriculum-card";
    card.className = "card curriculum-phase-card";
    card.setAttribute("data-min-i", "1");
    card.setAttribute("data-clarity-path", "new-muslim");
    card.setAttribute("data-curriculum-phase", "new-muslim");
    card.setAttribute("data-rrra", "action");
    card.setAttribute("data-curriculum-exclusive", "1");
    card.innerHTML = '<h2 class="card-title">Junior-high curriculum — New Muslim</h2><p class="card-lead">Practice foundations after Seeker. Educational only.</p><div id="jh-curriculum-progress" class="junior-progress"></div><div id="jh-curriculum-body" class="junior-body"></div>';
    var tab = document.getElementById("tab-action");
    var anchors = ["hajj-guide-card", "fiqh-quiz-card", "hell-sins-card"];
    var placed = false;
    for (var i = 0; i < anchors.length; i++) {
      var a = document.getElementById(anchors[i]);
      if (a && a.parentNode) {
        try {
          if (a.nextSibling) a.parentNode.insertBefore(card, a.nextSibling);
          else a.parentNode.appendChild(card);
          placed = true;
          break;
        } catch (e2) {}
      }
    }
    if (!placed && tab) {
      try { tab.appendChild(card); placed = true; } catch (e3) {}
    }
    if (!placed) {
      try { (document.getElementById("main") || document.body).appendChild(card); } catch (e4) {}
    }
    return card;
  }

  function render() {
    ensureCard();
    var prog = document.getElementById("jh-curriculum-progress");
    var body = document.getElementById("jh-curriculum-body");
    if (!prog || !body) return;
    var d = doneCount();
    var t = totalLessons();
    var pct = t ? Math.round((100 * d) / t) : 0;
    prog.innerHTML =
      '<div class="junior-bar"><div class="junior-bar-fill" style="width:' +
      pct +
      '%"></div></div><span>' +
      d +
      " / " +
      t +
      " lessons · " +
      pct +
      "%</span>";

    var html = "";
    UNITS.forEach(function (unit) {
      html += '<article class="junior-unit">';
      html += "<h3>" + unit.title + "</h3>";
      html += '<p class="junior-goal">' + unit.goal + "</p>";
      unit.lessons.forEach(function (les) {
        var done = isDone(les.id);
        html += '<div class="junior-lesson' + (done ? " is-done" : "") + '">';
        html += "<h4>" + (done ? "✓ " : "") + les.title + " <small>(" + les.minutes + " min)</small></h4>";
        html += "<ul>";
        (les.points || []).forEach(function (pt) {
          html += "<li>" + pt + "</li>";
        });
        html += "</ul>";
        if (les.ayah) {
          html +=
            '<blockquote class="junior-ayah"><strong>' +
            les.ayah.ref +
            "</strong> — " +
            les.ayah.en +
            "</blockquote>";
        }
        html += '<div class="junior-actions">';
        if (les.openCard) {
          html +=
            '<button type="button" class="mv-chip" data-open-card="' +
            les.openCard +
            '">Open module</button>';
        }
        (les.links || []).forEach(function (lk) {
          html +=
            '<a class="mv-chip" href="' +
            lk.href +
            '" target="_blank" rel="noopener noreferrer">' +
            lk.label +
            "</a>";
        });
        if (!done) {
          html +=
            '<button type="button" class="mv-chip junior-done-btn" data-mark="' +
            les.id +
            '">Mark done</button>';
        } else {
          html += '<span class="junior-done-label">Completed</span>';
        }
        html += "</div></div>";
      });
      html += "</article>";
    });
    body.innerHTML = html;
    body.onclick = function (ev) {
      var t = ev.target;
      if (!t) return;
      var open = t.getAttribute("data-open-card");
      if (open) {
        openCard(open);
        return;
      }
      var mark = t.getAttribute("data-mark");
      if (mark) markDone(mark);
    };
  }

  function boot() {
    render();
    g.addEventListener("clarity-path-changed", render);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  g.ClarityJuniorHighCurriculum = { UNITS: UNITS, render: render, markDone: markDone };
})(typeof window !== "undefined" ? window : this);

/* mountBoost — pin curriculum card under path rail */
(function (g) {
    function mountBoost(){
    var card=document.getElementById("junior-high-curriculum-card");
    if(!card){
      try{ if(typeof ensureCard==="function")ensureCard(); else if(typeof ensure==="function")ensure(); }catch(eE){}
      card=document.getElementById("junior-high-curriculum-card");
    }
    if(!card)return;
    var pathI=0;
    try{
      var de=document.documentElement;
      var raw=(de&&de.getAttribute("data-path-i"))||"";
      pathI=parseInt(raw,10);
      if(isNaN(pathI)){
        var p="";
        try{p=localStorage.getItem("clarity_path_focus")||localStorage.getItem("clarity_committed_path")||localStorage.getItem("clarity_path_override")||"seeker";}catch(eL){p="seeker";}
        p=String(p).toLowerCase().replace(/_/g,"-");
        var map={seeker:0,"new-muslim":1,daily:2,practicing:2,dai:3};
        pathI=map[p]!=null?map[p]:0;
      }
    }catch(e0){pathI=0;}
    try{
      card.setAttribute("data-min-i","1");
      card.setAttribute("data-clarity-path","new-muslim");
      card.setAttribute("data-curriculum-phase","new-muslim");
      card.setAttribute("data-rrra","action");
      card.setAttribute("data-curriculum-exclusive","1");
    }catch(e1){}
    /* Phase 4: keep card inside its RRRA tab (not main/body orphan) */
    try{
      var tab=document.getElementById("tab-action");
      if(tab&&card.parentNode!==tab&&!tab.contains(card)){
        var hub=tab.querySelector(".rrra-hub-body, [id^=\"rrra-hub-body\"]")||tab;
        hub.appendChild(card);
      }
    }catch(eR){}
    if(pathI!==1){
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

  g.addEventListener("hashchange", function () { setTimeout(mountBoost, 60); });
  document.addEventListener("clarity-rrra-change", function () { setTimeout(mountBoost, 60); });
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") setTimeout(mountBoost, 80);
  });
})(typeof window !== "undefined" ? window : this);

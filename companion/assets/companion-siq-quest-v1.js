/*! companion-siq-quest-v1 · Q1–Q3 + Q3F state-safe 50/50 · educational only — not a fatwa */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_SIQ_QUEST_V1__) return;
  w.__CLARITY_SIQ_QUEST_V1__ = true;

  var LS_KEY = "clarity_siq_quest_v1";

  function todayKey() {
    var t = new Date();
    return t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate();
  }
  function loadBudget() {
    try {
      var o = JSON.parse(w.localStorage.getItem(LS_KEY) || "{}");
      if (o.day !== todayKey()) o = { day: todayKey(), hint: 0, half: 0 };
      return o;
    } catch (e) {
      return { day: todayKey(), hint: 0, half: 0 };
    }
  }
  function saveBudget(o) {
    try { w.localStorage.setItem(LS_KEY, JSON.stringify(o)); } catch (e) {}
  }
  function budgetLeft(kind) {
    var o = loadBudget();
    return Math.max(0, 3 - (kind === "hint" ? o.hint || 0 : o.half || 0));
  }
  function spend(kind) {
    var o = loadBudget();
    if (kind === "hint") o.hint = (o.hint || 0) + 1;
    else o.half = (o.half || 0) + 1;
    saveBudget(o);
  }

  function fqCorrectIdx() {
    try {
      var st = w.__CLARITY_FQ_STATE__;
      if (st && st.deck && typeof st.idx === "number" && st.deck[st.idx] && typeof st.deck[st.idx].a === "number")
        return st.deck[st.idx].a;
    } catch (e) {}
    return null;
  }
  function iqCorrectIdx() {
    try {
      var ses = w.__CLARITY_SIQ_SESSION__;
      if (ses && ses.list && typeof ses.idx === "number" && ses.list[ses.idx] && typeof ses.list[ses.idx].a === "number")
        return ses.list[ses.idx].a;
    } catch (e) {}
    return null;
  }

  function applyHalf(btns, correctIdx, teach) {
    if (correctIdx == null) {
      if (teach) {
        teach.style.display = "block";
        teach.innerHTML =
          '<span class="siq-quest-teach-label">50/50</span> Engine state not ready yet — use <strong>Hint</strong>, or hard-refresh after uploading the Q3F quiz scripts. Educational only — not a fatwa.';
      }
      return false;
    }
    var wrongs = btns.filter(function (b) {
      return parseInt(b.getAttribute("data-i"), 10) !== correctIdx;
    });
    wrongs
      .sort(function () {
        return Math.random() - 0.5;
      })
      .slice(0, 2)
      .forEach(function (b) {
        b.disabled = true;
        b.classList.add("siq-quest-elim");
        b.setAttribute("aria-hidden", "true");
      });
    return true;
  }

  function enhanceFqCard(stage) {
    var card = stage.querySelector(".fq-card");
    if (!card || card.getAttribute("data-quest") === "1") return;
    card.setAttribute("data-quest", "1");
    card.classList.add("siq-quest-card");
    var q = card.querySelector(".fq-q");
    if (q) q.classList.add("siq-quest-prompt");
    var choices = card.querySelector(".fq-choices");
    if (choices) choices.classList.add("siq-quest-choices");
    card.querySelectorAll(".fq-choice").forEach(function (b) {
      b.classList.add("siq-quest-choice");
    });
    var why = card.querySelector(".fq-why");
    if (why) {
      why.classList.add("siq-quest-teach");
      why.setAttribute("role", "status");
    }
    if (!card.querySelector(".siq-quest-rails")) {
      var rail = d.createElement("div");
      rail.className = "siq-quest-rails";
      rail.innerHTML =
        '<button type="button" class="btn-soft siq-quest-hint" data-quest-act="hint">💡 Hint (' +
        budgetLeft("hint") +
        ")</button>" +
        '<button type="button" class="btn-soft siq-quest-half" data-quest-act="half">½ 50/50 (' +
        budgetLeft("half") +
        ")</button>" +
        '<span class="siq-quest-note edu">Soft lifelines · local · educational — not a fatwa</span>';
      if (choices) card.insertBefore(rail, choices);
      else card.appendChild(rail);

      rail.querySelector('[data-quest-act="hint"]').addEventListener("click", function () {
        if (budgetLeft("hint") <= 0) return;
        spend("hint");
        this.textContent = "💡 Hint (" + budgetLeft("hint") + ")";
        if (why) {
          why.style.display = "block";
          why.innerHTML =
            '<span class="siq-quest-teach-label">Hint</span> Think of well-known pillars and authentic practice. Your judgment still matters — verify with Qur’an, Sunnah, and a local scholar.';
        }
      });
      rail.querySelector('[data-quest-act="half"]').addEventListener("click", function () {
        if (budgetLeft("half") <= 0) return;
        var btns = Array.prototype.slice.call(card.querySelectorAll(".fq-choice"));
        var ok = applyHalf(btns, fqCorrectIdx(), why);
        if (ok) {
          spend("half");
          this.textContent = "½ 50/50 (" + budgetLeft("half") + ")";
        }
      });
    }
    card.querySelectorAll(".fq-choice").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setTimeout(function () {
          var teach = card.querySelector(".fq-why");
          if (teach && teach.style.display !== "none" && teach.textContent) {
            if (teach.innerHTML.indexOf("siq-quest-teach-label") < 0) {
              teach.innerHTML =
                '<span class="siq-quest-teach-label">Teach-back</span> ' +
                teach.textContent +
                ' <span class="edu">Educational only — not a fatwa.</span>';
            }
            teach.classList.add("siq-quest-teach-open");
          }
        }, 30);
      });
    });
  }

  function enhanceIqCard(stage) {
    var card = stage.querySelector(".siq-iq-card");
    if (!card || card.getAttribute("data-quest") === "1") return;
    card.setAttribute("data-quest", "1");
    card.classList.add("siq-quest-card");
    var why = card.querySelector(".siq-iq-why");
    if (why) why.classList.add("siq-quest-teach");
    if (!card.querySelector(".siq-quest-rails")) {
      var choices = card.querySelector(".siq-iq-choices");
      var rail = d.createElement("div");
      rail.className = "siq-quest-rails";
      rail.innerHTML =
        '<button type="button" class="btn-soft" data-quest-act="hint">💡 Hint (' +
        budgetLeft("hint") +
        ")</button>" +
        '<button type="button" class="btn-soft" data-quest-act="half">½ 50/50 (' +
        budgetLeft("half") +
        ")</button>" +
        '<span class="siq-quest-note edu">Soft lifelines · educational — not a fatwa</span>';
      if (choices) card.insertBefore(rail, choices);
      else card.appendChild(rail);
      rail.querySelector('[data-quest-act="hint"]').addEventListener("click", function () {
        if (budgetLeft("hint") <= 0) return;
        spend("hint");
        this.textContent = "💡 Hint (" + budgetLeft("hint") + ")";
        if (why) {
          why.style.display = "block";
          why.innerHTML =
            '<span class="siq-quest-teach-label">Hint</span> Use the category tag and established teachings. Not a ruling — verify with a local scholar.';
        }
      });
      rail.querySelector('[data-quest-act="half"]').addEventListener("click", function () {
        if (budgetLeft("half") <= 0) return;
        var btns = Array.prototype.slice.call(card.querySelectorAll(".siq-iq-ch"));
        var ok = applyHalf(btns, iqCorrectIdx(), why);
        if (ok) {
          spend("half");
          this.textContent = "½ 50/50 (" + budgetLeft("half") + ")";
        }
      });
    }
    card.querySelectorAll(".siq-iq-ch").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setTimeout(function () {
          var teach = card.querySelector(".siq-iq-why");
          if (teach && teach.style.display !== "none" && teach.textContent) {
            if (teach.innerHTML.indexOf("siq-quest-teach-label") < 0) {
              teach.innerHTML =
                '<span class="siq-quest-teach-label">Teach-back</span> ' +
                teach.textContent +
                ' <span class="edu">Educational only — not a fatwa.</span>';
            }
            teach.classList.add("siq-quest-teach-open");
          }
        }, 30);
      });
    });
  }

  function scan() {
    var fq = d.getElementById("fq-stage");
    if (fq) enhanceFqCard(fq);
    var iq = d.getElementById("siq-iq-stage");
    if (iq) enhanceIqCard(iq);
  }

  function boot() {
    scan();
    try {
      new MutationObserver(scan).observe(d.documentElement, { childList: true, subtree: true });
    } catch (e) {}
    setTimeout(scan, 400);
    setTimeout(scan, 1200);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);

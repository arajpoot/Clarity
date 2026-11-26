/*! companion-siq-rank-v1 · Q4 fix · no observer loop · educational only — not a fatwa */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_SIQ_RANK_V1__) return;
  w.__CLARITY_SIQ_RANK_V1__ = true;

  var LS = "clarity_siq_rank_v1";
  var rendering = false;
  var RANKS = [
    { id: "seeker", title: "Seeker", min: 0, blurb: "Beginning the practice path" },
    { id: "student", title: "Student", min: 15, blurb: "Building daily consistency" },
    { id: "walker", title: "Walker", min: 40, blurb: "Steady steps in knowledge" },
    { id: "torch", title: "Torchbearer", min: 80, blurb: "Sharing light with care" },
    { id: "keeper", title: "Keeper", min: 140, blurb: "Guarding what you learn" }
  ];

  function load() {
    try {
      return JSON.parse(w.localStorage.getItem(LS) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function save(o) {
    try {
      w.localStorage.setItem(LS, JSON.stringify(o));
    } catch (e) {}
  }

  function scoreFromDom() {
    var pts = 0;
    try {
      var st = w.__CLARITY_FQ_STATE__;
      if (st) {
        pts += (st.correct || 0) * 2;
        pts += Math.min(30, Object.keys(st.seen || {}).length);
        pts += Math.min(20, st.best || 0);
      }
    } catch (e) {}
    try {
      pts += load().bonus || 0;
    } catch (e) {}
    return pts;
  }

  function rankFor(pts) {
    var r = RANKS[0];
    for (var i = 0; i < RANKS.length; i++) {
      if (pts >= RANKS[i].min) r = RANKS[i];
    }
    return r;
  }

  function ensureBadge() {
    var host = d.querySelector("#fq-stats") || d.querySelector(".siq-hero-text") || d.getElementById("fiqh-quiz-card");
    if (!host) return null;
    var el = d.getElementById("siq-rank-badge");
    if (!el) {
      el = d.createElement("div");
      el.id = "siq-rank-badge";
      el.className = "siq-rank-badge";
      el.setAttribute("role", "status");
      if (host.id === "fq-stats") host.appendChild(el);
      else host.appendChild(el);
    }
    return el;
  }

  function render() {
    if (rendering) return;
    rendering = true;
    try {
      var pts = scoreFromDom();
      var r = rankFor(pts);
      var el = ensureBadge();
      if (!el) return;
      var next = null;
      for (var i = 0; i < RANKS.length; i++) {
        if (RANKS[i].min > pts) {
          next = RANKS[i];
          break;
        }
      }
      var prog = next ? pts + " · next " + next.title + " at " + next.min : pts + " · path peak on this device";
      var html =
        '<span class="siq-rank-title">مسار · ' +
        r.title +
        '</span><span class="siq-rank-blurb">' +
        r.blurb +
        '</span><span class="siq-rank-prog">' +
        prog +
        '</span><span class="siq-rank-disc edu">Local practice path only — not a certificate · not a fatwa</span>';
      if (el.getAttribute("data-html") !== html) {
        el.setAttribute("data-html", html);
        el.innerHTML = html;
      }
      var o = load();
      o.pts = pts;
      o.rank = r.id;
      save(o);
    } finally {
      rendering = false;
    }
  }

  function bumpOnAnswer() {
    try {
      var o = load();
      o.bonus = (o.bonus || 0) + 1;
      save(o);
    } catch (e) {}
    render();
  }

  function boot() {
    render();
    d.addEventListener(
      "click",
      function (ev) {
        var t = ev.target;
        if (!t || !t.closest) return;
        if (t.closest(".fq-choice") || t.closest(".siq-iq-ch") || t.closest("[data-siq]") || t.closest(".siq-tab")) {
          setTimeout(render, 80);
        }
        if (t.closest(".fq-choice") || t.closest(".siq-iq-ch")) {
          setTimeout(bumpOnAnswer, 100);
        }
      },
      true
    );
    /* soft timers only — NO MutationObserver (avoids freeze loops) */
    setTimeout(render, 500);
    setTimeout(render, 2000);
    setTimeout(render, 5000);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);

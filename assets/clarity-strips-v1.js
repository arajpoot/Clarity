/**
 * Clarity Strips v1 — last-visited pills + path module pills
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_STRIPS_V1__) return;
  g.__CLARITY_STRIPS_V1__ = true;

  var VISIT_KEY = "clarity_last_visited_v1";
  var MAX_VISIT = 6;

  var LABELS = {
    "commands-card": "Commands",
    "samina-verse-card": "Sami'na",
    "samina-card": "Sami'na live",
    "soul-compass-card": "Soul compass",
    "hell-sins-card": "Hell & sins",
    "night-breath-card": "Night breath",
    "seerah-live-card": "Seerah",
    "seerah-mirror-card": "Seerah mirror",
    "grave-path-card": "Grave path",
    "ilm-pathway-card": "Ilm pathway",
    "meme-card": "Meme studio",
    "tajweed-live-card": "Tajweed",
    "tajweed-path-card": "Tajweed path",
    "tj-lmr-score-card": "LMR score",
    "tafseer-resources-card": "Tafseer",
    "najiha-tafseer-card": "Najiha",
    "deepen-study-card": "Deepen",
    "hajj-checklist-card": "Hajj list",
    "hajj-guide-card": "Hajj guide",
    "fiqh-quiz-card": "Fiqh quiz",
    "weekly-review-card": "Weekly review",
    "about-clarity-card": "About",
    "tibbe-nabwi-card": "Tibb Nabawi",
    "asma-names-lecture-card": "Asma",
    "callig-lab-card": "Calligraphy",
    "cw-card": "Character",
    "wasiyyah-card": "Wasiyyah",
    "faraid-card": "Faraid",
    "user-family-tree-card": "Family tree",
    "notes-shell": "Notes"
  };

  // Modules shown per educational path (Daily = practicing)
  var PATH_MODULES = {
    seeker: ["commands-card", "samina-verse-card", "soul-compass-card", "seerah-live-card", "grave-path-card", "about-clarity-card"],
    new_muslim: ["commands-card", "samina-verse-card", "ilm-pathway-card", "fiqh-quiz-card", "hajj-guide-card", "seerah-live-card"],
    practicing: ["commands-card", "samina-verse-card", "weekly-review-card", "tajweed-live-card", "meme-card", "deepen-study-card", "hajj-checklist-card", "tibbe-nabwi-card"],
    dai: ["commands-card", "meme-card", "deepen-study-card", "seerah-mirror-card", "asma-names-lecture-card", "callig-lab-card"]
  };

  function loadVisits() {
    try {
      return JSON.parse(localStorage.getItem(VISIT_KEY) || "[]") || [];
    } catch (e) {
      return [];
    }
  }

  function saveVisits(list) {
    try {
      localStorage.setItem(VISIT_KEY, JSON.stringify(list.slice(0, MAX_VISIT)));
    } catch (e) {}
  }

  function pushVisit(id) {
    if (!id || !LABELS[id] && !document.getElementById(id)) return;
    var list = loadVisits().filter(function (x) {
      return x !== id;
    });
    list.unshift(id);
    saveVisits(list);
    renderVisitBar();
  }

  function scrollToId(id) {
    var el = document.getElementById(id);
    if (!el) return;
    try {
      el.classList.remove("gate-hidden");
      el.hidden = false;
      el.style.removeProperty("display");
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {}
  }

  function renderVisitBar() {
    var bar = document.getElementById("clarity-visit-pill-bar");
    if (!bar) return;
    var list = loadVisits();
    // Keep label + hint, replace pills
    var keep = [];
    bar.querySelectorAll(".cv-label, .cv-hint").forEach(function (n) {
      keep.push(n);
    });
    bar.innerHTML = "";
    keep.forEach(function (n) {
      bar.appendChild(n);
    });
    if (!bar.querySelector(".cv-label")) {
      var lab = document.createElement("span");
      lab.className = "cv-label";
      lab.textContent = "Last";
      bar.appendChild(lab);
    }
    if (!list.length) {
      var hint = bar.querySelector(".cv-hint");
      if (!hint) {
        hint = document.createElement("span");
        hint.className = "cv-hint";
        bar.appendChild(hint);
      }
      hint.textContent = "Scroll a section to pin it";
      return;
    }
    var hint = bar.querySelector(".cv-hint");
    if (hint) hint.remove();
    list.forEach(function (id) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cv-pill";
      btn.textContent = LABELS[id] || id.replace(/-card$/, "").replace(/-/g, " ");
      btn.title = "Open " + btn.textContent;
      btn.addEventListener("click", function () {
        scrollToId(id);
      });
      bar.appendChild(btn);
    });
  }

  function currentPath() {
    try {
      var p =
        document.documentElement.getAttribute("data-clarity-path") ||
        localStorage.getItem("clarity_path_focus") ||
        localStorage.getItem("clarity_committed_path") ||
        "practicing";
      if (p === "daily" || p === "daily_muslim") p = "practicing";
      return p;
    } catch (e) {
      return "practicing";
    }
  }

  function ensurePathStrip() {
    var bar = document.getElementById("clarity-path-module-strip");
    if (bar) return bar;
    bar = document.createElement("div");
    bar.id = "clarity-path-module-strip";
    bar.className = "clarity-path-module-strip";
    bar.setAttribute("role", "navigation");
    bar.setAttribute("aria-label", "Modules for current path");
    var visit = document.getElementById("clarity-visit-pill-bar");
    if (visit && visit.parentNode) {
      if (visit.nextSibling) visit.parentNode.insertBefore(bar, visit.nextSibling);
      else visit.parentNode.appendChild(bar);
    } else {
      var duo = document.getElementById("clarity-top-duo");
      if (duo && duo.parentNode) {
        if (duo.nextSibling) duo.parentNode.insertBefore(bar, duo.nextSibling);
        else duo.parentNode.appendChild(bar);
      }
    }
    return bar;
  }

  function renderPathStrip() {
    var bar = ensurePathStrip();
    var path = currentPath();
    var mods = PATH_MODULES[path] || PATH_MODULES.practicing;
    bar.innerHTML = "";
    var lab = document.createElement("span");
    lab.className = "pm-label";
    lab.textContent =
      path === "practicing" ? "Daily" : path === "new_muslim" ? "New Muslim" : path === "dai" ? "Da'i" : "Seeker";
    bar.appendChild(lab);
    mods.forEach(function (id) {
      var el = document.getElementById(id);
      // Dynamic: only show if module exists in DOM (opened path content)
      if (!el) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pm-pill";
      btn.textContent = LABELS[id] || id.replace(/-card$/, "");
      btn.title = btn.textContent;
      btn.addEventListener("click", function () {
        scrollToId(id);
        pushVisit(id);
      });
      bar.appendChild(btn);
    });
    if (bar.querySelectorAll(".pm-pill").length === 0) {
      var empty = document.createElement("span");
      empty.className = "pm-hint";
      empty.textContent = "Open a module on this path";
      bar.appendChild(empty);
    }
  }

  function observeCards() {
    var cards = document.querySelectorAll(
      ".card[id$='-card'], #notes-shell, [id$='-card']"
    );
    if (!("IntersectionObserver" in g)) {
      cards.forEach(function (card) {
        card.addEventListener(
          "click",
          function () {
            pushVisit(card.id);
          },
          { passive: true }
        );
      });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && en.intersectionRatio >= 0.35) {
            var id = en.target.id;
            if (id) pushVisit(id);
          }
        });
      },
      { threshold: [0.35], rootMargin: "-10% 0px -40% 0px" }
    );
    cards.forEach(function (c) {
      if (c.id) io.observe(c);
    });
  }

  function boot() {
    renderVisitBar();
    renderPathStrip();
    observeCards();
    setTimeout(function () {
      renderPathStrip();
      observeCards();
    }, 800);
    setTimeout(renderPathStrip, 2000);
    g.addEventListener("clarity-path-changed", renderPathStrip);
    // Watch path attribute
    try {
      var mo = new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          if (m.attributeName === "data-clarity-path") renderPathStrip();
        });
      });
      mo.observe(document.documentElement, { attributes: true });
    } catch (e) {}
    // After layout measure
    if (g.ClarityLayoutFix && g.ClarityLayoutFix.measure)
      setTimeout(g.ClarityLayoutFix.measure, 300);
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();

  g.ClarityStrips = {
    pushVisit: pushVisit,
    renderVisitBar: renderVisitBar,
    renderPathStrip: renderPathStrip
  };
})(typeof window !== "undefined" ? window : this);

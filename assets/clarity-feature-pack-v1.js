/** Clarity Feature Pack v1 — polished production merge 20261008POLISH */

/* ---- clarity-layout-fix-v10 ---- */
(function (w) {
  "use strict";
  if (w.__CLARITY_LAYOUT_FIX_V10__) return;
  w.__CLARITY_LAYOUT_FIX_V10__ = true;
  function shouldPin() {
    try {
      return Math.min(w.innerWidth || 0, document.documentElement.clientWidth || 0) >= 1024;
    } catch (e) {
      return false;
    }
  }
  function apply() {
    try {
      var pin = shouldPin();
      var root = document.documentElement;
      root.classList.toggle("clarity-desktop", pin);
      root.classList.toggle("clarity-mobile", !pin);
      var duo = document.getElementById("clarity-top-duo");
      if (duo) {
        if (pin) {
          duo.style.position = "sticky";
          duo.style.top = "0";
          duo.style.zIndex = "46";
        } else {
          duo.style.position = "relative";
          duo.style.top = "";
        }
      }
    } catch (e) {}
  }
  var t = null;
  function schedule() {
    if (t) return;
    t = setTimeout(function () {
      t = null;
      requestAnimationFrame(apply);
    }, 100);
  }
  w.addEventListener("resize", schedule, { passive: true });
  w.addEventListener("orientationchange", function () {
    setTimeout(apply, 120);
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
})(typeof window !== "undefined" ? window : this);

/* ---- clarity-path-rail-v2 ---- */
(function (g) {
  "use strict";
  if (g.__CLARITY_PATH_RAIL_V2__) return;
  g.__CLARITY_PATH_RAIL_V2__ = true;
  var PATH_KEY = "clarity_path_focus";
  var PATHS = [
    { id: "seeker", label: "1 Seeker" },
    { id: "new_muslim", label: "2 New Muslim" },
    { id: "practicing", label: "3 Daily" },
    { id: "dai", label: "4 Da'i" }
  ];
  var MODULES = {
    seeker: [
      { id: "junior-curriculum-card", label: "Junior path" },
      { id: "commands-card", label: "Commands" },
      { id: "soul-compass-card", label: "Soul compass" },
      { id: "seerah-live-card", label: "Seerah" },
      { id: "samina-verse-card", label: "Sami'na" },
      { id: "grave-path-card", label: "Grave path" },
      { id: "about-clarity-card", label: "About" }
    ],
    new_muslim: [
      { id: "junior-high-curriculum-card", label: "Junior high" },
      { id: "salah-starter-card", label: "Salah" },
      { id: "fiqh-quiz-card", label: "Fiqh quiz" },
      { id: "commands-card", label: "Commands" },
      { id: "hajj-guide-card", label: "Hajj guide" },
      { id: "seerah-live-card", label: "Seerah" },
      { id: "notes-shell", label: "Notes" }
    ],
    practicing: [
      { id: "daily-hs-curriculum-card", label: "High school" },
      { id: "tj-lmr", label: "Tajweed" },
      { id: "weekly-review-card", label: "Weekly review" },
      { id: "deepen-study-card", label: "Deepen" },
      { id: "meme-card", label: "Meme" },
      { id: "callig-lab-card", label: "Calligraphy" },
      { id: "notes-shell", label: "Notes" }
    ],
    dai: [
      { id: "dai-university-curriculum-card", label: "Da'i uni" },
      { id: "dai-transmit-card", label: "Transmit" },
      { id: "israeliyat-card", label: "Israeliyat" },
      { id: "meme-card", label: "Meme" },
      { id: "seerah-mirror-card", label: "Seerah mirror" },
      { id: "asma-names-lecture-card", label: "Asma" },
      { id: "notes-shell", label: "Notes" }
    ]
  };
  function currentPath() {
    try {
      var p =
        document.documentElement.getAttribute("data-clarity-path") ||
        localStorage.getItem(PATH_KEY) ||
        "seeker";
      if (p === "daily" || p === "daily_muslim") p = "practicing";
      if (p === "new-muslim") p = "new_muslim";
      if (!MODULES[p]) p = "seeker";
      return p;
    } catch (e) {
      return "seeker";
    }
  }
  function setPath(id) {
    if (!MODULES[id]) return;
    try {
      localStorage.setItem(PATH_KEY, id);
      document.documentElement.setAttribute("data-clarity-path", id);
      g.dispatchEvent(new CustomEvent("clarity-path-changed", { detail: { path: id } }));
    } catch (e) {}
    renderRail();
  }
  function openModule(id) {
    var map = { tajweed: ["tj-lmr", "tajweed-live-card"], notes: ["notes-shell"], meme: ["meme-card"] };
    var ids = map[id] || [id];
    var el = null;
    for (var i = 0; i < ids.length; i++) {
      el = document.getElementById(ids[i]);
      if (el) break;
    }
    if (!el) return;
    try {
      el.classList.remove("gate-hidden", "hidden");
      el.hidden = false;
      el.style.removeProperty("display");
    } catch (e) {}
    try {
      if (/tj|tajweed/i.test(el.id) && g.ClarityLazy && g.ClarityLazy.tjLmr) g.ClarityLazy.tjLmr();
      if (/notes/i.test(el.id) && g.ClarityLazy && g.ClarityLazy.notes) g.ClarityLazy.notes();
    } catch (e2) {}
    try {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e3) {}
  }
  function ensureRail() {
    var rail = document.getElementById("clarity-path-rail");
    if (rail) return rail;
    ["clarity-visit-pill-bar", "clarity-path-module-strip", "clarity-daily-tools-strip"].forEach(function (id) {
      var n = document.getElementById(id);
      if (n && n.parentNode) n.parentNode.removeChild(n);
    });
    document.querySelectorAll(".clarity-visit-strip, .clarity-daily-tools-strip").forEach(function (n) {
      try {
        n.remove();
      } catch (e) {}
    });
    rail = document.createElement("div");
    rail.id = "clarity-path-rail";
    rail.className = "clarity-path-rail";
    rail.setAttribute("role", "navigation");
    var duo = document.getElementById("clarity-top-duo");
    if (duo && duo.parentNode) {
      if (duo.nextSibling) duo.parentNode.insertBefore(rail, duo.nextSibling);
      else duo.parentNode.appendChild(rail);
    } else document.body.insertBefore(rail, document.body.firstChild);
    return rail;
  }
  function renderRail() {
    var rail = ensureRail();
    var path = currentPath();
    var html = '<div class="cpr-paths">';
    PATHS.forEach(function (p) {
      html +=
        '<button type="button" class="cpr-path' +
        (p.id === path ? " is-on" : "") +
        '" data-path="' +
        p.id +
        '">' +
        p.label +
        "</button>";
    });
    html += '</div><div class="cpr-modules">';
    (MODULES[path] || []).forEach(function (m) {
      html += '<button type="button" class="cpr-mod" data-mod="' + m.id + '">' + m.label + "</button>";
    });
    html += "</div>";
    rail.innerHTML = html;
  }
  function boot() {
    renderRail();
    document.addEventListener(
      "click",
      function (ev) {
        var t = ev.target.closest("[data-path]");
        if (t) {
          try {
            ev.preventDefault();
          } catch (e) {}
          setPath(t.getAttribute("data-path"));
          return;
        }
        t = ev.target.closest("[data-mod]");
        if (t) {
          try {
            ev.preventDefault();
          } catch (e) {}
          openModule(t.getAttribute("data-mod"));
        }
      },
      true
    );
    g.addEventListener("clarity-path-changed", renderRail);
    setTimeout(renderRail, 500);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);

/* ---- sticky action pills (no flash) ---- */
(function (g) {
  "use strict";
  if (g.__CLARITY_ACTION_PILLS_STICKY_V2__) return;
  g.__CLARITY_ACTION_PILLS_STICKY_V2__ = true;
  var ESSENTIAL = {
    "commands-card": 1,
    "samina-verse-card": 1,
    "samina-card": 1,
    "grave-path-card": 1,
    "seerah-live-card": 1,
    "seerah-mirror-card": 1,
    "soul-compass-card": 1,
    "deepen-study-card": 1,
    "tafseer-resources-card": 1,
    "cw-card": 1,
    "hell-sins-card": 1,
    "night-breath-card": 1
  };
  function ok(card) {
    if (!card || !card.id) return false;
    if (card.closest("#clarity-top-duo,#clarity-path-rail,#meme-card,#notes-shell")) return false;
    return !!(ESSENTIAL[card.id] || card.getAttribute("data-clarity-meme-ok") === "1");
  }
  function stick(card) {
    if (!ok(card) || card.getAttribute("data-clarity-pills-stuck") === "1") return;
    if (card.querySelector(".clarity-to-meme-pill") && card.querySelector(".clarity-to-notes-pill")) {
      card.setAttribute("data-clarity-pills-stuck", "1");
      return;
    }
    var row = card.querySelector(".clarity-action-row");
    if (!row) {
      row = document.createElement("div");
      row.className = "clarity-action-row";
      card.appendChild(row);
    }
    if (!card.querySelector(".clarity-to-meme-pill")) {
      var m = document.createElement("button");
      m.type = "button";
      m.className = "clarity-to-meme-pill clarity-action-chip";
      m.textContent = "Meme";
      m.addEventListener("click", function (ev) {
        try {
          ev.preventDefault();
          ev.stopPropagation();
        } catch (e) {}
        if (typeof g.clarityMemePushFromCard === "function") g.clarityMemePushFromCard(card, "stock");
      });
      row.appendChild(m);
    }
    if (!card.querySelector(".clarity-to-notes-pill")) {
      var n = document.createElement("button");
      n.type = "button";
      n.className = "clarity-to-notes-pill clarity-action-chip";
      n.textContent = "Notes";
      n.addEventListener("click", function (ev) {
        try {
          ev.preventDefault();
          ev.stopPropagation();
        } catch (e) {}
        try {
          var ar = ((card.querySelector(".verse-ar,.arabic,[lang='ar'],#cmd-ar-text") || {}).textContent || "").trim();
          var en = ((card.querySelector(".verse-en,.translation,#cmd-en-text") || {}).textContent || "").trim();
          var ref = ((card.querySelector(".ref,.verse-ref") || {}).textContent || "").trim();
          function go() {
            if (typeof g.notesCreate === "function")
              g.notesCreate({ title: (ref || card.id || "Note").slice(0, 72), tag: "Qur'an", body: (ar + "\n\n" + en).trim() });
          }
          if (typeof g.notesCreate === "function") go();
          else if (g.ClarityLazy && g.ClarityLazy.notes) g.ClarityLazy.notes().then(go);
        } catch (e2) {}
      });
      row.appendChild(n);
    }
    card.setAttribute("data-clarity-pills-stuck", "1");
  }
  function pass() {
    document.querySelectorAll("[id$='-card']").forEach(stick);
  }
  function boot() {
    pass();
    setTimeout(pass, 700);
    setTimeout(pass, 2000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);

/* ---- tj whisper restore ---- */
(function (g) {
  "use strict";
  if (g.__CLARITY_TJ_WHISPER_RESTORE_V2__) return;
  g.__CLARITY_TJ_WHISPER_RESTORE_V2__ = true;
  function loadTj() {
    if (g.__tjLmrLoaded) return Promise.resolve(true);
    if (g.ClarityLazy && typeof g.ClarityLazy.tjLmr === "function")
      return g.ClarityLazy.tjLmr().then(function () {
        g.__tjLmrLoaded = true;
        return true;
      });
    return new Promise(function (res) {
      if (document.querySelector('script[data-clarity-lazy="tj-lmr"]')) {
        g.__tjLmrLoaded = true;
        res(true);
        return;
      }
      var s = document.createElement("script");
      s.src = "./assets/nx-tj-lmr-js-v1.js?v=20261008POLISH";
      s.defer = true;
      s.dataset.clarityLazy = "tj-lmr";
      s.onload = function () {
        g.__tjLmrLoaded = true;
        res(true);
      };
      s.onerror = function () {
        res(false);
      };
      (document.body || document.documentElement).appendChild(s);
    });
  }
  document.addEventListener(
    "click",
    function (ev) {
      try {
        var t = ev.target.closest("#tj-lmr,#tajweed-live-card,[data-rail-tab='tajweed'],#tj-deep-studio");
        if (t) loadTj();
      } catch (e) {}
    },
    true
  );
  g.addEventListener("load", function () {
    setTimeout(function () {
      if (document.getElementById("tj-lmr")) loadTj();
    }, 1500);
  });
})(typeof window !== "undefined" ? window : this);

/* ---- meme enhance compact ---- */
(function (g) {
  "use strict";
  if (g.__CLARITY_MEME_ENHANCE_V4__) return;
  g.__CLARITY_MEME_ENHANCE_V4__ = true;
  function extract(card) {
    if (!card) return { ar: "", en: "", ref: "" };
    var ar = "",
      en = "",
      ref = "";
    try {
      if (g.currentCommandVerse) {
        ar = g.currentCommandVerse.arabic || "";
        en = g.currentCommandVerse.english || "";
        ref = g.currentCommandVerse.ref || "";
      }
    } catch (e) {}
    if (!ar) ar = ((card.querySelector("#cmd-ar-text,.verse-ar,.arabic,[lang='ar']") || {}).textContent || "").trim();
    if (!en) en = ((card.querySelector("#cmd-en-text,.verse-en,.translation") || {}).textContent || "").trim();
    if (!ref) ref = ((card.querySelector(".ref,.verse-ref") || {}).textContent || "").trim();
    return { ar: ar, en: en, ref: ref };
  }
  function applyText(p) {
    try {
      if (!g.memeState) g.memeState = {};
      g.memeState.top = p.ar || "";
      g.memeState.mid = p.en || "";
      g.memeState.bottom = "";
      g.memeState.ref = p.ref || "";
      var i = document.getElementById("meme-top-input"),
        o = document.getElementById("meme-mid-input");
      if (i) i.value = p.ar || "";
      if (o) o.value = p.en || "";
      if (typeof g.memeDraw === "function") g.memeDraw();
    } catch (e) {}
  }
  function loadBg(urls, i) {
    i = i || 0;
    if (!urls || i >= urls.length) return;
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      try {
        if (g.memeState) {
          g.memeState.bgImage = img;
          g.memeState.bg = "image";
        }
        if (typeof g.memeDraw === "function") g.memeDraw();
      } catch (e) {}
    };
    img.onerror = function () {
      loadBg(urls, i + 1);
    };
    img.src = urls[i];
  }
  g.clarityMemePushFromCard = function (card, mode) {
    var p = extract(card);
    if (!p.ar && !p.en) return;
    applyText(p);
    var seed = (Date.now() % 9000) + 1;
    loadBg(
      [
        "https://picsum.photos/seed/n" + seed + "/1920/1080",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
      ],
      0
    );
    try {
      if (typeof g.switchTab === "function") g.switchTab("reminder");
    } catch (e) {}
    setTimeout(function () {
      var c = document.getElementById("meme-card");
      if (c) {
        c.classList.remove("gate-hidden");
        c.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      applyText(p);
    }, 200);
  };
  g.memeFetchBg = function (kind) {
    var seed = (Date.now() % 9000) + 1;
    var urls =
      kind === "galaxy" || kind === "night"
        ? ["https://picsum.photos/seed/g" + seed + "/1920/1080"]
        : ["https://picsum.photos/seed/n" + seed + "/1920/1080"];
    loadBg(urls, 0);
  };
})(typeof window !== "undefined" ? window : this);

/*! cu-vle-guide-pill-v1 · U63 — Study with guide pill + modal (answer engine) */
(function (w, d) {
  "use strict";
  if (w.__CU_VLE_GUIDE_PILL_V1__) return;
  w.__CU_VLE_GUIDE_PILL_V1__ = true;

  function path() {
    return (location.pathname || "").replace(/\/+$/, "") || "";
  }
  function onCampus() {
    return path().indexOf("/campus") === 0;
  }
  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function ensureCss() {
    if (d.querySelector('link[data-cu-guide-pill]')) return;
    var l = d.createElement("link");
    l.rel = "stylesheet";
    l.href = "/campus/assets/css/cu-vle-guide-pill-v1.css?v=20261121U63";
    l.setAttribute("data-cu-guide-pill", "1");
    d.head.appendChild(l);
  }
  function ensureEngine(cb) {
    if (w.ClarityAnswerEngine && w.ClarityAnswerEngine.version) return cb();
    var s = d.createElement("script");
    s.src = "/campus/assets/js/cu-vle-answer-engine-v1.js?v=20261121U63";
    s.onload = cb;
    s.onerror = cb;
    d.head.appendChild(s);
  }
  function render(out, q) {
    var a =
      w.ClarityAnswerEngine && w.ClarityAnswerEngine.answer
        ? w.ClarityAnswerEngine.answer(q)
        : {
            short: "Engine loading…",
            links: [{ label: "Qurʾān.com", href: "https://quran.com" }]
          };
    var html = "<p>" + esc(a.short) + "</p>";
    if (a.hadith) html += '<p style="font-size:.84rem;opacity:.95;margin:.45rem 0"><strong>Hadith · citation</strong><br/>' + esc(a.hadith) + "</p>";
    html += "<p>";
    (a.links || []).forEach(function (L) {
      html += '<a href="' + esc(L.href) + '" target="_blank" rel="noopener">' + esc(L.label) + "</a>";
    });
    html += "</p>";
    html += '<p class="cu-gmod-stamp">Citations are study aids — confirm wording and grading in primary sources with a teacher.</p>';
    out.innerHTML = html;
  }
  function openModal() {
    var m = d.getElementById("cu-guide-modal");
    if (m) {
      m.hidden = false;
      return;
    }
    m = d.createElement("div");
    m.id = "cu-guide-modal";
    m.setAttribute("role", "dialog");
    m.innerHTML =
      '<div class="cu-gmod-card">' +
      '<button type="button" class="cu-gmod-x" data-close="1" aria-label="Close">×</button>' +
      "<h2>Study with guide</h2>" +
      "<p style=\"font-size:.82rem;opacity:.9\">On-device educational persona · short briefs · full links outward</p>" +
      '<div class="cu-gmod-chips">' +
      '<button type="button" data-q="iman">Īmān</button>' +
      '<button type="button" data-q="tawhid">Tawḥīd</button>' +
      '<button type="button" data-q="prayer">Prayer</button>' +
      '<button type="button" data-q="zakat">Zakāh</button>' +
      '<button type="button" data-q="fasting">Fasting</button>' +
      '<button type="button" data-q="wasiyyah">Wasiyyah</button>' +
      "</div>" +
      '<input type="search" id="cu-gmod-q" placeholder="Keyword: wudu · nikah · riba · adab…" />' +
      '<button type="button" class="cu-gmod-go" id="cu-gmod-go">Ask</button>' +
      '<div class="cu-gmod-out" id="cu-gmod-out"></div>' +
      '<p class="cu-gmod-stamp">Not a fatwa · not a living scholar · not legal advice · verify with a local teacher</p>' +
      "</div>";
    d.body.appendChild(m);
    m.addEventListener("click", function (e) {
      if (e.target === m || e.target.getAttribute("data-close")) m.hidden = true;
      var chip = e.target.closest("[data-q]");
      if (chip) {
        d.getElementById("cu-gmod-q").value = chip.getAttribute("data-q");
        render(d.getElementById("cu-gmod-out"), chip.getAttribute("data-q"));
      }
    });
    d.getElementById("cu-gmod-go").onclick = function () {
      render(d.getElementById("cu-gmod-out"), d.getElementById("cu-gmod-q").value);
    };
    d.getElementById("cu-gmod-q").addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        render(d.getElementById("cu-gmod-out"), e.target.value);
      }
    });
  }
  function mount() {
    if (!onCampus() || d.getElementById("cu-guide-pill")) return;
    ensureCss();
    d.documentElement.setAttribute("data-guide-pill", "1");
    // remove old advisor fab if present
    var old = d.getElementById("cu-tutor-fab");
    if (old) old.remove();
    var btn = d.createElement("button");
    btn.id = "cu-guide-pill";
    btn.type = "button";
    btn.textContent = "Study with guide";
    btn.addEventListener("click", function () {
      ensureEngine(function () {
        openModal();
      });
    });
    d.body.appendChild(btn);
  }
  function boot() {
    try {
      mount();
    } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 400);
  setTimeout(boot, 1200);
})(window, document);

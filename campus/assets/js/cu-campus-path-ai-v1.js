/*! cu-campus-path-ai-v1 · U55 · Nur Path Engine
 * On-device learning router: maps phase + intent → Craft benches + Campus desks.
 * NOT a cloud LLM · NOT a fatwa engine · NOT a grade of īmān
 * Injected into Campus foundation surfaces for virtual learning.
 */
(function (w, d) {
  "use strict";
  if (w.__CU_CAMPUS_PATH_AI_V1__) return;
  w.__CU_CAMPUS_PATH_AI_V1__ = true;

  var MAP_URL = "/campus/assets/data/cu-path-ai-map-v1.json?v=20261121U55";
  var mapCache = null;

  function path() {
    return (location.pathname || "").replace(/\/+$/, "") || "";
  }
  function onCampusFoundation() {
    var p = path();
    return p === "/campus" || p.indexOf("/campus/desk") === 0 || p === "/campus/bots";
  }

  function phase() {
    try {
      return parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1;
    } catch (e) {
      return 1;
    }
  }
  function juniorDone() {
    try {
      var o = JSON.parse(localStorage.getItem("clarity_junior_progress_v1") || "{}");
      var n = 0;
      Object.keys(o || {}).forEach(function (k) {
        if (o[k]) n++;
      });
      return n;
    } catch (e) {
      return 0;
    }
  }

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function ensureCss() {
    if (d.querySelector('link[data-cu-path-ai]')) return;
    var l = d.createElement("link");
    l.rel = "stylesheet";
    l.href = "/campus/assets/css/cu-campus-path-ai-v1.css?v=20261121U55";
    l.setAttribute("data-cu-path-ai", "1");
    d.head.appendChild(l);
  }

  function loadMap(cb) {
    if (mapCache) return cb(mapCache);
    fetch(MAP_URL, { cache: "no-cache" })
      .then(function (r) {
        return r.json();
      })
      .then(function (j) {
        mapCache = j;
        cb(j);
      })
      .catch(function () {
        mapCache = {
          phases: {
            "1": {
              label: "Seeker",
              desk: "/campus/desk/seeker/",
              benches: [
                { href: "/craft/notes/", title: "Notes", why: "Capture one line" },
                { href: "/craft/quiz/", title: "Quiz", why: "Soft recall" }
              ]
            }
          },
          topics: {},
          topicBenches: {}
        };
        cb(mapCache);
      });
  }

  function routeIntent(map, q) {
    var low = String(q || "").toLowerCase();
    var topics = map.topics || {};
    for (var id in topics) {
      var keys = topics[id] || [];
      for (var i = 0; i < keys.length; i++) {
        if (low.indexOf(keys[i]) >= 0) {
          var b = (map.topicBenches || {})[id];
          if (b) return { type: "topic", id: id, bench: b };
        }
      }
    }
    return null;
  }

  function render(map, root) {
    var ph = String(Math.min(4, Math.max(1, phase())));
    var unit = (map.phases && map.phases[ph]) || map.phases["1"];
    var done = juniorDone();
    var host = root.querySelector(".pai-benches");
    var meta = root.querySelector(".pai-meta");
    if (meta) {
      meta.textContent =
        "Phase " + ph + " · " + (unit.label || "") + " · Junior " + done + "/12 on this device";
    }
    if (!host) return;
    var html = "";
    html +=
      '<a class="pai-bench" href="' +
      esc(unit.desk || "/campus/desk/") +
      '"><strong>Primary desk · ' +
      esc(unit.label || "Desk") +
      "</strong><span>" +
      esc(unit.intent || "Continue your ordered path") +
      "</span></a>";
    (unit.benches || []).forEach(function (b) {
      html +=
        '<a class="pai-bench" href="' +
        esc(b.href) +
        '"><strong>Craft · ' +
        esc(b.title) +
        "</strong><span>" +
        esc(b.why) +
        "</span></a>";
    });
    host.innerHTML = html;
  }

  function mount(map) {
    if (!onCampusFoundation() || d.getElementById("cu-campus-path-ai")) return;
    ensureCss();
    var sec = d.createElement("section");
    sec.id = "cu-campus-path-ai";
    sec.className = "cu-path-ai";
    sec.setAttribute("data-clarity-owned", "path-ai-v1");
    sec.innerHTML =
      '<div class="pai-card">' +
      '<p class="pai-kicker">Nur Path Engine · on-device</p>' +
      "<h2>Path intelligence · Craft benches</h2>" +
      '<p class="pai-lead">Routes your <strong>learning unit</strong> to Campus desks and Craft room benches. Rule-based · this browser only — not a cloud AI fatwa bot.</p>' +
      '<p class="pai-meta"></p>' +
      '<div class="pai-benches"></div>' +
      '<form class="pai-row" id="pai-form">' +
      '<input type="search" id="pai-q" placeholder="Route me: tajweed · notes · wasiyyah · quiz" />' +
      '<button type="submit" class="pai-go">Route</button>' +
      "</form>" +
      '<div class="pai-benches" id="pai-route-out"></div>' +
      '<p class="pai-stamp">Educational router only — not a fatwa · not a grade of īmān · teachers of flesh and blood remain the guide.</p>' +
      "</div>";
    var main = d.querySelector("main") || d.body;
    var after =
      d.getElementById("cu-vle-hud") ||
      d.getElementById("cu-gate-block") ||
      d.getElementById("cu-path-conductor") ||
      main.querySelector("header.cu-hero");
    if (after && after.parentNode) after.parentNode.insertBefore(sec, after.nextSibling);
    else main.insertBefore(sec, main.firstChild);

    render(map, sec);

    var form = d.getElementById("pai-form");
    var input = d.getElementById("pai-q");
    var out = d.getElementById("pai-route-out");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = input.value;
      var hit = routeIntent(map, q);
      if (hit && hit.bench) {
        out.innerHTML =
          '<a class="pai-bench" href="' +
          esc(hit.bench.href) +
          '"><strong>Routed · ' +
          esc(hit.bench.title) +
          "</strong><span>Matched intent “" +
          esc(hit.id) +
          "”. Educational link only.</span></a>";
      } else {
        out.innerHTML =
          '<p class="pai-stamp">No specialty match — use phase benches above, or open <a href="/craft/">Craft room</a>.</p>';
        render(map, sec);
      }
    });
  }

  function boot() {
    if (!onCampusFoundation()) return;
    loadMap(function (map) {
      try {
        mount(map);
      } catch (e) {}
    });
  }

  // Public tiny API for other Campus modules
  w.ClarityPathAI = {
    version: "U55",
    phase: phase,
    route: function (q, cb) {
      loadMap(function (map) {
        cb(routeIntent(map, q), map);
      });
    }
  };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 500);
})(window, document);

/*! cu-campus-path-ai-v1 · U64 — level-aware Nur Path Engine */
(function (w, d) {
  "use strict";
  if (w.__CU_CAMPUS_PATH_AI_V1__) return;
  w.__CU_CAMPUS_PATH_AI_V1__ = true;

  var MAP_URL = "/campus/assets/data/cu-path-ai-map-v1.json?v=20261122U64";
  var mapCache = null;

  function path() {
    return (location.pathname || "").replace(/\/+$/, "") || "";
  }
  function onDesk() {
    return path().indexOf("/campus/desk") === 0 || path() === "/campus";
  }
  function phase() {
    if (w.ClarityNurOS && w.ClarityNurOS.level) return w.ClarityNurOS.level();
    var p = path();
    if (p.indexOf("/practice") >= 0) return 2;
    if (p.indexOf("/consistency") >= 0) return 3;
    if (p.indexOf("/transmission") >= 0) return 4;
    if (p.indexOf("/seeker") >= 0) return 1;
    try {
      return parseInt(localStorage.getItem("clarity_curriculum_phase_v1") || "1", 10) || 1;
    } catch (e) {
      return 1;
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
  function unit(map) {
    var ph = String(phase());
    if (map.levels && map.levels[ph]) return map.levels[ph];
    if (map.phases && map.phases[ph] && map.phases[ph].label) return map.phases[ph];
    return { label: "Level " + ph, desk: "/campus/desk/", benches: [], intent: "" };
  }
  function render(map, root) {
    var u = unit(map);
    var host = root.querySelector(".pai-benches");
    var meta = root.querySelector(".pai-meta");
    if (meta) {
      meta.textContent = (u.label || "") + " · " + (u.intent || "");
    }
    if (!host) return;
    var html =
      '<a class="pai-bench" href="' +
      esc(u.desk || "/campus/desk/") +
      '"><strong>Primary · ' +
      esc(u.label || "Desk") +
      "</strong><span>" +
      esc(u.intent || "") +
      "</span></a>";
    (u.benches || []).forEach(function (b) {
      html +=
        '<a class="pai-bench" href="' +
        esc(b.href) +
        '"><strong>Craft · ' +
        esc(b.title) +
        "</strong><span>" +
        esc(b.why) +
        "</span></a>";
    });
    if (u.outward && u.outward[0]) {
      html +=
        '<a class="pai-bench" href="' +
        esc(u.outward[0].href) +
        '" target="_blank" rel="noopener"><strong>Outward · structured curriculum</strong><span>' +
        esc(u.outward[0].label) +
        " (external · free tracks)</span></a>";
    }
    host.innerHTML = html;
  }
  function routeIntent(map, q) {
    var low = String(q || "").toLowerCase();
    var topics = map.topics || {};
    for (var id in topics) {
      var keys = topics[id] || [];
      for (var i = 0; i < keys.length; i++) {
        if (low.indexOf(keys[i]) >= 0) {
          var b = (map.topicBenches || {})[id];
          if (b) return { id: id, bench: b };
        }
      }
    }
    return null;
  }
  function mount(map) {
    if (!onDesk()) return;
    ensureCss();
    var existing = d.getElementById("cu-campus-path-ai");
    if (existing) {
      render(map, existing);
      return;
    }
    var sec = d.createElement("section");
    sec.id = "cu-campus-path-ai";
    sec.className = "cu-path-ai";
    sec.innerHTML =
      '<div class="pai-card">' +
      '<p class="pai-kicker">Nur Path Engine · staged</p>' +
      "<h2>Path intelligence · this level only</h2>" +
      '<p class="pai-lead">Modules are assigned by learning level — not stacked on every desk. Rule-based · this browser only.</p>' +
      '<p class="pai-meta"></p>' +
      '<div class="pai-benches"></div>' +
      '<form class="pai-row" id="pai-form">' +
      '<input type="search" id="pai-q" placeholder="Route: tajweed · notes · wasiyyah" />' +
      '<button type="submit" class="pai-go">Route</button></form>' +
      '<div id="pai-route-out"></div>' +
      '<p class="pai-stamp">Educational router — not a fatwa · not a grade of īmān</p></div>';
    var main = d.querySelector("main") || d.body;
    var after = d.getElementById("cu-vle-hud") || main.querySelector("h1, h2");
    if (after && after.parentNode) after.parentNode.insertBefore(sec, after.nextSibling);
    else main.insertBefore(sec, main.firstChild);
    render(map, sec);
    d.getElementById("pai-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var hit = routeIntent(map, d.getElementById("pai-q").value);
      var out = d.getElementById("pai-route-out");
      if (hit && hit.bench) {
        out.innerHTML =
          '<a class="pai-bench" href="' +
          esc(hit.bench.href) +
          '"><strong>Routed · ' +
          esc(hit.bench.title) +
          "</strong></a>";
      } else {
        out.innerHTML = '<p class="pai-stamp">No specialty match — use level benches above.</p>';
      }
    });
  }
  function load(cb) {
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
        cb({ levels: {} });
      });
  }
  function boot() {
    load(function (map) {
      try {
        mount(map);
      } catch (e) {}
    });
  }
  w.addEventListener("nuros-level", function () {
    if (mapCache) mount(mapCache);
  });
  w.ClarityPathAI = { version: "U64", phase: phase, route: function (q, cb) {
    load(function (m) {
      cb(routeIntent(m, q), m);
    });
  }};
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 500);
})(window, document);

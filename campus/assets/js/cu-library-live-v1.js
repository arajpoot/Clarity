/**
 * cu-library-live-v1.js — Librarian + Scout active roles on Library
 * Shelves, daily scout proposal, pin to vault, resource chips
 */
(function (g) {
  "use strict";
  if (g.__CU_LIBRARY_LIVE_V1__) return;
  g.__CU_LIBRARY_LIVE_V1__ = true;

  var SHELVES_URL = "/campus/assets/staff/library/shelves.json";
  var ROSTER_URL = "/campus/assets/staff/staff-roster.json";
  var RES_URL = "/campus/assets/faculty/resource-map.json";
  var SCOUT_KEY = "clarity_staff_scout_inbox_v1";
  var PIN_KEY = "cu_vault_pins_v1";
  var state = { shelves: null, roster: null, resources: null };

  function esc(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }
  function fetchJSON(url) {
    return fetch(url, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(url);
      return r.json();
    });
  }
  function lsGet(k, fb) {
    try {
      var v = localStorage.getItem(k);
      return v == null ? fb : JSON.parse(v);
    } catch (e) {
      return fb;
    }
  }
  function lsSet(k, v) {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {}
  }

  function paintStaff() {
    var host = document.getElementById("lib-staff");
    if (!host || !state.roster) return;
    var workers = (state.roster.workers || []).filter(function (w) {
      return w.id === "librarian" || w.id === "scout";
    });
    host.innerHTML = workers
      .map(function (w) {
        return (
          '<div class="lib-staff-card"><span class="badge">' +
          esc(w.badge || "") +
          "</span><strong>" +
          esc(w.title || w.name) +
          "</strong><p>" +
          esc(w.role) +
          "</p></div>"
        );
      })
      .join("");
  }

  function paintShelves() {
    var host = document.getElementById("lib-shelves");
    if (!host) return;
    var shelves = (state.shelves && state.shelves.shelves) || [];
    if (!shelves.length) {
      host.innerHTML = "<p class=\"lib-muted\">Shelves load when online. Educational pointers only.</p>";
      return;
    }
    host.innerHTML = shelves
      .map(function (s) {
        var refs = (s.refs || [])
          .map(function (r) {
            return (
              '<li><a href="' +
              esc(r.url) +
              '" target="_blank" rel="noopener noreferrer">' +
              esc(r.title) +
              '</a> <span class="tag">' +
              esc(r.tag || "") +
              '</span> <button type="button" class="lib-pin" data-title="' +
              esc(r.title) +
              '" data-url="' +
              esc(r.url) +
              '">Pin</button></li>'
            );
          })
          .join("");
        return (
          '<section class="lib-shelf" data-phase="' +
          esc(s.phase) +
          '"><h2>Phase ' +
          esc(s.phase) +
          " · " +
          esc(s.title) +
          "</h2><ul>" +
          refs +
          "</ul></section>"
        );
      })
      .join("");
    host.querySelectorAll(".lib-pin").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var list = lsGet(PIN_KEY, []);
        if (!Array.isArray(list)) list = [];
        list.unshift({
          id: "p" + Date.now().toString(36),
          title: btn.getAttribute("data-title"),
          url: btn.getAttribute("data-url"),
          shelf: "library",
          note: "Pinned from University Library",
          at: Date.now()
        });
        lsSet(PIN_KEY, list.slice(0, 40));
        btn.textContent = "Pinned";
        btn.disabled = true;
      });
    });
  }

  function paintScout() {
    var host = document.getElementById("lib-scout");
    if (!host) return;
    // Seed a daily proposal from resource-map / shelves if inbox empty
    var inbox = lsGet(SCOUT_KEY, []);
    if (!Array.isArray(inbox) || !inbox.length) {
      var chips = (state.resources && state.resources.chips) || [];
      var pick = chips.filter(function (c) {
        return !c.internal;
      })[Math.floor(Math.random() * Math.max(chips.length, 1))] || {
        title: "Quran.com",
        url: "https://quran.com",
        why: "Daily reading pointer"
      };
      inbox = [
        {
          id: "scout-" + new Date().toISOString().slice(0, 10),
          title: pick.title,
          url: pick.url,
          note: pick.why || "Allowlisted educational pointer",
          at: Date.now(),
          source: "scout-seed"
        }
      ];
      lsSet(SCOUT_KEY, inbox);
    }
    var item = inbox[0];
    host.innerHTML =
      '<div class="lib-scout-card"><p class="eyebrow">Scout · today’s proposal</p><h3>' +
      esc(item.title) +
      "</h3><p>" +
      esc(item.note || "") +
      '</p><p><a class="lib-btn" href="' +
      esc(item.url) +
      '" target="_blank" rel="noopener noreferrer">Open source</a> ' +
      '<button type="button" class="lib-btn ghost" id="lib-scout-pin">Pin to Vault</button> ' +
      '<button type="button" class="lib-btn ghost" id="lib-scout-next">Another proposal</button></p>' +
      '<p class="lib-muted">Scout proposes · Librarian curates · You decide. Not a fatwa.</p></div>';
    document.getElementById("lib-scout-pin").onclick = function () {
      var list = lsGet(PIN_KEY, []);
      if (!Array.isArray(list)) list = [];
      list.unshift({
        id: "p" + Date.now().toString(36),
        title: item.title,
        url: item.url,
        shelf: "scout",
        note: item.note || "",
        at: Date.now()
      });
      lsSet(PIN_KEY, list.slice(0, 40));
      this.textContent = "Pinned";
    };
    document.getElementById("lib-scout-next").onclick = function () {
      var chips = (state.resources && state.resources.chips) || [];
      var ext = chips.filter(function (c) {
        return !c.internal;
      });
      if (!ext.length) return;
      var pick = ext[Math.floor(Math.random() * ext.length)];
      lsSet(SCOUT_KEY, [
        {
          id: "scout-" + Date.now(),
          title: pick.title,
          url: pick.url,
          note: pick.why,
          at: Date.now(),
          source: "scout-rotate"
        }
      ]);
      paintScout();
    };
  }

  function paintPrinciples() {
    var host = document.getElementById("lib-principles");
    if (!host || !state.shelves) return;
    var p = state.shelves.uxPrinciples || [];
    host.innerHTML = "<ul>" + p.map(function (x) {
      return "<li>" + esc(x) + "</li>";
    }).join("") + "</ul>";
  }

  function paintChips() {
    var host = document.getElementById("lib-chips");
    if (!host || !state.resources) return;
    host.innerHTML = (state.resources.chips || [])
      .slice(0, 10)
      .map(function (c) {
        var ext = c.internal ? "" : ' target="_blank" rel="noopener noreferrer"';
        return (
          '<a class="lib-chip" href="' +
          esc(c.url) +
          '"' +
          ext +
          "><strong>" +
          esc(c.title) +
          "</strong><span>" +
          esc(c.why) +
          "</span></a>"
        );
      })
      .join("");
  }

  function boot() {
    Promise.all([
      fetchJSON(SHELVES_URL).catch(function () {
        return { shelves: [] };
      }),
      fetchJSON(ROSTER_URL).catch(function () {
        return null;
      }),
      fetchJSON(RES_URL).catch(function () {
        return { chips: [] };
      })
    ]).then(function (arr) {
      state.shelves = arr[0];
      state.roster = arr[1];
      state.resources = arr[2];
      paintStaff();
      paintShelves();
      paintScout();
      paintPrinciples();
      paintChips();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);

/**
 * Campus roles strip — IE-2..IE-4 · 20261016A
 * Map + desk hub only. Lazy-loads wings via cu-lazy-wings (no full flash on quiet rooms).
 */
(function (g) {
  "use strict";
  if (g.__CU_CAMPUS_ROLES_V1__) return;
  g.__CU_CAMPUS_ROLES_V1__ = true;

  var VER = "20261016A";

  function path() {
    return (location.pathname || "").replace(/\/+$/, "") || "/";
  }

  function ensureSingleStrip() {
    /* remove duplicate role strips */
    var strips = document.querySelectorAll(".cu-roles-strip, #cu-campus-roles");
    if (strips.length > 1) {
      for (var i = 1; i < strips.length; i++) strips[i].remove();
    }
  }
  function allowedPage() {
    var p = path();
    return p === "/campus" || p === "/campus/" || p === "/campus/desk" || p === "/campus/desk/";
  }

  function ensureLazyWings() {
    return new Promise(function (resolve) {
      if (g.ClarityLazyWings && typeof g.ClarityLazyWings.openWing === "function") {
        resolve(true);
        return;
      }
      if (document.querySelector('script[src*="cu-lazy-wings"]')) {
        var n = 0;
        var t = setInterval(function () {
          n++;
          if (g.ClarityLazyWings && g.ClarityLazyWings.openWing) {
            clearInterval(t);
            resolve(true);
          } else if (n > 40) {
            clearInterval(t);
            resolve(false);
          }
        }, 50);
        return;
      }
      var s = document.createElement("script");
      s.src = "/assets/curriculum/vault/admin/campus/cu-lazy-wings-v1.js?v=" + VER;
      s.defer = true;
      s.onload = function () {
        resolve(!!(g.ClarityLazyWings && g.ClarityLazyWings.openWing));
      };
      s.onerror = function () {
        resolve(false);
      };
      document.head.appendChild(s);
    });
  }

  function phaseFromPath() {
    var p = path().toLowerCase();
    if (p.indexOf("seeker") >= 0) return "seeker";
    if (p.indexOf("practice") >= 0) return "practice";
    if (p.indexOf("consistency") >= 0) return "consistency";
    if (p.indexOf("transmission") >= 0) return "transmission";
    return "hub";
  }

  var PHASE_TIP = {
    hub: {
      title: "Faculty · Campus desk",
      tip: "Choose a quiet room: Seeker → Practice → Consistency → Transmission. One phase at a time.",
      href: "/campus/desk/seeker/"
    },
    seeker: {
      title: "Faculty · Seeker",
      tip: "Foundations first: belief, purification of intent, short modules. Then open Practice when ready.",
      href: "/campus/desk/seeker/"
    },
    practice: {
      title: "Faculty · Practice",
      tip: "New Muslim desk: living the pillars with calm routine. Craft after modules — Lab is reference.",
      href: "/campus/desk/practice/"
    },
    consistency: {
      title: "Faculty · Daily",
      tip: "Consistency: adhkār, adab, steady review. Prefer small daily acts over long rare sessions.",
      href: "/campus/desk/consistency/"
    },
    transmission: {
      title: "Faculty · Daʿwah",
      tip: "Transmission: share with sincerity and sources. Educational only — not a fatwa desk.",
      href: "/campus/desk/transmission/"
    }
  };

  function setStatus(msg) {
    var el = document.getElementById("cu-roles-status");
    if (el) el.textContent = msg || "";
  }

  function showFacultyTip() {
    var spec = PHASE_TIP[phaseFromPath()] || PHASE_TIP.hub;
    var panel = document.getElementById("cu-roles-faculty-panel");
    if (!panel) return;
    panel.hidden = false;
    panel.innerHTML =
      "<strong>" +
      spec.title +
      "</strong><p>" +
      spec.tip +
      '</p><p class="cu-roles-actions"><a class="cu-roles-link" href="' +
      spec.href +
      '">Open this riwaq →</a> · <a class="cu-roles-link" href="/campus/">Campus map</a> · <a class="cu-roles-link" href="/">Companion</a></p>' +
      '<p class="cu-roles-note">Educational personas only — not living ijāzah.</p>';
    setStatus("Faculty guide open (local tip). Full wing loads on demand.");
  }

  function openRole(id) {
    setStatus("Loading " + id + "…");
    ensureLazyWings().then(function (ok) {
      if (!ok) {
        if (id === "faculty") {
          showFacultyTip();
          return;
        }
        setStatus("Wing loader unavailable — use Campus map links.");
        return;
      }
      try {
        g.ClarityLazyWings.openWing(id).then(function (opened) {
          if (id === "faculty") showFacultyTip();
          if (id === "security") setStatus("Security: educational device checks only — not a threat product.");
          else if (id === "it") setStatus("IT: on-device help · storage stays local.");
          else if (id === "om") setStatus("O&M: light maintenance cues.");
          else if (!opened && id !== "faculty") setStatus(id + " loaded — if no panel, use map / Companion.");
          else if (opened) setStatus(id + " desk opened.");
        });
      } catch (e) {
        if (id === "faculty") showFacultyTip();
        setStatus("Open failed — tip available for Faculty.");
      }
    });
  }

  function mount() {
    if (!allowedPage()) return;
    if (document.getElementById("cu-campus-roles")) return;

    var box = document.createElement("section");
    box.id = "cu-campus-roles";
    box.className = "cu-campus-roles";
    box.setAttribute("aria-label", "Campus roles");
    box.innerHTML =
      '<h2 class="cu-roles-title">Campus roles · guided learning</h2>' +
      '<p class="cu-roles-lead">Interactive staff for orientation. Loads only when you tap — keeps quiet rooms light.</p>' +
      '<div class="cu-roles-row" role="toolbar">' +
      '<button type="button" class="cu-roles-btn" data-role="faculty">🎓 Faculty</button>' +
      '<button type="button" class="cu-roles-btn" data-role="security">◎ Security</button>' +
      '<button type="button" class="cu-roles-btn" data-role="it">💻 IT</button>' +
      '<button type="button" class="cu-roles-btn" data-role="om">◇ O&amp;M</button>' +
      '<button type="button" class="cu-roles-btn" data-role="registrar">📋 Registrar</button>' +
      '</div><p id="cu-roles-status" class="cu-roles-status" aria-live="polite"></p>' +
      '<div id="cu-roles-faculty-panel" class="cu-roles-faculty-panel" hidden></div>';

    var host = document.querySelector("main.cu-wrap") || document.querySelector("main") || document.body;
    /* After primary map content; before companion enrich (enrich stays at bottom) */
    var anchor =
      document.getElementById("cu-continue") ||
      document.querySelector(".cu-how") ||
      document.querySelector(".cu-pills");
    if (anchor && anchor.parentNode) {
      if (anchor.nextSibling) anchor.parentNode.insertBefore(box, anchor.nextSibling);
      else anchor.parentNode.appendChild(box);
    } else {
      var foot = document.querySelector("footer.cu-foot");
      if (foot && foot.parentNode) foot.parentNode.insertBefore(box, foot);
      else host.appendChild(box);
    }

    box.querySelectorAll("[data-role]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openRole(btn.getAttribute("data-role"));
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
  setTimeout(mount, 500);
})(typeof window !== "undefined" ? window : this);

/**
 * Campus roles strip — 20261016ROLES
 * Works without wing loader: educational tips + room links.
 * Lazy wings enhance when available.
 */
(function (g) {
  "use strict";
  if (g.__CU_CAMPUS_ROLES_V1__) return;
  g.__CU_CAMPUS_ROLES_V1__ = true;

  var VER = "20261016ROLES";

  function path() {
    return (location.pathname || "").replace(/\/+$/, "") || "/";
  }

  function allowedPage() {
    var p = path();
    return p === "/campus" || p === "/campus/" || p === "/campus/desk" || p === "/campus/desk/";
  }

  function phaseFromPath() {
    var p = path().toLowerCase();
    if (p.indexOf("seeker") >= 0) return "seeker";
    if (p.indexOf("practice") >= 0) return "practice";
    if (p.indexOf("consistency") >= 0) return "consistency";
    if (p.indexOf("transmission") >= 0) return "transmission";
    return "hub";
  }

  var TIPS = {
    faculty: {
      title: "Faculty · Campus desk",
      body: "Choose a quiet room: Seeker → Practice → Consistency → Transmission. One phase at a time.",
      href: "/campus/desk/seeker/"
    },
    security: {
      title: "Security · Adab online",
      body: "Protect privacy: vault stays on-device. Do not share passphrases. Educational guides only — not surveillance.",
      href: "/vault/"
    },
    it: {
      title: "IT · Device help",
      body: "Prefer hard-refresh if a module looks stuck. University pages use on-device storage. Clear site data only if you accept losing local progress.",
      href: "/campus/"
    },
    om: {
      title: "O&M · Steady practice",
      body: "Small daily acts beat rare long sessions. Lab stations support craft after desk modules.",
      href: "/lab/"
    },
    registrar: {
      title: "Registrar · Path record",
      body: "Progress is stored in this browser only. Phase unlock uses localStorage. No remote transcript.",
      href: "/campus/desk/seeker/"
    }
  };

  function setStatus(msg) {
    var el = document.getElementById("cu-roles-status");
    if (el) el.textContent = msg || "";
  }

  function showPanel(id) {
    var spec = TIPS[id] || TIPS.faculty;
    var panel = document.getElementById("cu-roles-faculty-panel");
    if (!panel) return;
    panel.hidden = false;
    panel.innerHTML =
      "<strong>" +
      spec.title +
      "</strong><p>" +
      spec.body +
      '</p><p class="cu-roles-actions"><a class="cu-roles-link" href="' +
      spec.href +
      '">Open →</a> · <a class="cu-roles-link" href="/campus/">Campus map</a> · <a class="cu-roles-link" href="/">Companion</a></p>' +
      '<p class="cu-roles-note">Educational personas only — not living ijāzah or fatwa staff.</p>';
    setStatus("");
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

  function openRole(id) {
    showPanel(id);
    ensureLazyWings().then(function (ok) {
      if (!ok || !g.ClarityLazyWings || !g.ClarityLazyWings.openWing) return;
      try {
        g.ClarityLazyWings.openWing(id).then(function (opened) {
          if (opened) setStatus(id + " desk opened when available.");
        });
      } catch (e) {}
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
      '<p class="cu-roles-lead">Interactive staff for orientation. Tips work offline; full desks load when available.</p>' +
      '<div class="cu-roles-row" role="toolbar">' +
      '<button type="button" class="cu-roles-btn" data-role="faculty">🎓 Faculty</button>' +
      '<button type="button" class="cu-roles-btn" data-role="security">◎ Security</button>' +
      '<button type="button" class="cu-roles-btn" data-role="it">💻 IT</button>' +
      '<button type="button" class="cu-roles-btn" data-role="om">◇ O&amp;M</button>' +
      '<button type="button" class="cu-roles-btn" data-role="registrar">📋 Registrar</button>' +
      '</div><p id="cu-roles-status" class="cu-roles-status" aria-live="polite"></p>' +
      '<div id="cu-roles-faculty-panel" class="cu-roles-faculty-panel" hidden></div>';

    var host = document.querySelector("main.cu-wrap") || document.querySelector("main") || document.body;
    var anchor =
      document.getElementById("cu-continue") ||
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

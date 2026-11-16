/*! companion-ux-rail-v1 · iconize door rail + glass rhythm
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_UX_RAIL_V1__) return;
  w.__COMPANION_UX_RAIL_V1__ = true;

  var MAP = {
    reminder: "nuros-icon-reminder",
    reality: "nuros-icon-reality",
    reflection: "nuros-icon-reflection",
    action: "nuros-icon-action",
    notes: "nuros-icon-notes",
    about: "nuros-icon-about"
  };

  function enhanceDoor() {
    var rail = d.getElementById("clarity-door-rail");
    if (!rail) return;
    rail.querySelectorAll("[data-rail-tab]").forEach(function (btn) {
      var tab = btn.getAttribute("data-rail-tab");
      btn.classList.add("cs-door-btn");
      var ico = btn.querySelector(".dr-ico");
      if (!ico) {
        ico = d.createElement("span");
        ico.className = "dr-ico";
        ico.setAttribute("aria-hidden", "true");
        btn.insertBefore(ico, btn.firstChild);
      }
      ico.classList.add("nuros-icon");
      if (MAP[tab]) ico.classList.add(MAP[tab]);
      /* wrap text label if plain text nodes remain */
      if (!btn.querySelector(".dr-label")) {
        var label = d.createElement("span");
        label.className = "dr-label";
        var texts = [];
        Array.prototype.forEach.call(btn.childNodes, function (n) {
          if (n.nodeType === 3 && n.textContent.trim()) {
            texts.push(n.textContent.trim());
            n.textContent = "";
          }
        });
        label.textContent = texts.join(" ") || tab.charAt(0).toUpperCase() + tab.slice(1);
        btn.appendChild(label);
      }
    });
  }

  function boot() {
    enhanceDoor();
    setTimeout(enhanceDoor, 400);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window, document);

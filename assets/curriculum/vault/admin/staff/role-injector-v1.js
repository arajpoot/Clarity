/* Clarity University — Role Injector v1
 * Injects trained staff, faculty, IT, O&M, and security roles onto campus and class pages.
 * Educational personas only. On-device. Not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_ROLE_INJECTOR__) return;
  g.__CLARITY_ROLE_INJECTOR__ = true;

  var ROLES = [
    { id: "faculty", label: "Faculty", icon: "👨‍🏫", desc: "Phase teachers · help" },
    { id: "staff", label: "Staff", icon: "🧑‍💼", desc: "Usher · runner · desk" },
    { id: "it", label: "IT", icon: "🖥️", desc: "Device lab · upgrades" },
    { id: "om", label: "O&M", icon: "⚙️", desc: "Operations · monitor" },
    { id: "security", label: "Security", icon: "🛡️", desc: "Auditors · seals" }
  ];

  function inject() {
    if (document.getElementById("clarity-role-rail")) return;
    var rail = document.createElement("div");
    rail.id = "clarity-role-rail";
    rail.setAttribute("aria-label", "University roles");
    rail.style.cssText = "display:flex;flex-wrap:wrap;gap:.4rem;justify-content:center;margin:.75rem 0;padding:.4rem";
    ROLES.forEach(function (r) {
      var pill = document.createElement("button");
      pill.type = "button";
      pill.className = "clarity-role-pill";
      pill.dataset.role = r.id;
      pill.innerHTML = r.icon + " " + r.label;
      pill.title = r.desc;
      pill.style.cssText = "font:inherit;font-size:.72rem;font-weight:650;padding:.35rem .7rem;border-radius:999px;border:1px solid rgba(224,197,106,.35);background:rgba(0,0,0,.28);color:#f3e6c0;cursor:pointer";
      pill.addEventListener("click", function () {
        try { g.dispatchEvent(new CustomEvent("clarity-role-activate", { detail: r })); } catch (e) {}
        console.info("%c Role", "background:#1a0f08;color:#d4b45a", r.label, "activated (educational)");
      });
      rail.appendChild(pill);
    });
    var host = document.querySelector(".uni-wrap, #clarity-campus-stage, .cu-map, main") || document.body;
    host.insertBefore(rail, host.firstChild);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})(window);

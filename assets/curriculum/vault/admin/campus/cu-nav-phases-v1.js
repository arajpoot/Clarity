/* P1 hall rail · P3 prefetch · P4 progress dots */
(function (g) {
  "use strict";
  if (g.__CU_NAV_PHASES_V1__) return;
  g.__CU_NAV_PHASES_V1__ = true;

  function hallRail() {
    if (document.body && document.body.getAttribute("data-campus-page") === "map") return; /* map uses journey cards */
    if (document.querySelector(".cu-hall-rail")) return;
    var pills = document.querySelector(".cu-pills");
    if (!pills) return;
    var rail = document.createElement("nav");
    rail.className = "cu-hall-rail";
    rail.setAttribute("aria-label", "Learning halls");
    var halls = [
      { id: "usul", label: "Uṣūl", href: "/campus/desk/seeker/" },
      { id: "ibadah", label: "ʿIbādah", href: "/campus/desk/practice/" },
      { id: "itqan", label: "Itqān", href: "/campus/desk/consistency/" },
      { id: "balagh", label: "Balāgh", href: "/campus/desk/transmission/" }
    ];
    var q = "";
    try {
      q = (new URL(location.href).searchParams.get("phase") || "").toLowerCase();
    } catch (e) {}
    var map = { seeker: "usul", junior: "usul", "new-muslim": "ibadah", newmuslim: "ibadah", daily: "itqan", dai: "balagh" };
    var active = map[q] || (location.pathname.indexOf("/desk") >= 0 ? "usul" : "");
    halls.forEach(function (h) {
      var a = document.createElement("a");
      a.href = h.href;
      a.setAttribute("data-hall", h.id);
      a.textContent = h.label;
      if (h.id === active) a.classList.add("here");
      rail.appendChild(a);
    });
    pills.parentNode.insertBefore(rail, pills.nextSibling);
  }

  function prefetch() {
    var urls = ["/campus/", "/campus/desk/", "/lab/", "/vault/"];
    urls.forEach(function (u) {
      try {
        var l = document.createElement("link");
        l.rel = "prefetch";
        l.href = u;
        document.head.appendChild(l);
      } catch (e) {}
    });
    document.querySelectorAll(".cu-pills a").forEach(function (a) {
      a.addEventListener(
        "pointerenter",
        function () {
          try {
            var l = document.createElement("link");
            l.rel = "prefetch";
            l.href = a.href;
            document.head.appendChild(l);
          } catch (e2) {}
        },
        { once: true }
      );
    });
  }

  function progressDots() {
    var junior = 0;
    try {
      junior = parseInt(localStorage.getItem("clarity_junior_checks_v1") || "0", 10) || 0;
    } catch (e) {}
    document.querySelectorAll('.cu-pills a[data-nav="desk"], .cu-pills a[href*="desk"]').forEach(function (a) {
      if (a.querySelector(".cu-nav-dot")) return;
      var d = document.createElement("span");
      d.className = "cu-nav-dot" + (junior > 0 ? " on" : "");
      d.title = junior ? junior + " checks on device" : "No desk checks yet";
      a.appendChild(d);
    });
    var lab = false;
    try {
      lab = !!localStorage.getItem("clarity_lab_last_v1");
    } catch (e2) {}
    document.querySelectorAll('.cu-pills a[data-nav="lab"], .cu-pills a[href*="/lab"]').forEach(function (a) {
      if (a.querySelector(".cu-nav-dot")) return;
      var d = document.createElement("span");
      d.className = "cu-nav-dot" + (lab ? " on" : "");
      a.appendChild(d);
    });
  }

  function boot() {
    hallRail();
    prefetch();
    progressDots();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);

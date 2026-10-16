/* Rich nav: icons + aria-current + soft activate pulse */
(function (g) {
  "use strict";
  if (g.__CU_NAV_RICH_V1__) return;
  g.__CU_NAV_RICH_V1__ = true;

  var ICO = {
    map: "🗺️",
    desk: "📖",
    lab: "🎧",
    vault: "🔐",
    journey: "🧭",
    charter: "📜"
  };

  function kind(href) {
    href = String(href || "");
    if (href.indexOf("/campus/desk") >= 0) return "desk";
    if (href.indexOf("/lab") >= 0) return "lab";
    if (href.indexOf("/vault") >= 0) return "vault";
    if (href.indexOf("/journey") >= 0) return "journey";
    if (href.indexOf("/charter") >= 0) return "charter";
    if (href === "/campus/" || href.indexOf("/campus") >= 0) return "map";
    return "";
  }

  function pathKind() {
    var p = location.pathname || "";
    if (p.indexOf("/campus/desk") >= 0) return "desk";
    if (p.indexOf("/lab") >= 0) return "lab";
    if (p.indexOf("/vault") >= 0) return "vault";
    if (p.indexOf("/journey") >= 0) return "journey";
    if (p.indexOf("/charter") >= 0) return "charter";
    if (p === "/campus/" || p === "/campus" || p.indexOf("/campus") === 0) return "map";
    return "";
  }

  function enhance() {
    var pk = pathKind();
    document.querySelectorAll(".cu-pills a").forEach(function (a) {
      var k = kind(a.getAttribute("href"));
      if (!k) return;
      a.setAttribute("data-nav", k);
      if (k === pk) {
        a.classList.add("here");
        a.setAttribute("aria-current", "page");
      } else {
        a.classList.remove("here");
        a.removeAttribute("aria-current");
      }
      if (!a.querySelector(".cu-nav-ico") && ICO[k]) {
        var s = document.createElement("span");
        s.className = "cu-nav-ico";
        s.setAttribute("aria-hidden", "true");
        s.textContent = ICO[k];
        a.insertBefore(s, a.firstChild);
      }
      if (!a.__cuNavBound) {
        a.__cuNavBound = true;
        a.addEventListener("click", function () {
          a.classList.add("cu-nav-pulse");
          setTimeout(function () {
            a.classList.remove("cu-nav-pulse");
          }, 280);
        });
      }
    });
  }

  var style = document.createElement("style");
  style.textContent =
    ".cu-pills a.cu-nav-pulse{transform:scale(0.96)!important;filter:brightness(1.08)}";
  document.head.appendChild(style);

  function boot() {
    enhance();
    setTimeout(enhance, 400);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(typeof window !== "undefined" ? window : this);

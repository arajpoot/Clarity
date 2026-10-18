(function () {
  "use strict";
  function clean() {
    var actions = document.querySelector(".cu-banner-actions");
    if (!actions) return;
    var seen = {};
    actions.querySelectorAll("[data-cu-theme]").forEach(function (btn) {
      var v = (btn.getAttribute("data-cu-theme") || "").toLowerCase();
      if (v === "auto" || v === "day") v = v === "auto" ? "system" : "light";
      if (v === "night") v = "dark";
      if (v !== "light" && v !== "dark" && v !== "system") v = "system";
      btn.setAttribute("data-cu-theme", v);
      if ((btn.textContent || "").trim() === "Auto") btn.textContent = "System";
      if (seen[v]) btn.remove();
      else seen[v] = true;
    });
    document.querySelectorAll("[data-cu-theme]").forEach(function (btn) {
      if (!actions.contains(btn)) btn.remove();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", clean);
  else clean();
  setTimeout(clean, 80);
  setTimeout(clean, 500);
})();

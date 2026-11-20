/*! cu-hub-calm-v1 */
(function () {
  var p = (location.pathname || "").replace(/\/+$/, "");
  if (p !== "/campus" && p !== "") return;
  function scrub() {
    document.querySelectorAll("h2, .card-title").forEach(function (el) {
      if (!/Junior curriculum/i.test(el.textContent || "")) return;
      var root = el.closest("section, article, .card, div") || el.parentElement;
      if (root) root.style.display = "none";
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scrub);
  else scrub();
  [200, 600, 1500, 3000].forEach(function (t) { setTimeout(scrub, t); });
})();

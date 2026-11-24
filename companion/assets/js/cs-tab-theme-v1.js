/*! cs-tab-theme-v1 · set data-cs-tab from path */
(function () {
  function tabFromPath() {
    var m = (location.pathname || "").match(/\/tabs\/([a-z]+)/i);
    if (m) return m[1].toLowerCase();
    var h = (location.hash || "").replace(/^#/, "").toLowerCase();
    if (/^(reminder|reality|reflection|action|notes|about)$/.test(h)) return h;
    return "reminder";
  }
  function apply() {
    var t = tabFromPath();
    document.body.setAttribute("data-cs-tab", t);
    document.documentElement.setAttribute("data-tab", t);
  }
  apply();
  addEventListener("hashchange", apply);
  addEventListener("popstate", apply);
  // companion shell may swap tabs without full nav
  var obs = new MutationObserver(function () { apply(); });
  if (document.body) obs.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  setTimeout(apply, 300);
})();

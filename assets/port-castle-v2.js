/*! port-castle-v2 */
(function () {
  function $(id) { return document.getElementById(id); }
  function setNet() {
    var chip = $("cp-net-chip");
    if (!chip) return;
    if (navigator.onLine) {
      chip.textContent = "Online";
      chip.className = "port-chip online";
    } else {
      chip.textContent = "Offline";
      chip.className = "port-chip offline";
    }
  }
  window.addEventListener("online", setNet);
  window.addEventListener("offline", setNet);
  setNet();
  var tb = $("cp-theme");
  if (tb) {
    tb.addEventListener("click", function () {
      var h = document.documentElement;
      var n = h.getAttribute("data-theme") === "light" ? "dark" : "light";
      h.setAttribute("data-theme", n);
      try { localStorage.setItem("clarity.port.theme", n); } catch (e) {}
    });
    try {
      var t = localStorage.getItem("clarity.port.theme");
      if (t) document.documentElement.setAttribute("data-theme", t);
    } catch (e2) {}
  }
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).then(function () {
      var c = $("cp-sw-chip");
      if (c) c.textContent = "PWA ready";
    }).catch(function () {
      var c = $("cp-sw-chip");
      if (c) c.textContent = "PWA off";
    });
  }
})();

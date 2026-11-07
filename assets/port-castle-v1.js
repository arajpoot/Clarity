/*! port-castle-v1 · offline chip · SW register · theme */
(function () {
  "use strict";
  function $(id) { return document.getElementById(id); }
  function setNet() {
    var chip = $("cp-net-chip");
    if (!chip) return;
    if (navigator.onLine) {
      chip.textContent = "Online";
      chip.className = "cp-chip online";
    } else {
      chip.textContent = "Offline · cached rooms";
      chip.className = "cp-chip offline";
    }
  }
  window.addEventListener("online", setNet);
  window.addEventListener("offline", setNet);
  setNet();

  var themeBtn = $("cp-theme");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var html = document.documentElement;
      var next = html.getAttribute("data-theme") === "light" ? "dark" : "light";
      html.setAttribute("data-theme", next);
      try { localStorage.setItem("clarity.port.theme", next); } catch (e) {}
    });
    try {
      var t = localStorage.getItem("clarity.port.theme");
      if (t) document.documentElement.setAttribute("data-theme", t);
    } catch (e2) {}
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).then(function (reg) {
      var chip = $("cp-sw-chip");
      if (chip) chip.textContent = "PWA ready";
      try { reg.update(); } catch (e) {}
    }).catch(function () {
      var chip = $("cp-sw-chip");
      if (chip) chip.textContent = "PWA unavailable";
    });
  }

  /* soft entrance */
  document.querySelectorAll(".room-tower").forEach(function (el, i) {
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    setTimeout(function () {
      el.style.transition = "opacity .45s ease, transform .45s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 80 + i * 70);
  });
})();

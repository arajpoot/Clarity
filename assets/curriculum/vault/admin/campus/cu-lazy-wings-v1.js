/* H3 Lazy wings — load IT/OM/Security/Faculty/Chancellor/Registrar only when needed */
(function (g) {
  "use strict";
  if (g.__CU_LAZY_WINGS_V1__) return;
  g.__CU_LAZY_WINGS_V1__ = true;

  var VER = "20261012GAL";
  var loaded = {};
  var MAP = {
    faculty: ["/assets/curriculum/vault/admin/faculty/faculty-controller-v1.js"],
    chancellor: ["/assets/curriculum/vault/admin/chancellor/chancellor-controller-v1.js"],
    registrar: ["/assets/curriculum/vault/admin/registrar/registrar-controller-v1.js"],
    lab: ["/assets/curriculum/vault/admin/lab/lab-controller-v1.js"],
    library: ["/assets/curriculum/vault/admin/staff/staff-librarian-v1.js"],
    it: ["/assets/curriculum/vault/admin/it/it-controller-v1.js"],
    om: ["/assets/curriculum/vault/admin/om/om-controller-v1.js"],
    security: ["/assets/curriculum/vault/admin/security/security-auditors-v1.js"]
  };
  var API = {
    faculty: "ClarityFaculty",
    chancellor: "ClarityChancellor",
    registrar: "ClarityRegistrar",
    lab: "ClarityLab",
    library: "ClarityLibrarian",
    it: "ClarityIT",
    om: "ClarityOM",
    security: "ClaritySecurity"
  };

  function loadScript(src) {
    return new Promise(function (resolve) {
      if (loaded[src]) return resolve(true);
      var s = document.createElement("script");
      s.src = src + (src.indexOf("?") >= 0 ? "&" : "?") + "v=" + VER;
      s.defer = true;
      s.onload = function () {
        loaded[src] = true;
        resolve(true);
      };
      s.onerror = function () {
        resolve(false);
      };
      document.head.appendChild(s);
    });
  }

  function loadWing(id) {
    var list = MAP[id] || [];
    return list.reduce(function (chain, src) {
      return chain.then(function () {
        return loadScript(src);
      });
    }, Promise.resolve());
  }

  function openWing(id) {
    return loadWing(id).then(function () {
      var name = API[id];
      var api = name && g[name];
      try {
        if (api && typeof api.openDesk === "function") {
          api.openDesk();
          return true;
        }
        if (id === "security" && api && typeof api.scan === "function") {
          api.scan();
          return true;
        }
        if (id === "it" && api && typeof api.scanBridge === "function") {
          api.scanBridge();
          return true;
        }
        if (id === "lab" && api && typeof api.render === "function") {
          api.render();
          return true;
        }
        if (id === "lab") {
          location.href = "/lab/";
          return true;
        }
        if (id === "library") {
          location.href = "/library/";
          return true;
        }
      } catch (e) {}
      return false;
    });
  }

  g.ClarityLazyWings = { load: loadWing, open: openWing };

  /* Patch helper dock if present */
  function patchDock() {
    if (!g.ClarityHelperDock || g.ClarityHelperDock.__lazy) return;
    var prev = g.ClarityHelperDock.open;
    if (typeof prev !== "function") return;
    g.ClarityHelperDock.open = function (h) {
      var id = h && h.id;
      if (id && MAP[id]) {
        return openWing(id);
      }
      return prev(h);
    };
    g.ClarityHelperDock.__lazy = true;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(patchDock, 300);
    });
  } else setTimeout(patchDock, 300);
})(typeof window !== "undefined" ? window : this);

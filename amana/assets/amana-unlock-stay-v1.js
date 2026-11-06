/*! amana-unlock-stay-v1 · C3
 * Hard stay on /amana/unlock until user explicitly leaves via <a> click.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  var path = (w.location.pathname || "").replace(/\/+$/, "");
  if (path !== "/amana/unlock" && !/\/amana\/unlock/i.test(w.location.pathname || "")) return;
  if (w.__AMANA_UNLOCK_STAY_V3__) return;
  w.__AMANA_UNLOCK_STAY_V3__ = true;

  d.documentElement.setAttribute("data-amana-surface", "unlock");
  d.documentElement.setAttribute("data-clarity-room", "amana");
  try { w.sessionStorage.setItem("amana_on_unlock", "1"); } catch (e) {}

  function isDesk(url) {
    try {
      var u = new URL(String(url), w.location.origin);
      var p = (u.pathname || "").replace(/\/+$/, "") || "/";
      return p === "/amana" || p === "/amana/index.html";
    } catch (e) {
      return /^\/amana\/?$/.test(String(url));
    }
  }

  var userAllowedDesk = false;
  d.addEventListener(
    "click",
    function (ev) {
      var a = ev.target && ev.target.closest && ev.target.closest("a[href]");
      if (!a) return;
      var href = a.getAttribute("href") || "";
      if (isDesk(href) || href === "/amana/" || href === "/amana") {
        userAllowedDesk = true;
        try { w.sessionStorage.removeItem("amana_on_unlock"); } catch (e) {}
      }
    },
    true
  );

  function block(url) {
    if (userAllowedDesk) return false;
    if (!isDesk(url)) return false;
    try { console.info("[Amānah unlock] blocked bounce to desk:", url); } catch (e) {}
    return true;
  }

  try {
    var desc = Object.getOwnPropertyDescriptor(w.Location.prototype, "href");
    if (desc && desc.set) {
      Object.defineProperty(w.location, "href", {
        configurable: true,
        enumerable: true,
        get: function () { return desc.get.call(w.location); },
        set: function (v) {
          if (block(v)) return;
          return desc.set.call(w.location, v);
        }
      });
    }
  } catch (e) {}

  var na = w.location.assign.bind(w.location);
  var nr = w.location.replace.bind(w.location);
  w.location.assign = function (u) { if (!block(u)) return na(u); };
  w.location.replace = function (u) { if (!block(u)) return nr(u); };

  /* show gate */
  function showGate() {
    var g = d.getElementById("amana-vault-gate");
    if (g) {
      g.hidden = false;
      g.style.display = "block";
      g.removeAttribute("aria-hidden");
    }
    var badge = d.getElementById("amana-unlock-path-badge");
    if (!badge) {
      badge = d.createElement("p");
      badge.id = "amana-unlock-path-badge";
      badge.style.cssText = "text-align:center;font-size:0.75rem;opacity:0.85;color:#d4b45a;margin:0.35rem 0";
      badge.textContent = "Vault unlock page · passphrase on this device";
      var wrap = d.querySelector(".unlock-wrap") || d.body;
      wrap.insertBefore(badge, wrap.firstChild);
    }
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", showGate);
  else showGate();
  w.addEventListener("load", showGate);
  setInterval(showGate, 2000);
})(window, document);

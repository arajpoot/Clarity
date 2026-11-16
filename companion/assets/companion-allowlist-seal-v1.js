/*! companion-allowlist-seal-v1 · production allowlist drift detector
 * Companion-only. Does not block archival files on disk — only reports shell drift.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__COMPANION_ALLOWLIST_SEAL_V1__) return;
  w.__COMPANION_ALLOWLIST_SEAL_V1__ = true;

  var ALLOW_JS = {
    "companion-shell-v1.js": 1,
    "companion-mount-fortify-v1.js": 1,
    "companion-content-stream-v2.js": 1,
    "companion-tab-engines-v1.js": 1,
    "companion-housekeep-v1.js": 1,
    "companion-rrra-quiet-v1.js": 1,
    "companion-deeplink-v1.js": 1,
    "companion-path-stacks-v1.js": 1,
    "companion-path-governance-shell-v1.js": 1,
    "companion-pathway-bridge-v1.js": 1,
    "companion-nuros-path-engine-v1.js": 1,
    "companion-hadith-governance-v1.js": 1,
    "companion-repair-v3.js": 1,
    "companion-action-wiring-v1.js": 1,
    "companion-action-fix-v1.js": 1,
    "companion-hifz-engine-v1.js": 1,
    "companion-craft-studios-v1.js": 1,
    "companion-about-mount-v1.js": 1,
    "companion-allowlist-seal-v1.js": 1
  };

  var ALLOW_CSS = {
    "companion-shell-v1.css": 1,
    "companion-about-notes-v1.css": 1,
    "companion-engines-v1.css": 1,
    "companion-rich-restore-v1.css": 1,
    "companion-housekeep-v1.css": 1,
    "companion-rrra-quiet-v1.css": 1,
    "companion-nuros-path-engine-v1.css": 1,
    "companion-repair-v3.css": 1,
    "companion-theme-surface-v1.css": 1
  };

  function base(url) {
    try {
      var u = String(url || "");
      var path = u.split("?")[0];
      var parts = path.split("/");
      return parts[parts.length - 1] || "";
    } catch (e) {
      return "";
    }
  }

  function scan() {
    var drift = [];
    d.querySelectorAll('script[src*="/companion/assets/"]').forEach(function (s) {
      var name = base(s.getAttribute("src"));
      if (name && !ALLOW_JS[name]) drift.push({ type: "js", name: name });
    });
    d.querySelectorAll('link[rel="stylesheet"][href*="/companion/assets/"]').forEach(function (l) {
      var name = base(l.getAttribute("href"));
      if (name && !ALLOW_CSS[name]) drift.push({ type: "css", name: name });
    });
    w.__COMPANION_ALLOWLIST_SEAL__ = {
      version: "v1-20261115AL1",
      drift: drift,
      allowJs: Object.keys(ALLOW_JS).length,
      allowCss: Object.keys(ALLOW_CSS).length
    };
    if (drift.length && w.console && console.info) {
      console.info("[Companion allowlist] non-allowlisted shell assets:", drift);
    }
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", scan);
  else scan();
  setTimeout(scan, 1500);
})(window, document);

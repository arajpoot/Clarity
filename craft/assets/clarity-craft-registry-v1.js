/*! ClarityCraftRegistry v1 · 20261104C9
 * Cross-room deep links for Craft tools. Isolation preserved.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.ClarityCraftRegistry) return;

  var TOOLS = {
    meme: {
      id: "meme",
      href: "/craft/meme/",
      companion: "/companion/#meme",
      label: "Meme Studio",
      sections: ["reminder", "reality", "reflection", "action"]
    },
    tajweed: {
      id: "tajweed",
      href: "/craft/tajweed/",
      companion: "/companion/#action",
      campus: "/campus/lab/tajweed/",
      label: "Tajweed Deep Studio"
    },
    calligraphy: {
      id: "calligraphy",
      href: "/craft/calligraphy/",
      companion: "/companion/#action",
      campus: "/campus/lab/calligraphy/",
      label: "Calligraphy"
    },
    quiz: {
      id: "quiz",
      href: "/craft/quiz/",
      label: "Sharia IQ / Quiz"
    },
    notes: {
      id: "notes",
      href: "/craft/notes/",
      companion: "/companion/#notes",
      amana: "/amana/notes/",
      label: "Craft Notes"
    },
    desks: {
      id: "desks",
      href: "/craft/meme/#desks",
      label: "𝕏 + Facebook desks"
    }
  };

  function get(id) {
    return TOOLS[id] || null;
  }

  function list() {
    return Object.keys(TOOLS).map(function (k) {
      return TOOLS[k];
    });
  }

  function href(id, prefer) {
    var t = get(id);
    if (!t) return "/craft/";
    if (prefer && t[prefer]) return t[prefer];
    return t.href;
  }

  /** Future: register module upgrade hooks without cross-room imports */
  var upgrades = {};
  function onUpgrade(id, fn) {
    if (typeof fn === "function") upgrades[id] = fn;
  }
  function runUpgrade(id, ctx) {
    if (upgrades[id]) {
      try {
        upgrades[id](ctx || {});
      } catch (e) {}
    }
  }

  w.ClarityCraftRegistry = {
    version: "20261104C9",
    tools: TOOLS,
    get: get,
    list: list,
    href: href,
    onUpgrade: onUpgrade,
    runUpgrade: runUpgrade
  };
})(window);

/*! craft-meme-bench-logic-v1 · C18.3
 * Share/desks bench ALWAYS bottom.
 * Order: Message → Surprise → Scenery → Canvas → Scale → Desks
 */
(function (w, d) {
  "use strict";
  w.__CRAFT_MEME_BENCH_LOGIC_V1__ = "C18.3";

  function root() {
    return d.querySelector("main.craft-main") || d.querySelector("main") || d.body;
  }

  function isDesks(sec) {
    if (!sec) return false;
    if (sec.id === "desks" || (sec.classList && sec.classList.contains("desks-row"))) return true;
    var h = ((sec.querySelector && sec.querySelector("h2")) || {}).textContent || "";
    return /desk/i.test(h);
  }

  function rank(sec) {
    if (isDesks(sec)) return 100;
    if (sec.id === "meme-bench-flow") return 0;
    if (sec.id === "meme-full-surprise-pack") return 20;
    if (sec.querySelector && sec.querySelector("[data-meme-section]")) return 10;
    if (sec.querySelector && sec.querySelector("[data-meme-bg], .bg-chips")) return 30;
    if (sec.querySelector && sec.querySelector("#mr-root, #meme-export-png")) return 40;
    if (sec.id === "meme-ratio-section" || (sec.querySelector && sec.querySelector("[data-meme-ratio]"))) return 50;
    var h = ((sec.querySelector && sec.querySelector("h2")) || {}).textContent || "";
    h = h.toLowerCase();
    if (/surprise/.test(h)) return 20;
    if (/scenery|background/.test(h)) return 30;
    if (/canvas|export/.test(h)) return 40;
    if (/scale|ratio/.test(h)) return 50;
    if (/message|source/.test(h)) return 10;
    return 90;
  }

  function reorder() {
    var r = root();
    if (!r) return;
    var kids = Array.prototype.slice.call(r.children);
    var secs = kids.filter(function (el) {
      return el.matches && (el.matches("section.tool-section") || el.id === "meme-full-surprise-pack" || el.id === "meme-bench-flow");
    });
    if (secs.length < 2) {
      secs = Array.prototype.slice.call(d.querySelectorAll("main section.tool-section, #meme-full-surprise-pack, #meme-bench-flow"));
    }
    secs.sort(function (a, b) { return rank(a) - rank(b); });
    /* desks last */
    var desks = secs.filter(isDesks);
    var rest = secs.filter(function (s) { return !isDesks(s); });
    rest.concat(desks).forEach(function (sec) {
      try { r.appendChild(sec); } catch (e) {}
    });
  }

  function boot() { reorder(); }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 40);
    setTimeout(boot, 250);
    setTimeout(boot, 800);
  });
  setInterval(function () {
    var desks = d.getElementById("desks");
    var main = root();
    if (!desks || !main) return;
    var lastSec = null;
    var kids = main.querySelectorAll(":scope > section.tool-section, :scope > #meme-full-surprise-pack");
    if (kids.length) lastSec = kids[kids.length - 1];
    if (lastSec && lastSec !== desks && !isDesks(lastSec)) boot();
  }, 1500);
})(window, document);

/*! Amānah UFT · classic full-restore boost
 * Keeps linked pedigree viewport primary after unlock.
 * Educational only — not a legal pedigree · not a fatwa
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_CLASSIC_BOOST_V1__) return;
  w.__CLARITY_AMANA_UFT_CLASSIC_BOOST_V1__ = true;

  function isTree() {
    return /\/amana\/tree\/?/.test(location.pathname || "");
  }

  function boost() {
    if (!isTree()) return;
    /* Remove simplified rebuild roots if any linger */
    var clean = d.getElementById("uft-clean-root");
    if (clean) clean.remove();
    d.body.classList.remove("uft-clean-active");

    var stage = d.getElementById("uft-stage");
    var preview = d.getElementById("uft-preview");
    if (stage) {
      stage.style.minHeight = "16rem";
      stage.style.display = "";
      stage.hidden = false;
    }
    if (preview) {
      preview.style.minHeight = "12rem";
      preview.style.display = "";
      preview.hidden = false;
      preview.classList.add("uft-tree");
    }
    try {
      if (typeof w.uftLoad === "function") w.uftLoad();
    } catch (e) {}
    try {
      if (typeof w.uftRender === "function") w.uftRender({ keepScroll: true });
    } catch (e2) {}
    try {
      if (typeof w.uftRegRender === "function") w.uftRegRender();
    } catch (e3) {}
    try {
      if (typeof w.uftWorkspaceRefreshIntegrity === "function") w.uftWorkspaceRefreshIntegrity();
    } catch (e4) {}
  }

  function boot() {
    if (!isTree()) return;
    setTimeout(boost, 300);
    setTimeout(boost, 900);
    setTimeout(boost, 2000);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  d.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) setTimeout(boost, 250);
  });
})(window, document);

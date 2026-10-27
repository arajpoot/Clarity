/**
 * Shariah obliterate v1 — remove cross/church university glyphs sitewide
 * Educational only — not a fatwa.
 */
(function(g){
  "use strict";
  if(g.__CLARITY_SHARIAH_OBLITERATE_V1__) return;
  g.__CLARITY_SHARIAH_OBLITERATE_V1__ = true;

  var CAMPUS_URI = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%20%20%20%3Cdefs%3E%20%20%20%20%20%3CradialGradient%20id%3D%22g%22%20cx%3D%2240%25%22%20cy%3D%2230%25%22%20r%3D%2270%25%22%3E%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%230d3d5c%22%2F%3E%20%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%230a2540%22%2F%3E%20%20%20%20%20%3C%2FradialGradient%3E%20%20%20%20%20%3ClinearGradient%20id%3D%22gold%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%20%20%20%20%20%20%20%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23f0d78c%22%2F%3E%20%20%20%20%20%20%20%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23c9a227%22%2F%3E%20%20%20%20%20%3C%2FlinearGradient%3E%20%20%20%3C%2Fdefs%3E%20%20%20%3Ccircle%20cx%3D%2232%22%20cy%3D%2232%22%20r%3D%2230%22%20fill%3D%22url%28%23g%29%22%2F%3E%20%20%20%3Ccircle%20cx%3D%2232%22%20cy%3D%2232%22%20r%3D%2228.2%22%20fill%3D%22none%22%20stroke%3D%22url%28%23gold%29%22%20stroke-width%3D%222.2%22%2F%3E%20%20%20%3C%21--%20ground%20line%20--%3E%20%20%20%3Cpath%20d%3D%22M14%2050h36%22%20fill%3D%22none%22%20stroke%3D%22%23f5e6b8%22%20stroke-width%3D%221.6%22%20stroke-linecap%3D%22round%22%2F%3E%20%20%20%3C%21--%20main%20hall%20--%3E%20%20%20%3Cpath%20d%3D%22M20%2050V34h24v16%22%20fill%3D%22none%22%20stroke%3D%22%23f5e6b8%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%20%20%20%3C%21--%20onion%20dome%20%28arcs%29%20--%3E%20%20%20%3Cpath%20d%3D%22M20%2034c0-2%204-10%2012-10s12%208%2012%2010%22%20fill%3D%22none%22%20stroke%3D%22%23f5e6b8%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%2F%3E%20%20%20%3C%21--%20door%20--%3E%20%20%20%3Cpath%20d%3D%22M28%2050v-8h8v8%22%20fill%3D%22none%22%20stroke%3D%22%23f5e6b8%22%20stroke-width%3D%221.5%22%2F%3E%20%20%20%3C%21--%20minaret%20left%3A%20simple%20column%20%2B%20balcony%20ring%20%2B%20crescent%20%28open%20C%20shape%2C%20not%20cross%29%20--%3E%20%20%20%3Cpath%20d%3D%22M16%2050V22%22%20fill%3D%22none%22%20stroke%3D%22%23f5e6b8%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%2F%3E%20%20%20%3Cpath%20d%3D%22M13.5%2028h5%22%20fill%3D%22none%22%20stroke%3D%22%23f5e6b8%22%20stroke-width%3D%221.4%22%20stroke-linecap%3D%22round%22%2F%3E%20%20%20%3C%21--%20crescent%20only%3A%20open%20arc%2C%20opening%20to%20the%20right%20%E2%80%94%20NOT%20a%20plus%2Fcross%20--%3E%20%20%20%3Cpath%20d%3D%22M16%2016.5c-2.8.2-4.5%202.5-4.2%205.1%201.6-1.4%203.6-1.5%205-.3%22%20fill%3D%22none%22%20stroke%3D%22%23e8c65a%22%20stroke-width%3D%221.6%22%20stroke-linecap%3D%22round%22%2F%3E%20%3C%2Fsvg%3E";

  function forceCampusIcons(){
    document.querySelectorAll(".nuros-icon-campus, .nuros-plaque-campus").forEach(function(el){
      el.style.setProperty("background-image", 'url("'+CAMPUS_URI+'")', "important");
      el.style.setProperty("-webkit-mask-image", "none", "important");
      el.style.setProperty("mask-image", "none", "important");
      el.style.setProperty("background-color", "transparent", "important");
      el.style.setProperty("width", el.style.width || "2.55rem", "important");
      el.style.setProperty("height", el.style.height || "2.55rem", "important");
      el.style.setProperty("opacity", "1", "important");
      el.style.setProperty("visibility", "visible", "important");
    });
  }

  /* Remove emoji that read as church / cross / christian */
  var BAD = /[\u26EA\u271D\u2626\u2628\u271E]|⛪|✝️|✟|†|‡/g;
  function scrubText(root){
    if(!root) return;
    try{
      var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      var n;
      while((n = w.nextNode())){
        if(BAD.test(n.nodeValue||"")) n.nodeValue = (n.nodeValue||"").replace(BAD, "");
      }
    }catch(e){}
  }

  /* Human figure emoji off pedigree / companion chrome */
  var HUMAN = /[\u{1F466}-\u{1F478}\u{1F9D1}-\u{1F9DF}\u{1F46A}-\u{1F46D}\u{1F6B9}\u{1F6BA}]/gu;
  function scrubHuman(){
    try{
      document.querySelectorAll("#uft-root, .uft-tree, [class*='pedigree'], [class*='uft'], .dual-tile, #clarity-grave-path-strip").forEach(function(root){
        var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
        var n;
        while((n = w.nextNode())){
          if(HUMAN.test(n.nodeValue||"")) n.nodeValue = (n.nodeValue||"").replace(HUMAN, "");
        }
      });
    }catch(e){}
  }

  function boot(){
    forceCampusIcons();
    scrubText(document.body);
    scrubHuman();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  [200,800,1600,3000].forEach(function(ms){ setTimeout(boot, ms); });
  document.addEventListener("clarity:landing-ready", boot);
  document.addEventListener("clarity:companion-ready", boot);
})(typeof window !== "undefined" ? window : this);

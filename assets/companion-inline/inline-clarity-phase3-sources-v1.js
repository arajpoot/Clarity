/**
 * Phase 3 · Graded source reminder for meme/text surfaces
 */
(function(g){
  "use strict";
  if(g.__CLARITY_PHASE3_SOURCES__) return;
  g.__CLARITY_PHASE3_SOURCES__ = true;
  g.CLARITY_GRADED_HOSTS = [
    "api.quran.com", "cdn.islamic.network", "api.alquran.cloud",
    "sunnah.com", "api.sunnah.com", "quran.com"
  ];
  g.clarityIsGradedHost = function(url){
    try{
      var h = new URL(url, location.href).hostname.replace(/^www\./,"");
      return g.CLARITY_GRADED_HOSTS.some(function(x){ return h===x || h.endsWith("."+x); });
    }catch(e){ return false; }
  };
})(typeof window !== "undefined" ? window : this);

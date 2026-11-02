(function(){
"use strict";
if (window.__CLARITY_ONLINE_SITEWIDE_V1__) return;
window.__CLARITY_ONLINE_SITEWIDE_V1__ = true;

function reexport(names){
  names.forEach(function(n){
    try {
      if (typeof window[n] !== "function") {
        var fn = (0, eval)("typeof " + n + "!=='undefined'?" + n + ":null");
        if (typeof fn === "function") window[n] = fn;
      }
    } catch(e){}
  });
}

/** Israeliyat / deep panel — Wikipedia summary helper */
window.clarityIsraeliyatDeepFetch = window.clarityIsraeliyatDeepFetch || function(topic){
  topic = topic || "Isra'iliyyat";
  var host = document.getElementById("israeliyat-deep-host") || document.getElementById("israeliyat-online");
  if (host) host.textContent = "Fetching…";
  var title = encodeURIComponent(String(topic).replace(/\s+/g, "_"));
  fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + title, { mode: "cors" })
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(j){
      if (!j) throw new Error("empty");
      var extract = j.extract || "";
      var html = "<p>" + extract.replace(/</g,"") + "</p>";
      if (j.content_urls && j.content_urls.desktop)
        html += "<p><a href=\"" + j.content_urls.desktop.page + "\" target=\"_blank\" rel=\"noopener\">Source</a> · educational only</p>";
      if (host) host.innerHTML = html;
      return j;
    })
    .catch(function(){
      if (host) host.textContent = "Online summary unavailable — use local notes.";
    });
};

/** Soft-kick daily deep learn + online decks if hosts exist */
function kickOnline(){
  reexport([
    "clarityFetchDailyDeepLearn","fetchSeerahOnlineSummaries","enrichAsmaOnline",
    "fqFetchOnlineDeck","siqFetchOnlineBank","tdRefreshOnline","loadVerse","loadCommand",
    "memeFetchBg","clarityMemeDecorBg","memeLoadImageFromUrl"
  ]);
  try {
    var deep = document.getElementById("clarity-daily-deep");
    if (deep && !deep.dataset.onlineKicked && typeof clarityFetchDailyDeepLearn === "function") {
      deep.dataset.onlineKicked = "1";
      clarityFetchDailyDeepLearn();
    }
  } catch(e){}
}

if (document.readyState === "loading")
  document.addEventListener("DOMContentLoaded", function(){ setTimeout(kickOnline, 800); });
else setTimeout(kickOnline, 800);
window.addEventListener("load", function(){ setTimeout(kickOnline, 1500); });
})();
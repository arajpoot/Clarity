
(function(){
"use strict";
if (window.__CLARITY_MEME_ONLINE_BG_V2__) return;
window.__CLARITY_MEME_ONLINE_BG_V2__ = true;
window.__CLARITY_MEME_ONLINE_BG_V1__ = true;

if (!window.MEME_BG_POOLS) window.MEME_BG_POOLS = {nature:[],flowers:[],holy:[],spirit:[],free:[],night:[],water:[],flickr:[],decor:[],pattern:[]};
if (!window.memeBgIdx) window.memeBgIdx = {};
window._memeOnlineCache = window._memeOnlineCache || {};

var FLICKR_NSID = "10446967@N05"; /* public collection flickr.com/photos/ayyaz/ — not shown in UI label */

function status(msg){
  try { if (typeof memeFetchStatus === "function") memeFetchStatus(msg); } catch(e){}
  var el = document.getElementById("meme-fetch-status");
  if (el) el.textContent = msg || "";
}
function bump(kind){
  if (typeof memeBgIdx[kind] !== "number") memeBgIdx[kind] = -1;
  memeBgIdx[kind]++;
  return memeBgIdx[kind];
}
function pick(arr, kind){
  if (!arr || !arr.length) return null;
  return arr[bump(kind) % arr.length];
}
function loadImg(url, failMsg){
  if (!url) { status(failMsg || "No URL"); return; }
  status("Loading…");
  if (typeof memeLoadImageFromUrl === "function") {
    memeLoadImageFromUrl(url, failMsg || "Could not load — try another");
    status("Background ready");
    return;
  }
  var im = new Image();
  im.crossOrigin = "anonymous";
  im.onload = function(){
    try {
      if (typeof memeState !== "undefined") memeState.img = im;
      if (window.memeState) window.memeState.img = im;
      if (typeof memeDraw === "function") memeDraw();
    } catch(e){}
    status("Background ready");
  };
  im.onerror = function(){ status(failMsg || "Load failed"); };
  im.src = url;
}
function flickrLarge(u){
  return String(u||"").replace(/_m\.jpg/i,"_b.jpg").replace(/_s\.jpg/i,"_b.jpg").replace(/_t\.jpg/i,"_z.jpg");
}
var BAD = /\b(portrait|people|person|woman|man|girl|boy|face|selfie|fashion|nude|bikini|party|crowd|child|baby|lingerie|alcohol|wine|beer|idol|statue|gambling|casino|porn)\b/i;
var OK = /\b(nature|landscape|mountain|sky|cloud|forest|tree|flower|garden|water|sea|ocean|river|lake|mosque|architecture|pattern|geometry|tile|islamic|ornament|arabesque)\b/i;

function fetchFlickrFeed(cb){
  if (window._memeOnlineCache.flickr && window._memeOnlineCache.flickr.length) {
    cb(null, window._memeOnlineCache.flickr); return;
  }
  var cbName = "__flickrMemeCb" + Date.now();
  var done = false;
  window[cbName] = function(feed){
    done = true;
    try { delete window[cbName]; } catch(e){}
    var urls = [];
    (feed && feed.items || []).forEach(function(it){
      if (!it || !it.media || !it.media.m) return;
      var blob = ((it.title||"")+" "+(it.tags||"")+" "+(it.description||"")).toLowerCase();
      if (BAD.test(blob)) return;
      urls.push(flickrLarge(it.media.m));
    });
    if (!urls.length && feed && feed.items) {
      urls = feed.items.map(function(it){
        if (!it||!it.media||!it.media.m) return null;
        var blob = ((it.title||"")+" "+(it.tags||"")).toLowerCase();
        if (BAD.test(blob)) return null;
        return flickrLarge(it.media.m);
      }).filter(Boolean);
    }
    window._memeOnlineCache.flickr = urls;
    MEME_BG_POOLS.flickr = urls;
    MEME_BG_POOLS.free = (MEME_BG_POOLS.free || []).concat(urls);
    cb(null, urls);
  };
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.flickr.com/services/feeds/photos_public.gne?id=" + encodeURIComponent(FLICKR_NSID) + "&format=json&jsoncallback=" + cbName;
  s.onerror = function(){ if (!done) { done = true; cb(new Error("flickr blocked")); } try{s.remove();}catch(e){} };
  document.head.appendChild(s);
  setTimeout(function(){ if (!done) { done = true; cb(new Error("flickr timeout")); } }, 10000);
}

function fetchCommons(query, cb){
  var key = "c:" + query;
  if (window._memeOnlineCache[key] && window._memeOnlineCache[key].length) {
    cb(null, window._memeOnlineCache[key]); return;
  }
  var api = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=" +
    encodeURIComponent(query) + "&gsrnamespace=6&gsrlimit=30&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json&origin=*";
  fetch(api, { mode: "cors" }).then(function(r){
    if (!r.ok) throw new Error("HTTP "+r.status);
    return r.json();
  }).then(function(json){
    var pages = (json && json.query && json.query.pages) || {};
    var urls = [];
    Object.keys(pages).forEach(function(id){
      var ii = pages[id].imageinfo && pages[id].imageinfo[0];
      var u = ii && (ii.thumburl || ii.url);
      if (u && /\.(jpe?g|png|webp)/i.test(u)) urls.push(u);
    });
    window._memeOnlineCache[key] = urls;
    cb(null, urls);
  }).catch(function(e){ cb(e); });
}

function picsum(kind){
  var n = (Date.now() + (memeBgIdx[kind]||0)*19) % 2000;
  return "https://picsum.photos/seed/clarity-" + kind + "-" + n + "/1200/900.jpg";
}

var QUERIES = {
  nature: "landscape OR mountain OR forest -people -portrait",
  flowers: "flower OR blossom OR garden -people",
  holy: "mosque OR minaret OR \"islamic architecture\" -people",
  spirit: "sky OR clouds OR horizon OR sunrise -people",
  night: "\"night sky\" OR stars OR moonlight -people",
  water: "waterfall OR ocean OR river OR lake -people",
  free: "nature OR landscape OR architecture -people",
  dynamic: "landscape OR abstract -people",
  decor: "mosque OR \"islamic art\" OR arabesque OR \"geometric pattern\" islamic -people",
  pattern: "\"geometric pattern\" OR arabesque OR \"islamic tile\" OR zellige -people"
};

function trySources(kind, sources, idx){
  idx = idx || 0;
  if (idx >= sources.length) {
    status("All sources failed — try Blank");
    return;
  }
  var step = sources[idx];
  step(function(err, url){
    if (url) { loadImg(url); return; }
    trySources(kind, sources, idx + 1);
  });
}

window.__memeOnlineFetch = function(kind){
  try {
    kind = String(kind || "nature").toLowerCase();
    if (kind === "blank") {
      if (typeof memeShowBlankPalette === "function") memeShowBlankPalette();
      return;
    }
    if (kind === "ayyaz") kind = "flickr";
    if (kind === "stock" || kind === "commons" || kind === "online" || kind === "freephotos") kind = "free";

    status("Fetching " + kind + "…");
    var q = QUERIES[kind] || QUERIES.nature;

    var sources = [];

    if (kind === "flickr") {
      sources.push(function(done){
        status("Flickr public stream…");
        fetchFlickrFeed(function(err, urls){
          done(err, pick(urls, "flickr"));
        });
      });
      sources.push(function(done){
        fetchCommons(QUERIES.nature, function(err, urls){ done(err, pick(urls, "nature")); });
      });
      sources.push(function(done){ done(null, picsum("nature")); });
    } else if (kind === "free") {
      sources.push(function(done){
        fetchFlickrFeed(function(err, urls){ done(err, pick(urls, "flickr")); });
      });
      sources.push(function(done){
        fetchCommons(q, function(err, urls){ done(err, pick(urls, "free")); });
      });
      sources.push(function(done){ done(null, picsum("free")); });
    } else {
      sources.push(function(done){
        fetchCommons(q, function(err, urls){
          if (urls && urls.length) status("Wikimedia · " + kind);
          done(err, pick(urls, kind));
        });
      });
      if (kind === "nature" || kind === "holy" || kind === "decor" || kind === "pattern") {
        sources.push(function(done){
          fetchFlickrFeed(function(err, urls){ done(err, pick(urls, "flickr")); });
        });
      }
      sources.push(function(done){ status("Picsum · " + kind); done(null, picsum(kind)); });
    }

    trySources(kind, sources, 0);
  } catch(e){
    console.warn("memeFetchBg", e);
    loadImg(picsum(kind || "nature"));
  }
};

window.memeFetchBg = window.__memeOnlineFetch;
window.memeFetchNature = function(){ window.memeFetchBg("nature"); };
window.memeFetchFlickr = function(){ window.memeFetchBg("flickr"); };

/** Islamic décor & geometric patterns — online Commons + Flickr + Picsum */
window.clarityMemeDecorBg = function(mode){
  mode = String(mode || "mosque").toLowerCase();
  var kind = (mode === "geometry" || mode === "pattern" || mode === "tile") ? "pattern" : "decor";
  status("Islamic " + kind + "…");
  window.memeFetchBg(kind);
};

/* Pre-warm Flickr when idle (optional) */
try {
  if (typeof requestIdleCallback === "function")
    requestIdleCallback(function(){ fetchFlickrFeed(function(){}); }, { timeout: 9000 });
  else setTimeout(function(){ fetchFlickrFeed(function(){}); }, 5000);
} catch(e){}
})();

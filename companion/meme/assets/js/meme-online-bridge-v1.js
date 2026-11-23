/*! meme-online-bridge-v1 · CM4 wire online-bg → owner paint */
(function(w,d){
  "use strict";
  if (w.__MEME_ONLINE_BRIDGE_V1__) return;
  w.__MEME_ONLINE_BRIDGE_V1__ = true;
  var last = null;
  setInterval(function(){
    try {
      var s = w.memeState;
      if (!s || !s.img) return;
      if (s.img === last) return;
      last = s.img;
      s.bgImage = s.img;
      if (typeof w.ClarityMemeOwnerPaint === "function") w.ClarityMemeOwnerPaint();
      /* owner uses schedulePaint closed — dispatch event */
      d.dispatchEvent(new CustomEvent("meme-bg-ready"));
      var st = d.getElementById("meme-status");
      if (st && /Online scenery|Loading/i.test(st.textContent||"")) st.textContent = "Background ready";
      var fs = d.getElementById("meme-fetch-status");
      if (fs) fs.textContent = "Online scenery ready";
    } catch(e){}
  }, 400);
})(window, document);

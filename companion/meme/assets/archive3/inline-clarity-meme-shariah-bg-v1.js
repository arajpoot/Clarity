/**
 * Phase 1 · Meme background Shariah lock
 * Block picsum, open Flickr, Eiffel fallbacks; use geometric / safe gradients only
 */
(function(g){
  "use strict";
  if(g.__CLARITY_MEME_SHARIAH_BG__) return;
  g.__CLARITY_MEME_SHARIAH_BG__ = true;

  var BLOCK = [
    /picsum\.photos/i,
    /flickr\.com/i,
    /loremflickr/i,
    /placeholder\.com/i,
    /via\.placeholder/i,
    /Tour_Eiffel/i,
    /eiffel/i
  ];
  var ALLOW_HINT = /wikimedia\.org|upload\.wikimedia/i;

  function blocked(url){
    url = String(url||"");
    for(var i=0;i<BLOCK.length;i++) if(BLOCK[i].test(url)) return true;
    return false;
  }

  /* Safe default: deep green geometric gradient as data URI canvas style */
  function safeGradient(){
    return "linear-gradient(145deg, #0b3d32 0%, #145a42 40%, #0a2f4a 100%)";
  }

  /* Patch fetch */
  if(g.fetch){
    var _fetch = g.fetch.bind(g);
    g.fetch = function(input, init){
      var url = typeof input === "string" ? input : (input && input.url) || "";
      if(blocked(url)){
        return Promise.reject(new Error("[Clarity Shariah] blocked meme bg host: "+url.split("?")[0]));
      }
      return _fetch(input, init);
    };
  }

  /* Patch Image src assignment patterns used by meme studio */
  function hardenImg(img){
    if(!img) return;
    try{
      var desc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
      if(desc && desc.set && !HTMLImageElement.prototype.__claritySrcLock){
        HTMLImageElement.prototype.__claritySrcLock = true;
        Object.defineProperty(HTMLImageElement.prototype, "src", {
          configurable: true,
          get: function(){ return desc.get.call(this); },
          set: function(v){
            if(blocked(v)){
              this.setAttribute("data-clarity-blocked-src", String(v).slice(0,120));
              this.style.background = safeGradient();
              this.removeAttribute("src");
              return;
            }
            desc.set.call(this, v);
          }
        });
      }
    }catch(e){}
  }
  hardenImg();

  /* Expose safe bg helper for studio */
  g.clarityMemeSafeBackground = function(canvas, ctx){
    if(!ctx || !canvas) return;
    var grd = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    grd.addColorStop(0, "#0b3d32");
    grd.addColorStop(0.45, "#145a42");
    grd.addColorStop(1, "#0a2f4a");
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    // soft geometric arcs (architecture cue, no figures)
    ctx.strokeStyle = "rgba(232,198,90,0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(canvas.width*0.5, canvas.height*0.85, canvas.width*0.35, Math.PI, 0);
    ctx.stroke();
  };

  console.info("[Clarity Shariah] meme background lock active (no picsum/flickr/eiffel)");
})(typeof window !== "undefined" ? window : this);

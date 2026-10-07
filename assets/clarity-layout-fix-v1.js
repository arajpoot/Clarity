
(function(w){"use strict";if(w.__CLARITY_LAYOUT_FIX_V4__)return;w.__CLARITY_LAYOUT_FIX_V4__=!0;var VER="20261006FD";
function isDesktop(){try{return w.matchMedia&&w.matchMedia("(min-width:701px)").matches}catch(e){return!1}}
function measure(){try{
  var nav=document.getElementById("clarity-global-nav"),duo=document.getElementById("clarity-top-duo");
  var h=48;if(nav)h=Math.max(40,Math.round(nav.getBoundingClientRect().height))||48;
  document.documentElement.style.setProperty("--clarity-nav-h",h+"px");
  if(!isDesktop()){document.documentElement.style.setProperty("--clarity-chrome-h","0px");return}
  var stack=h;if(duo)stack+=Math.round(duo.getBoundingClientRect().height)||0;
  document.documentElement.style.setProperty("--clarity-chrome-h",stack+"px");
}catch(e){}}
var t=null;function schedule(){if(t)clearTimeout(t);t=setTimeout(function(){t=null;measure()},40)}
function bind(){measure();w.addEventListener("resize",schedule,{passive:!0});
w.addEventListener("orientationchange",function(){measure();setTimeout(measure,100);setTimeout(measure,400)});
if(w.visualViewport)w.visualViewport.addEventListener("resize",schedule,{passive:!0});
try{var mq=w.matchMedia("(min-width:701px)");if(mq.addEventListener)mq.addEventListener("change",schedule);else if(mq.addListener)mq.addListener(schedule)}catch(e){}
setTimeout(measure,200);setTimeout(measure,800);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(schedule).catch(function(){})}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind);else bind();
w.ClarityLayoutFix={version:VER,measure:measure}})(typeof window!=="undefined"?window:this);

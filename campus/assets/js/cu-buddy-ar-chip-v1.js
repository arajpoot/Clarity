
(function(){
  function addChip(){
    var row=document.querySelector(".cu-buddy-chips");
    if(!row||row.querySelector("[data-ar-day]")) return;
    var b=document.createElement("button");
    b.type="button";
    b.setAttribute("data-ar-day","1");
    b.textContent="Drill today's Arabic";
    b.onclick=function(){ location.href="/lab/arabic/?pack=day&mode=listen"; };
    row.appendChild(b);
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", addChip);
  else addChip();
})();

/**
 * Map stream — soft admit into slot; avoid stacking welcome plaques
 */
(function(){
  function moveSoftAdmit(){
    var slot=document.getElementById("cu-soft-admit-slot");
    var soft=document.getElementById("cu-soft-admit");
    if(slot&&soft&&soft.parentNode!==slot){
      slot.appendChild(soft);
      soft.style.margin="0 0 .75rem";
    }
  }
  /* Remove legacy plaque hosts if empty scripts filled them with noise */
  function trimNoise(){
    ["cu-welcome-back","cu-spine-strip","cu-study-circle"].forEach(function(id){
      var el=document.getElementById(id);
      if(el&&!(el.textContent||"").trim()) el.remove();
    });
  }
  setTimeout(function(){ moveSoftAdmit(); trimNoise(); }, 100);
  setTimeout(function(){ moveSoftAdmit(); trimNoise(); }, 500);
})();

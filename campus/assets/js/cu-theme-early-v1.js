/* 20261023HK2 */
/* 20261023CLEAN cleanse */
/**
 * University theme + iOS fast path
 * Prefer stored Day/Night; default light on first campus visit if unset.
 */
(function(){
  try{
    var k='cu_uni_theme_v1';
    var t=localStorage.getItem(k);
    if(!t){
      try{ t=localStorage.getItem('clarity_theme')||localStorage.getItem('theme'); }catch(e){}
    }
    if(!t || t==='system'){
      /* iPhone lag + dark sections: default campus to light unless user chose night */
      var night=window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches;
      t = localStorage.getItem(k) || (night ? 'system' : 'light');
      if(!localStorage.getItem(k)) t='light';
    }
    if(t==='day') t='light';
    if(t==='night') t='dark';
    document.documentElement.setAttribute('data-theme', t==='system'?'system':t);
    if(t==='light') document.documentElement.style.colorScheme='light';
    if(t==='dark') document.documentElement.style.colorScheme='dark';
  }catch(e){}
})();

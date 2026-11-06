/*! companion-frag-inline-v1 · extracted inline scripts from body fragment */
/* frag-inline-0 */
try {

(function(){
  try {
    var ta=document.getElementById("notes-local-scratch");
    var st=document.getElementById("notes-scratch-status");
    if(!ta) return;
    var K="clarity_notes_scratch_v1";
    ta.value=localStorage.getItem(K)||"";
    ta.addEventListener("input",function(){
      localStorage.setItem(K, ta.value);
      if(st) st.textContent="Saved on this device · "+new Date().toLocaleTimeString();
    });
  } catch(e){}
})();

} catch (e) { console.warn("frag-inline", e); }

;
/* frag-inline-1 */
try {

/*! Companion Phases 2–4 · landing sequence lock · campus untouched · educational only */
(function(){
  'use strict';
  var LOG = [];
  function log(m){ try{ LOG.push(m); }catch(e){} }
  window.__COMPANION_PHASE_LOG = LOG;

  // Phase 1: global error trap for smoke
  window.addEventListener('error', function(ev){
    log('ERR ' + (ev.message||'') + ' @ ' + (ev.filename||'') + ':' + (ev.lineno||''));
  });
  window.addEventListener('unhandledrejection', function(ev){
    log('REJ ' + (ev.reason && ev.reason.message ? ev.reason.message : String(ev.reason)));
  });

  function qs(s, r){ return (r||document).querySelector(s); }
  function qsa(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); }

  /** Phase 2: verify data-landing order pulse → adhkar → paths (pill in shell) */
  function lockLandingSequence(){
    try {
      var pulse = qs('[data-landing="pulse"]');
      var adh = qs('[data-landing="adhkar"]');
      var paths = qs('[data-landing="paths"]');
      var pill = qs('[data-landing="pill"]');
      log('markers pulse='+!!pulse+' adhkar='+!!adh+' paths='+!!paths+' pill='+!!pill);
      if(pulse && adh && paths){
        var ok = pulse.compareDocumentPosition(adh) & Node.DOCUMENT_POSITION_FOLLOWING;
        var ok2 = adh.compareDocumentPosition(paths) & Node.DOCUMENT_POSITION_FOLLOWING;
        if(ok && ok2){
          document.documentElement.classList.add('companion-landing-ok');
          log('landing: LOCKED order verified pulse→adhkar→paths');
        } else {
          document.documentElement.classList.add('companion-landing-order-fail');
          log('landing: order FAIL');
        }
      }
      qsa('a').forEach(function(a){
        if(/University path/i.test(a.textContent||'')) log('uni href='+(a.getAttribute('href')||''));
      });
    } catch(e){ log('landing lock fail '+e.message); }
  }

  /** Phase 3: deep-learn footer on hadith-ish cards missing grade */
  function deepLearnPass(){
    var cards = qsa('[class*="hadith"], [data-hadith], .hadith-card, [class*="reward"]');
    cards.forEach(function(card){
      if(card.querySelector('.deep-learn-foot')) return;
      var t = card.textContent||'';
      if(!/Muslim|Bukh[aā]r|Tirmidh|Ab[uū] D[aā]w|Nas[aā]|Ibn M[aā]jah|Qur.?[aā]n/i.test(t)) return;
      var foot = document.createElement('div');
      foot.className = 'deep-learn-foot';
      foot.innerHTML = '<span class="dl-note">Educational · verify sources</span> · <a href="https://sunnah.com" target="_blank" rel="noopener">Sunnah.com</a> · <a href="https://quran.com" target="_blank" rel="noopener">Quran.com</a>';
      card.appendChild(foot);
    });
    log('deep-learn footers applied');
  }

  /** Phase 4: UI helpers — reduce FAB collision on small screens */
  function uiPolish(){
    document.documentElement.classList.add('companion-phase-ui');
    // mark package version
    var meta = document.querySelector('meta[name="companion-phase-build"]');
    if(meta) meta.setAttribute('content', '0-6-smoked-20261025');
  }

  function run(){
    lockLandingSequence();
    deepLearnPass();
    uiPolish();
    try {
      var land = qs('#clarity-day-landing');
      if(land){
        land.style.maxHeight = 'none';
        land.style.overflow = 'visible';
        qsa('.cdl-card, .cdl-oath, .cdl-expand-card, .cdl-hero, .dual-tiles', land).forEach(function(el){
          el.style.display = '';
          el.hidden = false;
        });
        log('landing study cards visible count='+qsa('.cdl-card', land).length);
      }
      /* Companion / Reminder hubs stay off day landing — open via path tiles */
      log('IA: day landing stops at oath+study; companion via path tiles');
    } catch(e){ log('restore fail '+e.message); }
    log('phase controller ready');
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
  // second pass after late paint
  setTimeout(run, 1200);
})();

} catch (e) { console.warn("frag-inline", e); }

;
/* frag-inline-2 */
try {

{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Clarity – Furnish Your Grave",
      "alternateName": ["NurOS Clarity", "Clarity Dawah"],
      "url": "https://clarity-dawah.fyi/",
      "description": "Private local-first Islamic educational companion with a progressive path: Seeker, New Muslim, Daily Muslim, Aspiring Da'i. Qur'an, authentic Hadith, character, and daily deeds to prepare the heart and the long stay. Educational only — not a fatwa service.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Any",
      "browserRequirements": "Requires JavaScript",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "inLanguage": ["en", "ar"],
      "isAccessibleForFree": true,
      "author": { "@type": "Organization", "name": "Clarity", "url": "https://clarity-dawah.fyi/" },
      "publisher": { "@type": "Organization", "name": "Clarity", "url": "https://clarity-dawah.fyi/" }
    },
    {
      "@type": "WebSite",
      "name": "Clarity",
      "url": "https://clarity-dawah.fyi/",
      "description": "Islamic educational companion — furnish your grave with sincere deeds, knowledge, and character.",
      "inLanguage": "en",
      "publisher": { "@type": "Organization", "name": "Clarity" }
    },
    {
      "@type": "Organization",
      "name": "Clarity",
      "url": "https://clarity-dawah.fyi/",
      "description": "Educational Islamic resources only — not a fatwa service."
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://clarity-dawah.fyi/" },
        { "@type": "ListItem", "position": 2, "name": "Seeker path", "item": "https://clarity-dawah.fyi/#path-seeker" },
        { "@type": "ListItem", "position": 3, "name": "New Muslim foundations", "item": "https://clarity-dawah.fyi/#path-new-muslim" },
        { "@type": "ListItem", "position": 4, "name": "Daily Muslim craft", "item": "https://clarity-dawah.fyi/#path-daily" },
        { "@type": "ListItem", "position": 5, "name": "Aspiring Da'i", "item": "https://clarity-dawah.fyi/#path-dai" }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is Clarity a fatwa service?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Clarity is an educational companion only. Personal rulings should be sought from a qualified local scholar."
          }
        },
        {
          "@type": "Question",
          "name": "What is the Furnish Your Grave learning path?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A progressive educational track: Seeker (wake the heart), New Muslim (establish prayer and pillars), Daily Muslim (craft and consistency), and Aspiring Da'i (transmit with adab). It is inspired by the hadith that deeds end at death except ongoing charity, beneficial knowledge, and a righteous child who prays for the deceased."
          }
        },
        {
          "@type": "Question",
          "name": "Is my data private?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Clarity is local-first. Family tree and personal notes are stored on your device. Educational tools are not a substitute for professional or scholarly advice."
          }
        }
      ]
    }
  ]
}

} catch (e) { console.warn("frag-inline", e); }

;
/* frag-inline-3 */
try {

{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Clarity – Furnish Your Grave",
      "alternateName": "NurOS Clarity",
      "url": "https://clarity-dawah.fyi/",
      "description": "Private local-first Islamic companion for preparing the heart and the grave with Qur’an, authentic Hadith, character lessons and daily deeds. Educational only — not a fatwa service.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Any",
      "browserRequirements": "Requires JavaScript",
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
      "inLanguage": "en",
      "isAccessibleForFree": true,
      "author": { "@type": "Organization", "name": "Clarity", "url": "https://clarity-dawah.fyi/" }
    },
    {
      "@type": "WebSite",
      "name": "Clarity",
      "url": "https://clarity-dawah.fyi/",
      "description": "Islamic educational companion and legacy path resources.",
      "publisher": { "@type": "Organization", "name": "Clarity" },
      "inLanguage": "en"
    },
    {
      "@type": "Organization",
      "name": "Clarity",
      "url": "https://clarity-dawah.fyi/",
      "description": "Educational Islamic resources — not a fatwa service."
    }
  ]
}

} catch (e) { console.warn("frag-inline", e); }

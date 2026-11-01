/*! companion fortify 20261101WB1 */
(function(){"use strict";
if(window.__CLARITY_VAULT_FORTRESS_BOOT__)return;
window.__CLARITY_VAULT_FORTRESS_BOOT__=true;
var VER="20261101WB1",BASE="/companion/sealed/";
var scripts=["runtime-gate-v1.js","facade-v1.js","isolate-guard-v1.js","digest-v1.js","export-host-v1.js","digest-panel-v1.js","dayn-section-bridge-v2.js","dayn-mount-adapter-v1.js","dayn-ledger-v2.js","dayn-enrich-v3.js","dayn-ensure-s45.js","passphrase-tutorial-v1.js"];
function loadOne(n){return new Promise(function(res,rej){var s=document.createElement("script");s.src=BASE+n+"?v="+VER;s.defer=true;s.onload=function(){res(n)};s.onerror=function(){rej(new Error(n))};document.head.appendChild(s);});}
function run(){var c=Promise.resolve();scripts.forEach(function(n){c=c.then(function(){return loadOne(n);});});c.then(function(){try{console.info("[Companion]",VER);}catch(e){}}).catch(function(e){try{console.warn(e);}catch(x){}});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",run);else run();
})();

/*! amana-fortify-boot minimal H2 */
(function(w){
  "use strict";
  if (w.__CLARITY_VAULT_FORTRESS_BOOT_A3__) return;
  w.__CLARITY_VAULT_FORTRESS_BOOT_A3__ = true;
  w.ClarityLoadAmanaSealed = function(){ return Promise.resolve("ready"); };
  w.ClarityEnterAmana = function(){ return w.ClarityLoadAmanaSealed(); };
})(window);

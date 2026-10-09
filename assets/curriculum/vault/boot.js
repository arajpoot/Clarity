/* Clarity University VAULT BOOT — sealed administrator block
 * Only public entry for the curriculum form factor.
 * Verifies SEAL.json hashes, loads foundation in order, freezes APIs.
 * Future upgrades should NOT replace foundation/* — only load after vault.
 * Educational isolation — not a security boundary against determined attackers.
 */
(function (g) {
  "use strict";
  if (g.__CLARITY_VAULT_BOOT__) return;
  g.__CLARITY_VAULT_BOOT__ = true;

  var VAULT_BASE = "./assets/curriculum/vault/";
  var STATUS = { sealed: false, verified: false, breaches: [], version: null };

  function log() {
    try {
      var args = ["%c Clarity Vault ", "background:#1a0f08;color:#d4b45a;font-weight:bold;padding:2px 6px"];
      for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
      console.info.apply(console, args);
    } catch (e) {}
  }

  function sha256Hex(buf) {
    if (!g.crypto || !g.crypto.subtle) return Promise.resolve(null);
    return g.crypto.subtle.digest("SHA-256", buf).then(function (dig) {
      var a = new Uint8Array(dig);
      var s = "";
      for (var i = 0; i < a.length; i++) s += ("0" + a[i].toString(16)).slice(-2);
      return s;
    });
  }

  function fetchText(url) {
    return fetch(url, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("vault fetch " + url);
      return r.text();
    });
  }

  function fetchBuf(url) {
    return fetch(url, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("vault fetch " + url);
      return r.arrayBuffer();
    });
  }

  function loadScriptText(url, text) {
    return new Promise(function (resolve, reject) {
      try {
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.dataset.clarityVault = "1";
        s.dataset.vaultSrc = url;
        s.text = text;
        s.onload = function () {
          resolve();
        };
        /* inline scripts execute immediately when inserted */
        document.head.appendChild(s);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  function loadCss(url) {
    return new Promise(function (resolve) {
      var l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = url;
      l.dataset.clarityVault = "1";
      l.onload = function () {
        resolve();
      };
      l.onerror = function () {
        resolve();
      };
      document.head.appendChild(l);
    });
  }

  function freezeDeep(obj, name) {
    if (!obj || (typeof obj !== "object" && typeof obj !== "function")) return;
    try {
      Object.freeze(obj);
    } catch (e) {}
    try {
      if (name && name in g) {
        Object.defineProperty(g, name, {
          value: g[name],
          writable: false,
          configurable: false
        });
      }
    } catch (e2) {
      STATUS.breaches.push("freeze-fail:" + name);
    }
  }

  function sealApis(list) {
    (list || []).forEach(function (name) {
      if (typeof g[name] !== "undefined") freezeDeep(g[name], name);
    });
    /* Freeze key nested APIs */
    try {
      if (g.ClarityCurriculumEngine) Object.freeze(g.ClarityCurriculumEngine);
      if (g.ClarityUniversity) Object.freeze(g.ClarityUniversity);
      if (g.ClarityAdminOffice) Object.freeze(g.ClarityAdminOffice);
    } catch (e) {}
    STATUS.sealed = true;
    try {
      g.__CLARITY_VAULT_SEALED__ = true;
      Object.defineProperty(g, "__CLARITY_VAULT_SEALED__", {
        value: true,
        writable: false,
        configurable: false
      });
    } catch (e3) {}
    log("APIs frozen — foundation isolated from casual overwrite");
  }

  function verifyAndLoad(seal) {
    STATUS.version = seal.version;
    var files = seal.foundationOrder || [];
    var styles = seal.styles || [];
    var expected = seal.sha256 || {};
    var chain = Promise.resolve();

    styles.forEach(function (rel) {
      chain = chain.then(function () {
        return loadCss(VAULT_BASE + rel + "?v=" + encodeURIComponent(seal.build || "vault"));
      });
    });

    files.forEach(function (rel) {
      chain = chain.then(function () {
        var url = VAULT_BASE + rel + "?v=" + encodeURIComponent(seal.build || "vault");
        return fetchBuf(url).then(function (buf) {
          return sha256Hex(buf).then(function (hex) {
            var want = expected[rel];
            if (want && hex && want !== hex) {
              STATUS.breaches.push(rel);
              log("INTEGRITY ALERT", rel, "expected", want.slice(0, 12), "got", hex.slice(0, 12));
              /* still load but mark breach — educational warning */
              showBreachBanner(rel);
            } else if (want && hex) {
              log("ok", rel.split("/").pop(), hex.slice(0, 10));
            }
            var text = new TextDecoder().decode(buf);
            return loadScriptText(url, text);
          });
        });
      });
    });

    return chain.then(function () {
      STATUS.verified = STATUS.breaches.length === 0;
      sealApis(seal.freezeApis);
      try {
        g.dispatchEvent(
          new CustomEvent("clarity-vault-ready", {
            detail: { status: STATUS, seal: { version: seal.version, build: seal.build } }
          })
        );
      } catch (e) {}
      log(
        STATUS.verified ? "Vault verified & sealed" : "Vault loaded with integrity warnings",
        seal.version
      );
      injectVaultBadge(seal);
    });
  }

  function showBreachBanner(rel) {
    try {
      if (document.getElementById("clarity-vault-breach")) return;
      var b = document.createElement("div");
      b.id = "clarity-vault-breach";
      b.setAttribute(
        "style",
        "position:fixed;bottom:72px;left:50%;transform:translateX(-50%);z-index:100100;background:#4a1515;color:#fde8e8;padding:0.5rem 0.9rem;border-radius:10px;font-size:0.78rem;max-width:90vw;box-shadow:0 8px 24px rgba(0,0,0,.4)"
      );
      b.textContent =
        "Vault integrity warning: " +
        (rel || "file") +
        " does not match SEAL. Learning records still local — re-deploy sealed package if unexpected.";
      document.body.appendChild(b);
      setTimeout(function () {
        try {
          b.remove();
        } catch (e) {}
      }, 8000);
    } catch (e) {}
  }

  function injectVaultBadge(seal) {
    if (document.getElementById("clarity-vault-badge")) return;
    var el = document.createElement("button");
    el.type = "button";
    el.id = "clarity-vault-badge";
    el.title = "Sealed university vault " + (seal.version || "");
    el.textContent = "⊡ Vault";
    el.setAttribute(
      "style",
      "position:fixed;bottom:12px;left:12px;z-index:99990;font-size:0.68rem;font-weight:700;padding:0.25rem 0.55rem;border-radius:999px;border:1px solid rgba(212,180,90,0.55);background:rgba(15,20,18,0.92);color:#d4b45a;cursor:pointer;letter-spacing:0.04em"
    );
    el.onclick = function () {
      var msg =
        "Clarity University Vault\n" +
        "Version: " +
        (STATUS.version || "?") +
        "\n" +
        "Verified: " +
        STATUS.verified +
        "\n" +
        "Sealed: " +
        STATUS.sealed +
        "\n" +
        "Breaches: " +
        (STATUS.breaches.length ? STATUS.breaches.join(", ") : "none") +
        "\n\n" +
        (seal.motto || "") +
        "\n\nFoundation is isolated. Future site upgrades should not overwrite curriculum/vault/foundation/.";
      alert(msg);
      if (g.ClarityAdminOffice && g.ClarityAdminOffice.open) {
        try {
          g.ClarityAdminOffice.open();
        } catch (e) {}
      }
    };
    document.body.appendChild(el);
  }

  /** Guard: refuse re-definition of vault scripts from outside */
  g.clarityVaultGuard = function (apiName) {
    if (g.__CLARITY_VAULT_SEALED__ && apiName && apiName in g) {
      log("blocked overwrite attempt:", apiName);
      STATUS.breaches.push("overwrite:" + apiName);
      return false;
    }
    return true;
  };

  g.ClarityVault = {
    status: function () {
      return STATUS;
    },
    base: VAULT_BASE
  };

  function start() {
    fetchText(VAULT_BASE + "SEAL.json?v=" + Date.now())
      .then(function (t) {
        var seal = JSON.parse(t);
        return verifyAndLoad(seal);
      })
      .catch(function (err) {
        log("Vault SEAL missing or unreadable — foundation not loaded", err && err.message);
        showBreachBanner("SEAL.json");
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})(typeof window !== "undefined" ? window : this);

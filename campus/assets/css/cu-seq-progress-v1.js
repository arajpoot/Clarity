/**
 * cu-seq-progress-v1.js — University sequential progress bus
 * Stages: seeker → practice → consistency → transmission
 * Keys: cu_uni_seq_v1 only (never Companion streaks)
 * Educational only — not a grade of īmān.
 */
(function (g) {
  "use strict";
  if (g.__CU_SEQ_PROGRESS_V1__) return;
  g.__CU_SEQ_PROGRESS_V1__ = true;

  var KEY = "cu_uni_seq_v1";
  var STAGES = ["seeker", "practice", "consistency", "transmission"];
  var LABELS = {
    seeker: "Seeker · Essentials",
    practice: "Practice · Foundations",
    consistency: "Consistency",
    transmission: "Transmission"
  };

  function empty() {
    return {
      v: 1,
      modules: {},
      stageComplete: {},
      current: { stage: "seeker", moduleId: null }
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return migrate();
      var o = JSON.parse(raw);
      if (!o || typeof o !== "object") return empty();
      if (!o.modules) o.modules = {};
      if (!o.stageComplete) o.stageComplete = {};
      if (!o.current) o.current = { stage: "seeker", moduleId: null };
      return o;
    } catch (e) {
      return empty();
    }
  }

  function save(s) {
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch (e) {}
  }

  /** One-time soft migrate from junior / campus progress marks */
  function migrate() {
    var s = empty();
    try {
      var j = JSON.parse(localStorage.getItem("clarity_junior_progress_v1") || "{}");
      var mods = (j && j.modules) || j || {};
      Object.keys(mods).forEach(function (k) {
        var v = mods[k];
        if (v === true || (v && v.done)) {
          s.modules["seeker." + k] = { done: true, at: (v && v.at) || new Date().toISOString() };
        }
      });
    } catch (e) {}
    try {
      var f = JSON.parse(localStorage.getItem("cu_uni_faculty_v1") || "{}");
      if (f && f.lessons) {
        Object.keys(f.lessons).forEach(function (k) {
          if (f.lessons[k] && f.lessons[k].done) {
            s.modules[k] = s.modules[k] || { done: true, at: f.lessons[k].at || new Date().toISOString() };
          }
        });
      }
    } catch (e2) {}
    save(s);
    return s;
  }

  function catalog() {
    return (g.CU_SEQ_MODULES && g.CU_SEQ_MODULES.stages) || {};
  }

  function modulesFor(stage) {
    var c = catalog();
    return (c[stage] && c[stage].modules) || [];
  }

  function isModuleDone(id) {
    var s = load();
    return !!(s.modules[id] && s.modules[id].done);
  }

  function markModuleDone(id) {
    var s = load();
    s.modules[id] = { done: true, at: new Date().toISOString() };
    var stage = String(id).split(".")[0];
    if (STAGES.indexOf(stage) >= 0) {
      var all = modulesFor(stage);
      var complete = all.length > 0 && all.every(function (m) { return s.modules[m.id] && s.modules[m.id].done; });
      if (complete) s.stageComplete[stage] = { done: true, at: new Date().toISOString() };
      var next = getNextFromState(s);
      s.current = next || s.current;
    }
    save(s);
    try {
      document.dispatchEvent(new CustomEvent("cu-seq-progress", { detail: s }));
    } catch (e) {}
    return s;
  }

  function isStageComplete(stage) {
    var s = load();
    if (s.stageComplete[stage] && s.stageComplete[stage].done) return true;
    var all = modulesFor(stage);
    if (!all.length) return !!s.stageComplete[stage];
    return all.every(function (m) { return s.modules[m.id] && s.modules[m.id].done; });
  }

  function isStageUnlocked(stage) {
    var ix = STAGES.indexOf(stage);
    if (ix <= 0) return true;
    return isStageComplete(STAGES[ix - 1]);
  }

  function getNextFromState(s) {
    for (var i = 0; i < STAGES.length; i++) {
      var st = STAGES[i];
      if (i > 0 && !(s.stageComplete[STAGES[i - 1]] && s.stageComplete[STAGES[i - 1]].done)) {
        // previous not complete — check live
        if (!isStageComplete(STAGES[i - 1])) {
          var prevMods = modulesFor(STAGES[i - 1]);
          for (var p = 0; p < prevMods.length; p++) {
            if (!(s.modules[prevMods[p].id] && s.modules[prevMods[p].id].done)) {
              return { stage: STAGES[i - 1], moduleId: prevMods[p].id };
            }
          }
          return { stage: STAGES[i - 1], moduleId: prevMods[0] && prevMods[0].id };
        }
      }
      var mods = modulesFor(st);
      for (var j = 0; j < mods.length; j++) {
        if (!(s.modules[mods[j].id] && s.modules[mods[j].id].done)) {
          return { stage: st, moduleId: mods[j].id };
        }
      }
    }
    return { stage: "transmission", moduleId: null, allDone: true };
  }

  function getNext() {
    return getNextFromState(load());
  }

  function getCurrent() {
    var s = load();
    var n = getNextFromState(s);
    s.current = n;
    save(s);
    return n;
  }

  function stageLabel(stage) {
    return LABELS[stage] || stage;
  }

  function deskHref(stage, moduleId) {
    var base = "/campus/desk/" + stage + "/";
    if (moduleId) return base + "#m=" + encodeURIComponent(moduleId);
    return base;
  }

  function counts() {
    var s = load();
    var out = {};
    STAGES.forEach(function (st) {
      var mods = modulesFor(st);
      var done = mods.filter(function (m) { return s.modules[m.id] && s.modules[m.id].done; }).length;
      out[st] = { done: done, total: mods.length, complete: isStageComplete(st), unlocked: isStageUnlocked(st) };
    });
    return out;
  }

  function lastCompletedModule() {
    var s = load();
    var last = null;
    STAGES.forEach(function (st) {
      modulesFor(st).forEach(function (m) {
        if (s.modules[m.id] && s.modules[m.id].done) {
          last = { stage: st, module: m, at: s.modules[m.id].at };
        }
      });
    });
    return last;
  }

  g.CuSeq = {
    KEY: KEY,
    STAGES: STAGES,
    LABELS: LABELS,
    load: load,
    save: save,
    markModuleDone: markModuleDone,
    isModuleDone: isModuleDone,
    isStageComplete: isStageComplete,
    isStageUnlocked: isStageUnlocked,
    getNext: getNext,
    getCurrent: getCurrent,
    stageLabel: stageLabel,
    deskHref: deskHref,
    counts: counts,
    modulesFor: modulesFor,
    lastCompletedModule: lastCompletedModule
  };
})(typeof window !== "undefined" ? window : this);

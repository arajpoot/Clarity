/* clarity-uft-full-restore-v1 */
/* Full family-tree + farāʾiḍ module restored from working Clarity build */
(function(){
if (window.__CLARITY_UFT_FULL_RESTORE_V1__) return;
window.__CLARITY_UFT_FULL_RESTORE_V1__ = true;
})();
if (typeof window.clarityLS === "undefined" || !window.clarityLS) {
  window.clarityLS = {
    getItem: function(k){ try { return localStorage.getItem(k); } catch(e){ return null; } },
    setItem: function(k,v){ try { localStorage.setItem(k, v); } catch(e){} },
    removeItem: function(k){ try { localStorage.removeItem(k); } catch(e){} }
  };
}
window.UFT_KEY = "clarity_user_family_tree_v1";
const UFT_KEY = 'clarity_user_family_tree_v1';
    let uftView = 'pedigree';
    function uftRead() {
      try { return JSON.parse(clarityLS.getItem(UFT_KEY) || '{}'); }
      catch (e) { return {}; }
    }
    function uftFields() {
      return {
        g1: document.getElementById('uft-g1'),
        g2: document.getElementById('uft-g2'),
        g3: document.getElementById('uft-g3'),
        self: document.getElementById('uft-self'),
        selfNote: document.getElementById('uft-self-note'),
        father: document.getElementById('uft-father'),
        fatherY: document.getElementById('uft-father-y'),
        mother: document.getElementById('uft-mother'),
        motherY: document.getElementById('uft-mother-y'),
        spouse: document.getElementById('uft-spouse'),
        pgf: document.getElementById('uft-pgf'),
        pgm: document.getElementById('uft-pgm'),
        mgf: document.getElementById('uft-mgf'),
        mgm: document.getElementById('uft-mgm'),
        children: document.getElementById('uft-children'),
        grandchildren: document.getElementById('uft-grandchildren'),
        siblings: document.getElementById('uft-siblings')
      };
    }
    function uftLoad() {
      const d = uftRead();
      const f = uftFields();
      if (!f.self) return;
      Object.keys(f).forEach(function (k) {
        if (f[k] && d[k] != null && typeof d[k] !== 'object') f[k].value = d[k];
      });
      const stage = document.getElementById('uft-stage');
      if (stage) stage.setAttribute('data-skin', d.skin || 'green');
      uftView = 'pedigree';
      uftRender();
      uftRenderRelList();
      uftRefreshLibrary();
      uftSetStatus(d.savedAt ? ('Restored from this device · ' + uftWhen(d.savedAt)) : 'Private on this device — not uploaded.');
    }

    function uftRegId() {
      return 'm_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    }
    function uftRegNormRow(row) {
      return {
        id: row.id || uftRegId(),
        name: String(row.name || '').trim(),
        role: String(row.role || '').trim(),
        phone: String(row.phone || '').trim(),
        email: String(row.email || '').trim(),
        city: String(row.city || '').trim(),
        note: String(row.note || '').trim()
      };
    }
    function uftRegFind(d, name, role) {
      const n = uftNorm(name);
      const list = (d && d.registry) || [];
      if (role) {
        const hit = list.find(function (r) { return uftNorm(r.name) === n && String(r.role || '') === String(role); });
        if (hit) return hit;
      }
      return list.find(function (r) { return uftNorm(r.name) === n && !r.role; }) ||
        list.find(function (r) { return uftNorm(r.name) === n; }) || null;
    }
    function uftContactOf(name, slot) {
      try {
        const d = uftCollect();
        const row = uftRegFind(d, name, slot);
        if (!row) return '';
        const bits = [];
        if (row.phone) bits.push(row.phone);
        if (row.email) bits.push(row.email);
        if (row.city) bits.push(row.city);
        return bits.join(' · ');
      } catch (e) { return ''; }
    }
    function uftRegFillHostSelect() {
      const sel = document.getElementById('uft-reg-link-host');
      if (!sel) return;
      const prev = sel.value;
      const d = (typeof uftCollect === 'function') ? uftCollect() : {};
      const people = [];
      const seen = {};
      function push(n, slot) {
        if (!n) return;
        const k = (typeof uftNorm === 'function') ? uftNorm(n) : String(n).toLowerCase();
        if (!k || seen[k]) return;
        seen[k] = true;
        let id = (typeof uftNameKey === 'function') ? uftNameKey(n) : ('n:' + k);
        try {
          if (typeof uftCoreIdOf === 'function') {
            const c = uftCoreIdOf(d, n);
            if (c) id = c;
          }
        } catch (e) {}
        people.push({ name: n, slot: slot || '', id: id });
      }
      ['self','spouse','father','mother','pgf','pgm','mgf','mgm'].forEach(function (s) { push(d[s], s); });
      ['g1','g2','g3','siblings','children','grandchildren'].forEach(function (field) {
        (typeof uftLines === 'function' ? uftLines(d[field]) : []).forEach(function (n) { push(n, field); });
      });
      (d.relatives || []).forEach(function (r) { if (r && r.name) push(r.name, r.anchor || ''); });
      sel.innerHTML = '<option value="">No link (registry only)</option>' + people.map(function (p) {
        return '<option value="' + uftEsc(p.id) + '">' + uftEsc(p.name) + (p.slot ? ' · ' + uftEsc(p.slot) : '') + '</option>';
      }).join('');
      if (prev) sel.value = prev;
    }
    function uftRegClearForm() {
      ['uft-reg-name','uft-reg-phone','uft-reg-email','uft-reg-city','uft-reg-note','uft-reg-role','uft-reg-edit-id'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      const host = document.getElementById('uft-reg-link-host');
      if (host) host.value = '';
      const rel = document.getElementById('uft-reg-link-rel');
      if (rel) rel.value = 'child';
    }
    function uftRegPlaceOnTree(name, hostId, relation) {
      if (!name || !hostId) return false;
      relation = relation || 'child';
      const d = uftCollect();
      d.relatives = Array.isArray(d.relatives) ? d.relatives.slice() : [];
      if (hostId === 'self' && relation === 'father' && !d.father) d.father = name;
      else if (hostId === 'self' && relation === 'mother' && !d.mother) d.mother = name;
      else if (hostId === 'self' && relation === 'spouse' && !d.spouse) d.spouse = name;
      else if (relation === 'child' && hostId === 'self') {
        const kids = uftLines(d.children);
        if (!kids.some(function (k) { return uftSame(k, name); })) {
          kids.push(name); d.children = kids.join('\n');
        }
      } else if (relation === 'sibling' && hostId === 'self') {
        const sibs = uftLines(d.siblings);
        if (!sibs.some(function (k) { return uftSame(k, name); })) {
          sibs.push(name); d.siblings = sibs.join('\n');
        }
      } else {
        const dup = d.relatives.some(function (r) {
          return r && uftSame(r.name, name) && String(r.anchor) === String(hostId) && String(r.relation) === String(relation);
        });
        if (!dup) d.relatives.push({ anchor: hostId, relation: relation, name: name });
      }
      if (typeof uftDedupeRels === 'function') d.relatives = uftDedupeRels(d.relatives, d);
      try { clarityLS.setItem(UFT_KEY, JSON.stringify(d)); } catch (e) {}
      const f = uftFields();
      Object.keys(f).forEach(function (k) {
        if (f[k] && d[k] != null && typeof d[k] !== 'object') f[k].value = d[k];
      });
      return true;
    }
    function uftRegAdd() { return uftRegAddNew(); }
    function uftRegAddNew() {
      const name = ((document.getElementById('uft-reg-name') || {}).value || '').trim();
      if (!name) {
        if (typeof uftSetStatus === 'function') uftSetStatus('Enter a name for the new member.');
        return;
      }
      const d = uftCollect();
      d.registry = Array.isArray(d.registry) ? d.registry : [];
      const editId = ((document.getElementById('uft-reg-edit-id') || {}).value || '').trim();
      const hostId = ((document.getElementById('uft-reg-link-host') || {}).value || '');
      const relation = ((document.getElementById('uft-reg-link-rel') || {}).value || 'child');
      const roleHint = hostId ? relation : (((document.getElementById('uft-reg-role') || {}).value) || '');
      const row = uftRegNormRow({
        id: editId,
        name: name,
        role: roleHint,
        phone: ((document.getElementById('uft-reg-phone') || {}).value || ''),
        email: ((document.getElementById('uft-reg-email') || {}).value || ''),
        city: ((document.getElementById('uft-reg-city') || {}).value || ''),
        note: ((document.getElementById('uft-reg-note') || {}).value || '')
      });
      let existing = null;
      if (editId) existing = d.registry.find(function (r) { return r && r.id === editId; });
      if (!existing) existing = uftRegFind(d, row.name, row.role);
      if (existing) {
        existing.name = row.name;
        existing.role = row.role || existing.role;
        existing.phone = row.phone;
        existing.email = row.email;
        existing.city = row.city;
        existing.note = row.note;
      } else {
        d.registry.push(row);
      }
      try { clarityLS.setItem(UFT_KEY, JSON.stringify(d)); } catch (e) {}
      let linked = false;
      if (hostId) linked = uftRegPlaceOnTree(name, hostId, relation);
      uftRegClearForm();
      uftRegRender();
      if (linked && typeof uftRender === 'function') uftRender({ keepScroll: true });
      if (typeof uftRefreshAnchorOptions === 'function') uftRefreshAnchorOptions();
      try { if (typeof uftIntegrityRefresh === 'function') uftIntegrityRefresh(); } catch (e) {}
      if (typeof uftSetStatus === 'function') {
        uftSetStatus(linked
          ? (name + ' saved · linked on tree as ' + relation + ' — set gender/status on their card')
          : (name + ' saved in registry (not on tree yet)'));
      }
    }
    function uftRegUseLoadedCard(idx) {
      const cards = (typeof uftGetStoredCards === 'function') ? uftGetStoredCards() : [];
      const c = cards[idx];
      if (!c || !c.name) return;
      const set = function (i, v) { const el = document.getElementById(i); if (el) el.value = v || ''; };
      set('uft-reg-name', c.name);
      set('uft-reg-phone', c.phone);
      set('uft-reg-email', c.email);
      set('uft-reg-city', c.city);
      const box = document.getElementById('uft-registry-box');
      if (box) box.open = true;
      const nameEl = document.getElementById('uft-reg-name');
      if (nameEl) try { nameEl.focus(); } catch (e) {}
      if (typeof uftSetStatus === 'function') uftSetStatus('Loaded card in form — choose link on tree, then Save member');
    }
    function uftRegRenderLoaded() {
      const box = document.getElementById('uft-reg-loaded-list');
      const cnt = document.getElementById('uft-reg-loaded-count');
      const section = document.getElementById('uft-reg-loaded-section');
      const cards = (typeof uftGetStoredCards === 'function') ? uftGetStoredCards() : [];
      if (cnt) cnt.textContent = cards.length ? ('(' + cards.length + ')') : '(none)';
      if (!box) return;
      if (!cards.length) {
        box.innerHTML = '<span class="uft-hint">No uploaded member cards. Use Upload → Member cards CSV/JSON.</span>';
        return;
      }
      box.innerHTML = cards.map(function (c, i) {
        const bits = [c.generationHint || c.slot, c.gender, c.vital, c.phone].filter(Boolean).join(' · ');
        const searchBlob = [c.name, c.generationHint, c.slot, c.gender, c.vital, c.phone, c.city].filter(Boolean).join(' ');
        return '<div class="uft-reg-loaded-row" data-search="' + uftEsc(searchBlob) + '"><div><strong>' + uftEsc(c.name || '—') + '</strong>' +
          (bits ? '<div class="uft-contact">' + uftEsc(bits) + '</div>' : '') +
          '</div><button type="button" class="btn-secondary" onclick="uftRegUseLoadedCard(' + i + ')">Use in form</button></div>';
      }).join('');
      try {
        const sq = document.getElementById('uft-loaded-search');
        if (sq && sq.value) uftFilterLoadedList(sq.value);
      } catch (e) {}
      // Always keep collapsed unless the user opened it this session
      if (section) {
        if (!section.dataset.userTouched) section.open = false;
        // Never auto-open when parent registry opens
        if (section.open && !section.dataset.userTouched) section.open = false;
      }
    }
    function uftRegRemove(id) {
      const d = uftCollect();
      d.registry = (d.registry || []).filter(function (r) { return r.id !== id; });
      try { clarityLS.setItem(UFT_KEY, JSON.stringify(d)); } catch (e) {}
      uftRegRender();
      uftRender({ keepScroll: true });
    }
    function uftRegFill(id) {
      const d = uftCollect();
      const row = (d.registry || []).find(function (r) { return r && r.id === id; });
      if (!row) return;
      const set = function (i, v) { const el = document.getElementById(i); if (el) el.value = v || ''; };
      set('uft-reg-name', row.name);
      set('uft-reg-role', row.role);
      set('uft-reg-phone', row.phone);
      set('uft-reg-email', row.email);
      set('uft-reg-city', row.city);
      set('uft-reg-note', row.note);
      set('uft-reg-edit-id', row.id);
      const box = document.getElementById('uft-registry-box');
      if (box) box.open = true;
      try { uftRegFillHostSelect(); } catch (e) {}
    }
    function uftRegImportTree() {
      const d = uftCollect();
      d.registry = Array.isArray(d.registry) ? d.registry : [];
      const seen = {};
      d.registry.forEach(function (r) { seen[uftVitalKey(r.name, r.role)] = true; });
      function add(name, role) {
        if (!name) return;
        const k = uftVitalKey(name, role || '');
        if (seen[k]) return;
        seen[k] = true;
        d.registry.push(uftRegNormRow({ name: name, role: role || '' }));
      }
      add(d.self, 'self'); add(d.spouse, 'spouse');
      add(d.father, 'father'); add(d.mother, 'mother');
      add(d.pgf, 'pgf'); add(d.pgm, 'pgm'); add(d.mgf, 'mgf'); add(d.mgm, 'mgm');
      uftLines(d.g3).forEach(function (n) { add(n, 'g3'); });
      uftLines(d.g2).forEach(function (n) { add(n, 'g2'); });
      uftLines(d.g1).forEach(function (n) { add(n, 'g1'); });
      uftLines(d.siblings).forEach(function (n) { add(n, 'sibling'); });
      uftLines(d.children).forEach(function (n) { add(n, 'child'); });
      (d.relatives || []).forEach(function (r) { if (r && r.name) add(r.name, r.relation || r.anchor || 'other'); });
      try { clarityLS.setItem(UFT_KEY, JSON.stringify(d)); } catch (e) {}
      uftRegRender();
      if (typeof uftSetStatus === 'function') uftSetStatus('Tree names copied into the registry. Add contacts there.');
    }
    function uftRegRender() {
      const box = document.getElementById('uft-reg-list');
      if (!box) return;
      const d = uftCollect();
      const list = d.registry || [];
      const cnt = document.getElementById('uft-reg-saved-count');
      if (cnt) cnt.textContent = list.length ? ('(' + list.length + ')') : '';
      if (!list.length) {
        box.innerHTML = '<span class="uft-hint">No registry contacts yet. Add a new member above, or pull names from the tree.</span>';
      } else {
        box.innerHTML = list.map(function (r) {
          const bits = [r.role, r.phone, r.email, r.city].filter(Boolean).join(' · ');
          return '<div class="uft-reg-row"><div><strong>' + uftEsc(r.name) + '</strong>' +
            (bits ? '<div class="uft-contact">' + uftEsc(bits) + '</div>' : '') +
            (r.note ? '<div class="uft-contact">' + uftEsc(r.note) + '</div>' : '') +
            '</div><div><button type="button" class="btn-secondary" onclick="uftRegFill(\'' + r.id + '\')">Edit</button> ' +
            '<button type="button" class="btn-secondary" onclick="uftRegRemove(\'' + r.id + '\')">Remove</button></div></div>';
        }).join('');
      }
      try { uftRegFillHostSelect(); } catch (e) {}
      try { uftRegRenderLoaded(); } catch (e) {}
    }

    function uftCollect() {
      const f = uftFields();
      const prev = uftRead();
      const d = {};
      Object.keys(f).forEach(function (k) { d[k] = f[k] ? f[k].value : ''; });
      d.relatives = Array.isArray(prev.relatives) ? prev.relatives : [];
      d.vital = (prev.vital && typeof prev.vital === 'object') ? prev.vital : {};
      d.registry = Array.isArray(prev.registry) ? prev.registry : [];
      d.gender = (prev.gender && typeof prev.gender === 'object') ? prev.gender : {};
      d.born = (prev.born && typeof prev.born === 'object') ? prev.born : {};
      return uftAutoLinkSiblings(uftDedupeData(d));
    }
    function uftRelLabel(rel) {
      return ({
        sibling: 'Sibling', child: 'Offspring', spouse: 'Spouse', grandchild: 'Grandchild',
        uncle: 'Uncle', aunt: 'Aunt', nephew: 'Nephew', niece: 'Niece', cousin: 'Cousin'
      })[rel] || rel;
    }
    function uftAnchorLabel(a) {
      const map = {
        self: 'You', spouse: 'Spouse', father: 'Father', mother: 'Mother',
        pgf: "Father's father", pgm: "Father's mother", mgf: "Mother's father", mgm: "Mother's mother"
      };
      if (map[a]) return map[a];
      if (a && String(a).indexOf('n:') === 0) return String(a).slice(2);
      return a || '';
    }
    function uftRenderRelList() {
      const box = document.getElementById('uft-rel-list');
      if (!box) return;
      const d = uftRead();
      const rels = (d.relatives || []);
      uftRefreshAnchorOptions();
      if (!rels.length) { box.innerHTML = '<p class="uft-hint">No extra relations yet. Attach a sibling or child to any person already on the tree — uncles, aunts and cousins are linked automatically.</p>'; return; }
      box.innerHTML = rels.map(function (r, i) {
        const host = uftAnchorLabel(r.anchor) || String(r.anchor || '').replace(/^n:/, '');
        const role = uftRoleToYou(d, r.name, uftRelLabel(r.relation));
        return '<div class="uft-rel-chip"><span>' + uftEsc(host) + ' → ' +
          uftEsc(uftRelLabel(r.relation)) + ': <strong>' + uftEsc(r.name) + '</strong> <em class="uft-auto-tag">' + uftEsc(role) + '</em></span>' +
          '<button type="button" onclick="uftRemoveRel(' + i + ')">✕</button></div>';
      }).join('');
    }
    function uftPickExistingName(sel) {
      const v = ((sel || document.getElementById('uft-rel-pick') || {}).value || '').trim();
      const inp = document.getElementById('uft-rel-name');
      if (v && inp) { inp.value = v; sel.value = ''; }
    }
    function uftFillNameChoices() {
      const d = uftRead();
      const names = [];
      const seen = {};
      function push(n) {
        n = String(n || '').trim();
        const k = uftNorm(n);
        if (!k || seen[k]) return;
        seen[k] = true;
        names.push(n);
      }
      try {
        uftAllMembers(d).forEach(function (p) { if (p && p.name) push(p.name); });
        (d.relatives || []).forEach(function (r) { if (r && r.name) push(r.name); });
      } catch (e) {}
      const dl = document.getElementById('uft-rel-name-list');
      if (dl) dl.innerHTML = names.map(function (n) { return '<option value="' + uftEsc(n) + '"></option>'; }).join('');
      const pick = document.getElementById('uft-rel-pick');
      if (pick) {
        const cur = pick.value;
        pick.innerHTML = '<option value="">Or choose someone already on the tree…</option>' +
          names.map(function (n) { return '<option value="' + uftEsc(n) + '">' + uftEsc(n) + '</option>'; }).join('');
        pick.value = cur;
      }
    }
    function uftAddRel() {
      const pick = document.getElementById('uft-rel-pick');
      const typed = ((document.getElementById('uft-rel-name') || {}).value || '').trim();
      const name = typed || ((pick || {}).value || '').trim();
      if (!name) {
        if (typeof uftSetStatus === 'function') uftSetStatus('Type a name or pick someone already on the tree, then Add.');
        return false;
      }
      const anchor = (document.getElementById('uft-rel-anchor') || {}).value || 'self';
      const relation = (document.getElementById('uft-rel-type') || {}).value || 'sibling';
      const d = uftCollect();
      d.relatives = d.relatives || [];
      const existing = uftHasPerson(d, name);
      const dup = d.relatives.some(function (r) {
        return uftSame(r.name, name) && String(r.anchor) === String(anchor) && String(r.relation) === String(relation);
      });
      if (dup) {
        if (typeof uftSetStatus === 'function') uftSetStatus(name + ' is already linked that way — duplicate skipped.');
        return;
      }
      if (existing && existing.kind === 'core' && uftSame(existing.name, name)) {
        if (uftIsRestatedCore(d, { name: name, anchor: anchor, relation: relation })) {
          if (typeof uftSetStatus === 'function') uftSetStatus(name + ' is already on the tree as ' + existing.role + '. Extra copy skipped.');
          return;
        }
        if (typeof uftSetStatus === 'function') {
          uftSetStatus(name + ' is already ' + existing.role + '. Linked across both family lines (cousin marriage allowed).');
        }
      }
      const vitalNew = ((document.getElementById('uft-rel-vital') || {}).value || '').trim();
      d.relatives.push({ anchor: anchor, relation: relation, name: name });
      d.relatives = uftDedupeRels(d.relatives, d);
      if (vitalNew) {
        d.vital = d.vital || {};
        d.vital[uftVitalKey(name, anchor)] = vitalNew;
      }
      const genderNew = ((document.getElementById('uft-rel-gender') || {}).value || '').trim();
      if (genderNew) {
        d.gender = d.gender || {};
        d.gender[uftGenderKey(name, anchor)] = genderNew;
      }
      const bornNew = ((document.getElementById('uft-rel-born') || {}).value || '').replace(/[^0-9]/g, '').slice(0, 4);
      if (bornNew) {
        d.born = d.born || {};
        d.born[uftVitalKey(name, anchor)] = bornNew;
      }
      if (relation === 'sibling') {
        uftAutoLinkSiblings(d);
      }
      const stage = document.getElementById('uft-stage');
      if (stage) d.skin = stage.getAttribute('data-skin') || 'green';
      d.view = uftView;
      try { clarityLS.setItem(UFT_KEY, JSON.stringify(d)); } catch (e) {}
      const inp = document.getElementById('uft-rel-name');
      if (inp) { inp.value = ''; inp.focus(); }
      if (pick) pick.value = '';
      uftRenderRelList();
      uftRefreshAnchorOptions();
      uftFillNameChoices();
      uftRender({ keepScroll: true });
      if (typeof uftSetStatus === 'function') uftSetStatus(uftLinkMessage(anchor, relation, name, d) + ' Add another name the same way.');
      return true;
    }
    function uftRemoveRel(i) {
      const d = uftCollect();
      d.relatives = (d.relatives || []).filter(function (_, idx) { return idx !== i; });
      try { clarityLS.setItem(UFT_KEY, JSON.stringify(d)); } catch (e) {}
      uftRenderRelList();
      uftRender({ keepScroll: true });
    }
    function uftDeletePerson(name, slot, anchor) {
      name = String(name || '').trim();
      if (!name) return;
      slot = String(slot || '').trim();
      anchor = String(anchor || '').trim();
      if (!confirm('Remove ' + name + ' from this place only?\n\nOther places that use the same name stay. Gender / status / year stay with the person.')) return;

      const d = uftCollect();
      d.relatives = Array.isArray(d.relatives) ? d.relatives.slice() : [];
      const cores = ['self','spouse','father','mother','pgf','pgm','mgf','mgm'];
      const lists = ['g1','g2','g3','siblings','children','grandchildren'];
      const nkey = (typeof uftNameKey === 'function') ? uftNameKey(name) : ('n:' + uftNorm(name));
      let removed = false;

      function samePerson(a, b) {
        if (!a || !b) return false;
        if (typeof uftSame === 'function') return uftSame(a, b);
        return String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
      }
      function hostBag(h) {
        if (!h) return [];
        const out = [];
        const push = function (x) {
          if (!x) return;
          const s = String(x);
          if (out.indexOf(s) < 0) out.push(s);
        };
        push(h);
        push(String(h).replace(/^n:/i, ''));
        if (typeof uftNameKey === 'function') {
          push(uftNameKey(h));
          push(uftNameKey(String(h).replace(/^n:/i, '')));
        }
        try {
          const cn = (typeof uftCoreName === 'function') ? uftCoreName(d, h) : '';
          if (cn) {
            push(cn);
            if (typeof uftNameKey === 'function') push(uftNameKey(cn));
          }
        } catch (e) {}
        // If h is a core id, include the person currently in that slot
        if (cores.indexOf(String(h)) >= 0 && d[h]) {
          push(d[h]);
          if (typeof uftNameKey === 'function') push(uftNameKey(d[h]));
        }
        return out;
      }
      function matchesHost(anch, hostList) {
        if (!anch || !hostList || !hostList.length) return false;
        for (let i = 0; i < hostList.length; i++) {
          if (samePerson(anch, hostList[i])) return true;
          if (String(anch) === String(hostList[i])) return true;
          if (String(anch).replace(/^n:/i, '') === String(hostList[i]).replace(/^n:/i, '')) return true;
        }
        return false;
      }

      const hostList = hostBag(anchor).concat(hostBag(slot));

      // A) Core field placement
      if (slot && cores.indexOf(slot) >= 0 && samePerson(d[slot], name)) {
        d[slot] = '';
        removed = true;
      }
      // B) List field placement
      if (slot && lists.indexOf(slot) >= 0) {
        const before = uftLines(d[slot]);
        const after = before.filter(function (n) { return !samePerson(n, name); });
        if (after.length !== before.length) {
          d[slot] = after.join('\n');
          removed = true;
        }
      }

      // C) Relationship edges at this location (either direction)
      const beforeRel = d.relatives.length;
      d.relatives = d.relatives.filter(function (r) {
        if (!r) return false;
        const nameIsCard = samePerson(r.name, name);
        const anchIsCard = matchesHost(r.anchor, [name, nkey].concat(hostBag(name)));
        const anchIsHost = hostList.length ? matchesHost(r.anchor, hostList) : false;
        const nameIsHost = hostList.length ? matchesHost(r.name, hostList) : false;
        // Card is the relative name, host is the anchor
        if (nameIsCard && anchIsHost) return false;
        // Reverse spouse/child edge: card is anchor, host is the named person
        if (nameIsHost && anchIsCard) return false;
        // Spouse of host when host matched via core name
        if (nameIsCard && r.relation === 'spouse' && anchIsHost) return false;
        return true;
      });
      if (d.relatives.length !== beforeRel) removed = true;

      // D) Fallbacks — still location-minded
      if (!removed && hostList.length) {
        // Any edge naming this person attached to this host family of keys
        const before2 = d.relatives.length;
        d.relatives = d.relatives.filter(function (r) {
          if (!r || !samePerson(r.name, name)) return true;
          return !matchesHost(r.anchor, hostList);
        });
        if (d.relatives.length !== before2) removed = true;
      }
      if (!removed) {
        // One relative edge with this name (single placement when data is ambiguous)
        let dropped = false;
        d.relatives = d.relatives.filter(function (r) {
          if (dropped || !r || !samePerson(r.name, name)) return true;
          dropped = true;
          removed = true;
          return false;
        });
      }
      if (!removed) {
        // Last resort: remove name once from any list field
        for (let i = 0; i < lists.length; i++) {
          const k = lists[i];
          const lines = uftLines(d[k]);
          const hit = lines.findIndex(function (n) { return samePerson(n, name); });
          if (hit >= 0) {
            lines.splice(hit, 1);
            d[k] = lines.join('\n');
            removed = true;
            break;
          }
        }
      }
      if (!removed) {
        for (let i = 0; i < cores.length; i++) {
          if (samePerson(d[cores[i]], name)) {
            d[cores[i]] = '';
            removed = true;
            break;
          }
        }
      }

      // Identity maps kept intentionally
      try { clarityLS.setItem(UFT_KEY, JSON.stringify(d)); } catch (e) {}
      const f = uftFields();
      Object.keys(f).forEach(function (k) {
        if (f[k] && d[k] != null && typeof d[k] !== 'object') f[k].value = d[k];
      });
      if (typeof uftRenderRelList === 'function') uftRenderRelList();
      if (typeof uftRefreshAnchorOptions === 'function') uftRefreshAnchorOptions();
      if (typeof uftFillNameChoices === 'function') uftFillNameChoices();
      uftRender({ keepScroll: true });
      try { if (typeof uftRenderOwnTreePanel === 'function') uftRenderOwnTreePanel(); } catch (e) {}
      try { if (typeof uftIntegrityRefresh === 'function') uftIntegrityRefresh(); } catch (e) {}
      if (typeof uftSetStatus === 'function') {
        uftSetStatus(removed
          ? (name + ' removed from this place')
          : (name + ' — could not find a link to remove (try Edit names → relations list)'));
      }
    }
    function uftNorm(n) {
      return String(n || '').trim().toLowerCase().replace(/\s+/g, ' ');
    }
    function uftSame(a, b) {
      const x = uftNorm(a), y = uftNorm(b);
      if (!x || !y) return false;
      if (x === y) return true;
      if (x.replace(/\s+/g,'') === y.replace(/\s+/g,'')) return true;
      return false;
    }
    function uftCoreIdOf(d, name) {
      if (!name) return null;
      const slots = [
        ['self', d.self], ['spouse', d.spouse],
        ['father', d.father], ['mother', d.mother],
        ['pgf', d.pgf], ['pgm', d.pgm], ['mgf', d.mgf], ['mgm', d.mgm]
      ];
      for (let i = 0; i < slots.length; i++) {
        if (uftSame(slots[i][1], name)) return slots[i][0];
      }
      return null;
    }
    function uftIsCorePerson(d, name) {
      return !!uftCoreIdOf(d, name);
    }
    function uftRolesOf(d, name) {
      const roles = [];
      if (!name) return roles;
      if (uftSame(name, d.self)) roles.push('You');
      if (uftSame(name, d.spouse)) roles.push('Spouse');
      if (uftSame(name, d.father)) roles.push('Father');
      if (uftSame(name, d.mother)) roles.push('Mother');
      if (uftSame(name, d.pgf)) roles.push("Father's father");
      if (uftSame(name, d.pgm)) roles.push("Father's mother");
      if (uftSame(name, d.mgf)) roles.push("Mother's father");
      if (uftSame(name, d.mgm)) roles.push("Mother's mother");
      const rels = d.relatives || [];
      rels.forEach(function (r) {
        if (!uftSame(r.name, name)) return;
        const host = uftCoreIdOf(d, uftCoreName(d, r.anchor)) || r.anchor;
        if (r.relation === 'sibling' && (host === 'pgf' || host === 'pgm')) roles.push('Paternal great-uncle/aunt');
        if (r.relation === 'sibling' && (host === 'mgf' || host === 'mgm')) roles.push('Maternal great-uncle/aunt');
        if (r.relation === 'sibling' && host === 'father') roles.push('Paternal uncle/aunt');
        if (r.relation === 'sibling' && host === 'mother') roles.push('Maternal uncle/aunt');
        if (r.relation === 'spouse' && (host === 'pgf' || host === 'pgm' || host === 'mgf' || host === 'mgm')) roles.push('Grandparent by marriage');
      });
      const seen = {};
      return roles.filter(function (r) {
        if (seen[r]) return false;
        seen[r] = true;
        return true;
      });
    }
    function uftCrossMarriageNote(d, name) {
      const roles = uftRolesOf(d, name);
      const pat = roles.some(function (r) { return /father|paternal/i.test(r); });
      const mat = roles.some(function (r) { return /mother|maternal/i.test(r); });
      if (pat && mat) return 'Same person on paternal and maternal lines (cousin-marriage link).';
      return '';
    }
    function uftNotCorePeople(d, items) {
      return (items || []).filter(function (it) { return it && it.name && !uftIsCorePerson(d, it.name); });
    }
    function uftParentsOf(d, id) {
      const name = uftCoreName(d, id) || (String(id || '').indexOf('n:') === 0 ? String(id).slice(2) : '');
      const out = [];
      function add(pid, pname) {
        const nm = pname || uftCoreName(d, pid) || '';
        if (!nm && !pid) return;
        out.push({ id: pid || uftNameKey(nm), name: nm });
      }
      if (id === 'self' || uftSame(name, d.self)) { add('father', d.father); add('mother', d.mother); }
      if (id === 'father' || uftSame(name, d.father)) { add('pgf', d.pgf); add('pgm', d.pgm); }
      if (id === 'mother' || uftSame(name, d.mother)) { add('mgf', d.mgf); add('mgm', d.mgm); }
      (d.relatives || []).forEach(function (r) {
        if (r.relation === 'child' && name && uftSame(r.name, name)) {
          add(r.anchor, uftCoreName(d, r.anchor) || String(r.anchor || '').replace(/^n:/, ''));
        }
      });
      return uftUniquePeople(out);
    }
    function uftUnclesOf(d, id) {
      const selfName = uftCoreName(d, id) || '';
      const list = [];
      uftParentsOf(d, id).forEach(function (p) {
        uftSiblingsOf(d, p.id).forEach(function (s) {
          if (!uftSame(s.name, selfName) && !uftIsCorePerson(d, s.name)) list.push(s);
        });
      });
      return uftUniquePeople(list);
    }
    function uftUncleOwners(d, uncleName) {
      const owners = [];
      ['pgf', 'pgm', 'mgf', 'mgm'].forEach(function (gid) {
        if (uftUnclesOf(d, gid).some(function (u) { return uftSame(u.name, uncleName); })) {
          owners.push(gid);
        }
      });
      return owners;
    }
    function uftRoleLabel(d, name, hint) {
      const roles = uftRolesOf(d, name);
      if (!roles.length) return hint || '';
      return roles.join(' · ');
    }
    function uftCoreName(d, id) {
      if (!d) return '';
      if (id === 'self') return d.self || '';
      if (id === 'spouse') return d.spouse || '';
      if (id === 'father') return d.father || '';
      if (id === 'mother') return d.mother || '';
      if (id === 'pgf') return d.pgf || '';
      if (id === 'pgm') return d.pgm || '';
      if (id === 'mgf') return d.mgf || '';
      if (id === 'mgm') return d.mgm || '';
      if (id && String(id).indexOf('n:') === 0) return String(id).slice(2);
      return '';
    }
    function uftNameKey(name) {
      const n = uftNorm(name);
      return n ? ('n:' + n) : '';
    }
    function uftAnchorMatches(d, anchor, personId, personName) {
      if (!anchor) return false;
      if (anchor === personId) return true;
      if (String(anchor).indexOf('n:') === 0) {
        return uftSame(String(anchor).slice(2), personName) || uftSame(String(anchor).slice(2), uftCoreName(d, personId));
      }
      return uftSame(uftCoreName(d, anchor), personName);
    }
    function uftPeersOf(d, name) {
      const peers = [];
      const seen = {};
      function add(n) {
        const k = uftNorm(n);
        if (!k || uftSame(n, name) || seen[k]) return;
        seen[k] = true;
        peers.push({ name: n });
      }
      (d.relatives || []).forEach(function (r) {
        if (!r || r.relation !== 'sibling') return;
        const host = (uftCoreName(d, r.anchor) || String(r.anchor || '').replace(/^n:/, '')).trim();
        if (uftSame(host, name)) add(r.name);
        if (uftSame(r.name, name) && host) add(host);
      });
      uftSiblingsOf(d, uftNameKey(name)).forEach(function (s) { add(s.name); });
      uftSiblingsOf(d, name).forEach(function (s) { add(s.name); });
      return peers;
    }
    function uftUniquePeople(items) {
      const out = [];
      const seen = {};
      (items || []).forEach(function (it) {
        const n = uftNorm(it && it.name);
        if (!n || seen[n]) return;
        seen[n] = true;
        out.push(it);
      });
      return out;
    }
    function uftRelsFor(d, anchor) {
      const name = uftCoreName(d, anchor) || (String(anchor || '').indexOf('n:') === 0 ? String(anchor).slice(2) : '');
      return (d.relatives || []).filter(function (r) {
        return r && r.name && uftAnchorMatches(d, r.anchor, anchor, name);
      });
    }
    function uftKidsOf(d, anchor) {
      const kids = [];
      uftRelsFor(d, anchor).forEach(function (r) {
        if (r.relation === 'child' || r.relation === 'grandchild' || r.relation === 'offspring') {
          kids.push({ name: r.name, relation: r.relation === 'grandchild' ? 'grandchild' : 'child', anchor: r.anchor });
        }
      });
      if (anchor === 'self') {
        uftLines(d.children).forEach(function (n) { kids.push({ name: n, relation: 'child', anchor: 'self' }); });
      }
      return uftUniquePeople(kids);
    }
    function uftIsBloodUncle(d, name) {
      if (!name) return false;
      return uftSiblingsOf(d, 'father').concat(uftSiblingsOf(d, 'mother')).some(function (u) {
        return uftSame(u.name, name);
      });
    }
    function uftBloodSiblings(d) {
      return uftSiblingsOf(d, 'self').filter(function (s) {
        if (!s || !s.name) return false;
        if (uftIsCorePerson(d, s.name)) return false;
        if (uftSame(s.name, d.spouse)) return false;
        if (uftIsBloodUncle(d, s.name)) return false;
        return true;
      });
    }
    function uftInLawPeople(d) {
      if (!d.spouse) return [];
      const list = [];
      uftRelsFor(d, 'spouse').concat(uftRelsFor(d, uftNameKey(d.spouse))).forEach(function (r) {
        if (!r || !r.name) return;
        if (uftSame(r.name, d.self) || uftSame(r.name, d.spouse)) return;
        if (uftIsBloodUncle(d, r.name)) return;
        if (uftBloodSiblings(d).some(function (s) { return uftSame(s.name, r.name); })) return;
        list.push({ name: r.name, relation: r.relation, anchor: r.anchor });
      });
      return uftUniquePeople(list);
    }
    function uftSiblingsOf(d, anchor) {
      const sibs = [];
      uftRelsFor(d, anchor).forEach(function (r) {
        if (r.relation === 'sibling') sibs.push({ name: r.name, relation: 'sibling', anchor: r.anchor });
      });
      if (anchor === 'self') {
        uftLines(d.siblings).forEach(function (n) { sibs.push({ name: n, relation: 'sibling', anchor: 'self' }); });
        uftKidsOf(d, 'father').concat(uftKidsOf(d, 'mother')).forEach(function (k) {
          if (!uftSame(k.name, d.self)) sibs.push({ name: k.name, relation: 'sibling', anchor: 'self' });
        });
      }
      if (anchor === 'father') {
        uftKidsOf(d, 'pgf').concat(uftKidsOf(d, 'pgm')).forEach(function (k) {
          if (!uftSame(k.name, d.father)) sibs.push({ name: k.name, relation: 'sibling', anchor: 'father' });
        });
      }
      if (anchor === 'mother') {
        uftKidsOf(d, 'mgf').concat(uftKidsOf(d, 'mgm')).forEach(function (k) {
          if (!uftSame(k.name, d.mother)) sibs.push({ name: k.name, relation: 'sibling', anchor: 'mother' });
        });
      }
      return uftUniquePeople(sibs);
    }
    function uftSpouseOf(d, anchor) {
      const named = [];
      if (anchor === 'self' && d.spouse) named.push({ name: d.spouse, relation: 'spouse', anchor: 'self' });
      uftRelsFor(d, anchor).forEach(function (r) {
        if (r.relation === 'spouse') named.push({ name: r.name, relation: 'spouse', anchor: r.anchor });
      });
      return uftUniquePeople(named);
    }
    function uftRoleToYou(d, name, hint) {
      if (!name) return hint || '';
      const coreRoles = uftRolesOf(d, name);
      if (coreRoles.length) {
        const extra = uftCrossMarriageNote(d, name);
        return extra ? (coreRoles.join(' · ') + ' · linked both lines') : coreRoles.join(' · ');
      }
      if (uftSiblingsOf(d, 'self').some(function (s) { return uftSame(s.name, name); })) return 'Sibling';
      if (uftKidsOf(d, 'self').some(function (s) { return uftSame(s.name, name); })) return 'Child';
      if (uftSiblingsOf(d, 'father').some(function (s) { return uftSame(s.name, name); })) return 'Paternal uncle/aunt';
      if (uftSiblingsOf(d, 'mother').some(function (s) { return uftSame(s.name, name); })) return 'Maternal uncle/aunt';
      let cousin = false;
      uftSiblingsOf(d, 'father').concat(uftSiblingsOf(d, 'mother')).forEach(function (u) {
        uftKidsOf(d, uftNameKey(u.name)).forEach(function (c) {
          if (uftSame(c.name, name)) cousin = true;
        });
      });
      if (cousin) return 'Cousin';
      if (uftLines(d.grandchildren).some(function (g) { return uftSame(g, name); })) return 'Grandchild';
      return hint || 'Relative';
    }
    function uftOffshoot(d, anchor) {
      const rels = uftRelsFor(d, anchor);
      if (!rels.length) return '';
      return '<div class="uft-offshoot">' + rels.map(function (r) {
        return uftPerson(r.name, uftRoleToYou(d, r.name, uftRelLabel(r.relation)), '', 'rel');
      }).join('') + '</div>';
    }
    function uftRefreshAnchorOptions() {
      const sel = document.getElementById('uft-rel-anchor');
      if (!sel) return;
      const prev = sel.value;
      const d = uftCollect();
      const opts = [];
      const seen = {};
      function add(id, label) {
        if (!id || seen[id]) return;
        seen[id] = true;
        opts.push([id, label]);
      }
      add('self', (d.self || 'You') + ' — you');
      add('spouse', (d.spouse || 'Spouse') + ' — spouse');
      add('father', (d.father || 'Father') + ' — father');
      add('mother', (d.mother || 'Mother') + ' — mother');
      add('pgf', (d.pgf || "Father's father") + " — father's father");
      add('pgm', (d.pgm || "Father's mother") + " — father's mother");
      add('mgf', (d.mgf || "Mother's father") + " — mother's father");
      add('mgm', (d.mgm || "Mother's mother") + " — mother's mother");
      uftLines(d.g3).forEach(function (n) { add(uftNameKey(n), n + ' — great-grandparent'); });
      uftLines(d.g2).forEach(function (n) { add(uftNameKey(n), n + ' — 2nd-great-grandparent'); });
      uftLines(d.g1).forEach(function (n) { add(uftNameKey(n), n + ' — 3rd-great-grandparent'); });
      uftLines(d.siblings).forEach(function (n) { add(uftNameKey(n), n + ' — sibling'); });
      uftLines(d.children).forEach(function (n) { add(uftNameKey(n), n + ' — child'); });
      (d.relatives || []).forEach(function (r) {
        if (r && r.name) add(uftNameKey(r.name), r.name + ' — ' + uftRelLabel(r.relation));
      });
      sel.innerHTML = opts.map(function (pair) {
        return '<option value="' + uftEsc(pair[0]) + '">' + uftEsc(pair[1]) + '</option>';
      }).join('');
      if (prev && seen[prev]) sel.value = prev;
    }
    function uftLinkMessage(anchor, relation, name, d) {
      const role = uftRoleToYou(d, name, uftRelLabel(relation));
      const host = uftCoreName(d, anchor) || String(anchor).replace(/^n:/, '') || 'this person';
      return 'Linked ' + name + ' as ' + role + ' (attached to ' + host + '). Their children nest under them.';
    }
    function uftUniqueLines(s) {
      const seen = {};
      return uftLines(s).filter(function (n) {
        const k = uftNorm(n);
        if (!k || seen[k]) return false;
        seen[k] = true;
        return true;
      }).join('\n');
    }
    function uftCoreList(d) {
      return [
        { id: 'self', name: d.self, role: 'You' },
        { id: 'spouse', name: d.spouse, role: 'Spouse' },
        { id: 'father', name: d.father, role: 'Father' },
        { id: 'mother', name: d.mother, role: 'Mother' },
        { id: 'pgf', name: d.pgf, role: "Father's father" },
        { id: 'pgm', name: d.pgm, role: "Father's mother" },
        { id: 'mgf', name: d.mgf, role: "Mother's father" },
        { id: 'mgm', name: d.mgm, role: "Mother's mother" }
      ].filter(function (p) { return p.name && uftNorm(p.name); });
    }
    function uftIsRestatedCore(d, r) {
      if (!r || !r.name) return true;
      if (r.relation === 'child' && (r.anchor === 'father' || r.anchor === 'mother') && uftSame(r.name, d.self)) return true;
      if (r.relation === 'child' && (r.anchor === 'pgf' || r.anchor === 'pgm') && uftSame(r.name, d.father)) return true;
      if (r.relation === 'child' && (r.anchor === 'mgf' || r.anchor === 'mgm') && uftSame(r.name, d.mother)) return true;
      if (r.relation === 'spouse' && r.anchor === 'self' && uftSame(r.name, d.spouse)) return true;
      if (r.relation === 'sibling' && r.anchor === 'self' && uftSame(r.name, d.self)) return true;
      return false;
    }
    function uftDedupeRels(rels, d) {
      const out = [];
      const seen = {};
      (rels || []).forEach(function (r) {
        if (!r || !String(r.name || '').trim()) return;
        if (uftIsRestatedCore(d, r)) return;
        const host = uftNorm(uftCoreName(d, r.anchor) || String(r.anchor || '').replace(/^n:/, ''));
        const key = uftNorm(r.name) + '|' + host + '|' + String(r.relation || '');
        if (seen[key]) return;
        seen[key] = true;
        out.push({
          anchor: r.anchor,
          relation: r.relation || 'relative',
          name: String(r.name).trim()
        });
      });
      return out;
    }
    function uftDedupeData(d) {
      const next = d || {};
      ['g1', 'g2', 'g3', 'siblings', 'children', 'grandchildren'].forEach(function (k) {
        next[k] = uftUniqueLines(next[k] || '');
      });
      // Remove list entries that are already core people (avoids duplicate cards)
      const coreNorms = {};
      ['self', 'spouse', 'father', 'mother', 'pgf', 'pgm', 'mgf', 'mgm'].forEach(function (k) {
        if (next[k]) coreNorms[uftNorm(next[k])] = k;
      });
      ['g1', 'g2', 'g3', 'siblings', 'children', 'grandchildren'].forEach(function (k) {
        const kept = [];
        uftLines(next[k]).forEach(function (n) {
          const nn = uftNorm(n);
          if (!nn) return;
          if (coreNorms[nn]) return; // already on core slot
          if (kept.some(function (x) { return uftNorm(x) === nn; })) return;
          kept.push(n);
        });
        next[k] = kept.join('\n');
      });
      // A name should not appear in more than one of g1/g2/g3 — keep the first generation rank (g1 wins, then g2, then g3)
      const seenGen = {};
      ['g1', 'g2', 'g3'].forEach(function (k) {
        const kept = [];
        uftLines(next[k]).forEach(function (n) {
          const nn = uftNorm(n);
          if (!nn || seenGen[nn]) return;
          seenGen[nn] = k;
          kept.push(n);
        });
        next[k] = kept.join('\n');
      });
      next.relatives = uftDedupeRels(next.relatives || [], next);
      // Drop relative rows that only restate a core person with no extra info
      next.relatives = (next.relatives || []).filter(function (r) {
        if (!r || !r.name) return false;
        return true;
      });
      next.vital = (next.vital && typeof next.vital === 'object') ? next.vital : {};
      next.gender = (next.gender && typeof next.gender === 'object') ? next.gender : {};
      next.born = (next.born && typeof next.born === 'object') ? next.born : {};
      return next;
    }
    function uftHasPerson(d, name) {
      const n = uftNorm(name);
      if (!n) return null;
      const cores = uftCoreList(d);
      for (let i = 0; i < cores.length; i++) {
        if (uftNorm(cores[i].name) === n) return { kind: 'core', id: cores[i].id, role: cores[i].role, name: cores[i].name };
      }
      const lists = [
        ['siblings', 'Sibling'],
        ['children', 'Child'],
        ['grandchildren', 'Grandchild'],
        ['g3', 'Great-grandparent'],
        ['g2', '2nd-great-grandparent'],
        ['g1', '3rd-great-grandparent']
      ];
      for (let i = 0; i < lists.length; i++) {
        if (uftLines(d[lists[i][0]]).some(function (x) { return uftNorm(x) === n; })) {
          return { kind: 'list', id: lists[i][0], role: lists[i][1], name: name };
        }
      }
      const rel = (d.relatives || []).find(function (r) { return uftNorm(r.name) === n; });
      if (rel) return { kind: 'rel', id: rel.anchor, role: uftRelLabel(rel.relation), name: rel.name };
      return null;
    }
    function uftAllMembers(d) {
      const items = [];
      uftCoreList(d).forEach(function (p) { items.push({ name: p.name, relation: p.role, anchor: p.id }); });
      uftLines(d.siblings).forEach(function (n) { items.push({ name: n, relation: 'Sibling', anchor: 'self' }); });
      uftLines(d.children).forEach(function (n) { items.push({ name: n, relation: 'Child', anchor: 'self' }); });
      uftLines(d.grandchildren).forEach(function (n) { items.push({ name: n, relation: 'Grandchild', anchor: 'self' }); });
      uftLines(d.g3).forEach(function (n) { items.push({ name: n, relation: 'Great-grandparent', anchor: 'g3' }); });
      uftLines(d.g2).forEach(function (n) { items.push({ name: n, relation: '2nd-great-grandparent', anchor: 'g2' }); });
      uftLines(d.g1).forEach(function (n) { items.push({ name: n, relation: '3rd-great-grandparent', anchor: 'g1' }); });
      (d.relatives || []).forEach(function (r) { items.push({ name: r.name, relation: uftRelLabel(r.relation), anchor: r.anchor }); });
      return uftUniquePeople(items);
    }

    function uftSetSkin(name) {
      const stage = document.getElementById('uft-stage');
      if (!stage) return;
      stage.setAttribute('data-skin', name || 'green');
      try {
        const d = Object.assign(uftRead(), uftCollect());
        d.skin = name || 'green';
        clarityLS.setItem(UFT_KEY, JSON.stringify(d));
      } catch (e) {}
    }
    function uftSetView(name) {
      uftView = 'pedigree';
      try { clarityLS.setItem('clarity_uft_view', 'pedigree'); } catch (e) {}
      uftRender();
    }
    function uftEditorEl() { return document.getElementById('uft-editor'); }

    function uftDockStepHighlight(n) {
      try {
        document.querySelectorAll('.uft-dock-steps .uft-step').forEach(function (b) {
          b.classList.toggle('active-step', String(b.getAttribute('data-step')) === String(n));
        });
      } catch (e) {}
    }
    function uftDockOpenSection(el) {
      if (!el) return;
      try {
        if (el.tagName === 'DETAILS') el.open = true;
        el.classList.add('uft-step-flash');
        setTimeout(function () { try { el.classList.remove('uft-step-flash'); } catch (e) {} }, 950);
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (e) {}
    }
    /** Workflow chips 1–5 in Names & registry */
    function uftDockStep(n) {
      n = parseInt(n, 10) || 1;
      try { if (typeof uftExpandEditor === 'function') uftExpandEditor(); } catch (e) {}
      uftDockStepHighlight(n);
      var reg = document.getElementById('uft-registry-box');
      var loaded = document.getElementById('uft-reg-loaded-section');
      var build = document.getElementById('uft-build-section');
      var newSec = document.getElementById('uft-reg-new-section');
      var vitals = document.querySelector('.uft-vital-row') || document.getElementById('uft-vital-who');
      if (n === 1) {
        // Registry: add member form
        if (reg) reg.open = true;
        uftDockOpenSection(newSec || reg);
        try {
          var nameIn = document.getElementById('uft-reg-name');
          if (nameIn) { nameIn.focus(); nameIn.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
        } catch (e) {}
        try { if (typeof uftSetStatus === 'function') uftSetStatus('Step 1 · Registry — add a member or edit contacts'); } catch (e) {}
        return;
      }
      if (n === 2) {
        // Link: open registry + focus link host / relation
        if (reg) reg.open = true;
        uftDockOpenSection(newSec || reg);
        try {
          if (typeof uftRegFillHostSelect === 'function') uftRegFillHostSelect();
          var host = document.getElementById('uft-reg-link-host');
          if (host) { host.focus(); host.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
        } catch (e) {}
        try { if (typeof uftSetStatus === 'function') uftSetStatus('Step 2 · Link — choose host member and relation, then Save & link'); } catch (e) {}
        return;
      }
      if (n === 3) {
        // Loaded member cards
        if (loaded) loaded.open = true;
        uftDockOpenSection(loaded);
        try {
          if (typeof uftRegRenderLoaded === 'function') uftRegRenderLoaded();
          var search = document.getElementById('uft-loaded-search');
          if (search) search.focus();
        } catch (e) {}
        try { if (typeof uftSetStatus === 'function') uftSetStatus('Step 3 · Loaded cards — upload, scan, or pick a name to link'); } catch (e) {}
        return;
      }
      if (n === 4) {
        // Build tree from list
        if (build) build.open = true;
        if (reg) reg.open = true;
        uftDockOpenSection(build);
        try {
          var box = document.getElementById('uft-build-from-cards');
          if (box) box.hidden = false;
          if (typeof uftRefreshCardPicker === 'function') uftRefreshCardPicker();
          var selfSel = document.getElementById('uft-bc-self');
          if (selfSel) selfSel.focus();
        } catch (e) {}
        try { if (typeof uftSetStatus === 'function') uftSetStatus('Step 4 · Build tree — map focus person & generations, then Apply'); } catch (e) {}
        return;
      }
      if (n === 5) {
        // Vitals on cards — collapse dock so tree cards are usable, or scroll vital controls
        try {
          if (typeof uftSetView === 'function') uftSetView('pedigree');
          if (typeof uftRender === 'function') uftRender({ keepScroll: true });
        } catch (e) {}
        if (vitals && vitals.closest) {
          var wrap = vitals.closest('label') || vitals.closest('.uft-reg-section') || vitals;
          uftDockOpenSection(wrap);
          try {
            var who = document.getElementById('uft-vital-who');
            if (who) who.focus();
          } catch (e) {}
        } else {
          try {
            if (typeof uftCollapseEditor === 'function') uftCollapseEditor();
            var prev = document.getElementById('uft-preview');
            if (prev) prev.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } catch (e) {}
        }
        try { if (typeof uftSetStatus === 'function') uftSetStatus('Step 5 · Vitals — set Alive/Deceased, gender & year on each tree card'); } catch (e) {}
        return;
      }
    }
    try { window.uftDockStep = uftDockStep; } catch (e) {}

    function uftToggleEditor() {
      const ed = uftEditorEl();
      if (!ed) return;
      ed.classList.toggle('collapsed');
      const btn = document.getElementById('uft-editor-toggle');
      if (btn) btn.textContent = ed.classList.contains('collapsed') ? '✎ Names & registry' : '✕ Close';
      try {
        if (!ed.classList.contains('collapsed')) {
          const body = ed.querySelector('.uft-dock-body');
          if (body) body.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } catch (e) {}
    }
    function uftCollapseEditor() {
      const ed = uftEditorEl();
      if (!ed) return;
      ed.classList.add('collapsed');
      const btn = document.getElementById('uft-editor-toggle');
      if (btn) btn.textContent = '✎ Names & registry';
    }
    function uftExpandEditor() {
      const ed = uftEditorEl();
      if (!ed) return;
      ed.classList.remove('collapsed');
      const btn = document.getElementById('uft-editor-toggle');
      if (btn) btn.textContent = '✕ Close';
      /* Save/download section stays collapsed until user opens it while editing names */
      try {
        const ops = document.getElementById('uft-file-ops-section');
        if (ops) ops.open = false;
      } catch (e) {}
    }
    const UFT_LIB_KEY = 'clarity_uft_library_v1';
    let uftSaveTimer = null;
    function uftWhen(iso) {
      try {
        const dt = new Date(iso);
        if (isNaN(dt.getTime())) return '';
        return dt.toLocaleString();
      } catch (e) { return ''; }
    }
    function uftSetStatus(msg) {
      const el = document.getElementById('uft-status');
      if (el) el.textContent = msg || '';
    }
    function uftPersist(d, quiet) {
      const stage = document.getElementById('uft-stage');
      if (stage) d.skin = stage.getAttribute('data-skin') || 'green';
      d.view = uftView;
      d.savedAt = new Date().toISOString();
      try { clarityLS.setItem(UFT_KEY, JSON.stringify(d)); } catch (e) {}
      if (!quiet) uftSetStatus('Saved on this device · ' + uftWhen(d.savedAt));
      return d;
    }
    function uftReadLib() {
      try { return JSON.parse(clarityLS.getItem(UFT_LIB_KEY) || '[]'); }
      catch (e) { return []; }
    }
    function uftWriteLib(list) {
      try { clarityLS.setItem(UFT_LIB_KEY, JSON.stringify(list.slice(0, 12))); } catch (e) {}
    }
    function uftRefreshLibrary() {
      const sel = document.getElementById('uft-library');
      if (!sel) return;
      const list = uftReadLib();
      const cur = sel.value;
      sel.innerHTML = '<option value="">Saved copies…</option>' + list.map(function (s) {
        return '<option value="' + uftEsc(s.id) + '">' + uftEsc((s.name || 'Copy') + ' · ' + uftWhen(s.savedAt)) + '</option>';
      }).join('');
      if (cur) sel.value = cur;
    }
    function uftSnapshot() {
      const d = uftPersist(uftCollect());
      const name = prompt('Name this saved copy', (d.self || 'Family tree').trim() || 'Family tree');
      if (name === null) return;
      const list = uftReadLib();
      list.unshift({ id: 'uft_' + Date.now(), name: String(name || 'Family tree').slice(0, 60), savedAt: d.savedAt, data: d });
      uftWriteLib(list);
      uftRefreshLibrary();
      uftSetStatus('Named copy saved on this device · ' + uftWhen(d.savedAt));
    }
    function uftLoadSnapshot(id) {
      if (!id) return;
      const hit = uftReadLib().find(function (s) { return s.id === id; });
      if (!hit || !hit.data) return;
      uftApplyData(hit.data);
      try { uftCollapseEditor(); } catch (e) {}
      uftSetStatus('Loaded copy “' + (hit.name || 'Family tree') + '”');
    }
    function uftSave() {
      const pending = ((document.getElementById('uft-rel-name') || {}).value || '').trim() ||
        ((document.getElementById('uft-rel-pick') || {}).value || '').trim();
      if (pending) uftAddRel();
      const d = uftPersist(uftCollect());
      uftRenderRelList();
      uftRefreshAnchorOptions();
      uftFillNameChoices();
      try { if (typeof uftSetView === 'function') uftSetView('pedigree'); } catch (eV) {}
      uftRender({ keepScroll: false });
      // Collapse registry dock so pedigree fills the workspace (not the member list)
      try { if (typeof uftCollapseEditor === 'function') uftCollapseEditor(); } catch (eC) {}
      try {
        const prev = document.getElementById('uft-preview');
        if (prev) prev.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (eS) {}
      try { uftSetStatus('Pedigree saved · showing tree in workspace'); } catch (eSt) {}
      return d;
    }
    function uftScheduleSave() {
      if (uftSaveTimer) clearTimeout(uftSaveTimer);
      uftSaveTimer = setTimeout(function () {
        uftPersist(uftCollect(), true);
        uftSetStatus('Auto-saved on this device · ' + new Date().toLocaleTimeString());
      }, 450);
    }
    function uftDownload() {
      uftSave();
      const d = uftRead();
      if (typeof uftEnsurePeople === 'function') {
        try { d.people = uftEnsurePeople(Object.assign({}, d)).people; } catch (e) {}
      }
      d.exportedAt = new Date().toISOString();
      d.exportType = 'clarity-family-members';
      const blob = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      const who = (d.self || 'family-tree').replace(/[^\w\-]+/g, '_').slice(0, 40);
      const day = new Date().toISOString().slice(0, 10);
      a.href = URL.createObjectURL(blob);
      a.download = 'clarity-family-members-' + who + '-' + day + '.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
      if (typeof uftSetStatus === 'function') uftSetStatus('Members downloaded · keep this file to upload later');
    }

    var UFT_CARDS_KEY = 'clarity_uft_member_cards_v1';
    function uftGetStoredCards() {
      try { return JSON.parse(clarityLS.getItem(UFT_CARDS_KEY) || '[]'); } catch (e) { return []; }
    }
    function uftSetStoredCards(cards) {
      try { clarityLS.setItem(UFT_CARDS_KEY, JSON.stringify(cards || [])); } catch (e) {}
      uftRefreshCardPicker();
      try { if (typeof uftRegRenderLoaded === 'function') uftRegRenderLoaded(); } catch (e) {}
    }
    function uftCardDedupeKey(c) {
      const n = (typeof uftNorm === 'function') ? uftNorm(c && c.name) : String((c && c.name) || '').trim().toLowerCase();
      return n;
    }
    function uftCardRichness(c) {
      if (!c) return 0;
      let s = 0;
      if (c.phone) s += 2;
      if (c.email) s += 2;
      if (c.city) s += 1;
      if (c.gender) s += 1;
      if (c.vital) s += 1;
      if (c.born || c.year) s += 1;
      if (c.generationHint || c.slot) s += 1;
      if (c.note) s += 1;
      return s;
    }
    function uftScanLoadedDuplicates() {
      const cards = uftGetStoredCards();
      if (!cards.length) {
        if (typeof uftSetStatus === 'function') uftSetStatus('No loaded cards to scan.');
        return;
      }
      const best = {};
      const order = [];
      cards.forEach(function (c, idx) {
        const k = uftCardDedupeKey(c);
        if (!k) return;
        if (!best[k]) {
          best[k] = { card: c, idx: idx };
          order.push(k);
        } else if (uftCardRichness(c) > uftCardRichness(best[k].card)) {
          best[k] = { card: c, idx: idx };
        }
      });
      const kept = order.map(function (k) { return best[k].card; });
      const removed = cards.length - kept.length;
      if (!removed) {
        if (typeof uftSetStatus === 'function') uftSetStatus('Scan complete · no duplicate names found (' + cards.length + ' cards).');
        return;
      }
      if (!confirm('Scan & delete duplicates\n\nFound ' + removed + ' duplicate name(s) among ' + cards.length + ' loaded cards.\n\nOK = keep the fullest record for each name and permanently delete ' + removed + ' duplicate(s) from this device.\nCancel = leave cards unchanged.')) return;
      uftSetStoredCards(kept);
      if (typeof uftRegRenderLoaded === 'function') uftRegRenderLoaded();
      if (typeof uftSetStatus === 'function') uftSetStatus('Removed ' + removed + ' duplicate(s) · ' + kept.length + ' unique loaded cards kept.');
    }
        function uftOffloadLoadedCards() {
      const cards = (typeof uftGetStoredCards === 'function') ? uftGetStoredCards() : [];
      if (!cards.length) {
        if (typeof uftSetStatus === 'function') uftSetStatus('No loaded cards to offload.');
        return;
      }
      const n = cards.length;
      if (!confirm('Offload ' + n + ' loaded member card(s)?\n\nOK = download a JSON backup, then remove them from this device.\nCancel = keep the list.\n\nThe pedigree tree and registry contacts are not deleted.')) return;
      try {
        const payload = {
          type: 'clarity-member-cards',
          version: 1,
          exportedAt: new Date().toISOString(),
          count: n,
          cards: cards
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'clarity-loaded-members-offload-' + new Date().toISOString().slice(0, 10) + '.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { try { URL.revokeObjectURL(a.href); } catch (e) {} }, 1500);
      } catch (e) {
        alert('Could not download offload file.');
        return;
      }
      uftSetStoredCards([]);
      if (typeof uftRegRenderLoaded === 'function') uftRegRenderLoaded();
      if (typeof uftFillBuildCardSelects === 'function') {
        try { uftFillBuildCardSelects(); } catch (e2) {}
      }
      if (typeof uftSetStatus === 'function') uftSetStatus('Offloaded ' + n + ' card(s) · loaded list cleared on this device.');
    }
function uftClearLoadedCards() {
      const cards = uftGetStoredCards();
      if (!cards.length) {
        if (typeof uftSetStatus === 'function') uftSetStatus('Loaded list is already empty.');
        return;
      }
      if (!confirm('Clear all ' + cards.length + ' loaded member cards from this device?\n\nThe family tree and registry contacts are not deleted.')) return;
      uftSetStoredCards([]);
      if (typeof uftRegRenderLoaded === 'function') uftRegRenderLoaded();
      if (typeof uftSetStatus === 'function') uftSetStatus('Loaded member cards cleared.');
    }
    var uftPickCtx = null;
    function uftOpenPersonPicker(hostName, hostSlot, relation) {
      uftPickCtx = { hostName: hostName, hostSlot: hostSlot || '', relation: relation || 'child' }; try { window.uftPickCtx = uftPickCtx; } catch (eCtx) {}
      const modal = document.getElementById('uft-pick-modal');
      const title = document.getElementById('uft-pick-title');
      const sub = document.getElementById('uft-pick-sub');
      const search = document.getElementById('uft-pick-search');
      const typed = document.getElementById('uft-pick-typed');
      if (title) title.textContent = 'Add ' + relation + ' of ' + hostName;
      if (sub) sub.textContent = 'Pick from loaded members, or type a new name below';
      if (search) search.value = '';
      if (typed) typed.value = '';
      uftRenderPickList('');
      if (modal) {
        modal.hidden = false;
        modal.removeAttribute('hidden');
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        try { modal.scrollIntoView({ block: 'nearest' }); } catch (e0) {}
        setTimeout(function () { try { if (search) search.focus(); } catch (e) {} }, 60);
      } else {
        console.warn('uft-pick-modal missing');
      }
    }
    try { window.uftOpenPersonPicker = uftOpenPersonPicker; } catch (e) {}
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        const pm = document.getElementById('uft-pick-modal');
        if (pm && !pm.hidden) uftClosePersonPicker();
      }
    });
    function uftClosePersonPicker() {
      uftPickCtx = null;
      const modal = document.getElementById('uft-pick-modal');
      if (modal) {
        modal.hidden = true;
        modal.setAttribute('hidden', '');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
      }
      const menu = document.getElementById('uft-rel-menu');
      if (menu) menu.hidden = true;
    }
    try { window.uftClosePersonPicker = uftClosePersonPicker; } catch (e) {}
    function uftRenderPickList(q) {
      const box = document.getElementById('uft-pick-list');
      if (!box) return;
      q = String(q || '').trim().toLowerCase();
      const cards = (typeof uftGetStoredCards === 'function') ? uftGetStoredCards() : [];
      let rows = cards.filter(function (c) {
        if (!c || !c.name) return false;
        if (!q) return true;
        const blob = [c.name, c.generationHint, c.slot, c.city, c.phone].join(' ').toLowerCase();
        return blob.indexOf(q) >= 0;
      });
      // also include registry + tree names not in cards (for linking relations)
      try {
        const d = typeof uftCollect === 'function' ? uftCollect() : {};
        function pushName(name, hint) {
          if (!name) return;
          if (rows.some(function (c) { return typeof uftSame === 'function' && uftSame(c.name, name); })) return;
          if (q && String(name).toLowerCase().indexOf(q) < 0 && String(hint || '').toLowerCase().indexOf(q) < 0) return;
          rows.push({ name: name, generationHint: hint || 'tree', _fromTree: true });
        }
        (d.registry || []).forEach(function (r) {
          if (!r || !r.name) return;
          pushName(r.name, r.role || 'registry');
        });
        ['self','spouse','father','mother','pgf','pgm','mgf','mgm'].forEach(function (s) { pushName(d[s], s); });
        (typeof uftLines === 'function' ? [] : []).forEach(function () {});
        ['g1','g2','g3','siblings','children','grandchildren'].forEach(function (f) {
          (typeof uftLines === 'function' ? uftLines(d[f]) : []).forEach(function (n) { pushName(n, f); });
        });
        (d.relatives || []).forEach(function (r) {
          if (r && r.name) pushName(r.name, r.relation || 'relative');
        });
      } catch (e) {}
      if (!rows.length) {
        box.innerHTML = '<p class="uft-hint" style="padding:0.5rem;">No matches. Type a new name below, or upload member cards first.</p>';
        return;
      }
      box.innerHTML = rows.slice(0, 80).map(function (c, i) {
        var bits = [c.generationHint || c.slot, c.gender, c.vital, c.phone, c._fromReg ? 'registry' : ''].filter(Boolean).join(' · ');
        var nm = String(c.name || '');
        return '<button type="button" class="uft-pick-item" data-pick-name="' + uftEsc(nm).replace(/"/g, '&quot;') + '">' +
          '<strong>' + uftEsc(nm) + '</strong>' +
          (bits ? '<small>' + uftEsc(bits) + '</small>' : '') + '</button>';
      }).join('');
      if (!box.dataset.pickBound) {
        box.dataset.pickBound = '1';
        box.addEventListener('click', function (ev) {
          var b = ev.target && ev.target.closest && ev.target.closest('[data-pick-name]');
          if (!b) return;
          ev.preventDefault();
          var nm = b.getAttribute('data-pick-name') || '';
          var fn = window.uftConfirmPickName || (typeof uftConfirmPickName === 'function' ? uftConfirmPickName : null);
          if (fn) fn(nm);
        });
      }
    }

    // ----- Pedigree workspace zoom -----
    var uftZoomLevel = 1;

        function uftEnsureZoomLayer(html) {
      var preview = document.getElementById('uft-preview');
      if (!preview) return;
      var layer = document.getElementById('uft-zoom-layer');
      if (!layer) {
        layer = document.createElement('div');
        layer.id = 'uft-zoom-layer';
        layer.className = 'uft-zoom-layer';
        // Move any existing preview children into the layer
        while (preview.firstChild) layer.appendChild(preview.firstChild);
        preview.appendChild(layer);
      } else if (layer.parentNode !== preview) {
        preview.appendChild(layer);
      }
      if (typeof html === 'string') {
        layer.innerHTML = html;
      }
      try { uftZoomApply(); } catch (e) {}
    }

    function uftEnsureZoomSizer(layer) {
      if (!layer) return null;
      var sizer = document.getElementById('uft-zoom-sizer');
      if (!sizer) {
        sizer = document.createElement('div');
        sizer.id = 'uft-zoom-sizer';
        sizer.className = 'uft-zoom-sizer';
        var parent = layer.parentNode;
        if (!parent) return null;
        parent.insertBefore(sizer, layer);
        sizer.appendChild(layer);
      } else if (layer.parentNode !== sizer) {
        sizer.appendChild(layer);
      }
      return sizer;
    }
    function uftZoomApply(opts) {
      opts = opts || {};
      var layer = document.getElementById('uft-zoom-layer');
      var lab = document.getElementById('uft-zoom-label');
      var preview = document.getElementById('uft-preview');
      if (layer) {
        var sizer = uftEnsureZoomSizer(layer);
        layer.style.willChange = 'transform';
        layer.style.transformOrigin = '0 0';
        layer.style.transform = 'scale(' + uftZoomLevel + ')';
        // Size the sizer to scaled content so native scroll pans smoothly (no layout thrash mid-gesture)
        var applySize = function () {
          if (!layer) return;
          var w = Math.max(layer.scrollWidth || 0, layer.offsetWidth || 0, 1);
          var h = Math.max(layer.scrollHeight || 0, layer.offsetHeight || 0, 1);
          if (sizer) {
            sizer.style.width = (w * uftZoomLevel) + 'px';
            sizer.style.minWidth = (w * uftZoomLevel) + 'px';
            sizer.style.height = (h * uftZoomLevel) + 'px';
            sizer.style.minHeight = (h * uftZoomLevel) + 'px';
          }
        };
        if (opts.immediate) {
          applySize();
        } else {
          if (window._uftZoomSizeRaf) cancelAnimationFrame(window._uftZoomSizeRaf);
          window._uftZoomSizeRaf = requestAnimationFrame(function () {
            applySize();
            window._uftZoomSizeRaf = requestAnimationFrame(applySize);
          });
        }
      }
      if (lab) lab.textContent = Math.round(uftZoomLevel * 100) + '%';
      try { clarityLS.setItem('uft_zoom_level', String(uftZoomLevel)); } catch (e) {}
    }
    function uftZoomSet(level, opts) {
      uftZoomLevel = Math.max(0.55, Math.min(2.2, Math.round(level * 100) / 100));
      uftZoomApply(opts);
    }
    function uftZoomBy(delta, opts) {
      uftZoomSet(uftZoomLevel + delta, opts);
    }
    function uftZoomReset() {
      uftZoomLevel = 1;
      uftZoomApply({ immediate: true });
      var preview = document.getElementById('uft-preview');
      if (preview) {
        try {
          preview.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
        } catch (e) {
          preview.scrollLeft = 0;
          preview.scrollTop = 0;
        }
      }
    }

    function uftZoomInit() {
      try {
        var z = parseFloat(clarityLS.getItem('uft_zoom_level') || '1');
        if (isFinite(z) && z >= 0.55 && z <= 2.2) uftZoomLevel = z;
      } catch (e) {}
      try { uftZoomApply({ immediate: true }); } catch (e) {}

      var preview = document.getElementById('uft-preview');
      if (!preview) return;

      // Re-bind only once per element life, but allow forced refresh via dataset reset
      if (preview.dataset.zoomBound === '1') {
        // still refresh label/size
        try { uftZoomApply({ immediate: true }); } catch (e) {}
        return;
      }
      preview.dataset.zoomBound = '1';
      preview.style.scrollBehavior = 'auto';
      preview.style.overscrollBehavior = 'contain';
      preview.style.touchAction = 'pan-x pan-y pinch-zoom';

      // Ctrl/meta + wheel zoom toward cursor
      preview.addEventListener('wheel', function (ev) {
        if (!(ev.ctrlKey || ev.metaKey)) return;
        ev.preventDefault();
        var rect = preview.getBoundingClientRect();
        var mx = ev.clientX - rect.left + preview.scrollLeft;
        var my = ev.clientY - rect.top + preview.scrollTop;
        var prev = uftZoomLevel;
        uftZoomBy(ev.deltaY > 0 ? -0.08 : 0.08, { immediate: true });
        var ratio = uftZoomLevel / (prev || 1);
        preview.scrollLeft = mx * ratio - (ev.clientX - rect.left);
        preview.scrollTop = my * ratio - (ev.clientY - rect.top);
      }, { passive: false });

      // Continuous pinch zoom
      var pinchStart = 0, pinchZoom0 = 1, pinchMidX = 0, pinchMidY = 0;
      preview.addEventListener('touchstart', function (ev) {
        if (ev.touches.length === 2) {
          var dx = ev.touches[0].clientX - ev.touches[1].clientX;
          var dy = ev.touches[0].clientY - ev.touches[1].clientY;
          pinchStart = Math.hypot(dx, dy) || 1;
          pinchZoom0 = uftZoomLevel;
          var rect = preview.getBoundingClientRect();
          pinchMidX = ((ev.touches[0].clientX + ev.touches[1].clientX) / 2) - rect.left + preview.scrollLeft;
          pinchMidY = ((ev.touches[0].clientY + ev.touches[1].clientY) / 2) - rect.top + preview.scrollTop;
        }
      }, { passive: true });
      preview.addEventListener('touchmove', function (ev) {
        if (ev.touches.length !== 2 || !pinchStart) return;
        ev.preventDefault();
        var dx = ev.touches[0].clientX - ev.touches[1].clientX;
        var dy = ev.touches[0].clientY - ev.touches[1].clientY;
        var dist = Math.hypot(dx, dy) || 1;
        var prev = uftZoomLevel;
        uftZoomSet(pinchZoom0 * (dist / pinchStart), { immediate: true });
        var rect = preview.getBoundingClientRect();
        var cx = ((ev.touches[0].clientX + ev.touches[1].clientX) / 2) - rect.left;
        var cy = ((ev.touches[0].clientY + ev.touches[1].clientY) / 2) - rect.top;
        preview.scrollLeft = pinchMidX * (uftZoomLevel / (pinchZoom0 || 1)) - cx;
        preview.scrollTop = pinchMidY * (uftZoomLevel / (pinchZoom0 || 1)) - cy;
      }, { passive: false });
      preview.addEventListener('touchend', function () { pinchStart = 0; }, { passive: true });
      preview.addEventListener('touchcancel', function () { pinchStart = 0; }, { passive: true });

      // Double-tap / double-click → reset zoom (works on Edge mobile)
      var lastTap = 0;
      var lastTapX = 0, lastTapY = 0;
      function handlePossibleDoubleTap(clientX, clientY, ev) {
        var now = Date.now();
        var dt = now - lastTap;
        var dist = Math.hypot((clientX || 0) - lastTapX, (clientY || 0) - lastTapY);
        if (dt > 0 && dt < 450 && dist < 40) {
          if (ev && ev.preventDefault) ev.preventDefault();
          lastTap = 0;
          try { uftZoomReset(); } catch (e) {}
          try {
            if (typeof uftSetStatus === 'function') uftSetStatus('Zoom reset · 100%');
          } catch (e2) {}
          return true;
        }
        lastTap = now;
        lastTapX = clientX || 0;
        lastTapY = clientY || 0;
        return false;
      }
      preview.addEventListener('touchend', function (ev) {
        if (ev.touches && ev.touches.length) return; // still touching
        if (pinchStart) return;
        var t = (ev.changedTouches && ev.changedTouches[0]) ? ev.changedTouches[0] : null;
        if (!t) return;
        handlePossibleDoubleTap(t.clientX, t.clientY, ev);
      }, { passive: false });
      preview.addEventListener('dblclick', function (ev) {
        ev.preventDefault();
        try { uftZoomReset(); } catch (e) {}
      });

      // Drag-to-pan with pointer (mouse / pen)
      var drag = null;
      preview.addEventListener('pointerdown', function (ev) {
        if (ev.pointerType === 'touch') return;
        if (ev.button !== 0) return;
        if (ev.target && ev.target.closest && ev.target.closest('button, a, input, select, textarea')) return;
        drag = { id: ev.pointerId, x: ev.clientX, y: ev.clientY, sl: preview.scrollLeft, st: preview.scrollTop };
        try { preview.setPointerCapture(ev.pointerId); } catch (e) {}
        preview.style.cursor = 'grabbing';
      });
      preview.addEventListener('pointermove', function (ev) {
        if (!drag || drag.id !== ev.pointerId) return;
        preview.scrollLeft = drag.sl - (ev.clientX - drag.x);
        preview.scrollTop = drag.st - (ev.clientY - drag.y);
      });
      function endPanDrag(ev) {
        if (!drag) return;
        if (ev && drag.id !== ev.pointerId) return;
        drag = null;
        preview.style.cursor = '';
      }
      preview.addEventListener('pointerup', endPanDrag);
      preview.addEventListener('pointercancel', endPanDrag);
      preview.addEventListener('lostpointercapture', endPanDrag);

      // Stage wheel zoom when not over preview
      var stage = document.getElementById('uft-stage');
      if (stage && stage.dataset.zoomWheelBound !== '1') {
        stage.dataset.zoomWheelBound = '1';
        stage.addEventListener('wheel', function (ev) {
          if (!(ev.ctrlKey || ev.metaKey)) return;
          if (ev.target && ev.target.closest && ev.target.closest('#uft-preview')) return;
          ev.preventDefault();
          uftZoomBy(ev.deltaY > 0 ? -0.08 : 0.08, { immediate: true });
        }, { passive: false });
      }
    }

    // Expose zoom helpers globally (inline onclick / mobile webviews)
    try {
      window.uftZoomInit = uftZoomInit;
      window.uftZoomReset = uftZoomReset;
      window.uftZoomBy = uftZoomBy;
      window.uftZoomApply = uftZoomApply;
      window.uftDownloadPng = uftDownloadPng;
      window.uftOffloadLoadedCards = uftOffloadLoadedCards;
      window.uftScanLoadedDuplicates = uftScanLoadedDuplicates;
      window.uftClearLoadedCards = uftClearLoadedCards;
    } catch (eExp) {}

    function uftFilterLoadedList(q) {
      q = String(q || '').trim().toLowerCase();
      var box = document.getElementById('uft-reg-loaded-list');
      if (!box) return;
      var rows = box.querySelectorAll('.uft-reg-loaded-row');
      var shown = 0;
      rows.forEach(function (row) {
        var text = (row.getAttribute('data-search') || row.textContent || '').toLowerCase();
        var ok = !q || text.indexOf(q) >= 0;
        row.hidden = !ok;
        if (ok) shown++;
      });
      var empty = box.querySelector('.uft-loaded-empty');
      if (empty) empty.remove();
      if (q && shown === 0 && rows.length) {
        var p = document.createElement('p');
        p.className = 'uft-hint uft-loaded-empty';
        p.textContent = 'No loaded members match “' + q + '”.';
        box.appendChild(p);
      }
    }

    function uftFilterPickList(q) { uftRenderPickList(q); }
    function uftConfirmPickTyped() {
      const el = document.getElementById('uft-pick-typed');
      const name = el ? String(el.value || '').trim() : '';
      if (!name) {
        if (typeof uftSetStatus === 'function') uftSetStatus('Type a name or pick from the list.');
        return;
      }
      uftConfirmPickName(name);
    }
    function uftConfirmPickName(name) {
      try {
        var ctx = uftPickCtx || window.uftPickCtx;
        if (!ctx || !name) return;
        var host = ctx.hostName, slot = ctx.hostSlot, rel = ctx.relation;
        if (typeof uftClosePersonPicker === 'function') uftClosePersonPicker();
        else if (window.uftClosePersonPicker) window.uftClosePersonPicker();
        var apply = (typeof uftApplyRelativeLink === 'function') ? uftApplyRelativeLink : window.uftApplyRelativeLink;
        if (typeof apply === 'function') apply(host, slot, rel, String(name).trim());
      } catch (err) {
        console.error('uftConfirmPickName', err);
      }
    }
    try {
      window.uftConfirmPickName = uftConfirmPickName;
      window.uftConfirmPickTyped = uftConfirmPickTyped;
      window.uftFilterPickList = uftFilterPickList;
      window.uftRenderPickList = uftRenderPickList;
      window.uftOpenPersonPicker = uftOpenPersonPicker;
      window.uftClosePersonPicker = uftClosePersonPicker;
      /* uftQuickAddRelative is defined later (DOMContentLoaded scope) — bound there */
    } catch (ePickExp) {}

    function uftCardOptionLabel(c) {
      return (c.name || '') + (c.generationHint ? ' · ' + c.generationHint : '') +
        (c.vital === 'deceased' ? ' †' : '') + (c.gender ? ' · ' + c.gender : '');
    }
    function uftFillCardSelect(sel, cards, multi) {
      if (!sel) return;
      const prev = multi
        ? Array.prototype.map.call(sel.selectedOptions || [], function (o) { return o.value; })
        : sel.value;
      const blank = multi ? '' : '<option value="">Select…</option>';
      sel.innerHTML = blank + cards.map(function (c, i) {
        return '<option value="' + i + '">' + String(uftCardOptionLabel(c)).replace(/</g, '') + '</option>';
      }).join('');
      if (multi && prev && prev.length) {
        Array.prototype.forEach.call(sel.options, function (o) {
          if (prev.indexOf(o.value) >= 0) o.selected = true;
        });
      } else if (!multi && prev) {
        sel.value = prev;
      }
    }
    function uftRefreshCardPicker() {
      const cards = uftGetStoredCards();
      const panel = document.getElementById('uft-build-from-cards');
      if (panel) panel.hidden = !cards.length;

      const sel = document.getElementById('uft-rel-cards');
      if (sel) {
        const cur = sel.value;
        sel.innerHTML = '<option value="">1. Pick from loaded member cards…</option>' +
          cards.map(function (c, i) {
            return '<option value="' + i + '">' + String(uftCardOptionLabel(c)).replace(/</g, '') + '</option>';
          }).join('');
        if (cur) sel.value = cur;
      }
      // Build-from-cards selectors
      ['self','spouse','father','mother','pgf','pgm','mgf','mgm'].forEach(function (k) {
        uftFillCardSelect(document.getElementById('uft-bc-' + k), cards, false);
      });
      ['g1','g2','g3','siblings','children','grandchildren'].forEach(function (k) {
        uftFillCardSelect(document.getElementById('uft-bc-' + k), cards, true);
      });
      // datalist
      const dl = document.getElementById('uft-rel-name-list');
      if (dl) {
        const existing = {};
        Array.prototype.forEach.call(dl.querySelectorAll('option'), function (o) { existing[o.value] = true; });
        cards.forEach(function (c) {
          if (c.name && !existing[c.name]) {
            const opt = document.createElement('option');
            opt.value = c.name;
            dl.appendChild(opt);
          }
        });
      }
    }
    function uftSelectedCardNames(selId) {
      const sel = document.getElementById(selId);
      const cards = uftGetStoredCards();
      if (!sel) return [];
      const idxs = sel.multiple
        ? Array.prototype.map.call(sel.selectedOptions || [], function (o) { return parseInt(o.value, 10); })
        : (sel.value === '' ? [] : [parseInt(sel.value, 10)]);
      const names = [];
      idxs.forEach(function (i) {
        if (!isNaN(i) && cards[i] && cards[i].name) names.push(String(cards[i].name).trim());
      });
      return names;
    }
    function uftApplyBuildFromCards() {
      const cards = uftGetStoredCards();
      if (!cards.length) {
        alert('Upload member cards first (Upload → Member cards → picker list).');
        return;
      }
      const selfNames = uftSelectedCardNames('uft-bc-self');
      if (!selfNames.length) {
        alert('Select the focus person from the member cards list.');
        return;
      }
      function one(id) {
        const n = uftSelectedCardNames(id);
        return n[0] || '';
      }
      function many(id) {
        return uftSelectedCardNames(id);
      }
      const f = uftFields();
      if (f.self) f.self.value = selfNames[0];
      if (f.spouse) f.spouse.value = one('uft-bc-spouse');
      if (f.father) f.father.value = one('uft-bc-father');
      if (f.mother) f.mother.value = one('uft-bc-mother');
      if (f.pgf) f.pgf.value = one('uft-bc-pgf');
      if (f.pgm) f.pgm.value = one('uft-bc-pgm');
      if (f.mgf) f.mgf.value = one('uft-bc-mgf');
      if (f.mgm) f.mgm.value = one('uft-bc-mgm');
      if (f.g1) f.g1.value = many('uft-bc-g1').join('\n');
      if (f.g2) f.g2.value = many('uft-bc-g2').join('\n');
      if (f.g3) f.g3.value = many('uft-bc-g3').join('\n');
      if (f.siblings) f.siblings.value = many('uft-bc-siblings').join('\n');
      if (f.children) f.children.value = many('uft-bc-children').join('\n');
      if (f.grandchildren) f.grandchildren.value = many('uft-bc-grandchildren').join('\n');

      // Apply gender/vital from cards for chosen people
      function applyMeta(name, preferSlot) {
        if (!name) return;
        const c = cards.find(function (x) {
          return x && (typeof uftSame === 'function' ? uftSame(x.name, name) : x.name === name);
        });
        if (!c) return;
        try {
          if (c.gender && typeof uftSetGenderFor === 'function') uftSetGenderFor(name, c.gender, preferSlot || c.slot || '');
          if (c.vital && typeof uftSetVitalFor === 'function') uftSetVitalFor(name, c.vital, preferSlot || c.slot || '');
          if (c.born && typeof uftSetBornFor === 'function') uftSetBornFor(name, c.born, preferSlot || c.slot || '');
        } catch (e) {}
      }
      applyMeta(selfNames[0], 'self');
      applyMeta(one('uft-bc-spouse'), 'spouse');
      applyMeta(one('uft-bc-father'), 'father');
      applyMeta(one('uft-bc-mother'), 'mother');
      applyMeta(one('uft-bc-pgf'), 'pgf');
      applyMeta(one('uft-bc-pgm'), 'pgm');
      applyMeta(one('uft-bc-mgf'), 'mgf');
      applyMeta(one('uft-bc-mgm'), 'mgm');
      many('uft-bc-g1').forEach(function (n) { applyMeta(n, 'g1'); });
      many('uft-bc-g2').forEach(function (n) { applyMeta(n, 'g2'); });
      many('uft-bc-g3').forEach(function (n) { applyMeta(n, 'g3'); });
      many('uft-bc-siblings').forEach(function (n) { applyMeta(n, ''); });
      many('uft-bc-children').forEach(function (n) { applyMeta(n, ''); });

      if (typeof uftSave === 'function') uftSave();
      else if (typeof uftRender === 'function') uftRender();
      if (typeof uftSetStatus === 'function') uftSetStatus('Pedigree built from member cards · focus: ' + selfNames[0]);
    }
    function uftSuggestBuildFromCards() {
      const cards = uftGetStoredCards();
      if (!cards.length) {
        alert('Upload member cards first.');
        return;
      }
      function setOne(id, pred) {
        const sel = document.getElementById(id);
        if (!sel) return;
        for (let i = 0; i < cards.length; i++) {
          if (pred(cards[i], i)) { sel.value = String(i); return; }
        }
      }
      function setMany(id, pred) {
        const sel = document.getElementById(id);
        if (!sel) return;
        Array.prototype.forEach.call(sel.options, function (o) {
          const i = parseInt(o.value, 10);
          if (isNaN(i) || !cards[i]) { o.selected = false; return; }
          o.selected = !!pred(cards[i], i);
        });
      }
      function hit(c, re) {
        const s = ((c.generationHint || '') + ' ' + (c.slot || '') + ' ' + (c.role || '')).toLowerCase();
        return re.test(s);
      }
      setOne('uft-bc-self', function (c) { return hit(c, /\byou\b|focus|self/) || c.slot === 'self'; });
      setOne('uft-bc-spouse', function (c) { return hit(c, /spouse|wife|husband/) || c.slot === 'spouse'; });
      setOne('uft-bc-father', function (c) { return hit(c, /\bfather\b/) && !/grandfather|father.s father|pgf/i.test((c.generationHint||'')+(c.slot||'')); });
      setOne('uft-bc-mother', function (c) { return hit(c, /\bmother\b/) && !/grandmother|mother.s mother|mgm/i.test((c.generationHint||'')+(c.slot||'')); });
      setOne('uft-bc-pgf', function (c) { return hit(c, /pgf|father.?s father|paternal.*grand.*father/); });
      setOne('uft-bc-pgm', function (c) { return hit(c, /pgm|father.?s mother|paternal.*grand.*mother/); });
      setOne('uft-bc-mgf', function (c) { return hit(c, /mgf|mother.?s father|maternal.*grand.*father/); });
      setOne('uft-bc-mgm', function (c) { return hit(c, /mgm|mother.?s mother|maternal.*grand.*mother/); });
      setMany('uft-bc-g1', function (c) { return hit(c, /\bg1\b|3rd.?great|oldest/); });
      setMany('uft-bc-g2', function (c) { return hit(c, /\bg2\b|2nd.?great/); });
      setMany('uft-bc-g3', function (c) { return hit(c, /\bg3\b|great-grandparent|great.grand/); });
      setMany('uft-bc-siblings', function (c) { return hit(c, /sibling|brother|sister/) && !hit(c, /grand|uncle|aunt/); });
      setMany('uft-bc-children', function (c) { return hit(c, /\bchild|offspring|son|daughter/) && !hit(c, /grand/); });
      setMany('uft-bc-grandchildren', function (c) { return hit(c, /grandchild/); });
      if (typeof uftSetStatus === 'function') uftSetStatus('Suggestions filled from generation hints — review, then Apply');
    }
    function uftClearBuildFromCards() {
      ['self','spouse','father','mother','pgf','pgm','mgf','mgm'].forEach(function (k) {
        const sel = document.getElementById('uft-bc-' + k);
        if (sel) sel.value = '';
      });
      ['g1','g2','g3','siblings','children','grandchildren'].forEach(function (k) {
        const sel = document.getElementById('uft-bc-' + k);
        if (!sel) return;
        Array.prototype.forEach.call(sel.options, function (o) { o.selected = false; });
      });
    }

    function uftFilterCardSelects(query) {
      const q = String(query || '').trim().toLowerCase();
      // Keep both search boxes in sync
      const a = document.getElementById('uft-card-search');
      const b = document.getElementById('uft-rel-card-search');
      if (a && a.value.toLowerCase() !== q) a.value = query || '';
      if (b && b.value.toLowerCase() !== q) b.value = query || '';
      const cards = uftGetStoredCards();
      function match(c) {
        if (!q) return true;
        const name = String(c.name || '').toLowerCase();
        const hint = String(c.generationHint || '').toLowerCase();
        // prefix on any word in the name, or includes
        if (name.indexOf(q) === 0) return true;
        if (name.split(/\s+/).some(function (w) { return w.indexOf(q) === 0; })) return true;
        if (name.indexOf(q) >= 0) return true;
        if (hint.indexOf(q) >= 0) return true;
        return false;
      }
      const filtered = [];
      const indexMap = [];
      cards.forEach(function (c, i) {
        if (match(c)) { filtered.push(c); indexMap.push(i); }
      });
      function refill(sel, multi, placeholder) {
        if (!sel) return;
        const prev = multi
          ? Array.prototype.map.call(sel.selectedOptions || [], function (o) { return o.value; })
          : sel.value;
        let html = multi ? '' : ('<option value="">' + (placeholder || 'Select…') + '</option>');
        filtered.forEach(function (c, fi) {
          const realIdx = indexMap[fi];
          html += '<option value="' + realIdx + '">' + String(uftCardOptionLabel(c)).replace(/</g, '') + '</option>';
        });
        sel.innerHTML = html;
        if (multi && prev) {
          Array.prototype.forEach.call(sel.options, function (o) {
            if (prev.indexOf(o.value) >= 0) o.selected = true;
          });
        } else if (!multi && prev) {
          sel.value = prev;
        }
      }
      refill(document.getElementById('uft-rel-cards'), false, '1. Pick from loaded member cards…');
      ['self','spouse','father','mother','pgf','pgm','mgf','mgm'].forEach(function (k) {
        refill(document.getElementById('uft-bc-' + k), false, 'Select…');
      });
      ['g1','g2','g3','siblings','children','grandchildren'].forEach(function (k) {
        refill(document.getElementById('uft-bc-' + k), true, '');
      });
      if (typeof uftSetStatus === 'function' && q) {
        uftSetStatus(filtered.length + ' card(s) match “' + query + '”');
      }
    }

    function uftPickMemberCard(sel) {
      const cards = uftGetStoredCards();
      const i = parseInt(sel && sel.value, 10);
      if (isNaN(i) || !cards[i]) return;
      const c = cards[i];
      const nameEl = document.getElementById('uft-rel-name');
      if (nameEl) nameEl.value = c.name || '';
      const gEl = document.getElementById('uft-rel-gender');
      if (gEl && c.gender) gEl.value = c.gender;
      const vEl = document.getElementById('uft-rel-vital');
      if (vEl && c.vital) vEl.value = c.vital;
      const bEl = document.getElementById('uft-rel-born');
      if (bEl && c.born) bEl.value = c.born;
      // Suggest attach slot from generation hint
      const anchor = document.getElementById('uft-rel-anchor');
      if (anchor && c.slot) {
        const s = String(c.slot).toLowerCase();
        if (['self','spouse','father','mother','pgf','pgm','mgf','mgm','g1','g2','g3'].indexOf(s) >= 0) {
          // Don't force attach-to to be the person themselves; leave user to choose who they attach TO
        }
      }
      if (typeof uftSetStatus === 'function') {
        uftSetStatus('Selected card: ' + (c.name || '') + (c.generationHint ? ' (' + c.generationHint + ')' : '') + ' — choose Attach to + relation, then Add to tree');
      }
    }
    function uftRunDownloadMenu(sel) {
      const v = sel && sel.value;
      if (!v) return;
      if (v === 'cards') uftDownloadMemberCards();
      else if (v === 'csv') uftDownloadMemberCardsCsv();
      else if (v === 'tree') uftDownload();
      else if (v === 'png') uftDownloadPng();
      else if (v === 'text' || v === 'txt') uftDownloadTextTree();
      else if (v === 'pack' && typeof clarityExportPack === 'function') clarityExportPack();
      sel.value = '';
    }
    function uftRunUploadMenu(sel) {
      const v = sel && sel.value;
      if (!v) return;
      if (v === 'cards') document.getElementById('uft-cards-file').click();
      else if (v === 'tree') document.getElementById('uft-load-file').click();
      else if (v === 'pack') document.getElementById('uft-pack-file').click();
      sel.value = '';
    }

    /** Flat member cards: people only — no parent/child/spouse graph. */
    function uftCollectMemberCards() {
      const d = (typeof uftCollect === 'function') ? uftCollect() : {};
      const cards = [];
      const seen = {};
      function genRank(slot, role) {
        const s = String(slot || role || '').toLowerCase();
        if (s === 'g1') return { rank: 1, label: 'G1 · oldest / 3rd-great' };
        if (s === 'g2') return { rank: 2, label: 'G2 · 2nd-great' };
        if (s === 'g3') return { rank: 3, label: 'G3 · great-grandparent' };
        if (s === 'pgf' || s === 'pgm' || s === 'mgf' || s === 'mgm') return { rank: 4, label: 'Grandparent · ' + s };
        if (s === 'father' || s === 'mother') return { rank: 5, label: 'Parent · ' + s };
        if (s === 'self') return { rank: 6, label: 'Focus person' };
        if (s === 'spouse') return { rank: 6, label: 'Spouse' };
        if (s === 'sibling') return { rank: 6, label: 'Your generation · sibling' };
        if (s === 'child' || s === 'children' || s === 'offspring') return { rank: 7, label: 'Child / offspring' };
        if (s === 'grandchild' || s === 'grandchildren') return { rank: 8, label: 'Grandchild' };
        if (s === 'registry') return { rank: 9, label: 'Registry only' };
        return { rank: 9, label: role || slot || 'Unplaced' };
      }
      function push(name, slot, role) {
        const n = String(name || '').trim();
        if (!n) return;
        const norm = (typeof uftNorm === 'function') ? uftNorm(n) : n.toLowerCase();
        // One card per name+slot so two Nadir Alis in different gens stay separate
        const key = norm + '||' + String(slot || role || '');
        if (seen[key]) return;
        seen[key] = true;
        const ginfo = genRank(slot, role);
        let gender = '';
        let vital = '';
        let born = '';
        try {
          if (typeof uftGenderOf === 'function') gender = uftGenderOf(n, slot) || uftGenderOf(n, '') || '';
          if (typeof uftVitalOf === 'function') vital = uftVitalOf(n, slot) || uftVitalOf(n, '') || '';
          if (typeof uftBornOf === 'function') born = uftBornOf(n, slot) || uftBornOf(n, '') || '';
        } catch (e) {}
        let phone = '', email = '', city = '', note = '';
        (d.registry || []).forEach(function (r) {
          if (!r || !r.name) return;
          if ((typeof uftSame === 'function' ? uftSame(r.name, n) : r.name === n)) {
            if (r.phone) phone = r.phone;
            if (r.email) email = r.email;
            if (r.city) city = r.city;
            if (r.note) note = r.note;
            if (r.role && ginfo.rank === 9) {
              const g2 = genRank(r.role, r.role);
              if (g2.rank < ginfo.rank) { ginfo.rank = g2.rank; ginfo.label = g2.label; }
            }
          }
        });
        cards.push({
          name: n,
          generationHint: ginfo.label,
          generationRank: ginfo.rank,
          slot: slot || '',
          role: role || '',
          gender: gender || '',
          vital: vital || '',
          born: born || '',
          phone: phone,
          email: email,
          city: city,
          note: note
        });
      }
      ['self','spouse','father','mother','pgf','pgm','mgf','mgm'].forEach(function (s) {
        if (d[s]) push(d[s], s, s);
      });
      (typeof uftLines === 'function' ? uftLines(d.g1) : []).forEach(function (n) { push(n, 'g1', 'g1'); });
      (typeof uftLines === 'function' ? uftLines(d.g2) : []).forEach(function (n) { push(n, 'g2', 'g2'); });
      (typeof uftLines === 'function' ? uftLines(d.g3) : []).forEach(function (n) { push(n, 'g3', 'g3'); });
      (typeof uftLines === 'function' ? uftLines(d.siblings) : []).forEach(function (n) { push(n, 'sibling', 'sibling'); });
      (typeof uftLines === 'function' ? uftLines(d.children) : []).forEach(function (n) { push(n, 'child', 'child'); });
      (typeof uftLines === 'function' ? uftLines(d.grandchildren) : []).forEach(function (n) { push(n, 'grandchild', 'grandchild'); });
      (d.relatives || []).forEach(function (r) {
        if (r && r.name) push(r.name, r.anchor || '', r.relation || '');
      });
      (d.registry || []).forEach(function (r) {
        if (r && r.name) push(r.name, r.role || 'registry', r.role || 'registry');
      });
      cards.sort(function (a, b) {
        if (a.generationRank !== b.generationRank) return a.generationRank - b.generationRank;
        return String(a.name).localeCompare(String(b.name));
      });
      return cards;
    }
    function uftDownloadMemberCards() {
      if (typeof uftSave === 'function') uftSave();
      const cards = uftCollectMemberCards();
      const payload = {
        app: 'Clarity',
        exportType: 'clarity-member-cards',
        note: 'Flat member cards only. No parent/child/spouse links. Use generationHint / generationRank to rebuild the pedigree in order (1 = oldest).',
        exportedAt: new Date().toISOString(),
        count: cards.length,
        cards: cards
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'clarity-member-cards-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
      if (typeof uftSetStatus === 'function') uftSetStatus(cards.length + ' member cards downloaded (no tree links)');
    }
    function uftDownloadMemberCardsCsv() {
      const cards = uftCollectMemberCards();
      function esc(v) {
        const s = String(v == null ? '' : v);
        if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
        return s;
      }
      // Excel-friendly headers (open directly in Excel / Sheets)
      const header = [
        'generationRank',
        'generationHint',
        'name',
        'gender',
        'vital',
        'born',
        'slot',
        'role',
        'phone',
        'email',
        'city',
        'note'
      ];
      const lines = [header.join(',')];
      cards.forEach(function (c) {
        lines.push([
          c.generationRank,
          c.generationHint,
          c.name,
          c.gender,
          c.vital,
          c.born,
          c.slot,
          c.role,
          c.phone,
          c.email,
          c.city,
          c.note
        ].map(esc).join(','));
      });
      // BOM so Excel recognizes UTF-8 (Arabic/Urdu names etc.)
      const bom = '\uFEFF';
      const blob = new Blob([bom + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'clarity-member-cards-' + new Date().toISOString().slice(0, 10) + '.csv';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
      if (typeof uftSetStatus === 'function') {
        uftSetStatus(cards.length + ' member cards CSV downloaded — open in Excel, edit, then Upload cards');
      }
    }
    function uftLoadMemberCards(ev) {
      const file = ev && ev.target && ev.target.files && ev.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function () {
        try {
          const raw = String(reader.result || '');
          let cards = [];
          let appliedAsTree = false;

          function pushPerson(obj) {
            if (!obj || typeof obj !== 'object') return;
            const name = String(obj.name || obj.fullName || obj.full_name || obj.personName || obj.self || '').trim();
            if (!name || name === 'Unknown') return;
            cards.push({
              name: name,
              generationRank: obj.generationRank || obj.gen || obj.generation || '',
              generationHint: obj.generationHint || obj.role || obj.slot || '',
              slot: obj.slot || obj.role || '',
              phone: obj.phone || obj.whatsapp || '',
              email: obj.email || '',
              city: obj.city || obj.country || '',
              note: obj.note || ''
            });
          }
          function extractFromTree(d) {
            if (!d || typeof d !== 'object') return;
            ['self','father','mother','spouse','paternalGrandfather','paternalGrandmother','maternalGrandfather','maternalGrandmother'].forEach(function(k){
              if (typeof d[k] === 'string' && d[k].trim()) pushPerson({ name: d[k], slot: k });
              else if (d[k] && typeof d[k] === 'object') pushPerson(Object.assign({ slot: k }, d[k]));
            });
            (d.relatives || d.children || d.siblings || []).forEach(function(r){ pushPerson(r); });
            (d.registry || d.members || d.people || d.cards || []).forEach(function(r){ pushPerson(r); });
            ['g1','g2','g3','g4','g5','g6','g7','g8'].forEach(function(g){
              if (typeof d[g] === 'string') {
                d[g].split(/[\n,;|]+/).forEach(function(n){ if (n.trim()) pushPerson({ name: n.trim(), generationHint: g }); });
              } else if (Array.isArray(d[g])) d[g].forEach(function(x){ pushPerson(typeof x === 'string' ? { name: x, generationHint: g } : Object.assign({ generationHint: g }, x)); });
            });
          }

          if ((file.name && /\.csv$/i.test(file.name)) || raw.trim().indexOf('generationRank') === 0 || /^name\s*,/i.test(raw.trim())) {
            const rows = raw.split(/\r?\n/).filter(Boolean);
            if (rows.length < 2) throw new Error('empty csv');
            const head = rows[0].split(',').map(function (h) { return h.trim().replace(/^"|"$/g, ''); });
            for (let ri = 1; ri < rows.length; ri++) {
              const cols = [];
              let cur = '', q = false;
              const line = rows[ri];
              for (let j = 0; j < line.length; j++) {
                const ch = line[j];
                if (ch === '"') { q = !q; continue; }
                if (ch === ',' && !q) { cols.push(cur); cur = ''; continue; }
                cur += ch;
              }
              cols.push(cur);
              const obj = {};
              head.forEach(function (h, idx) { obj[h] = (cols[idx] || '').trim(); });
              pushPerson(obj);
            }
          } else {
            const parsed = JSON.parse(raw);
            if (parsed && Array.isArray(parsed.cards)) {
              parsed.cards.forEach(pushPerson);
            } else if (Array.isArray(parsed)) {
              parsed.forEach(pushPerson);
            } else if (parsed && typeof parsed === 'object') {
              /* Full tree / Amānah pack / members export */
              const tree = (parsed.familyTree && typeof parsed.familyTree === 'object') ? parsed.familyTree : parsed;
              const looksLikeTree = !!(tree.self || tree.father || tree.relatives || tree.g1 || tree.registry || tree.children || tree.people || tree.members);
              if (looksLikeTree) {
                const asTree = confirm(
                  'This looks like a full family-tree / members export.\n\nOK = load into the pedigree tree (replace current tree on this device)\nCancel = only import names into the member-cards picker list'
                );
                if (asTree) {
                  if (typeof uftApplyData === 'function') {
                    uftApplyData(tree);
                    if (typeof uftCollapseEditor === 'function') uftCollapseEditor();
                    if (typeof uftRender === 'function') uftRender();
                    if (typeof uftSetStatus === 'function') uftSetStatus('Tree loaded · ' + (file.name || 'JSON'));
                    appliedAsTree = true;
                  } else {
                    extractFromTree(tree);
                  }
                } else {
                  extractFromTree(tree);
                }
              } else if (Array.isArray(parsed.members) || Array.isArray(parsed.registry) || Array.isArray(parsed.people)) {
                (parsed.members || parsed.registry || parsed.people || []).forEach(pushPerson);
              } else {
                /* single person object */
                pushPerson(parsed);
              }
            } else {
              throw new Error('format');
            }
          }

          if (appliedAsTree) {
            ev.target.value = '';
            return;
          }

          /* de-dupe by name */
          const seen = {};
          cards = cards.filter(function(c){
            const k = String(c.name||'').toLowerCase();
            if (!k || seen[k]) return false;
            seen[k] = true;
            return true;
          });
          if (!cards.length) throw new Error('no cards');
          cards.sort(function (a, b) {
            const ra = parseInt(a.generationRank, 10); const rb = parseInt(b.generationRank, 10);
            if (!isNaN(ra) && !isNaN(rb) && ra !== rb) return ra - rb;
            return String(a.name || '').localeCompare(String(b.name || ''));
          });
          if (!confirm('Load ' + cards.length + ' member cards into the picker list?\n\nChoose a card, set Attach to + relation, then Add to tree.')) {
            ev.target.value = '';
            return;
          }
          uftSetStoredCards(cards);
          try {
            const d = (typeof uftCollect === 'function') ? uftCollect() : {};
            d.registry = Array.isArray(d.registry) ? d.registry : [];
            cards.forEach(function (c) {
              const name = String(c.name || '').trim();
              if (!name) return;
              const existing = d.registry.find(function (r) {
                return r && (typeof uftSame === 'function' ? uftSame(r.name, name) : r.name === name);
              });
              if (!existing) {
                d.registry.push({
                  id: (typeof uftNewPersonId === 'function') ? uftNewPersonId() : ('p_' + Math.random().toString(36).slice(2)),
                  name: name,
                  role: c.slot || c.role || '',
                  phone: c.phone || '',
                  email: c.email || '',
                  city: c.city || '',
                  note: c.note || c.generationHint || ''
                });
              }
            });
            try { clarityLS.setItem(UFT_KEY, JSON.stringify(d)); } catch (e) {}
            if (typeof uftRenderRegList === 'function') uftRenderRegList();
            if (typeof uftRender === 'function') uftRender();
          } catch (e) {}
          if (typeof uftExpandEditor === 'function') uftExpandEditor();
          if (typeof uftSetStatus === 'function') uftSetStatus(cards.length + ' cards ready — pick a card, then Add to tree');
          alert(cards.length + ' member cards loaded into the picker list.');
        } catch (e) {
          console.warn('uftLoadMemberCards', e);
          alert('Could not read that file.\n\nAccepted:\n• Member cards JSON/CSV export\n• Full tree / members JSON (clarity-family-members-*.json)\n• Amānah pack with familyTree\n• Array of {name, …} objects');
        }
        ev.target.value = '';
      };
      reader.readAsText(file);
    }

    function uftStartFresh() {
      const hasData = !!(uftRead() && (uftRead().self || uftRead().father || (uftRead().relatives || []).length || uftLines(uftRead().g1 || '').length));
      if (hasData) {
        const backup = confirm('Start tree?\n\nOK = download member cards (no links) first so you can rebuild generations cleanly, then clear the tree.\nCancel = abort.');
        if (!backup) return;
        if (typeof uftDownloadMemberCardsCsv === 'function') uftDownloadMemberCardsCsv();
        else if (typeof uftDownloadMemberCards === 'function') uftDownloadMemberCards();
        else uftDownload();
        setTimeout(function () {
          if (!confirm('Member cards downloaded. Clear the tree now and rebuild the pedigree in generation order?')) return;
          uftClear(true);
        }, 350);
      } else {
        uftClear(true);
      }
    }
    function uftApplyData(d) {
      if (!d || typeof d !== 'object') return;
      if (!Array.isArray(d.relatives)) d.relatives = [];
      try { clarityLS.setItem(UFT_KEY, JSON.stringify(d)); } catch (e) {}
      const f = uftFields();
      Object.keys(f).forEach(function (k) {
        if (f[k] && d[k] != null && typeof d[k] !== 'object') f[k].value = d[k];
      });
      const stage = document.getElementById('uft-stage');
      if (stage) stage.setAttribute('data-skin', d.skin || 'green');
      uftView = 'pedigree';
      uftRenderRelList();
      uftRender();
      uftRefreshLibrary();
      uftSetStatus('Loaded · ' + (uftWhen(d.savedAt) || 'this device'));
    }
    function uftLoadFile(ev) {
      const file = ev && ev.target && ev.target.files && ev.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function () {
        try {
          let d = JSON.parse(String(reader.result || '{}'));
          if (!d || typeof d !== 'object') throw new Error('bad');
          // Accept full Amānah pack or plain family-tree / members export
          if (d.familyTree && typeof d.familyTree === 'object') d = d.familyTree;
          if (!d.self && !d.father && !d.relatives && !d.g1 && !d.registry && !d.children) {
            throw new Error('empty');
          }
          if (!confirm('Replace the tree on this device with members from “' + (file.name || 'file') + '”?')) {
            ev.target.value = '';
            return;
          }
          uftApplyData(d);
          uftCollapseEditor();
          try { uftShowIntegrity(); } catch (e2) {}
          uftSetStatus('Members uploaded · ' + (file.name || 'JSON'));
        } catch (e) {
          alert('Could not read that file. Use “Download members” JSON or an Amānah pack export from Clarity.');
        }
        ev.target.value = '';
      };
      reader.readAsText(file);
    }
    function uftClear(skipConfirm) {
      if (!skipConfirm) {
        if (!confirm('Clear your private family tree on this device?\n\nTip: use “Download members” first if you may need this tree again.\nNamed library copies are kept until you remove them.')) return;
      }
      try { clarityLS.removeItem(UFT_KEY); } catch (e) {}
      const f = uftFields();
      Object.keys(f).forEach(function (k) { if (f[k]) f[k].value = ''; });
      try {
        const stage = document.getElementById('uft-stage');
        if (stage) stage.setAttribute('data-skin', 'green');
      } catch (e) {}
      uftRenderRelList();
      if (typeof uftRenderRegList === 'function') {
        try { uftRenderRegList(); } catch (e) {}
      }
      uftRender();
      uftExpandEditor();
      uftSetStatus('Tree cleared — upload a members JSON anytime to restore.');
      try { uftShowIntegrity(); } catch (e) {}
    }

    function uftDownloadPng() {
      try { if (typeof uftSave === 'function') uftSave(); } catch (e) {}
      var d = (typeof uftCollect === 'function') ? uftCollect() : {};
      function linesOf(s) {
        if (typeof uftLines === 'function') return uftLines(s);
        return String(s || '').split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
      }
      function triggerDownload(dataUrl, name) {
        var a = document.createElement('a');
        a.href = dataUrl;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      var fileName = 'clarity-pedigree-' + ((d.self || 'family').replace(/[^\w\-]+/g, '_').slice(0, 40)) + '.png';

      // ---- Build clean generation rows (data model, not DOM positions) ----
      function person(name, role, vital) {
        name = String(name || '').trim();
        if (!name) return null;
        return { name: name, role: role || '', vital: vital || '' };
      }
      var generations = [];
      // Ancestors (oldest first)
      var g1 = [], g2 = [], g3 = [];
      linesOf(d.g1).forEach(function (n) { g1.push(person(n, 'G1 · 3rd-great', '')); });
      linesOf(d.g2).forEach(function (n) { g2.push(person(n, 'G2 · 2nd-great', '')); });
      linesOf(d.g3).forEach(function (n) { g3.push(person(n, 'G3 · great-grand', '')); });
      if (g1.length) generations.push({ title: 'Generation 1 (oldest)', people: g1 });
      if (g2.length) generations.push({ title: 'Generation 2', people: g2 });
      if (g3.length) generations.push({ title: 'Generation 3 · Great-grandparents', people: g3 });

      var gps = [];
      if (d.pgf) gps.push(person(d.pgf, "Father's father", ''));
      if (d.pgm) gps.push(person(d.pgm, "Father's mother", ''));
      if (d.mgf) gps.push(person(d.mgf, "Mother's father", ''));
      if (d.mgm) gps.push(person(d.mgm, "Mother's mother", ''));
      if (gps.length) generations.push({ title: 'Grandparents', people: gps });

      var parents = [];
      if (d.father) parents.push(person(d.father, 'Father', ''));
      if (d.mother) parents.push(person(d.mother, 'Mother', ''));
      if (parents.length) generations.push({ title: 'Parents', people: parents });

      var focus = [];
      if (d.self) focus.push(person(d.self, 'You', ''));
      if (d.spouse) focus.push(person(d.spouse, 'Spouse', ''));
      linesOf(d.siblings).forEach(function (n) { focus.push(person(n, 'Sibling', '')); });
      if (focus.length) generations.push({ title: 'Your generation', people: focus });

      var kids = [];
      linesOf(d.children).forEach(function (n) { kids.push(person(n, 'Child', '')); });
      if (kids.length) generations.push({ title: 'Children', people: kids });

      var gkids = [];
      linesOf(d.grandchildren).forEach(function (n) { gkids.push(person(n, 'Grandchild', '')); });
      if (gkids.length) generations.push({ title: 'Grandchildren', people: gkids });

      // Extra relatives not already listed
      var known = {};
      generations.forEach(function (g) {
        g.people.forEach(function (p) { known[p.name.toLowerCase()] = true; });
      });
      var extra = [];
      (d.relatives || []).forEach(function (r) {
        if (!r || !r.name) return;
        if (known[String(r.name).toLowerCase()]) return;
        extra.push(person(r.name, r.relation || 'Relative', r.vital || ''));
      });
      if (extra.length) generations.push({ title: 'Other relatives', people: extra });

      var totalPeople = generations.reduce(function (n, g) { return n + g.people.length; }, 0);
      if (!totalPeople) {
        alert('Add people to the pedigree before downloading an image.');
        return;
      }

      // ---- Layout algorithm: non-overlapping cards in generation rows ----
      var pad = 28;
      var headerH = 72;
      var rowGap = 36;
      var cardH = 54;
      var cardMinW = 140;
      var cardMaxW = 200;
      var cardGap = 12;
      var titleH = 22;

      // Measure name widths approx
      function estimateCardW(name) {
        var w = 24 + Math.min(String(name).length, 28) * 7.2;
        return Math.max(cardMinW, Math.min(cardMaxW, w));
      }

      // Compute row widths and wrap people into sub-rows if too wide
      var maxCanvasW = 1600;
      var layoutRows = []; // {title?, people, widths}
      generations.forEach(function (g) {
        layoutRows.push({ kind: 'title', text: g.title });
        var row = [];
        var rowW = 0;
        g.people.forEach(function (p) {
          var cw = estimateCardW(p.name);
          if (row.length && rowW + cardGap + cw > maxCanvasW - pad * 2) {
            layoutRows.push({ kind: 'people', people: row.slice(), widths: row.map(function (x) { return estimateCardW(x.name); }) });
            row = [];
            rowW = 0;
          }
          row.push(p);
          rowW += (row.length > 1 ? cardGap : 0) + cw;
        });
        if (row.length) {
          layoutRows.push({ kind: 'people', people: row.slice(), widths: row.map(function (x) { return estimateCardW(x.name); }) });
        }
      });

      var contentW = 0;
      layoutRows.forEach(function (r) {
        if (r.kind !== 'people') return;
        var w = r.widths.reduce(function (a, b) { return a + b; }, 0) + cardGap * Math.max(0, r.people.length - 1);
        contentW = Math.max(contentW, w);
      });
      contentW = Math.max(contentW, 480);

      var y = headerH + pad;
      layoutRows.forEach(function (r) {
        if (r.kind === 'title') y += titleH + 8;
        else y += cardH + rowGap;
      });
      var canvasW = Math.ceil(contentW + pad * 2);
      var canvasH = Math.ceil(y + pad);

      var canvas = document.createElement('canvas');
      canvas.width = canvasW;
      canvas.height = canvasH;
      var ctx = canvas.getContext('2d');

      // Background
      ctx.fillStyle = '#0f2f24';
      ctx.fillRect(0, 0, canvasW, canvasH);

      // Header
      ctx.fillStyle = '#d4af37';
      ctx.font = '700 22px Georgia, "Times New Roman", serif';
      ctx.fillText('Clarity · Pedigree view', pad, pad + 20);
      ctx.fillStyle = '#cfe8dc';
      ctx.font = '13px Inter, system-ui, sans-serif';
      var sub = (d.self || 'Family') + ' · ' + new Date().toLocaleDateString() + ' · ' + totalPeople + ' people · clean layout';
      ctx.fillText(sub, pad, pad + 42);

      // Draw rows
      y = headerH + pad;
      var prevPeopleY = null;
      layoutRows.forEach(function (r) {
        if (r.kind === 'title') {
          ctx.fillStyle = '#8fd4a0';
          ctx.font = '600 13px Inter, system-ui, sans-serif';
          ctx.fillText(r.text, pad, y + 14);
          y += titleH + 8;
          return;
        }
        var totalW = r.widths.reduce(function (a, b) { return a + b; }, 0) + cardGap * Math.max(0, r.people.length - 1);
        var x0 = pad + Math.max(0, (contentW - totalW) / 2);
        var x = x0;
        // connector from previous row center
        if (prevPeopleY != null) {
          ctx.strokeStyle = 'rgba(201,162,39,0.45)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(canvasW / 2, prevPeopleY);
          ctx.lineTo(canvasW / 2, y);
          ctx.stroke();
        }
        r.people.forEach(function (p, i) {
          var w = r.widths[i];
          var h = cardH;
          // card
          ctx.fillStyle = 'rgba(26,107,82,0.92)';
          ctx.strokeStyle = '#c9a227';
          ctx.lineWidth = 1.5;
          var rr = 10;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(x, y, w, h, rr);
          else {
            ctx.moveTo(x + rr, y);
            ctx.arcTo(x + w, y, x + w, y + h, rr);
            ctx.arcTo(x + w, y + h, x, y + h, rr);
            ctx.arcTo(x, y + h, x, y, rr);
            ctx.arcTo(x, y, x + w, y, rr);
            ctx.closePath();
          }
          ctx.fill();
          ctx.stroke();
          // name
          ctx.fillStyle = '#f7f4ee';
          ctx.font = '600 14px Georgia, "Times New Roman", serif';
          var label = p.name.length > 26 ? p.name.slice(0, 24) + '…' : p.name;
          ctx.fillText(label, x + 10, y + 22);
          // role
          ctx.fillStyle = '#9fd0b8';
          ctx.font = '11px Inter, system-ui, sans-serif';
          var role = p.role.length > 28 ? p.role.slice(0, 26) + '…' : p.role;
          ctx.fillText(role, x + 10, y + 40);
          x += w + cardGap;
        });
        prevPeopleY = y + cardH;
        y += cardH + rowGap;
      });

      var url = canvas.toDataURL('image/png');
      triggerDownload(url, fileName);
      if (typeof uftSetStatus === 'function') uftSetStatus('Clean pedigree PNG downloaded (' + totalPeople + ' people).');
    }

    function uftDownloadTextTree() {
      try { if (typeof uftSave === 'function') uftSave(); } catch (e) {}
      var d = (typeof uftCollect === 'function') ? uftCollect() : {};
      function linesOf(s) {
        if (typeof uftLines === 'function') return uftLines(s);
        return String(s || '').split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
      }
      var out = [];
      out.push('Clarity · Family tree');
      out.push((d.self || 'Family') + ' · ' + new Date().toLocaleDateString());
      out.push('');
      function section(title, items) {
        if (!items.length) return;
        out.push(title);
        items.forEach(function (line) { out.push('  • ' + line); });
        out.push('');
      }
      var g1 = linesOf(d.g1), g2 = linesOf(d.g2), g3 = linesOf(d.g3);
      section('Generation 1 (oldest)', g1);
      section('Generation 2', g2);
      section('Generation 3 · Great-grandparents', g3);
      var gps = [];
      if (d.pgf) gps.push(d.pgf + " — Father's father");
      if (d.pgm) gps.push(d.pgm + " — Father's mother");
      if (d.mgf) gps.push(d.mgf + " — Mother's father");
      if (d.mgm) gps.push(d.mgm + " — Mother's mother");
      section('Grandparents', gps);
      var parents = [];
      if (d.father) parents.push(d.father + ' — Father');
      if (d.mother) parents.push(d.mother + ' — Mother');
      section('Parents', parents);
      var focus = [];
      if (d.self) focus.push(d.self + ' — You');
      if (d.spouse) focus.push(d.spouse + ' — Spouse');
      linesOf(d.siblings).forEach(function (n) { focus.push(n + ' — Sibling'); });
      section('Your generation', focus);
      section('Children', linesOf(d.children).map(function (n) { return n + ' — Child'; }));
      section('Grandchildren', linesOf(d.grandchildren).map(function (n) { return n + ' — Grandchild'; }));
      var rels = (d.relatives || []).map(function (r) {
        if (!r || !r.name) return '';
        return r.name + (r.relation ? ' — ' + r.relation : '');
      }).filter(Boolean);
      section('Other relatives', rels);

      // Link diagram (ASCII)
      out.push('—— Links (parent → child) ——');
      if (d.pgf && d.father) out.push(d.pgf + ' → ' + d.father);
      if (d.pgm && d.father) out.push(d.pgm + ' → ' + d.father);
      if (d.mgf && d.mother) out.push(d.mgf + ' → ' + d.mother);
      if (d.mgm && d.mother) out.push(d.mgm + ' → ' + d.mother);
      if (d.father && d.self) out.push(d.father + ' → ' + d.self);
      if (d.mother && d.self) out.push(d.mother + ' → ' + d.self);
      if (d.self && d.spouse) out.push(d.self + ' ↔ ' + d.spouse + ' (spouses)');
      linesOf(d.children).forEach(function (c) {
        if (d.self) out.push(d.self + ' → ' + c);
        if (d.spouse) out.push(d.spouse + ' → ' + c);
      });
      linesOf(d.grandchildren).forEach(function (g) {
        linesOf(d.children).forEach(function (c) {
          /* listed without forced parent link */
        });
        out.push('(grandchild) ' + g);
      });
      out.push('');
      out.push('Educational family record — verify with family and local custom.');

      var blob = new Blob([out.join('\n')], { type: 'text/plain;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'clarity-family-tree-' + ((d.self || 'family').replace(/[^\w\-]+/g, '_').slice(0, 40)) + '.txt';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { try { URL.revokeObjectURL(a.href); } catch (e) {} }, 1500);
      if (typeof uftSetStatus === 'function') uftSetStatus('Family tree text downloaded.');
    }

    function uftLines(s) {
      return String(s || '').split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean);
    }
    function uftEsc(s) {
      return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
    function uftInitials(name) {
      const p = String(name || '').trim().split(/\s+/).filter(Boolean);
      if (!p.length) return '·';
      if (p.length === 1) return p[0].slice(0, 2).toUpperCase();
      return (p[0][0] + p[p.length - 1][0]).toUpperCase();
    }
    let uftVitalMap = {};
    function uftVitalKey(name, slot) {
      const n = uftNorm(name);
      if (!n) return '';
      const s = String(slot || '').trim();
      return s ? (s + '|' + n) : n;
    }
    function uftVitalOf(name, slot) {
      const n = uftNorm(name);
      const keys = [];
      if (slot) keys.push(uftVitalKey(name, slot));
      keys.push(uftVitalKey(name, ''));
      keys.push(n);
      let map = uftVitalMap || {};
      try { map = Object.assign({}, ((uftRead().vital) || {}), map); } catch (e) {}
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key && map[key]) return map[key];
      }
      // Any slot for this same person name
      const all = Object.keys(map);
      for (let j = 0; j < all.length; j++) {
        const k = all[j];
        const bare = k.indexOf('|') >= 0 ? k.slice(k.lastIndexOf('|') + 1) : k.replace(/^n:/i, '');
        if (bare === n && map[k]) return map[k];
      }
      return '';
    }

    function uftGenderKey(name, slot) { return uftVitalKey(name, slot); }
    function uftGenderOf(name, slot) {
      const bare = uftNorm(name);
      let map = (typeof uftGenderMap !== 'undefined' && uftGenderMap) ? uftGenderMap : {};
      try { map = Object.assign({}, ((uftRead().gender) || {}), map); } catch (e) {}
      const key = uftGenderKey(name, slot);
      if (key && map[key]) return map[key];
      if (bare && map[bare]) return map[bare];
      const all = Object.keys(map);
      for (let j = 0; j < all.length; j++) {
        const k = all[j];
        const b = k.indexOf('|') >= 0 ? k.slice(k.lastIndexOf('|') + 1) : k.replace(/^n:/i, '');
        if (b === bare && map[k]) return map[k];
      }
      return '';
    }
    function uftSetGenderFor(name, gender, slot) {
      const d = uftCollect();
      d.gender = d.gender || {};
      if (!name) return;
      uftSyncPersonMeta(d.gender, name, gender || '');
      const key = uftGenderKey(name, slot || '');
      if (key && gender) d.gender[key] = gender;
      try { clarityLS.setItem(UFT_KEY, JSON.stringify(d)); } catch (e) {}
      try { uftGenderMap = d.gender; } catch (e) {}
      uftRender({ keepScroll: true });
      try { uftIntegrityRefresh(); } catch (e) {}
    }
    function uftCycleGender(name, slot) {
      const cur = uftGenderOf(name, slot);
      const next = cur === 'male' ? 'female' : cur === 'female' ? '' : 'male';
      uftSetGenderFor(name, next, slot);
    }
    function uftAutoLinkSiblings(d) {
      if (!d) return d;
      d.relatives = Array.isArray(d.relatives) ? d.relatives : [];
      function add(anchor, relation, name) {
        if (!anchor || !name || !relation) return;
        const exists = d.relatives.some(function (r) {
          return r && r.relation === relation && uftSame(r.name, name) && String(r.anchor) === String(anchor);
        });
        if (!exists) d.relatives.push({ anchor: anchor, relation: relation, name: name });
      }
      uftLines(d.siblings).forEach(function (n) {
        add('self', 'sibling', n);
        if (d.father) add('father', 'child', n);
        if (d.mother) add('mother', 'child', n);
      });
      uftLines(d.g2).forEach(function (child) {
        uftLines(d.g1).forEach(function (par) { add(uftNameKey(par), 'child', child); });
      });
      uftLines(d.g3).forEach(function (child) {
        uftLines(d.g2).forEach(function (par) { add(uftNameKey(par), 'child', child); });
      });
      if (d.pgf) uftLines(d.g3).forEach(function (par) { add(uftNameKey(par), 'child', d.pgf); });
      if (d.father && d.pgf) add('pgf', 'child', d.father);
      if (d.self && d.father) add('father', 'child', d.self);
      d.relatives.slice().forEach(function (r) {
        if (!r || r.relation !== 'sibling' || !r.name) return;
        let parents = [];
        try { parents = uftParentsOf(d, r.anchor) || []; } catch (e) { parents = []; }
        if ((!parents || !parents.length) && (r.anchor === 'self' || uftSame(r.anchor, d.self))) {
          if (d.father) parents.push({ id: 'father' });
          if (d.mother) parents.push({ id: 'mother' });
        }
        if ((!parents || !parents.length) && (r.anchor === 'father' || uftSame(r.anchor, d.father))) {
          if (d.pgf) parents.push({ id: 'pgf' });
          if (d.pgm) parents.push({ id: 'pgm' });
        }
        if ((!parents || !parents.length) && (r.anchor === 'mother' || uftSame(r.anchor, d.mother))) {
          if (d.mgf) parents.push({ id: 'mgf' });
          if (d.mgm) parents.push({ id: 'mgm' });
        }
        (parents || []).forEach(function (p) {
          const pid = p.id || (p.name ? uftNameKey(p.name) : '');
          if (pid) add(pid, 'child', r.name);
        });
      });
      return d;
    }
    let uftGenderMap = {};
    let uftBornMap = {};
    function uftBornOf(name, slot) {
      const key = uftVitalKey(name, slot);
      const map = uftBornMap || {};
      if (key && map[key]) return map[key];
      const bare = uftNorm(name);
      if (bare && map[bare]) return map[bare];
      try {
        const stored = (uftRead().born) || {};
        if (key && stored[key]) return stored[key];
        if (bare && stored[bare]) return stored[bare];
      } catch (e) {}
      return '';
    }
    function uftSetBornFor(name, year, slot) {
      const d = uftCollect();
      d.born = d.born || {};
      year = String(year || '').replace(/[^0-9]/g, '').slice(0, 4);
      if (!name) return;
      uftSyncPersonMeta(d.born, name, year || '');
      const key = uftVitalKey(name, slot || '');
      if (key && year) d.born[key] = year;
      try { clarityLS.setItem(UFT_KEY, JSON.stringify(d)); } catch (e) {}
      try { uftBornMap = d.born; } catch (e) {}
      uftRender({ keepScroll: true });
    }
    function uftAskBorn(name, slot) {
      const cur = uftBornOf(name, slot) || '';
      const year = prompt('Year of birth for ' + name + ' (leave blank to clear)', cur);
      if (year === null) return;
      uftSetBornFor(name, year, slot);
    }
    function uftCycleVital(name, slot) {
      if (!name) return;
      const cur = uftVitalOf(name, slot);
      const next = cur === 'alive' ? 'deceased' : cur === 'deceased' ? '' : 'alive';
      uftSetVitalFor(name, next, slot);
    }
    function uftSyncPersonMeta(map, name, value) {
      // One value for this person name across every slot/category key
      const n = uftNorm(name);
      if (!n || !map) return;
      const keys = Object.keys(map);
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const bare = k.indexOf('|') >= 0 ? k.slice(k.lastIndexOf('|') + 1) : k.replace(/^n:/i, '');
        if (bare === n) {
          if (value) map[k] = value;
          else delete map[k];
        }
      }
      // Always keep bare-name key as the canonical person-level value
      if (value) map[n] = value;
      else delete map[n];
    }
    function uftSetVitalFor(name, status, slot) {
      const d = uftCollect();
      d.vital = d.vital || {};
      if (!name) return;
      uftSyncPersonMeta(d.vital, name, status || '');
      // Also set the explicit slot key for compatibility
      const key = uftVitalKey(name, slot || '');
      if (key && status) d.vital[key] = status;
      try { clarityLS.setItem(UFT_KEY, JSON.stringify(d)); } catch (e) {}
      try { uftVitalMap = d.vital; } catch (e) {}
      uftRender({ keepScroll: true });
      if (typeof uftRefreshVitalWho === 'function') uftRefreshVitalWho();
      try { if (typeof uftIntegrityRefresh === 'function') uftIntegrityRefresh(); } catch (e) {}
    }
    function uftApplyVital() {
      const who = ((document.getElementById('uft-vital-who') || {}).value || '').trim();
      const st = ((document.getElementById('uft-vital-status') || {}).value || '').trim();
      if (!who) return;
      const parts = who.split('::');
      const slot = parts.length > 1 ? parts[0] : '';
      const name = parts.length > 1 ? parts.slice(1).join('::') : who;
      uftSetVitalFor(name, st, slot);
      if (typeof uftSetStatus === 'function') uftSetStatus(who + ' marked ' + (st || 'unspecified') + '.');
    }
    function uftRefreshVitalWho() {
      const sel = document.getElementById('uft-vital-who');
      if (!sel) return;
      const prev = sel.value;
      const d = uftCollect();
      const names = uftAllMembers(d).filter(function (p) { return p && p.name; });
      sel.innerHTML = '<option value="">Person on the tree…</option>' + names.map(function (p) {
        const slot = p.anchor || p.relation || '';
        const st = uftVitalOf(p.name, slot);
        const label = p.name + (p.relation ? ' · ' + p.relation : '');
        return '<option value="' + uftEsc(slot) + '::' + uftEsc(p.name) + '">' + uftEsc(label) + (st ? ' (' + st + ')' : '') + '</option>';
      }).join('');
      if (prev) sel.value = prev;
    }
    function uftPerson(name, meta, gender, extraClass, slot, hostAnchor) {
      const empty = !name;
      const storedG = empty ? '' : uftGenderOf(name, slot);
      if (storedG) gender = storedG;
      const vital = empty ? '' : uftVitalOf(name, slot);
      const cls = ['uft-person', 'uft-card-sleek', gender || '', extraClass || '', empty ? 'empty' : '', vital].filter(Boolean).join(' ');
      const label = empty ? (meta || 'Unknown') : name;
      const year = empty ? '' : uftBornOf(name, slot);
      const relLine = empty ? '' : ((meta || '') + (year ? ((meta ? ' · ' : '') + 'b. ' + year) : ''));
      const gCls = storedG === 'male' ? ' g-male' : storedG === 'female' ? ' g-female' : ' g-unset';
      const vitalIcon = vital === 'deceased' ? '†' : vital === 'alive' ? '●' : '○';
      const vitalTitle = vital === 'deceased' ? 'Deceased' : vital === 'alive' ? 'Alive' : 'Set status';
      const genderIcon = storedG === 'male' ? '♂' : storedG === 'female' ? '♀' : '⚥';
      const genderTitle = storedG === 'male' ? 'Male' : storedG === 'female' ? 'Female' : 'Gender';
      const actions = empty ? '' :
        '<div class="uft-chip-stack" role="group" aria-label="Member actions">' +
          '<div class="uft-chip-row">' +
            '<button type="button" class="uft-chip uft-vital-btn ' + (vital || 'unset') + (vital === 'deceased' ? ' dead' : vital === 'alive' ? ' live' : '') +
              '" data-vital-name="' + uftEsc(name) + '" data-vital-slot="' + uftEsc(slot || '') + '" title="' + vitalTitle + '"><span class="uft-chip-ico">' + vitalIcon + '</span></button>' +
            '<button type="button" class="uft-chip uft-gender-btn' + gCls + '" data-gender-name="' + uftEsc(name) + '" data-gender-slot="' + uftEsc(slot || '') + '" title="' + genderTitle + '"><span class="uft-chip-ico">' + genderIcon + '</span></button>' +
            '<button type="button" class="uft-chip uft-born-btn' + (year ? ' has-year' : '') + '" data-born-name="' + uftEsc(name) + '" data-born-slot="' + uftEsc(slot || '') + '" title="Year of birth"><span class="uft-chip-ico">' + (year ? String(year) : 'Yr') + '</span></button>' +
          '</div>' +
          '<div class="uft-chip-row">' +
            '<button type="button" class="uft-chip uft-focus-btn" data-focus-name="' + uftEsc(name) + '" data-focus-slot="' + uftEsc(slot || '') + '" title="Family panel"><span class="uft-chip-ico">👪</span></button>' +
            '<button type="button" class="uft-chip uft-own-btn" data-own-name="' + uftEsc(name) + '" data-own-slot="' + uftEsc(slot || '') + '" title="Own Family Tree"><span class="uft-chip-ico">🌳</span></button>' +
            '<button type="button" class="uft-chip uft-add-rel-btn" data-add-name="' + uftEsc(name) + '" data-add-slot="' + uftEsc(slot || '') + '" title="Add relative"><span class="uft-chip-ico">＋</span></button>' +
          '</div>' +
        '</div>';
      return '<div class="' + cls + '">' +
        '<button type="button" class="uft-del-btn" data-del-name="' + uftEsc(name || '') + '" data-del-slot="' + uftEsc(slot || '') + '" data-del-anchor="' + uftEsc(hostAnchor || '') + '" title="Remove from this place only">×</button>' +
        '<div class="uft-card-head">' +
          '<div class="uft-avatar">' + uftEsc(uftInitials(empty ? '' : name)) + '</div>' +
          '<div class="uft-card-title">' +
            '<div class="pn">' + uftEsc(label) + (vital === 'deceased' ? ' †' : '') + '</div>' +
            (relLine ? '<div class="pd">' + uftEsc(relLine) + '</div>' : '') +
          '</div>' +
        '</div>' +
        actions +
        '</div>';
    }
    function uftCard(name, meta, extraClass) {
      if (!name) return '';
      return uftPerson(name, meta, extraClass === 'uft-self' ? 'focus' : '', extraClass);
    }
    function uftGenFilled(d) {
      return [
        uftLines(d.g1).length > 0,
        uftLines(d.g2).length > 0,
        uftLines(d.g3).length > 0,
        !!(d.pgf || d.pgm || d.mgf || d.mgm),
        !!(d.father || d.mother),
        !!(d.self || d.spouse || uftLines(d.siblings).length),
        !!(uftLines(d.children).length || uftLines(d.grandchildren).length)
      ];
    }
    function uftDrawTree(filled) {
      const br = document.getElementById('uft-branches');
      const lf = document.getElementById('uft-leaves');
      if (!br || !lf) return;
      const paths = [
        'M188 238 C150 210 110 168 72 128',
        'M212 238 C250 208 292 168 330 126',
        'M186 260 C130 240 86 228 48 214',
        'M214 258 C270 236 318 220 356 208',
        'M192 220 C160 180 148 140 136 96',
        'M208 220 C248 176 268 138 286 92',
        'M200 200 C200 160 188 120 176 78'
      ];
      const leafPts = [
        [72,122],[330,120],[48,208],[356,202],[136,92],[286,88],[176,74],
        [98,148],[302,146],[64,176],[340,170],[158,110],[248,108],
        [118,168],[278,164],[90,198],[314,192],[200,100],[220,128],[180,132]
      ];
      br.innerHTML = '';
      lf.innerHTML = '';
      const nOn = Math.max(3, (filled || []).filter(Boolean).length);
      paths.slice(0, Math.min(paths.length, nOn)).forEach(function (d, i) {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('d', d);
        p.setAttribute('class', 'uft-branch');
        p.style.strokeDasharray = '280';
        br.appendChild(p);
      });
      leafPts.slice(0, Math.min(leafPts.length, 6 + nOn * 3)).forEach(function (pt, i) {
        const e = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        e.setAttribute('cx', pt[0]);
        e.setAttribute('cy', pt[1]);
        e.setAttribute('rx', 11 + (i % 4));
        e.setAttribute('ry', 7 + (i % 3));
        e.setAttribute('transform', 'rotate(' + ((i * 27) % 80 - 40) + ' ' + pt[0] + ' ' + pt[1] + ')');
        e.setAttribute('class', 'uft-leaf');
        e.style.animationDelay = (i * 0.09) + 's';
        lf.appendChild(e);
      });
    }
    function uftLineKids(d, name, slot) {
      const bag = [];
      function push(n, sl, rel) {
        if (!n) return;
        if (uftSame(n, name)) return;
        if (bag.some(function (x) { return uftSame(x.name, n); })) return;
        bag.push({ name: n, slot: sl || uftNameKey(n), relation: rel || 'Child' });
      }
      if (!d || !name) return bag;
      try {
        uftKidsOf(d, slot || uftNameKey(name)).forEach(function (k) { push(k.name, uftNameKey(k.name), 'Child'); });
        uftKidsOf(d, uftNameKey(name)).forEach(function (k) { push(k.name, uftNameKey(k.name), 'Child'); });
        (d.relatives || []).forEach(function (r) {
          if (!r || !r.name) return;
          if (r.relation !== 'child' && r.relation !== 'grandchild' && r.relation !== 'offspring') return;
          const host = (uftCoreName(d, r.anchor) || String(r.anchor || '').replace(/^n:/, '')).trim();
          if (uftSame(host, name) || r.anchor === slot || r.anchor === uftNameKey(name)) {
            push(r.name, uftNameKey(r.name), 'Child');
          }
        });
        if (slot === 'g2' || uftLines(d.g2).some(function (n) { return uftSame(n, name); })) {
          uftLines(d.g3).forEach(function (n) { push(n, 'g3', 'Child'); });
          uftLines(d.g3).forEach(function (heir) {
            uftPeersOf(d, heir).forEach(function (s) { push(s.name, uftNameKey(s.name), 'Sibling of ' + heir); });
          });
        }
        if (slot === 'g3' || uftLines(d.g3).some(function (n) { return uftSame(n, name); })) {
          if (d.pgf) push(d.pgf, 'pgf', 'Child');
          uftPeersOf(d, d.pgf).forEach(function (s) { push(s.name, uftNameKey(s.name), 'Sibling of ' + (d.pgf || '')); });
        }
        if (slot === 'pgf' || uftSame(name, d.pgf)) {
          if (d.father) push(d.father, 'father', 'Child');
          uftPeersOf(d, d.father).forEach(function (s) { push(s.name, uftNameKey(s.name), 'Sibling of ' + (d.father || '')); });
        }
        if (slot === 'father' || uftSame(name, d.father)) {
          if (d.self) push(d.self, 'self', 'Child');
          uftLines(d.siblings).forEach(function (n) { push(n, uftNameKey(n), 'Sibling'); });
          uftPeersOf(d, d.self).forEach(function (s) { push(s.name, uftNameKey(s.name), 'Sibling'); });
        }
        if (slot === 'self' || uftSame(name, d.self)) {
          uftLines(d.children).forEach(function (n) { push(n, uftNameKey(n), 'Child'); });
        }
        bag.slice().forEach(function (child) {
          uftPeersOf(d, child.name).forEach(function (s) { push(s.name, uftNameKey(s.name), 'Sibling of ' + child.name); });
        });
      } catch (e) {}
      return bag;
    }
    function uftHasOffspring(d, name, slot) {
      return uftLineKids(d, name, slot).length > 0;
    }
    function uftOpenMemberView(name, slot) {
      const box = document.getElementById('uft-focus');
      const body = document.getElementById('uft-focus-body');
      const title = document.getElementById('uft-focus-title');
      if (!box || !body) return;
      title.textContent = 'Family of ' + name;
      box.hidden = false;
      const d = uftCollect();
      const kids = uftLineKids(d, name, slot);
      if (!kids.length) {
        body.innerHTML = '<p class="uft-link-note">No offspring linked yet. Attach children to ' + uftEsc(name) + '.</p>';
        return;
      }
      const seen = {};
      seen[uftNorm(name)] = true;
      function node(p, depth) {
        if (!p || !p.name || depth > 6) return '';
        const k = uftNorm(p.name);
        if (seen[k]) return '';
        seen[k] = true;
        const children = uftLineKids(d, p.name, p.slot).filter(function (c) { return !seen[uftNorm(c.name)]; });
        const branch = children.filter(function (c) { return uftHasOffspring(d, c.name, c.slot); });
        const leaves = children.filter(function (c) { return !uftHasOffspring(d, c.name, c.slot); });
        let html = '<li><div class="uft-focus-card">' + uftEsc(p.name) + (p.relation ? '<small> · ' + uftEsc(p.relation) + '</small>' : '') + '</div>';
        if (leaves.length) {
          html += '<ul class="uft-vline">';
          leaves.forEach(function (c) { html += node(c, depth + 1); });
          html += '</ul>';
        }
        if (branch.length) {
          html += '<ul class="uft-vpeers">';
          branch.forEach(function (c) { html += node(c, depth + 1); });
          html += '</ul>';
        }
        html += '</li>';
        return html;
      }
      body.innerHTML = '<ul class="uft-vtree uft-vtree-focus">' + node({ name: name, slot: slot, relation: 'Focus' }, 0) + '</ul>';
    }
    function uftCloseMemberView() {
      const box = document.getElementById('uft-focus');
      if (box) box.hidden = true;
    }
    function uftPedigreeHtml(d) {
      d = uftDedupeData(d);
      function personCard(name, meta, gender, extra, slot, anchor) {
        return uftPerson(name, meta, gender, extra, slot, anchor);
      }
      function peopleHtml(items, fallbackMeta, slot) {
        const seen = {};
        return (items || []).filter(function (it) {
          if (!it || !it.name) return false;
          const k = uftNorm(it.name);
          if (seen[k]) return false;
          seen[k] = true;
          return true;
        }).map(function (it) {
          const meta = it.relation || fallbackMeta || '';
          const g = /mother|wife|daughter|niece|aunt|female/i.test(meta) ? 'female' : (/father|husband|son|nephew|uncle|male/i.test(meta) ? 'male' : '');
          return personCard(it.name, meta, uftSame(it.name, d.self) ? 'focus' : g, uftSame(it.name, d.self) ? 'focus' : 'rel', it.slot || slot || '');
        }).join('');
      }
      function cluster(title, coupleHtml, kidsHtml, note, focus) {
        return '<div class="uft-cluster' + (focus ? ' focus-cluster' : '') + '">' +
          (title ? '<div class="uft-col-label">' + title + '</div>' : '') +
          '<div class="uft-couple">' + (coupleHtml || '') + '</div>' +
          (kidsHtml ? '<div class="uft-kids-row">' + kidsHtml + '</div>' : '') +
          (note ? '<div class="uft-link-note">' + note + '</div>' : '') +
          '</div>';
      }
      function band(id, title, inner, count) {
        // Primary pedigree (backbone + descendant tree) stays always open above.
        // Extra generation / extended bands stay collapsed until the user opens them.
        const open = clarityLS.getItem('clarity_uft_band_' + id) === 'on';
        return '<section class="uft-band' + (open ? '' : ' collapsed') + '" data-band="' + id + '">' +
          '<button type="button" class="uft-band-head" onclick="uftToggleBand(\'' + id + '\')">' +
          '<span>' + title + '</span><span class="uft-band-count">' + (count || 0) + ' · ' + (open ? '▾' : '▸') + '</span></button>' +
          '<div class="uft-band-scroll">' + inner + '</div></section>';
      }

      const g3 = uftLines(d.g3).map(function (n) { return { name: n, relation: 'Great-grandparent', slot: 'g3' }; });
      const g2 = uftLines(d.g2).map(function (n) { return { name: n, relation: '2nd-great-grandparent', slot: 'g2' }; });
      const g1 = uftLines(d.g1).map(function (n) { return { name: n, relation: '3rd-great-grandparent', slot: 'g1' }; });
      const pUncles = uftNotCorePeople(d, uftSiblingsOf(d, 'father'));
      const mUncles = uftNotCorePeople(d, uftSiblingsOf(d, 'mother'));
      const mySibs = uftSiblingsOf(d, 'self');
      const myKids = uftKidsOf(d, 'self');
      const myGrands = uftUniquePeople(uftLines(d.grandchildren).map(function (n) { return { name: n, relation: 'grandchild' }; }));
      const gpSibsP = uftNotCorePeople(d, uftSiblingsOf(d, 'pgf').concat(uftSiblingsOf(d, 'pgm')));
      const gpSibsM = uftNotCorePeople(d, uftSiblingsOf(d, 'mgf').concat(uftSiblingsOf(d, 'mgm')));

      const paternalKids = uftUniquePeople([{ name: d.father || '', relation: 'Father' }].concat(pUncles).filter(function (x) { return x.name; }));
      const maternalKids = uftUniquePeople([{ name: d.mother || '', relation: 'Mother' }].concat(mUncles).filter(function (x) { return x.name; }));

      const lineSkip = {};
      [d.self, d.spouse, d.father, d.mother, d.pgf, d.pgm, d.mgf, d.mgm].concat(uftLines(d.g1), uftLines(d.g2), uftLines(d.g3)).forEach(function (n) {
        if (n) lineSkip[uftNorm(n)] = 'line';
      });
      function notOnBackbone(items) {
        return (items || []).filter(function (it) {
          if (!it || !it.name) return false;
          return lineSkip[uftNorm(it.name)] !== 'line' || it.relation && String(it.relation).indexOf('Sibling') === 0;
        });
      }
      const olderG1 = notOnBackbone(g1).length ? cluster('3rd great-grandparents (G1) — others', peopleHtml(notOnBackbone(g1), '3rd-great-grandparent'), '', 'Names already on the descendant line are not repeated here.') : '';
      const olderG2 = notOnBackbone(g2).length ? cluster('2nd great-grandparents (G2) — others', peopleHtml(notOnBackbone(g2), '2nd-great-grandparent'), '', 'Karam Din stays on the descendant line above; this row is extra people of that generation.') : '';
            const g3Peers = [];
      g3.forEach(function (p) {
        uftPeersOf(d, p.name).forEach(function (s) {
          g3Peers.push({ name: s.name, relation: 'Sibling of ' + p.name, slot: uftNameKey(s.name) });
        });
      });
      const g3Row = notOnBackbone(g3.concat(g3Peers));
      const olderG3 = g3Row.length ? cluster('Great-grandparents (G3) — siblings & extras', peopleHtml(g3Row, 'Great-grandparent'), '', 'Direct line names stay on the backbone; this row is brothers, sisters and others of that generation.') : '';
      const olderCount = g1.length + g2.length + g3.length;

      const sharedPat = [d.pgf, d.pgm].filter(function (n) { return uftCrossMarriageNote(d, n); });
      const sharedMat = [d.mgf, d.mgm].filter(function (n) { return uftCrossMarriageNote(d, n); });
      let gpUnits = cluster('Paternal grandparents',
          personCard(d.pgf, "Father's father", 'male', '', 'pgf') + personCard(d.pgm, "Father's mother", 'female', '', 'pgm'),
          peopleHtml(paternalKids),
          (sharedPat.length ? sharedPat.map(function (n) { return uftCrossMarriageNote(d, n); }).join(' ') + ' ' : '') +
          (pUncles.length ? 'Their children: your father and paternal uncles/aunts.' : 'Add father’s siblings to extend this house.')) +
        cluster('Maternal grandparents',
          personCard(d.mgf, "Mother's father", 'male', '', 'mgf') + personCard(d.mgm, "Mother's mother", 'female', '', 'mgm'),
          peopleHtml(maternalKids),
          (sharedMat.length ? sharedMat.map(function (n) { return uftCrossMarriageNote(d, n); }).join(' ') + ' ' : '') +
          (mUncles.length ? 'Their children: your mother and maternal uncles/aunts.' : 'Add mother’s siblings to extend this house.'));
      gpSibsP.forEach(function (u) {
        const ck = uftKidsOf(d, uftNameKey(u.name));
        gpUnits += cluster(u.name + ' · paternal great-uncle/aunt',
          personCard(u.name, 'Paternal great-uncle/aunt') + peopleHtml(uftSpouseOf(d, uftNameKey(u.name)), 'Spouse'),
          peopleHtml(ck, '1st cousin once removed'));
      });
      gpSibsM.forEach(function (u) {
        const ck = uftKidsOf(d, uftNameKey(u.name));
        gpUnits += cluster(u.name + ' · maternal great-uncle/aunt',
          personCard(u.name, 'Maternal great-uncle/aunt') + peopleHtml(uftSpouseOf(d, uftNameKey(u.name)), 'Spouse'),
          peopleHtml(ck, '1st cousin once removed'));
      });

      let parentUnits = cluster('Your parents',
          personCard(d.father, d.fatherY || 'Father', 'male', '', 'father') + personCard(d.mother, d.motherY || 'Mother', 'female', '', 'mother'),
          peopleHtml([{ name: d.self || '', relation: 'You' }].concat(uftBloodSiblings(d))),
          'You and your brothers/sisters only. Uncles have their own houses next to this couple.',
          true);
      pUncles.forEach(function (u) {
        const ck = uftKidsOf(d, uftNameKey(u.name));
        parentUnits += cluster(u.name + ' · paternal',
          personCard(u.name, 'Paternal uncle/aunt') + peopleHtml(uftSpouseOf(d, uftNameKey(u.name)), 'Spouse'),
          peopleHtml(ck, 'Cousin') || '<span class="uft-link-note">Add their children — they become your cousins</span>',
          ck.length ? 'Cousins live in this house.' : '');
      });
      mUncles.forEach(function (u) {
        const ck = uftKidsOf(d, uftNameKey(u.name));
        parentUnits += cluster(u.name + ' · maternal',
          personCard(u.name, 'Maternal uncle/aunt') + peopleHtml(uftSpouseOf(d, uftNameKey(u.name)), 'Spouse'),
          peopleHtml(ck, 'Cousin') || '<span class="uft-link-note">Add their children — they become your cousins</span>',
          ck.length ? 'Cousins live in this house.' : '');
      });

      const cousins = [];
      pUncles.concat(mUncles).forEach(function (u) {
        uftKidsOf(d, uftNameKey(u.name)).forEach(function (c) {
          if (uftSame(c.name, d.self) || uftSame(c.name, d.spouse) || uftIsBloodUncle(d, c.name)) return;
          cousins.push(c);
        });
      });
      const bloodSibs = uftBloodSiblings(d);
      const inLaws = uftInLawPeople(d);
      let youGen = cluster('Your blood generation',
        personCard(d.self, d.selfNote || 'You · focus', 'focus', 'focus'),
        peopleHtml(bloodSibs, 'Sibling') + peopleHtml(cousins, 'Cousin'),
        (bloodSibs.length || cousins.length) ? 'Your siblings and cousins only — not your spouse’s household.' : 'Add your siblings here. Uncles stay under your parents.');
      youGen += cluster("Spouse's family",
        personCard(d.spouse, d.spouse ? 'Spouse' : 'Spouse (not entered)', ''),
        peopleHtml(inLaws, 'In-law'),
        d.spouse
          ? (inLaws.length ? 'Only people attached to your spouse.' : 'Attach in-laws to your spouse. Your uncles stay on your side.')
          : 'Enter a spouse, then attach their relatives to them. Your uncles are not copied here.');

      let descUnits = cluster('Your household',
        personCard(d.self, 'You', 'focus', 'focus') + personCard(d.spouse, 'Spouse', '', '', 'spouse'),
        peopleHtml(myKids, 'Child'),
        myKids.length ? 'Offspring of your line.' : 'Add children to open the next generation.');
      const usedGrands = {};
      myKids.forEach(function (c) {
        const ck = uftKidsOf(d, uftNameKey(c.name));
        ck.forEach(function (g) { usedGrands[uftNorm(g.name)] = true; });
        descUnits += cluster(c.name + ' · your child',
          personCard(c.name, 'Child') + peopleHtml(uftSpouseOf(d, uftNameKey(c.name)), 'Spouse'),
          peopleHtml(ck, 'Grandchild') || '',
          ck.length ? 'Grandchildren under this child.' : 'Add this child’s offspring.');
      });
      const looseGrands = myGrands.filter(function (g) { return !usedGrands[uftNorm(g.name)]; });
      if (looseGrands.length) {
        descUnits += cluster('Grandchildren', '', peopleHtml(looseGrands, 'Grandchild'), myKids.length ? 'Attach each grandchild to a child to nest the branch.' : '');
      }

      const members = uftAllMembers(d);
      const summary = '<div class="uft-window-meta">' +
        members.length + ' unique member' + (members.length === 1 ? '' : 's') +
        ' · oldest generation first · tap status on a card' +
        '</div>';
      const lineNames = [];
      g1.forEach(function (p) { if (p.name) lineNames.push(p.name); });
      g2.forEach(function (p) { if (p.name) lineNames.push(p.name); });
      g3.forEach(function (p) { if (p.name) lineNames.push(p.name); });
      if (d.pgf) lineNames.push(d.pgf);
      if (d.father) lineNames.push(d.father);
      if (d.self) lineNames.push(d.self);
      const lineTitle = lineNames.length
        ? ('Descendant line: ' + lineNames.join(' → '))
        : 'Descendant pedigree — oldest generation first, youngest last';

      function lineKids(name, slot) {
        const bag = [];
        function push(n, sl, rel) {
          if (!n) return;
          if (bag.some(function (x) { return uftSame(x.name, n); })) return;
          bag.push({ name: n, slot: sl || uftNameKey(n), relation: rel || 'Child' });
        }
        uftKidsOf(d, slot || uftNameKey(name)).forEach(function (k) { push(k.name, uftNameKey(k.name), 'Child'); });
        if (name) uftKidsOf(d, uftNameKey(name)).forEach(function (k) { push(k.name, uftNameKey(k.name), 'Child'); });
        (d.relatives || []).forEach(function (r) {
          if (!r || !r.name) return;
          if (r.relation !== 'child' && r.relation !== 'grandchild' && r.relation !== 'offspring') return;
          const host = (uftCoreName(d, r.anchor) || String(r.anchor || '').replace(/^n:/, '')).trim();
          if (uftSame(host, name) || r.anchor === slot || r.anchor === uftNameKey(name)) {
            push(r.name, uftNameKey(r.name), r.relation === 'grandchild' ? 'Grandchild' : 'Child');
          }
        });
        uftSiblingsOf(d, slot || uftNameKey(name)).forEach(function (s) { /* siblings are peers, not kids */ });
        if (slot === 'g2' || uftLines(d.g2).some(function (n) { return uftSame(n, name); })) {
          uftLines(d.g3).forEach(function (n) { push(n, 'g3', 'Child · next gen'); });
          uftLines(d.g3).forEach(function (heir) {
            uftPeersOf(d, heir).forEach(function (s) {
              push(s.name, uftNameKey(s.name), 'Sibling of ' + heir);
            });
          });
        }
        if (slot === 'g3' || uftLines(d.g3).some(function (n) { return uftSame(n, name); })) {
          if (d.pgf) push(d.pgf, 'pgf', 'Child');
          uftSiblingsOf(d, 'pgf').forEach(function (s) { push(s.name, uftNameKey(s.name), 'Sibling of ' + (d.pgf || 'grandfather')); });
        }
        if (slot === 'pgf' || uftSame(name, d.pgf)) {
          if (d.father) push(d.father, 'father', 'Child');
          uftSiblingsOf(d, 'father').forEach(function (s) { push(s.name, uftNameKey(s.name), 'Sibling of ' + (d.father || 'father')); });
        }
        if (slot === 'father' || uftSame(name, d.father)) {
          if (d.self) push(d.self, 'self', 'Child');
          uftLines(d.siblings).forEach(function (n) { push(n, uftNameKey(n), 'Sibling'); });
          uftSiblingsOf(d, 'self').forEach(function (s) { push(s.name, uftNameKey(s.name), 'Sibling'); });
        }
        if (slot === 'self' || uftSame(name, d.self)) {
          uftLines(d.children).forEach(function (n) { push(n, uftNameKey(n), 'Child'); });
          uftSiblingsOf(d, 'self').filter(function () { return false; });
          uftKidsOf(d, 'self').forEach(function (k) { push(k.name, uftNameKey(k.name), 'Child'); });
        }
        bag.slice().forEach(function (child) {
          uftPeersOf(d, child.name).forEach(function (s) {
            push(s.name, uftNameKey(s.name), 'Sibling of ' + child.name);
          });
        });
        return bag;
      }
      function cardWithSpouse(person, depth) {
        if (!person || !person.name) return '';
        let html = '<div class="uft-dlimb"><div class="uft-dcouple">';
        html += personCard(person.name, person.relation || '', '', depth === 0 || uftSame(person.name, d.self) ? 'focus' : 'rel', person.slot);
        try {
          let spouses = uftSpouseOf(d, person.slot || uftNameKey(person.name)) || [];
          spouses = spouses.concat(uftSpouseOf(d, uftNameKey(person.name)) || []);
          (d.relatives || []).forEach(function (r) {
            if (!r || r.relation !== 'spouse') return;
            const host = (uftCoreName(d, r.anchor) || String(r.anchor || '').replace(/^n:/, '')).trim();
            if (uftSame(host, person.name)) spouses.push({ name: r.name });
            if (uftSame(r.name, person.name) && host) spouses.push({ name: host });
          });
          uftUniquePeople(spouses).forEach(function (sp) {
            if (sp && sp.name && !uftSame(sp.name, person.name)) {
              html += personCard(sp.name, 'Spouse', '', 'rel', uftNameKey(sp.name), person.slot || uftNameKey(person.name) || person.name);
            }
          });
        } catch (e) {}
        html += '</div></div>';
        return html;
      }
      const rootName = (g2[0] && g2[0].name) || (g1[0] && g1[0].name) || (g3[0] && g3[0].name) || d.pgf || d.father || d.self || '';
      const rootSlot = (g2[0] && g2[0].name) ? 'g2' : (g1[0] && g1[0].name) ? 'g1' : (g3[0] && g3[0].name) ? 'g3' : d.pgf ? 'pgf' : d.father ? 'father' : 'self';
      function yearOf(p) {
        const y = parseInt(uftBornOf(p && p.name, p && p.slot), 10);
        return isFinite(y) ? y : 0;
      }
      function sortByYear(list) {
        return (list || []).slice().sort(function (a, b) {
          const ya = yearOf(a), yb = yearOf(b);
          if (ya && yb && ya !== yb) return ya - yb;
          if (ya && !yb) return -1;
          if (!ya && yb) return 1;
          return String(a.name || '').localeCompare(String(b.name || ''));
        });
      }
      const seenTree = {};
      function drawVNode(person, depth) {
        if (!person || !person.name || depth > 8) return '';
        const key = uftNorm(person.name);
        if (key && seenTree[key]) return '';
        if (key) seenTree[key] = true;
        let kids = [];
        try { kids = sortByYear(uftLineKids(d, person.name, person.slot) || []); } catch (e) { kids = []; }
        kids = kids.filter(function (k) { return k && k.name && !seenTree[uftNorm(k.name)]; });
        // Siblings without children: vertical under parent.
        // Those who have their own offspring: horizontal peer row (with their subtrees).
        let html = '<li>';
        html += cardWithSpouse(person, depth);
        if (kids.length) {
          // One peer row for all offspring so new children join existing siblings
          html += '<ul class="uft-vpeers">';
          kids.forEach(function (k) { html += drawVNode(k, depth + 1); });
          html += '</ul>';
        }
        html += '</li>';
        return html;
      }
      let vtree = '';
      if (rootName) {
        vtree = '<ul class="uft-vtree">' + drawVNode({ name: rootName, slot: rootSlot, relation: 'Root' }, 0) + '</ul>';
      }
      const dtree = rootName ? ('<div class="uft-dtree"><div class="uft-dlabel">Family tree from ' + uftEsc(rootName) + ' down to ' + uftEsc(d.self || 'you') + '</div>' + vtree + '</div>') : '';
      const backbone = '<div class="uft-window-meta" style="font-weight:700;">' + uftEsc(lineTitle) + '</div><div class="uft-backbone">' +
        (g1.length ? '<div class="uft-col"><div class="uft-col-label">Oldest · G1</div>' + peopleHtml(g1, '3rd-great-grandparent') + '</div><div class="uft-connector"></div>' : '') +
        (g2.length ? '<div class="uft-col"><div class="uft-col-label">G2 · Karam Din gen</div>' + peopleHtml(g2, '2nd-great-grandparent') + '</div><div class="uft-connector"></div>' : '') +
        (g3.length ? '<div class="uft-col"><div class="uft-col-label">G3 · next</div>' + peopleHtml(g3, 'Great-grandparent') + '</div><div class="uft-connector"></div>' : '') +
        '<div class="uft-col"><div class="uft-col-label">Paternal GP</div>' + personCard(d.pgf, "Father's father", 'male', '', 'pgf') + personCard(d.pgm, "Father's mother", 'female', '', 'pgm') + '</div>' +
        '<div class="uft-connector"></div>' +
        '<div class="uft-col"><div class="uft-col-label">Maternal GP</div>' + personCard(d.mgf, "Mother's father", 'male', '', 'mgf') + personCard(d.mgm, "Mother's mother", 'female', '', 'mgm') + '</div>' +
        '<div class="uft-connector"></div>' +
        '<div class="uft-col"><div class="uft-col-label">Parents</div>' + personCard(d.father, d.fatherY || 'Father', 'male', '', 'father') + personCard(d.mother, d.motherY || 'Mother', 'female', '', 'mother') + '</div>' +
        '<div class="uft-connector"></div>' +
        '<div class="uft-col"><div class="uft-col-label">Youngest · You</div>' + personCard(d.self, d.selfNote || 'You', 'focus', 'focus', 'self') + personCard(d.spouse, 'Spouse', '', '', 'spouse') + '</div>' +
        '</div>';

      function gpsWhoHaveParent(hostId, hostName) {
        const found = [];
        ['pgf', 'pgm', 'mgf', 'mgm'].forEach(function (gid) {
          const gname = uftCoreName(d, gid);
          if (!gname) return;
          const parents = uftParentsOf(d, gid);
          if (parents.some(function (p) { return p.id === hostId || uftSame(p.name, hostName); })) {
            found.push({ id: gid, name: gname });
          }
        });
        return uftUniquePeople(found);
      }
      function hostSiblings(hostId, hostName) {
        let sibs = uftSiblingsOf(d, hostId);
        if (hostName) sibs = sibs.concat(uftSiblingsOf(d, uftNameKey(hostName)));
        return uftNotCorePeople(d, uftUniquePeople(sibs));
      }
      const placed = {};
      const extBuckets = { g1: '', g2: '', g3: '', gp: '', parents: '', you: '', desc: '' };
      const extCounts = { g1: 0, g2: 0, g3: 0, gp: 0, parents: 0, you: 0, desc: 0 };
      function hostBucket(hostId, hostName) {
        if (hostId === 'self' || hostId === 'spouse' || uftSame(hostName, d.self) || uftSame(hostName, d.spouse)) return 'you';
        if (hostId === 'father' || hostId === 'mother' || uftSame(hostName, d.father) || uftSame(hostName, d.mother)) return 'parents';
        if (hostId === 'pgf' || hostId === 'pgm' || hostId === 'mgf' || hostId === 'mgm') return 'gp';
        if (uftSame(hostName, d.pgf) || uftSame(hostName, d.pgm) || uftSame(hostName, d.mgf) || uftSame(hostName, d.mgm)) return 'gp';
        if (uftLines(d.children).some(function (n) { return uftSame(n, hostName); })) return 'desc';
        if (uftLines(d.g1).some(function (n) { return uftSame(n, hostName); })) return 'g1';
        if (uftLines(d.g2).some(function (n) { return uftSame(n, hostName); })) return 'g2';
        if (uftLines(d.g3).some(function (n) { return uftSame(n, hostName); })) return 'g3';
        return 'gp';
      }
      function placeHouse(personName, title, meta, note, bucket) {
        const key = uftNorm(personName);
        if (!key || placed[key]) return;
        placed[key] = true;
        const ck = uftKidsOf(d, uftNameKey(personName));
        const sp = uftSpouseOf(d, uftNameKey(personName));
        const b = bucket || 'gp';
        extBuckets[b] += cluster(title,
          personCard(personName, meta, '', 'rel', bucket || 'rel') + peopleHtml(sp, 'Spouse', bucket || 'rel'),
          peopleHtml(ck, 'Their children') || '<span class="uft-link-note">Add their spouse and children</span>',
          note);
        extCounts[b]++;
      }
      function considerHost(hostId, hostName) {
        const label = hostName || uftCoreName(d, hostId) || String(hostId).replace(/^n:/, '');
        if (!label) return;
        const sibs = hostSiblings(hostId, hostName);
        const gpKids = gpsWhoHaveParent(hostId, label);
        sibs.forEach(function (s) {
          if (gpKids.length) {
            const names = gpKids.map(function (g) { return g.name; }).join(', ');
            placeHouse(s.name, s.name + ' · uncle/aunt of ' + names,
              'Uncle/aunt of ' + names,
              'Sibling of ' + label + ', so uncle/aunt of ' + names + ' only.',
              hostBucket(hostId, label));
          } else {
            placeHouse(s.name, s.name + ' · sibling of ' + label,
              'Sibling of ' + label,
              'Family of ' + label + '.',
              hostBucket(hostId, label));
          }
        });
      }
      considerHost('pgf', d.pgf);
      considerHost('pgm', d.pgm);
      considerHost('mgf', d.mgf);
      considerHost('mgm', d.mgm);
      uftLines(d.g3).concat(uftLines(d.g2)).concat(uftLines(d.g1)).forEach(function (anc) {
        considerHost(uftNameKey(anc), anc);
      });
      (d.relatives || []).forEach(function (r) {
        if (!r || r.relation !== 'sibling') return;
        const hostName = uftCoreName(d, r.anchor) || String(r.anchor || '').replace(/^n:/, '');
        considerHost(r.anchor, hostName);
      });
      const extCount = extCounts.g1 + extCounts.g2 + extCounts.g3 + extCounts.gp + extCounts.parents + extCounts.you + extCounts.desc;
      if (!extCount) {
        extBuckets.gp = cluster('Uncles of one grandparent', '', '',
          'Attach an uncle as Sibling of that grandparent or of that grandparent’s parent. Each generation has its own window.');
      }

      // Clean view: main pedigree only (descendant tree + backbone). Extended gen-card bands removed.
      return '<div class="uft-window">' + summary + dtree + backbone + '</div>';
    }
    function uftToggleBand(id) {
      const key = 'clarity_uft_band_' + id;
      const section = document.querySelector('#uft-preview .uft-band[data-band="' + id + '"]');
      const currentlyOpen = section ? !section.classList.contains('collapsed') : (clarityLS.getItem(key) === 'on');
      const nextOpen = !currentlyOpen;
      try { clarityLS.setItem(key, nextOpen ? 'on' : 'off'); } catch (e) {}
      if (section) {
        // Toggle in place — do not re-render the whole pedigree (avoids scroll jump)
        section.classList.toggle('collapsed', !nextOpen);
        const cnt = section.querySelector('.uft-band-count');
        if (cnt) {
          const n = (cnt.textContent || '').replace(/\s*[·•].*$/, '').trim();
          cnt.textContent = n + ' · ' + (nextOpen ? '▾' : '▸');
        }
        return;
      }
      uftRender({ keepScroll: true });
    }
    function uftGroupHtml(d) {
      function rows(title, items) {
        if (!items.length) return '';
        return '<div class="uft-group-block"><h4>' + title + '</h4>' + items.join('') + '</div>';
      }
      return '<div class="uft-group-sheet">' +
        rows('Family group — focus', [
          uftPerson(d.self || '', d.selfNote || 'Focus person', 'focus', 'focus'),
          uftPerson(d.spouse || '', 'Spouse', '')
        ].filter(function (x) { return x; })) +
        rows('Parents', [
          uftPerson(d.father || '', d.fatherY || 'Father', 'male'),
          uftPerson(d.mother || '', d.motherY || 'Mother', 'female')
        ]) +
        rows('Paternal grandparents', [
          uftPerson(d.pgf || '', "Father's father", 'male'),
          uftPerson(d.pgm || '', "Father's mother", 'female')
        ]) +
        rows('Maternal grandparents', [
          uftPerson(d.mgf || '', "Mother's father", 'male'),
          uftPerson(d.mgm || '', "Mother's mother", 'female')
        ]) +
        rows('Great-grandparents', uftLines(d.g3).map(function (n) { return uftPerson(n, 'G3'); })) +
        rows('2nd-great-grandparents', uftLines(d.g2).map(function (n) { return uftPerson(n, 'G2'); })) +
        rows('3rd-great-grandparents', uftLines(d.g1).map(function (n) { return uftPerson(n, 'G1'); })) +
        rows('Siblings', uftUniquePeople(uftSiblingsOf(d, 'self').concat(uftLines(d.siblings).map(function (n) { return { name: n }; }))).map(function (n) { return uftPerson(n.name || n, 'Sibling'); })) +
        rows('Children', uftUniquePeople(uftKidsOf(d, 'self')).map(function (n) { return uftPerson(n.name, 'Child'); })) +
        rows('Grandchildren', uftLines(d.grandchildren).map(function (n) { return uftPerson(n, 'Grandchild'); })) +
        rows('Paternal uncles / aunts', uftSiblingsOf(d, 'father').map(function (r) { return uftPerson(r.name, 'Paternal uncle/aunt', '', 'rel'); })) +
        rows('Maternal uncles / aunts', uftSiblingsOf(d, 'mother').map(function (r) { return uftPerson(r.name, 'Maternal uncle/aunt', '', 'rel'); })) +
        rows("Uncles/aunts of father's father", uftUnclesOf(d, 'pgf').map(function (r) { return uftPerson(r.name, 'Uncle/aunt of ' + (d.pgf || "father's father"), '', 'rel'); })) +
        rows("Uncles/aunts of father's mother", uftUnclesOf(d, 'pgm').map(function (r) { return uftPerson(r.name, 'Uncle/aunt of ' + (d.pgm || "father's mother"), '', 'rel'); })) +
        rows("Uncles/aunts of mother's father", uftUnclesOf(d, 'mgf').map(function (r) { return uftPerson(r.name, 'Uncle/aunt of ' + (d.mgf || "mother's father"), '', 'rel'); })) +
        rows("Uncles/aunts of mother's mother", uftUnclesOf(d, 'mgm').map(function (r) { return uftPerson(r.name, 'Uncle/aunt of ' + (d.mgm || "mother's mother"), '', 'rel'); })) +
        rows('Added relations', (d.relatives || []).map(function (r) {
          return uftPerson(r.name, uftRoleToYou(d, r.name, uftAnchorLabel(r.anchor) + ' → ' + uftRelLabel(r.relation)), '', 'rel');
        })) +
        '</div>';
    }
    function uftListHtml(d) {
      let html = '';
      function block(title, lines, meta) {
        if (!lines.length) return;
        html += '<div class="uft-meta">' + title + '</div>' + lines.map(function (n) { return uftCard(n, meta); }).join('');
      }
      block('G1 · 3rd-great-grandparents', uftLines(d.g1));
      block('G2 · 2nd-great-grandparents', uftLines(d.g2));
      block('G3 · Great-grandparents', uftLines(d.g3));
      const gp = [d.pgf && ("Father's father: " + d.pgf), d.pgm && ("Father's mother: " + d.pgm), d.mgf && ("Mother's father: " + d.mgf), d.mgm && ("Mother's mother: " + d.mgm)].filter(Boolean);
      if (gp.length) html += '<div class="uft-meta">Grandparents</div>' + gp.map(function (g) { return uftCard(g, ''); }).join('');
      html += uftCard(d.father, d.fatherY || 'Father') + uftCard(d.mother, d.motherY || 'Mother');
      html += uftCard(d.self || '', d.selfNote || 'You', 'uft-self');
      html += uftCard(d.spouse, 'Spouse');
      block('Siblings', uftLines(d.siblings), 'Sibling');
      block('Children', uftLines(d.children), 'Child');
      block('Grandchildren', uftLines(d.grandchildren), 'Grandchild');
      const extra = (d.relatives || []).map(function (r) {
        return (r.name || '') + ' (' + uftAnchorLabel(r.anchor) + ' → ' + uftRelLabel(r.relation) + ')';
      }).filter(Boolean);
      block('Added relations', extra);
      return html;
    }
    function uftRender(opts) {
      const root = document.getElementById('uft-preview');
      if (!root) return;
      const keep = opts && opts.keepScroll;
      const wx = window.scrollX || 0, wy = window.scrollY || window.pageYOffset || 0;
      const winEl = document.querySelector('#uft-preview .uft-window');
      const sl = winEl ? winEl.scrollLeft : 0, st = winEl ? winEl.scrollTop : 0;
      const bandPos = {};
      document.querySelectorAll('#uft-preview .uft-band-scroll, #uft-preview .uft-backbone').forEach(function (el, i) {
        const id = el.closest('[data-band]') ? el.closest('[data-band]').getAttribute('data-band') : ('x' + i);
        bandPos[id] = { l: el.scrollLeft, t: el.scrollTop };
      });
      const d = uftCollect();
      uftVitalMap = (d && d.vital) || {};
      uftGenderMap = (d && d.gender) || {};
      uftBornMap = (d && d.born) || {};
      try { uftDrawTree(uftGenFilled(d)); } catch (e1) {}
      ['pedigree','group','list'].forEach(function (v) {
        const b = document.getElementById('uft-view-' + v);
        if (b) b.classList.toggle('active', uftView === v);
      });
      let html = '';
      try {
        // Categories / group / list views removed — single pedigree workspace
        if (false && uftView === 'group') html = uftGroupHtml(d);
        else if (false && uftView === 'list') html = uftListHtml(d);
        else html = uftPedigreeHtml(d);
      } catch (err) {
        html = '<p class="uft-empty">Pedigree could not draw (' + uftEsc(err && err.message ? err.message : err) + '). Use Family group or List, or tap Refresh.</p>';
      }
      uftEnsureZoomLayer(html || '<p class="uft-empty">Pedigree template ready. Fill names above; empty slots stay as Unknown like an Ancestry chart.</p>');
      try { uftZoomInit(); } catch (eZ) {}
      if (typeof uftRefreshVitalWho === 'function') uftRefreshVitalWho();
      if (typeof uftRegRender === 'function') {
        try {
          const _d = uftRead();
          if (!_d.registry || !_d.registry.length) uftRegImportTree();
          else uftRegRender();
        } catch (er) { uftRegRender(); }
      }
      if (typeof uftFillNameChoices === 'function') uftFillNameChoices();
      if (!root.dataset.vitalBound) {
        root.dataset.vitalBound = '1';
        root.addEventListener('click', function (ev) {
          const btn = ev.target && ev.target.closest ? ev.target.closest('[data-vital-name], [data-gender-name], [data-del-name], [data-born-name], [data-focus-name], [data-own-name]') : null;
          if (!btn) return;
          ev.preventDefault();
          ev.stopPropagation();
          if (btn.hasAttribute('data-del-name')) {
            uftDeletePerson(btn.getAttribute('data-del-name'), btn.getAttribute('data-del-slot') || '', btn.getAttribute('data-del-anchor') || '');
            return;
          }
          if (btn.hasAttribute('data-born-name')) {
            uftAskBorn(btn.getAttribute('data-born-name'), btn.getAttribute('data-born-slot') || '');
            return;
          }
          if (btn.hasAttribute('data-own-name')) {
            uftStartOwnTree(btn.getAttribute('data-own-name'), btn.getAttribute('data-own-slot') || '');
            return;
          }
          if (btn.hasAttribute('data-focus-name')) {
            uftOpenMemberView(btn.getAttribute('data-focus-name'), btn.getAttribute('data-focus-slot') || '');
            return;
          }
          if (btn.hasAttribute('data-gender-name')) {
            uftCycleGender(btn.getAttribute('data-gender-name'), btn.getAttribute('data-gender-slot') || '');
            return;
          }
          uftCycleVital(btn.getAttribute('data-vital-name'), btn.getAttribute('data-vital-slot') || '');
        });
      }
      if (keep) {
        window.scrollTo(wx, wy);
        const win2 = document.querySelector('#uft-preview .uft-window');
        if (win2) { win2.scrollLeft = sl; win2.scrollTop = st; }
        document.querySelectorAll('#uft-preview .uft-band-scroll, #uft-preview .uft-backbone').forEach(function (el, i) {
          const id = el.closest('[data-band]') ? el.closest('[data-band]').getAttribute('data-band') : ('x' + i);
          if (bandPos[id]) { el.scrollLeft = bandPos[id].l; el.scrollTop = bandPos[id].t; }
        });
      }
      try { if (typeof uftRenderOwnTreePanel === 'function') uftRenderOwnTreePanel(); } catch (eOwn) {}
    }
    document.addEventListener('DOMContentLoaded', function () {
      const pm = document.getElementById('uft-pick-modal');
      if (pm && !pm.dataset.bound) {
        pm.dataset.bound = '1';
        pm.addEventListener('click', function (e) {
          if (e.target === pm) uftClosePersonPicker();
        });
      }
      uftLoad();
      try { uftCollapseEditor(); } catch (e) {}
      const wrap = document.getElementById('uft-stage');
      if (wrap && !wrap.dataset.bound) {
        wrap.dataset.bound = '1';
        wrap.addEventListener('input', function () { uftRender(); uftScheduleSave(); });
      }
    });
    setTimeout(uftLoad, 400);

    // ========== Farāʾiḍ (educational inheritance from family tree) ==========
    function faraidAllTreePeople() {
      const d = (typeof uftCollect === 'function') ? uftCollect() : {};
      const list = [];
      const seen = {};
      function add(name, role, genderHint) {
        const n = String(name || '').trim();
        if (!n) return;
        const k = (typeof uftNorm === 'function') ? uftNorm(n) : n.toLowerCase();
        if (seen[k]) return;
        seen[k] = true;
        let g = genderHint || '';
        try {
          if (typeof uftGenderOf === 'function') {
            const gg = uftGenderOf(n, role || '');
            if (gg === 'male' || gg === 'female') g = gg;
          } else if (d.gender) {
            const key = (role ? role + '|' : '') + k;
            g = d.gender[key] || d.gender[k] || g;
          }
        } catch (e) {}
        if (!g && /mother|wife|daughter|niece|aunt|female|pgm|mgm/i.test(String(role || ''))) g = 'female';
        if (!g && /father|husband|son|nephew|uncle|male|pgf|mgf/i.test(String(role || ''))) g = 'male';
        list.push({ name: n, role: role || '', gender: g || '' });
      }
      add(d.self, 'self', 'male');
      add(d.spouse, 'spouse', 'female');
      add(d.father, 'father', 'male');
      add(d.mother, 'mother', 'female');
      add(d.pgf, 'pgf', 'male');
      add(d.pgm, 'pgm', 'female');
      add(d.mgf, 'mgf', 'male');
      add(d.mgm, 'mgm', 'female');
      (typeof uftLines === 'function' ? uftLines(d.siblings) : String(d.siblings || '').split(/\n/)).forEach(function (n) { add(n, 'sibling'); });
      (typeof uftLines === 'function' ? uftLines(d.children) : String(d.children || '').split(/\n/)).forEach(function (n) { add(n, 'child'); });
      (typeof uftLines === 'function' ? uftLines(d.grandchildren) : String(d.grandchildren || '').split(/\n/)).forEach(function (n) { add(n, 'grandchild'); });
      (typeof uftLines === 'function' ? uftLines(d.g1) : []).forEach(function (n) { add(n, 'g1'); });
      (typeof uftLines === 'function' ? uftLines(d.g2) : []).forEach(function (n) { add(n, 'g2'); });
      (typeof uftLines === 'function' ? uftLines(d.g3) : []).forEach(function (n) { add(n, 'g3'); });
      (d.relatives || []).forEach(function (r) {
        if (r && r.name) add(r.name, r.relation || 'relative');
      });
      (d.registry || []).forEach(function (r) {
        if (r && r.name) add(r.name, r.role || 'registry');
      });
      return list;
    }

    // ========== Wasiyyah (Islamic will) educational tool ==========
    var WASI_KEY = 'clarity_wasiyyah_draft_v1';
    var wasiCountryNotes = {
      PK: 'Pakistan: Muslim personal law and farāʾiḍ are widely applied for Muslim estates. Register/witness a written will; local counsel helps with property mutation and bank release.',
      IN: 'India: Muslims may follow Muslim personal law for inheritance. A written will should still meet Indian Succession formalities for smooth probate of assets.',
      BD: 'Bangladesh: Muslim family law governs Muslim inheritance. Document wasiyyah clearly; civil procedures still apply for property transfer.',
      MY: 'Malaysia: Muslims use Sharīʿah courts for inheritance. Wasiat may be registered (e.g. Amanah Raya / state channels). Farāʾiḍ applies; wasiat ≤ ⅓ to non-heirs.',
      ID: 'Indonesia: Islamic courts handle Muslim inheritance alongside Kompilasi Hukum Islam. Formal documentation and local notary practice matter for assets.',
      AE: 'UAE: Personal status law for Muslims includes wasiyyah rules; notarise/register through competent judicial channels in the relevant emirate.',
      SA: 'Saudi Arabia: Sharīʿah governs inheritance. Wasiyyah should respect the one-third limit and heir rules; local court procedures apply.',
      EG: 'Egypt: Personal status and inheritance rules for Muslims include wasiyyah limits; official documentation supports enforcement.',
      TR: 'Türkiye: Civil inheritance code applies by default. Muslims often still plan farāʾiḍ-compliant distributions via wills that satisfy Turkish formalities.',
      NG: 'Nigeria: Practice varies by state (customary, Sharīʿah, or common law). Document wasiyyah and use counsel familiar with your state.',
      ZA: 'South Africa: Freedom of testation under civil law — draft a valid civil will that instructs Islamic distribution so farāʾiḍ intent is enforceable.',
      GB: 'United Kingdom: Use a valid English/Scottish will. Without one, intestacy ignores farāʾiḍ. Many Muslims use wills that set out Sharīʿah shares.',
      US: 'United States: State probate law controls. A valid state will (witnesses/notary as required) is needed so distribution can follow farāʾiḍ + wasiyyah intent.',
      CA: 'Canada: Provincial wills formalities apply. Draft a compliant provincial will expressing Islamic distribution.',
      AU: 'Australia: State/territory wills formalities apply. Templates (e.g. community orgs) still need correct witnessing for validity.',
      OTHER: 'Wherever you live: (1) satisfy local will formalities so courts enforce your document; (2) keep wasiyyah within fiqh limits (≤ ⅓, non-heirs); (3) consult a scholar and a local solicitor.'
    };
    function wasiNum(id) {
      const v = parseFloat((document.getElementById(id) || {}).value || '0');
      return isFinite(v) && v > 0 ? v : 0;
    }
    function wasiNet() {
      const assets = wasiNum('wasi-assets');
      const funeral = wasiNum('wasi-funeral');
      const debts = wasiNum('wasi-debts');
      const net = Math.max(0, assets - funeral - debts);
      return { assets: assets, funeral: funeral, debts: debts, net: net, maxW: net / 3 };
    }
    function wasiRefreshNet() {
      const n = wasiNet();
      const cur = ((document.getElementById('wasi-currency') || {}).value || '').trim();
      const unit = cur ? (' ' + cur) : '';
      const el = document.getElementById('wasi-net-line');
      if (el) {
        el.textContent = 'Net after funeral & debts: ' + (n.net ? n.net.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—') + unit +
          ' · Max wasiyyah (⅓): ' + (n.net ? n.maxW.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—') + unit;
      }
      wasiRefreshBequestStatus();
    }
    function wasiOnCountry() {
      const code = ((document.getElementById('wasi-country') || {}).value || '');
      const note = document.getElementById('wasi-jurisdiction-note');
      if (note) note.textContent = wasiCountryNotes[code] || 'Choose a country to see how civil probate interacts with wasiyyah and farāʾiḍ.';
      wasiScheduleSave();
    }
    function wasiTreeNames() {
      const names = [];
      const seen = {};
      function push(n) {
        n = String(n || '').trim();
        if (!n) return;
        const k = (typeof uftNorm === 'function') ? uftNorm(n) : n.toLowerCase();
        if (seen[k]) return;
        seen[k] = true;
        names.push(n);
      }
      try {
        const d = (typeof uftCollect === 'function') ? uftCollect() : {};
        ['self','spouse','father','mother','pgf','pgm','mgf','mgm'].forEach(function (s) { push(d[s]); });
        ['g1','g2','g3','siblings','children','grandchildren'].forEach(function (f) {
          (typeof uftLines === 'function' ? uftLines(d[f]) : []).forEach(push);
        });
        (d.relatives || []).forEach(function (r) { if (r && r.name) push(r.name); });
        (d.registry || []).forEach(function (r) { if (r && r.name) push(r.name); });
      } catch (e) {}
      try {
        ((typeof uftGetStoredCards === 'function') ? uftGetStoredCards() : []).forEach(function (c) {
          if (c && c.name) push(c.name);
        });
      } catch (e) {}
      names.sort(function (a, b) { return a.localeCompare(b); });
      return names;
    }
    function wasiTreeOptionsHtml(selected) {
      const names = wasiTreeNames();
      let h = '<option value="">Pick from pedigree / cards…</option>';
      names.forEach(function (n) {
        const sel = selected && n === selected ? ' selected' : '';
        h += '<option value="' + String(n).replace(/"/g, '&quot;') + '"' + sel + '>' + String(n).replace(/</g, '') + '</option>';
      });
      return h;
    }
    function wasiApplyTreePick(inputId, sel) {
      if (!sel) return;
      const v = sel.value || '';
      const el = document.getElementById(inputId);
      if (el && v) el.value = v;
      wasiScheduleSave();
    }
    function wasiFillTreeSelects() {
      const ids = ['wasi-guardian-tree','wasi-guardian2-tree','wasi-executor-tree','wasi-executor2-tree'];
      ids.forEach(function (id) {
        const sel = document.getElementById(id);
        if (!sel) return;
        const prev = sel.value;
        sel.innerHTML = wasiTreeOptionsHtml(prev);
        if (prev) sel.value = prev;
      });
      document.querySelectorAll('#wasi-bequest-list .wasi-bq-tree').forEach(function (sel) {
        const prev = sel.value;
        const nameInp = sel.closest('.wasi-bq-row') && sel.closest('.wasi-bq-row').querySelector('.wasi-bq-name');
        sel.innerHTML = wasiTreeOptionsHtml(prev || (nameInp && nameInp.value) || '');
      });
      if (typeof uftSetStatus === 'function') uftSetStatus('Family tree names loaded into Wasiyyah pickers.');
    }
    function wasiPullFromFaraid() {
      const estate = parseFloat((document.getElementById('faraid-estate') || {}).value || '0') || 0;
      const funeral = parseFloat((document.getElementById('faraid-funeral') || {}).value || '0') || 0;
      const debts = parseFloat((document.getElementById('faraid-debts') || {}).value || '0') || 0;
      const wasiyyah = parseFloat((document.getElementById('faraid-wasiyyah') || {}).value || '0') || 0;
      const currency = ((document.getElementById('faraid-currency') || {}).value || '').trim();
      const netEl = document.getElementById('faraid-net');
      const set = function (id, v) {
        const el = document.getElementById(id);
        if (el && (v || v === 0)) el.value = v;
      };
      if (estate) set('wasi-assets', estate);
      set('wasi-funeral', funeral || 0);
      set('wasi-debts', debts || 0);
      if (currency) set('wasi-currency', currency);
      // If faraid had a wasiyyah amount and no bequest rows filled, seed one charity line
      wasiRefreshNet();
      if (wasiyyah > 0) {
        const box = document.getElementById('wasi-bequest-list');
        const hasNamed = box && Array.prototype.some.call(box.querySelectorAll('.wasi-bq-name'), function (inp) {
          return String(inp.value || '').trim();
        });
        if (!hasNamed) {
          if (box && !box.querySelector('.wasi-bq-row')) wasiAddBequest();
          const row = box && box.querySelector('.wasi-bq-row');
          if (row) {
            const nameInp = row.querySelector('.wasi-bq-name');
            const amtInp = row.querySelector('.wasi-bq-amt');
            if (nameInp && !nameInp.value) nameInp.value = 'Charitable causes (from Farāʾiḍ wasiyyah field)';
            if (amtInp) amtInp.value = wasiyyah;
          }
        }
      }
      wasiRefreshBequestStatus();
      wasiScheduleSave();
      const msg = estate
        ? ('Pulled Farāʾiḍ estate figures into Wasiyyah' + (netEl && netEl.value ? (' · net was ' + netEl.value) : ''))
        : 'Farāʾiḍ calculator has no estate amount yet — enter figures there first, then pull.';
      if (typeof uftSetStatus === 'function') uftSetStatus(msg);
      try {
        document.getElementById('wasi-assets').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (e) {}
    }
    function wasiAddBequest(data) {
      const box = document.getElementById('wasi-bequest-list');
      if (!box) return;
      const row = document.createElement('div');
      row.className = 'wasi-bq-row';
      row.style.gridTemplateColumns = '1fr';
      row.innerHTML =
        '<label>From family tree / cards<select class="wasi-bq-tree">' + wasiTreeOptionsHtml(data && data.name) + '</select></label>' +
        '<label>Beneficiary (non-heir)<input type="text" class="wasi-bq-name" placeholder="Name or charity"></label>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr auto;gap:0.35rem;align-items:end;">' +
        '<label>Amount<input type="number" class="wasi-bq-amt" min="0" step="any" placeholder="0"></label>' +
        '<label>% of net<input type="number" class="wasi-bq-pct" min="0" max="33.33" step="any" placeholder="optional"></label>' +
        '<button type="button" class="btn-secondary" title="Remove">×</button></div>';
      const btn = row.querySelector('button');
      btn.onclick = function () { row.remove(); wasiRefreshBequestStatus(); wasiScheduleSave(); };
      const treeSel = row.querySelector('.wasi-bq-tree');
      treeSel.onchange = function () {
        const v = treeSel.value || '';
        if (v) row.querySelector('.wasi-bq-name').value = v;
        wasiRefreshBequestStatus(); wasiScheduleSave();
      };
      row.querySelectorAll('input').forEach(function (inp) {
        inp.addEventListener('input', function () { wasiRefreshBequestStatus(); wasiScheduleSave(); });
      });
      if (data) {
        row.querySelector('.wasi-bq-name').value = data.name || '';
        row.querySelector('.wasi-bq-amt').value = data.amount != null ? data.amount : '';
        row.querySelector('.wasi-bq-pct').value = data.pct != null ? data.pct : '';
      }
      box.appendChild(row);
      wasiRefreshBequestStatus();
    }
    function wasiCollectBequests() {
      const rows = document.querySelectorAll('#wasi-bequest-list .wasi-bq-row');
      const n = wasiNet();
      const list = [];
      rows.forEach(function (row) {
        const name = (row.querySelector('.wasi-bq-name') || {}).value || '';
        const amount = parseFloat((row.querySelector('.wasi-bq-amt') || {}).value || '0') || 0;
        const pct = parseFloat((row.querySelector('.wasi-bq-pct') || {}).value || '0') || 0;
        let resolved = amount;
        if (!resolved && pct && n.net) resolved = n.net * (pct / 100);
        if (String(name).trim()) list.push({ name: String(name).trim(), amount: amount, pct: pct, resolved: resolved });
      });
      return list;
    }
    function wasiRefreshBequestStatus() {
      const n = wasiNet();
      const list = wasiCollectBequests();
      const sum = list.reduce(function (a, b) { return a + (b.resolved || 0); }, 0);
      const el = document.getElementById('wasi-bequest-status');
      if (!el) return;
      const cur = ((document.getElementById('wasi-currency') || {}).value || '').trim();
      const unit = cur ? (' ' + cur) : '';
      if (!n.net) {
        el.textContent = 'Enter assets (and costs) to check the one-third cap.';
        el.style.color = '';
        return;
      }
      const ok = sum <= n.maxW + 0.0001;
      el.textContent = 'Bequests total: ' + sum.toLocaleString(undefined, { maximumFractionDigits: 2 }) + unit +
        ' / max ' + n.maxW.toLocaleString(undefined, { maximumFractionDigits: 2 }) + unit +
        (ok ? ' ✓ within one-third' : ' ✗ exceeds one-third — reduce or note heir consent after death');
      el.style.color = ok ? '' : '#b45309';
    }
    function wasiCollect() {
      return {
        country: ((document.getElementById('wasi-country') || {}).value || ''),
        name: ((document.getElementById('wasi-name') || {}).value || '').trim(),
        city: ((document.getElementById('wasi-city') || {}).value || '').trim(),
        assets: wasiNum('wasi-assets'),
        currency: ((document.getElementById('wasi-currency') || {}).value || '').trim(),
        funeral: wasiNum('wasi-funeral'),
        debts: wasiNum('wasi-debts'),
        debtsDetail: ((document.getElementById('wasi-debts-detail') || {}).value || '').trim(),
        bequests: wasiCollectBequests(),
        guardian: ((document.getElementById('wasi-guardian') || {}).value || '').trim(),
        guardian2: ((document.getElementById('wasi-guardian2') || {}).value || '').trim(),
        executor: ((document.getElementById('wasi-executor') || {}).value || '').trim(),
        executor2: ((document.getElementById('wasi-executor2') || {}).value || '').trim(),
        notes: ((document.getElementById('wasi-notes') || {}).value || '').trim(),
        savedAt: new Date().toISOString()
      };
    }
    function wasiApply(d) {
      if (!d) return;
      const set = function (id, v) { const el = document.getElementById(id); if (el) el.value = v != null ? v : ''; };
      set('wasi-country', d.country || '');
      set('wasi-name', d.name || '');
      set('wasi-city', d.city || '');
      set('wasi-assets', d.assets || '');
      set('wasi-currency', d.currency || '');
      set('wasi-funeral', d.funeral || '');
      set('wasi-debts', d.debts || '');
      set('wasi-debts-detail', d.debtsDetail || '');
      set('wasi-guardian', d.guardian || '');
      set('wasi-guardian2', d.guardian2 || '');
      set('wasi-executor', d.executor || '');
      set('wasi-executor2', d.executor2 || '');
      set('wasi-notes', d.notes || '');
      const box = document.getElementById('wasi-bequest-list');
      if (box) box.innerHTML = '';
      (d.bequests || []).forEach(function (b) { wasiAddBequest(b); });
      if (!(d.bequests || []).length) wasiAddBequest();
      wasiOnCountry();
      wasiRefreshNet();
    }
    function wasiSave() {
      try { clarityLS.setItem(WASI_KEY, JSON.stringify(wasiCollect())); } catch (e) {}
      if (typeof uftSetStatus === 'function') uftSetStatus('Wasiyyah draft saved on this device.');
      else if (typeof showToast === 'function') showToast('Wasiyyah draft saved.');
    }
    var wasiSaveTimer = null;
    function wasiScheduleSave() {
      wasiRefreshNet();
      if (wasiSaveTimer) clearTimeout(wasiSaveTimer);
      wasiSaveTimer = setTimeout(function () {
        try { clarityLS.setItem(WASI_KEY, JSON.stringify(wasiCollect())); } catch (e) {}
      }, 400);
    }
    function wasiLoad() {
      try {
        const raw = clarityLS.getItem(WASI_KEY);
        if (raw) wasiApply(JSON.parse(raw));
        else if (!document.querySelector('#wasi-bequest-list .wasi-bq-row')) wasiAddBequest();
      } catch (e) {
        if (!document.querySelector('#wasi-bequest-list .wasi-bq-row')) wasiAddBequest();
      }
      ['wasi-assets','wasi-funeral','wasi-debts','wasi-currency','wasi-name','wasi-city','wasi-debts-detail','wasi-guardian','wasi-guardian2','wasi-executor','wasi-executor2','wasi-notes'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el && !el.dataset.wasiBound) {
          el.dataset.wasiBound = '1';
          el.addEventListener('input', wasiScheduleSave);
        }
      });
    }
    function wasiReset() {
      if (!confirm('Clear the wasiyyah form on this screen?')) return;
      try { clarityLS.removeItem(WASI_KEY); } catch (e) {}
      wasiApply({ bequests: [{}] });
      const res = document.getElementById('wasi-result');
      if (res) { res.style.display = 'none'; res.innerHTML = ''; }
    }
    function wasiGenerate() {
      const d = wasiCollect();
      const n = wasiNet();
      const cur = d.currency ? (' ' + d.currency) : '';
      const sumBq = (d.bequests || []).reduce(function (a, b) { return a + (b.resolved || 0); }, 0);
      const over = sumBq > n.maxW + 0.0001;
      const countryLabel = (document.getElementById('wasi-country') || {}).selectedOptions;
      const cName = countryLabel && countryLabel[0] ? countryLabel[0].textContent : (d.country || '—');
      let html = '<div class="faraid-result-body"><h3 style="margin-top:0;">Wasiyyah draft (educational)</h3>';
      html += '<p class="notes-hint">Not a substitute for legal advice or a formal will under local law. Have it reviewed and properly witnessed/notarised as required in <strong>' + String(cName).replace(/</g, '') + '</strong>.</p>';
      html += '<p>I, <strong>' + (d.name || '[Name]') + '</strong>' + (d.city ? (', of ' + d.city) : '') +
        ', being of sound mind, set out this wasiyyah for when Allah takes my soul.</p>';
      html += '<p><strong>Order of settlement:</strong> (1) funeral and burial costs; (2) debts and trusts; (3) optional wasiyyah up to one-third of what remains; (4) the remainder by farāʾiḍ among my heirs.</p>';
      html += '<p><strong>Estate figures (estimates):</strong> Assets ' + n.assets.toLocaleString() + cur +
        '; funeral ' + n.funeral.toLocaleString() + cur + '; debts ' + n.debts.toLocaleString() + cur +
        '; <strong>net ' + n.net.toLocaleString() + cur + '</strong>; max wasiyyah ⅓ = <strong>' + n.maxW.toLocaleString() + cur + '</strong>.</p>';
      if (d.debtsDetail) html += '<p><strong>Debts / trusts / rights to clarify:</strong> ' + String(d.debtsDetail).replace(/</g, '') + '</p>';
      if (d.bequests && d.bequests.length) {
        html += '<p><strong>Optional bequests (non-heirs):</strong></p><ul>';
        d.bequests.forEach(function (b) {
          html += '<li>' + String(b.name).replace(/</g, '') + ' — ' +
            (b.resolved ? b.resolved.toLocaleString(undefined, { maximumFractionDigits: 2 }) + cur : 'amount to confirm') +
            (b.pct ? (' (' + b.pct + '% of net)') : '') + '</li>';
        });
        html += '</ul>';
        html += '<p>Total bequests: <strong>' + sumBq.toLocaleString(undefined, { maximumFractionDigits: 2 }) + cur + '</strong>' +
          (over ? ' — <span style="color:#b45309;">exceeds one-third; reduce or obtain heir consent after death</span>.' : ' (within one-third, if figures hold).') + '</p>';
      } else {
        html += '<p><strong>Optional bequests:</strong> none specified (entire net after debts follows farāʾiḍ).</p>';
      }
      if (d.guardian || d.guardian2) {
        html += '<p><strong>Guardian for minor children:</strong> ' + String(d.guardian || '—').replace(/</g, '') +
          (d.guardian2 ? ('; alternate: ' + String(d.guardian2).replace(/</g, '')) : '') + '.</p>';
      }
      if (d.executor || d.executor2) {
        html += '<p><strong>Executor (waṣī):</strong> ' + String(d.executor || '—').replace(/</g, '') +
          (d.executor2 ? ('; alternate: ' + String(d.executor2).replace(/</g, '')) : '') + '.</p>';
      }
      html += '<p><strong>Remainder:</strong> After the above, my estate is to be distributed according to Islamic inheritance (farāʾiḍ). I ask my heirs to fear Allah and settle with justice.</p>';
      if (d.notes) html += '<p><strong>Other wishes:</strong> ' + String(d.notes).replace(/</g, '') + '</p>';
      html += '<p class="notes-hint">Jurisdiction note: ' + String(wasiCountryNotes[d.country] || wasiCountryNotes.OTHER).replace(/</g, '') + '</p>';
      html += '<p class="notes-hint">Sources for study: hadith of Saʿd ibn Abī Waqqāṣ (Bukhārī/Muslim) on the one-third limit; “no bequest to an heir”; IslamQA and classical fiqh on wasiyyah. Allah knows best.</p>';
      html += '</div>';
      const box = document.getElementById('wasi-result');
      if (box) {
        box.innerHTML = html;
        box.style.display = 'block';
        try { box.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) {}
      }
      wasiSave();
    }
    function wasiPrint() {
      wasiGenerate();
      const box = document.getElementById('wasi-result');
      if (!box || !box.innerHTML) return;
      document.body.classList.add('printing');
      const sheet = document.createElement('div');
      sheet.className = 'print-sheet';
      sheet.innerHTML = box.innerHTML;
      document.body.appendChild(sheet);
      window.print();
      setTimeout(function () {
        document.body.classList.remove('printing');
        sheet.remove();
      }, 400);
    }

    function faraidFillDeceasedSelect() {
      const sel = document.getElementById('faraid-deceased');
      if (!sel) return;
      const people = faraidAllTreePeople();
      const prev = sel.value;
      sel.innerHTML = '<option value="">Select deceased…</option>' + people.map(function (p) {
        return '<option value="' + String(p.name).replace(/"/g, '&quot;') + '">' + p.name + (p.role ? ' (' + p.role + ')' : '') + '</option>';
      }).join('');
      if (prev) sel.value = prev;
    }
    function faraidOnDeceasedChange() {
      const name = (document.getElementById('faraid-deceased') || {}).value || '';
      const people = faraidAllTreePeople();
      const hit = people.find(function (p) { return p.name === name; });
      const gSel = document.getElementById('faraid-gender');
      if (hit && hit.gender && gSel) gSel.value = hit.gender;
    }
    function faraidSameName(a, b) {
      if (typeof uftSame === 'function') return uftSame(a, b);
      return String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
    }
    function faraidGenderOfName(name, roleHint) {
      let g = '';
      const slots = [roleHint || '', 'g1', 'g2', 'g3', 'self', 'spouse', 'father', 'mother', 'pgf', 'pgm', 'mgf', 'mgm', ''];
      try {
        if (typeof uftGenderOf === 'function') {
          for (let i = 0; i < slots.length; i++) {
            const gg = uftGenderOf(name, slots[i]);
            if (gg === 'male' || gg === 'female') return gg;
          }
        }
        const d = (typeof uftCollect === 'function') ? uftCollect() : {};
        const k = (typeof uftNorm === 'function') ? uftNorm(name) : String(name || '').toLowerCase();
        const map = (d && d.gender) || {};
        if (map[k] === 'male' || map[k] === 'female') return map[k];
        const keys = Object.keys(map);
        for (let j = 0; j < keys.length; j++) {
          const key = keys[j];
          const bare = key.indexOf('|') >= 0 ? key.slice(key.lastIndexOf('|') + 1) : key.replace(/^n:/, '');
          if (bare === k && (map[key] === 'male' || map[key] === 'female')) return map[key];
        }
      } catch (e) {}
      if (/mother|wife|daughter|niece|aunt|sister|female|pgm|mgm/i.test(String(roleHint || ''))) g = 'female';
      else if (/father|husband|son|nephew|uncle|brother|male|pgf|mgf/i.test(String(roleHint || ''))) g = 'male';
      return g || '';
    }
    function faraidChildRelation(name, slot) {
      const g = faraidGenderOfName(name, slot || 'child');
      if (g === 'female') return 'daughter';
      if (g === 'male') return 'son';
      // unknown — leave as son only if no gender; still better to check name cues
      if (/\b(bibi|begum|bano|fatima|aisha|ayesha|maryam|zainab|khadija)\b/i.test(name)) return 'daughter';
      return 'son';
    }
    /** Close blood + marital heirs of one person only (not the whole extended tree). */
    function faraidIsDeceased(name, slot) {
      try {
        const d = (typeof uftCollect === 'function') ? uftCollect() : ((typeof uftRead === 'function') ? uftRead() : {});
        const vit = Object.assign({}, (d && d.vital) || {}, (typeof uftVitalMap !== 'undefined' && uftVitalMap) ? uftVitalMap : {});
        try { uftVitalMap = vit; } catch (e) {}
        const n = (typeof uftNorm === 'function') ? uftNorm(name) : String(name || '').trim().toLowerCase();
        if (!n) return false;
        const slotL = String(slot || '').trim().toLowerCase();
        const keys = Object.keys(vit);
        let slotAlive = false, slotDead = false, anyDead = false, anyAlive = false;
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const bare = key.indexOf('|') >= 0 ? key.slice(key.lastIndexOf('|') + 1) : key.replace(/^n:/i, '');
          if (bare !== n && !(typeof uftSame === 'function' && uftSame(bare, name))) continue;
          const prefix = key.indexOf('|') >= 0 ? key.slice(0, key.lastIndexOf('|')).toLowerCase() : '';
          const val = vit[key];
          if (val === 'deceased') anyDead = true;
          if (val === 'alive') anyAlive = true;
          if (slotL) {
            if (prefix === slotL || key.toLowerCase() === (slotL + '|' + n)) {
              if (val === 'deceased') slotDead = true;
              if (val === 'alive') slotAlive = true;
            }
          }
        }
        // Explicit slot wins
        if (slotL && slotDead) return true;
        if (slotL && slotAlive) return false;
        try {
          if (typeof uftVitalOf === 'function') {
            if (slotL) {
              const st = uftVitalOf(name, slot);
              if (st === 'deceased') return true;
              if (st === 'alive') return false;
            }
            // Try generation slots for this name (card may store g1|name)
            const gens = ['g1', 'g2', 'g3', 'self', 'father', 'mother', 'pgf', 'pgm', 'mgf', 'mgm', ''];
            for (let j = 0; j < gens.length; j++) {
              const st2 = uftVitalOf(name, gens[j]);
              if (st2 === 'deceased') { anyDead = true; if (!slotL || slotL === gens[j]) return true; }
              if (st2 === 'alive') anyAlive = true;
            }
          }
        } catch (e) {}
        // Generation lines: if person is listed on g1/g2/g3 and that generation key is deceased, treat as dead
        try {
          const lines = {
            g1: (typeof uftLines === 'function' ? uftLines(d.g1) : []),
            g2: (typeof uftLines === 'function' ? uftLines(d.g2) : []),
            g3: (typeof uftLines === 'function' ? uftLines(d.g3) : [])
          };
          ['g1', 'g2', 'g3'].forEach(function (gen) {
            const onGen = (lines[gen] || []).some(function (x) {
              return (typeof uftNorm === 'function' ? uftNorm(x) : String(x).toLowerCase()) === n;
            });
            if (!onGen) return;
            const gk = gen + '|' + n;
            if (vit[gk] === 'deceased') anyDead = true;
            if (vit[gk] === 'alive') anyAlive = true;
            if (typeof uftVitalOf === 'function') {
              const stg = uftVitalOf(name, gen);
              if (stg === 'deceased') anyDead = true;
              if (stg === 'alive') anyAlive = true;
            }
          });
        } catch (e) {}
        // Person-level: bare name or any slot deceased, unless another slot is explicitly alive (two people same name)
        if (slotAlive) return false;
        if (anyAlive && anyDead) {
          // Same name used twice: only treat as dead if requested slot is dead or bare key is dead
          if (slotDead) return true;
          if (vit[n] === 'deceased') return true;
          return false;
        }
        if (anyDead) return true;
        if (vit[n] === 'deceased') return true;
      } catch (e) {}
      return false;
    }
    function faraidIsAlive(name, slot) {
      return !faraidIsDeceased(name, slot);
    }
    function faraidCloseHeirsOf(deceased) {
      const d = (typeof uftCollect === 'function') ? uftCollect() : {};
      try { uftVitalMap = (d && d.vital) || {}; } catch (e) {}
      const heirs = [];
      const seen = {};
      function push(name, relation, genderHint, slot) {
        const n = String(name || '').trim();
        if (!n || faraidSameName(n, deceased)) return;
        // Heirs must be living — skip anyone marked deceased on the tree (slot-specific for same names)
        if (faraidIsDeceased(n, slot || '')) return;
        // Extra: G1 parents — if this name is on g1 lines and marked deceased under a g1 key, skip
        if ((slot === 'g1' || relation === 'father' || relation === 'mother') && slot === 'g1') {
          if (faraidIsDeceased(n, 'g1')) return;
        }
        const key = relation + '|' + ((typeof uftNorm === 'function') ? uftNorm(n) : n.toLowerCase());
        if (seen[key]) return;
        seen[key] = true;
        let g = genderHint || faraidGenderOfName(n, slot || relation);
        if (!g) g = faraidGenderOfName(n, relation);
        if (!g) {
          if (relation === 'mother' || relation === 'daughter' || relation === 'sister') g = 'female';
          else if (relation === 'father' || relation === 'son' || relation === 'brother') g = 'male';
          else if (relation === 'spouse') {
            const dg = (document.getElementById('faraid-gender') || {}).value || 'male';
            g = dg === 'male' ? 'female' : 'male';
          }
        }
        // Align relation with known gender (avoid "son" + female)
        if (g === 'female' && relation === 'son') relation = 'daughter';
        if (g === 'male' && relation === 'daughter') relation = 'son';
        if (g === 'female' && relation === 'grandson') relation = 'granddaughter';
        if (g === 'male' && relation === 'granddaughter') relation = 'grandson';
        if (g === 'female' && relation === 'great-grandson') relation = 'great-granddaughter';
        if (g === 'male' && relation === 'great-granddaughter') relation = 'great-grandson';
        if (g === 'female' && relation === 'father') relation = 'mother';
        if (g === 'male' && relation === 'mother') relation = 'father';
        if (g === 'female' && relation === 'brother') relation = 'sister';
        if (g === 'male' && relation === 'sister') relation = 'brother';
        heirs.push({ name: n, relation: relation, gender: g || 'male', slot: slot || '' });
      }
      /** Relation label by generations below the deceased (1=child, 2=grandchild, 3+=great-grandchild). */
      function faraidDescRelation(name, depth) {
        const g = faraidGenderOfName(name, 'child');
        const female = g === 'female';
        if (depth <= 1) return female ? 'daughter' : 'son';
        if (depth === 2) return female ? 'granddaughter' : 'grandson';
        return female ? 'great-granddaughter' : 'great-grandson';
      }
      /** Build parent→children map from tree links + generation backbone. */
      function faraidBuildChildMap() {
        const map = {};
        function keyOf(x) {
          return (typeof uftNorm === 'function') ? uftNorm(x) : String(x || '').trim().toLowerCase();
        }
        function add(parent, child) {
          const p = String(parent || '').trim();
          const c = String(child || '').trim();
          if (!p || !c || faraidSameName(p, c)) return;
          const k = keyOf(p);
          if (!map[k]) map[k] = { name: p, kids: [] };
          if (!map[k].kids.some(function (x) { return faraidSameName(x, c); })) map[k].kids.push(c);
        }
        // Core family edges
        if (d.father) {
          add(d.father, d.self);
          (typeof uftLines === 'function' ? uftLines(d.siblings) : []).forEach(function (s) { add(d.father, s); });
        }
        if (d.mother) {
          add(d.mother, d.self);
          (typeof uftLines === 'function' ? uftLines(d.siblings) : []).forEach(function (s) { add(d.mother, s); });
        }
        if (d.self) {
          (typeof uftLines === 'function' ? uftLines(d.children) : []).forEach(function (c) { add(d.self, c); });
          (typeof uftLines === 'function' ? uftLines(d.grandchildren) : []).forEach(function (c) {
            // grandchildren of focus — attach under each child if only one child, else keep under self as depth handled later
            const kids = (typeof uftLines === 'function' ? uftLines(d.children) : []);
            if (kids.length === 1) add(kids[0], c);
            else add(d.self, c);
          });
        }
        if (d.pgf) add(d.pgf, d.father);
        if (d.pgm) add(d.pgm, d.father);
        if (d.mgf) add(d.mgf, d.mother);
        if (d.mgm) add(d.mgm, d.mother);
        // Generation backbone: G1 → G2 → G3 → grandparents → parents → you
        const g1 = (typeof uftLines === 'function') ? uftLines(d.g1) : [];
        const g2 = (typeof uftLines === 'function') ? uftLines(d.g2) : [];
        const g3 = (typeof uftLines === 'function') ? uftLines(d.g3) : [];
        // If a generation has a single person, connect all next-gen names as their children
        if (g1.length === 1 && g2.length) g2.forEach(function (c) { add(g1[0], c); });
        if (g2.length === 1 && g3.length) g3.forEach(function (c) { add(g2[0], c); });
        // Multi-person gens: still connect via relatives only (below)
        // When G2 has one name (Karam Din) and G3 many — already handled
        // G3 single → link to both paternal grandparents if present (blood line uncertainty: only if one GP side)
        if (g3.length === 1) {
          if (d.pgf) add(g3[0], d.pgf);
          else if (d.father) add(g3[0], d.father);
        }
        // Multi G2: still attach G3 names that have no parent edge yet under each G2? Only under sole or under all linked.
        // Attach unparented G3 under every G2 name (user rebuilds links if wrong) — better: under all G2 if only one G2 is deceased walk target handled at seed time
        // Attach G3 → next backbone person when G3 is single-file line
        if (g3.length >= 1) {
          const nextLine = [];
          if (d.pgf) nextLine.push(d.pgf);
          if (d.pgm) nextLine.push(d.pgm);
          if (!nextLine.length && d.father) nextLine.push(d.father);
          if (g3.length === 1) nextLine.forEach(function (c) { add(g3[0], c); });
        }
        // If G2 names exist and G3 names exist but some G3 have zero parents in map, attach them to all G2 (weak heuristic)
        // Refined at end after relatives
        // Explicit relative edges
        (d.relatives || []).forEach(function (r) {
          if (!r || !r.name) return;
          const host = (typeof uftCoreName === 'function' ? uftCoreName(d, r.anchor) : '') || String(r.anchor || '').replace(/^n:/, '');
          if (!host) return;
          if (r.relation === 'child' || r.relation === 'offspring') add(host, r.name);
          if (r.relation === 'grandchild') {
            // grandchild of host — try attach under host's children, else host
            const hostKids = (map[keyOf(host)] && map[keyOf(host)].kids) || [];
            if (hostKids.length === 1) add(hostKids[0], r.name);
            else add(host, r.name);
          }
          if (r.relation === 'sibling') {
            // siblings share parents of host — if parents known, add under parents
            if (d.father && (faraidSameName(host, d.self) || faraidSameName(host, d.father))) add(d.father, r.name);
            if (d.mother && (faraidSameName(host, d.self) || faraidSameName(host, d.mother))) add(d.mother, r.name);
          }
        });
        // uftKidsOf for every known person name on the tree
        const everyone = [];
        ['self','spouse','father','mother','pgf','pgm','mgf','mgm'].forEach(function (s) { if (d[s]) everyone.push({ name: d[s], slot: s }); });
        g1.forEach(function (n) { everyone.push({ name: n, slot: 'g1' }); });
        g2.forEach(function (n) { everyone.push({ name: n, slot: 'g2' }); });
        g3.forEach(function (n) { everyone.push({ name: n, slot: 'g3' }); });
        (typeof uftLines === 'function' ? uftLines(d.siblings) : []).forEach(function (n) { everyone.push({ name: n, slot: '' }); });
        (typeof uftLines === 'function' ? uftLines(d.children) : []).forEach(function (n) { everyone.push({ name: n, slot: '' }); });
        try {
          if (typeof uftKidsOf === 'function') {
            everyone.forEach(function (p) {
              const anchors = [(typeof uftNameKey === 'function') ? uftNameKey(p.name) : p.name, p.slot, p.name].filter(Boolean);
              anchors.forEach(function (a) {
                try {
                  uftKidsOf(d, a).forEach(function (k) { if (k && k.name) add(p.name, k.name); });
                } catch (e) {}
              });
            });
          }
        } catch (e) {}
        // Unparented G3 → attach under G2 names so deceased Karam Din still reaches next gen
        (function () {
          function keyOf(x) {
            return (typeof uftNorm === 'function') ? uftNorm(x) : String(x || '').trim().toLowerCase();
          }
          const parentsOf = {};
          Object.keys(map).forEach(function (pk) {
            (map[pk].kids || []).forEach(function (c) {
              parentsOf[keyOf(c)] = true;
            });
          });
          g3.forEach(function (c) {
            if (parentsOf[keyOf(c)]) return;
            if (g2.length === 1) add(g2[0], c);
            else g2.forEach(function (p) { add(p, c); });
          });
          g2.forEach(function (c) {
            if (parentsOf[keyOf(c)]) return;
            if (g1.length === 1) add(g1[0], c);
            else g1.forEach(function (p) { add(p, c); });
          });
          // Unparented backbone under G3: father/pgf
          [d.pgf, d.father].forEach(function (c) {
            if (!c || parentsOf[keyOf(c)]) return;
            if (g3.length === 1) add(g3[0], c);
          });
        })();
        return map;
      }
      function faraidCollectKids(personName, personSlot) {
        const map = faraidChildMap || (faraidChildMap = faraidBuildChildMap());
        const k = (typeof uftNorm === 'function') ? uftNorm(personName) : String(personName || '').trim().toLowerCase();
        const row = map[k];
        return row ? row.kids.slice() : [];
      }
      var faraidChildMap = null;
      /**
       * Walk descendants of the deceased:
       * - living child → son/daughter
       * - deceased child → their living descendants (grandson…), never labeled as "son"
       * - living person blocks their own descendants from inheriting from this deceased
       */
      function pushOffspringLine(childName, childSlot, depth) {
        depth = depth || 1;
        if (depth > 8) return;
        const n = String(childName || '').trim();
        if (!n || faraidSameName(n, deceased)) return;
        const isDead = faraidIsDeceased(n, childSlot || '') || faraidIsDeceased(n, '');
        if (!isDead) {
          const g = faraidGenderOfName(n, childSlot || 'child');
          const rel = faraidDescRelation(n, depth);
          push(n, rel, g, childSlot || '');
          return; // living descendant blocks lower gens from this deceased
        }
        // Deceased intermediate → include living widow of first-degree child
        if (depth === 1) {
          try {
            const spAnchor = (typeof uftNameKey === 'function') ? uftNameKey(n) : n;
            const widows = [];
            if (typeof uftSpouseOf === 'function') {
              uftSpouseOf(d, spAnchor).forEach(function (s) { if (s && s.name) widows.push(s.name); });
              uftSpouseOf(d, n).forEach(function (s) { if (s && s.name) widows.push(s.name); });
            }
            (d.relatives || []).forEach(function (r) {
              if (!r || r.relation !== 'spouse' || !r.name) return;
              const host = (typeof uftCoreName === 'function' ? uftCoreName(d, r.anchor) : '') || String(r.anchor || '').replace(/^n:/, '');
              if (r.anchor === spAnchor || faraidSameName(host, n)) widows.push(r.name);
            });
            widows.forEach(function (w) {
              if (faraidIsDeceased(w, '')) return;
              const wg = faraidGenderOfName(w, 'spouse') || 'female';
              push(w, "son's widow", wg, '');
            });
          } catch (e) {}
        }
        // Recurse into children of this deceased intermediate
        const kids = faraidCollectKids(n, childSlot);
        kids.forEach(function (gn) {
          let nextSlot = '';
          try {
            const g1 = (typeof uftLines === 'function') ? uftLines(d.g1) : [];
            const g2 = (typeof uftLines === 'function') ? uftLines(d.g2) : [];
            const g3 = (typeof uftLines === 'function') ? uftLines(d.g3) : [];
            if (g1.some(function (x) { return faraidSameName(x, gn); })) nextSlot = 'g1';
            else if (g2.some(function (x) { return faraidSameName(x, gn); })) nextSlot = 'g2';
            else if (g3.some(function (x) { return faraidSameName(x, gn); })) nextSlot = 'g3';
            else if (faraidSameName(gn, d.father)) nextSlot = 'father';
            else if (faraidSameName(gn, d.mother)) nextSlot = 'mother';
            else if (faraidSameName(gn, d.pgf)) nextSlot = 'pgf';
            else if (faraidSameName(gn, d.pgm)) nextSlot = 'pgm';
            else if (faraidSameName(gn, d.self)) nextSlot = 'self';
          } catch (e) {}
          pushOffspringLine(gn, nextSlot, depth + 1);
        });
      }

      function kidsOfAnchor(anchor, nameFallback) {
        const list = [];
        try {
          if (typeof uftKidsOf === 'function') {
            uftKidsOf(d, anchor).forEach(function (k) { if (k && k.name) list.push(k.name); });
            if (nameFallback) uftKidsOf(d, (typeof uftNameKey === 'function') ? uftNameKey(nameFallback) : nameFallback).forEach(function (k) {
              if (k && k.name) list.push(k.name);
            });
          }
        } catch (e) {}
        (d.relatives || []).forEach(function (r) {
          if (!r || !r.name) return;
          if (r.relation !== 'child' && r.relation !== 'offspring' && r.relation !== 'grandchild') return;
          const host = (typeof uftCoreName === 'function' ? uftCoreName(d, r.anchor) : '') || String(r.anchor || '').replace(/^n:/, '');
          if (r.anchor === anchor || faraidSameName(host, nameFallback) || faraidSameName(host, deceased)) {
            if (r.relation === 'grandchild') return; // children only for primary heir list
            list.push(r.name);
          }
        });
        return list;
      }
      function sibsOfAnchor(anchor, nameFallback) {
        const list = [];
        try {
          if (typeof uftSiblingsOf === 'function') {
            uftSiblingsOf(d, anchor).forEach(function (s) { if (s && s.name) list.push(s.name); });
            if (nameFallback) uftSiblingsOf(d, (typeof uftNameKey === 'function') ? uftNameKey(nameFallback) : nameFallback).forEach(function (s) {
              if (s && s.name) list.push(s.name);
            });
          }
        } catch (e) {}
        (d.relatives || []).forEach(function (r) {
          if (!r || r.relation !== 'sibling' || !r.name) return;
          const host = (typeof uftCoreName === 'function' ? uftCoreName(d, r.anchor) : '') || String(r.anchor || '').replace(/^n:/, '');
          if (r.anchor === anchor || faraidSameName(host, nameFallback) || faraidSameName(host, deceased)) list.push(r.name);
        });
        return list;
      }
      function spouseOfAnchor(anchor, nameFallback) {
        const list = [];
        try {
          if (typeof uftSpouseOf === 'function') {
            uftSpouseOf(d, anchor).forEach(function (s) { if (s && s.name) list.push(s.name); });
            if (nameFallback) uftSpouseOf(d, (typeof uftNameKey === 'function') ? uftNameKey(nameFallback) : nameFallback).forEach(function (s) {
              if (s && s.name) list.push(s.name);
            });
          }
        } catch (e) {}
        (d.relatives || []).forEach(function (r) {
          if (!r || r.relation !== 'spouse' || !r.name) return;
          const host = (typeof uftCoreName === 'function' ? uftCoreName(d, r.anchor) : '') || String(r.anchor || '').replace(/^n:/, '');
          if (r.anchor === anchor || faraidSameName(host, nameFallback) || faraidSameName(r.name, nameFallback) && faraidSameName(host, deceased) === false) {
            if (r.anchor === anchor || faraidSameName(host, deceased) || faraidSameName(host, nameFallback)) list.push(r.name);
          }
        });
        return list;
      }

      // --- Case: deceased is the tree focus (You) ---
      if (faraidSameName(deceased, d.self)) {
        push(d.spouse, 'spouse', 'female');
        push(d.father, 'father', 'male');
        push(d.mother, 'mother', 'female');
        kidsOfAnchor('self', d.self).forEach(function (n) { pushOffspringLine(n, 'self'); });
        (typeof uftLines === 'function' ? uftLines(d.children) : String(d.children || '').split(/\n/)).forEach(function (n) { pushOffspringLine(n, ''); });
        sibsOfAnchor('self', d.self).forEach(function (n) {
          const g = faraidGenderOfName(n, 'sibling');
          push(n, g === 'female' ? 'sister' : 'brother', g);
        });
        (typeof uftLines === 'function' ? uftLines(d.siblings) : String(d.siblings || '').split(/\n/)).forEach(function (n) {
          const g = faraidGenderOfName(n, 'sibling');
          push(n, g === 'female' ? 'sister' : 'brother', g);
        });
        return heirs;
      }

      // --- Case: deceased is spouse of You ---
      if (faraidSameName(deceased, d.spouse)) {
        push(d.self, 'spouse', faraidGenderOfName(d.self, 'self') || 'male');
        // Shared children with focus
        kidsOfAnchor('self', d.self).forEach(function (n) { pushOffspringLine(n, 'self'); });
        (typeof uftLines === 'function' ? uftLines(d.children) : []).forEach(function (n) { pushOffspringLine(n, ''); });
        kidsOfAnchor('spouse', d.spouse).forEach(function (n) { pushOffspringLine(n, 'spouse'); });
        // In-laws of spouse are NOT auto-included (their parents are not on this tree as blood of spouse necessarily)
        return heirs;
      }

      // --- Case: deceased is father ---
      if (faraidSameName(deceased, d.father)) {
        // Only LIVING widow / parents of the deceased father
        push(d.mother, 'spouse', 'female', 'mother');
        push(d.pgf, 'father', 'male', 'pgf');
        push(d.pgm, 'mother', 'female', 'pgm');
        // Living offspring of father (you + your siblings); if a child is deceased, next gen is pulled
        pushOffspringLine(d.self, 'self');
        sibsOfAnchor('father', d.father).forEach(function (n) { if (!faraidSameName(n, d.self)) pushOffspringLine(n, ''); });
        kidsOfAnchor('father', d.father).forEach(function (n) { if (!faraidSameName(n, d.self)) pushOffspringLine(n, 'father'); });
        (typeof uftLines === 'function' ? uftLines(d.siblings) : []).forEach(function (n) { pushOffspringLine(n, ''); });
        sibsOfAnchor('self', d.self).forEach(function (n) { pushOffspringLine(n, ''); });
        return heirs;
      }

      // --- Case: deceased is mother ---
      if (faraidSameName(deceased, d.mother)) {
        push(d.father, 'spouse', 'male', 'father');
        push(d.mgf, 'father', 'male', 'mgf');
        push(d.mgm, 'mother', 'female', 'mgm');
        pushOffspringLine(d.self, 'self');
        kidsOfAnchor('mother', d.mother).forEach(function (n) { if (!faraidSameName(n, d.self)) pushOffspringLine(n, 'mother'); });
        (typeof uftLines === 'function' ? uftLines(d.siblings) : []).forEach(function (n) { pushOffspringLine(n, ''); });
        sibsOfAnchor('self', d.self).forEach(function (n) { pushOffspringLine(n, ''); });
        return heirs;
      }

      // --- Case: deceased is a child of focus ---
      const myKids = [];
      try {
        kidsOfAnchor('self', d.self).forEach(function (n) { myKids.push(n); });
        (typeof uftLines === 'function' ? uftLines(d.children) : []).forEach(function (n) { myKids.push(n); });
      } catch (e) {}
      if (myKids.some(function (n) { return faraidSameName(n, deceased); })) {
        const sg = faraidGenderOfName(d.self, 'self');
        push(d.self, sg === 'female' ? 'mother' : 'father', sg || 'male', 'self');
        push(d.spouse, sg === 'female' ? 'father' : 'mother', sg === 'female' ? 'male' : 'female', 'spouse');
        myKids.forEach(function (n) {
          if (faraidSameName(n, deceased)) return;
          if (!faraidIsAlive(n, '')) return;
          const g = faraidGenderOfName(n, 'child');
          push(n, g === 'female' ? 'sister' : 'brother', g);
        });
        spouseOfAnchor((typeof uftNameKey === 'function') ? uftNameKey(deceased) : deceased, deceased).forEach(function (n) {
          push(n, 'spouse');
        });
        kidsOfAnchor((typeof uftNameKey === 'function') ? uftNameKey(deceased) : deceased, deceased).forEach(function (n) {
          pushOffspringLine(n, '');
        });
        return heirs;
      }

      // --- Case: deceased is sibling of focus ---
      const mySibs = [];
      try {
        sibsOfAnchor('self', d.self).forEach(function (n) { mySibs.push(n); });
        (typeof uftLines === 'function' ? uftLines(d.siblings) : []).forEach(function (n) { mySibs.push(n); });
      } catch (e) {}
      if (mySibs.some(function (n) { return faraidSameName(n, deceased); })) {
        push(d.father, 'father', 'male', 'father');
        push(d.mother, 'mother', 'female', 'mother');
        if (faraidIsAlive(d.self, 'self')) {
          push(d.self, faraidGenderOfName(d.self, 'self') === 'female' ? 'sister' : 'brother', faraidGenderOfName(d.self, 'self'), 'self');
        }
        mySibs.forEach(function (n) {
          if (faraidSameName(n, deceased)) return;
          if (!faraidIsAlive(n, '')) return;
          const g = faraidGenderOfName(n, 'sibling');
          push(n, g === 'female' ? 'sister' : 'brother', g);
        });
        spouseOfAnchor((typeof uftNameKey === 'function') ? uftNameKey(deceased) : deceased, deceased).forEach(function (n) { push(n, 'spouse'); });
        kidsOfAnchor((typeof uftNameKey === 'function') ? uftNameKey(deceased) : deceased, deceased).forEach(function (n) {
          pushOffspringLine(n, '');
        });
        return heirs;
      }

      // --- Case: paternal / maternal grandparent ---
      if (faraidSameName(deceased, d.pgf) || faraidSameName(deceased, d.pgm)) {
        const other = faraidSameName(deceased, d.pgf) ? d.pgm : d.pgf;
        const slot = faraidSameName(deceased, d.pgf) ? 'pgf' : 'pgm';
        push(other, 'spouse', faraidSameName(deceased, d.pgf) ? 'female' : 'male', faraidSameName(deceased, d.pgf) ? 'pgm' : 'pgf');
        // Living children of this grandparent (e.g. Ayyaz if alive); if deceased, next gen
        pushOffspringLine(d.father, 'father');
        sibsOfAnchor(slot, deceased).forEach(function (n) { if (!faraidSameName(n, d.father)) pushOffspringLine(n, ''); });
        kidsOfAnchor(slot, deceased).forEach(function (n) { if (!faraidSameName(n, d.father)) pushOffspringLine(n, slot); });
        return heirs;
      }
      if (faraidSameName(deceased, d.mgf) || faraidSameName(deceased, d.mgm)) {
        const other = faraidSameName(deceased, d.mgf) ? d.mgm : d.mgf;
        const slot = faraidSameName(deceased, d.mgf) ? 'mgf' : 'mgm';
        push(other, 'spouse', faraidSameName(deceased, d.mgf) ? 'female' : 'male', faraidSameName(deceased, d.mgf) ? 'mgm' : 'mgf');
        pushOffspringLine(d.mother, 'mother');
        sibsOfAnchor(slot, deceased).forEach(function (n) { if (!faraidSameName(n, d.mother)) pushOffspringLine(n, ''); });
        kidsOfAnchor(slot, deceased).forEach(function (n) { if (!faraidSameName(n, d.mother)) pushOffspringLine(n, slot); });
        return heirs;
      }

      // --- Generic person (e.g. Karam Din on G2): spouse + full descendant tree ---
      const decKey = (typeof uftNameKey === 'function') ? uftNameKey(deceased) : deceased;
      faraidChildMap = null; // rebuild for this deceased walk
      spouseOfAnchor(decKey, deceased).forEach(function (n) { push(n, 'spouse'); });
      // Seed offspring walk from every discovered child of the deceased
      const seedKids = [];
      function seedAdd(x) {
        const t = String(x || '').trim();
        if (!t || faraidSameName(t, deceased)) return;
        if (seedKids.some(function (y) { return faraidSameName(y, t); })) return;
        seedKids.push(t);
      }
      kidsOfAnchor(decKey, deceased).forEach(seedAdd);
      faraidCollectKids(deceased, '').forEach(seedAdd);
      // Generation seeds
      (typeof uftLines === 'function' ? uftLines(d.g1) : []).forEach(function (g1n) {
        if (faraidSameName(g1n, deceased)) (typeof uftLines === 'function' ? uftLines(d.g2) : []).forEach(seedAdd);
      });
      (typeof uftLines === 'function' ? uftLines(d.g2) : []).forEach(function (g2n) {
        if (faraidSameName(g2n, deceased)) (typeof uftLines === 'function' ? uftLines(d.g3) : []).forEach(seedAdd);
      });
      (typeof uftLines === 'function' ? uftLines(d.g3) : []).forEach(function (g3n) {
        if (!faraidSameName(g3n, deceased)) return;
        ['pgf','pgm','mgf','mgm','father','mother','self'].forEach(function (slot) {
          if (d[slot]) seedAdd(d[slot]);
        });
      });
      seedKids.forEach(function (n) {
        let slot = '';
        try {
          if ((typeof uftLines === 'function' ? uftLines(d.g2) : []).some(function (x) { return faraidSameName(x, n); })) slot = 'g2';
          if ((typeof uftLines === 'function' ? uftLines(d.g3) : []).some(function (x) { return faraidSameName(x, n); })) slot = 'g3';
          if (faraidSameName(n, d.father)) slot = 'father';
          if (faraidSameName(n, d.mother)) slot = 'mother';
          if (faraidSameName(n, d.self)) slot = 'self';
        } catch (e) {}
        pushOffspringLine(n, slot, 1);
      });
            sibsOfAnchor(decKey, deceased).forEach(function (n) {
        if (!faraidIsAlive(n, '')) return;
        const g = faraidGenderOfName(n, 'sibling');
        push(n, g === 'female' ? 'sister' : 'brother', g);
      });
      // Living parents only
      (d.relatives || []).forEach(function (r) {
        if (!r || !r.name) return;
        if ((r.relation === 'child' || r.relation === 'offspring') && faraidSameName(r.name, deceased)) {
          const host = (typeof uftCoreName === 'function' ? uftCoreName(d, r.anchor) : '') || String(r.anchor || '').replace(/^n:/, '');
          if (host && faraidIsAlive(host, r.anchor)) {
            const hg = faraidGenderOfName(host, r.anchor);
            push(host, hg === 'female' ? 'mother' : 'father', hg, r.anchor);
          }
        }
      });
      // G1 parent of G2 deceased — ONLY if explicitly ● Alive on generation g1.
      // Deceased or unmarked G1 ancestors are omitted (e.g. Nadir Ali † at G1).
      // Younger namesake with the same name is never used as this parent.
      (typeof uftLines === 'function' ? uftLines(d.g2) : []).forEach(function (g2n) {
        if (!faraidSameName(g2n, deceased)) return;
        (typeof uftLines === 'function' ? uftLines(d.g1) : []).forEach(function (g1n) {
          const nn = (typeof uftNorm === 'function') ? uftNorm(g1n) : String(g1n).toLowerCase();
          const vit = (d.vital) || {};
          let g1Alive = false;
          let g1Dead = false;
          Object.keys(vit).forEach(function (key) {
            const bare = key.indexOf('|') >= 0 ? key.slice(key.lastIndexOf('|') + 1) : key.replace(/^n:/i, '');
            if (bare !== nn) return;
            const prefix = key.indexOf('|') >= 0 ? key.slice(0, key.lastIndexOf('|')).toLowerCase() : '';
            // Only generation-1 keys (and bare name tied to g1 line — treat bare deceased as dead)
            if (prefix && prefix !== 'g1') return;
            if (vit[key] === 'deceased') g1Dead = true;
            if (vit[key] === 'alive') g1Alive = true;
          });
          try {
            if (typeof uftVitalOf === 'function') {
              const st = uftVitalOf(g1n, 'g1');
              if (st === 'deceased') g1Dead = true;
              if (st === 'alive') g1Alive = true;
            }
          } catch (e) {}
          if (g1Dead || !g1Alive) return; // must be explicitly alive on g1
          const hg = faraidGenderOfName(g1n, 'g1');
          push(g1n, hg === 'female' ? 'mother' : 'father', hg, 'g1');
        });
      });
      // Final sanitize: drop deceased; fix depth labels already set; never keep dead G1 parents
      return heirs.filter(function (h) {
        if (!h || !h.name) return false;
        if (faraidIsDeceased(h.name, h.slot || '')) return false;
        if ((h.relation === 'father' || h.relation === 'mother') && (h.slot === 'g1' || !h.slot)) {
          const nn = (typeof uftNorm === 'function') ? uftNorm(h.name) : String(h.name).toLowerCase();
          const onG1 = (typeof uftLines === 'function' ? uftLines(d.g1) : []).some(function (x) {
            return (typeof uftNorm === 'function' ? uftNorm(x) : String(x).toLowerCase()) === nn;
          });
          if (onG1) {
            let aliveG1 = false, deadG1 = false;
            const vit = (d.vital) || {};
            Object.keys(vit).forEach(function (key) {
              const bare = key.indexOf('|') >= 0 ? key.slice(key.lastIndexOf('|') + 1) : key.replace(/^n:/i, '');
              if (bare !== nn) return;
              const prefix = key.indexOf('|') >= 0 ? key.slice(0, key.lastIndexOf('|')).toLowerCase() : '';
              if (prefix && prefix !== 'g1') return;
              if (vit[key] === 'alive') aliveG1 = true;
              if (vit[key] === 'deceased') deadG1 = true;
            });
            try {
              if (typeof uftVitalOf === 'function') {
                if (uftVitalOf(h.name, 'g1') === 'alive') aliveG1 = true;
                if (uftVitalOf(h.name, 'g1') === 'deceased') deadG1 = true;
              }
            } catch (e) {}
            if (deadG1 || !aliveG1) return false;
          }
        }
        return true;
      });
    }
    function faraidPullTree() {
      faraidFillDeceasedSelect();
      const deceased = (document.getElementById('faraid-deceased') || {}).value || '';
      if (!deceased) {
        alert('Select the deceased from the list first (or add names in the family tree).');
        return;
      }
      const uniq = faraidCloseHeirsOf(deceased);
      faraidRenderHeirForm(uniq);
      const box = document.getElementById('faraid-result');
      if (!uniq.length) {
        faraidRenderHeirForm([{ name: '', relation: 'son', gender: 'male' }]);
        if (box) {
          box.style.display = 'block';
          box.innerHTML = '<p>No close blood heirs / offspring auto-detected for <strong>' + String(deceased).replace(/</g, '') + '</strong>. Only spouse, parents, children, and siblings of the deceased are pulled — not uncles, cousins, or other extended family. Add rows manually if needed.</p>';
        }
      } else if (box) {
        box.style.display = 'block';
        box.innerHTML = '<p class="notes-hint">Loaded <strong>' + uniq.length + '</strong> <em>living</em> close heir(s) for ' + String(deceased).replace(/</g, '') + '. Deceased relatives are skipped; if a child is deceased, living next-generation offspring are included. Review genders, then Calculate.</p>';
      }
    }
    function faraidRenderHeirForm(heirs) {
      const box = document.getElementById('faraid-heirs');
      if (!box) return;
      if (!heirs || !heirs.length) heirs = [{ name: '', relation: 'son', gender: 'male', slot: '' }];
      box.innerHTML = '<div class="uft-col-label" style="margin-bottom:0.35rem;">Heirs (edit or remove, then recalculate)</div>' +
        heirs.map(function (h, i) {
          const slotNote = h.slot ? (' <span class="notes-hint">[' + String(h.slot) + ']</span>') : '';
          return '<div class="uft-reg-row" data-faraid-row="' + i + '">' +
            '<div style="display:grid;grid-template-columns:1.1fr 0.9fr 0.7fr auto;gap:0.35rem;width:100%;align-items:center;">' +
            '<input type="text" data-f="name" value="' + String(h.name || '').replace(/"/g, '&quot;') + '" placeholder="Name">' +
            '<select data-f="relation">' +
            ['spouse','father','mother','son','daughter','grandson','granddaughter','great-grandson','great-granddaughter',"son's widow",'brother','sister','other'].map(function (r) {
              return '<option value="' + r + '"' + (h.relation === r ? ' selected' : '') + '>' + r + '</option>';
            }).join('') +
            '</select>' +
            '<select data-f="gender"><option value="male"' + (h.gender === 'male' ? ' selected' : '') + '>Male</option>' +
            '<option value="female"' + (h.gender === 'female' ? ' selected' : '') + '>Female</option></select>' +
            '<button type="button" class="btn-secondary" title="Remove this heir" onclick="faraidRemoveHeirRow(' + i + ')">✕</button>' +
            '<input type="hidden" data-f="slot" value="' + String(h.slot || '').replace(/"/g, '&quot;') + '">' +
            '</div>' + (slotNote ? ('<div style="font-size:0.72rem;opacity:0.8;margin-top:0.15rem;">Generation/slot' + slotNote + '</div>') : '') +
            '</div>';
        }).join('') +
        '<div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.5rem;">' +
        '<button type="button" class="btn-secondary" onclick="faraidAddHeirRow()">＋ Add heir row</button>' +
        '<button type="button" onclick="faraidCalculate()">↺ Recalculate shares</button>' +
        '</div>';
    }
    function faraidAddHeirRow() {
      const rows = faraidReadHeirRows(true);
      rows.push({ name: '', relation: 'son', gender: 'male', slot: '' });
      faraidRenderHeirForm(rows);
    }
    function faraidRemoveHeirRow(index) {
      const rows = faraidReadHeirRows(true);
      if (index < 0 || index >= rows.length) return;
      rows.splice(index, 1);
      faraidRenderHeirForm(rows);
      const box = document.getElementById('faraid-result');
      if (box) {
        box.style.display = 'block';
        box.innerHTML = '<p class="notes-hint">Removed one heir. Press <strong>Recalculate shares</strong> (or Calculate) to update the result.</p>';
      }
    }
    function faraidReadHeirRows(includeEmpty) {
      const box = document.getElementById('faraid-heirs');
      if (!box) return [];
      const rows = [];
      box.querySelectorAll('[data-faraid-row]').forEach(function (row) {
        const name = (row.querySelector('[data-f="name"]') || {}).value || '';
        const relation = (row.querySelector('[data-f="relation"]') || {}).value || 'other';
        const gender = (row.querySelector('[data-f="gender"]') || {}).value || 'male';
        const slot = (row.querySelector('[data-f="slot"]') || {}).value || '';
        if (includeEmpty || String(name).trim()) {
          rows.push({ name: String(name).trim(), relation: relation, gender: gender, slot: slot });
        }
      });
      return rows;
    }
    function faraidResetHeirs() {
      faraidRenderHeirForm([]);
      const box = document.getElementById('faraid-result');
      if (box) { box.style.display = 'none'; box.innerHTML = ''; }
    }
    function faraidGcd(a, b) {
      a = Math.abs(a|0); b = Math.abs(b|0);
      while (b) { const t = b; b = a % b; a = t; }
      return a || 1;
    }
    function faraidFrac(n, d) {
      n = Math.round(n); d = Math.round(d) || 1;
      if (n === 0) return { n: 0, d: 1 };
      const g = faraidGcd(n, d);
      return { n: n / g, d: d / g };
    }
    function faraidAdd(a, b) {
      return faraidFrac(a.n * b.d + b.n * a.d, a.d * b.d);
    }
    function faraidMul(a, b) {
      return faraidFrac(a.n * b.n, a.d * b.d);
    }
    function faraidDiv(a, b) {
      return faraidFrac(a.n * b.d, a.d * b.n);
    }
    function faraidCmp(a, b) {
      return a.n * b.d - b.n * a.d;
    }
    function faraidToNum(f) { return f.d ? f.n / f.d : 0; }
    function faraidStr(f) {
      if (!f || !f.d) return '0';
      if (f.n === 0) return '0';
      if (f.d === 1) return String(f.n);
      return f.n + '/' + f.d;
    }
    function faraidWhy(relation, note) {
      const map = {
        spouse: 'Qurʾān 4:12 — husband 1/2 with no descendants, 1/4 with descendants; wife (or wives sharing) 1/4 with no descendants, 1/8 with descendants. Same in all four Sunni schools.',
        father: 'Qurʾān 4:11 — 1/6 as a Qurʾānic sharer with a descendant; residuary (ʿaṣaba) when there is no descendant; 1/6 + residue when only female descendants remain.',
        mother: 'Qurʾān 4:11 — 1/6 with a child or two-or-more siblings; otherwise 1/3. ʿUmariyyatān (mother takes 1/3 of remainder after spouse when only parents + spouse survive) is applied by the four schools.',
        son: 'Qurʾān 4:11 — sons are primary ʿaṣaba; with daughters the residue is split 2:1 (male = share of two females). A living son blocks brothers and more remote agnates (ḥajb).',
        daughter: 'Qurʾān 4:11 — one daughter 1/2; two or more daughters share 2/3 when no son; with a son they become ʿaṣaba bil-ghayr on the 2:1 ratio.',
        grandson: 'Son’s son inherits as ʿaṣaba when no living son remains (Hanafī order of nearness). Grandfather-with-siblings is a known school difference and is not fully modelled here.',
        granddaughter: 'Son’s daughter may take a Qurʾānic share (1/2 or 1/6 “completing” 2/3 with a higher daughter) in classical tables; this tool uses a simplified path — confirm the exact case.',
        brother: 'Qurʾān 4:176 (kalāla) and ʿaṣaba: full brothers take residue when no son/son’s son and no father. Paternal vs uterine brothers differ (uterine share 1/6 or 1/3 from 4:12).',
        sister: 'Qurʾān 4:176 — one full sister 1/2, two or more 2/3 in kalāla; with a full brother they share residue 2:1. Blocked by a son or father.',
        "son's widow": 'A son’s widow is not an heir of her father-in-law in standard farāʾiḍ (no nasab and no nikāḥ with the deceased).'
      };
      return map[relation] || note || 'Share derived from furūḍ / ʿaṣaba (educational Sunni model).';
    }
    function faraidNetEstate() {
      const gross = parseFloat((document.getElementById('faraid-estate') || {}).value || '0') || 0;
      const funeral = parseFloat((document.getElementById('faraid-funeral') || {}).value || '0') || 0;
      const debts = parseFloat((document.getElementById('faraid-debts') || {}).value || '0') || 0;
      let wasiyyah = parseFloat((document.getElementById('faraid-wasiyyah') || {}).value || '0') || 0;
      const afterDebts = Math.max(0, gross - funeral - debts);
      const maxWas = afterDebts / 3;
      let wasCapped = false;
      if (wasiyyah > maxWas + 1e-9) { wasiyyah = maxWas; wasCapped = true; }
      const net = Math.max(0, afterDebts - wasiyyah);
      const el = document.getElementById('faraid-net');
      if (el) el.value = net ? net.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '';
      return { gross: gross, funeral: funeral, debts: debts, wasiyyah: wasiyyah, wasCapped: wasCapped, afterDebts: afterDebts, net: net };
    }
    function faraidFiqhPanelHtml() {
      return '<div class="faraid-fiqh" id="faraid-fiqh-refs">' +
        '<h3 style="margin:0.7rem 0 0.35rem;font-size:1rem;">Fiqh references (educational)</h3>' +
        '<p class="notes-hint">Primary texts are the same across the four Sunni schools. Differences appear in <em>edge cases</em>. This calculator follows a simplified Hanafī-leaning Sunni path (ʿawl + radd to blood sharers, not the spouse).</p>' +
        '<ul class="sources-list">' +
        '<li><strong>Qurʾān</strong> — an-Nisāʾ 4:11 (children &amp; parents), 4:12 (spouses &amp; uterine siblings), 4:176 (kalāla sisters/brothers).</li>' +
        '<li><strong>Sunnah</strong> — “Give the fixed shares to those entitled, and what remains to the nearest male agnate” (Bukhārī 6732 · Muslim 1615).</li>' +
        '<li><strong>Settlement order</strong> — funeral, then debts, then wasiyyah (max one-third of the post-debt remainder unless heirs consent), then farāʾiḍ.</li>' +
        '<li><strong>ʿAwl</strong> — if fixed shares exceed the estate, every share is reduced in proportion (Companions’ practice; Zayd b. Thābit).</li>' +
        '<li><strong>Radd</strong> — if shares are under the estate and there is no ʿaṣaba, surplus returns to blood sharers. <em>Hanafī / Ḥanbalī:</em> radd to blood relatives, not the spouse. <em>Mālikī / classical Shāfiʿī:</em> surplus to bayt al-māl when it functions; later Shāfiʿī practice often follows radd when there is no treasury. Some modern Mālikī discussions allow radd including a spouse — treat as disputed.</li>' +
        '<li><strong>Grandfather + siblings</strong> — Hanafī: grandfather blocks siblings. Mālikī / Shāfiʿī: muqāsama (share, grandfather not less than 1/3 in many tables). Ḥanbalī: closer to Abū Bakr’s view (grandfather like father in several cases). <em>Not fully modelled here.</em></li>' +
        '<li><strong>Dhawū al-arḥām</strong> (uterine distant kin) — Hanafī and Ḥanbalī may pass the estate to them if no furūḍ/ʿaṣaba remain; classical Mālikī / Shāfiʿī prefer bayt al-māl. Not modelled here.</li>' +
        '<li><strong>Jaʿfarī / Imāmī</strong> — does not use Sunni ʿaṣaba in the same way; class-based nasab. Do not use this tool for that school.</li>' +
        '</ul>' +
        '<p class="notes-hint">Study tools: <a href="https://quran.com/4/11" target="_blank" rel="noopener">Quran 4:11</a> · ' +
        '<a href="https://quran.com/4/12" target="_blank" rel="noopener">4:12</a> · ' +
        '<a href="https://quran.com/4/176" target="_blank" rel="noopener">4:176</a> · ' +
        '<a href="https://sunnah.com/bukhari:6732" target="_blank" rel="noopener">Bukhārī 6732</a> · ' +
        '<a href="https://sunnah.com/muslim:1615" target="_blank" rel="noopener">Muslim 1615</a> · ' +
        '<a href="https://www.islamicity.org/covers/inheritance/" target="_blank" rel="noopener">IslamiCity inheritance overview</a> · ' +
        '<a href="https://islamicinheritance.com/schools_of_thought/" target="_blank" rel="noopener">School differences</a> · ' +
        '<a href="https://getmirath.com/" target="_blank" rel="noopener">Mirath</a> · ' +
        '<a href="https://qurani.io/inheritance-calculator/" target="_blank" rel="noopener">Qurani</a>. <strong>Not a fatwa.</strong></p>' +
        '</div>';
    }
    function faraidCalculate() {
      const deceasedGender = (document.getElementById('faraid-gender') || {}).value || 'male';
      const currency = ((document.getElementById('faraid-currency') || {}).value || '').trim();
      const pipe = faraidNetEstate();
      const estate = pipe.net;
      let heirs = faraidReadHeirRows();
      heirs = heirs.map(function (h) {
        if (h.relation === 'spouse') h.gender = deceasedGender === 'male' ? 'female' : 'male';
        if (['son','grandson','great-grandson','brother','father'].indexOf(h.relation) >= 0) h.gender = 'male';
        if (['daughter','granddaughter','great-granddaughter','sister','mother'].indexOf(h.relation) >= 0) h.gender = 'female';
        return h;
      });
      const sons = heirs.filter(function (h) { return h.relation === 'son'; });
      const daughters = heirs.filter(function (h) { return h.relation === 'daughter'; });
      const grandsons = heirs.filter(function (h) { return h.relation === 'grandson' || h.relation === 'great-grandson'; });
      const granddaughters = heirs.filter(function (h) { return h.relation === 'granddaughter' || h.relation === 'great-granddaughter'; });
      const hasChild = sons.length + daughters.length > 0;
      const hasDescendants = hasChild || grandsons.length + granddaughters.length > 0;
      const spouse = heirs.filter(function (h) { return h.relation === 'spouse'; });
      const father = heirs.filter(function (h) { return h.relation === 'father'; });
      const mother = heirs.filter(function (h) { return h.relation === 'mother'; });
      const brothers = heirs.filter(function (h) { return h.relation === 'brother'; });
      const sisters = heirs.filter(function (h) { return h.relation === 'sister'; });
      const sonWidows = heirs.filter(function (h) { return h.relation === "son's widow"; });
      const hasMultipleSiblings = (brothers.length + sisters.length) >= 2;

      const shares = [];
      function pushShare(person, fracObj, note) {
        shares.push({ name: person.name, relation: person.relation, f: fracObj, note: note || '', why: faraidWhy(person.relation, note) });
      }
      function F(n, d) { return faraidFrac(n, d); }

      spouse.forEach(function (s) {
        if (deceasedGender === 'male') {
          const f = hasDescendants ? F(1, 8) : F(1, 4);
          const each = faraidDiv(f, F(spouse.length, 1));
          pushShare(s, each, hasDescendants ? 'Wife 1/8 with descendants (4:12)' : 'Wife 1/4 without descendants (4:12)');
        } else {
          const f = hasDescendants ? F(1, 4) : F(1, 2);
          const each = faraidDiv(f, F(spouse.length, 1));
          pushShare(s, each, hasDescendants ? 'Husband 1/4 with descendants (4:12)' : 'Husband 1/2 without descendants (4:12)');
        }
      });
      sonWidows.forEach(function (w) {
        pushShare(w, F(0, 1), "Son’s widow is not an heir of the father-in-law (context only)");
      });
      mother.forEach(function (m) {
        if (hasDescendants || hasMultipleSiblings) pushShare(m, F(1, 6), 'Mother 1/6 (4:11)');
        else pushShare(m, F(1, 3), 'Mother 1/3 (4:11)');
      });
      father.forEach(function (f) {
        if (hasDescendants) pushShare(f, F(1, 6), 'Father 1/6 with descendants (4:11); may also take residue');
        else pushShare(f, F(0, 1), 'Father as residuary (no descendants)');
      });
      if (!sons.length && daughters.length) {
        const f = daughters.length === 1 ? F(1, 2) : F(2, 3);
        daughters.forEach(function (dau) {
          pushShare(dau, faraidDiv(f, F(daughters.length, 1)), daughters.length === 1 ? 'Only daughter 1/2 (4:11)' : 'Daughters share 2/3 (4:11)');
        });
      }
      if (!hasDescendants && !father.length && !sons.length && !brothers.length && sisters.length) {
        const f = sisters.length === 1 ? F(1, 2) : F(2, 3);
        sisters.forEach(function (s) {
          pushShare(s, faraidDiv(f, F(sisters.length, 1)), sisters.length === 1 ? 'Only sister kalāla 1/2 (4:176)' : 'Sisters share 2/3 kalāla (4:176)');
        });
      }

      let fixedSum = shares.reduce(function (a, s) { return faraidAdd(a, s.f); }, F(0, 1));
      let residue = faraidFrac(fixedSum.d - fixedSum.n, fixedSum.d);
      if (faraidCmp(residue, F(0, 1)) < 0) residue = F(0, 1);
      const asaba = [];

      if (sons.length) {
        const units = sons.length * 2 + daughters.length;
        sons.forEach(function (s) {
          asaba.push({ name: s.name, relation: 'son', f: faraidMul(residue, F(2, units)), note: 'Residuary 2:1 with daughters (4:11)', why: faraidWhy('son') });
        });
        daughters.forEach(function (dau) {
          asaba.push({ name: dau.name, relation: 'daughter', f: faraidMul(residue, F(1, units)), note: 'Residuary with sons 1:2 (4:11)', why: faraidWhy('daughter') });
        });
      } else if (grandsons.length || granddaughters.length) {
        const units = grandsons.length * 2 + granddaughters.length;
        if (units > 0 && faraidCmp(residue, F(0, 1)) > 0) {
          grandsons.forEach(function (s) {
            asaba.push({ name: s.name, relation: s.relation, f: faraidMul(residue, F(2, units)), note: 'Residuary grandson (simplified; no living son)', why: faraidWhy('grandson') });
          });
          granddaughters.forEach(function (dau) {
            asaba.push({ name: dau.name, relation: dau.relation, f: faraidMul(residue, F(1, units)), note: 'Residuary granddaughter (simplified)', why: faraidWhy('granddaughter') });
          });
        } else if (!grandsons.length && granddaughters.length) {
          const f = granddaughters.length === 1 ? F(1, 2) : F(2, 3);
          granddaughters.forEach(function (dau) {
            pushShare(dau, faraidDiv(f, F(granddaughters.length, 1)), 'Granddaughter educational fixed share (verify)');
          });
          fixedSum = shares.reduce(function (a, s) { return faraidAdd(a, s.f); }, F(0, 1));
          residue = faraidFrac(Math.max(0, fixedSum.d - fixedSum.n), fixedSum.d);
        }
      } else if (father.length && !hasDescendants) {
        father.forEach(function (f) {
          for (let i = shares.length - 1; i >= 0; i--) {
            if (shares[i].relation === 'father' && shares[i].name === f.name) shares.splice(i, 1);
          }
          asaba.push({ name: f.name, relation: 'father', f: residue, note: 'Father takes residue', why: faraidWhy('father') });
        });
      } else if (!hasDescendants && !father.length && brothers.length) {
        for (let i = shares.length - 1; i >= 0; i--) {
          if (shares[i].relation === 'sister') shares.splice(i, 1);
        }
        fixedSum = shares.reduce(function (a, s) { return faraidAdd(a, s.f); }, F(0, 1));
        residue = faraidFrac(Math.max(0, fixedSum.d - fixedSum.n), fixedSum.d);
        const units = brothers.length * 2 + sisters.length;
        brothers.forEach(function (b) {
          asaba.push({ name: b.name, relation: 'brother', f: faraidMul(residue, F(2, units)), note: 'Residuary brother', why: faraidWhy('brother') });
        });
        sisters.forEach(function (s) {
          asaba.push({ name: s.name, relation: 'sister', f: faraidMul(residue, F(1, units)), note: 'Residuary with brothers 1:2', why: faraidWhy('sister') });
        });
      }

      let all = shares.concat(asaba).filter(function (s) { return s.f && (s.f.n > 0 || s.relation === "son's widow"); });
      let total = all.reduce(function (a, s) { return faraidAdd(a, s.f); }, F(0, 1));
      let mode = 'normal';
      if (faraidCmp(total, F(1, 1)) > 0) {
        mode = 'awl';
        all = all.map(function (s) {
          return Object.assign({}, s, { f: faraidDiv(s.f, total), note: (s.note || '') + ' · ʿawl (proportional reduction)' });
        });
        total = F(1, 1);
      } else if (faraidCmp(total, F(1, 1)) < 0 && all.length) {
        const canRadd = !sons.length && !brothers.length && !(father.length && !hasDescendants) && !grandsons.length;
        if (canRadd) {
          mode = 'radd';
          const blood = all.filter(function (s) { return s.relation !== 'spouse' && s.relation !== "son's widow"; });
          const bloodSum = blood.reduce(function (a, s) { return faraidAdd(a, s.f); }, F(0, 1));
          const surplus = faraidFrac(total.d - total.n, total.d);
          if (faraidCmp(bloodSum, F(0, 1)) > 0 && faraidCmp(surplus, F(0, 1)) > 0) {
            all = all.map(function (s) {
              if (s.relation === 'spouse' || s.relation === "son's widow") return s;
              const extra = faraidMul(surplus, faraidDiv(s.f, bloodSum));
              return Object.assign({}, s, { f: faraidAdd(s.f, extra), note: (s.note || '') + ' · radd (return of surplus)' });
            });
            total = all.reduce(function (a, s) { return faraidAdd(a, s.f); }, F(0, 1));
          }
        }
      }

      const merged = {};
      all.forEach(function (s) {
        const k = s.relation + '|' + s.name;
        if (!merged[k]) merged[k] = Object.assign({}, s);
        else {
          merged[k].f = faraidAdd(merged[k].f, s.f);
          if (s.note && (merged[k].note || '').indexOf(s.note) === -1) merged[k].note = (merged[k].note || '') + '; ' + s.note;
        }
      });
      all = Object.keys(merged).map(function (k) { return merged[k]; });
      all.sort(function (a, b) { return faraidToNum(b.f) - faraidToNum(a.f); });

      const box = document.getElementById('faraid-result');
      if (!box) return;
      box.style.display = 'block';
      if (!all.length) {
        box.innerHTML = '<p>No shares computed. Add living heirs (spouse, parents, children, siblings).</p>';
        return;
      }
      const pct = function (f) { return (faraidToNum(f) * 100).toFixed(2) + '%'; };
      const amt = function (f) {
        if (!estate) return '';
        const v = estate * faraidToNum(f);
        return ' · ' + (currency ? currency + ' ' : '') + v.toLocaleString(undefined, { maximumFractionDigits: 2 });
      };
      let html = '<div id="faraid-print-area" class="faraid-result-body">';
      html += '<p><strong>Farāʾiḍ result</strong> (educational) · mode: <em>' + mode + '</em></p>';
      html += '<p class="notes-hint">Net estate after funeral, debts, wasiyyah: <strong>' +
        (currency ? currency + ' ' : '') + (estate ? estate.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—') + '</strong>';
      if (pipe.wasCapped) html += ' · wasiyyah capped at ⅓ of post-debt remainder';
      html += '</p><ul style="margin:0.35rem 0 0.5rem 1.1rem;">';
      all.forEach(function (s) {
        html += '<li><strong>' + String(s.name).replace(/</g, '') + '</strong> (' + s.relation + '): <strong>' +
          faraidStr(s.f) + '</strong> (' + pct(s.f) + ')' + amt(s.f) +
          (s.note ? '<br><span class="notes-hint">' + s.note + '</span>' : '') +
          '<div class="faraid-why"><strong>Why:</strong> ' + (s.why || faraidWhy(s.relation)) + '</div></li>';
      });
      html += '</ul>';
      const sumN = all.reduce(function (a, s) { return a + faraidToNum(s.f); }, 0);
      html += '<p class="notes-hint">Total allocated: ' + (sumN * 100).toFixed(2) + '%' +
        (estate ? amt(F(Math.round(sumN * 10000), 10000)) : '') +
        '.</p>' + faraidFiqhPanelHtml() + '</div>';
      html += '<p class="no-print"><button type="button" class="btn-secondary" onclick="faraidPrintResult()">🖨️ Print / save as PDF</button></p>';
      box.innerHTML = html;
      box.style.display = 'block';
      box.hidden = false;
      try { claritySession.setItem('clarity_faraid_last', html); } catch (e) {}
    }
    function faraidRestoreResult() {
      const box = document.getElementById('faraid-result');
      if (!box || (box.innerHTML && box.innerHTML.trim())) return;
      try {
        const html = claritySession.getItem('clarity_faraid_last');
        if (html) { box.innerHTML = html; box.style.display = 'block'; box.hidden = false; }
      } catch (e) {}
    }
    function faraidPrintResult() {
      const area = document.getElementById('faraid-print-area') || document.getElementById('faraid-result');
      if (!area) return;
      document.body.classList.add('printing');
      const sheet = document.createElement('div');
      sheet.className = 'print-sheet';
      sheet.innerHTML = area.innerHTML;
      document.body.appendChild(sheet);
      window.print();
      setTimeout(function () {
        document.body.classList.remove('printing');
        sheet.remove();
      }, 400);
    }

    document.addEventListener('DOMContentLoaded', function () {
      try { wasiLoad(); } catch (e0) {}
      try { wasiFillTreeSelects(); } catch (e00) {}
      try { faraidFillDeceasedSelect(); } catch (e) {}
      try { faraidRestoreResult(); } catch (e2) {}
    });
    setTimeout(function () { try { wasiLoad(); } catch (e0) {} try { faraidFillDeceasedSelect(); } catch (e) {} try { uftShowIntegrity(); } catch (e2) {} try { uftRefreshCardPicker(); } catch (e3) {} }, 600);

    /* ========== Clarity Amānah suite: IDs, quick edit, integrity, backup ========== */
    function uftNewPersonId() {
      return 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    }
    function uftEnsurePeople(d) {
      d = d || uftCollect();
      d.people = Array.isArray(d.people) ? d.people : [];
      const byKey = {};
      d.people.forEach(function (p) {
        if (p && p.name) byKey[(p.slot || '') + '|' + uftNorm(p.name)] = p;
      });
      function ensure(name, slot, role) {
        if (!name) return null;
        const k = (slot || '') + '|' + uftNorm(name);
        if (byKey[k]) return byKey[k];
        const row = { id: uftNewPersonId(), name: name, slot: slot || '', role: role || '', gender: uftGenderOf(name, slot) || '', vital: uftVitalOf(name, slot) || '' };
        d.people.push(row);
        byKey[k] = row;
        return row;
      }
      ['self','spouse','father','mother','pgf','pgm','mgf','mgm'].forEach(function (s) {
        if (d[s]) ensure(d[s], s, s);
      });
      ['g1','g2','g3','siblings','children','grandchildren'].forEach(function (field) {
        uftLines(d[field]).forEach(function (n) { ensure(n, field, field); });
      });
      (d.relatives || []).forEach(function (r) {
        if (r && r.name) ensure(r.name, r.anchor || '', r.relation || '');
      });
      return d;
    }
    function uftQuickAddRelative(hostName, hostSlot, relation) {
      try {
        hostName = String(hostName || '').trim();
        if (!hostName) {
          if (typeof uftSetStatus === 'function') uftSetStatus('No host member selected.');
          return;
        }
        relation = String(relation || 'child').toLowerCase();
        var open = (typeof uftOpenPersonPicker === 'function') ? uftOpenPersonPicker : window.uftOpenPersonPicker;
        if (typeof open === 'function') {
          open(hostName, hostSlot || '', relation);
          return;
        }
        var modal = document.getElementById('uft-pick-modal');
        if (modal) {
          try {
            window.uftPickCtx = { hostName: hostName, hostSlot: hostSlot || '', relation: relation };
            modal.hidden = false;
            modal.removeAttribute('hidden');
            modal.style.display = 'flex';
            if (typeof uftRenderPickList === 'function') uftRenderPickList('');
            else if (window.uftRenderPickList) window.uftRenderPickList('');
            return;
          } catch (eM) { console.warn('picker modal', eM); }
        }
        var label = relation === 'spouse' ? 'spouse' : (relation === 'sibling' ? 'sibling' : (relation === 'parent' ? 'parent' : 'child'));
        var nm = prompt('Name of ' + label + ' of ' + hostName + ':');
        if (nm === null) return;
        var name = String(nm || '').trim();
        if (!name) return;
        if (typeof uftApplyRelativeLink === 'function') uftApplyRelativeLink(hostName, hostSlot, relation, name);
      } catch (err) {
        console.error('uftQuickAddRelative', err);
        try { alert('Could not open member list: ' + (err && err.message ? err.message : err)); } catch (e2) {}
      }
    }
    try {
      window.uftQuickAddRelative = uftQuickAddRelative;
      if (typeof uftOpenPersonPicker === 'function') window.uftOpenPersonPicker = uftOpenPersonPicker;
      if (typeof uftClosePersonPicker === 'function') window.uftClosePersonPicker = uftClosePersonPicker;
      if (typeof uftRenderPickList === 'function') window.uftRenderPickList = uftRenderPickList;
      if (typeof uftApplyRelativeLink === 'function') window.uftApplyRelativeLink = uftApplyRelativeLink;
    } catch (eExp) {}
    function uftApplyRelativeLink(hostName, hostSlot, relation, name) {
      name = String(name || '').trim();
      hostName = String(hostName || '').trim();
      if (!name || !hostName) return;
      relation = relation || 'child';
      const d = (typeof uftEnsurePeople === 'function') ? uftEnsurePeople(uftCollect()) : uftCollect();
      d.relatives = Array.isArray(d.relatives) ? d.relatives : [];
      let anchor = (typeof uftNameKey === 'function' ? uftNameKey(hostName) : '');
      if (!anchor) anchor = hostSlot || hostName;
      if (relation === 'child' || relation === 'sibling' || relation === 'spouse') {
        anchor = (typeof uftNameKey === 'function' ? uftNameKey(hostName) : hostName) || anchor;
      }
      const exists = d.relatives.some(function (r) {
        return r && r.relation === relation && uftSame(r.name, name) && (
          String(r.anchor) === String(anchor) ||
          (typeof uftAnchorMatches === 'function' && uftAnchorMatches(d, r.anchor, anchor, hostName))
        );
      });
      if (!exists) d.relatives.push({ anchor: anchor, relation: relation, name: name });
      if (relation === 'child') {
        d.relatives = d.relatives.map(function (r) {
          if (!r || r.relation !== 'child') return r;
          const hostIs = (typeof uftAnchorMatches === 'function')
            ? (uftAnchorMatches(d, r.anchor, hostSlot, hostName) || uftAnchorMatches(d, r.anchor, anchor, hostName))
            : (String(r.anchor) === String(hostSlot) || String(r.anchor) === String(anchor));
          if (hostIs) return { anchor: anchor, relation: 'child', name: r.name };
          return r;
        });
        const seenC = {};
        d.relatives = d.relatives.filter(function (r) {
          if (!r || r.relation !== 'child') return true;
          if (!(typeof uftAnchorMatches === 'function' ? uftAnchorMatches(d, r.anchor, anchor, hostName) : String(r.anchor) === String(anchor))) return true;
          const k = (typeof uftNorm === 'function' ? uftNorm(r.name) : r.name);
          if (seenC[k]) return false;
          seenC[k] = true;
          return true;
        });
      }
      if (relation === 'child' && (hostSlot === 'self' || uftSame(hostName, d.self))) {
        const lines = uftLines(d.children);
        if (!lines.some(function (x) { return uftSame(x, name); })) {
          lines.push(name);
          d.children = lines.join('\n');
        }
      }
      if (relation === 'sibling' && (hostSlot === 'self' || uftSame(hostName, d.self))) {
        const lines = uftLines(d.siblings);
        if (!lines.some(function (x) { return uftSame(x, name); })) {
          lines.push(name);
          d.siblings = lines.join('\n');
        }
      }
      if (relation === 'spouse' && (hostSlot === 'self' || uftSame(hostName, d.self)) && !d.spouse) {
        d.spouse = name;
      }
      d.registry = Array.isArray(d.registry) ? d.registry : [];
      if (!d.registry.some(function (r) { return r && uftSame(r.name, name); })) {
        d.registry.push({
          id: (typeof uftNewPersonId === 'function') ? uftNewPersonId() : ('p' + Date.now()),
          name: name, role: relation, phone: '', email: '', city: '', note: ''
        });
      }
      try { clarityLS.setItem(UFT_KEY, JSON.stringify(d)); } catch (e) {}
      try {
        const f = uftFields();
        if (f.children && d.children != null) f.children.value = d.children;
        if (f.siblings && d.siblings != null) f.siblings.value = d.siblings;
        if (f.spouse && d.spouse != null) f.spouse.value = d.spouse;
      } catch (e) {}
      uftRender({ keepScroll: true });
      try { if (typeof uftRegRender === 'function') uftRegRender(); } catch (e) {}
      try { if (typeof uftRenderOwnTreePanel === 'function') uftRenderOwnTreePanel(); } catch (e) {}
      if (typeof uftSetStatus === 'function') uftSetStatus('Added ' + relation + ': ' + name + ' under ' + hostName);
    }

    // ----- Own tree (workspace below main pedigree) -----
    let uftOwnTree = null;
    try {
      const _ot = JSON.parse(clarityLS.getItem('clarity_uft_own_tree') || 'null');
      if (_ot && _ot.name) uftOwnTree = _ot;
    } catch (e) {}
    function uftStartOwnTree(name, slot) {
      if (!name) return;
      uftOwnTree = { name: String(name), slot: String(slot || '') };
      try { clarityLS.setItem('clarity_uft_own_tree', JSON.stringify(uftOwnTree)); } catch (e) {}
      uftRenderOwnTreePanel();
      const wrap = document.getElementById('uft-branch-wrap');
      if (wrap) {
        wrap.hidden = false;
        wrap.style.display = '';
        try { wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) {}
      }
      if (typeof uftSetStatus === 'function') uftSetStatus('Own Family Tree · ' + name);
    }
    function uftCloseOwnTree(ev) {
      if (ev && ev.preventDefault) { ev.preventDefault(); ev.stopPropagation(); }
      uftOwnTree = null;
      try { clarityLS.removeItem('clarity_uft_own_tree'); } catch (e) {}
      const wrap = document.getElementById('uft-branch-wrap');
      if (wrap) {
        wrap.hidden = true;
        wrap.style.display = 'none';
      }
      const body = document.getElementById('uft-branch-body');
      if (body) body.innerHTML = '';
      const lineEl = document.getElementById('uft-branch-line');
      if (lineEl) lineEl.textContent = '';
      const title = document.getElementById('uft-branch-title');
      if (title) title.textContent = 'Personal tree';
      if (typeof uftSetStatus === 'function') uftSetStatus('Own Family Tree closed');
      return false;
    }
    // Ensure always callable from inline onclick / mobile
    try { window.uftCloseOwnTree = uftCloseOwnTree; window.uftStartOwnTree = uftStartOwnTree; } catch (e) {}
    document.addEventListener('click', function (ev) {
      const t = ev.target;
      if (!t || !t.closest) return;
      if (t.closest('#uft-branch-close-btn') || t.closest('#uft-branch-x-btn') || t.closest('[data-uft-close-branch]')) {
        ev.preventDefault();
        ev.stopPropagation();
        uftCloseOwnTree(ev);
      }
    }, true);
    function uftRenderOwnTreePanel() {
      const wrap = document.getElementById('uft-branch-wrap');
      const body = document.getElementById('uft-branch-body');
      const title = document.getElementById('uft-branch-title');
      const lineEl = document.getElementById('uft-branch-line');
      if (!wrap || !body) return;
      if (!uftOwnTree || !uftOwnTree.name) {
        wrap.hidden = true;
        wrap.style.display = 'none';
        body.innerHTML = '';
        return;
      }
      wrap.hidden = false;
      wrap.style.display = '';
      const d = (typeof uftCollect === 'function') ? uftCollect() : {};
      const name = uftOwnTree.name;
      const slot = uftOwnTree.slot || '';
      if (title) title.textContent = 'Own Family Tree · ' + name;

      function norm(n) {
        return (typeof uftNorm === 'function') ? uftNorm(n) : String(n || '').toLowerCase().trim();
      }
      function kidsOf(n, sl) {
        let kids = [];
        try { kids = (typeof uftLineKids === 'function') ? (uftLineKids(d, n, sl) || []) : []; } catch (e) { kids = []; }
        if (!kids.length && typeof uftKidsOf === 'function') {
          try {
            kids = (uftKidsOf(d, sl || (typeof uftNameKey === 'function' ? uftNameKey(n) : n)) || [])
              .concat(uftKidsOf(d, typeof uftNameKey === 'function' ? uftNameKey(n) : n) || []);
          } catch (e2) {}
        }
        const seen = {};
        return (kids || []).filter(function (k) {
          if (!k || !k.name) return false;
          const key = norm(k.name);
          if (seen[key]) return false;
          seen[key] = true;
          return true;
        }).map(function (k) {
          return { name: k.name, slot: k.slot || (typeof uftNameKey === 'function' ? uftNameKey(k.name) : ''), relation: k.relation || 'Child' };
        });
      }
      function spousesOf(n, sl) {
        let sps = [];
        try {
          sps = (typeof uftSpouseOf === 'function') ? (uftSpouseOf(d, sl || (typeof uftNameKey === 'function' ? uftNameKey(n) : n)) || []) : [];
          if (!sps.length && typeof uftSpouseOf === 'function') {
            sps = uftSpouseOf(d, typeof uftNameKey === 'function' ? uftNameKey(n) : n) || [];
          }
        } catch (e) {}
        /* also relatives[] spouse */
        try {
          const key = (typeof uftNameKey === 'function') ? uftNameKey(n) : n;
          (d.relatives || []).forEach(function (r) {
            if (!r || !r.name || r.relation !== 'spouse') return;
            if (String(r.anchor) === String(sl) || String(r.anchor) === String(key) || (typeof uftSame === 'function' && uftSame(r.anchor, n))) {
              sps.push({ name: r.name });
            }
          });
        } catch (e2) {}
        const seen = {};
        return (sps || []).filter(function (s) {
          if (!s || !s.name) return false;
          if (typeof uftSame === 'function' && uftSame(s.name, n)) return false;
          const key = norm(s.name);
          if (seen[key]) return false;
          seen[key] = true;
          return true;
        });
      }
      function siblingsOf(n, sl) {
        const bag = [];
        const seen = {};
        function push(nm, rel) {
          if (!nm) return;
          if (typeof uftSame === 'function' && uftSame(nm, n)) return;
          const key = norm(nm);
          if (seen[key]) return;
          seen[key] = true;
          bag.push({ name: nm, slot: (typeof uftNameKey === 'function' ? uftNameKey(nm) : nm), relation: rel || 'Sibling' });
        }
        try {
          if (typeof uftSiblingsOf === 'function') {
            (uftSiblingsOf(d, sl || (typeof uftNameKey === 'function' ? uftNameKey(n) : n)) || []).forEach(function (s) {
              if (s && s.name) push(s.name, s.relation || 'Sibling');
            });
            (uftSiblingsOf(d, typeof uftNameKey === 'function' ? uftNameKey(n) : n) || []).forEach(function (s) {
              if (s && s.name) push(s.name, s.relation || 'Sibling');
            });
          }
        } catch (e) {}
        try {
          const key = (typeof uftNameKey === 'function') ? uftNameKey(n) : n;
          (d.relatives || []).forEach(function (r) {
            if (!r || !r.name || r.relation !== 'sibling') return;
            if (String(r.anchor) === String(sl) || String(r.anchor) === String(key) ||
                (typeof uftSame === 'function' && (uftSame(String(r.anchor), n) || uftSame(String(r.anchor), key)))) {
              push(r.name, 'Sibling');
            }
            /* reciprocal: if someone listed us as sibling, show them */
            if (typeof uftSame === 'function' && uftSame(r.name, n) && r.relation === 'sibling') {
              /* anchor is the other sibling's host — handled when host is root */
            }
          });
          /* if we are listed as sibling under another person, still show them when viewing our tree */
          (d.relatives || []).forEach(function (r) {
            if (!r || r.relation !== 'sibling' || !r.name) return;
            if (typeof uftSame === 'function' && uftSame(r.name, n)) {
              var hostName = (typeof uftCoreName === 'function') ? (uftCoreName(d, r.anchor) || '') : '';
              if (!hostName && r.anchor && String(r.anchor).indexOf('n:') === 0) hostName = String(r.anchor).replace(/^n:/, '');
              if (hostName) push(hostName, 'Sibling');
            }
          });
        } catch (e2) {}
        return bag;
      }

      /* Generation rows: gen0 = root + spouses; siblings band; then descendant gens */
      const gens = [];
      const placed = {};
      gens.push([{ name: name, slot: slot, relation: 'Branch root', isRoot: true }]);
      placed[norm(name)] = 0;

      const rootSibs = siblingsOf(name, slot);
      for (let g = 0; g < 8; g++) {
        const cur = gens[g] || [];
        const next = [];
        const nextSeen = {};
        cur.forEach(function (person) {
          kidsOf(person.name, person.slot).forEach(function (k) {
            const key = norm(k.name);
            if (placed[key] != null || nextSeen[key]) return;
            nextSeen[key] = true;
            placed[key] = g + 1;
            next.push(k);
          });
        });
        if (!next.length) break;
        gens.push(next);
      }

      const lineParts = [];
      lineParts.push(name);
      if (rootSibs.length) lineParts.push('siblings: ' + rootSibs.map(function (s) { return s.name; }).join(', '));
      gens.slice(1).forEach(function (row) {
        lineParts.push(row.map(function (p) { return p.name; }).join(', '));
      });
      if (lineEl) {
        lineEl.textContent = lineParts.length > 1
          ? ('Line: ' + lineParts.join(' → '))
          : (name + ' · add children or siblings with + Relative');
      }

      function cardHtml(person, depth) {
        const isRoot = !!person.isRoot || depth === 0;
        const htmlPerson = (typeof uftPerson === 'function')
          ? uftPerson(person.name, person.relation || (isRoot ? 'Branch root' : 'Child'), '', isRoot ? 'focus' : 'rel', person.slot)
          : ('<div class="uft-person">' + (typeof uftEsc === 'function' ? uftEsc(person.name) : person.name) + '</div>');
        let sps = '';
        spousesOf(person.name, person.slot).forEach(function (sp) {
          sps += (typeof uftPerson === 'function')
            ? uftPerson(sp.name, 'Spouse', '', 'rel', (typeof uftNameKey === 'function') ? uftNameKey(sp.name) : '')
            : '';
        });
        return '<div class="uft-own-unit">' + htmlPerson + sps + '</div>';
      }

      let html = '<div class="uft-own-gens">';
      /* Root generation */
      html += '<div class="uft-own-gen" data-gen="0">';
      html += '<div class="uft-living-root-label">Branch root</div>';
      html += '<div class="uft-own-gen-row">';
      html += cardHtml({ name: name, slot: slot, relation: 'Branch root', isRoot: true }, 0);
      html += '</div></div>';

      /* Siblings of root — same generational level, no need for parents first */
      if (rootSibs.length) {
        html += '<div class="uft-own-gen-link" aria-hidden="true"></div>';
        html += '<div class="uft-own-gen" data-gen="sib">';
        html += '<div class="uft-own-gen-label">Siblings of ' + (typeof uftEsc === 'function' ? uftEsc(name) : name) + '</div>';
        html += '<div class="uft-own-gen-row">';
        rootSibs.forEach(function (s) {
          html += cardHtml({ name: s.name, slot: s.slot, relation: 'Sibling' }, 0);
        });
        html += '</div></div>';
      }

      gens.slice(1).forEach(function (row, i) {
        const depth = i + 1;
        html += '<div class="uft-own-gen-link" aria-hidden="true"></div>';
        html += '<div class="uft-own-gen" data-gen="' + depth + '">';
        html += '<div class="uft-own-gen-label">Generation ' + (depth + 1) + ' · descendants</div>';
        html += '<div class="uft-own-gen-row">';
        row.forEach(function (p) { html += cardHtml(p, depth); });
        html += '</div></div>';
      });
      html += '</div>';
      body.innerHTML = html;

      if (!body.dataset.ownBound) {
        body.dataset.ownBound = '1';
        body.addEventListener('click', function (ev) {
          const del = ev.target && ev.target.closest && ev.target.closest('[data-del-name]');
          if (del) {
            ev.preventDefault();
            ev.stopPropagation();
            const dn = del.getAttribute('data-del-name') || '';
            if (uftOwnTree && uftOwnTree.name && (typeof uftSame === 'function' ? uftSame(dn, uftOwnTree.name) : dn === uftOwnTree.name)) {
              uftCloseOwnTree(ev);
              return;
            }
            if (typeof uftDeletePerson === 'function') uftDeletePerson(dn, del.getAttribute('data-del-slot') || '', del.getAttribute('data-del-anchor') || '');
            return;
          }
          const own = ev.target && ev.target.closest && ev.target.closest('[data-own-name]');
          if (own) {
            ev.preventDefault();
            uftStartOwnTree(own.getAttribute('data-own-name'), own.getAttribute('data-own-slot') || '');
            return;
          }
          const foc = ev.target && ev.target.closest && ev.target.closest('[data-focus-name]');
          if (foc && typeof uftOpenMemberView === 'function') {
            ev.preventDefault();
            uftOpenMemberView(foc.getAttribute('data-focus-name'), foc.getAttribute('data-focus-slot') || '');
          }
        });
      }
    }

function uftIntegrityReport(includeDismissed) {
      const d = uftCollect();
      const issues = [];
      const names = [];
      function addName(n, slot) {
        if (!n) return;
        names.push({ name: n, slot: slot || '' });
      }
      ['self','spouse','father','mother','pgf','pgm','mgf','mgm'].forEach(function (s) { addName(d[s], s); });
      ['g1','g2','g3','siblings','children','grandchildren'].forEach(function (field) {
        uftLines(d[field]).forEach(function (n) { addName(n, field); });
      });
      (d.relatives || []).forEach(function (r) { if (r && r.name) addName(r.name, r.anchor || ''); });
      const seen = {};
      names.forEach(function (p) {
        const k = uftNorm(p.name) + '|' + (p.slot || '');
        if (seen[k]) return;
        seen[k] = true;
        if (!uftGenderOf(p.name, p.slot)) {
          issues.push({
            type: 'gender',
            name: p.name,
            slot: p.slot || '',
            message: 'Missing gender · ' + p.name + (p.slot ? ' (' + p.slot + ')' : ''),
            action: 'Open card → set ♂/♀'
          });
        }
        if (!uftVitalOf(p.name, p.slot)) {
          issues.push({
            type: 'vital',
            name: p.name,
            slot: p.slot || '',
            message: 'Missing alive/deceased · ' + p.name + (p.slot ? ' (' + p.slot + ')' : ''),
            action: 'Open card → set Alive or Deceased'
          });
        }
      });
      // Only people ON the pedigree tree are audited (registry-only rows are ignored).
      const reg = d.registry || [];
      const regNorms = {};
      const regByNorm = {};
      reg.forEach(function (r) {
        if (!r || !r.name) return;
        const nn = uftNorm(r.name);
        regNorms[nn] = true;
        regByNorm[nn] = r;
      });
      const treeSeen = {};
      names.forEach(function (p) {
        const n = uftNorm(p.name);
        if (!n || treeSeen[n]) return;
        treeSeen[n] = true;
        // Contact gap only if this tree person exists in registry without contact fields
        const row = regByNorm[n];
        if (row && !row.phone && !row.email && !row.city) {
          issues.push({
            type: 'contact',
            name: p.name,
            slot: p.slot || row.role || '',
            regId: row.id || '',
            message: 'On tree · registry missing phone/email/city · ' + p.name,
            action: 'Open registry → add contact for this tree member'
          });
        }
        if (!regNorms[n]) {
          issues.push({
            type: 'registry_missing',
            name: p.name,
            slot: p.slot || '',
            message: 'On tree but not in registry · ' + p.name,
            action: 'Open tree card · or registry → Pull names from tree'
          });
        }
      });
      // duplicate names across gens (informational — still clickable to first card)
      const byNorm = {};
      names.forEach(function (p) {
        const n = uftNorm(p.name);
        byNorm[n] = byNorm[n] || [];
        byNorm[n].push(p);
      });
      Object.keys(byNorm).forEach(function (n) {
        const slots = [];
        const seenS = {};
        byNorm[n].forEach(function (p) {
          const s = p.slot || '';
          if (seenS[s]) return;
          seenS[s] = true;
          slots.push(s || '(no slot)');
        });
        if (slots.length > 1) {
          const first = byNorm[n][0];
          issues.push({
            type: 'duplicate_name',
            name: first.name,
            slot: first.slot || '',
            message: 'Same name in slots: ' + slots.join(', ') + ' · “' + first.name + '” (OK if different people)',
            action: 'Review cards — confirm same or different people'
          });
        }
      });
      if (!includeDismissed) {
        const dismissed = uftReadDismissedAudits();
        if (dismissed && dismissed.length) {
          return issues.filter(function (issue) {
            return dismissed.indexOf(uftAuditDismissKey(issue)) < 0;
          });
        }
      }
      return issues;
    }
    function uftIntegrityRefresh() {
      const box = document.getElementById('uft-integrity');
      if (box) uftShowIntegrity();
    }
    function uftFlashTreeCard(name, slot) {
      if (!name) return null;
      // Prefer main pedigree, then whole stage, then open own-tree body
      const roots = [];
      const preview = document.getElementById('uft-preview');
      const branch = document.getElementById('uft-branch-body');
      const stage = document.getElementById('uft-stage');
      if (preview) roots.push(preview);
      if (branch) roots.push(branch);
      if (stage) roots.push(stage);
      let hit = null;
      let nameOnly = null;
      function scan(root) {
        if (!root || hit) return;
        root.querySelectorAll('.uft-person').forEach(function (el) {
          if (hit) return;
          const btn = el.querySelector('[data-vital-name], [data-gender-name], [data-focus-name], [data-own-name], [data-del-name]');
          const n = btn
            ? (btn.getAttribute('data-vital-name') || btn.getAttribute('data-gender-name') || btn.getAttribute('data-focus-name') || btn.getAttribute('data-own-name') || btn.getAttribute('data-del-name') || '')
            : '';
          const s = btn
            ? (btn.getAttribute('data-vital-slot') || btn.getAttribute('data-gender-slot') || btn.getAttribute('data-focus-slot') || btn.getAttribute('data-own-slot') || btn.getAttribute('data-del-slot') || '')
            : '';
          const pn = el.querySelector('.pn');
          const label = pn ? pn.textContent.replace(/†/g, '').trim() : '';
          const nameOk = n
            ? ((typeof uftSame === 'function') ? uftSame(n, name) : (String(n).toLowerCase() === String(name).toLowerCase()))
            : (label && ((typeof uftSame === 'function') ? uftSame(label, name) : label.toLowerCase() === String(name).toLowerCase()));
          if (!nameOk) return;
          if (slot && s && s === slot) { hit = el; return; }
          if (!nameOnly) nameOnly = el;
        });
      }
      roots.forEach(scan);
      if (!hit) hit = nameOnly;
      if (hit) {
        hit.classList.add('uft-audit-flash');
        try { hit.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
        setTimeout(function () { try { hit.classList.remove('uft-audit-flash'); } catch (e) {} }, 2800);
      }
      return hit;
    }
    function uftGotoIntegrityIssue(idx) {
      const issues = uftIntegrityReport();
      const issue = issues[idx];
      if (!issue) return;
      const name = issue.name || '';
      const slot = issue.slot || '';
      if (issue.type === 'contact') {
        // Open registry and focus the row / form
        const box = document.getElementById('uft-registry-box');
        if (box) box.open = true;
        if (typeof uftExpandEditor === 'function') uftExpandEditor();
        const d = (typeof uftRead === 'function') ? uftRead() : {};
        const reg = d.registry || [];
        let row = null;
        if (issue.regId) row = reg.find(function (r) { return r && r.id === issue.regId; });
        if (!row && name) {
          row = reg.find(function (r) {
            return r && ((typeof uftSame === 'function') ? uftSame(r.name, name) : r.name === name);
          });
        }
        if (row && typeof uftRegFill === 'function') {
          uftRegFill(row.id);
        } else if (name) {
          const nameEl = document.getElementById('uft-reg-name');
          const roleEl = document.getElementById('uft-reg-role');
          if (nameEl) nameEl.value = name;
          if (roleEl && slot) roleEl.value = slot;
        }
        if (typeof uftRegRender === 'function') uftRegRender();
        setTimeout(function () {
          const list = document.getElementById('uft-reg-list');
          if (list) {
            list.querySelectorAll('.uft-reg-row').forEach(function (rowEl) {
              const strong = rowEl.querySelector('strong');
              if (strong && name && ((typeof uftSame === 'function') ? uftSame(strong.textContent, name) : strong.textContent === name)) {
                rowEl.classList.add('uft-audit-flash');
                rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(function () { rowEl.classList.remove('uft-audit-flash'); }, 2800);
              }
            });
          }
          const focusField = document.getElementById('uft-reg-phone') || document.getElementById('uft-reg-name');
          if (focusField) focusField.focus();
        }, 80);
        if (typeof uftSetStatus === 'function') uftSetStatus('Audit → registry · ' + name);
        return;
      }
      // gender / vital / duplicate / on-tree issues → member card on main pedigree first
      const stage = document.getElementById('uft-stage');
      if (stage) try { stage.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {}
      let card = uftFlashTreeCard(name, slot);
      if (!card) {
        // Search again after a short wait (layout may still be painting)
        setTimeout(function () {
          card = uftFlashTreeCard(name, slot);
          if (!card && typeof uftStartOwnTree === 'function') {
            // Last resort: open personal branch so the card is visible
            uftStartOwnTree(name, slot);
            setTimeout(function () { uftFlashTreeCard(name, slot); }, 120);
          }
        }, 120);
      }
      if (typeof uftSetStatus === 'function') {
        uftSetStatus('Audit → ' + (issue.type === 'gender' ? 'set gender' : issue.type === 'vital' ? 'set vital status' : 'review') + ' · ' + name + ' (tap Close branch if the lower panel opened)');
      }
    }

    var UFT_AUDIT_DISMISS_KEY = 'clarity_uft_audit_dismissed';
    function uftAuditDismissKey(issue) {
      if (!issue) return '';
      return [issue.type || '', (typeof uftNorm === 'function' ? uftNorm(issue.name) : String(issue.name || '').toLowerCase()), issue.slot || '', issue.regId || ''].join('|');
    }
    function uftReadDismissedAudits() {
      try {
        const raw = JSON.parse(clarityLS.getItem(UFT_AUDIT_DISMISS_KEY) || '[]');
        return Array.isArray(raw) ? raw : [];
      } catch (e) { return []; }
    }
    function uftWriteDismissedAudits(list) {
      try { clarityLS.setItem(UFT_AUDIT_DISMISS_KEY, JSON.stringify(list || [])); } catch (e) {}
    }
    function uftDismissAuditIssue(idx, ev) {
      if (ev && ev.preventDefault) { ev.preventDefault(); ev.stopPropagation(); }
      const issues = uftIntegrityReport(true); // unfiltered list for stable idx from UI
      // Prefer key from button
      let key = '';
      if (ev && ev.target && ev.target.closest) {
        const b = ev.target.closest('[data-audit-key]');
        if (b) key = b.getAttribute('data-audit-key') || '';
      }
      if (!key) {
        const all = uftIntegrityReport(true);
        const issue = all[idx];
        key = uftAuditDismissKey(issue);
      }
      if (!key) return;
      const list = uftReadDismissedAudits();
      if (list.indexOf(key) < 0) list.push(key);
      uftWriteDismissedAudits(list);
      uftShowIntegrity();
      if (typeof uftSetStatus === 'function') uftSetStatus('Audit item ignored');
      return false;
    }
    function uftClearDismissedAudits() {
      uftWriteDismissedAudits([]);
      uftShowIntegrity();
      if (typeof uftSetStatus === 'function') uftSetStatus('Ignored audit items restored');
    }
    function uftDismissAllAuditIssues() {
      const issues = uftIntegrityReport(true);
      if (!issues.length) {
        uftShowIntegrity();
        return;
      }
      if (!confirm('Ignore all ' + issues.length + ' audit item(s)?\n\nThey will hide until you tap “Show ignored” or “Restore ignored”.')) return;
      const list = uftReadDismissedAudits();
      issues.forEach(function (issue) {
        const key = uftAuditDismissKey(issue);
        if (key && list.indexOf(key) < 0) list.push(key);
      });
      uftWriteDismissedAudits(list);
      uftShowIntegrity();
      if (typeof uftSetStatus === 'function') uftSetStatus('All audit items ignored');
    }
    try { window.uftDismissAllAuditIssues = uftDismissAllAuditIssues; } catch (e) {}
    try { window.uftDismissAuditIssue = uftDismissAuditIssue; window.uftClearDismissedAudits = uftClearDismissedAudits; } catch (e) {}

    function uftShowIntegrity() {
      const issues = uftIntegrityReport();
      let box = document.getElementById('uft-integrity');
      if (!box) {
        const stage = document.getElementById('uft-stage') || document.getElementById('uft-editor');
        if (!stage) return;
        box = document.createElement('div');
        box.id = 'uft-integrity';
        box.className = 'clarity-integrity';
        stage.parentNode.insertBefore(box, stage);
      }
      if (!issues.length) {
        box.innerHTML = '<strong>Family data health:</strong> Looking good — genders, vital status, and registry contacts are set where needed.';
        return;
      }
      const dismissedCount = uftReadDismissedAudits().length;
      box.innerHTML = '<strong>Family data health:</strong> ' + issues.length + ' item(s) — tap a line to open the card. Use × to ignore. Fixed items disappear automatically.' +
        (dismissedCount ? (' <button type="button" class="btn-soft" style="display:inline;padding:0.15rem 0.5rem;margin-left:0.35rem;font-size:0.75rem;" onclick="uftClearDismissedAudits()">Show ' + dismissedCount + ' ignored</button>') : '') +
        '<div class="uft-audit-list">' +
        issues.map(function (issue, i) {
          const key = uftAuditDismissKey(issue);
          return '<div class="uft-audit-line" data-audit-idx="' + i + '" data-audit-key="' + uftEsc(key) + '" role="button" tabindex="0">' +
            uftEsc(issue.message) +
            '<span class="uft-audit-action">' + uftEsc(issue.action || 'Fix on card') + ' →</span>' +
            '<button type="button" class="uft-audit-dismiss" data-audit-dismiss="' + i + '" data-audit-key="' + uftEsc(key) + '" title="Ignore this item">×</button>' +
            '</div>';
        }).join('') +
        '</div>' +
        '<div style="margin-top:0.55rem;display:flex;flex-wrap:wrap;gap:0.4rem;align-items:center;">' +
        '<button type="button" class="btn-soft" id="uft-audit-dismiss-all" style="font-size:0.78rem;padding:0.3rem 0.7rem;">Ignore all audit items</button>' +
        (dismissedCount ? '<button type="button" class="btn-secondary" style="font-size:0.78rem;padding:0.3rem 0.7rem;" onclick="uftClearDismissedAudits()">Restore ignored</button>' : '') +
        '</div>';
      if (!box.dataset.auditBound) {
        box.dataset.auditBound = '1';
        box.addEventListener('click', function (ev) {
          const allBtn = ev.target && ev.target.closest ? ev.target.closest('#uft-audit-dismiss-all') : null;
          if (allBtn) {
            ev.preventDefault();
            ev.stopPropagation();
            if (typeof uftDismissAllAuditIssues === 'function') uftDismissAllAuditIssues();
            return;
          }
          const dis = ev.target && ev.target.closest ? ev.target.closest('[data-audit-dismiss]') : null;
          if (dis) {
            ev.preventDefault();
            ev.stopPropagation();
            const idx = parseInt(dis.getAttribute('data-audit-dismiss'), 10);
            uftDismissAuditIssue(idx, ev);
            return;
          }
          const btn = ev.target && ev.target.closest ? ev.target.closest('[data-audit-idx]') : null;
          if (!btn) return;
          // Don't navigate when clicking the × (handled above)
          if (ev.target && ev.target.closest && ev.target.closest('.uft-audit-dismiss')) return;
          ev.preventDefault();
          const idx = parseInt(btn.getAttribute('data-audit-idx'), 10);
          if (!isNaN(idx)) uftGotoIntegrityIssue(idx);
        });
      }
    }
    function clarityExportPack() {
      const pack = {
        app: 'Clarity',
        version: 2,
        exportedAt: new Date().toISOString(),
        disclaimer: 'Private family data from this device only. Educational farāʾiḍ is not a fatwa.',
        familyTree: null,
        notes: null,
        meta: {}
      };
      try { pack.familyTree = JSON.parse(clarityLS.getItem(UFT_KEY) || '{}'); } catch (e) { pack.familyTree = {}; }
      try {
        const nk = (typeof NOTES_KEY !== 'undefined') ? NOTES_KEY : 'clarity_notes_v1';
        pack.notes = JSON.parse(clarityLS.getItem(nk) || 'null');
      } catch (e) {}
      try {
        pack.meta.streak = clarityLS.getItem('clarity_streak');
        pack.meta.name = clarityLS.getItem('clarity_name');
        pack.meta.theme = clarityLS.getItem('clarity_theme');
      } catch (e) {}
      const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'clarity-amanah-pack-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
    }
    function clarityImportPack(ev) {
      const file = ev && ev.target && ev.target.files && ev.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function () {
        try {
          const pack = JSON.parse(String(reader.result || '{}'));
          if (pack.familyTree && typeof uftApplyData === 'function') uftApplyData(pack.familyTree);
          if (pack.notes && Array.isArray(pack.notes)) {
            try {
              const nk = (typeof NOTES_KEY !== 'undefined') ? NOTES_KEY : 'clarity_notes_v1';
              clarityLS.setItem(nk, JSON.stringify(pack.notes));
            } catch (e) {}
          }
          alert('Amānah pack restored on this device (family tree' + (pack.notes ? ' + notes' : '') + ').');
          if (typeof uftShowIntegrity === 'function') uftShowIntegrity();
        } catch (e) {
          alert('Could not read that pack. Use a Clarity Amānah JSON export.');
        }
        ev.target.value = '';
      };
      reader.readAsText(file);
    }
    function uftPrintFamilySheet() {
      const d = uftCollect();
      const lines = [];
      lines.push('<h2>Family group sheet — Clarity</h2>');
      lines.push('<p class="notes-hint">Private summary from this device · ' + new Date().toLocaleString() + '</p>');
      function row(label, val) {
        if (!val) return;
        lines.push('<p><strong>' + label + ':</strong> ' + String(val).replace(/</g, '') + '</p>');
      }
      row('You', d.self);
      row('Spouse', d.spouse);
      row('Father', d.father);
      row('Mother', d.mother);
      row('Children', uftLines(d.children).join(', '));
      row('Siblings', uftLines(d.siblings).join(', '));
      row('G3', uftLines(d.g3).join(', '));
      row('G2', uftLines(d.g2).join(', '));
      row('G1', uftLines(d.g1).join(', '));
      const reg = d.registry || [];
      if (reg.length) {
        lines.push('<h3>Contacts</h3><ul>');
        reg.forEach(function (r) {
          if (!r || !r.name) return;
          lines.push('<li><strong>' + r.name + '</strong>' +
            (r.role ? ' (' + r.role + ')' : '') +
            (r.phone ? ' · ' + r.phone : '') +
            (r.email ? ' · ' + r.email : '') +
            (r.city ? ' · ' + r.city : '') + '</li>');
        });
        lines.push('</ul>');
      }
      lines.push('<p class="notes-hint">For planning only. Farāʾiḍ calculations are educational and not a fatwa.</p>');
      document.body.classList.add('printing');
      const sheet = document.createElement('div');
      sheet.className = 'print-sheet';
      sheet.innerHTML = lines.join('\n');
      document.body.appendChild(sheet);
      window.print();
      setTimeout(function () { document.body.classList.remove('printing'); sheet.remove(); }, 400);
    }

    // Delegate card quick-actions
    document.addEventListener('click', function (ev) {
      const t = ev.target;
      if (!t || !t.closest) return;
      const child = t.closest('.uft-add-child-btn');
      if (child) {
        ev.preventDefault();
        uftQuickAddRelative(child.getAttribute('data-add-name'), child.getAttribute('data-add-slot'), 'child');
        return;
      }
      const sp = t.closest('.uft-add-spouse-btn');
      if (sp) {
        ev.preventDefault();
        uftQuickAddRelative(sp.getAttribute('data-add-name'), sp.getAttribute('data-add-slot'), 'spouse');
        return;
      }
      const sib = t.closest('.uft-add-sib-btn');
      if (sib) {
        ev.preventDefault();
        uftQuickAddRelative(sib.getAttribute('data-add-name'), sib.getAttribute('data-add-slot'), 'sibling');
        return;
      }
      const relSel = t.closest('.uft-add-rel-select');
      if (relSel && t === relSel) {
        /* change handled separately */
      }
    });
    /* Compact relative dropdown on member cards */

    (function uftChipActionsBoot(){
      if (window.__uftChipActionsBound) return;
      window.__uftChipActionsBound = true;
      document.addEventListener('click', function (ev) {
        try {
          var t = ev.target;
          if (!t || !t.closest) return;
          /* only inside family tree card */
          if (!t.closest('#user-family-tree-card, #uft-stage, #uft-preview, #uft-branch-wrap')) return;
          var btn = t.closest('[data-vital-name], [data-gender-name], [data-born-name], [data-focus-name], [data-own-name], [data-del-name]');
          if (!btn) return;
          /* let + Relative menu handle add-rel separately */
          if (btn.classList && btn.classList.contains('uft-add-rel-btn')) return;
          ev.preventDefault();
          ev.stopPropagation();
          if (btn.hasAttribute('data-del-name')) {
            if (typeof uftDeletePerson === 'function') uftDeletePerson(btn.getAttribute('data-del-name'), btn.getAttribute('data-del-slot') || '', btn.getAttribute('data-del-anchor') || '');
            return;
          }
          if (btn.hasAttribute('data-born-name')) {
            if (typeof uftAskBorn === 'function') uftAskBorn(btn.getAttribute('data-born-name'), btn.getAttribute('data-born-slot') || '');
            return;
          }
          if (btn.hasAttribute('data-own-name')) {
            if (typeof window.uftStartOwnTree === 'function') window.uftStartOwnTree(btn.getAttribute('data-own-name'), btn.getAttribute('data-own-slot') || '');
            else if (typeof uftStartOwnTree === 'function') uftStartOwnTree(btn.getAttribute('data-own-name'), btn.getAttribute('data-own-slot') || '');
            return;
          }
          if (btn.hasAttribute('data-focus-name')) {
            if (typeof uftOpenMemberView === 'function') uftOpenMemberView(btn.getAttribute('data-focus-name'), btn.getAttribute('data-focus-slot') || '');
            return;
          }
          if (btn.hasAttribute('data-gender-name')) {
            if (typeof uftCycleGender === 'function') uftCycleGender(btn.getAttribute('data-gender-name'), btn.getAttribute('data-gender-slot') || '');
            return;
          }
          if (btn.hasAttribute('data-vital-name')) {
            if (typeof uftCycleVital === 'function') uftCycleVital(btn.getAttribute('data-vital-name'), btn.getAttribute('data-vital-slot') || '');
          }
        } catch (err) { console.error('uft chip', err); }
      }, true);
    })();

(function memeMushafGuardBoot(){
  if(window.__memeMushafGuard) return;
  window.__memeMushafGuard = true;
  function scan(){
    try{
      if(typeof memeGuardMushafText==='function' && !memeGuardMushafText()){
        /* strip joke lines only */
        if(memeState){
          ['top','mid','bottom'].forEach(function(k){
            if(typeof memeLooksLikeJokeOverlay==='function' && memeLooksLikeJokeOverlay(memeState[k])){
              memeState[k] = '';
            }
          });
          if(typeof memeDraw==='function') memeDraw();
        }
      }
    }catch(e){}
  }
  ['meme-top','meme-mid','meme-bot','meme-bottom'].forEach(function(id){
    var el=document.getElementById(id);
    if(el){ el.addEventListener('change', scan); el.addEventListener('blur', scan); }
  });
  document.addEventListener('change', function(ev){
    if(ev.target && ev.target.id && /^meme-/.test(ev.target.id)) scan();
  }, true);
})();

(function uftRelMenuBoot(){
      function scrollXY(){
        var sy = 0, sx = 0, iw = 360;
        try { sy = (window.pageYOffset != null ? window.pageYOffset : (document.documentElement && document.documentElement.scrollTop) || 0); } catch (e1) { sy = 0; }
        try { sx = (window.pageXOffset != null ? window.pageXOffset : (document.documentElement && document.documentElement.scrollLeft) || 0); } catch (e2) { sx = 0; }
        try { iw = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || 360; } catch (e3) { iw = 360; }
        return { sy: sy, sx: sx, iw: iw };
      }
      function ensureMenu(){
        var m = document.getElementById('uft-rel-menu');
        if (m) return m;
        m = document.createElement('div');
        m.id = 'uft-rel-menu';
        m.className = 'uft-rel-menu';
        m.setAttribute('hidden', '');
        m.innerHTML =
          '<div class="uft-rel-menu-title">Add relative</div>' +
          '<button type="button" data-rel="child">+ Child</button>' +
          '<button type="button" data-rel="spouse">+ Spouse</button>' +
          '<button type="button" data-rel="sibling">+ Sibling</button>' +
          '<button type="button" data-rel="parent">+ Parent</button>';
        document.body.appendChild(m);
        m.addEventListener('click', function(ev){
          try {
            var btn = ev.target && ev.target.closest && ev.target.closest('[data-rel]');
            if (!btn) return;
            ev.preventDefault();
            ev.stopPropagation();
            var rel = btn.getAttribute('data-rel') || 'child';
            var host = m.getAttribute('data-host') || '';
            var slot = m.getAttribute('data-slot') || '';
            m.setAttribute('hidden', '');
            m.style.display = 'none';
            var fn = window.uftQuickAddRelative;
            if (typeof fn === 'function') { fn(host, slot, rel); return; }
            var open = window.uftOpenPersonPicker;
            if (typeof open === 'function') { open(host, slot, rel); return; }
            try { alert('Member list is still loading — try again in a moment.'); } catch (eA) {}
          } catch (err) {
            console.error('rel menu', err);
            try { alert('Add relative error: ' + (err && err.message ? err.message : String(err))); } catch (e2) {}
          }
        });
        return m;
      }
      document.addEventListener('click', function(ev){
        try {
          var t = ev.target;
          if (!t || !t.closest) return;
          var openBtn = t.closest('.uft-add-rel-btn');
          if (openBtn) {
            ev.preventDefault();
            ev.stopPropagation();
            var menu = ensureMenu();
            menu.setAttribute('data-host', openBtn.getAttribute('data-add-name') || '');
            menu.setAttribute('data-slot', openBtn.getAttribute('data-add-slot') || '');
            var r = openBtn.getBoundingClientRect();
            var sc = scrollXY();
            var top = r.bottom + 6 + sc.sy;
            var left = Math.min(r.left + sc.sx, sc.sx + sc.iw - 220);
            menu.style.position = 'absolute';
            menu.style.top = top + 'px';
            menu.style.left = Math.max(8 + sc.sx, left) + 'px';
            menu.style.zIndex = '100000';
            menu.removeAttribute('hidden');
            menu.hidden = false;
            menu.style.display = 'flex';
            return;
          }
          var menu = document.getElementById('uft-rel-menu');
          if (menu && !menu.hidden && !t.closest('#uft-rel-menu')) {
            menu.setAttribute('hidden', '');
            menu.hidden = true;
            menu.style.display = 'none';
          }
        } catch (err) {
          console.error('rel menu open', err);
        }
      }, true);
    })();
/* Export skipped: classic script function decls are already global on window */
window.UFT_KEY = (typeof UFT_KEY !== "undefined") ? UFT_KEY : "clarity_user_family_tree_v1";
window.uftView = (typeof uftView !== "undefined") ? uftView : "pedigree";
(function(){
  function boot(){
    try {
      if (typeof uftLoad === "function") uftLoad();
      else if (typeof uftRender === "function") uftRender();
    } catch(e){ console.warn("uft boot", e); }
    try {
      var stage = document.getElementById("uft-stage");
      if (stage) {
        stage.style.setProperty("display","block","important");
        stage.style.setProperty("min-height","min(48vh, 26rem)","important");
      }
      var preview = document.getElementById("uft-preview");
      if (preview) preview.style.setProperty("display","block","important");
    } catch(e){}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 400); });
  else setTimeout(boot, 400);
  window.addEventListener("load", function(){ setTimeout(boot, 900); });
  try {
    var tab = document.getElementById("tab-notes");
    if (tab && typeof MutationObserver === "function") {
      new MutationObserver(function(){
        if (tab.classList.contains("amana-unlocked")) setTimeout(boot, 250);
      }).observe(tab, { attributes: true, attributeFilter: ["class"] });
    }
  } catch(e){}
})();
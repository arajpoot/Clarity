(function(){
"use strict";
if (window.__CLARITY_NOTES_RECOVERY_V1__) return;
window.__CLARITY_NOTES_RECOVERY_V1__ = true;

/* Ensure storage helper */
if (typeof window.clarityLS === "undefined" || !window.clarityLS) {
  window.clarityLS = {
    getItem: function(k){ try { return localStorage.getItem(k); } catch(e){ return null; } },
    setItem: function(k,v){ try { localStorage.setItem(k,v); } catch(e){} },
    removeItem: function(k){ try { localStorage.removeItem(k); } catch(e){} }
  };
}
if (typeof escapeHtmlNotes !== "function") {
  window.escapeHtmlNotes = function(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];
    });
  };
}

var NOTES_KEY = "clarity-notes-v1";
var NOTES_VIEW_KEY = "clarity-notes-view";
var notesState = { notes: [], selectedId: null, query: "", tagFilter: "", viewMode: "edit", saveTimer: null };
window.notesState = notesState;

function notesNewId(){return'n-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);};
window.notesNewId = notesNewId;
function notesDisplayTitle(n){const t=(n.title||'').trim();if(t)return t;const first=(n.body||'').split('\n').map(l=>l.replace(/^#+\s*/,'').trim()).find(Boolean);return first||'Untitled';};
window.notesDisplayTitle = notesDisplayTitle;
function notesEmpty(partial){const now=Date.now();return Object.assign({id:notesNewId(),title:'',body:'',tag:'',grave:false,createdAt:now,updatedAt:now},partial||{});};
window.notesEmpty = notesEmpty;
function notesSort(list){return list.slice().sort((a,b)=>b.updatedAt-a.updatedAt);};
window.notesSort = notesSort;
function notesMatch(n,q){const needle=(q||'').trim().toLowerCase();if(!needle)return true;return(n.title||'').toLowerCase().includes(needle)||(n.body||'').toLowerCase().includes(needle)||(n.tag||'').toLowerCase().includes(needle);};
window.notesMatch = notesMatch;
function notesPersist(){try{clarityLS.setItem(NOTES_KEY,JSON.stringify({notes:notesState.notes,selectedId:notesState.selectedId}));}catch(e){}const el=document.getElementById('notes-save-status');if(el)el.textContent='Saved on this device · '+new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});const btn=document.getElementById('notes-save-now');if(btn){btn.textContent='Saved';btn.classList.add('saved');setTimeout(function(){if(btn){btn.textContent='Save note';btn.classList.remove('saved');}},1400);}const n=notesState.notes.find(x=>x.id===notesState.selectedId);const cc=document.getElementById('notes-char-count');if(cc)cc.textContent=n?((n.body||'').length+' chars'):'';};
window.notesPersist = notesPersist;
function notesSeedLibrary(){const t=(iso)=>Date.parse(iso);return[{id:'seed-welcome',title:'Welcome to Clarity Notes',tag:'Guide',grave:false,createdAt:t('2026-08-01T08:00:00Z'),updatedAt:t('2026-08-30T09:00:00Z'),body:`A quiet place to write, remember, and send light ahead.

This library is seeded from **Clarity — Furnish Your Grave**. Everything lives on this device. Nothing is uploaded.

## Writing
- Title appears in the sidebar.
- Body is **Markdown** — use Preview or Split.
- Notes save as you type.

## Keys
| Key | Action |
| --- | --- |
| Ctrl/⌘ N | New note |
| / | Focus search |
| Ctrl/⌘ E | Cycle edit / split / preview |
| Esc | Clear search |

> Furnish your grave. Prepare for the long stay.`},{id:'seed-grave',title:'Furnishing the Grave',tag:'Grave',grave:true,createdAt:t('2026-08-02T08:00:00Z'),updatedAt:t('2026-08-29T18:20:00Z'),body:`The grave is a long stay. Every istighfar and salawat can be sent ahead as light.

**Today’s intention:** I am sending these deeds to my grave as companions and light.

## A daily practice
1. Begin with *Astaghfirullah*.
2. Send *salawat* upon the Prophet ﷺ (Muslim 408).
3. Ask once: *If I die tonight, what have I sent ahead?* Then do one small good deed.

The Prophet ﷺ said: “Remember often the destroyer of pleasures (death).” Remembrance keeps the heart soft and the deeds purposeful.`},{id:'seed-deceased',title:'What Benefits the Deceased',tag:'Grave',grave:true,createdAt:t('2026-08-02T09:00:00Z'),updatedAt:t('2026-08-28T16:10:00Z'),body:`Educational notes from mainstream Sunni scholarship — for a particular case, consult a local scholar.

## Practical summary
- **Duʿāʾ & istighfār** — the most agreed-upon gift
- **Ṣadaqah** (including ongoing charity)
- **Qurʾān** with the intention that its reward reaches them
- **Hajj / ʿUmrah** on their behalf when conditions are met
- Righteous children who pray for them

Imām al-Ghazālī, Ibn Taymiyyah, Ibn al-Qayyim, and al-Nawawī all affirmed that the living can benefit the dead through these doors by Allah’s permission.`},{id:'seed-commands',title:'Allah’s Commands to the Believers',tag:'Quran',grave:false,createdAt:t('2026-08-03T08:00:00Z'),updatedAt:t('2026-08-27T12:00:00Z'),body:`Use the **Commands** tab to surface a verse of instruction, then write one concrete action here.

Example reflection template:

> Verse: …
> My action today: …
> Status: working on it / done

Small, sincere obedience is what travels with you when company is left behind.`},{id:'seed-zikr',title:'Daily Zikr and Their Virtues',tag:'Practice',grave:false,createdAt:t('2026-08-03T09:00:00Z'),updatedAt:t('2026-08-26T10:00:00Z'),body:`Track a simple daily set:

- Subḥānallāhi wa biḥamdihi (100×) — forgiveness like the foam of the sea (Muslim)
- Tasbīḥ Fāṭimī after each ṣalāh
- Salawāt upon the Prophet ﷺ
- Astaghfirullāh throughout the day

Write counts or intentions below so the habit stays visible.`},{id:'seed-seerah',title:'Seerah Moments',tag:'Seerah',grave:false,createdAt:t('2026-08-04T08:00:00Z'),updatedAt:t('2026-08-25T14:00:00Z'),body:`After reading a seerah card, capture the lesson in one sentence and one action.

Examples from the library:
- Mercy with children → shorten what burdens others
- Forgiving Makkah → power paired with mercy
- Serving his family → greatness includes humility at home

**My note:**`},{id:'seed-hifz',title:'Hifz — Light for the Grave',tag:'Practice',grave:true,createdAt:t('2026-08-05T08:00:00Z'),updatedAt:t('2026-08-24T09:00:00Z'),body:`Memorisation is light that can accompany the believer.

Daily goal idea: a few ayahs with meaning, not speed alone.

- Surah / ayah range:
- Reviewed today:
- Weak spots to return to:

Ask Allah for firmness and sincerity.`},{id:'seed-character',title:'Character and Life Guidance',tag:'Guidance',grave:false,createdAt:t('2026-08-06T08:00:00Z'),updatedAt:t('2026-08-23T11:00:00Z'),body:`Pick one trait this week: patience, honesty, gentleness, or restraint of anger.

**Situation I faced:**
**What the Sunnah called for:**
**What I will try next time:**`}];};
window.notesSeedLibrary = notesSeedLibrary;
function notesLoad(){let loaded=null;try{const raw=clarityLS.getItem(NOTES_KEY);if(raw)loaded=JSON.parse(raw);}catch(e){}if(loaded&&Array.isArray(loaded.notes)&&loaded.notes.length){notesState.notes=loaded.notes.map(n=>({id:String(n.id||notesNewId()),title:String(n.title||''),body:String(n.body||''),tag:String(n.tag||''),grave:!!n.grave,createdAt:n.createdAt||Date.now(),updatedAt:n.updatedAt||Date.now()}));notesState.selectedId=loaded.selectedId&&notesState.notes.some(n=>n.id===loaded.selectedId)?loaded.selectedId:(notesState.notes[0]&&notesState.notes[0].id)||null;}else{notesState.notes=notesSeedLibrary();notesState.selectedId=notesState.notes[0].id;notesPersist();}try{const v=clarityLS.getItem(NOTES_VIEW_KEY);if(v==='edit'||v==='split'||v==='preview')notesState.viewMode=v;}catch(e){}notesRender();};
window.notesLoad = notesLoad;
window.__notesLoadReal = notesLoad;
function notesFiltered(){return notesSort(notesState.notes.filter(n=>{if(notesState.tagFilter&&(n.tag||'')!==notesState.tagFilter)return false;return notesMatch(n,notesState.query);}));};
window.notesFiltered = notesFiltered;
function notesRenderList(){const box=document.getElementById('notes-list');if(!box)return;const list=notesFiltered();if(!list.length){box.innerHTML='<p style="padding:0.75rem;font-size:0.85rem;color:var(--text-muted)">No notes match.</p>';return;}box.innerHTML=list.map(n=>{const active=n.id===notesState.selectedId?' active':'';const tag=n.tag?`<span class="ni-tag">${escapeHtmlNotes(n.tag)}</span>`:'<span></span>';const grave=n.grave?' 🌙':'';const when=new Date(n.updatedAt).toLocaleDateString(undefined,{month:'short',day:'numeric'});return`<div class="note-item${active}" role="option" aria-selected="${!!active}" onclick="notesSelect('${n.id}')">
          <div class="ni-title">${escapeHtmlNotes(notesDisplayTitle(n))}${grave}</div>
          <div class="ni-meta">${tag}<span>${when}</span></div>
        </div>`;}).join('');};
window.notesRenderList = notesRenderList;
function notesRenderTags(){const el=document.getElementById('notes-tag-filter');if(!el)return;const tags=Array.from(new Set(notesState.notes.map(n=>n.tag).filter(Boolean))).sort();const all=['',...tags];el.innerHTML=all.map(t=>{const label=t||'All';const active=notesState.tagFilter===t?' active':'';return`<button type="button" class="notes-tag-chip${active}" onclick="notesSetTagFilter('${escapeHtmlNotes(t).replace(/'/g, '')}')">${escapeHtmlNotes(label)}</button>`;
      }).join('');
    };
window.notesRenderTags = notesRenderTags;
function notesRenderEditor() {
      const empty = document.getElementById('notes-editor-empty');
      const active = document.getElementById('notes-editor-active');
      const pane = document.getElementById('notes-editor-pane');
      const n = notesState.notes.find(x => x.id === notesState.selectedId);
      if (!n) {
        if (pane) { pane.classList.add('empty-mode'); pane.classList.remove('has-note'); }
        if (empty) empty.style.display = 'flex';
        if (active) active.style.display = 'none';
        return;
      }
      if (pane) { pane.classList.add('has-note'); pane.classList.remove('empty-mode'); }
      if (empty) empty.style.display = 'none';
      if (active) active.style.display = 'flex';
      const title = document.getElementById('notes-title');
      const body = document.getElementById('notes-body');
      const tagSel = document.getElementById('notes-tag-select');
      if (title && document.activeElement !== title) title.value = n.title || '';
      if (body && document.activeElement !== body) body.value = n.body || '';
      if (tagSel) tagSel.value = n.tag || '';
      const gBtn = document.getElementById('notes-grave-btn');
      if (gBtn) gBtn.textContent = n.grave ? '🌙 Marked for grave' : '🌙 Grave';
      const gStat = document.getElementById('notes-grave-status');
      if (gStat) gStat.innerHTML = n.grave ? '<span class="notes-grave-badge">🌙 Light for the grave</span>' : '';
      notesApplyView();
      notesRenderPreview();
    };
window.notesRenderEditor = notesRenderEditor;
function notesRenderPreview(){const prev=document.getElementById('notes-preview');const body=document.getElementById('notes-body');if(!prev)return;const text=body?body.value:((notesState.notes.find(n=>n.id===notesState.selectedId)||{}).body||'');prev.innerHTML=notesSimpleMarkdown(text);};
window.notesRenderPreview = notesRenderPreview;
function notesRender() {
      notesRenderTags();
      notesRenderList();
      notesRenderEditor();
    };
window.notesRender = notesRender;
function notesSelect(id) {
      notesState.selectedId = id;
      notesPersist();
      notesRender();
      // mobile: show editor
      const listPane = document.getElementById('notes-list-pane');
      const edPane = document.getElementById('notes-editor-pane');
      if (window.innerWidth <= 700 && listPane && edPane) {
        listPane.classList.add('collapsed-mobile');
        edPane.classList.remove('hidden-mobile');
      }
    };
window.notesSelect = notesSelect;
function notesSetQuery(q) {
      notesState.query = q;
      notesRenderList();
    };
window.notesSetQuery = notesSetQuery;
function notesSetTagFilter(t) {
      notesState.tagFilter = t;
      notesRender();
    };
window.notesSetTagFilter = notesSetTagFilter;
function notesCreate(prefill) {
      const note = notesEmpty(prefill || {});
      notesState.notes = [note, ...notesState.notes];
      notesState.selectedId = note.id;
      notesState.query = '';
      notesState.tagFilter = '';
      notesState.viewMode = 'edit';
      notesPersist();
      notesRender();
      setTimeout(() => {
        const t = document.getElementById('notes-title');
        if (t) t.focus();
      }, 50);
      return note.id;
    };
window.notesCreate = notesCreate;
function notesRequestDelete() {
      const id = notesState.selectedId;
      if (!id) return;
      const n = notesState.notes.find(x => x.id === id);
      if (!n) return;
      if (!confirm('Delete note “' + notesDisplayTitle(n) + '”? This cannot be undone.')) return;
      notesState.notes = notesState.notes.filter(x => x.id !== id);
      notesState.selectedId = notesState.notes[0] ? notesState.notes[0].id : null;
      notesPersist();
      notesRender();
    };
window.notesRequestDelete = notesRequestDelete;
function notesToggleGrave() {
      const id = notesState.selectedId;
      if (!id) return;
      notesState.notes = notesState.notes.map(n => n.id === id ? Object.assign({}, n, { grave: !n.grave, updatedAt: Date.now() }) : n);
      notesPersist();
      notesRender();
    };
window.notesToggleGrave = notesToggleGrave;
function notesUpdateField(field, value) {
      const id = notesState.selectedId;
      if (!id) return;
      notesState.notes = notesState.notes.map(n => {
        if (n.id !== id) return n;
        const next = Object.assign({}, n, { updatedAt: Date.now() });
        next[field] = value;
        return next;
      });
      const st=document.getElementById('notes-save-status');
      if(st) st.textContent='Unsaved changes…';
      const btn=document.getElementById('notes-save-now');
      if(btn){btn.textContent='Save note';btn.classList.remove('saved');}
      if (notesState.saveTimer) clearTimeout(notesState.saveTimer);
      notesState.saveTimer = setTimeout(() => {
        notesPersist();
        notesRenderList();
        notesRenderTags();
        if (field === 'body') notesRenderPreview();
      }, 280);
      if (field === 'body') notesRenderPreview();
      if (field === 'tag') notesRenderList();
    };
window.notesUpdateField = notesUpdateField;
function notesSaveNow(){
      if(notesState.saveTimer){clearTimeout(notesState.saveTimer);notesState.saveTimer=null;}
      notesPersist();
      notesRenderList();
      notesRenderTags();
      notesRenderPreview();
    };
window.notesSaveNow = notesSaveNow;
function notesSetView(mode) {
      notesState.viewMode = mode;
      try { clarityLS.setItem(NOTES_VIEW_KEY, mode); } catch (e) {}
      notesApplyView();
    };
window.notesSetView = notesSetView;
function notesApplyView() {
      const area = document.getElementById('notes-body-area');
      if (!area) return;
      area.classList.remove('split', 'edit-only', 'preview-only');
      if (notesState.viewMode === 'split') area.classList.add('split');
      else if (notesState.viewMode === 'preview') area.classList.add('preview-only');
      else area.classList.add('edit-only');
      ['edit','split','preview'].forEach(m => {
        const b = document.getElementById('nv-' + m);
        if (b) b.classList.toggle('active', notesState.viewMode === m);
      });
      if (notesState.viewMode !== 'edit') notesRenderPreview();
    };
window.notesApplyView = notesApplyView;
function notesCycleView() {
      const order = ['edit', 'split', 'preview'];
      const i = order.indexOf(notesState.viewMode);
      notesSetView(order[(i + 1) % order.length]);
    };
window.notesCycleView = notesCycleView;
function notesExport(){try{const raw=clarityLS.getItem(NOTES_KEY)||'{"notes":[]}';const blob=new Blob([raw],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='clarity-notes-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(a.href);}catch(e){alert('Could not export notes.');}};
window.notesExport = notesExport;
function notesImport(ev){const file=ev.target&&ev.target.files&&ev.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=function(e){try{const data=JSON.parse(e.target.result);/* Full NurOS package? */if(data&&data.data&&(data.os==='NurOS'||data.version)){if(window.NurOS&&typeof NurOS.importPackage==='function'){ev.target.files=ev.target.files;/* re-dispatch via vault */}if(confirm('This looks like a full NurOS Amana package. Open Vault import instead?')){if(window.NurOS)NurOS.openVault();alert('Use Amana Vault → Import package and select this file again.');}ev.target.value='';return;}if(!data||!Array.isArray(data.notes))throw new Error('Invalid file');if(!confirm('Replace current notes with imported library ('+data.notes.length+' notes)?'))return;clarityLS.setItem(NOTES_KEY,JSON.stringify(data));notesLoad();alert('Notes imported.');}catch(err){alert('Invalid notes file.');}};reader.readAsText(file);ev.target.value='';};
window.notesImport = notesImport;
function notesRestoreSeed() {
      if (!confirm('Restore the starter library? Your current notes will be replaced.')) return;
      notesState.notes = notesSeedLibrary();
      notesState.selectedId = notesState.notes[0].id;
      notesPersist();
      notesRender();
    };
window.notesRestoreSeed = notesRestoreSeed;
function notesSimpleMarkdown(src) {
      let s = escapeHtmlNotes(src || '');
      // code blocks
      s = s.replace(/```([\s\S]*?)```/g, (_, code) => '<pre><code>' + code.trim() + '</code></pre>');
      // tables (simple)
      s = s.replace(/(?:^|\n)((?:\|.+\|(?:\n|$))+)/g, (block) => {
        const rows = block.trim().split('\n').filter(Boolean);
        if (rows.length < 2) return block;
        const parseRow = r => r.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
        const head = parseRow(rows[0]);
        const bodyRows = rows.slice(1).filter(r => !/^\|?\s*:?-+:?\s*\|/.test(r));
        let html = '<table><thead><tr>' + head.map(h => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>';
        bodyRows.forEach(r => {
          html += '<tr>' + parseRow(r).map(c => '<td>' + c + '</td>').join('') + '</tr>';
        });
        return html + '</tbody></table>';
      });
      s = s.replace(/^### (.+)$/gm, '<h3>$1</h3>');
      s = s.replace(/^## (.+)$/gm, '<h2>$1</h2>');
      s = s.replace(/^# (.+)$/gm, '<h1>$1</h1>');
      s = s.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
      s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/\*(.+?)\*/g, '<em>$1</em>');
      s = s.replace(/`([^`]+)`/g,'<code>$1</code>');s=s.replace(/^\- (.+)$/gm,'<li>$1</li>');s=s.replace(/(?:<li>.*<\/li>\n?)+/g,m=>'<ul>'+m+'</ul>');s=s.replace(/^\d+\. (.+)$/gm,'<li>$1</li>');s=s.split(/\n{2,}/).map(p=>{if(/^<(h[123]|ul|ol|table|blockquote|pre)/.test(p.trim()))return p;return'<p>'+p.replace(/\n/g,'<br>')+'</p>';}).join('\n');return s;};
window.notesSimpleMarkdown = notesSimpleMarkdown;
function notesQuickFromSection(tag,title,grave){notesCreate({title:title||('Note · '+tag),tag:tag||'Reflection',grave:!!grave,body:grave?'**Intention for the grave**\n\n':'**Reflection**\n\n'});if(typeof clarityOpenNotesEditor==='function')clarityOpenNotesEditor();else switchTab('about',{fromRouter:true});};
window.notesQuickFromSection = notesQuickFromSection;
function notesOpenDeedNote(opts){ try{ if(typeof switchTab==="function") switchTab("notes"); }catch(e){}
      opts = opts || {};
      const day = new Date();
      const iso = day.toISOString().slice(0,10);
      const pretty = day.toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
      const title = opts.title || ('Today’s deed · ' + pretty);
      const tag = opts.tag || 'Practice';
      const pathLine = opts.pathLine || '';
      const deed = opts.deed || 'One sincere action for Allah';
      const stableId = 'deed-' + iso;
      let note = notesState.notes.find(n => n.id === stableId);
      const stamp = day.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
      const block = [
        '## ' + pretty,
        pathLine ? ('_' + pathLine + '_') : '',
        '',
        '**Deed:** ' + deed,
        '',
        '- [ ] I intended this for Allah',
        '- [ ] I acted, or I wrote why I delayed',
        '',
        '### What I want people to know / forgive',
        '',
        '### Light I can send ahead',
        '',
        '_Opened from Today · ' + stamp + '_'
      ].filter(function(x,i,a){return !(x==='' && a[i-1]==='');}).join('\n');
      if(!note){
        note = notesEmpty({id:stableId,title:title,tag:tag,grave:!!opts.grave,body:block});
        notesState.notes = [note].concat(notesState.notes);
      } else {
        if((note.body||'').indexOf(deed) === -1){
          note.body = (note.body||'') + '\n\n---\n' + block;
        }
        note.updatedAt = Date.now();
        note.tag = note.tag || tag;
        if(opts.grave) note.grave = true;
      }
      notesState.selectedId = note.id;
      notesPersist();
      try { if (typeof clarityOpenNotesEditor === 'function') clarityOpenNotesEditor();
      else if (typeof switchTab === 'function') switchTab('about', { fromRouter: true }); } catch(e){}
      notesRender();
      setTimeout(function(){
        const body = document.getElementById('notes-body');
        const active = document.getElementById('notes-editor-active');
        if(active){ active.classList.add('flash-deed'); setTimeout(function(){ active.classList.remove('flash-deed'); }, 1600); }
        if(body){ body.focus(); body.scrollTop = body.scrollHeight; }
      }, 80);
      return note.id;
    };
window.notesOpenDeedNote = notesOpenDeedNote;

function notesBoot(){
  try {
    if (typeof notesLoad === "function") notesLoad();
  } catch(e){ console.warn("notesBoot", e); }
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function(){ setTimeout(notesBoot, 250); });
} else {
  setTimeout(notesBoot, 250);
}
window.addEventListener("load", function(){ setTimeout(notesBoot, 700); });

/* Seed button wiring if present */
document.addEventListener("click", function(ev){
  var t = ev.target && ev.target.closest && ev.target.closest("button, [data-notes]");
  if (!t) return;
  var label = (t.textContent || "").trim().toLowerCase();
  if (label === "seed" || t.getAttribute("data-notes") === "seed") {
    ev.preventDefault();
    try { if (typeof notesRestoreSeed === "function") notesRestoreSeed(); } catch(e){}
  }
}, true);
})();
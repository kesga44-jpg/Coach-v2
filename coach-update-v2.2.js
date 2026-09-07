console.info('Football Coach update 2.3.2 geladen');
// Football Coach update v2.2
// Adds: central Importeren hub + Man of the Match per match + MOTM season statistics.
// Load this file AFTER app.js.

(() => {
  const oldNormalize = normalize;
  normalize = function () {
    oldNormalize();
    state.matches.forEach(m => {
      m.manOfTheMatchPlayerId ??= null;
      if (m.manOfTheMatchPlayerId && !playerById(m.manOfTheMatchPlayerId)) {
        m.manOfTheMatchPlayerId = null;
      }
    });
    ui.importTarget ??= 'exercises';
    ui.importText ??= '';
    ui.importFilename ??= '';
    ui.importPreview ??= [];
  };

  const oldMatchTotals = matchTotals;
  matchTotals = function(playerId, teamId = ui.teamId) {
    const base = oldMatchTotals(playerId, teamId);
    const motm = state.matches.filter(m =>
      (!teamId || m.teamId === teamId) &&
      m.manOfTheMatchPlayerId === playerId
    ).length;
    return {...base, motm};
  };

  const oldPageInfo = pageInfo;
  pageInfo = function() {
    if (ui.page === 'imports') return ['Importeren', 'CENTRALE IMPORT'];
    return oldPageInfo();
  };

  function addImportNav() {
    const side = document.querySelector('.side-nav');
    if (side && !side.querySelector('[data-page="imports"]')) {
      const btn = document.createElement('button');
      btn.className = 'nav-item';
      btn.dataset.page = 'imports';
      btn.innerHTML = '↥ <span>Importeren</span>';
      const settings = side.querySelector('[data-page="settings"]');
      side.insertBefore(btn, settings || null);
    }
    if (!document.querySelector('#centralImportFile')) {
      const input = document.createElement('input');
      input.id = 'centralImportFile';
      input.type = 'file';
      input.hidden = true;
      input.accept = '.pdf,.docx,.xlsx,.xlsm,.xls,.txt,.md,.csv,.json,application/pdf,application/json,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      document.body.appendChild(input);
      input.onchange = async e => {
        const file = e.target.files?.[0];
        if (file) await analyseCentralImportFile(file);
        e.target.value = '';
      };
    }
  }

  function importTargetLabel(v) {
    return ({
      exercises:'Oefeningen',
      players:'Spelers',
      trainings:'Trainingen',
      matches:'Wedstrijden',
      season:'Seizoen',
      notes:'Coachnotities'
    })[v] || v;
  }

  function parseDateFromText(s) {
    const t = String(s || '').trim();
    let m = t.match(/\b(20\d{2})[-/](\d{1,2})[-/](\d{1,2})\b/);
    if (m) return `${m[1]}-${String(m[2]).padStart(2,'0')}-${String(m[3]).padStart(2,'0')}`;
    m = t.match(/\b(\d{1,2})[-/](\d{1,2})[-/](20\d{2})\b/);
    if (m) return `${m[3]}-${String(m[2]).padStart(2,'0')}-${String(m[1]).padStart(2,'0')}`;
    return '';
  }

  function smartLines(text) {
    return String(text || '')
      .replace(/\r/g,'')
      .split(/\n+/)
      .map(x => x.trim())
      .filter(Boolean)
      .filter(x => !/^#\s*(pagina|werkblad)\b/i.test(x));
  }

  function parseCentralImport(text, target) {
    if (target === 'exercises') {
      return extractExercisesFromText(text).map(x => ({...x, selected:true}));
    }

    if (target === 'players') {
      return smartLines(text)
        .map(line => line.replace(/^[•*\-\d.)\s]+/, '').trim())
        .filter(line => line.length >= 2 && line.length <= 80)
        .slice(0,150)
        .map(name => ({selected:true, name, position:'', selection:'Overig'}));
    }

    if (target === 'notes') {
      const parts = String(text || '').replace(/\r/g,'').split(/\n\s*\n+/)
        .map(x => x.trim()).filter(x => x.length >= 3);
      return parts.slice(0,100).map(x => ({
        selected:true, date:parseDateFromText(x) || TODAY(),
        category:'Algemeen', text:x.slice(0,2000)
      }));
    }

    const lines = smartLines(text);
    if (target === 'trainings') {
      return lines.filter(x => parseDateFromText(x)).slice(0,100).map(x => {
        const date = parseDateFromText(x);
        const rest = x.replace(/\b20\d{2}[-/]\d{1,2}[-/]\d{1,2}\b|\b\d{1,2}[-/]\d{1,2}[-/]20\d{2}\b/, '').replace(/^[\s;,\-–]+/,'').trim();
        return {selected:true,date,startTime:'',focus:rest || 'Training',intensity:'Middel'};
      });
    }

    if (target === 'matches') {
      return lines.filter(x => parseDateFromText(x)).slice(0,100).map(x => {
        const date = parseDateFromText(x);
        const rest = x.replace(/\b20\d{2}[-/]\d{1,2}[-/]\d{1,2}\b|\b\d{1,2}[-/]\d{1,2}[-/]20\d{2}\b/, '').replace(/^[\s;,\-–]+/,'').trim();
        const opp = rest.replace(/^(vs\.?|tegen)\s+/i,'').trim();
        return {selected:true,date,startTime:'',opponent:opp || 'Tegenstander',competition:'',homeAway:'Thuis'};
      });
    }

    if (target === 'season') {
      return lines.filter(x => parseDateFromText(x)).slice(0,120).map(x => {
        const date = parseDateFromText(x);
        const title = x.replace(/\b20\d{2}[-/]\d{1,2}[-/]\d{1,2}\b|\b\d{1,2}[-/]\d{1,2}[-/]20\d{2}\b/, '').replace(/^[\s;,\-–]+/,'').trim();
        return {selected:true,date,startTime:'',type:'Teamactiviteit',title:title || 'Activiteit',notes:''};
      });
    }
    return [];
  }

  async function analyseCentralImportFile(file) {
    try {
      toast('Bestand wordt gelezen…');
      let text = '';
      if (file.name.toLowerCase().endsWith('.json')) {
        text = await file.text();
      } else {
        text = await readDocumentFile(file);
      }
      ui.importFilename = file.name;
      ui.importText = text;
      ui.importPreview = parseCentralImport(text, ui.importTarget);
      renderPage();
      toast(`${ui.importPreview.length} items gevonden`);
    } catch (e) {
      toast('Importanalyse mislukt: ' + e.message);
    }
  }

  function centralPreviewCard(item, i) {
    const target = ui.importTarget;
    let title = item.name || item.opponent || item.focus || item.title || item.text || `Item ${i+1}`;
    let meta = '';
    if (item.date) meta += `${fmtDate(item.date)} · `;
    meta += importTargetLabel(target);
    return `<div class="candidate-card ${item.selected !== false ? 'selected' : ''}">
      <label class="check-item"><input type="checkbox" data-central-preview="${i}" ${item.selected !== false ? 'checked' : ''}> <strong>${esc(String(title).slice(0,120))}</strong></label>
      <div class="muted small" style="margin-top:8px">${esc(meta)}</div>
      <button class="btn ghost small-btn" style="margin-top:10px" data-edit-central-preview="${i}">✎ Bewerken</button>
    </div>`;
  }

  window.renderImports = function() {
    const targets = [
      ['exercises','Oefeningen'],
      ['players','Spelers'],
      ['trainings','Trainingen'],
      ['matches','Wedstrijden'],
      ['season','Seizoen'],
      ['notes','Coachnotities']
    ];
    return `<div class="grid two">
      <section class="card">
        <div class="card-head"><div><p class="eyebrow">ÉÉN INGANG</p><h2>Centrale import</h2></div><span class="badge green">Controle vóór opslaan</span></div>
        <p class="muted small">Kies eerst waar de informatie thuishoort. Daarna leest de app PDF, Word, Excel, CSV of tekst en maakt bewerkbare app-items.</p>
        <div class="form-grid">
          <div class="field full"><label>Waar moet dit naartoe?</label>
            <select id="centralImportTarget" class="input">${targets.map(([v,l])=>`<option value="${v}" ${ui.importTarget===v?'selected':''}>${l}</option>`).join('')}</select>
          </div>
          <div class="field full"><label>Tekst plakken (optioneel)</label><textarea id="centralImportText" placeholder="Plak hier een lijst of tekst…">${esc(ui.importText || '')}</textarea></div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn primary" data-central-file>Bestand kiezen</button>
          <button class="btn secondary" data-central-analyse>Tekst analyseren</button>
          <button class="btn ghost" data-central-clear>Leegmaken</button>
        </div>
        ${ui.importFilename ? `<div class="callout" style="margin-top:14px">Bron: <strong>${esc(ui.importFilename)}</strong></div>` : ''}
      </section>
      <section class="card">
        <div class="card-head"><div><p class="eyebrow">WERKWIJZE</p><h2>Import → controleren → wijzigen</h2></div></div>
        <div class="list">
          <div class="list-row"><span>1. Bestemming kiezen</span><strong>${esc(importTargetLabel(ui.importTarget))}</strong></div>
          <div class="list-row"><span>2. Bestand of tekst analyseren</span><strong>lokaal</strong></div>
          <div class="list-row"><span>3. Gevonden items controleren</span><strong>✎</strong></div>
          <div class="list-row"><span>4. Importeren</span><strong>bewerkbare data</strong></div>
        </div>
      </section>
    </div>
    ${ui.importPreview?.length ? `<section class="card" style="margin-top:16px">
      <div class="card-head"><div><p class="eyebrow">CONTROLE</p><h2>${ui.importPreview.length} gevonden items</h2></div>
      <div class="row-actions"><button class="btn ghost small-btn" data-central-all>Alles selecteren</button><button class="btn primary" data-central-commit>Geselecteerde importeren</button></div></div>
      <div class="candidate-grid">${ui.importPreview.map(centralPreviewCard).join('')}</div>
    </section>` : ''}`;
  };

  function editCentralPreview(i) {
    const x = ui.importPreview?.[i];
    if (!x) return;
    const target = ui.importTarget;
    let body = '';
    if (target === 'players') {
      body = `<div class="form-grid"><div class="field full"><label>Naam</label><input id="cipName" class="input" value="${esc(x.name||'')}"></div><div class="field"><label>Positie</label><input id="cipPosition" class="input" value="${esc(x.position||'')}"></div><div class="field"><label>Selectiestatus</label><input id="cipSelection" class="input" value="${esc(x.selection||'Overig')}"></div></div>`;
    } else if (target === 'notes') {
      body = `<div class="form-grid"><div class="field"><label>Datum</label><input id="cipDate" class="input" type="date" value="${esc(x.date||TODAY())}"></div><div class="field"><label>Categorie</label><input id="cipCategory" class="input" value="${esc(x.category||'Algemeen')}"></div><div class="field full"><label>Notitie</label><textarea id="cipText">${esc(x.text||'')}</textarea></div></div>`;
    } else if (target === 'matches') {
      body = `<div class="form-grid"><div class="field"><label>Datum</label><input id="cipDate" class="input" type="date" value="${esc(x.date||TODAY())}"></div><div class="field full"><label>Tegenstander</label><input id="cipOpponent" class="input" value="${esc(x.opponent||'')}"></div><div class="field"><label>Competitie</label><input id="cipCompetition" class="input" value="${esc(x.competition||'')}"></div></div>`;
    } else if (target === 'trainings') {
      body = `<div class="form-grid"><div class="field"><label>Datum</label><input id="cipDate" class="input" type="date" value="${esc(x.date||TODAY())}"></div><div class="field full"><label>Focus</label><input id="cipFocus" class="input" value="${esc(x.focus||'')}"></div></div>`;
    } else if (target === 'season') {
      body = `<div class="form-grid"><div class="field"><label>Datum</label><input id="cipDate" class="input" type="date" value="${esc(x.date||TODAY())}"></div><div class="field full"><label>Titel</label><input id="cipTitle" class="input" value="${esc(x.title||'')}"></div></div>`;
    } else {
      // Reuse the existing exercise editor for exercise candidates.
      body = exerciseForm(x);
    }
    modal('Import-item bewerken', body, () => {
      if (target === 'players') {
        x.name = $('#cipName').value.trim(); x.position = $('#cipPosition').value.trim(); x.selection = $('#cipSelection').value.trim() || 'Overig';
      } else if (target === 'notes') {
        x.date = $('#cipDate').value || TODAY(); x.category = $('#cipCategory').value.trim() || 'Algemeen'; x.text = $('#cipText').value.trim();
      } else if (target === 'matches') {
        x.date = $('#cipDate').value || TODAY(); x.opponent = $('#cipOpponent').value.trim(); x.competition = $('#cipCompetition').value.trim();
      } else if (target === 'trainings') {
        x.date = $('#cipDate').value || TODAY(); x.focus = $('#cipFocus').value.trim();
      } else if (target === 'season') {
        x.date = $('#cipDate').value || TODAY(); x.title = $('#cipTitle').value.trim();
      } else {
        Object.assign(x,{
          name:$('#fExName').value.trim(),category:$('#fExCat').value.trim()||'Uit document',
          intensity:$('#fExIntensity').value.trim()||'Middel',players:$('#fExPlayers').value.trim(),
          duration:Math.max(1,number($('#fExDuration').value)||10),size:$('#fExSize').value.trim(),
          materials:$('#fExMaterials').value.trim(),goal:$('#fExGoal').value.trim(),
          organization:$('#fExOrg').value.trim(),description:$('#fExOrg').value.trim(),
          coachPoints:$('#fExCoach').value.split('\n').map(v=>v.trim()).filter(Boolean),
          variations:$('#fExVar').value.trim(),tags:$('#fExTags').value.split(',').map(v=>v.trim()).filter(Boolean)
        });
      }
      return true;
    }, {afterSave:()=>renderPage()});
  }

  function commitCentralImport() {
    const items = (ui.importPreview || []).filter(x => x.selected !== false);
    if (!items.length) return toast('Selecteer minimaal één item');
    const target = ui.importTarget;
    if (target === 'exercises') {
      const doc = {id:uid('doc'),name:ui.importFilename || 'Centrale import',importedAt:new Date().toISOString(),exerciseCount:items.length,characterCount:(ui.importText||'').length};
      state.documents.push(doc);
      items.forEach(x => state.exercises.push({...clone(x),id:uid('ex'),sourceDocId:doc.id}));
    }
    if (target === 'players') {
      items.forEach(x => state.players.push({
        id:uid('p'),name:x.name,number:'',position:x.position||'',alternatePositions:[],preferredFoot:'',birthDate:'',
        selection:x.selection||'Overig',primaryTeamId:ui.teamId,teamIds:[ui.teamId],developmentGoals:'',notes:'',
        scores:{technical:0,tactical:0,physical:0,mental:0,attitude:0},conversations:[],active:true
      }));
    }
    if (target === 'trainings') {
      items.forEach(x => state.trainings.push({
        id:uid('tr'),date:x.date||TODAY(),title:'Training',startTime:x.startTime||state.team.trainingTime||'20:00',
        teamId:ui.teamId,attendance:{},squadPlayerIds:null,notes:'',coachNotes:'',focus:x.focus||'',intensity:x.intensity||'Middel',
        planItems:[],exerciseIds:[]
      }));
    }
    if (target === 'matches') {
      items.forEach(x => state.matches.push({
        id:uid('m'),date:x.date||TODAY(),startTime:x.startTime||'',teamId:ui.teamId,homeAway:x.homeAway||'Thuis',
        opponent:x.opponent||'Tegenstander',competition:x.competition||'',venue:'',formation:activeTeam()?.formation||'4-3-3',
        attendance:{},lineup:{},benchIds:[],squadPlayerIds:null,playerStats:{},goalsFor:'',goalsAgainst:'',notes:'',
        plan:{teamGoal:'',pressing:'',buildUp:'',setPieces:'',individual:''},
        evaluation:{good:'',improve:'',nextTraining:''},
        checklist:{selection:false,lineup:false,opponent:false,setPieces:false,warmup:false,materials:false},
        manOfTheMatchPlayerId:null
      }));
    }
    if (target === 'season') {
      items.forEach(x => state.seasonItems.push({id:uid('si'),date:x.date||TODAY(),startTime:x.startTime||'',teamId:ui.teamId,type:x.type||'Teamactiviteit',title:x.title||'Activiteit',notes:x.notes||''}));
    }
    if (target === 'notes') {
      items.forEach(x => state.coachNotes.push({id:uid('note'),date:x.date||TODAY(),teamId:ui.teamId,category:x.category||'Algemeen',playerId:null,eventId:null,text:x.text||''}));
    }
    ui.importPreview = []; ui.importFilename = ''; ui.importText = '';
    normalize(); save();
    toast(`${items.length} items geïmporteerd naar ${importTargetLabel(target)}`);
  }

  function motmName(m) {
    return m?.manOfTheMatchPlayerId ? (playerById(m.manOfTheMatchPlayerId)?.name || 'Onbekende speler') : '';
  }

  function editManOfTheMatch(matchId) {
    const m = matchById(matchId);
    if (!m) return;
    const squad = eventSquad(m);
    modal('Man of the Match', `<div class="field"><label>Speler</label>
      <select id="fMotm" class="input"><option value="">Nog niet gekozen</option>
      ${squad.map(p=>`<option value="${p.id}" ${m.manOfTheMatchPlayerId===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select>
      <p class="muted tiny">Per wedstrijd kan maximaal één speler Man of the Match zijn. Dit telt automatisch mee in de seizoensstatistieken.</p></div>`,
      () => { m.manOfTheMatchPlayerId = $('#fMotm').value || null; return true; }
    );
  }

  const oldRenderMatches = renderMatches;
  renderMatches = function() {
    let html = oldRenderMatches();
    const m = matchById(ui.matchId);
    if (!m) return html;
    const name = motmName(m);
    const card = `<section class="card" style="margin-top:16px">
      <div class="card-head"><div><p class="eyebrow">MAN OF THE MATCH</p><h2>${name ? esc(name) : 'Nog niet gekozen'}</h2>
      <p class="muted small">Kies na de wedstrijd één speler. Deze verkiezing telt mee in de jaarstatistieken.</p></div>
      <button class="btn ${name?'ghost':'primary'}" data-edit-motm="${m.id}">${name?'✎ Wijzigen':'Kiezen'}</button></div>
    </section>`;
    return html + card;
  };

  const oldRenderStats = renderStats;
  renderStats = function() {
    const base = oldRenderStats();
    const team = activeTeam();
    const data = playersForTeam(team.id).map(p => ({p, count:matchTotals(p.id,team.id).motm}))
      .filter(x => x.count > 0).sort((a,b)=>b.count-a.count || a.p.name.localeCompare(b.p.name,'nl'));
    const total = state.matches.filter(m=>m.teamId===team.id && m.manOfTheMatchPlayerId).length;
    const leader = data[0];
    return `${base}
      <section class="card" style="margin-top:16px">
        <div class="card-head"><div><p class="eyebrow">MAN OF THE MATCH</p><h2>Seizoensranglijst</h2></div>
        <span class="badge green">${total} verkiezing${total===1?'':'en'}</span></div>
        ${leader?`<div class="callout"><strong>Koploper: ${esc(leader.p.name)}</strong><div class="muted small">${leader.count}× Man of the Match</div></div>`:''}
        <div class="table-wrap" style="margin-top:12px"><table><thead><tr><th>Speler</th><th>MOTM</th><th>Wedstrijden</th><th>Minuten</th><th>G</th><th>A</th></tr></thead>
        <tbody>${data.length?data.map(x=>{const mt=matchTotals(x.p.id,team.id);return `<tr><td><button class="link-button" data-profile-player="${x.p.id}">${esc(x.p.name)}</button></td><td><strong>${x.count}</strong></td><td>${mt.games}</td><td>${mt.minutes}</td><td>${mt.goals}</td><td>${mt.assists}</td></tr>`}).join(''):'<tr><td colspan="6" class="muted">Nog geen Man of the Match gekozen.</td></tr>'}</tbody></table></div>
      </section>`;
  };

  const oldRenderPlayerProfilePage = renderPlayerProfilePage;
  renderPlayerProfilePage = function() {
    let html = oldRenderPlayerProfilePage();
    const p = playerById(ui.playerId);
    if (!p) return html;
    const mt = matchTotals(p.id, p.primaryTeamId || ui.teamId);
    html = html.replace(
      '<div class="card player-stat-card"><span>Goals / assists</span>',
      `<div class="card player-stat-card"><span>Man of the Match</span><strong>${mt.motm}</strong><small>Dit seizoen</small></div><div class="card player-stat-card"><span>Goals / assists</span>`
    );
    return html;
  };

  const oldRenderMore = renderMore;
  renderMore = function() {
    let html = oldRenderMore();
    if (!html.includes('data-go="imports"')) {
      html = html.replace(
        `['documents','⌁','Bronnen'],`,
        `['documents','⌁','Bronnen'],['imports','↥','Importeren'],`
      );
    }
    return html;
  };

  const oldRenderPage = renderPage;
  renderPage = function() {
    normalize();
    if (ui.page !== 'imports') {
      oldRenderPage();
      addImportNav();
      return;
    }
    const [title,eye] = pageInfo();
    $('#pageTitle').textContent = title;
    $('#pageEyebrow').textContent = (state.team.season?`SEIZOEN ${state.team.season} · `:'') + eye;
    renderTeamSelect();
    $('#app').innerHTML = renderImports();
    $$('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page==='imports'));
    addImportNav();

    const target = $('#centralImportTarget');
    if (target) target.onchange = e => {
      ui.importTarget = e.target.value;
      ui.importPreview = ui.importText ? parseCentralImport(ui.importText, ui.importTarget) : [];
      renderPage();
    };
    const txt = $('#centralImportText');
    if (txt) txt.oninput = e => { ui.importText = e.target.value; };
    $$('[data-central-preview]').forEach(c => c.onchange = e => {
      const i = Number(e.target.dataset.centralPreview);
      ui.importPreview[i].selected = e.target.checked;
      e.target.closest('.candidate-card')?.classList.toggle('selected', e.target.checked);
    });
  };

  document.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.hasAttribute('data-central-file')) { $('#centralImportFile')?.click(); return; }
    if (b.hasAttribute('data-central-analyse')) {
      ui.importText = $('#centralImportText')?.value || '';
      ui.importPreview = parseCentralImport(ui.importText, ui.importTarget);
      renderPage(); toast(`${ui.importPreview.length} items gevonden`); return;
    }
    if (b.hasAttribute('data-central-clear')) { ui.importText=''; ui.importFilename=''; ui.importPreview=[]; renderPage(); return; }
    if (b.hasAttribute('data-central-all')) { ui.importPreview.forEach(x=>x.selected=true); renderPage(); return; }
    if (b.hasAttribute('data-central-commit')) { commitCentralImport(); return; }
    if (b.dataset.editCentralPreview !== undefined) { editCentralPreview(Number(b.dataset.editCentralPreview)); return; }
    if (b.dataset.editMotm) { editManOfTheMatch(b.dataset.editMotm); return; }
  });

  normalize();
  addImportNav();
  renderPage();
})();


// v2.2.2 — trainingen en wedstrijden verwijderen
(() => {
  const renderTrainingsBeforeDelete = renderTrainings;
  renderTrainings = function() {
    let html = renderTrainingsBeforeDelete();
    const t = trainingById(ui.trainingId);
    if (t && !html.includes(`data-delete-training="${t.id}"`)) {
      html = html.replace(
        `<button class="btn ghost" data-edit-training="${t.id}">Bewerken</button>`,
        `<button class="btn ghost" data-edit-training="${t.id}">Bewerken</button><button class="btn danger" data-delete-training="${t.id}">Verwijderen</button>`
      );
    }
    return html;
  };

  const renderMatchesBeforeDelete = renderMatches;
  renderMatches = function() {
    let html = renderMatchesBeforeDelete();
    const m = matchById(ui.matchId);
    if (m && !html.includes(`data-delete-match="${m.id}"`)) {
      html = html.replace(
        `<button class="btn ghost" data-edit-match="${m.id}">Bewerken</button>`,
        `<button class="btn ghost" data-edit-match="${m.id}">Bewerken</button><button class="btn danger" data-delete-match="${m.id}">Verwijderen</button>`
      );
    }
    return html;
  };

  document.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;

    if (b.dataset.deleteTraining) {
      const t = trainingById(b.dataset.deleteTraining);
      if (!t) return;
      const label = `${fmtDate(t.date)}${t.focus ? ` · ${t.focus}` : ''}`;
      if (!confirm(`Training verwijderen?\n\n${label}\n\nAanwezigheid en trainingsplan van alleen deze training worden ook verwijderd.`)) return;
      state.trainings = state.trainings.filter(x => x.id !== t.id);
      if (ui.trainingId === t.id) ui.trainingId = null;
      if (ui.attendanceId === t.id) ui.attendanceId = null;
      save();
      toast('Training verwijderd');
      return;
    }

    if (b.dataset.deleteMatch) {
      const m = matchById(b.dataset.deleteMatch);
      if (!m) return;
      const label = `${fmtDate(m.date)}${m.opponent ? ` · ${m.opponent}` : ''}`;
      if (!confirm(`Wedstrijd verwijderen?\n\n${label}\n\nOpstelling, statistieken en Man of the Match van alleen deze wedstrijd worden ook verwijderd.`)) return;
      state.matches = state.matches.filter(x => x.id !== m.id);
      if (ui.matchId === m.id) ui.matchId = null;
      if (ui.attendanceId === m.id) ui.attendanceId = null;
      save();
      toast('Wedstrijd verwijderd');
      return;
    }
  });
})();


// v2.3.0 — apparaat-afhankelijke navigatie
(() => {
  const NAV_BREAKPOINT_MOBILE = 700;
  const NAV_BREAKPOINT_TABLET = 1200;

  function injectResponsiveCoachStyles(){
    if(document.querySelector('#coach-responsive-nav-v230')) return;
    const style = document.createElement('style');
    style.id = 'coach-responsive-nav-v230';
    style.textContent = `
      /* basis */
      .coach-tablet-rail{display:none}
      .coach-mobile-bottom{display:none}
      .coach-device-label{display:none}

      /* MOBIEL */
      @media (max-width:${NAV_BREAKPOINT_MOBILE-1}px){
        .sidebar{display:none!important}
        .main-area{margin-left:0!important;width:100%!important;min-width:0}
        .topbar{padding-left:14px!important;padding-right:14px!important}
        .content{padding:14px!important;padding-bottom:92px!important}
        .bottom-nav{display:none!important}

        .coach-mobile-bottom{
          position:fixed;left:0;right:0;bottom:0;z-index:1000;
          display:grid;grid-template-columns:repeat(5,1fr);
          background:var(--surface,#fff);
          border-top:1px solid rgba(0,0,0,.10);
          padding:7px 6px calc(7px + env(safe-area-inset-bottom));
          box-shadow:0 -8px 26px rgba(0,0,0,.08);
        }
        .coach-mobile-bottom button{
          border:0;background:transparent;display:flex;flex-direction:column;
          align-items:center;justify-content:center;gap:3px;min-height:50px;
          font:inherit;color:inherit;border-radius:11px;padding:4px 2px;
        }
        .coach-mobile-bottom button span{font-size:20px;line-height:1}
        .coach-mobile-bottom button small{font-size:10.5px;white-space:nowrap}
        .coach-mobile-bottom button.active{
          background:rgba(11,93,59,.10);font-weight:700
        }

        .top-actions .team-select{max-width:128px}
        .toolbar{align-items:flex-start}
        .toolbar,.toolbar .left,.toolbar .right{flex-wrap:wrap}
        .table-wrap{overflow-x:auto}
      }

      /* IPAD / TABLET */
      @media (min-width:${NAV_BREAKPOINT_MOBILE}px) and (max-width:${NAV_BREAKPOINT_TABLET-1}px){
        .sidebar{display:none!important}
        .bottom-nav{display:none!important}
        .main-area{
          margin-left:84px!important;
          width:calc(100% - 84px)!important;
          min-width:0
        }
        .coach-tablet-rail{
          position:fixed;left:0;top:0;bottom:0;z-index:1000;
          width:84px;display:flex;flex-direction:column;align-items:center;
          background:var(--sidebar,#0b1d17);
          color:#fff;border-right:1px solid rgba(255,255,255,.08);
          padding:14px 8px calc(14px + env(safe-area-inset-bottom));
          overflow-y:auto;
        }
        .coach-tablet-brand{
          width:48px;height:48px;border-radius:15px;display:grid;place-items:center;
          margin:4px 0 16px;font-weight:800;
          background:rgba(255,255,255,.12)
        }
        .coach-tablet-nav{
          width:100%;display:flex;flex-direction:column;gap:5px
        }
        .coach-tablet-nav button{
          width:100%;min-height:58px;border:0;background:transparent;color:inherit;
          border-radius:13px;display:flex;flex-direction:column;align-items:center;
          justify-content:center;gap:4px;font:inherit;padding:5px 2px
        }
        .coach-tablet-nav button span{font-size:19px}
        .coach-tablet-nav button small{font-size:9px;line-height:1.05;text-align:center}
        .coach-tablet-nav button.active{
          background:rgba(255,255,255,.14);font-weight:700
        }
        .content{padding-bottom:24px!important}
        .table-wrap{overflow-x:auto}
      }

      /* LAPTOP / DESKTOP */
      @media (min-width:${NAV_BREAKPOINT_TABLET}px){
        .sidebar{display:flex!important}
        .bottom-nav{display:none!important}
        .coach-mobile-bottom,.coach-tablet-rail{display:none!important}
      }
    `;
    document.head.appendChild(style);
  }

  const primaryMobile = [
    ['dashboard','⌂','Vandaag'],
    ['players','♙','Team'],
    ['matches','⚽','Wedstrijden'],
    ['stats','▥','Statistieken'],
    ['more','•••','Meer']
  ];

  const tabletNav = [
    ['dashboard','⌂','Vandaag'],
    ['players','♙','Team'],
    ['attendance','✓','Aanwezig'],
    ['trainings','◫','Training'],
    ['matches','⚽','Wedstrijd'],
    ['stats','▥','Stats'],
    ['tactics','↗','Tactiek'],
    ['more','•••','Meer']
  ];

  function makeMobileNav(){
    let nav = document.querySelector('.coach-mobile-bottom');
    if(!nav){
      nav = document.createElement('nav');
      nav.className = 'coach-mobile-bottom';
      nav.setAttribute('aria-label','Mobiele hoofdnavigatie');
      document.body.appendChild(nav);
    }
    nav.innerHTML = primaryMobile.map(([page,icon,label]) =>
      `<button type="button" data-responsive-page="${page}"><span>${icon}</span><small>${label}</small></button>`
    ).join('');
  }

  function makeTabletRail(){
    let rail = document.querySelector('.coach-tablet-rail');
    if(!rail){
      rail = document.createElement('aside');
      rail.className = 'coach-tablet-rail';
      rail.setAttribute('aria-label','iPad navigatie');
      document.body.appendChild(rail);
    }
    rail.innerHTML = `<div class="coach-tablet-brand">FS</div>
      <nav class="coach-tablet-nav">
        ${tabletNav.map(([page,icon,label]) =>
          `<button type="button" data-responsive-page="${page}"><span>${icon}</span><small>${label}</small></button>`
        ).join('')}
      </nav>`;
  }

  function activateResponsiveNav(){
    const active = ui.page === 'player' ? 'players' : ui.page;
    document.querySelectorAll('[data-responsive-page]').forEach(btn => {
      const p = btn.dataset.responsivePage;
      btn.classList.toggle('active', p === active || (p === 'more' && ![
        'dashboard','players','attendance','trainings','matches','stats','tactics'
      ].includes(active)));
    });
  }

  function openResponsivePage(page){
    if(page === 'more') return setPage('more');
    setPage(page);
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-responsive-page]');
    if(!btn) return;
    openResponsivePage(btn.dataset.responsivePage);
  });

  const oldSetPageResponsive = setPage;
  setPage = function(page){
    oldSetPageResponsive(page);
    activateResponsiveNav();
  };

  const oldRenderPageResponsive = renderPage;
  renderPage = function(){
    oldRenderPageResponsive();
    activateResponsiveNav();
  };

  injectResponsiveCoachStyles();
  makeMobileNav();
  makeTabletRail();
  activateResponsiveNav();

  window.addEventListener('resize', activateResponsiveNav);
})();

// v2.3.1 — training alleen voorkeursteam; wedstrijd alle beschikbare teams
(() => {
  const isTraining231 = ev => !!ev && state.trainings.some(t=>t.id===ev.id);
  const isMatch231 = ev => !!ev && state.matches.some(m=>m.id===ev.id);

  eventSquad = function(ev){
    if(!ev) return [];
    const teamId = ev.teamId || ui.teamId;
    const allowed = isMatch231(ev) ? availablePlayersForTeam(teamId) : playersForTeam(teamId);
    const allowedIds = new Set(allowed.map(p=>p.id));

    if(Array.isArray(ev.squadPlayerIds) && ev.squadPlayerIds.length){
      return ev.squadPlayerIds.map(playerById).filter(p=>p && p.active!==false && allowedIds.has(p.id));
    }
    return allowed;
  };

  squadForm = function(ev){
    const teamId = ev.teamId || ui.teamId;

    if(isTraining231(ev)){
      const own = playersForTeam(teamId);
      const selected = Array.isArray(ev.squadPlayerIds)&&ev.squadPlayerIds.length
        ? ev.squadPlayerIds.filter(pid=>own.some(p=>p.id===pid))
        : own.map(p=>p.id);

      return `<p class="muted small">Trainingen gebruiken alleen spelers waarvan <strong>${esc(teamName(teamId))}</strong> het voorkeursteam is.</p>
      <label class="check-item" style="margin-bottom:14px"><input id="squadUseWholeTeam" type="checkbox" ${!Array.isArray(ev.squadPlayerIds)||!ev.squadPlayerIds.length?'checked':''}> Hele voorkeursteam gebruiken</label>
      <h3 class="section-title">Voorkeursteam</h3>
      <div class="check-grid">${own.map(p=>`<label class="check-item"><input type="checkbox" name="squadPlayer" value="${p.id}" ${selected.includes(p.id)?'checked':''}> ${esc(p.name)}${p.position?` <span class="muted tiny">· ${esc(p.position)}</span>`:''}</label>`).join('')}</div>`;
    }

    const own = playersForTeam(teamId);
    const extra = availablePlayersForTeam(teamId).filter(p=>p.primaryTeamId!==teamId);
    const all = [...own,...extra];
    const selected = Array.isArray(ev.squadPlayerIds)&&ev.squadPlayerIds.length
      ? ev.squadPlayerIds.filter(pid=>all.some(p=>p.id===pid))
      : all.map(p=>p.id);

    return `<p class="muted small">Wedstrijden gebruiken alle spelers die <strong>${esc(teamName(teamId))}</strong> bij “beschikbaar voor teams” hebben staan, ook wanneer hun voorkeursteam anders is.</p>
    <label class="check-item" style="margin-bottom:14px"><input id="squadUseWholeTeam" type="checkbox" ${!Array.isArray(ev.squadPlayerIds)||!ev.squadPlayerIds.length?'checked':''}> Alle beschikbare spelers gebruiken</label>
    <h3 class="section-title">Eigen voorkeursteam</h3>
    <div class="check-grid">${own.map(p=>`<label class="check-item"><input type="checkbox" name="squadPlayer" value="${p.id}" ${selected.includes(p.id)?'checked':''}> ${esc(p.name)}</label>`).join('')}</div>
    ${extra.length?`<h3 class="section-title" style="margin-top:18px">Beschikbaar vanuit andere voorkeursteams</h3><div class="check-grid">${extra.map(p=>`<label class="check-item"><input type="checkbox" name="squadPlayer" value="${p.id}" ${selected.includes(p.id)?'checked':''}> ${esc(p.name)} <span class="muted tiny">· voorkeur: ${esc(teamName(p.primaryTeamId))}</span></label>`).join('')}</div>`:''}`;
  };

  editEventSquad = function(id){
    const ev = eventById(id);
    if(!ev) return;
    modal('Groep voor deze activiteit', squadForm(ev), ()=>{
      const useWhole = $('#squadUseWholeTeam')?.checked;
      const checked = $$('input[name=squadPlayer]:checked').map(x=>x.value);
      const allowed = isMatch231(ev) ? availablePlayersForTeam(ev.teamId) : playersForTeam(ev.teamId);
      const allowedIds = new Set(allowed.map(p=>p.id));
      ev.squadPlayerIds = useWhole ? null : checked.filter(pid=>allowedIds.has(pid));

      if(isMatch231(ev)){
        const selectedIds = new Set(eventPlayerIds(ev));
        ev.benchIds = (ev.benchIds||[]).filter(pid=>selectedIds.has(pid));
        Object.keys(ev.lineup||{}).forEach(slot=>{
          if(ev.lineup[slot] && !selectedIds.has(ev.lineup[slot])) ev.lineup[slot]=null;
        });
      }
      return true;
    });
  };

  state.trainings.forEach(t=>{
    if(!Array.isArray(t.squadPlayerIds)||!t.squadPlayerIds.length) return;
    const allowed=new Set(playersForTeam(t.teamId).map(p=>p.id));
    t.squadPlayerIds=t.squadPlayerIds.filter(pid=>allowed.has(pid));
    if(!t.squadPlayerIds.length)t.squadPlayerIds=null;
  });

  state.matches.forEach(m=>{
    if(!Array.isArray(m.squadPlayerIds)||!m.squadPlayerIds.length) return;
    const allowed=new Set(availablePlayersForTeam(m.teamId).map(p=>p.id));
    m.squadPlayerIds=m.squadPlayerIds.filter(pid=>allowed.has(pid));
    if(!m.squadPlayerIds.length)m.squadPlayerIds=null;
  });

  save({render:false});
  renderPage();
})();

// v2.3.2 — automatische wedstrijdregistratie + verbeterde iPad navigatie
(() => {
  function matchIsPlayed232(m){
    if(!m) return false;
    const hasScore = m.goalsFor !== '' || m.goalsAgainst !== '';
    return hasScore || (m.date && m.date < TODAY());
  }

  function playerMatchRole232(m, playerId){
    const starter = Object.values(m.lineup || {}).includes(playerId);
    if(starter) return 'Basis';
    if((m.benchIds || []).includes(playerId)) return 'Bank';

    // Terugwaartse compatibiliteit met eerder handmatig opgeslagen statistieken.
    const s = m.playerStats?.[playerId];
    if(s?.started) return 'Basis';
    if(s && matchIsPlayed232(m)) return 'Gespeeld';
    return null;
  }

  function playerMatchHistory232(playerId, teamId=null){
    return state.matches
      .filter(m => (!teamId || m.teamId === teamId) && matchIsPlayed232(m))
      .map(m => ({m, role:playerMatchRole232(m, playerId)}))
      .filter(x => x.role)
      .sort((a,b) => (b.m.date || '').localeCompare(a.m.date || '') ||
                     (b.m.startTime || '').localeCompare(a.m.startTime || ''));
  }

  // Wedstrijden/basis/bank komen nu automatisch uit opstelling + bank.
  // Minuten/goals/assists/kaarten blijven aanvullende statistieken.
  matchTotals = function(playerId, teamId=ui.teamId){
    let games=0, starts=0, bench=0, minutes=0, goals=0, assists=0, yellow=0, red=0, motm=0;

    state.matches.filter(m => !teamId || m.teamId === teamId).forEach(m => {
      const role = matchIsPlayed232(m) ? playerMatchRole232(m, playerId) : null;
      const s = m.playerStats?.[playerId] || {};

      if(role){
        games++;
        if(role === 'Basis') starts++;
        if(role === 'Bank') bench++;
      }

      // Alleen aanvullende velden uit playerStats; geen handmatige 'gespeeld/basis' meer nodig.
      minutes += number(s.minutes);
      goals += number(s.goals);
      assists += number(s.assists);
      yellow += number(s.yellow);
      red += number(s.red);

      if(m.manOfTheMatchPlayerId === playerId) motm++;
    });

    return {games, starts, bench, minutes, goals, assists, yellow, red, motm};
  };

  // Spelersprofiel: automatisch wedstrijdlogboek over ALLE teams waarvoor de speler heeft gespeeld.
  const previousRenderPlayerProfile232 = renderPlayerProfilePage;
  renderPlayerProfilePage = function(){
    let html = previousRenderPlayerProfile232();
    const p = playerById(ui.playerId);
    if(!p) return html;

    const history = playerMatchHistory232(p.id);
    const allTotals = history.reduce((a,x)=>{
      a.games++;
      if(x.role==='Basis') a.starts++;
      if(x.role==='Bank') a.bench++;
      return a;
    }, {games:0,starts:0,bench:0});

    // Maak in de bestaande wedstrijdkaart basis én bank expliciet.
    html = html.replace(
      /<div class="card player-stat-card"><span>Wedstrijden<\/span><strong>.*?<\/strong><small>.*?<\/small><\/div>/,
      `<div class="card player-stat-card"><span>Wedstrijden</span><strong>${allTotals.games}</strong><small>${allTotals.starts} basis · ${allTotals.bench} bank</small></div>`
    );

    const rows = history.map(({m,role})=>{
      const team = teamName(m.teamId);
      const home = m.homeAway === 'Uit'
        ? `${esc(m.opponent||'Tegenstander')} – ${esc(team)}`
        : `${esc(team)} – ${esc(m.opponent||'Tegenstander')}`;
      const score = (m.goalsFor!=='' || m.goalsAgainst!=='')
        ? (m.homeAway==='Uit'
          ? `${esc(m.goalsAgainst||0)}–${esc(m.goalsFor||0)}`
          : `${esc(m.goalsFor||0)}–${esc(m.goalsAgainst||0)}`)
        : '–';
      const s = m.playerStats?.[p.id] || {};
      return `<tr>
        <td>${fmtDate(m.date)}</td>
        <td>${esc(team)}</td>
        <td><strong>${home}</strong><div class="muted tiny">${esc(m.competition||'Wedstrijd')}</div></td>
        <td><span class="badge ${role==='Basis'?'green':role==='Bank'?'blue':''}">${esc(role)}</span></td>
        <td>${score}</td>
        <td>${number(s.minutes)||'–'}</td>
        <td>${number(s.goals)||0}</td>
        <td>${number(s.assists)||0}</td>
      </tr>`;
    }).join('');

    const historyCard = `
      <section class="card player-match-history" style="margin-top:16px">
        <div class="card-head">
          <div><p class="eyebrow">WEDSTRIJDLOGBOEK</p><h2>Gespeelde wedstrijden</h2>
          <p class="muted small">Automatisch opgebouwd uit de basisopstelling en bank. Je hoeft een gespeelde wedstrijd of basisplaats niet meer apart in te voeren.</p></div>
          <span class="badge green">${allTotals.games} wedstrijd${allTotals.games===1?'':'en'}</span>
        </div>
        ${history.length ? `<div class="table-wrap"><table>
          <thead><tr><th>Datum</th><th>Team</th><th>Wedstrijd</th><th>Rol</th><th>Uitslag</th><th>Min</th><th>G</th><th>A</th></tr></thead>
          <tbody>${rows}</tbody>
        </table></div>` : `<div class="empty">Nog geen gespeelde wedstrijden vanuit een basisopstelling of bankregistratie.</div>`}
      </section>`;

    return html + historyCard;
  };

  // Statistieken: naast 'Basis' ook automatisch 'Bank'.
  const previousRenderStats232 = renderStats;
  renderStats = function(){
    const base = previousRenderStats232();
    const team = activeTeam();
    const players = availablePlayersForTeam(team.id)
      .map(p => ({p, m:matchTotals(p.id,team.id)}))
      .filter(x => x.m.games || x.m.starts || x.m.bench)
      .sort((a,b)=>b.m.games-a.m.games || b.m.starts-a.m.starts || a.p.name.localeCompare(b.p.name,'nl'));

    const extra = `<section class="card" style="margin-top:16px">
      <div class="card-head"><div><p class="eyebrow">AUTOMATISCHE REGISTRATIE</p><h2>Basis & bank</h2>
      <p class="muted small">Afgeleid uit de opgeslagen wedstrijdopstellingen. Ook spelers met een ander voorkeursteam verschijnen hier als ze voor ${esc(team.name)} hebben gespeeld.</p></div></div>
      <div class="table-wrap"><table>
        <thead><tr><th>Speler</th><th>Wedstrijden</th><th>Basis</th><th>Bank</th><th>MOTM</th></tr></thead>
        <tbody>${players.length ? players.map(x=>`<tr>
          <td><button class="link-button" data-profile-player="${x.p.id}">${esc(x.p.name)}</button></td>
          <td><strong>${x.m.games}</strong></td><td>${x.m.starts}</td><td>${x.m.bench}</td><td>${x.m.motm}</td>
        </tr>`).join('') : `<tr><td colspan="5" class="muted">Nog geen gespeelde wedstrijden geregistreerd.</td></tr>`}</tbody>
      </table></div>
    </section>`;
    return base + extra;
  };

  // iPad navigatie opnieuw: duidelijke zijbalk met contrast en betere ruimteverdeling.
  if(!document.querySelector('#coach-ipad-nav-v232')){
    const style = document.createElement('style');
    style.id = 'coach-ipad-nav-v232';
    style.textContent = `
      @media (min-width:700px) and (max-width:1199px){
        .coach-tablet-rail{
          display:flex!important;
          background:#102d24!important;
          color:#fff!important;
          border-right:1px solid rgba(255,255,255,.14)!important;
          box-shadow:8px 0 24px rgba(0,0,0,.08)!important;
          opacity:1!important;
        }
        .coach-tablet-brand{
          background:rgba(255,255,255,.16)!important;
          color:#fff!important;
        }
        .coach-tablet-nav button{
          color:rgba(255,255,255,.82)!important;
          opacity:1!important;
        }
        .coach-tablet-nav button span,
        .coach-tablet-nav button small{
          color:inherit!important;
          opacity:1!important;
        }
        .coach-tablet-nav button.active{
          background:rgba(255,255,255,.16)!important;
          color:#fff!important;
        }
      }

      /* iPad portrait: smalle iconenrail */
      @media (min-width:700px) and (max-width:1199px) and (orientation:portrait){
        .coach-tablet-rail{width:88px!important}
        .main-area{margin-left:88px!important;width:calc(100% - 88px)!important}
        .coach-tablet-nav button{min-height:60px!important}
        .coach-tablet-nav button small{font-size:10px!important}
      }

      /* iPad landscape: compacte maar volwaardige zijbalk */
      @media (min-width:700px) and (max-width:1199px) and (orientation:landscape){
        .coach-tablet-rail{
          width:188px!important;
          align-items:stretch!important;
          padding-left:12px!important;
          padding-right:12px!important;
        }
        .main-area{
          margin-left:188px!important;
          width:calc(100% - 188px)!important;
        }
        .coach-tablet-brand{
          width:auto!important;
          height:48px!important;
          padding:0 14px!important;
          justify-content:flex-start!important;
        }
        .coach-tablet-brand::after{
          content:' Full Speed';
          margin-left:8px;
          font-size:13px;
          white-space:nowrap;
        }
        .coach-tablet-nav button{
          min-height:48px!important;
          flex-direction:row!important;
          justify-content:flex-start!important;
          gap:11px!important;
          padding:8px 12px!important;
        }
        .coach-tablet-nav button span{font-size:18px!important;width:22px;text-align:center}
        .coach-tablet-nav button small{font-size:12px!important;text-align:left!important}
        .content{padding-left:22px!important;padding-right:22px!important}
      }

      .player-match-history table{min-width:720px}
    `;
    document.head.appendChild(style);
  }

  renderPage();
})();

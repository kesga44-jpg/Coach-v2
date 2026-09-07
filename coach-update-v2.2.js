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

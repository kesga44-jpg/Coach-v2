/* Football Coach v2.1.5 – regression fixes + automatic two-way sync */
(() => {
  const AUTO_SYNC_INTERVAL_MS = 30000;
  let autoSyncInterval = null;
  let autoSyncBusy = false;

  const baseRenderPlayers = renderPlayers;
  const baseRenderPlayerProfilePage = renderPlayerProfilePage;
  const baseRenderSettings = renderSettings;
  const baseRenderPage = renderPage;

  function readSyncStore() {
    try { return JSON.parse(localStorage.getItem(SYNC_KEY) || '{}'); }
    catch { return {}; }
  }

  function writeSyncStore(values) {
    const current = readSyncStore();
    localStorage.setItem(SYNC_KEY, JSON.stringify({ ...current, ...values }));
  }

  function syncTimeLabel(value) {
    if (!value) return 'Nog niet gesynchroniseerd';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Nog niet gesynchroniseerd';
    const today = new Date();
    const sameDay = date.toDateString() === today.toDateString();
    return `${sameDay ? 'Vandaag' : date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })} om ${date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}`;
  }

  getSync = function getSyncV215() {
    const stored = readSyncStore();
    return {
      url: SYNC_PROJECT_URL,
      key: SYNC_PUBLIC_KEY,
      pass: stored.pass || '',
      lastSyncedAt: stored.lastSyncedAt || ''
    };
  };

  function rememberSyncSuccess() {
    const now = new Date().toISOString();
    writeSyncStore({ lastSyncedAt: now });
    syncStatus(`Gesynchroniseerd · ${syncTimeLabel(now)}`);
    updateCoachSyncPill();
    return now;
  }

  function updateCoachSyncPill() {
    const topActions = document.querySelector('.top-actions');
    if (!topActions) return;
    let pill = document.querySelector('#coachSyncPill');
    if (!pill) {
      pill = document.createElement('span');
      pill.id = 'coachSyncPill';
      pill.className = 'coach-sync-pill';
      topActions.prepend(pill);
    }
    if (!syncConfigured()) {
      pill.textContent = 'Sync uit';
      pill.classList.remove('connected');
      return;
    }
    const last = getSync().lastSyncedAt;
    pill.textContent = last ? `✓ ${new Date(last).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}` : 'Sync gereed';
    pill.title = last ? `Laatst gesynchroniseerd: ${syncTimeLabel(last)}` : 'Nog niet gesynchroniseerd';
    pill.classList.add('connected');
  }

  // Regression fix: [] means intentionally empty custom squad; only null means use full primary team.
  eventSquad = function eventSquadV215(ev) {
    const hasCustomSquad = Array.isArray(ev?.squadPlayerIds);
    return hasCustomSquad
      ? ev.squadPlayerIds.map(playerById).filter(p => p && p.active !== false)
      : playersForTeam(ev?.teamId || activeTeam()?.id);
  };

  squadForm = function squadFormV215(ev) {
    const teamId = ev.teamId || ui.teamId;
    const teamPlayers = playersForTeam(teamId);
    const availableElsewhere = availablePlayersForTeam(teamId).filter(p => p.primaryTeamId !== teamId);
    const hasCustomSquad = Array.isArray(ev.squadPlayerIds);
    const selected = hasCustomSquad ? ev.squadPlayerIds : teamPlayers.map(p => p.id);
    return `<p class="muted small">Het team bestaat standaard alleen uit spelers waarvan dit het primaire team is. Spelers die alleen beschikbaar zijn voor dit team kun je hieronder handmatig aan deze training of wedstrijd toevoegen.</p>
      <label class="check-item" style="margin-bottom:14px"><input id="squadUseWholeTeam" type="checkbox" ${!hasCustomSquad ? 'checked' : ''}> Hele primaire team gebruiken</label>
      <h3 class="section-title">Eigen team</h3>
      <div class="check-grid">${teamPlayers.map(p => `<label class="check-item"><input type="checkbox" name="squadPlayer" value="${p.id}" ${selected.includes(p.id) ? 'checked' : ''}> ${esc(p.name)}</label>`).join('')}</div>
      ${availableElsewhere.length ? `<h3 class="section-title" style="margin-top:18px">Beschikbaar vanuit andere teams</h3><div class="check-grid">${availableElsewhere.map(p => `<label class="check-item"><input type="checkbox" name="squadPlayer" value="${p.id}" ${selected.includes(p.id) ? 'checked' : ''}> ${esc(p.name)} <span class="muted tiny">· ${esc(teamName(p.primaryTeamId))}</span></label>`).join('')}</div>` : ''}`;
  };

  function addPermanentDeleteButtons(html) {
    return html.replace(
      /(<button class="btn danger(?: small-btn)?" data-archive-player="([^"]+)">Uit selectie<\/button>)/g,
      '$1<button class="btn ghost small-btn permanent-delete-player" data-delete-player="$2">Verwijderen</button>'
    );
  }

  renderPlayers = function renderPlayersV215() {
    return addPermanentDeleteButtons(baseRenderPlayers());
  };

  renderPlayerProfilePage = function renderPlayerProfilePageV215() {
    return addPermanentDeleteButtons(baseRenderPlayerProfilePage());
  };

  renderSettings = function renderSettingsV215() {
    let html = baseRenderSettings();
    const last = getSync().lastSyncedAt;
    html = html.replace(
      /<p id="syncStatus" class="muted small" style="margin-top:12px">[\s\S]*?<\/p>/,
      `<div class="auto-sync-info"><strong>Automatische synchronisatie</strong><p class="muted small">Na iedere wijziging wordt na ongeveer 1,2 seconde gesynchroniseerd. Daarnaast controleert de app elke 30 seconden op nieuwere gegevens van je andere apparaten.</p><p id="syncStatus" class="muted small">${syncConfigured() ? `Laatst gesynchroniseerd: ${syncTimeLabel(last)}` : 'Vul alleen de Secret key in om synchronisatie te activeren.'}</p></div>`
    );
    html = html.replace(
      /<button class="btn ghost" data-push-sync[^>]*>Upload nu<\/button><button class="btn ghost" data-pull-sync[^>]*>Download nu<\/button>/,
      `<button class="btn ghost" data-push-sync ${syncConfigured() ? '' : 'disabled'}>Nu synchroniseren</button>`
    );
    return html;
  };

  renderPage = function renderPageV215() {
    baseRenderPage();
    updateCoachSyncPill();
  };

  function permanentlyDeletePlayer(playerId) {
    const player = playerById(playerId);
    if (!player) return;
    const first = confirm(`${player.name} definitief verwijderen?\n\nDit verwijdert ook aanwezigheid, wedstrijdstatistieken en selectieverwijzingen van deze speler. Gebruik “Uit selectie” als je de historie wilt bewaren.`);
    if (!first) return;
    const second = confirm(`Weet je zeker dat ${player.name} permanent weg mag? Dit kan niet ongedaan worden gemaakt zonder back-up.`);
    if (!second) return;

    state.players = state.players.filter(p => p.id !== playerId);
    state.trainings.forEach(t => {
      if (t.attendance) delete t.attendance[playerId];
      if (Array.isArray(t.squadPlayerIds)) t.squadPlayerIds = t.squadPlayerIds.filter(id => id !== playerId);
    });
    state.matches.forEach(m => {
      if (m.attendance) delete m.attendance[playerId];
      if (m.playerStats) delete m.playerStats[playerId];
      if (Array.isArray(m.squadPlayerIds)) m.squadPlayerIds = m.squadPlayerIds.filter(id => id !== playerId);
      if (Array.isArray(m.benchIds)) m.benchIds = m.benchIds.filter(id => id !== playerId);
      Object.keys(m.lineup || {}).forEach(slot => { if (m.lineup[slot] === playerId) m.lineup[slot] = null; });
    });
    state.coachNotes = (state.coachNotes || []).filter(n => n.playerId !== playerId);
    if (ui.playerId === playerId) {
      ui.playerId = null;
      ui.page = 'players';
    }
    save();
    toast(`${player.name} is definitief verwijderd`);
  }

  async function fetchRemoteCoachState() {
    const s = getSync();
    const remoteId = await syncIdFromPass(s.pass);
    const response = await fetch(`${s.url.replace(/\/$/, '')}/rest/v1/coach_data?id=eq.${encodeURIComponent(remoteId)}&select=payload,updated_at`, {
      headers: { apikey: s.key, Authorization: `Bearer ${s.key}` }
    });
    if (!response.ok) throw new Error(await response.text());
    const rows = await response.json();
    if (!rows.length) return { remoteId, remote: null };
    return { remoteId, remote: await decryptData(rows[0].payload, s.pass) };
  }

  async function uploadCoachState(remoteId) {
    const s = getSync();
    const payload = await encryptData(state, s.pass);
    const response = await fetch(`${s.url.replace(/\/$/, '')}/rest/v1/coach_data?on_conflict=id`, {
      method: 'POST',
      headers: {
        apikey: s.key,
        Authorization: `Bearer ${s.key}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify([{ id: remoteId, payload, updated_at: state.meta?.updatedAt || new Date().toISOString() }])
    });
    if (!response.ok) throw new Error(await response.text());
  }

  async function syncCoachNow({ manual = false } = {}) {
    if (!syncConfigured() || autoSyncBusy || !navigator.onLine) {
      if (manual && !navigator.onLine) toast('Geen internetverbinding');
      return;
    }
    autoSyncBusy = true;
    syncStatus('Synchroniseren…');
    try {
      const { remoteId, remote } = await fetchRemoteCoachState();
      const localTime = new Date(state.meta?.updatedAt || 0).getTime();
      const remoteTime = new Date(remote?.meta?.updatedAt || 0).getTime();

      if (!remote) {
        await uploadCoachState(remoteId);
      } else if (remoteTime > localTime) {
        state = remote;
        normalize();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        renderPage();
      } else if (localTime > remoteTime) {
        await uploadCoachState(remoteId);
      }

      rememberSyncSuccess();
      if (manual) toast('Apparaten zijn bijgewerkt');
    } catch (error) {
      syncStatus(`Syncfout: ${error.message || 'onbekende fout'}`);
      if (manual) toast('Synchronisatie mislukt');
    } finally {
      autoSyncBusy = false;
      updateCoachSyncPill();
    }
  }

  pushSync = async function pushSyncV215(silent = false) {
    return syncCoachNow({ manual: !silent });
  };
  pullSync = async function pullSyncV215(silent = false) {
    return syncCoachNow({ manual: !silent });
  };
  initialSync = async function initialSyncV215() {
    return syncCoachNow({ manual: false });
  };

  function startAutomaticSync() {
    if (autoSyncInterval) clearInterval(autoSyncInterval);
    autoSyncInterval = setInterval(() => {
      if (document.visibilityState === 'visible') syncCoachNow({ manual: false });
    }, AUTO_SYNC_INTERVAL_MS);
  }

  document.addEventListener('click', event => {
    const deleteButton = event.target.closest('[data-delete-player]');
    if (deleteButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      permanentlyDeletePlayer(deleteButton.dataset.deletePlayer);
      return;
    }

    const saveSyncButton = event.target.closest('[data-save-sync]');
    if (saveSyncButton) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const pass = document.querySelector('#syncPass')?.value.trim() || '';
      if (!pass) {
        localStorage.removeItem(SYNC_KEY);
        renderPage();
        toast('Secret key verwijderd');
        return;
      }
      const currentConfig = readSyncStore();
      const changed = currentConfig.pass && currentConfig.pass !== pass;
      localStorage.setItem(SYNC_KEY, JSON.stringify({ pass, lastSyncedAt: changed ? '' : (currentConfig.lastSyncedAt || '') }));
      renderPage();
      toast('Secret key opgeslagen');
      syncCoachNow({ manual: true });
    }
  }, true);

  window.addEventListener('online', () => syncCoachNow({ manual: false }));
  window.addEventListener('focus', () => syncCoachNow({ manual: false }));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') syncCoachNow({ manual: false });
  });

  startAutomaticSync();
  renderPage();
  syncCoachNow({ manual: false });
})();

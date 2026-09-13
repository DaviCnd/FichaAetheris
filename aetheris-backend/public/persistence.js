"use strict";
let currentSheetVersion = null,
  accountName = "",
  editRevision = 0,
  transitioning = false,
  masterBackup = null;
async function api(path, options = {}) {
  const controller = new AbortController(),
    timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(path, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      }),
      data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const error = new Error(data.error || "Erro na requisição");
      error.status = res.status;
      throw error;
    }
    return data;
  } finally {
    clearTimeout(timer);
  }
}
function setAuthStatus(msg, error = false) {
  $("auth-status").textContent = msg;
  $("auth-status").className = `status-msg ${error ? "error" : ""}`;
}
function setStatus(msg, error = false) {
  $("save-status").textContent = msg;
  $("save-status").className =
    `status-msg toolbar-status ${error ? "error" : "success"}`;
}
function draftKey() {
  return `aetheris-draft:${accountName}`;
}
function backupDraft() {
  if (!accountName || masterViewing) return;
  try {
    localStorage.setItem(
      draftKey(),
      JSON.stringify({
        id: currentSheetId,
        version: currentSheetVersion,
        data: buildSheetData(),
      }),
    );
  } catch {
    setStatus(
      "Não foi possível guardar a cópia local. Use Exportar antes de fechar.",
      true,
    );
  }
}
function clearDraft() {
  if (accountName)
    try {
      localStorage.removeItem(draftKey());
    } catch {}
}
// Replace the initial scheduler; all event handlers resolve this binding at call time.
scheduleAutoSave = function () {
  if (!canAutoSave() || transitioning) return;
  editRevision++;
  autoSaveDirty = true;
  backupDraft();
  if (autoSaveTimer) clearTimeout(autoSaveTimer);
  setStatus(
    currentSheetName()
      ? "Alterações detectadas… salvando automaticamente."
      : "Informe um nome para salvar. Cópia local guardada.",
  );
  autoSaveTimer = setTimeout(() => {
    autoSaveTimer = null;
    autoSaveCurrentSheet();
  }, AUTOSAVE_DELAY);
};
async function persistCurrentSheet({ automatic = false, refresh = true } = {}) {
  if (masterViewing || !canAutoSave()) return false;
  const name = currentSheetName();
  if (!name) {
    setStatus("Informe o nome do personagem antes de salvar.", true);
    return false;
  }
  if (autoSaveInFlight) {
    autoSaveQueued = true;
    return false;
  }
  const revision = editRevision,
    id = currentSheetId,
    version = currentSheetVersion;
  const data = buildSheetData();
  try {
    window.AETHERIS_SCHEMA.validate(data);
  } catch (e) {
    setStatus(e.message, true);
    return false;
  }
  autoSaveInFlight = true;
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = null;
  }
  try {
    const result = await api(id ? `/api/sheets/${id}` : "/api/sheets", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify({ name, data, version }),
    });
    currentSheetId = id || result.id;
    currentSheetVersion = result.version;
    autoSaveDirty = revision !== editRevision;
    if (!autoSaveDirty) clearDraft();
    else backupDraft();
    if (refresh || !id) await refreshSheetDropdown(currentSheetId);
    renderCharacterSummary();
    setStatus(
      automatic ? "Ficha salva automaticamente." : `Ficha “${name}” salva.`,
    );
    return true;
  } catch (e) {
    autoSaveDirty = true;
    backupDraft();
    setStatus(`Não foi possível salvar: ${e.message}`, true);
    return false;
  } finally {
    autoSaveInFlight = false;
    autoSaveQueued = false;
    if (autoSaveDirty && editRevision !== revision && !transitioning) {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
      autoSaveTimer = setTimeout(autoSaveCurrentSheet, AUTOSAVE_DELAY);
    }
  }
}
async function autoSaveCurrentSheet() {
  if (!canAutoSave() || !autoSaveDirty || transitioning) return false;
  return persistCurrentSheet({ automatic: true, refresh: false });
}
async function saveCurrentSheet() {
  if (transitioning) return false;
  await waitForAutoSave();
  autoSaveDirty = true;
  backupDraft();
  return persistCurrentSheet({ refresh: true });
}
async function flushChanges() {
  await waitForAutoSave();
  if (!autoSaveDirty) return true;
  const ok = await persistCurrentSheet({ automatic: true, refresh: false });
  if (!ok) return false;
  await waitForAutoSave();
  if (autoSaveDirty) return flushChanges();
  return true;
}
async function transition(action, { flush = true } = {}) {
  if (transitioning) return false;
  transitioning = true;
  setFormDisabled(true);
  try {
    await waitForAutoSave();
    if (flush && !(await flushChanges())) {
      setStatus(
        "As alterações continuam abertas. Salve ou exporte antes de trocar de ficha.",
        true,
      );
      return false;
    }
    await action();
    return true;
  } catch (e) {
    setStatus(e.message, true);
    return false;
  } finally {
    transitioning = false;
    setFormDisabled(masterViewing);
    if (!masterViewing) renderAll();
  }
}
function resetEditor() {
  cancelAutoSave();
  currentSheetId = null;
  currentSheetVersion = null;
  masterViewing = false;
  masterBackup = null;
  $("master-panel").classList.add("hidden");
  $("master-view-banner").classList.add("hidden");
  $("save-name").value = "";
  applySheetData({ schemaVersion: 4, fields: {}, state: defaultState() });
}
async function checkSession() {
  try {
    const me = await api("/api/me");
    await showApp(me.username, me.isAdmin);
  } catch {
    $("auth-overlay").classList.remove("hidden");
    $("app-content").classList.add("hidden");
  }
}
async function showApp(username, isAdmin) {
  accountName = username;
  window.AetherisAppearance.setAccount(username);
  resetEditor();
  $("auth-password").value = "";
  $("auth-overlay").classList.add("hidden");
  $("app-content").classList.remove("hidden");
  $("whoami").textContent = username;
  $("master-toggle-btn").classList.toggle("hidden", !isAdmin);
  setStatus("Salvamento automático ativo.");
  let draft;
  try {
    draft = JSON.parse(localStorage.getItem(draftKey()) || "null");
  } catch {}
  if (
    draft &&
    confirm(
      "Há uma ficha com alterações não enviadas nesta conta. Recuperar a cópia local?",
    )
  ) {
    try {
      applySheetData(draft.data);
      currentSheetId = draft.id;
      currentSheetVersion = draft.version;
      autoSaveDirty = true;
      renderCharacterSummary();
      setStatus("Cópia local recuperada. Confira e clique em Salvar agora.");
      await refreshSheetDropdown(currentSheetId);
      return;
    } catch (e) {
      setStatus(`Não foi possível recuperar: ${e.message}`, true);
    }
  }
  await refreshSheetDropdown(null, true);
}
async function doLogin() {
  setAuthStatus("");
  try {
    const r = await api("/api/login", {
      method: "POST",
      body: JSON.stringify({
        username: $("auth-username").value.trim(),
        password: $("auth-password").value,
      }),
    });
    await showApp(r.username, r.isAdmin);
  } catch (e) {
    setAuthStatus(e.message, true);
  }
}
async function doRegister() {
  setAuthStatus("");
  try {
    const r = await api("/api/register", {
      method: "POST",
      body: JSON.stringify({
        username: $("auth-username").value.trim(),
        password: $("auth-password").value,
      }),
    });
    await showApp(r.username, r.isAdmin);
  } catch (e) {
    setAuthStatus(e.message, true);
  }
}
async function doLogout() {
  await transition(async () => {
    await api("/api/logout", { method: "POST" });
    clearDraft();
    resetEditor();
    sheetRows = [];
    $("character-cards").replaceChildren();
    $("sheet-select").replaceChildren();
    $("master-body").replaceChildren();
    closeLibrary();
    $("app-content").classList.add("hidden");
    $("auth-overlay").classList.remove("hidden");
    accountName = "";
    window.AetherisAppearance.setAccount("");
  });
}
async function refreshSheetDropdown(selectId, openAfter = false) {
  try {
    sheetRows = await api("/api/sheets");
    $("sheet-select").replaceChildren();
    if (!sheetRows.length)
      $("sheet-select").add(new Option("— nenhuma salva —", ""));
    sheetRows.forEach((r) =>
      $("sheet-select").add(new Option(r.name, String(r.id))),
    );
    if (selectId) $("sheet-select").value = selectId;
    renderCharacterCards();
    if (openAfter) $("character-library").classList.remove("hidden");
  } catch (e) {
    setStatus(`Não foi possível atualizar a biblioteca: ${e.message}`, true);
  }
}
function renderCharacterCards() {
  $("character-cards").innerHTML =
    sheetRows
      .map((r) => {
        const s = r.summary || {},
          avatar = window.AETHERIS_SCHEMA.safeAvatar(s.avatar);
        return `<article class="character-card" data-open-sheet="${Number(r.id)}"><div class="character-card-avatar">${avatar ? `<img src="${esc(avatar)}" alt="Retrato">` : "✦"}</div><div><strong>${esc(r.name)}</strong><small>${esc(D.races[s.race]?.label || s.race || "Raça não definida")} · ${esc(s.profession || "Sem profissão")} · Nível ${esc(s.level || 1)}</small><small>${esc(s.region || "Origem não definida")}</small><div class="card-actions"><button class="btn btn-small" data-card-load="${Number(r.id)}">Abrir</button><button class="btn btn-small btn-danger" data-card-delete="${Number(r.id)}">Excluir</button></div></div></article>`;
      })
      .join("") || '<div class="section-note">Nenhuma ficha salva ainda.</div>';
  qsa("[data-card-load]").forEach((b) =>
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      loadSheetById(b.dataset.cardLoad);
    }),
  );
  qsa("[data-open-sheet]").forEach((c) =>
    c.addEventListener("click", () => loadSheetById(c.dataset.openSheet)),
  );
  qsa("[data-card-delete]").forEach((b) =>
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteSheet(b.dataset.cardDelete);
    }),
  );
}
async function loadSheetById(id) {
  if (masterViewing) return;
  await transition(async () => {
    const r = await api(`/api/sheets/${id}`);
    applySheetData(r.data);
    cancelAutoSave();
    currentSheetId = r.id;
    currentSheetVersion = r.version;
    $("save-name").value = r.name;
    $("sheet-select").value = r.id;
    closeLibrary();
    switchTab("sheet");
    setStatus(`Ficha “${r.name}” carregada.`);
  });
}
async function loadSelectedSheet() {
  if ($("sheet-select").value) return loadSheetById($("sheet-select").value);
  setStatus("Selecione uma ficha.", true);
}
async function deleteSelectedSheet() {
  return deleteSheet($("sheet-select").value);
}
async function deleteSheet(id) {
  if (masterViewing || !id || !confirm("Excluir esta ficha permanentemente?"))
    return;
  await transition(
    async () => {
      await api(`/api/sheets/${id}`, { method: "DELETE" });
      if (String(currentSheetId) === String(id)) {
        clearDraft();
        resetEditor();
      }
      await refreshSheetDropdown(currentSheetId);
      setStatus("Ficha excluída.");
    },
    { flush: String(id) !== String(currentSheetId) },
  );
}
async function newSheet() {
  if (masterViewing) return;
  await transition(async () => {
    resetEditor();
    closeLibrary();
    switchTab("sheet");
    setStatus("Nova ficha. Informe um nome para salvar automaticamente.");
  });
}
function exportSheet() {
  const blob = new Blob([JSON.stringify(buildSheetData(), null, 2)], {
      type: "application/json",
    }),
    url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = `aetheris_${($("f-nome").value || "ficha").replace(/[^a-z0-9]+/gi, "_")}_v4.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  setStatus("Ficha exportada.");
}
async function importSheet(e) {
  const file = e.target.files?.[0];
  e.target.value = "";
  if (!file || masterViewing) return;
  if (file.size > 5 * 1024 * 1024) {
    setStatus("Arquivo muito grande (máximo 5 MB).", true);
    return;
  }
  try {
    const raw = JSON.parse(await file.text());
    window.AETHERIS_SCHEMA.validate(raw);
    const changed = await transition(async () => {
      applySheetData(raw);
      cancelAutoSave();
      currentSheetId = null;
      currentSheetVersion = null;
      $("save-name").value = $("f-nome").value;
      setStatus("Ficha importada.");
    });
    if (changed) scheduleAutoSave();
  } catch (e) {
    setStatus(`Arquivo inválido: ${e.message}`, true);
  }
}
async function toggleMasterPanel() {
  if (transitioning) return;
  const open = $("master-panel").classList.contains("hidden");
  $("master-panel").classList.toggle("hidden", !open);
  if (open) await loadMasterList();
}
async function loadMasterList() {
  try {
    const rows = await api("/api/admin/sheets");
    $("master-body").innerHTML =
      rows
        .map(
          (r) =>
            `<tr><td>${esc(r.username)}</td><td>${esc(r.name)}</td><td>${esc(r.updated_at)}</td><td><button class="btn btn-small" data-master-view="${Number(r.id)}">Ver</button></td></tr>`,
        )
        .join("") || '<tr><td colspan="4">Nenhuma ficha.</td></tr>';
    qsa("[data-master-view]").forEach((b) =>
      b.addEventListener("click", () => viewPlayerSheet(b.dataset.masterView)),
    );
  } catch (e) {
    $("master-body").textContent = e.message;
  }
}
async function viewPlayerSheet(id) {
  await transition(async () => {
    const r = await api(`/api/admin/sheets/${id}`);
    const backup = masterViewing
      ? masterBackup
      : {
          data: buildSheetData(),
          id: currentSheetId,
          version: currentSheetVersion,
        };
    applySheetData(r.data);
    masterBackup = backup;
    masterViewing = true;
    cancelAutoSave();
    $("master-view-who").textContent = `${r.username} — “${r.name}”`;
    $("master-view-banner").classList.remove("hidden");
    $("master-view-banner").scrollIntoView({ behavior: "smooth" });
  });
}
function exitMasterView() {
  if (transitioning) return;
  const b = masterBackup;
  masterViewing = false;
  masterBackup = null;
  cancelAutoSave();
  if (b) {
    applySheetData(b.data);
    currentSheetId = b.id;
    currentSheetVersion = b.version;
  } else resetEditor();
  $("master-view-banner").classList.add("hidden");
  setFormDisabled(false);
  renderAll();
}
function setFormDisabled(disabled) {
  qsa(
    "#app-content input,#app-content select,#app-content textarea,#app-content button",
  ).forEach((el) => {
    if (
      el.closest("#master-panel,#master-view-banner,.book-tabs") ||
      el.id === "logout-btn" ||
      el.id === "master-toggle-btn" ||
      el.id === "export-btn" ||
      el.id === "print-btn" ||
      el.hasAttribute("data-open-book") ||
      el.hasAttribute("data-theme-toggle") ||
      el.hasAttribute("data-appearance-open")
    )
      return;
    el.disabled = disabled;
  });
}
window.addEventListener("beforeunload", (e) => {
  if (autoSaveDirty || autoSaveInFlight) {
    backupDraft();
    e.preventDefault();
    e.returnValue = "";
  }
});
function initPersistence() {
  $("discard-changes").addEventListener("click", async () => {
    if (
      !confirm(
        "Descartar as alterações locais? Exporte antes se quiser guardá-las.",
      )
    )
      return;
    await waitForAutoSave();
    clearDraft();
    cancelAutoSave();
    if (currentSheetId) await loadSheetById(currentSheetId);
    else await newSheet();
  });
}

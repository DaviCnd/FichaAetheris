"use strict";

const D = window.AETHERIS_DATA;
const $ = (id) => document.getElementById(id);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const esc = (v = "") =>
  String(v).replace(
    /[&<>'"]/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        c
      ],
  );
const ALL_SKILLS = D.skills.flatMap((g) =>
  g.items.map((name) => ({ name, attr: g.attr, group: g.group })),
);
const SKILL_ATTR = Object.fromEntries(ALL_SKILLS.map((s) => [s.name, s.attr]));
const REGIONAL_PROFESSION_MAP = {};
Object.entries(D.regionalProfessions || {}).forEach(([region, items]) =>
  items.forEach(
    (item) => (REGIONAL_PROFESSION_MAP[item.name] = { ...item, region }),
  ),
);

function officialProfessionFromLegacy(name) {
  if (Object.hasOwn(D.professions, name)) return name;
  const regional = REGIONAL_PROFESSION_MAP[name];
  return regional?.base && D.professions[regional.base] ? regional.base : "";
}
function resolveProfession(name) {
  const official = officialProfessionFromLegacy(name);
  return official
    ? {
        ...D.professions[official],
        name: official,
        base: official,
        region: "Geral",
      }
    : null;
}
function updateProfessionOptions() {
  const general = Object.keys(D.professions);
  $("f-profissao").innerHTML =
    '<option value="">— Selecione —</option>' +
    general
      .map((name) => `<option value="${esc(name)}">${esc(name)}</option>`)
      .join("");
  if (state.profession && !D.professions[state.profession])
    state.profession = officialProfessionFromLegacy(state.profession);
  $("f-profissao").value = state.profession || "";
}
function defaultState() {
  const training = {};
  ALL_SKILLS.forEach((s) => (training[s.name] = 0));
  return {
    schemaVersion: 4,
    creationMode: true,
    context: {},
    warriorStance: "ofensiva",
    resurrections: 0,
    pauseUsed: false,
    exhaustionSources: 1,
    masteryPurchases: 1,
    level: 1,
    attrs: { forca: 1, destreza: 1, intelecto: 1, vontade: 1, fe: 1 },
    race: "",
    avarisLineage: "alada",
    profession: "",
    path: "",
    training,
    talents: [],
    criticalChoice: "fisico",
    armorTrainingChoice: "",
    specialistSkills: ["", ""],
    capstone: "",
    masterArcanePowerId: "",
    pvLoss: 0,
    peSpent: 0,
    soulLoss: 0,
    patron: "",
    favor: 2,
    learnedBlessings: [],
    corruption: 0,
    corruptionManifestation: "",
    corruptionPenalty: "",
    corruptionBlessingMode: "cost",
    pactType: "",
    powers: [],
    armor: "Sem armadura",
    shield: false,
    weapon: "Desarmado",
    slotsUsed: 0,
    consumables: [],
    conditions: [],
    deathSuccess: 0,
    deathFail: 0,
    reputation: [],
    avatarData: "",
  };
}
let state = defaultState(),
  currentSheetId = null,
  masterViewing = false,
  migrationNotice = "",
  sheetRows = [];
const AUTOSAVE_DELAY = 900;
let autoSaveTimer = null,
  autoSaveDirty = false,
  autoSaveInFlight = false,
  autoSaveQueued = false;
function currentSheetName() {
  return $("f-nome").value.trim() || $("save-name").value.trim();
}
function cancelAutoSave() {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = null;
  }
  autoSaveDirty = false;
  autoSaveQueued = false;
}
async function waitForAutoSave() {
  while (autoSaveInFlight)
    await new Promise((resolve) => setTimeout(resolve, 25));
}
function canAutoSave() {
  return (
    !masterViewing &&
    !$("app-content").classList.contains("hidden") &&
    $("auth-overlay").classList.contains("hidden")
  );
}
function scheduleAutoSave() {
  if (!canAutoSave()) return;
  autoSaveDirty = true;
  if (autoSaveTimer) clearTimeout(autoSaveTimer);
  if (currentSheetName())
    setStatus("Alterações detectadas… salvando automaticamente.");
  autoSaveTimer = setTimeout(() => {
    autoSaveTimer = null;
    autoSaveCurrentSheet();
  }, AUTOSAVE_DELAY);
}
function isAutoSaveField(el) {
  return Boolean(
    el &&
      el.closest &&
      el.closest("#app-content") &&
      !el.closest(
        "#master-panel,#master-view-banner,#character-library,#save-panel,.toolbar-actions",
      ) &&
      !el.matches("#sheet-select,#import-file,#avatar-file"),
  );
}
function isAutoSaveButton(el) {
  return Boolean(
    el &&
      el.closest &&
      el.closest(
        ".stepper,[data-adjust],[data-counter],[data-death],[data-remove-power],[data-power-add],[data-power-remove-row],[data-remove-rep],#level-up-btn,#level-down-btn,#add-power-btn,#add-reputation-btn,#pause-rest,#short-rest,#long-rest,#avatar-remove-btn",
      ),
  );
}

const LEVEL_GAINS = {
  1: "Raça, Profissão, Caminho, 8 pontos de Treino e escolhas iniciais.",
  2: "+3 PV, +2 PE e 1 Talento.",
  3: "+3 PV, +2 PE; acesso a poder Intermediário ou nova bênção.",
  4: "+3 PV, +2 PE, +2 pontos de Treino; primeira Maestria possível.",
  5: "+3 PV, +2 PE, +1 Atributo e 1 Talento.",
  6: "+3 PV, +2 PE; acesso a poder Avançado e melhoria de Profissão.",
  7: "+3 PV, +2 PE; nova bênção, pacto ou poder e +1 Favor máximo.",
  8: "+3 PV, +2 PE, +2 pontos de Treino; segunda Maestria possível.",
  9: "+3 PV, +2 PE; acesso a poder Supremo e 1 Talento.",
  10: "+3 PV, +2 PE, +1 Atributo e uma Capstone.",
};

function fillSelect(
  el,
  values,
  placeholder = "— Selecione —",
  mapper = (v) => ({ value: v, label: v }),
) {
  el.innerHTML =
    `<option value="">${esc(placeholder)}</option>` +
    values
      .map((v) => {
        const m = mapper(v);
        return `<option value="${esc(m.value)}">${esc(m.label)}</option>`;
      })
      .join("");
}
function cssId(s) {
  return String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
function toggleArray(arr, value, checked) {
  const i = arr.indexOf(value);
  if (checked && i < 0) arr.push(value);
  if (!checked && i >= 0) arr.splice(i, 1);
}
function showBox(id, text, show) {
  const el = $(id);
  el.textContent = text;
  el.classList.toggle("hidden", !show);
}
function statBonus(source, key) {
  return source?.statBonus?.[key] || 0;
}
function profession() {
  return resolveProfession(state.profession);
}
function race() {
  return Object.hasOwn(D.races, state.race) ? D.races[state.race] : null;
}
function armor() {
  return D.armors.find((a) => a.name === state.armor) || D.armors[0];
}
function weapon() {
  return D.weapons.find((w) => w.name === state.weapon) || D.weapons[0];
}
function hasTalent(id) {
  return state.talents.includes(id);
}
function talentCalc(key) {
  return D.talents
    .filter((t) => hasTalent(t.id))
    .reduce((sum, t) => sum + (t.calc?.[key] || 0), 0);
}
function attrPool() {
  return 12 + (state.level >= 5 ? 1 : 0) + (state.level >= 10 ? 1 : 0);
}
function attrCap() {
  return state.level >= 10 ? 6 : state.level >= 5 ? 5 : 4;
}
function attrSpent() {
  return D.attributes.reduce((s, a) => s + (state.attrs[a] || 0), 0);
}
function talentSlots() {
  return (
    [2, 5, 9].filter((l) => state.level >= l).length +
    (state.path === "Livre" ? 1 : 0)
  );
}
function masterySlots() {
  return hasTalent("maestria")
    ? Math.min(
        state.masteryPurchases || 1,
        (state.level >= 4 ? 1 : 0) + (state.level >= 8 ? 1 : 0),
      )
    : 0;
}
function trainingPool() {
  return (
    8 +
    (state.level >= 4 ? 2 : 0) +
    (state.level >= 8 ? 2 : 0) +
    (race()?.trainingBonus || 0)
  );
}
function trainingSpent() {
  return Object.values(state.training).reduce(
    (a, b) => a + (Number(b) || 0),
    0,
  );
}
function masteryUsed() {
  return Object.values(state.training).filter((v) => Number(v) >= 3).length;
}
function professionSkillBonus(name) {
  return profession()?.skillBonus?.[name] || 0;
}
function favorSkillBonus(name) {
  return name === "Rituais" &&
    state.patron &&
    state.favor >= 4 &&
    state.context.patronRitual
    ? 1
    : 0;
}
function raceSkillBonus(name) {
  return window.AETHERIS_RULES.racial(state, name);
}
function specialistBonus(name) {
  if (!hasTalent("especialista")) return 0;
  const chosen = (state.specialistSkills || []).filter(Boolean);
  return chosen.includes(name) && (state.training[name] || 0) < 2 ? 1 : 0;
}
function ritualistBonus(name) {
  return hasTalent("ritualista") && name === "Rituais" ? 1 : 0;
}
function armorTrainedForCurrent() {
  return (
    hasTalent("armadura_treinada") && state.armorTrainingChoice === state.armor
  );
}
function armorSkillModifier(name) {
  if (
    name === "Furtividade" &&
    state.armor === "Média" &&
    !armorTrainedForCurrent()
  )
    return -1;
  return 0;
}
function otherSkillBonus(name) {
  return (
    favorSkillBonus(name) +
    specialistBonus(name) +
    ritualistBonus(name) +
    armorSkillModifier(name) +
    window.AETHERIS_RULES.conditionPenalty(state)
  );
}
function effectiveTraining(name) {
  return (state.training[name] || 0) + specialistBonus(name);
}
function skillTotal(name) {
  let a = SKILL_ATTR[name];
  if (
    state.race === "veylans" &&
    state.context.coldAnalysis &&
    ["Intuição", "Concentração"].includes(name)
  )
    a = "intelecto";
  return (
    (state.attrs[a] || 0) +
    raceSkillBonus(name) +
    professionSkillBonus(name) +
    (state.training[name] || 0) +
    otherSkillBonus(name)
  );
}
function passiveSkill(name) {
  return (
    10 +
    skillTotal(name) +
    (name === "Percepção" ? talentCalc("passivePerception") : 0)
  );
}
function inventoryCapacity() {
  return 8 + (state.attrs.forca || 0) * 2;
}
function isEncumbered() {
  return state.slotsUsed > inventoryCapacity();
}
function pvMax() {
  return Math.max(
    1,
    12 +
      state.attrs.forca * 4 +
      state.level * 3 +
      statBonus(race(), "pv") +
      statBonus(profession(), "pv") +
      talentCalc("pv"),
  );
}
function peMax() {
  return Math.max(
    1,
    8 +
      state.attrs.vontade * 2 +
      state.attrs.fe * 3 +
      state.level * 2 +
      statBonus(race(), "pe") +
      statBonus(profession(), "pe") +
      talentCalc("pe"),
  );
}
function soulMax() {
  return Math.max(
    0,
    5 +
      state.attrs.vontade +
      state.attrs.fe +
      talentCalc("soul") -
      (state.resurrections || 0),
  );
}
function defense() {
  let v =
    10 +
    state.attrs.destreza * 2 +
    armor().defense +
    (state.shield ? 1 : 0) +
    statBonus(race(), "defesa");
  if (state.race === "feliri" && state.armor !== "Pesada") v++;
  return window.AETHERIS_RULES.defense(state, v);
}
function movement() {
  let armMove = armorTrainedForCurrent() ? 0 : armor().movement,
    v = 6 + armMove + talentCalc("movement");
  if (state.race === "avaris" && state.avarisLineage === "nao-alada") v += 2;
  if (isEncumbered()) v -= 2;
  return window.AETHERIS_RULES.movement(
    { ...state, _pvMax: pvMax() },
    Math.max(0, v),
  );
}
function corruptionResistance() {
  return state.attrs.vontade + statBonus(race(), "rescorr");
}
function favorMax() {
  return 5 + (state.level >= 7 ? 1 : 0) + talentCalc("favorMax");
}
function currentPV() {
  return clamp(pvMax() - state.pvLoss, 0, pvMax());
}
function currentPE() {
  return clamp(peMax() - state.peSpent, 0, peMax());
}
function currentSoul() {
  return clamp(soulMax() - state.soulLoss, 0, soulMax());
}

function initStatic() {
  fillSelect($("f-regiao"), D.regions);
  fillSelect($("f-raca"), Object.keys(D.races), "— Selecione —", (k) => ({
    value: k,
    label: D.races[k].label,
  }));
  updateProfessionOptions();
  fillSelect($("f-caminho"), Object.keys(D.paths));
  fillSelect($("f-patrono"), Object.keys(D.blessings), "— Sem patrono —");
  fillSelect($("f-capstone"), D.capstones, "— Nenhuma —", (c) => ({
    value: c.id,
    label: c.name,
  }));
  fillSelect($("f-armadura"), D.armors, "", (a) => ({
    value: a.name,
    label: `${a.name} (+${a.defense} Defesa)`,
  }));
  fillSelect($("f-arma"), D.weapons, "", (w) => ({
    value: w.name,
    label: `${w.name} — ${w.damage}`,
  }));
  buildAttrGrid();
  buildSkillsTable();
  buildTalents();
  buildConditions();
  buildConsumables();
  buildDeathTracks();
  bindEvents();
  initContext();
  renderAll();
  checkSession();
}
function buildAttrGrid() {
  $("attr-grid").innerHTML = D.attributes
    .map(
      (a) =>
        `<div class="attr-card"><div class="name">${esc(D.attributeLabels[a])}</div><div class="row"><button class="stepper no-print" data-attr="${a}" data-dir="-1" aria-label="Diminuir ${esc(D.attributeLabels[a])}">−</button><span class="value" id="attr-${a}">1</span><button class="stepper no-print" data-attr="${a}" data-dir="1" aria-label="Aumentar ${esc(D.attributeLabels[a])}">+</button></div></div>`,
    )
    .join("");
}
function buildSkillsTable() {
  let html = "";
  D.skills.forEach((group) => {
    html += `<tr class="group-row"><td colspan="8">${esc(group.group)}</td></tr>`;
    group.items.forEach((name) => {
      const id = cssId(name);
      html += `<tr><td>${esc(name)}</td><td class="center" id="sk-attr-${id}">0</td><td class="center" id="sk-race-${id}">+0</td><td class="center" id="sk-prof-${id}">+0</td><td class="center" id="sk-other-${id}">+0</td><td><div class="train-controls"><button class="stepper no-print" data-skill="${esc(name)}" data-dir="-1" aria-label="Diminuir treino em ${esc(name)}">−</button><span id="sk-train-${id}">0</span><button class="stepper no-print" data-skill="${esc(name)}" data-dir="1" aria-label="Aumentar treino em ${esc(name)}">+</button></div></td><td class="center"><span class="total-pill" id="sk-total-${id}">0</span></td><td class="center" id="sk-passive-${id}">10</td></tr>`;
    });
  });
  $("skills-body").innerHTML = html;
}
function buildTalents() {
  $("talents-grid").innerHTML = D.talents
    .map(
      (t) =>
        `<label class="check-card" id="talent-card-${t.id}"><input type="checkbox" data-talent="${t.id}"><span><span class="name">${esc(t.name)}</span><span class="desc">${esc(t.effect)}</span></span></label>`,
    )
    .join("");
}
function buildConditions() {
  $("conditions-grid").innerHTML = D.conditions
    .map(
      (c) =>
        `<label class="check-card"><input type="checkbox" data-condition="${c.id}"><span><span class="name">${esc(c.name)}</span><span class="desc">${esc(c.effect)}</span></span></label>`,
    )
    .join("");
}
function buildConsumables() {
  $("consumables-grid").innerHTML = D.consumables
    .map(
      (c) =>
        `<label class="check-card"><input type="checkbox" data-consumable="${esc(c.name)}"><span><span class="name">${esc(c.name)}</span><span class="desc">${esc(c.effect)}</span></span></label>`,
    )
    .join("");
}
function buildDeathTracks() {
  $("death-success").innerHTML = [1, 2, 3]
    .map(
      (i) =>
        `<button class="death-dot success no-print" data-death="success" data-value="${i}" aria-label="Marcar ${i} sucesso(s) de Caminho"></button>`,
    )
    .join("");
  $("death-fail").innerHTML = [1, 2, 3]
    .map(
      (i) =>
        `<button class="death-dot fail no-print" data-death="fail" data-value="${i}" aria-label="Marcar ${i} falha(s) de Caminho"></button>`,
    )
    .join("");
}

function autoResizeTextarea(el) {
  if (!el || !el.matches?.("textarea.auto-grow")) return;
  el.style.height = "auto";
  el.style.height = `${Math.max(39, el.scrollHeight)}px`;
}
function resizeAllAutoGrow() {
  qsa("textarea.auto-grow").forEach(autoResizeTextarea);
}

function bindEvents() {
  const fileMenu = document.querySelector(".file-menu");
  document.addEventListener("click", (event) => {
    if (
      !fileMenu.contains(event.target) ||
      event.target.closest(".file-menu-items button")
    )
      fileMenu.open = false;
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && fileMenu.open) {
      fileMenu.open = false;
      fileMenu.querySelector("summary").focus();
    }
  });
  $("login-btn").addEventListener("click", doLogin);
  $("register-btn").addEventListener("click", doRegister);
  $("logout-btn").addEventListener("click", doLogout);
  $("auth-password").addEventListener("keydown", (e) => {
    if (e.key === "Enter") doLogin();
  });
  qsa("textarea.auto-grow").forEach((el) => {
    autoResizeTextarea(el);
    el.addEventListener("input", () => autoResizeTextarea(el));
  });
  $("master-toggle-btn").addEventListener("click", toggleMasterPanel);
  $("exit-master-btn").addEventListener("click", exitMasterView);
  $("save-btn").addEventListener("click", saveCurrentSheet);
  $("load-btn").addEventListener("click", loadSelectedSheet);
  $("delete-btn").addEventListener("click", deleteSelectedSheet);
  $("new-btn").addEventListener("click", newSheet);
  $("library-btn").addEventListener("click", () => openLibrary());
  $("library-close-btn").addEventListener("click", closeLibrary);
  $("library-new-btn").addEventListener("click", () => {
    closeLibrary();
    newSheet();
  });
  qsa("[data-close-library]").forEach((x) =>
    x.addEventListener("click", closeLibrary),
  );
  qsa("[data-tab]").forEach((b) =>
    b.addEventListener("click", () => switchTab(b.dataset.tab)),
  );
  $("export-btn").addEventListener("click", exportSheet);
  $("import-btn").addEventListener("click", () => $("import-file").click());
  $("import-file").addEventListener("change", importSheet);
  $("avatar-upload-btn").addEventListener("click", () =>
    $("avatar-file").click(),
  );
  $("avatar-file").addEventListener("change", handleAvatarUpload);
  $("avatar-remove-btn").addEventListener("click", () => {
    state.avatarData = "";
    renderAvatar();
  });
  $("level-up-btn").addEventListener("click", () => {
    state.level = clamp(state.level + 1, 1, 10);
    renderAll();
  });
  $("level-down-btn").addEventListener("click", () => {
    state.level = clamp(state.level - 1, 1, 10);
    renderAll();
  });
  $("f-regiao").addEventListener("change", () => renderAll());
  $("f-raca").addEventListener("change", (e) => {
    state.race = e.target.value;
    renderAll();
  });
  $("f-avaris-lineage").addEventListener("change", (e) => {
    state.avarisLineage = e.target.value;
    renderAll();
  });
  $("f-profissao").addEventListener("change", (e) => {
    state.profession = e.target.value;
    renderAll();
  });
  $("f-caminho").addEventListener("change", (e) => {
    const old = state.path;
    state.path = e.target.value;
    if (
      state.path === "Pactuário" &&
      old !== state.path &&
      state.corruption === 0
    )
      state.corruption = 1;
    renderAll();
  });
  $("f-capstone").addEventListener("change", (e) => {
    state.capstone = e.target.value;
    renderAll();
  });
  $("f-patrono").addEventListener("change", (e) => {
    state.patron = e.target.value;
    state.learnedBlessings = state.learnedBlessings.filter((n) =>
      (D.blessings[state.patron]?.skills || []).some((s) => s.nome === n),
    );
    renderAll();
  });
  $("f-favor").addEventListener("input", (e) => {
    state.favor = Number(e.target.value);
    renderAll();
  });
  $("f-corruption-blessing-mode").addEventListener("change", (e) => {
    state.corruptionBlessingMode = e.target.value;
    renderBlessings();
  });
  $("f-pact-type").addEventListener("change", (e) => {
    state.pactType = e.target.value;
    renderValidation();
  });
  $("f-armadura").addEventListener("change", (e) => {
    state.armor = e.target.value;
    renderAll();
  });
  $("f-escudo").addEventListener("change", (e) => {
    state.shield = e.target.value === "sim";
    renderAll();
  });
  $("f-arma").addEventListener("change", (e) => {
    state.weapon = e.target.value;
    renderAll();
  });
  $("f-slots-used").addEventListener("input", (e) => {
    state.slotsUsed = Math.max(0, Number(e.target.value) || 0);
    renderAll();
  });
  $("add-power-btn").addEventListener("click", () => {
    state.powers.push(newPower());
    renderPowers();
    renderValidation();
  });
  $("add-reputation-btn").addEventListener("click", () => {
    state.reputation.push({ name: "", value: 0 });
    renderReputation();
  });
  $("pause-rest").addEventListener("click", pauseRest);
  $("short-rest").addEventListener("click", shortRest);
  $("long-rest").addEventListener("click", longRest);
  [
    "f-nome",
    "f-regiao",
    "f-conceito",
    "f-objetivo",
    "f-vinculo",
    "p-marca",
  ].forEach((id) =>
    $(id).addEventListener("input", () => {
      renderCharacterSummary();
      renderValidation();
    }),
  );
  document.addEventListener("click", (e) => {
    const attr = e.target.dataset.attr;
    if (attr) {
      stepAttr(attr, Number(e.target.dataset.dir));
      return;
    }
    const skill = e.target.dataset.skill;
    if (skill) {
      stepTraining(skill, Number(e.target.dataset.dir));
      return;
    }
    if (e.target.dataset.adjust) {
      adjustCurrent(e.target.dataset.adjust, Number(e.target.dataset.dir));
      return;
    }
    if (e.target.dataset.counter === "corruption") {
      adjustCorruption(Number(e.target.dataset.dir));
      return;
    }
    if (e.target.dataset.death) {
      const key =
          e.target.dataset.death === "success" ? "deathSuccess" : "deathFail",
        val = Number(e.target.dataset.value);
      state[key] = state[key] === val ? 0 : val;
      renderDeathTracks();
      return;
    }
  });
  document.addEventListener("change", (e) => {
    if (e.target.dataset.talent) {
      toggleArray(state.talents, e.target.dataset.talent, e.target.checked);
      if (e.target.dataset.talent === "critico_aprimorado" && !e.target.checked)
        state.criticalChoice = "fisico";
      renderAll();
      return;
    }
    if (e.target.dataset.condition) {
      toggleArray(
        state.conditions,
        e.target.dataset.condition,
        e.target.checked,
      );
      renderConditions();
      return;
    }
    if (e.target.dataset.consumable) {
      toggleArray(
        state.consumables,
        e.target.dataset.consumable,
        e.target.checked,
      );
      renderConsumables();
      return;
    }
    if (e.target.dataset.blessing) {
      toggleArray(
        state.learnedBlessings,
        e.target.dataset.blessing,
        e.target.checked,
      );
      renderBlessings();
      renderValidation();
      return;
    }
  });
  ["f-corruption-manifestation", "f-corruption-penalty"].forEach((id) =>
    $(id).addEventListener("input", () => {
      state.corruptionManifestation = $("f-corruption-manifestation").value;
      state.corruptionPenalty = $("f-corruption-penalty").value;
    }),
  );
  document.addEventListener("input", (e) => {
    if (isAutoSaveField(e.target)) scheduleAutoSave();
  });
  document.addEventListener("change", (e) => {
    if (isAutoSaveField(e.target)) scheduleAutoSave();
  });
  document.addEventListener("click", (e) => {
    if (isAutoSaveButton(e.target)) setTimeout(scheduleAutoSave, 0);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && autoSaveDirty) autoSaveCurrentSheet();
  });
}
function switchTab(name) {
  const target = $(`tab-${name}`);
  if (!target) return;
  qsa("[data-tab]").forEach((b) => {
    const active = b.dataset.tab === name;
    b.classList.toggle("active", active);
    if (active) b.setAttribute("aria-current", "page");
    else b.removeAttribute("aria-current");
  });
  qsa(".tab-page").forEach((p) => p.classList.toggle("active", p === target));
  // Hidden textareas have no layout height. Recalculate after revealing their page.
  resizeAllAutoGrow();
  const heading = target.querySelector(".page-heading h2");
  heading?.focus({ preventScroll: true });
  const navHeight =
    window.innerWidth <= 1100
      ? document.querySelector(".book-tabs").getBoundingClientRect().height + 16
      : 24;
  window.scrollTo({
    top: Math.max(
      0,
      target.getBoundingClientRect().top + window.scrollY - navHeight,
    ),
    behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  });
}

function openLibrary() {
  refreshSheetDropdown(currentSheetId, true);
  $("character-library").classList.remove("hidden");
}
function closeLibrary() {
  $("character-library").classList.add("hidden");
}

function renderAll() {
  state.context = state.context || {};
  state.level = clamp(Number(state.level) || 1, 1, 10);
  state.attrs = { ...defaultState().attrs, ...state.attrs };
  state.training = { ...defaultState().training, ...state.training };
  state.specialistSkills = Array.isArray(state.specialistSkills)
    ? [state.specialistSkills[0] || "", state.specialistSkills[1] || ""]
    : ["", ""];
  state.pvLoss = clamp(Number(state.pvLoss) || 0, 0, pvMax());
  state.peSpent = clamp(Number(state.peSpent) || 0, 0, peMax());
  state.soulLoss = clamp(Number(state.soulLoss) || 0, 0, soulMax());
  state.favor = clamp(Number(state.favor) || 0, 0, favorMax());
  state.corruption = clamp(Number(state.corruption) || 0, 0, 10);
  updateProfessionOptions();
  $("f-raca").value = state.race;
  $("f-avaris-lineage").value = state.avarisLineage;
  $("f-profissao").value = state.profession;
  $("f-caminho").value = state.path;
  $("f-capstone").value = state.capstone;
  $("f-patrono").value = state.patron;
  $("f-favor").max = favorMax();
  $("f-favor").value = state.favor;
  $("f-armadura").value = state.armor;
  $("f-escudo").value = state.shield ? "sim" : "nao";
  $("f-arma").value = state.weapon;
  $("f-slots-used").value = state.slotsUsed;
  $("f-corruption-manifestation").value = state.corruptionManifestation || "";
  $("f-corruption-penalty").value = state.corruptionPenalty || "";
  $("f-corruption-blessing-mode").value =
    state.corruptionBlessingMode || "cost";
  $("f-pact-type").value = state.pactType || "";
  renderLevel();
  renderRaceProfessionPath();
  renderAttributes();
  renderSkills();
  renderTalents();
  renderStats();
  renderBlessings();
  renderCorruption();
  renderPowers();
  renderEquipment();
  renderConditions();
  renderDeathTracks();
  renderReputation();
  renderAvatar();
  renderCharacterSummary();
  renderValidation();
  renderContext();
  resizeAllAutoGrow();
}
function renderLevel() {
  $("level-badge").textContent = state.level;
  $("level-up-btn").disabled = state.level >= 10;
  $("level-down-btn").disabled = state.level <= 1;
  $("progression-strip").innerHTML = Array.from({ length: 10 }, (_, i) => {
    const n = i + 1;
    return `<div class="level-dot ${n <= state.level ? "active" : ""} ${n === state.level ? "current" : ""}" title="${esc(LEVEL_GAINS[n])}">${n}</div>`;
  }).join("");
  $("level-gain-info").innerHTML =
    `<strong>Nível ${state.level}:</strong> ${esc(LEVEL_GAINS[state.level])}`;
}
function renderRaceProfessionPath() {
  $("avaris-lineage-wrap").classList.toggle("hidden", state.race !== "avaris");
  const r = race();
  $("race-info").innerHTML = r
    ? `<strong>${esc(r.label)}</strong><br>${esc(r.summary)}<br>${r.traits.map((t) => `<span class="tag">${esc(t.name)}</span> ${esc(t.effect)}`).join("<br>")}`
    : "Selecione uma raça.";
  const p = profession();
  $("profession-info").innerHTML = p
    ? `<strong>${esc(p.name)}</strong><br>${esc(p.summary)}<br><span class="tag">Talento profissional</span> ${esc(p.talent)}<br><span class="tag">Equipamento inicial</span> ${esc(p.equipment)}`
    : "Selecione uma das profissões oficiais do Grimório.";
  const path = D.paths[state.path];
  $("path-info").innerHTML = path
    ? `<strong>${esc(state.path)}</strong><br>${esc(path.benefit)}<br><span class="tag tag-red">Limitação</span> ${esc(path.limit)}`
    : "Selecione um Caminho espiritual.";
}
function renderAttributes() {
  D.attributes.forEach((a) => {
    $(`attr-${a}`).textContent = state.attrs[a];
    qsa(`[data-attr="${a}"]`).forEach((b) => {
      const dir = Number(b.dataset.dir);
      b.disabled =
        dir < 0
          ? state.attrs[a] <= 1
          : state.attrs[a] >= attrCap() || attrSpent() >= attrPool();
    });
  });
  $("attr-spent").textContent = attrSpent();
  $("attr-pool").textContent = attrPool();
  $("attr-cap").textContent = attrCap();
  const warnings = [];
  if (attrSpent() !== attrPool())
    warnings.push(
      `Distribua exatamente ${attrPool()} pontos; diferença de ${Math.abs(attrPool() - attrSpent())}.`,
    );
  if (
    D.attributes.some((a) => state.attrs[a] < 1 || state.attrs[a] > attrCap())
  )
    warnings.push("Há atributo fora do limite atual.");
  showBox("attr-warning", warnings.join(" "), warnings.length > 0);
}
function stepAttr(a, dir) {
  const next = state.attrs[a] + dir;
  if (next < 1 || next > attrCap()) return;
  if (dir > 0 && attrSpent() >= attrPool()) return;
  state.attrs[a] = next;
  renderAll();
}
function renderSkills() {
  ALL_SKILLS.forEach((s) => {
    const id = cssId(s.name),
      ab = state.attrs[s.attr] || 0,
      rb = raceSkillBonus(s.name),
      pb = professionSkillBonus(s.name),
      ob = otherSkillBonus(s.name),
      tr = state.training[s.name] || 0,
      total = skillTotal(s.name);
    $(`sk-attr-${id}`).textContent = ab;
    $(`sk-race-${id}`).textContent = `${rb >= 0 ? "+" : ""}${rb}`;
    $(`sk-prof-${id}`).textContent = `${pb >= 0 ? "+" : ""}${pb}`;
    $(`sk-other-${id}`).textContent = `${ob >= 0 ? "+" : ""}${ob}`;
    $(`sk-train-${id}`).innerHTML =
      `${tr}${tr >= 3 ? '<span class="mastery-mark">M</span>' : ""}`;
    $(`sk-total-${id}`).textContent = total;
    $(`sk-passive-${id}`).textContent = passiveSkill(s.name);
    qsa(`[data-skill="${CSS.escape(s.name)}"]`).forEach((b) => {
      const d = Number(b.dataset.dir);
      b.disabled =
        d < 0
          ? tr <= 0
          : tr >= 3 ||
            trainingSpent() >= trainingPool() ||
            (tr === 2 && masteryUsed() >= masterySlots());
    });
  });
  $("train-spent").textContent = trainingSpent();
  $("train-pool").textContent = trainingPool();
  $("mastery-used").textContent = masteryUsed();
  $("mastery-slots").textContent = masterySlots();
  const warnings = [];
  if (trainingSpent() > trainingPool())
    warnings.push(
      `Treino excede o limite em ${trainingSpent() - trainingPool()} ponto(s).`,
    );
  if (masteryUsed() > masterySlots())
    warnings.push("Há mais perícias em Maestria do que permitido.");
  if (hasTalent("especialista")) {
    const sp = state.specialistSkills.filter(Boolean);
    if (sp.length !== 2 || sp[0] === sp[1])
      warnings.push("Especialista exige duas perícias diferentes.");
    if (sp.some((n) => (state.training[n] || 0) >= 2))
      warnings.push(
        "Especialista deve respeitar o limite de Treino; escolha perícias com Treino 0 ou 1.",
      );
  }
  showBox("training-warning", warnings.join(" "), warnings.length > 0);
}
function stepTraining(name, dir) {
  const cur = state.training[name] || 0,
    next = cur + dir;
  if (next < 0 || next > 3) return;
  if (dir > 0 && trainingSpent() >= trainingPool()) return;
  if (next === 3 && masteryUsed() >= masterySlots()) return;
  state.training[name] = next;
  renderAll();
}
function renderTalents() {
  qsa("[data-talent]").forEach((cb) => {
    cb.checked = hasTalent(cb.dataset.talent);
    cb.closest(".check-card").classList.toggle("active", cb.checked);
  });
  $("talent-count").textContent = talentCount();
  $("talent-slots").textContent = talentSlots();
  qsa("[data-talent]").forEach((cb) => {
    cb.disabled =
      masterViewing ||
      (!cb.checked &&
        (talentCount() >= talentSlots() ||
          (cb.dataset.talent === "maestria" && state.level < 4)));
  });
  $("f-capstone").disabled = state.level < 10;
  const cap = D.capstones.find((c) => c.id === state.capstone);
  $("capstone-info").innerHTML =
    state.level < 10
      ? "Capstones são liberadas no nível 10."
      : cap
        ? `<strong>${esc(cap.name)}</strong><br>${esc(cap.effect)}`
        : "Escolha uma Capstone.";
  renderTalentOptions();
}
function skillOptions(value) {
  return (
    '<option value="">— Selecione —</option>' +
    ALL_SKILLS.map(
      (s) =>
        `<option ${s.name === value ? "selected" : ""}>${esc(s.name)}</option>`,
    ).join("")
  );
}
function renderTalentOptions() {
  const rows = [];
  if (hasTalent("maestria"))
    rows.push(
      '<div class="field"><label>Aquisições de Maestria</label><select id="mastery-purchases"><option value="1">Uma escolha de talento</option><option value="2">Duas escolhas (nível 8+)</option></select><small>Cada aquisição melhora uma perícia. Confirme com o mestre quando adquirir o talento.</small></div>',
    );
  if (hasTalent("critico_aprimorado"))
    rows.push(
      `<div class="field"><label>Crítico Aprimorado</label><select id="talent-critical-choice"><option value="fisico" ${state.criticalChoice === "fisico" ? "selected" : ""}>Físico</option><option value="magico" ${state.criticalChoice === "magico" ? "selected" : ""}>Mágico</option></select></div>`,
    );
  if (hasTalent("armadura_treinada"))
    rows.push(
      `<div class="field"><label>Armadura Treinada — categoria</label><select id="talent-armor-choice"><option value="">— Selecione —</option>${D.armors
        .filter((a) => a.name !== "Sem armadura")
        .map(
          (a) =>
            `<option ${state.armorTrainingChoice === a.name ? "selected" : ""}>${esc(a.name)}</option>`,
        )
        .join("")}</select></div>`,
    );
  if (hasTalent("especialista")) {
    rows.push(
      `<div class="field"><label>Especialista — perícia 1</label><select id="specialist-skill-1">${skillOptions(state.specialistSkills[0])}</select></div>`,
    );
    rows.push(
      `<div class="field"><label>Especialista — perícia 2</label><select id="specialist-skill-2">${skillOptions(state.specialistSkills[1])}</select></div>`,
    );
  }
  if (state.level >= 10 && state.capstone === "mestre_arcano") {
    const advanced = state.powers.filter((p) => p.tier === "Avançado");
    rows.push(
      `<div class="field"><label>Mestre Arcano — poder Avançado</label><select id="master-arcane-power"><option value="">— Selecione —</option>${advanced.map((p) => `<option value="${esc(p.id)}" ${String(state.masterArcanePowerId) === String(p.id) ? "selected" : ""}>${esc(p.name || "Poder sem nome")}</option>`).join("")}</select></div>`,
    );
  }
  $("talent-options").innerHTML = rows.join("");
  if ($("mastery-purchases")) {
    $("mastery-purchases").value = state.masteryPurchases || 1;
    $("mastery-purchases").addEventListener("change", (e) => {
      state.masteryPurchases = Number(e.target.value);
      renderAll();
      scheduleAutoSave();
    });
  }
  $("talent-critical-choice")?.addEventListener("change", (e) => {
    state.criticalChoice = e.target.value;
    renderStats();
    scheduleAutoSave();
  });
  $("talent-armor-choice")?.addEventListener("change", (e) => {
    state.armorTrainingChoice = e.target.value;
    renderAll();
    scheduleAutoSave();
  });
  $("specialist-skill-1")?.addEventListener("change", (e) => {
    state.specialistSkills[0] = e.target.value;
    renderAll();
    scheduleAutoSave();
  });
  $("specialist-skill-2")?.addEventListener("change", (e) => {
    state.specialistSkills[1] = e.target.value;
    renderAll();
    scheduleAutoSave();
  });
  $("master-arcane-power")?.addEventListener("change", (e) => {
    state.masterArcanePowerId = e.target.value;
    renderPowers();
    scheduleAutoSave();
  });
}
function renderStats() {
  const phys =
      hasTalent("critico_aprimorado") && state.criticalChoice === "fisico",
    mag = hasTalent("critico_aprimorado") && state.criticalChoice === "magico";
  const heavyStealth =
    state.armor === "Pesada" && !armorTrainedForCurrent()
      ? " Desvantagem em Furtividade."
      : "";
  const stats = [
    [
      "Defesa",
      defense(),
      `10 + Destreza × 2 + armadura${state.shield ? " + escudo" : ""}.`,
    ],
    [
      "Movimento",
      `${movement()}m`,
      state.race === "avaris" && state.avarisLineage === "alada"
        ? state.armor === "Pesada"
          ? "Voo impedido por armadura pesada."
          : "Voo 6m; após o primeiro turno, 1 PE/turno."
        : `Base 6m, ajustado por raça, talento, armadura e carga.${heavyStealth}`,
    ],
    [
      "Resist. à Corrupção",
      corruptionResistance(),
      "Vontade + bônus de Raça + bônus espirituais.",
    ],
    [
      "Iniciativa",
      `+${skillTotal("Iniciativa")}`,
      "Total da perícia Iniciativa.",
    ],
    [
      "Percepção Passiva",
      passiveSkill("Percepção"),
      "10 + Total de Percepção.",
    ],
    [
      "Crítico Físico",
      phys ? "19–20" : "20",
      "Crítico Aprimorado escolhe físico ou mágico.",
    ],
    [
      "Crítico Mágico",
      mag ? "19–20" : "20",
      "Crítico Aprimorado escolhe físico ou mágico.",
    ],
    [
      "Capacidade",
      `${inventoryCapacity()} espaços`,
      isEncumbered()
        ? "Sobrecarregado: -2m e desvantagem em Atletismo/Acrobacia."
        : "Sem penalidade de carga.",
    ],
  ];
  $("stat-grid").innerHTML = stats
    .map(
      ([l, v, s]) =>
        `<div class="stat-card"><div class="label">${esc(l)}</div><div class="value">${esc(v)}</div><div class="sub">${esc(s)}</div></div>`,
    )
    .join("");
  const pv = pvMax(),
    pe = peMax(),
    so = soulMax(),
    cp = currentPV(),
    ce = currentPE(),
    cs = currentSoul();
  $("pv-max").textContent = pv;
  $("pv-current").textContent = cp;
  $("pv-bar").style.width = `${pv ? (cp / pv) * 100 : 0}%`;
  $("pe-max").textContent = pe;
  $("pe-current").textContent = ce;
  $("pe-bar").style.width = `${pe ? (ce / pe) * 100 : 0}%`;
  $("soul-max").textContent = so;
  $("soul-current").textContent = cs;
  $("soul-bar").style.width = `${so ? (cs / so) * 100 : 0}%`;
  $("quick-pv").textContent = `${cp} / ${pv}`;
  $("quick-pe").textContent = `${ce} / ${pe}`;
  $("quick-soul").textContent = `${cs} / ${so}`;
  $("quick-defense").textContent = defense();
}
function adjustCurrent(kind, dir) {
  const before = currentPV();
  if (kind === "pv") state.pvLoss = clamp(state.pvLoss - dir, 0, pvMax());
  if (kind === "pe") state.peSpent = clamp(state.peSpent - dir, 0, peMax());
  if (kind === "soul")
    state.soulLoss = clamp(state.soulLoss - dir, 0, soulMax());
  if (kind === "pv" && before === 0 && currentPV() > 0) {
    state.deathSuccess = 0;
    state.deathFail = 0;
  }
  renderStats();
  renderDeathTracks();
  renderContext();
}
function rollDie(sides) {
  return 1 + Math.floor(Math.random() * sides);
}
function pauseRest() {
  if (state.pauseUsed) {
    setStatus("A pausa já foi usada nesta cena.", true);
    return;
  }
  const recovered = Math.min(state.attrs.vontade, state.peSpent);
  state.peSpent -= recovered;
  state.pauseUsed = true;
  renderStats();
  renderContext();
  setStatus(
    `Pausa de 10 minutos: ${recovered} PE recuperado(s). Exige segurança mínima.`,
  );
}
function shortRest() {
  const pvRec = rollDie(6) + state.attrs.forca,
    peRec = Math.ceil(peMax() / 2);
  state.pvLoss = Math.max(0, state.pvLoss - pvRec);
  state.peSpent = Math.max(0, state.peSpent - peRec);
  setStatus(`Descanso curto: ${pvRec} PV e até ${peRec} PE recuperados.`);
  afterRecovery();
}
function longRest() {
  state.peSpent = 0;
  const safe = $("safe-shelter").checked;
  if (safe) state.pvLoss = 0;
  else state.pvLoss = Math.max(0, state.pvLoss - Math.ceil(pvMax() / 2));
  setStatus(
    `Descanso longo: PE restaurado e ${safe ? "todo PV" : "metade do PV máximo"} recuperado.`,
  );
  afterRecovery();
}
function afterRecovery() {
  if (currentPV() > 0) {
    state.deathSuccess = 0;
    state.deathFail = 0;
  }
  renderStats();
  renderDeathTracks();
  renderContext();
}
function favorState() {
  return [
    { n: 0, name: "Rompido", effect: "Não usa bênçãos." },
    { n: 1, name: "Distante", effect: "Bênçãos custam +1 PE." },
    { n: 2, name: "Reconhecido", effect: "Funcionamento normal." },
    {
      n: 3,
      name: "Consagrado",
      effect: "Uma vez por cena, reduza 1 PE de uma bênção.",
    },
    { n: 4, name: "Eleito", effect: "+1 em Rituais ligados ao patrono." },
    {
      n: 5,
      name: "Avatar parcial",
      effect: "Milagre Menor sem custo, uma vez por sessão.",
    },
  ].find((x) => x.n === Math.min(state.favor, 5));
}
function blessingEffectiveCost(s) {
  let eff = s.custo;
  if (state.favor === 1) eff++;
  if (
    state.corruption >= 6 &&
    state.corruption <= 8 &&
    state.corruptionBlessingMode === "cost"
  )
    eff++;
  return eff;
}
function renderBlessings() {
  const fm = favorMax();
  if (state.favor > fm) state.favor = fm;
  $("f-favor").max = fm;
  $("f-favor").value = state.favor;
  const fs = favorState();
  $("favor-badge").innerHTML =
    `${state.favor}<small style="display:block;font:10px var(--body);color:var(--muted)">${esc(fs.name)}</small>`;
  $("corruption-blessing-wrap").classList.toggle(
    "hidden",
    state.corruption < 6 || state.corruption > 8,
  );
  const g = D.blessings[state.patron];
  $("god-info").innerHTML = g
    ? `<strong>${esc(state.patron)}</strong><br><span class="tag">Domínios</span> ${esc(g.dominios)}<br><span class="tag tag-red">Corrupção típica</span> ${esc(g.corrupcao)}<br><span class="tag tag-teal">Favor ${state.favor}</span> ${esc(fs.effect)}`
    : "Escolha uma divindade patrona para ver domínios, corrupção típica e bênçãos.";
  if (!g) {
    $("blessings-grid").innerHTML = "";
    $("blessing-guidance").textContent =
      "Devotos iniciam com Favor 2 e duas bênçãos de custo até 5.";
    return;
  }
  $("blessings-grid").innerHTML = g.skills
    .map((s) => {
      const learned = state.learnedBlessings.includes(s.nome),
        blocked = state.favor === 0,
        eff = blessingEffectiveCost(s);
      return `<label class="blessing-card ${learned ? "learned" : ""}"><input type="checkbox" data-blessing="${esc(s.nome)}" ${learned ? "checked" : ""}><span><span class="blessing-name">${esc(s.nome)}</span><span class="blessing-meta">${esc(s.tipo)} · ${esc(s.acao)} · ${esc(s.alcance)} · Resist.: ${esc(s.resistencia || "-")}</span><span class="blessing-effect">${esc(s.efeito)}</span></span><span class="blessing-cost">${blocked ? "Rompido" : `${eff} PE`}</span></label>`;
    })
    .join("");
  const learned = g.skills.filter((s) =>
      state.learnedBlessings.includes(s.nome),
    ),
    initialOk = learned.filter((s) => s.custo <= 5).length;
  let guidance = `Aprendidas: <strong>${learned.length}</strong>. `;
  if (state.path === "Devoto")
    guidance +=
      state.level === 1
        ? `No nível 1: duas bênçãos de custo-base até 5 (${initialOk}/2 compatíveis).`
        : "Novas bênçãos podem vir das escolhas de progressão e talentos.";
  else if (state.path === "Livre")
    guidance += "O Caminho Livre não recebe milagres sem vínculo posterior.";
  else if (state.path === "Pactuário")
    guidance +=
      "Bênçãos podem sofrer +1 PE ou teste de Favor quando a Corrupção chega a 6–8.";
  else guidance += "Escolha um Caminho para validar as escolhas iniciais.";
  $("blessing-guidance").innerHTML = guidance;
}
function adjustCorruption(dir) {
  const old = state.corruption;
  state.corruption = clamp(old + dir, 0, 10);
  if (dir > 0 && old >= 9 && state.corruption > old)
    state.soulLoss = clamp(state.soulLoss + 1, 0, soulMax());
  renderAll();
}
function renderCorruption() {
  $("corr-current").textContent = state.corruption;
  $("corr-bar").style.width = `${state.corruption * 10}%`;
  let st, eff;
  if (state.corruption <= 2) {
    st = "Estável";
    eff = "Sinais discretos; sem penalidade permanente.";
  } else if (state.corruption <= 5) {
    st = "Marcado";
    eff = "Manifestação menor e -1 em um tipo específico de resistência.";
  } else if (state.corruption <= 8) {
    st = "Deformado";
    eff = "Manifestação maior; bênçãos custam +1 PE ou exigem teste de Favor.";
  } else if (state.corruption === 9) {
    st = "À beira";
    eff = "Toda nova Corrupção também reduz 1 Integridade da Alma.";
  } else {
    st = "Virada";
    eff = "Perde o Caminho atual e sofre transformação definida com o mestre.";
  }
  $("corruption-info").innerHTML =
    `<strong>${st}</strong><br>${eff}${state.path === "Pactuário" && state.corruption < 1 ? '<br><span class="tag tag-red">Pactuário deve iniciar com 1 Corrupção.</span>' : ""}`;
}

function newPower() {
  return {
    id: crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now() + Math.random()),
    name: "",
    source: state.path === "Pactuário" ? "Abissal" : "Arcano",
    tier: "Comum",
    keyAttr: "intelecto",
    skill: "Ocultismo",
    form: "Ataque direto",
    damage: ["Corte"],
    effects: [],
    upgrades: [],
    limitations: [],
    description: "",
    range: "",
    duration: "",
    resistance: "",
    ruling: "",
    signature: false,
  };
}
function powerCost(p) {
  return window.AETHERIS_RULES.powerPrice(D, state, p);
}
function powerWarnings(p) {
  const r = window.AETHERIS_RULES.powerCheck(D, state, p);
  return [...r.errors, ...r.notes];
}
function optionList(items, value, key = "name") {
  return (
    '<option value="">—</option>' +
    items
      .map((x) => {
        const v = x[key];
        return `<option value="${esc(v)}" ${v === value ? "selected" : ""}>${esc(v)}</option>`;
      })
      .join("")
  );
}
function renderPowerRows(p, kind, items, key) {
  return (p[kind] || [])
    .map((v, i) => {
      const item = items.find((x) => x[key] === v);
      const info =
        kind === "damage"
          ? `${item?.die || ""} · ${item?.natural || ""} · ${item?.cost ? `+${item.cost}` : "base"}`
          : kind === "effects"
            ? `${item?.duration || ""} · ${item?.effect || ""} · +${item?.cost || 0}`
            : kind === "limitations"
              ? `Redução de ${Math.abs(item?.cost || 0)} PE`
              : `${item?.effect || ""} · ${item?.cost >= 0 ? "+" : ""}${item?.cost || 0}`;
      return `<div class="power-row"><select class="control" data-power-id="${esc(p.id)}" data-power-array="${kind}" data-index="${i}">${optionList(items, v, key)}</select><span class="power-info">${esc(info)}</span><button class="btn btn-danger btn-icon no-print" data-power-remove-row="${kind}" data-power-id="${esc(p.id)}" data-index="${i}">×</button></div>`;
    })
    .join("");
}
function renderPowers() {
  $("powers-list").innerHTML = state.powers
    .map((p) => {
      const cost = powerCost(p),
        warnings = powerWarnings(p),
        tier = D.powerTiers[p.tier] || D.powerTiers.Comum;
      return `<article class="power-card"><div class="power-head"><div class="field wide"><label>Nome</label><input data-power-id="${esc(p.id)}" data-power-field="name" value="${esc(p.name)}"></div><div class="field"><label>Fonte</label><select data-power-id="${esc(p.id)}" data-power-field="source">${["Arcano", "Divino", "Abissal", "Técnico"].map((v) => `<option ${p.source === v ? "selected" : ""}>${v}</option>`).join("")}</select></div><div class="field"><label>Categoria</label><select data-power-id="${esc(p.id)}" data-power-field="tier">${Object.keys(
        D.powerTiers,
      )
        .map((v) => `<option ${p.tier === v ? "selected" : ""}>${v}</option>`)
        .join(
          "",
        )}</select></div><div class="cost-badge">Custo<strong>${cost}</strong>PE</div><button class="btn btn-danger btn-icon no-print" data-remove-power="${esc(p.id)}">×</button></div><div class="grid grid-4"><div class="field"><label>Atributo-chave</label><select data-power-id="${esc(p.id)}" data-power-field="keyAttr">${D.attributes.map((a) => `<option value="${a}" ${p.keyAttr === a ? "selected" : ""}>${D.attributeLabels[a]}</option>`).join("")}</select></div><div class="field"><label>Perícia de ativação</label><select data-power-id="${esc(p.id)}" data-power-field="skill">${ALL_SKILLS.map((s) => `<option ${p.skill === s.name ? "selected" : ""}>${esc(s.name)}</option>`).join("")}</select></div><div class="field"><label>Forma</label><select data-power-id="${esc(p.id)}" data-power-field="form">${D.powerForms.map((f) => `<option ${p.form === f.name ? "selected" : ""}>${esc(f.name)}</option>`).join("")}</select></div><label class="check-card"><input type="checkbox" data-power-id="${esc(p.id)}" data-power-field="signature" ${p.signature ? "checked" : ""}><span><span class="name">Poder Assinatura</span><span class="desc">Somente um poder pode receber -1 PE.</span></span></label></div><div class="power-section"><div class="power-section-title">Tipos de dano (${(p.damage || []).length}/${p.tier === "Supremo" ? "estrutura especial" : tier.damage + " recomendado"})</div>${renderPowerRows(p, "damage", D.damageTypes, "name")}<button class="btn btn-small no-print" data-power-add="damage" data-power-id="${esc(p.id)}">+ dano</button></div><div class="power-section"><div class="power-section-title">Efeitos (${(p.effects || []).length}/${p.tier === "Supremo" ? "estrutura especial" : tier.effect + " recomendado"})</div>${renderPowerRows(p, "effects", D.debuffs, "name")}<button class="btn btn-small no-print" data-power-add="effects" data-power-id="${esc(p.id)}">+ efeito</button></div><div class="power-section"><div class="power-section-title">Melhorias (${(p.upgrades || []).length}/${p.tier === "Supremo" ? "estrutura especial" : tier.upgrade + " recomendado"})</div>${renderPowerRows(p, "upgrades", D.upgrades, "name")}<button class="btn btn-small no-print" data-power-add="upgrades" data-power-id="${esc(p.id)}">+ melhoria</button></div><div class="power-section"><div class="power-section-title">Limitações</div>${renderPowerRows(p, "limitations", D.limitations, "name")}<button class="btn btn-small no-print" data-power-add="limitations" data-power-id="${esc(p.id)}">+ limitação</button></div><div class="field"><label>Descrição</label><textarea data-power-id="${esc(p.id)}" data-power-field="description">${esc(p.description || "")}</textarea></div><div class="grid grid-2" data-power-details="${esc(p.id)}"></div><div class="power-warning ${warnings.length ? "" : "power-ok"}">${warnings.length ? esc(warnings.join(" ")) : `Requisitos conferidos para ${esc(p.tier)}. DT de Poder: ${10 + (state.attrs[p.keyAttr] || 0) + effectiveTraining(p.skill) + Math.floor(state.level / 2)}.`}</div></article>`;
    })
    .join("");
  qsa("[data-power-details]").forEach((el) => {
    const p = findPower(el.dataset.powerDetails);
    el.innerHTML = [
      ["range", "Alcance e área"],
      ["duration", "Duração"],
      ["resistance", "Ataque ou resistência"],
      ["ruling", "Decisão do mestre, quando necessária"],
    ]
      .map(
        ([k, label]) =>
          `<div class="field"><label>${label}</label><input data-power-id="${esc(p.id)}" data-power-field="${k}" value="${esc(p[k] || "")}"></div>`,
      )
      .join("");
  });
  bindPowerEvents();
  renderTalentOptions();
}
function findPower(id) {
  return state.powers.find((p) => String(p.id) === String(id));
}
function bindPowerEvents() {
  qsa("[data-power-field]").forEach((el) => {
    const field = el.dataset.powerField,
      event =
        el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(event, (e) => {
      const p = findPower(e.target.dataset.powerId);
      if (!p) return;
      if (field === "signature" && e.target.checked) {
        state.powers.forEach(
          (x) => (x.signature = String(x.id) === String(p.id)),
        );
      } else
        p[field] =
          e.target.type === "checkbox" ? e.target.checked : e.target.value;
      if (
        ["tier", "form", "keyAttr", "skill", "signature", "source"].includes(
          field,
        )
      )
        renderPowers();
      const card = e.target.closest(".power-card");
      if (card) {
        const warnings = powerWarnings(p),
          feedback = card.querySelector(".power-warning");
        feedback.textContent =
          (warnings.length ? warnings.join(" ") : "Requisitos conferidos.") +
          " DT de Poder: " +
          (10 +
            (state.attrs[p.keyAttr] || 0) +
            effectiveTraining(p.skill) +
            Math.floor(state.level / 2));
        feedback.classList.toggle("power-ok", !warnings.length);
      }
      renderValidation();
      scheduleAutoSave();
    });
  });
  qsa("[data-power-array]").forEach((el) =>
    el.addEventListener("change", (e) => {
      const p = findPower(e.target.dataset.powerId);
      if (!p) return;
      p[e.target.dataset.powerArray][Number(e.target.dataset.index)] =
        e.target.value;
      renderPowers();
      scheduleAutoSave();
    }),
  );
  qsa("[data-power-add]").forEach((b) =>
    b.addEventListener("click", (e) => {
      const p = findPower(e.target.dataset.powerId),
        k = e.target.dataset.powerAdd;
      if (!p) return;
      p[k] = p[k] || [];
      p[k].push("");
      renderPowers();
      scheduleAutoSave();
    }),
  );
  qsa("[data-power-remove-row]").forEach((b) =>
    b.addEventListener("click", (e) => {
      const p = findPower(e.target.dataset.powerId);
      if (!p) return;
      p[e.target.dataset.powerRemoveRow].splice(
        Number(e.target.dataset.index),
        1,
      );
      renderPowers();
      scheduleAutoSave();
    }),
  );
  qsa("[data-remove-power]").forEach((b) =>
    b.addEventListener("click", (e) => {
      state.powers = state.powers.filter(
        (p) => String(p.id) !== String(e.target.dataset.removePower),
      );
      renderPowers();
      renderValidation();
      scheduleAutoSave();
    }),
  );
}
function renderEquipment() {
  const a = armor(),
    w = weapon(),
    trained = armorTrainedForCurrent(),
    stealth =
      trained && a.stealth !== "Nenhuma"
        ? `${a.stealth} (ignorada por Armadura Treinada)`
        : a.stealth;
  $("armor-info").innerHTML =
    `<strong>${esc(a.name)}</strong><br>+${a.defense} Defesa · ${esc(stealth)}${a.strength ? ` · Exige Força ${a.strength}` : ""}${a.strength > state.attrs.forca ? '<br><span class="tag tag-red">Força insuficiente — o talento não remove o requisito.</span>' : ""}`;
  $("weapon-info").innerHTML =
    `<strong>${esc(w.name)}</strong><br>${esc(w.damage)} · ${esc(w.property)}<br>${esc(w.notes)}`;
  $("slots-capacity").textContent = inventoryCapacity();
  $("encumbrance-info").textContent = isEncumbered()
    ? "Sobrecarregado: Movimento -2m e desvantagem em Atletismo e Acrobacia."
    : "Carga dentro do limite.";
  renderConsumables();
}
function renderConsumables() {
  qsa("[data-consumable]").forEach((cb) => {
    cb.checked = state.consumables.includes(cb.dataset.consumable);
    cb.closest(".check-card").classList.toggle("active", cb.checked);
  });
}
function renderConditions() {
  qsa("[data-condition]").forEach((cb) => {
    cb.checked = state.conditions.includes(cb.dataset.condition);
    cb.closest(".check-card").classList.toggle("active", cb.checked);
  });
  renderStats();
  renderSkills();
  renderContext();
}
function renderDeathTracks() {
  qsa('[data-death="success"]').forEach((b) =>
    b.classList.toggle("active", Number(b.dataset.value) <= state.deathSuccess),
  );
  qsa('[data-death="fail"]').forEach((b) =>
    b.classList.toggle("active", Number(b.dataset.value) <= state.deathFail),
  );
}
function renderReputation() {
  $("reputation-list").innerHTML =
    (state.reputation || [])
      .map(
        (r, i) =>
          `<div class="reputation-row"><input class="control" data-rep-index="${i}" data-rep-field="name" value="${esc(r.name || "")}" placeholder="Região, culto ou facção"><select class="control" data-rep-index="${i}" data-rep-field="value">${[-3, -2, -1, 0, 1, 2, 3].map((v) => `<option value="${v}" ${Number(r.value) === v ? "selected" : ""}>${v > 0 ? "+" : ""}${v}</option>`).join("")}</select><button class="btn btn-danger btn-icon no-print" data-remove-rep="${i}">×</button></div>`,
      )
      .join("") ||
    '<div class="section-note">Nenhuma reputação registrada.</div>';
  qsa("[data-rep-field]").forEach((el) =>
    el.addEventListener("input", (e) => {
      const r = state.reputation[Number(e.target.dataset.repIndex)];
      r[e.target.dataset.repField] =
        e.target.dataset.repField === "value"
          ? Number(e.target.value)
          : e.target.value;
    }),
  );
  qsa("[data-remove-rep]").forEach((b) =>
    b.addEventListener("click", (e) => {
      state.reputation.splice(Number(e.target.dataset.removeRep), 1);
      renderReputation();
    }),
  );
}
function renderAvatar() {
  state.avatarData = window.AETHERIS_SCHEMA.safeAvatar(state.avatarData);
  const has = Boolean(state.avatarData);
  ["avatar-preview", "current-avatar"].forEach((id) => {
    const im = $(id);
    im.classList.toggle("hidden", !has);
    if (has) im.src = state.avatarData;
  });
  $("avatar-placeholder").classList.toggle("hidden", has);
  $("current-avatar-placeholder").classList.toggle("hidden", has);
  $("avatar-remove-btn").classList.toggle("hidden", !has);
}
function handleAvatarUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    setStatus("Escolha uma imagem válida.", true);
    return;
  }
  const img = new Image(),
    reader = new FileReader();
  reader.onload = () => {
    img.onload = () => {
      const max = 360,
        scale = Math.min(1, max / Math.max(img.width, img.height)),
        w = Math.max(1, Math.round(img.width * scale)),
        h = Math.max(1, Math.round(img.height * scale)),
        canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      state.avatarData = canvas.toDataURL("image/jpeg", 0.84);
      renderAvatar();
      renderCharacterSummary();
      scheduleAutoSave();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
  e.target.value = "";
}
function renderCharacterSummary() {
  const name = $("f-nome").value.trim() || "Nova ficha",
    parts = [];
  if (state.race) parts.push(D.races[state.race]?.label || state.race);
  if (state.profession) parts.push(state.profession);
  parts.push(`Nível ${state.level}`);
  $("current-character-name").textContent = name;
  $("current-character-meta").textContent = currentSheetId
    ? parts.join(" · ")
    : `${parts.join(" · ")} · aguardando nome para autosalvar`;
  if ($("f-nome").value) $("save-name").value = $("f-nome").value;
}
function validationItem(ok, title, detail, warn = false) {
  return `<div class="validation-item ${ok ? "ok" : warn ? "warn" : ""}"><span class="validation-icon">${ok ? "✓" : warn ? "!" : "·"}</span><div><strong>${esc(title)}</strong><span>${esc(detail)}</span></div></div>`;
}
function renderValidation() {
  const fields = {};
  FORM_FIELDS.forEach((id) => (fields[id] = $(id).value));
  const rows = window.AETHERIS_RULES.validate(D, state, fields);
  $("grimorio-validation").innerHTML = rows
    .map((r) => validationItem(r.ok, r.title, r.detail, !r.ok))
    .join("");
  const ok = rows.every((r) => r.ok);
  $("validation-seal").textContent = ok
    ? "Regras verificadas"
    : "Revisar ficha";
  $("validation-seal").className = `seal-badge ${ok ? "ok" : "warn"}`;
}

const FORM_FIELDS = [
  "f-nome",
  "f-jogador",
  "f-regiao",
  "f-origem",
  "f-conceito",
  "f-objetivo",
  "f-medo",
  "f-vinculo",
  "f-divida",
  "f-verdade",
  "f-prof-upgrade",
  "f-level-choice",
  "f-dogma",
  "f-divine-corruption",
  "f-milagre",
  "p-entidade",
  "p-desejo",
  "p-dadiva",
  "p-preco",
  "p-marca",
  "p-clausula",
  "f-inventario",
  "f-reliquias",
  "f-ferimentos",
  "f-efeitos-continuos",
  "f-favores",
  "f-dividas-faccao",
  "f-historia",
  "f-notas",
];
function buildSheetData() {
  state.corruptionManifestation = $("f-corruption-manifestation").value;
  state.corruptionPenalty = $("f-corruption-penalty").value;
  const fields = {};
  FORM_FIELDS.forEach((id) => (fields[id] = $(id).value));
  return {
    schemaVersion: 4,
    fields,
    state: JSON.parse(JSON.stringify(state)),
    savedAt: new Date().toISOString(),
  };
}
function applySheetData(raw) {
  window.AETHERIS_SCHEMA.validate(raw);
  const data = migrateData(raw || {});
  if (!Object.hasOwn(D.races, data.state.race)) data.state.race = "";
  if (!Object.hasOwn(D.blessings, data.state.patron)) data.state.patron = "";
  state = data.state;
  FORM_FIELDS.forEach((id) => ($(id).value = data.fields?.[id] || ""));
  renderAll();
  if (migrationNotice) setStatus(migrationNotice, false);
}
function migrateData(raw) {
  migrationNotice = "";
  if (
    [2, 3, 4].includes(raw.schemaVersion) ||
    [2, 3, 4].includes(raw.state?.schemaVersion)
  ) {
    const base = defaultState(),
      old = raw.state || {},
      s = { ...base, ...old };
    s.schemaVersion = 4;
    s.attrs = { ...base.attrs, ...old.attrs };
    s.training = { ...base.training, ...old.training };
    s.talents = Array.isArray(s.talents) ? s.talents : [];
    if (
      s.talents.includes("critico_fisico") ||
      s.talents.includes("critico_magico")
    ) {
      s.criticalChoice = s.talents.includes("critico_magico")
        ? "magico"
        : "fisico";
      s.talents = s.talents.filter(
        (x) => !["critico_fisico", "critico_magico"].includes(x),
      );
      if (!s.talents.includes("critico_aprimorado"))
        s.talents.push("critico_aprimorado");
    }
    s.profession = officialProfessionFromLegacy(s.profession);
    s.powers = Array.isArray(s.powers) ? s.powers : [];
    s.powers = s.powers.map((p) => ({
      ...newPower(),
      ...p,
      id: String(p.id || crypto.randomUUID()),
    }));
    s.context = { ...base.context, ...old.context };
    s.creationMode = old.creationMode ?? false;
    s.learnedBlessings = Array.isArray(s.learnedBlessings)
      ? s.learnedBlessings
      : [];
    s.reputation = Array.isArray(s.reputation) ? s.reputation : [];
    if (raw.schemaVersion === 2 || old.schemaVersion === 2)
      migrationNotice =
        "Ficha v2 migrada: profissões regionais foram convertidas para a profissão-base oficial e Crítico Aprimorado foi unificado conforme o Grimório.";
    return { schemaVersion: 4, fields: raw.fields || {}, state: s };
  }
  const old = raw.state || {},
    s = defaultState();
  s.level = clamp(Number(old.level) || 1, 1, 10);
  D.attributes.forEach(
    (a) => (s.attrs[a] = Math.max(1, Number(old.attrs?.[a]) || 1)),
  );
  s.race = old.race || "";
  s.profession = officialProfessionFromLegacy(old.profession || "");
  s.pvLoss = Number(old.pvOffset) || 0;
  s.peSpent = Number(old.peOffset) || 0;
  s.soulLoss = Number(old.soulOffset) || 0;
  s.corruption = Number(old.corruption) || 0;
  Object.keys(s.training).forEach(
    (k) => (s.training[k] = Number(old.training?.[k]) || 0),
  );
  const oldGod = raw.blessings?.[0]?.deus || raw.identity?.deus || "";
  if (D.blessings[oldGod]) {
    s.patron = oldGod;
    s.path = "Devoto";
    s.learnedBlessings = D.blessings[oldGod].skills.map((x) => x.nome);
  }
  s.powers = (raw.powers || []).map((p) => ({
    id: String(Date.now() + Math.random()),
    name: p.nome || "",
    source: "Arcano",
    tier: p.tier || "Comum",
    keyAttr: "intelecto",
    skill: "Ocultismo",
    form: "Ataque direto",
    damage: (p.danos || []).map((x) => x.tipo).filter(Boolean),
    effects: (p.efeitos || [])
      .map((x) => (x.nome === "Corrupção" ? "Ruína da Alma" : x.nome))
      .filter(Boolean),
    upgrades: (p.melhorias || []).map((x) => x.nome).filter(Boolean),
    limitations: [],
    description: p.descricao || "",
    signature: false,
  }));
  const f = {
    "f-nome": raw.identity?.nome || "",
    "f-jogador": raw.identity?.jogador || "",
    "f-regiao": raw.identity?.regiao || "",
    "f-objetivo": raw.identity?.promessa || "",
    "f-inventario": raw.inventario || "",
    "f-notas": raw.notas || "",
  };
  migrationNotice =
    "Ficha antiga migrada para a Edição Expandida. Revise atributos, profissão e bênçãos.";
  return { schemaVersion: 4, fields: f, state: s };
}

function talentCount() {
  return (
    state.talents.length +
    (hasTalent("maestria") ? Math.max(0, (state.masteryPurchases || 1) - 1) : 0)
  );
}
function renderContext() {
  $("creation-mode").checked = state.creationMode;
  $("safe-shelter").checked = Boolean(state.context.safeShelter);
  $("resurrection-count").value = state.resurrections;
  $("warrior-stance").value = state.warriorStance;
  $("exhaustion-sources").value = state.exhaustionSources;
  $("pause-rest").disabled = masterViewing || state.pauseUsed;
  qsa("[data-context]").forEach(
    (el) => (el.checked = Boolean(state.context[el.dataset.context])),
  );
  const notes = [];
  if (currentPV() === 0)
    notes.push("A 0 PV: Caído e Inconsciente; faça Testes de Caminho.");
  if (currentSoul() === 0)
    notes.push(
      "Integridade 0: Morte sem Caminho; o retorno exige exceção definida pelo mestre.",
    );
  if (state.conditions.includes("atordoado"))
    notes.push(
      "Atordoado: -2 Defesa já aplicado; sem Reação e desvantagem em ataques.",
    );
  if (state.conditions.includes("amedrontado"))
    notes.push("Amedrontado: -2 em ataques; não se aproxime da fonte.");
  if (state.conditions.includes("envenenado"))
    notes.push("Envenenado: desvantagem em testes físicos.");
  if (state.conditions.includes("enfraquecido"))
    notes.push(
      "Enfraquecido: reduza o dano causado em 25%, arredondado para baixo.",
    );
  if (
    state.conditions.includes("paralisado") ||
    state.conditions.includes("congelamento_total")
  )
    notes.push("Sem ações; resolva a duração com o mestre.");
  if (state.conditions.includes("lento")) notes.push("Lento: não pode Correr.");
  if (state.conditions.includes("cego"))
    notes.push(
      "Cego: desvantagem em ataques visuais; ataques contra você têm vantagem.",
    );
  if (state.profession === "Guerreiro")
    notes.push(
      state.warriorStance === "ofensiva"
        ? "Postura Ofensiva: +1 no dano."
        : "Postura Defensiva: +1 Defesa já aplicado.",
    );
  if (state.race === "reptilianos")
    notes.push(
      "Some +2 ao resistir a Veneno ou Medo comum; depende do teste pedido pelo mestre.",
    );
  if (state.favor > 5)
    notes.push(
      "O livro aumenta o Favor máximo, mas não define benefícios acima de 5. Não há benefício adicional automático.",
    );
  $("active-rules").textContent =
    notes.join(" ") ||
    "Condições e contextos marcados atualizam os valores aplicáveis. Rolagens, vantagem, dano, resistências e durações são resolvidos na mesa.";
}
function initContext() {
  $("safe-shelter").addEventListener(
    "change",
    (e) => (state.context.safeShelter = e.target.checked),
  );
  $("creation-mode").addEventListener("change", (e) => {
    state.creationMode = e.target.checked;
    renderValidation();
  });
  $("warrior-stance").addEventListener("change", (e) => {
    state.warriorStance = e.target.value;
    renderStats();
    renderContext();
  });
  $("resurrection-count").addEventListener("change", (e) => {
    state.resurrections = clamp(
      Math.trunc(Number(e.target.value) || 0),
      0,
      100,
    );
    renderAll();
  });
  $("exhaustion-sources").addEventListener("change", (e) => {
    state.exhaustionSources = clamp(
      Math.trunc(Number(e.target.value) || 1),
      1,
      4,
    );
    renderAll();
  });
  qsa("[data-context]").forEach((el) =>
    el.addEventListener("change", (e) => {
      state.context[e.target.dataset.context] = e.target.checked;
      renderAll();
    }),
  );
  $("new-scene").addEventListener("click", () => {
    state.pauseUsed = false;
    renderContext();
    scheduleAutoSave();
    setStatus(
      "Nova cena: pausa disponível. Revise os efeitos cuja duração terminou.",
    );
  });
}

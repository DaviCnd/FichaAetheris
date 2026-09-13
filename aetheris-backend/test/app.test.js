const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");
const pub = path.join(__dirname, "../public");
async function setup(handler) {
  const dom = new JSDOM(fs.readFileSync(path.join(pub, "index.html"), "utf8"), {
    url: "http://localhost",
    runScripts: "outside-only",
    pretendToBeVisual: true,
  });
  const w = dom.window;
  w.scrollTo = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.CSS = { escape: (s) => s };
  w.confirm = () => true;
  w.HTMLDialogElement.prototype.showModal = function () {
    this.open = true;
  };
  w.HTMLDialogElement.prototype.close = function () {
    this.open = false;
    this.dispatchEvent(new w.Event("close"));
  };
  const requests = [];
  let version = 1;
  w.fetch = async (url, options = {}) => {
    requests.push({ url, ...options });
    let status = 200,
      data = [];
    if (url === "/api/me") data = { username: "jogador", isAdmin: false };
    else if (url === "/api/sheets" && options.method === "POST")
      data = { id: 1, version };
    else if (url.startsWith("/api/sheets/") && options.method === "PUT")
      data = { ok: true, version: ++version };
    else if (url === "/rules/index.json")
      data = JSON.parse(
        fs.readFileSync(path.join(pub, "rules/index.json"), "utf8"),
      );
    const custom = await handler?.(url, options, w);
    if (custom) {
      status = custom.status ?? 200;
      data = custom.data;
    }
    return { ok: status < 400, status, json: async () => data };
  };
  for (const file of [
    "aetheris-data.js",
    "sheet-schema.js",
    "rules-engine.js",
    "app.js",
    "persistence.js",
    "rules-reader.js",
    "bootstrap.js",
  ])
    new (require("node:vm").Script)(
      fs.readFileSync(path.join(pub, file), "utf8"),
    ).runInContext(dom.getInternalVMContext());
  await new Promise((r) => setTimeout(r, 20));
  return { w, requests, close: () => dom.window.close() };
}
test("autosave authenticated edit and versioned subsequent save", async () => {
  const { w, requests, close } = await setup();
  try {
    const name = w.document.getElementById("f-nome");
    name.value = "Sarya";
    name.dispatchEvent(new w.Event("input", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 1150));
    assert.equal(
      requests.filter((r) => r.method === "POST" && r.url === "/api/sheets")
        .length,
      1,
    );
    name.value = "Sarya II";
    name.dispatchEvent(new w.Event("input", { bubbles: true }));
    await new Promise((r) => setTimeout(r, 1150));
    const put = requests.find((r) => r.method === "PUT");
    assert.equal(JSON.parse(put.body).version, 1);
    assert.equal(JSON.parse(put.body).name, "Sarya II");
  } finally {
    close();
  }
});
test("save failure blocks navigation and retains local backup", async () => {
  const { w, close } = await setup((url, o) =>
    o.method === "POST" ? { status: 500, data: { error: "offline" } } : null,
  );
  try {
    const el = w.document.getElementById("f-nome");
    el.value = "Não perder";
    el.dispatchEvent(new w.Event("input", { bubbles: true }));
    await w.newSheet();
    assert.equal(el.value, "Não perder");
    assert.match(
      w.localStorage.getItem("aetheris-draft:jogador"),
      /Não perder/,
    );
  } finally {
    close();
  }
});
test("mechanics: racial context, warrior stance, conditions and permanent soul", async () => {
  const { w, close } = await setup();
  try {
    const s = w.defaultState();
    s.attrs = { forca: 3, destreza: 3, intelecto: 2, vontade: 2, fe: 2 };
    s.race = "avaris";
    s.profession = "Guerreiro";
    s.context.visual = true;
    s.warriorStance = "defensiva";
    s.conditions = ["atordoado", "lento"];
    s.resurrections = 2;
    w.applySheetData({ schemaVersion: 4, fields: {}, state: s });
    assert.equal(w.defense(), 15);
    assert.equal(w.movement(), 3);
    assert.equal(w.skillTotal("Percepção"), 4);
    assert.equal(w.soulMax(), 7);
    s.conditions = ["agarrado"];
    w.applySheetData({ schemaVersion: 4, fields: {}, state: s });
    assert.equal(w.movement(), 0);
  } finally {
    close();
  }
});
test("validation rejects incomplete Free character and excessive power", async () => {
  const { w, close } = await setup();
  try {
    const s = w.defaultState();
    s.attrs = { forca: 3, destreza: 3, intelecto: 2, vontade: 2, fe: 2 };
    s.race = "humanos";
    s.profession = "Guerreiro";
    s.path = "Livre";
    s.powers = [w.newPower(), w.newPower()];
    s.powers[0].effects = ["Dominação Mental"];
    w.applySheetData({
      schemaVersion: 4,
      fields: {
        "f-nome": "Teste",
        "f-regiao": "Elyndar",
        "f-conceito": "A",
        "f-objetivo": "B",
        "f-vinculo": "C",
      },
      state: s,
    });
    assert.equal(
      w.document.getElementById("validation-seal").textContent,
      "Revisar ficha",
    );
  } finally {
    close();
  }
});
test("pause only once per scene; recovery and fixed soul do not mix", async () => {
  const { w, close } = await setup();
  try {
    const s = w.defaultState();
    s.peSpent = 10;
    s.resurrections = 2;
    w.applySheetData({ schemaVersion: 4, state: s, fields: {} });
    w.pauseRest();
    const p = w.currentPE();
    w.pauseRest();
    assert.equal(w.currentPE(), p);
    assert.equal(w.soulMax(), 5);
    w.document.getElementById("new-scene").click();
    w.pauseRest();
    assert.equal(w.currentPE(), p + 1);
  } finally {
    close();
  }
});
test("book opens, chapter navigation and accent-insensitive search work", async () => {
  const { w, close } = await setup();
  try {
    w.document.getElementById("rules-open").click();
    await new Promise((r) => setTimeout(r, 20));
    assert(w.document.getElementById("rules-dialog").open);
    const chapter = [...w.document.querySelectorAll("[data-rule-page]")].find(
      (b) => b.getAttribute("aria-label") === "Combate, página 10",
    );
    chapter.click();
    assert.equal(w.document.getElementById("rules-page").value, "10");
    w.document.getElementById("rules-mode").click();
    assert.match(
      w.document.getElementById("rules-text").textContent,
      /Economia de ações/,
    );
    const q = w.document.getElementById("rules-search");
    q.value = "corrupcao";
    q.dispatchEvent(new w.Event("input"));
    await new Promise((r) => setTimeout(r, 200));
    assert(w.document.querySelectorAll("[data-rule-page]").length > 0);
  } finally {
    close();
  }
});
test("invalid import shape and avatar are rejected before changing editor", async () => {
  const { w, close } = await setup();
  try {
    assert.throws(() =>
      w.applySheetData({ schemaVersion: 4, state: { powers: [null] } }),
    );
    assert.throws(() =>
      w.applySheetData({
        schemaVersion: 4,
        state: { avatarData: 'x" onerror="alert(1)' },
      }),
    );
  } finally {
    close();
  }
});
test("power costs match book examples; discounts do not invalidate learned tier", async () => {
  const { w, close } = await setup();
  try {
    const D = w.AETHERIS_DATA,
      R = w.AETHERIS_RULES,
      s = w.defaultState();
    s.level = 10;
    s.talents = ["poder_assinatura"];
    const p = {
      ...w.newPower(),
      name: "Chama do Abismo",
      damage: ["Fogo"],
      effects: ["Queimadura", "Medo"],
      upgrades: ["Área pequena (3m)"],
      tier: "Intermediário",
      range: "3m",
      duration: "3 turnos",
      resistance: "Reflexos e Resistência Mental",
      description: "Conforme exemplo p.18",
    };
    assert.equal(R.powerPrice(D, s, p), 10);
    p.signature = true;
    assert.equal(R.powerPrice(D, s, p), 9);
    assert.equal(R.powerCheck(D, s, p).errors.length, 0);
    p.damage = ["Arcano"];
    p.effects = [];
    p.upgrades = ["+1d6 dano", "Ignorar armadura", "Alcance longo"];
    p.signature = false;
    assert.equal(R.powerPrice(D, s, p), 9);
  } finally {
    close();
  }
});

test("legacy sheet migration preserves identity, maps professions and critical talent", async () => {
  const { w, close } = await setup();
  try {
    const s = w.defaultState();
    s.schemaVersion = 2;
    s.profession = "Gladiador Carmesim";
    s.talents = ["critico_magico"];
    w.applySheetData({
      schemaVersion: 2,
      fields: { "f-nome": "Legado" },
      state: s,
    });
    const saved = w.buildSheetData();
    assert.equal(saved.fields["f-nome"], "Legado");
    assert.equal(saved.state.profession, "Guerreiro");
    assert.equal(saved.schemaVersion, 4);
    assert(saved.state.talents.includes("critico_aprimorado"));
    assert.equal(saved.state.criticalChoice, "magico");
  } finally {
    close();
  }
});
test("master view is read-only and returns to its own sheet; failed view does not lock editing", async () => {
  const { w, requests, close } = await setup((url, o, win) =>
    url === "/api/admin/sheets/9"
      ? {
          data: {
            id: 9,
            name: "Jogador",
            username: "outro",
            version: 1,
            data: {
              schemaVersion: 4,
              fields: { "f-nome": "Jogador" },
              state: win.defaultState(),
            },
          },
        }
      : url === "/api/admin/sheets/99"
        ? { status: 404, data: { error: "não encontrada" } }
        : null,
  );
  try {
    w.document.getElementById("f-nome").value = "Minha ficha";
    await w.viewPlayerSheet(9);
    assert.equal(w.document.getElementById("f-nome").value, "Jogador");
    assert.equal(w.document.getElementById("f-nome").disabled, true);
    assert.equal(await w.saveCurrentSheet(), false);
    w.exitMasterView();
    assert.equal(w.document.getElementById("f-nome").value, "Minha ficha");
    assert.equal(w.document.getElementById("f-nome").disabled, false);
    await w.viewPlayerSheet(99);
    assert.equal(w.document.getElementById("f-nome").disabled, false);
    assert.equal(
      requests.filter((r) => r.method === "POST" || r.method === "PUT").length,
      0,
    );
  } finally {
    close();
  }
});
test("logout and next account do not retain previous character or master data", async () => {
  const { w, close } = await setup();
  try {
    w.document.getElementById("f-nome").value = "Personagem antigo";
    await w.doLogout();
    await w.showApp("outra_conta", false);
    assert.equal(w.document.getElementById("f-nome").value, "");
    assert.equal(w.document.getElementById("master-body").textContent, "");
  } finally {
    close();
  }
});
test("sheet edits made during a slow save are included in the following save", async () => {
  let release, started;
  const signal = new Promise((r) => (started = r)),
    pending = new Promise((r) => (release = r));
  const { w, requests, close } = await setup(async (url, o) => {
    if (o.method === "POST") {
      started();
      await pending;
      return { data: { id: 1, version: 1 } };
    }
    return null;
  });
  try {
    const el = w.document.getElementById("f-nome");
    el.value = "Primeira";
    el.dispatchEvent(new w.Event("input", { bubbles: true }));
    const save = w.saveCurrentSheet();
    await signal;
    el.value = "Segunda";
    el.dispatchEvent(new w.Event("input", { bubbles: true }));
    release();
    await save;
    await new Promise((r) => setTimeout(r, 1200));
    assert.equal(
      JSON.parse(requests.find((r) => r.method === "PUT").body).name,
      "Segunda",
    );
  } finally {
    release();
    close();
  }
});
test("Vínculo Divino and initial base-zero blessings retain book costs", async () => {
  const { w, close } = await setup();
  try {
    const s = w.defaultState();
    s.favor = 1;
    w.applySheetData({ schemaVersion: 4, state: s, fields: {} });
    assert.equal(w.blessingEffectiveCost({ custo: 0 }), 1);
    s.favor = 2;
    s.corruption = 6;
    w.applySheetData({ schemaVersion: 4, state: s, fields: {} });
    assert.equal(w.blessingEffectiveCost({ custo: 0 }), 1);
  } finally {
    close();
  }
});

test("workspace pages preserve sheet data and show the same live resources", async () => {
  const { w, close } = await setup();
  try {
    const doc = w.document;
    doc.getElementById("f-nome").value = "Sarya";
    doc.getElementById("f-notas").value = "Porto suspenso";
    doc.querySelector('[data-attr="forca"][data-dir="1"]').click();
    const before = JSON.stringify(w.buildSheetData().state);
    for (const section of [
      "growth",
      "combat",
      "powers",
      "inventory",
      "notes",
      "sheet",
    ]) {
      const button = doc.querySelector(`[data-tab="${section}"]`);
      button.click();
      assert.equal(doc.querySelectorAll(".tab-page.active").length, 1);
      assert.equal(doc.querySelector(".tab-page.active").id, `tab-${section}`);
      assert.equal(button.getAttribute("aria-current"), "page");
      assert.equal(JSON.stringify(w.buildSheetData().state), before);
      assert.equal(doc.getElementById("f-notas").value, "Porto suspenso");
    }
    doc.querySelector('[data-adjust="pv"][data-dir="-1"]').click();
    assert.equal(doc.getElementById("pv-current").textContent, "22");
    assert.equal(
      doc.getElementById("quick-pv").textContent,
      `${doc.getElementById("pv-current").textContent} / ${doc.getElementById("pv-max").textContent}`,
    );
    const ids = [...doc.querySelectorAll("[id]")].map((el) => el.id);
    assert.equal(new Set(ids).size, ids.length);
  } finally {
    close();
  }
});

test("contextual rule links open the right page; printing expands and restores details", async () => {
  const { w, close } = await setup();
  try {
    const doc = w.document;
    for (const [section, page] of [
      ["sheet", 6],
      ["growth", 8],
      ["combat", 10],
      ["powers", 15],
      ["inventory", 39],
      ["notes", 48],
    ]) {
      doc.querySelector(`#tab-${section} [data-open-book]`).click();
      await new Promise((r) => setTimeout(r, 10));
      assert.equal(doc.getElementById("rules-dialog").open, true);
      assert.equal(doc.getElementById("rules-page").value, String(page));
      doc.getElementById("rules-close").click();
    }
    const details = [...doc.querySelectorAll("#app-content details")];
    const previous = details.map((el) => el.open);
    w.dispatchEvent(new w.Event("beforeprint"));
    assert.ok(details.every((el) => el.open));
    w.dispatchEvent(new w.Event("afterprint"));
    assert.deepEqual(
      details.map((el) => el.open),
      previous,
    );
  } finally {
    close();
  }
});

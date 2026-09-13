const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { createApplication } = require("../server");
async function setup() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "aetheris-"));
  const { app, db } = await createApplication({
    databaseUrl: `file:${dir}/test.db`,
    secret: "test-only-secret-with-more-than-32-characters",
    adminUserId: 1,
    production: false,
  });
  const server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  const base = `http://127.0.0.1:${server.address().port}`;
  function client() {
    let cookie = "";
    return async (url, method = "GET", body) => {
      const r = await fetch(base + url, {
        method,
        headers: { "Content-Type": "application/json", Cookie: cookie },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      if (r.headers.get("set-cookie"))
        cookie = r.headers.get("set-cookie").split(";")[0];
      return { status: r.status, data: await r.json() };
    };
  }
  return {
    client,
    db,
    close: async () => {
      await new Promise((r) => server.close(r));
      db.close();
      await fs.rm(dir, { recursive: true, force: true });
    },
  };
}
test("accounts, ownership, role, version conflicts, invalid input and revoked logout", async () => {
  const { client, close } = await setup();
  try {
    const a = client(),
      b = client();
    let r = await a("/api/register", "POST", {
      username: "mestre",
      password: "test-12345",
    });
    assert.equal(r.data.isAdmin, true);
    assert.equal(
      (
        await b("/api/register", "POST", {
          username: "MESTRE",
          password: "test-12345",
        })
      ).status,
      409,
    );
    r = await b("/api/register", "POST", {
      username: "jogador",
      password: "test-12345",
    });
    assert.equal(r.data.isAdmin, false);
    const data = { schemaVersion: 4, state: { level: 1 }, fields: {} };
    r = await b("/api/sheets", "POST", { name: "Ficha", data });
    const id = r.data.id;
    assert.equal(r.data.version, 1);
    assert.equal((await a(`/api/sheets/${id}`)).status, 404);
    assert.equal(
      (await a(`/api/sheets/${id}`, "PUT", { name: "X", data, version: 1 }))
        .status,
      404,
    );
    assert.equal((await b("/api/admin/sheets")).status, 403);
    assert.equal((await a(`/api/admin/sheets/${id}`)).status, 200);
    assert.equal(
      (await b(`/api/sheets/${id}`, "PUT", { name: "V2", data, version: 1 }))
        .data.version,
      2,
    );
    assert.equal(
      (await b(`/api/sheets/${id}`, "PUT", { name: "stale", data, version: 1 }))
        .status,
      409,
    );
    assert.equal(
      (
        await b("/api/sheets", "POST", {
          name: "X",
          data: { state: { avatarData: "javascript:alert(1)" } },
        })
      ).status,
      400,
    );
    assert.equal(
      (await b("/api/register", "POST", { username: {}, password: {} })).status,
      400,
    );
    await b("/api/logout", "POST");
    assert.equal((await b("/api/me")).status, 401);
  } finally {
    await close();
  }
});
test("production requires a strong explicit secret", async () => {
  await assert.rejects(
    createApplication({ production: true, secret: "short" }),
    /JWT_SECRET/,
  );
});

test("legacy schema migration resolves exact master and keeps existing sheets", async () => {
  const { createClient } = require("@libsql/client");
  const bcrypt = require("bcryptjs");
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "aetheris-legacy-"));
  const url = `file:${dir}/old.db`;
  const old = createClient({ url });
  await old.execute(
    "CREATE TABLE users(id INTEGER PRIMARY KEY,username TEXT UNIQUE,password_hash TEXT)",
  );
  await old.execute(
    "CREATE TABLE sheets(id INTEGER PRIMARY KEY,user_id INTEGER,name TEXT,data TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP,updated_at TEXT DEFAULT CURRENT_TIMESTAMP)",
  );
  const hash = await bcrypt.hash("test-12345", 10);
  await old.execute({
    sql: "INSERT INTO users VALUES (1,?,?),(2,?,?)",
    args: ["Mestre", hash, "MESTRE", hash],
  });
  await old.execute({
    sql: "INSERT INTO sheets(id,user_id,name,data) VALUES(1,1,?,?)",
    args: ["Antiga", JSON.stringify({ schemaVersion: 2, state: { level: 1 } })],
  });
  old.close();
  const { app, db } = await createApplication({
    databaseUrl: url,
    secret: "long-test-only-secret-with-32-characters",
    adminUsername: "Mestre",
    production: false,
  });
  const server = app.listen(0, "127.0.0.1");
  await new Promise((r) => server.once("listening", r));
  try {
    const endpoint = `http://127.0.0.1:${server.address().port}`;
    const login = async (name) => {
      const r = await fetch(endpoint + "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, password: "test-12345" }),
      });
      return r.json();
    };
    assert.equal((await login("Mestre")).isAdmin, true);
    assert.equal((await login("MESTRE")).isAdmin, false);
    assert.equal(
      (await db.execute("SELECT version FROM sheets WHERE id=1")).rows[0]
        .version,
      1,
    );
  } finally {
    await new Promise((r) => server.close(r));
    db.close();
    await fs.rm(dir, { recursive: true, force: true });
  }
});

"use strict";
const express = require("express");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { createClient } = require("@libsql/client");
const schema = require("./public/sheet-schema");

async function createApplication(options = {}) {
  const production =
    options.production ?? process.env.NODE_ENV === "production";
  let secret = options.secret || process.env.JWT_SECRET;
  if (
    production &&
    (!secret ||
      secret.length < 32 ||
      secret === "troque-este-segredo-em-producao")
  ) {
    throw new Error(
      "Configure JWT_SECRET com pelo menos 32 caracteres aleatórios antes de iniciar em produção.",
    );
  }
  if (!secret || secret === "troque-este-segredo-em-producao") {
    secret = crypto.randomBytes(48).toString("hex");
    console.warn(
      "Chave temporária de desenvolvimento: sessões expiram ao reiniciar.",
    );
  }
  const db = createClient({
    url:
      options.databaseUrl ||
      process.env.TURSO_DATABASE_URL ||
      `file:${path.join(__dirname, "aetheris.db")}`,
    authToken: options.databaseToken ?? process.env.TURSO_AUTH_TOKEN,
  });
  await db.execute(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP)",
  );
  await db.execute(
    "CREATE TABLE IF NOT EXISTS sheets (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, name TEXT NOT NULL, data TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP, version INTEGER NOT NULL DEFAULT 1)",
  );
  const columns = await db.execute("PRAGMA table_info(sheets)");
  if (!columns.rows.some((c) => c.name === "version"))
    await db.execute(
      "ALTER TABLE sheets ADD COLUMN version INTEGER NOT NULL DEFAULT 1",
    );
  await db.execute(
    "CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires_at INTEGER NOT NULL)",
  );
  await db.execute(
    "CREATE INDEX IF NOT EXISTS sheets_owner ON sheets(user_id)",
  );
  await db.execute("DELETE FROM sessions WHERE expires_at < unixepoch()");
  // Resolve legacy configuration once against an existing, exact account. Registration never assigns a role.
  let adminId =
    Number(options.adminUserId || process.env.ADMIN_USER_ID) || null;
  const legacyAdmin = options.adminUsername ?? process.env.ADMIN_USERNAME;
  if (!adminId && legacyAdmin) {
    const result = await db.execute({
      sql: "SELECT id FROM users WHERE username = ?",
      args: [legacyAdmin],
    });
    adminId = result.rows.length === 1 ? Number(result.rows[0].id) : null;
    if (!adminId)
      console.warn(
        "ADMIN_USERNAME não corresponde a uma conta existente. Crie a conta, obtenha seu ID em /api/me e configure ADMIN_USER_ID.",
      );
  }
  const app = express();
  if (process.env.TRUST_PROXY === "1") app.set("trust proxy", 1);
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    res.set("X-Content-Type-Options", "nosniff");
    res.set("Referrer-Policy", "same-origin");
    res.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'self'",
    );
    if (req.path.startsWith("/api/")) res.set("Cache-Control", "no-store");
    if (
      !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
      req.get("sec-fetch-site") === "cross-site"
    )
      return res
        .status(403)
        .json({ error: "Origem da solicitação não permitida." });
    next();
  });
  app.use(express.json({ limit: "5mb" }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));
  const wrap = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
  const isAdmin = (user) => Number(user.id) === adminId;
  const auth = wrap(async (req, res, next) => {
    try {
      const payload = jwt.verify(req.cookies.token, secret, {
        algorithms: ["HS256"],
      });
      if (!Number.isSafeInteger(payload.id) || typeof payload.jti !== "string")
        throw new Error();
      const result = await db.execute({
        sql: "SELECT users.id, users.username FROM users JOIN sessions ON sessions.user_id=users.id WHERE users.id=? AND sessions.id=? AND sessions.expires_at>unixepoch()",
        args: [payload.id, payload.jti],
      });
      if (!result.rows.length) throw new Error();
      req.user = result.rows[0];
      req.sessionId = payload.jti;
    } catch {
      return res
        .status(401)
        .json({ error: "Sessão inválida ou expirada. Entre novamente." });
    }
    next();
  });
  const admin = (req, res, next) =>
    isAdmin(req.user)
      ? next()
      : res.status(403).json({ error: "Acesso restrito ao mestre." });
  const attempts = new Map();
  function limitAuth(req, res, next) {
    const now = Date.now(),
      key = req.ip;
    for (const [k, v] of attempts) if (v.until < now) attempts.delete(k);
    const v = attempts.get(key) || { count: 0, until: now + 15 * 60 * 1000 };
    v.count++;
    attempts.set(key, v);
    if (v.count > 40) {
      res.set("Retry-After", String(Math.ceil((v.until - now) / 1000)));
      return res
        .status(429)
        .json({ error: "Muitas tentativas. Aguarde alguns minutos." });
    }
    next();
  }
  function credentials(req, res, next) {
    const { username, password } = req.body || {};
    if (
      typeof username !== "string" ||
      !username.trim() ||
      username.trim().length > 60 ||
      typeof password !== "string" ||
      password.length < 6 ||
      Buffer.byteLength(password) > 72
    )
      return res.status(400).json({
        error: "Informe usuário (até 60 caracteres) e senha de 6 a 72 bytes.",
      });
    req.credentials = { username: username.trim(), password };
    next();
  }
  async function signIn(res, user) {
    const id = crypto.randomUUID(),
      expires = Math.floor(Date.now() / 1000) + 30 * 24 * 3600;
    await db.execute({
      sql: "INSERT INTO sessions(id,user_id,expires_at) VALUES(?,?,?)",
      args: [id, Number(user.id), expires],
    });
    const token = jwt.sign({ id: Number(user.id) }, secret, {
      expiresIn: "30d",
      jwtid: id,
      algorithm: "HS256",
    });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: production,
      maxAge: 30 * 24 * 3600 * 1000,
      path: "/",
    });
    res.json({
      ok: true,
      id: Number(user.id),
      username: user.username,
      isAdmin: isAdmin(user),
    });
  }
  app.post(
    "/api/register",
    limitAuth,
    credentials,
    wrap(async (req, res) => {
      const { username, password } = req.credentials;
      if (
        legacyAdmin &&
        username.toLocaleLowerCase() === legacyAdmin.toLocaleLowerCase()
      )
        return res.status(409).json({
          error:
            "Nome reservado para a conta do mestre. Configure o mestre por ID após criar a conta.",
        });
      const users = await db.execute("SELECT username FROM users");
      if (
        users.rows.some(
          (u) =>
            String(u.username).trim().toLocaleLowerCase() ===
            username.toLocaleLowerCase(),
        )
      )
        return res
          .status(409)
          .json({ error: "Esse nome de usuário já existe." });
      const hash = await bcrypt.hash(password, 10);
      // Atomic ASCII case-insensitive check also closes concurrent registration races.
      const result = await db.execute({
        sql: "INSERT INTO users(username,password_hash) SELECT ?,? WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = ? COLLATE NOCASE)",
        args: [username, hash, username],
      });
      if (!result.rowsAffected)
        return res
          .status(409)
          .json({ error: "Esse nome de usuário já existe." });
      await signIn(res, { id: Number(result.lastInsertRowid), username });
    }),
  );
  app.post(
    "/api/login",
    limitAuth,
    credentials,
    wrap(async (req, res) => {
      const { username, password } = req.credentials;
      // Exact match preserves access to legacy accounts differing only by case.
      const result = await db.execute({
        sql: "SELECT * FROM users WHERE username=?",
        args: [username],
      });
      const user = result.rows[0];
      if (!user || !(await bcrypt.compare(password, user.password_hash)))
        return res.status(401).json({ error: "Usuário ou senha inválidos." });
      await signIn(res, user);
    }),
  );
  app.post(
    "/api/logout",
    wrap(async (req, res) => {
      try {
        const p = jwt.verify(req.cookies.token, secret, {
          algorithms: ["HS256"],
        });
        if (p.jti)
          await db.execute({
            sql: "DELETE FROM sessions WHERE id=?",
            args: [p.jti],
          });
      } catch {}
      res.clearCookie("token", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: production,
      });
      res.json({ ok: true });
    }),
  );
  app.get("/api/me", auth, (req, res) =>
    res.json({
      id: Number(req.user.id),
      username: req.user.username,
      isAdmin: isAdmin(req.user),
    }),
  );
  app.get(
    "/api/sheets",
    auth,
    wrap(async (req, res) => {
      const result = await db.execute({
        sql: "SELECT id,name,updated_at,data,version FROM sheets WHERE user_id=? ORDER BY updated_at DESC,id DESC",
        args: [req.user.id],
      });
      res.json(
        result.rows.map((row) => {
          let p = {};
          try {
            p = JSON.parse(row.data) || {};
          } catch {}
          const s = p.state || {};
          return {
            id: row.id,
            name: row.name,
            version: row.version,
            updated_at: row.updated_at,
            summary: {
              level: s.level || 1,
              race: s.race || "",
              profession: s.profession || "",
              region: p.fields?.["f-regiao"] || "",
              avatar: schema.safeAvatar(s.avatarData),
            },
          };
        }),
      );
    }),
  );
  const validId = (req, res, next) =>
    /^[1-9]\d*$/.test(req.params.id)
      ? next()
      : res.status(400).json({ error: "Identificador de ficha inválido." });
  app.get(
    "/api/sheets/:id",
    auth,
    validId,
    wrap(async (req, res) => {
      const r = await db.execute({
        sql: "SELECT * FROM sheets WHERE id=? AND user_id=?",
        args: [req.params.id, req.user.id],
      });
      if (!r.rows.length)
        return res.status(404).json({ error: "Ficha não encontrada." });
      const x = r.rows[0];
      res.json({
        id: x.id,
        name: x.name,
        version: x.version,
        data: JSON.parse(x.data),
      });
    }),
  );
  function sheetBody(req, res, next) {
    const { name, data } = req.body || {};
    if (typeof name !== "string" || !name.trim() || name.trim().length > 160)
      return res
        .status(400)
        .json({ error: "Informe um nome de até 160 caracteres." });
    try {
      schema.validate(data);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    req.body.name = name.trim();
    next();
  }
  app.post(
    "/api/sheets",
    auth,
    sheetBody,
    wrap(async (req, res) => {
      const r = await db.execute({
        sql: "INSERT INTO sheets(user_id,name,data) VALUES(?,?,?)",
        args: [req.user.id, req.body.name, JSON.stringify(req.body.data)],
      });
      res.json({ id: Number(r.lastInsertRowid), version: 1 });
    }),
  );
  app.put(
    "/api/sheets/:id",
    auth,
    validId,
    sheetBody,
    wrap(async (req, res) => {
      const r = await db.execute({
        sql: "SELECT version FROM sheets WHERE id=? AND user_id=?",
        args: [req.params.id, req.user.id],
      });
      if (!r.rows.length)
        return res.status(404).json({ error: "Ficha não encontrada." });
      if (!Number.isInteger(req.body.version))
        return res
          .status(428)
          .json({ error: "Recarregue a ficha antes de salvar esta versão." });
      const changed = await db.execute({
        sql: "UPDATE sheets SET name=?,data=?,updated_at=CURRENT_TIMESTAMP,version=version+1 WHERE id=? AND user_id=? AND version=?",
        args: [
          req.body.name,
          JSON.stringify(req.body.data),
          req.params.id,
          req.user.id,
          req.body.version,
        ],
      });
      if (!changed.rowsAffected)
        return res.status(409).json({
          error:
            "Esta ficha foi alterada em outra aba. Exporte suas alterações antes de recarregar para evitar perdas.",
        });
      res.json({ ok: true, version: req.body.version + 1 });
    }),
  );
  app.delete(
    "/api/sheets/:id",
    auth,
    validId,
    wrap(async (req, res) => {
      await db.execute({
        sql: "DELETE FROM sheets WHERE id=? AND user_id=?",
        args: [req.params.id, req.user.id],
      });
      res.json({ ok: true });
    }),
  );
  app.get(
    "/api/admin/sheets",
    auth,
    admin,
    wrap(async (req, res) =>
      res.json(
        (
          await db.execute(
            "SELECT sheets.id,sheets.name,sheets.updated_at,users.username FROM sheets JOIN users ON users.id=sheets.user_id ORDER BY users.username COLLATE NOCASE,sheets.updated_at DESC",
          )
        ).rows,
      ),
    ),
  );
  app.get(
    "/api/admin/sheets/:id",
    auth,
    admin,
    validId,
    wrap(async (req, res) => {
      const r = await db.execute({
        sql: "SELECT sheets.*,users.username FROM sheets JOIN users ON users.id=sheets.user_id WHERE sheets.id=?",
        args: [req.params.id],
      });
      if (!r.rows.length)
        return res.status(404).json({ error: "Ficha não encontrada." });
      const x = r.rows[0];
      res.json({
        id: x.id,
        name: x.name,
        username: x.username,
        version: x.version,
        data: JSON.parse(x.data),
      });
    }),
  );
  app.use("/api", (req, res) =>
    res.status(404).json({ error: "Rota não encontrada." }),
  );
  app.use((err, req, res, next) => {
    const status =
      err.type === "entity.too.large"
        ? 413
        : err instanceof SyntaxError
          ? 400
          : 500;
    if (status === 500) console.error(err);
    res.status(status).json({
      error:
        status === 413
          ? "Ficha muito grande (máximo 5 MB)."
          : status === 400
            ? "JSON inválido."
            : "Erro interno do servidor.",
    });
  });
  return { app, db };
}
if (require.main === module)
  createApplication()
    .then(({ app }) =>
      app.listen(process.env.PORT || 3000, () =>
        console.log("Aetheris iniciado."),
      ),
    )
    .catch((e) => {
      console.error(e.message);
      process.exit(1);
    });
module.exports = { createApplication };

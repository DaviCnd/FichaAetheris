// Aetheris — servidor de fichas v2 com login e banco de dados (Turso/libSQL)
// Rodar localmente: npm install && npm start (porta padrão 3000)
//
// Variáveis de ambiente necessárias:
//   TURSO_DATABASE_URL  -> URL do banco Turso (ex: libsql://seu-banco.turso.io)
//   TURSO_AUTH_TOKEN    -> token de autenticação do Turso
//   JWT_SECRET           -> qualquer texto secreto seu, pra assinar os logins
//
// Se TURSO_DATABASE_URL não estiver definida, cai automaticamente para um
// arquivo SQLite local (aetheris.db) — ótimo pra testar no seu PC.

const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { createClient } = require('@libsql/client');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'troque-este-segredo-em-producao';
// Nome de usuário do mestre — quem estiver logado com esse username vê o Painel do Mestre.
// Configure isso como variável de ambiente no Render (ADMIN_USERNAME).
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || '').toLowerCase();

function isAdminUser(username) {
  return !!ADMIN_USERNAME && String(username || '').toLowerCase() === ADMIN_USERNAME;
}

// ---------- Banco de dados ----------
const db = process.env.TURSO_DATABASE_URL
  ? createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
  : createClient({ url: `file:${path.join(__dirname, 'aetheris.db')}` });

async function init() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sheets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// ---------- Middlewares ----------
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function auth(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Não autenticado' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Sessão inválida ou expirada' });
  }
}

function requireAdmin(req, res, next) {
  if (!isAdminUser(req.user.username)) {
    return res.status(403).json({ error: 'Acesso restrito ao mestre.' });
  }
  next();
}

function setAuthCookie(res, payload) {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 3600 * 1000,
  });
}

// pequeno wrapper pra não repetir try/catch em toda rota async
const wrap = (fn) => (req, res) => fn(req, res).catch((err) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

// ---------- Autenticação ----------
app.post('/api/register', wrap(async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password || password.length < 6) {
    return res.status(400).json({ error: 'Usuário e senha (mínimo 6 caracteres) são obrigatórios.' });
  }
  const existing = await db.execute({ sql: 'SELECT id FROM users WHERE username = ?', args: [username] });
  if (existing.rows.length) return res.status(409).json({ error: 'Esse nome de usuário já existe.' });

  const hash = bcrypt.hashSync(password, 10);
  const info = await db.execute({
    sql: 'INSERT INTO users (username, password_hash) VALUES (?, ?)',
    args: [username, hash],
  });
  setAuthCookie(res, { id: Number(info.lastInsertRowid), username });
  res.json({ ok: true, username, isAdmin: isAdminUser(username) });
}));

app.post('/api/login', wrap(async (req, res) => {
  const { username, password } = req.body || {};
  const result = await db.execute({ sql: 'SELECT * FROM users WHERE username = ?', args: [username] });
  const user = result.rows[0];
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
  }
  setAuthCookie(res, { id: user.id, username: user.username });
  res.json({ ok: true, username: user.username, isAdmin: isAdminUser(user.username) });
}));

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

app.get('/api/me', auth, (req, res) => {
  res.json({ username: req.user.username, isAdmin: isAdminUser(req.user.username) });
});

// ---------- Fichas (CRUD, sempre isoladas por usuário) ----------
app.get('/api/sheets', auth, wrap(async (req, res) => {
  const result = await db.execute({
    sql: 'SELECT id, name, updated_at, data FROM sheets WHERE user_id = ? ORDER BY updated_at DESC',
    args: [req.user.id],
  });
  const rows = result.rows.map((row) => {
    let parsed = {};
    try { parsed = JSON.parse(row.data || '{}'); } catch {}
    const st = parsed.state || {};
    const fields = parsed.fields || {};
    return {
      id: row.id,
      name: row.name,
      updated_at: row.updated_at,
      summary: {
        level: st.level || 1,
        race: st.race || '',
        profession: st.profession || '',
        region: fields['f-regiao'] || '',
        avatar: st.avatarData || '',
      },
    };
  });
  res.json(rows);
}));

app.get('/api/sheets/:id', auth, wrap(async (req, res) => {
  const result = await db.execute({
    sql: 'SELECT * FROM sheets WHERE id = ? AND user_id = ?',
    args: [req.params.id, req.user.id],
  });
  const row = result.rows[0];
  if (!row) return res.status(404).json({ error: 'Ficha não encontrada.' });
  res.json({ id: row.id, name: row.name, data: JSON.parse(row.data) });
}));

app.post('/api/sheets', auth, wrap(async (req, res) => {
  const { name, data } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Dê um nome pra ficha.' });
  const info = await db.execute({
    sql: 'INSERT INTO sheets (user_id, name, data) VALUES (?, ?, ?)',
    args: [req.user.id, name, JSON.stringify(data || {})],
  });
  res.json({ id: Number(info.lastInsertRowid) });
}));

app.put('/api/sheets/:id', auth, wrap(async (req, res) => {
  const { name, data } = req.body || {};
  const existing = await db.execute({
    sql: 'SELECT id FROM sheets WHERE id = ? AND user_id = ?',
    args: [req.params.id, req.user.id],
  });
  if (!existing.rows.length) return res.status(404).json({ error: 'Ficha não encontrada.' });
  await db.execute({
    sql: 'UPDATE sheets SET name = ?, data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    args: [name, JSON.stringify(data || {}), req.params.id],
  });
  res.json({ ok: true });
}));

app.delete('/api/sheets/:id', auth, wrap(async (req, res) => {
  await db.execute({
    sql: 'DELETE FROM sheets WHERE id = ? AND user_id = ?',
    args: [req.params.id, req.user.id],
  });
  res.json({ ok: true });
}));

// ---------- Painel do Mestre (só o usuário definido em ADMIN_USERNAME) ----------
app.get('/api/admin/sheets', auth, requireAdmin, wrap(async (req, res) => {
  const result = await db.execute(`
    SELECT sheets.id, sheets.name, sheets.updated_at, users.username
    FROM sheets
    JOIN users ON users.id = sheets.user_id
    ORDER BY users.username COLLATE NOCASE, sheets.updated_at DESC
  `);
  res.json(result.rows);
}));

app.get('/api/admin/sheets/:id', auth, requireAdmin, wrap(async (req, res) => {
  const result = await db.execute({
    sql: `SELECT sheets.*, users.username FROM sheets
          JOIN users ON users.id = sheets.user_id
          WHERE sheets.id = ?`,
    args: [req.params.id],
  });
  const row = result.rows[0];
  if (!row) return res.status(404).json({ error: 'Ficha não encontrada.' });
  res.json({ id: row.id, name: row.name, username: row.username, data: JSON.parse(row.data) });
}));

init()
  .then(() => app.listen(PORT, () => console.log(`Aetheris rodando em http://localhost:${PORT}`)))
  .catch((err) => {
    console.error('Falha ao iniciar o banco de dados:', err);
    process.exit(1);
  });

# Como publicar o Aetheris — Fichas Expandidas v2

Este projeto foi ajustado para funcionar com **Render** (hospeda o site) +
**Turso** (guarda o banco de dados de verdade, sem apagar nada).

Por quê dois serviços? Porque o Render, no plano grátis, apaga o disco do
servidor de vez em quando — e isso apagaria as contas e fichas dos seus
jogadores. O Turso guarda o banco separado, de forma permanente, e é grátis
para um projeto pequeno como este.

---

## Parte 1 — Criar o banco de dados no Turso

1. Acesse **https://turso.tech** e crie uma conta gratuita (pode entrar com
   GitHub).
2. Depois de logado, crie um banco de dados novo (o botão costuma ser
   "Create Database"). Dê um nome, tipo `aetheris`.
3. Na página do banco, procure por **"Connect"** ou **"Create Token"**. Você
   vai precisar de dois valores — guarde os dois em algum lugar seguro:
   - **Database URL** (começa com `libsql://...`)
   - **Auth Token** (uma string bem longa)

## Parte 2 — Colocar o código no GitHub

1. Crie uma conta em **https://github.com** se ainda não tiver.
2. Crie um repositório novo (pode ser privado), por exemplo `aetheris-fichas`.
3. Suba a pasta `aetheris-backend` inteira pra esse repositório. Duas formas
   fáceis:
   - Pelo site do GitHub: clique em "Add file" → "Upload files" e arraste
     todos os arquivos da pasta.
   - Ou, se tiver o Git instalado, pelo terminal:
     ```
     cd aetheris-backend
     git init
     git add .
     git commit -m "primeira versão"
     git branch -M main
     git remote add origin https://github.com/SEU-USUARIO/aetheris-fichas.git
     git push -u origin main
     ```

## Parte 3 — Publicar no Render

1. Acesse **https://render.com** e crie uma conta gratuita (pode entrar com
   GitHub — isso já facilita a conexão).
2. No painel, clique em **"New" → "Web Service"**.
3. Escolha o repositório `aetheris-fichas` que você acabou de subir.
4. Configure:
   - **Name**: `aetheris` (ou o que quiser)
   - **Region**: a mais próxima do Brasil disponível
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. Antes de clicar em "Create", vá até **"Environment Variables"** e
   adicione três variáveis:
   | Nome | Valor |
   |---|---|
   | `TURSO_DATABASE_URL` | a Database URL que você guardou no Turso |
   | `TURSO_AUTH_TOKEN` | o Auth Token que você guardou no Turso |
   | `JWT_SECRET` | invente uma senha longa e aleatória só sua |
6. Clique em **"Create Web Service"**. O Render vai instalar tudo e subir o
   site sozinho — leva uns 2 a 5 minutos na primeira vez.
7. Quando terminar, o Render te dá um link tipo
   `https://aetheris.onrender.com` — é esse link que você manda pros seus
   jogadores.

## Coisas importantes de saber

- **O plano grátis "dorme" depois de 15 minutos sem uso.** Na próxima vez que
  alguém acessar, o site demora de 30 a 60 segundos pra "acordar" — depois
  disso funciona normal. Não é bug, é assim mesmo no plano grátis.
- **As fichas ficam seguras** mesmo quando o Render reinicia ou você atualiza
  o código, porque elas estão salvas no Turso, não no Render.
- Se um dia seu grupo crescer muito e o plano grátis do Render começar a
  incomodar (pelo cold start), dá pra pagar uns 7 dólares por mês pra tirar
  essa "soneca" — mas pra uma mesa de RPG entre amigos, o grátis costuma
  bastar numa boa.

## Testando no seu próprio computador antes (opcional, recomendado)

1. Instale o [Node.js](https://nodejs.org) (versão 18 ou mais recente).
2. Na pasta do projeto, rode:
   ```
   npm install
   npm start
   ```
3. Abra `http://localhost:3000` no navegador. Sem as variáveis do Turso
   configuradas, ele usa um arquivo `aetheris.db` local automaticamente —
   ótimo só pra testar antes de publicar de verdade.

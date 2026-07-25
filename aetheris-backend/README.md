# Aetheris — Fichas Expandidas v2

Aplicação web para criação e gerenciamento de personagens de **Aetheris**, adaptada ao **Grimório de Aetheris — Edição Expandida**.

## O que mudou na v2

- atributos começam em 1, com 12 pontos no nível 1;
- progressão por marcos do nível 1 ao 10;
- novas fórmulas de PV, PE, Defesa, Movimento e Integridade da Alma;
- Caminhos espirituais: Devoto, Livre e Pactuário;
- raças e 12 profissões conforme a edição expandida;
- treinamento, Maestrias, talentos e Capstones;
- Patrono, Favor Divino e seleção individual de bênçãos;
- ficha completa de pacto e Corrupção de 0 a 10;
- criador de poderes com formas, limitações e categoria Suprema;
- armas, armaduras, escudo, carga e consumíveis;
- condições, Testes de Caminho, ferimentos e descansos;
- reputação, favores e dívidas de facção;
- importação automática de fichas da versão anterior.

## Estrutura

```text
aetheris-backend/
├── server.js
├── package.json
├── README.md
├── COMO-HOSPEDAR.md
└── public/
    ├── index.html
    ├── styles.css
    ├── aetheris-data.js
    └── app.js
```

## Rodar localmente

Requer Node.js 18 ou mais recente.

```bash
npm install
npm start
```

Abra `http://localhost:3000`.

Sem as variáveis do Turso, o servidor usa automaticamente um arquivo local `aetheris.db`.

## Verificar os arquivos JavaScript

```bash
npm run check
```

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `PORT` | Porta do servidor; padrão 3000. |
| `JWT_SECRET` | Segredo dos tokens de login. Deve ser alterado em produção. |
| `ADMIN_USERNAME` | Nome do usuário que terá acesso ao Painel do Mestre. |
| `TURSO_DATABASE_URL` | URL do banco Turso/libSQL. |
| `TURSO_AUTH_TOKEN` | Token do banco Turso. |
| `NODE_ENV` | Use `production` para ativar cookie seguro em HTTPS. |

## Compatibilidade com fichas antigas

Ao abrir uma ficha da versão anterior, o site converte os dados disponíveis para o novo formato e exibe um aviso. Como atributos, profissões e bênçãos mudaram, revise a ficha antes de salvá-la novamente.

O banco não precisa de migração: as fichas continuam armazenadas como JSON na tabela `sheets`.

## Segurança

- senhas são armazenadas com hash bcrypt;
- autenticação usa cookie `httpOnly`;
- cada jogador acessa apenas as próprias fichas;
- o Painel do Mestre depende de `ADMIN_USERNAME`.

Consulte `COMO-HOSPEDAR.md` para publicar com Render e Turso.

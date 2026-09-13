# Aetheris — Arquivo de Personagens v2.3

Ficha baseada no Grimório de Aetheris — Edição Expandida, com biblioteca de personagens, contas, painel do mestre somente leitura e consulta ao livro.

## Executar

Na pasta `aetheris-backend`, com Node.js 22 ou superior:

```sh
npm ci
npm start
```

Abra `http://localhost:3000`. Sem configuração de Turso, usa SQLite local (`aetheris.db`). Em desenvolvimento sem `JWT_SECRET`, uma chave temporária é gerada a cada inicialização.

## Conferir

```sh
npm run check
npm test
```

Os testes usam bancos temporários, sem conexão ao banco da campanha. Cobrem contas, permissões, concorrência de gravações, salvamento automático, validação, migração e consulta ao livro.

## Funcionalidades

- Salvamento automático após 900 ms de inatividade, com cópia local de recuperação e aviso ao sair com alterações pendentes.
- Conflitos entre abas não sobrescrevem silenciosamente a versão mais recente. Exporte antes de usar “Descartar alterações locais”.
- Fichas incompletas podem ser salvas; o painel informa os requisitos pendentes.
- Contextos de perícia, postura de Guerreiro, Exaustão, condições de movimento/Defesa e perda permanente de Integridade por ressurreição.
- Botão flutuante **Grimório**, páginas originais, sumário dos 17 capítulos, atalhos por divindade, pesquisa sem distinguir acentos, leitura em texto e PDF para baixar.
- Migração de fichas anteriores e preservação das profissões oficiais.

## Configuração

Configure as variáveis no ambiente do processo ou no painel da hospedagem. `.env.example` é uma referência; `npm start` não carrega esse arquivo automaticamente.

- `TURSO_DATABASE_URL` e `TURSO_AUTH_TOKEN`: armazenamento persistente.
- `JWT_SECRET`: obrigatório em produção; pelo menos 32 caracteres aleatórios.
- `NODE_ENV=production`: ativa cookie seguro; requer HTTPS.
- `ADMIN_USER_ID`: ID da conta que pode consultar as fichas dos jogadores.
- `ADMIN_USERNAME`: compatibilidade temporária; resolve somente uma conta **já existente, com nome exatamente igual, na inicialização**. Nunca promove uma nova conta registrada.
- `PORT`: 3000 por padrão.
- `TRUST_PROXY=1`: use somente atrás de exatamente um proxy confiável.

As sessões antigas exigem novo login após a atualização. Contas e fichas são preservadas; o banco recebe tabelas de sessões e uma coluna de versão de ficha automaticamente.

Veja os limites de automação e decisões não especificadas no livro em [REVISAO-GRIMORIO-v2.3.md](REVISAO-GRIMORIO-v2.3.md).

### Interface por áreas

A ficha se organiza em Personagem, Evolução, Combate, Poderes, Inventário e Diário. Todos os campos anteriores continuam com os mesmos identificadores e formato de salvamento. O menu Opções reúne importação, exportação, impressão e descarte de alterações locais. O resumo de PV/PE/Alma/Defesa usa as mesmas funções do painel de combate.

Cada área possui um atalho para a página correspondente do Grimório. A impressão expande os detalhes e inclui as seis áreas; depois, restaura as escolhas de expansão do usuário. O tema `workspace.css` é exclusivo para tela e substitui `celestial.css`; `print.css` organiza a versão A4 com fundo branco.

A reorganização não modifica fórmulas, custos, catálogos ou a interpretação das regras. As lacunas do livro e convenções permanecem documentadas em `REVISAO-GRIMORIO-v2.3.md`; a interface não certifica decisões narrativas como automaticamente validadas.

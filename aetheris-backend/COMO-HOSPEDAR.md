# Hospedar o Arquivo de Personagens

O repositório contém uma pasta `aetheris-backend`. Na hospedagem Node.js, configure:

- Diretório raiz do serviço: `aetheris-backend`.
- Node.js: 22 ou superior.
- Instalação: `npm ci`.
- Inicialização: `npm start`.
- HTTPS obrigatório em produção.

Use `TURSO_DATABASE_URL` e `TURSO_AUTH_TOKEN` para manter o banco fora do disco temporário do serviço. Sem essas variáveis, o aplicativo usa um SQLite local: ele precisa de um volume persistente e backup para uso real.

Defina `NODE_ENV=production` e `JWT_SECRET` com pelo menos 32 caracteres aleatórios. Para gerar uma chave localmente:

```sh
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Copie o resultado somente para a configuração privada do serviço. Não coloque a chave no repositório. O arquivo `.env.example` lista as variáveis; ele não é carregado automaticamente.

## Conta do mestre

1. Crie e entre na sua conta pelo site, inicialmente sem `ADMIN_USERNAME`/`ADMIN_USER_ID`.
2. Na mesma sessão, abra `/api/me` no endereço do site. Anote o campo `id`.
3. No painel da hospedagem, defina `ADMIN_USER_ID` com esse número e reinicie o serviço.
4. Entre novamente. O botão “Painel do Mestre” aparecerá para essa conta.

Se você já usava `ADMIN_USERNAME`, a atualização encontra essa conta pelo nome **exato**, desde que ela já exista no banco quando o serviço iniciar. Depois, prefira configurar o ID. Variações de maiúsculas não concedem acesso a outras contas. Não renomeamos nem excluímos contas antigas automaticamente.

## Atualizar uma instalação existente

Faça backup do banco antes de publicar. A aplicação preserva os registros e adiciona automaticamente a versão das fichas e a tabela de sessões. Todos deverão entrar novamente; os tokens anteriores não são aceitos pelo novo sistema de sessões.

A versão 2.3 impede gravações de clientes antigos sem controle de versão. Se algum jogador deixou o site aberto antes da atualização, deve exportar alterações pendentes e atualizar a página.

O livro incluído é uma cópia otimizada do PDF fornecido pelo autor, acompanhada de imagens de páginas e texto para busca. O leitor carrega apenas a página selecionada; o PDF completo é carregado ao abrir o link de download.

Os preços, planos e limites do provedor devem ser conferidos diretamente nele antes da contratação.

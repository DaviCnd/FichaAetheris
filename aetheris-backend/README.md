# Aetheris — Arquivo de Personagens v2.2

Site de fichas do RPG **Aetheris**, revisado para o **Grimório de Aetheris — Edição Expandida** e redesenhado para acompanhar a identidade visual do Grimório e do Livro de Lore.

## Destaques da v2.2

- interface de pergaminho, molduras douradas e capítulos escuros inspirada nos livros de Aetheris;
- biblioteca visual para escolher fichas já criadas e iniciar novas;
- retrato do personagem salvo junto da ficha;
- abas separadas para **Ficha**, **Inventário** e **Anotações**;
- painel de conformidade durante a criação do personagem;
- 8 raças jogáveis e **somente as 12 profissões oficiais** do Grimório;
- atributos, perícias, status derivados, Favor, Corrupção, pactos, talentos, equipamentos e criação de poderes revisados;
- migração de fichas v2.1: antigas profissões regionais são convertidas para a profissão-base oficial;
- painel do Mestre e contas continuam disponíveis.

## Rodar localmente

```bash
npm install
npm start
```

Abra `http://localhost:3000`.

## Variáveis de ambiente

Copie `.env.example` e configure conforme sua hospedagem. O projeto suporta banco LibSQL/Turso e mantém as fichas isoladas por usuário.

## Conferência do código

```bash
npm run check
```

O arquivo `REVISAO-GRIMORIO-v2.2.md` resume as principais decisões de fidelidade mecânica desta versão.

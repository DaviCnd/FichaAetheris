## v2.2.0 — Interface Grimório e fidelidade de fichas

- Interface redesenhada para acompanhar a identidade visual do Grimório/Livro de Lore: fundo noturno, pergaminho, molduras douradas, serifas e selo celeste.
- Nova biblioteca visual de personagens com cartões, retrato, raça, profissão, nível e origem.
- Upload de retrato do personagem; a imagem é reduzida no navegador e salva dentro da ficha.
- Navegação em abas: Ficha, Inventário e Anotações.
- Novo painel “Conformidade com o Grimório” para acompanhar a criação inicial.
- Profissões regionais experimentais removidas do seletor de criação; ficam apenas as 12 profissões oficiais do Grimório. Fichas antigas são migradas para a profissão-base.
- “Crítico Aprimorado” voltou a ser um único talento com escolha entre físico ou mágico.
- “Especialista” agora concede +1 a duas perícias escolhidas, em vez de aumentar o pool geral.
- “Ritualista” aplica +1 em Rituais.
- “Armadura Treinada” escolhe uma categoria e ignora apenas suas penalidades; requisito de Força continua valendo.
- Penalidade de -1 em Furtividade da armadura média aplicada ao Total da Perícia.
- “Poder Assinatura” só pode marcar um poder por vez.
- Corrupção 6–8 permite escolher entre +1 PE nas bênçãos ou teste de Favor.
- Tipos de pacto oficiais adicionados ao formulário.
- API de listagem de fichas agora retorna um resumo seguro para a biblioteca de personagens.

# Alterações — Edição Expandida v2.1

## Profissões regionais

- Adicionadas 66 profissões regionais distribuídas entre Elyndar, Vharos, Lethra Velada, Veylan Nexus, Tsukihana, Sahra'Nür, Ilhas Derivantes, Campo das Ilhas Destroçadas, Borda do Abismo e Abismo.
- A lista de profissão agora se adapta automaticamente à região de origem.
- As 12 profissões gerais permanecem disponíveis como opções de estrangeiro, viajante ou formação independente.
- Cada profissão regional possui descrição, talento profissional, equipamento e, quando necessário, perícias ou status próprios.
- Fichas salvas com profissão de outra região continuam carregando sem perda de dados.
- Profissões antigas conhecidas são migradas para seus equivalentes regionais quando possível.

## Sistema de ficha preservado

- Progressão por marcos do nível 1 ao 10.
- Atributos, limites e fórmulas derivados do Grimório de Aetheris — Edição Expandida.
- Raças, profissões, Caminhos, perícias, Treino, Maestrias, talentos e Capstones.
- PV, PE, Defesa, Movimento, Resistência à Corrupção e Integridade da Alma calculados automaticamente.
- Descansos, condições, ferimentos e Testes de Caminho.

## Poderes e espiritualidade

- Criador modular de poderes Comuns, Intermediários, Avançados e Supremos.
- Cálculo automático de custo, limitações e validações por categoria.
- Patrono, Favor Divino e seleção individual das bênçãos detalhadas do grimório.
- Caminhos Devoto, Livre e Pactuário.
- Pacto abissal completo e medidor de Corrupção de 0 a 10.

## Equipamento e campanha

- Armas, armaduras, escudo, capacidade de inventário e sobrecarga.
- Consumíveis, relíquias, reputações, favores e dívidas de facção.
- Exportação e importação de ficha em JSON.

## Compatibilidade

- O banco existente continua válido porque as fichas são armazenadas como JSON.
- Fichas antigas são convertidas automaticamente quando abertas.
- Após a conversão, atributos, profissão e bênçãos devem ser revisados antes de salvar.

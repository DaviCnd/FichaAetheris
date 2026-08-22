window.AETHERIS_DATA = {
  "version": 2.2,
  "regions": [
    "Elyndar",
    "Vharos",
    "Lethra Velada",
    "Veylan Nexus",
    "Tsukihana",
    "Sahra'Nür",
    "Ilhas Derivantes",
    "Campo das Ilhas Destroçadas",
    "Outra"
  ],
  "attributes": [
    "forca",
    "destreza",
    "intelecto",
    "vontade",
    "fe"
  ],
  "attributeLabels": {
    "forca": "Força",
    "destreza": "Destreza",
    "intelecto": "Intelecto",
    "vontade": "Vontade",
    "fe": "Fé"
  },
  "skills": [
    {
      "group": "Força",
      "attr": "forca",
      "items": [
        "Atletismo",
        "Escalada",
        "Intimidação"
      ]
    },
    {
      "group": "Destreza",
      "attr": "destreza",
      "items": [
        "Acrobacia",
        "Reflexos",
        "Furtividade",
        "Prestidigitação",
        "Pontaria",
        "Iniciativa"
      ]
    },
    {
      "group": "Intelecto",
      "attr": "intelecto",
      "items": [
        "Investigação",
        "História",
        "Religião",
        "Ocultismo",
        "Medicina",
        "Alquimia",
        "Engenharia",
        "Estratégia"
      ]
    },
    {
      "group": "Vontade",
      "attr": "vontade",
      "items": [
        "Intuição",
        "Percepção",
        "Concentração",
        "Resistência Mental",
        "Sobrevivência"
      ]
    },
    {
      "group": "Fé",
      "attr": "fe",
      "items": [
        "Persuasão",
        "Cura",
        "Rituais"
      ]
    }
  ],
  "paths": {
    "Devoto": {
      "benefit": "Escolha uma divindade patrona e duas bênçãos de custo até 5.",
      "limit": "Favor Divino, dogmas e corrupção típica."
    },
    "Livre": {
      "benefit": "Dois poderes Comuns e um talento adicional.",
      "limit": "Não recebe milagres sem criar vínculo posterior."
    },
    "Pactuário": {
      "benefit": "Um pacto menor e um poder abissal.",
      "limit": "Começa com 1 Corrupção e uma Marca de Pacto."
    }
  },
  "races": {
    "humanos": {
      "label": "Humanos",
      "summary": "Adaptação e organização social.",
      "traits": [
        {
          "name": "Versatilidade",
          "effect": "Receba 1 ponto adicional de Treino."
        },
        {
          "name": "Aprendizado Rápido",
          "effect": "Uma vez por sessão, após falhar em uma perícia treinada, repita o teste."
        },
        {
          "name": "Distribuição",
          "effect": "Qualquer região e Caminho."
        }
      ],
      "trainingBonus": 1
    },
    "lupir": {
      "label": "Lupir",
      "summary": "Instinto de matilha, olfato e resistência.",
      "traits": [
        {
          "name": "Olfato Aguçado",
          "effect": "+2 em Percepção e Sobrevivência baseadas em cheiro."
        },
        {
          "name": "Matilha",
          "effect": "Como Reação, conceda +1 Defesa a aliado adjacente ou mova 2m em direção a ele."
        },
        {
          "name": "Corpo Resistente",
          "effect": "+3 PV máximos."
        }
      ],
      "statBonus": {
        "pv": 3
      }
    },
    "feliri": {
      "label": "Feliri",
      "summary": "Reflexos predatórios, graça e independência.",
      "traits": [
        {
          "name": "Visão na Penumbra",
          "effect": "Ignora desvantagem por baixa luz."
        },
        {
          "name": "Reflexo Felino",
          "effect": "+1 Defesa quando não usa armadura pesada."
        },
        {
          "name": "Queda Graciosa",
          "effect": "Reduza dano de queda em 2d6 e levante sem custo uma vez por rodada."
        }
      ],
      "conditionalDefense": 1
    },
    "avaris": {
      "label": "Avaris",
      "summary": "Visão aérea, precisão e mobilidade.",
      "traits": [
        {
          "name": "Olhos do Céu",
          "effect": "+2 em Percepção visual e Pontaria a longa distância."
        },
        {
          "name": "Linhagem Alada",
          "effect": "Voo 6m; após o primeiro turno, gaste 1 PE por turno para continuar voando. Armadura pesada impede voo."
        },
        {
          "name": "Linhagem Não Alada",
          "effect": "Movimento +2m e vantagem em Reflexos contra quedas."
        }
      ],
      "lineageChoice": true
    },
    "reptilianos": {
      "label": "Reptilianos",
      "summary": "Paciência, adaptação térmica e escamas.",
      "traits": [
        {
          "name": "Escamas",
          "effect": "+1 Defesa natural."
        },
        {
          "name": "Sangue Frio",
          "effect": "Resistência a calor ambiental e +2 contra Veneno e Medo comum."
        },
        {
          "name": "Metabolismo Lento",
          "effect": "Pode passar três dias com metade de alimento e água sem Exaustão."
        }
      ],
      "statBonus": {
        "defesa": 1
      }
    },
    "veylans": {
      "label": "Veylans",
      "summary": "Disciplina mental e análise.",
      "traits": [
        {
          "name": "Mente Ordenada",
          "effect": "+2 em Resistência Mental contra Confusão, Medo e Dominação."
        },
        {
          "name": "Análise Fria",
          "effect": "Uma vez por cena, use Intelecto no lugar de Vontade em Intuição ou Concentração."
        },
        {
          "name": "Repressão",
          "effect": "Ao falhar criticamente em teste social emocional, -1 em Persuasão até o fim da cena."
        }
      ]
    },
    "ethereals": {
      "label": "Ethereals",
      "summary": "Existência parcial e sensibilidade espiritual.",
      "traits": [
        {
          "name": "Sentir Almas",
          "effect": "Percebe presença espiritual em 6m, sem identificar detalhes."
        },
        {
          "name": "Desfase",
          "effect": "Gaste 2 PE como Reação para receber +4 Defesa contra um ataque físico."
        },
        {
          "name": "Corpo Frágil",
          "effect": "-3 PV máximos; resistência a dano Psíquico."
        }
      ],
      "statBonus": {
        "pv": -3
      }
    },
    "ossideos": {
      "label": "Ossídeos",
      "summary": "Mortos conscientes presos a dever, memória ou falha espiritual.",
      "traits": [
        {
          "name": "Corpo sem Dor",
          "effect": "Imune a Sangramento, Veneno e doenças comuns; não precisa respirar."
        },
        {
          "name": "Estrutura Óssea",
          "effect": "Resistência a Perfuração e vulnerabilidade a Impacto."
        },
        {
          "name": "Reparação",
          "effect": "Medicina e Cura funcionam normalmente, descritas conforme o corpo."
        }
      ]
    }
  },
  "professions": {
    "Guerreiro": {
      "summary": "Soldado, gladiador, guarda ou mercenário.",
      "skillBonus": {
        "Atletismo": 1,
        "Resistência Mental": 1
      },
      "statBonus": {
        "pv": 4
      },
      "talent": "Postura Marcial: escolha Ofensiva (+1 dano) ou Defensiva (+1 Defesa) no início do turno.",
      "equipment": "Arma marcial, armadura média, kit de viagem."
    },
    "Caçador": {
      "summary": "Rastreador, arqueiro, batedor ou predador de criaturas.",
      "skillBonus": {
        "Pontaria": 1,
        "Sobrevivência": 1
      },
      "statBonus": {
        "pv": 2
      },
      "talent": "Marca da Presa: Ação para marcar alvo visível; +1d4 no primeiro dano por rodada contra ele.",
      "equipment": "Arma à distância, faca, corda, kit de caça."
    },
    "Duelista": {
      "summary": "Especialista em precisão, mobilidade e combate individual.",
      "skillBonus": {
        "Acrobacia": 1,
        "Iniciativa": 1
      },
      "statBonus": {
        "pv": 2
      },
      "talent": "Riposta: após inimigo errar ataque corpo a corpo, gaste Reação para mover 2m ou atacar com -2.",
      "equipment": "Arma ágil, armadura leve, vestes formais."
    },
    "Sacerdote": {
      "summary": "Condutor de ritos, curandeiro ou representante de culto.",
      "skillBonus": {
        "Religião": 1,
        "Rituais": 1
      },
      "statBonus": {
        "pe": 4
      },
      "talent": "Canalizar: uma vez por cena, reduza em 2 PE o custo de bênção de Suporte ou Utilitário.",
      "equipment": "Símbolo sagrado, vestes, kit ritual."
    },
    "Escriba Rúnico": {
      "summary": "Estudioso de Toth, selos e magia técnica.",
      "skillBonus": {
        "Ocultismo": 1,
        "Engenharia": 1
      },
      "statBonus": {
        "pe": 4
      },
      "talent": "Preparação Rúnica: após descanso, escolha um poder Comum; a primeira utilização custa -1 PE.",
      "equipment": "Ferramentas de escrita, foco rúnico, livro."
    },
    "Investigador": {
      "summary": "Agente, inquisidor, detetive ou caçador de segredos.",
      "skillBonus": {
        "Investigação": 1,
        "Intuição": 1
      },
      "statBonus": {
        "pv": 2
      },
      "talent": "Reconstruir Cena: uma vez por cena, faça ao mestre uma pergunta objetiva sobre evidência presente.",
      "equipment": "Lupa, registros, arma simples, kit de coleta."
    },
    "Alquimista": {
      "summary": "Criador de reagentes, venenos, remédios e explosivos.",
      "skillBonus": {
        "Alquimia": 1,
        "Medicina": 1
      },
      "statBonus": {
        "pe": 2
      },
      "talent": "Preparos: após descanso longo, crie dois consumíveis comuns sem custo narrativo.",
      "equipment": "Kit alquímico, frascos, máscara, reagentes."
    },
    "Navegador Celeste": {
      "summary": "Piloto, mensageiro, explorador de rotas e ilhas.",
      "skillBonus": {
        "Percepção": 1,
        "Engenharia": 1
      },
      "statBonus": {
        "pv": 2
      },
      "talent": "Ler Correntes: grupo recebe +2 em testes de viagem aérea e evita a primeira complicação menor.",
      "equipment": "Instrumentos de navegação, arma leve, mapa."
    },
    "Mercador Diplomata": {
      "summary": "Negociador, representante, contrabandista ou corretor de favores.",
      "skillBonus": {
        "Persuasão": 1,
        "História": 1
      },
      "statBonus": {
        "pe": 2
      },
      "talent": "Rede de Contatos: uma vez por sessão, declare um contato plausível na região atual.",
      "equipment": "Roupas adequadas, documentos, mercadoria de troca."
    },
    "Espião": {
      "summary": "Infiltrador, ladrão, informante ou assassino.",
      "skillBonus": {
        "Furtividade": 1,
        "Prestidigitação": 1
      },
      "statBonus": {
        "pv": 2
      },
      "talent": "Golpe de Oportunidade: +1d6 contra alvo surpreendido ou que ainda não agiu.",
      "equipment": "Arma discreta, ferramentas, disfarce."
    },
    "Guardião Funerário": {
      "summary": "Protetor de tumbas, exorcista ou condutor de mortos.",
      "skillBonus": {
        "Rituais": 1,
        "Resistência Mental": 1
      },
      "statBonus": {
        "pv": 2,
        "pe": 2
      },
      "talent": "Círculo de Repouso: em descanso curto, aliados recuperam +1d6 PV e recebem +1 contra possessão.",
      "equipment": "Arma ritual, sal, sinos, kit funerário."
    },
    "Estrategista": {
      "summary": "Comandante, analista ou oficial de Veylan.",
      "skillBonus": {
        "Estratégia": 1,
        "Concentração": 1
      },
      "statBonus": {
        "pe": 2
      },
      "talent": "Ordem Tática: gaste Ação; aliado em 10m move 2m e recebe +2 no próximo teste.",
      "equipment": "Mapa tático, foco de comando, arma simples."
    }
  },
  "regionalProfessions": {
    "Elyndar": [
      {
        "name": "Guardião Celestial",
        "base": "Guerreiro",
        "summary": "Soldado de pontes, templos e arquivos sagrados de Elyndar.",
        "talent": "Vigília Solar: quando protege um aliado ou entrada consagrada, recebe +1 Defesa até o início do próximo turno.",
        "equipment": "Arma marcial, armadura média, escudo cerimonial e insígnia celestial."
      },
      {
        "name": "Sacerdote Solar",
        "base": "Sacerdote",
        "summary": "Ministro dos cultos de Hélio ou Rá, responsável por ritos públicos e purificação.",
        "talent": "Ofício da Revelação: uma vez por cena, ao usar Rituais para revelar mentira, disfarce ou corrupção, role com vantagem.",
        "equipment": "Símbolo solar, vestes claras, kit ritual e incenso purificador."
      },
      {
        "name": "Escriba de Toth",
        "base": "Escriba Rúnico",
        "summary": "Registrador de leis, linhagens, selos e permissões religiosas.",
        "talent": "Autoridade do Registro: uma vez por sessão, apresente um documento, selo ou precedente plausível que conceda acesso burocrático limitado.",
        "equipment": "Foco rúnico, ferramentas de escrita, códice legal e selo oficial."
      },
      {
        "name": "Inquisidor da Pureza",
        "base": "Investigador",
        "summary": "Agente religioso que investiga heresia, pactos e desvios espirituais.",
        "talent": "Interrogatório Doutrinário: após observar uma contradição, receba +2 no próximo teste de Intuição ou Persuasão contra o mesmo alvo.",
        "equipment": "Registros de acusação, arma simples, símbolo de autoridade e kit de coleta."
      },
      {
        "name": "Arqueiro Cerimonial",
        "base": "Caçador",
        "summary": "Vigia Avaris ou humano treinado para defender torres, procissões e rotas altas.",
        "talent": "Tiro de Sentinela: se não se mover no turno, o primeiro ataque à distância recebe +2.",
        "equipment": "Arco longo, aljava, armadura leve e manto de vigia."
      },
      {
        "name": "Diplomata de Linhagem",
        "base": "Mercador Diplomata",
        "summary": "Representante de casa nobre, templo ou autoridade celestial.",
        "talent": "Nome de Família: uma vez por sessão, invoque uma linhagem ou patrono para obter audiência formal, sem garantir cooperação.",
        "equipment": "Vestuário nobre, documentos, presente diplomático e arma discreta."
      },
      {
        "name": "Jardineiro da Harmonia",
        "base": "Alquimista",
        "summary": "Cultivador dos jardins suspensos, ervas rituais e plantas celestiais.",
        "talent": "Essência Serena: após descanso longo, prepare um bálsamo que remove Medo leve ou concede +1 contra corrupção por uma cena.",
        "equipment": "Kit botânico, tesoura ritual, frascos e sementes raras.",
        "skillBonus": {
          "Alquimia": 1,
          "Cura": 1
        }
      }
    ],
    "Vharos": [
      {
        "name": "Gladiador Carmesim",
        "base": "Guerreiro",
        "summary": "Combatente treinado nos ritos, duelos e julgamentos do Coliseu Carmesim.",
        "talent": "Aclamação da Arena: ao reduzir um inimigo a 0 PV ou vencer um duelo, recupere 1 PE uma vez por cena.",
        "equipment": "Arma de arena, armadura média, faixa de clã e troféu de combate."
      },
      {
        "name": "Mercenário de Clã",
        "base": "Guerreiro",
        "summary": "Soldado contratado que luta por companhia, bandeira e juramento.",
        "talent": "Contrato de Sangue: escolha um aliado no início da cena; +1 em ataques contra quem o ferir até o fim do próximo turno.",
        "equipment": "Arma marcial, armadura média, contrato e kit de campanha."
      },
      {
        "name": "Caçador de Bestas",
        "base": "Caçador",
        "summary": "Rastreador de predadores das rochas vermelhas e monstros de arena.",
        "talent": "Conhecer a Fera: após um teste bem-sucedido de Sobrevivência, descubra uma resistência ou padrão de ataque da criatura.",
        "equipment": "Arma à distância, lança, armadilhas e kit de caça."
      },
      {
        "name": "Sacerdote de Montus",
        "base": "Sacerdote",
        "summary": "Condutor de ritos físicos, provas de resistência e juramentos de combate.",
        "talent": "Rito da Resistência: uma vez por cena, um aliado que receber cura também ignora penalidades de ferimento até o próximo turno.",
        "equipment": "Símbolo de Montus, ataduras, óleo ritual e arma de impacto.",
        "skillBonus": {
          "Atletismo": 1,
          "Rituais": 1
        },
        "statBonus": {
          "pv": 2,
          "pe": 2
        }
      },
      {
        "name": "Ferreiro de Guerra",
        "base": "Alquimista",
        "summary": "Artesão de armas, armaduras, correntes e reparos de campanha.",
        "talent": "Reforço de Campo: em uma pausa, conceda +1 dano a uma arma ou +1 Defesa a uma armadura até o próximo descanso.",
        "equipment": "Ferramentas de ferreiro, martelo, peças metálicas e avental resistente.",
        "skillBonus": {
          "Engenharia": 1,
          "Alquimia": 1
        }
      },
      {
        "name": "Estrategista de Arena",
        "base": "Estrategista",
        "summary": "Treinador, árbitro ou comandante acostumado a ler formações e duelos.",
        "talent": "Leitura do Círculo: no primeiro turno, indique um ponto de vantagem; um aliado que o ocupar recebe +2 no próximo teste.",
        "equipment": "Mapa de arena, apito, arma simples e insígnia de treinador."
      },
      {
        "name": "Batedor das Correntes",
        "base": "Navegador Celeste",
        "summary": "Explorador das pontes, correntes e penhascos que conectam as fortalezas de Vharos.",
        "talent": "Passo sobre o Vazio: vantagem em Acrobacia ou Reflexos para atravessar correntes, bordas estreitas e estruturas instáveis.",
        "equipment": "Gancho, corda reforçada, arma leve e sinalizadores.",
        "skillBonus": {
          "Acrobacia": 1,
          "Sobrevivência": 1
        }
      }
    ],
    "Lethra Velada": [
      {
        "name": "Sacerdote Funerário",
        "base": "Sacerdote",
        "summary": "Responsável por nomes, corpos, ritos de passagem e registros dos mortos.",
        "talent": "Último Nome: ao conduzir um rito correto, o grupo recebe +1 contra possessão e medo espiritual por uma cena.",
        "equipment": "Símbolo funerário, livro de nomes, velas e kit ritual."
      },
      {
        "name": "Exorcista",
        "base": "Guardião Funerário",
        "summary": "Especialista em possessões, espíritos hostis e áreas assombradas.",
        "talent": "Quebra de Vínculo: uma vez por cena, conceda nova resistência a um aliado contra possessão, Dominação ou medo espiritual.",
        "equipment": "Arma ritual, sal, sinos, correntes e selos funerários."
      },
      {
        "name": "Guardião das Tumbas",
        "base": "Guardião Funerário",
        "summary": "Protetor de cemitérios, criptas e corpos consagrados.",
        "talent": "Nada Passa: enquanto permanecer junto a uma entrada, túmulo ou aliado caído, recebe +1 Defesa e não pode ser empurrado.",
        "equipment": "Arma ritual, armadura média, lanterna de névoa e selo de tumba.",
        "skillBonus": {
          "Rituais": 1,
          "Atletismo": 1
        },
        "statBonus": {
          "pv": 4
        }
      },
      {
        "name": "Médium das Névoas",
        "base": "Investigador",
        "summary": "Intérprete de ecos, memórias e vozes que atravessam a névoa de Lethra.",
        "talent": "Escutar o Eco: uma vez por cena, pergunte qual emoção ou memória mais forte marcou o local.",
        "equipment": "Sinos pequenos, diário, foco espiritual e proteção leve.",
        "skillBonus": {
          "Intuição": 1,
          "Ocultismo": 1
        },
        "statBonus": {
          "pe": 2
        }
      },
      {
        "name": "Recuperador de Relíquias",
        "base": "Espião",
        "summary": "Explorador discreto de ruínas, túmulos e locais espiritualmente instáveis.",
        "talent": "Mãos Cuidadosas: +2 em Prestidigitação ou Investigação para retirar relíquias sem ativar armadilhas espirituais.",
        "equipment": "Ferramentas finas, arma discreta, corda e recipientes selados.",
        "skillBonus": {
          "Prestidigitação": 1,
          "Investigação": 1
        }
      },
      {
        "name": "Vigia dos Sinos",
        "base": "Caçador",
        "summary": "Sentinela que patrulha cemitérios suspensos e responde a sinos sem vento.",
        "talent": "Alarme Funerário: não pode ser surpreendido por mortos-vivos ou criaturas espirituais enquanto estiver consciente.",
        "equipment": "Arco curto, sino de aviso, manto de névoa e sal."
      },
      {
        "name": "Condutor de Mortos",
        "base": "Navegador Celeste",
        "summary": "Guia de procissões, barcos funerários e rotas seguras para almas e enlutados.",
        "talent": "Caminho do Repouso: durante viagens espirituais, o grupo ignora a primeira complicação causada por desorientação ou assombração.",
        "equipment": "Lanterna funerária, mapa de necrópoles, vara ritual e corda.",
        "skillBonus": {
          "Rituais": 1,
          "Percepção": 1
        },
        "statBonus": {
          "pe": 2
        }
      }
    ],
    "Veylan Nexus": [
      {
        "name": "Arquivista do Nexus",
        "base": "Investigador",
        "summary": "Responsável por registros, classificação de dados e acesso a arquivos vigiados.",
        "talent": "Referência Cruzada: uma vez por cena, após encontrar uma pista escrita, descubra onde procurar a próxima informação relacionada.",
        "equipment": "Instrumentos de registro, lentes, credencial e arma simples.",
        "skillBonus": {
          "Investigação": 1,
          "História": 1
        }
      },
      {
        "name": "Estrategista do Nexus",
        "base": "Estrategista",
        "summary": "Analista de operações, formações e riscos calculados.",
        "talent": "Plano Contingente: uma vez por cena, quando um aliado falhar, conceda +2 à próxima tentativa diferente de resolver o mesmo problema.",
        "equipment": "Mapa tático, foco de comando, marcador geométrico e arma simples."
      },
      {
        "name": "Arcanista Geométrico",
        "base": "Escriba Rúnico",
        "summary": "Técnico de selos, campos de energia e padrões arcanos.",
        "talent": "Geometria Estável: a primeira área criada por um poder em cada cena pode excluir um aliado do efeito.",
        "equipment": "Foco geométrico, compasso rúnico, cristais e códice."
      },
      {
        "name": "Investigador Psíquico",
        "base": "Investigador",
        "summary": "Agente treinado para detectar manipulação mental, memórias artificiais e ilusões conscientes.",
        "talent": "Âncora Mental: uma vez por cena, receba vantagem para resistir a Confusão ou ilusão e identifique sua origem aproximada.",
        "equipment": "Foco mental, registros lacrados, arma discreta e cristais de memória.",
        "skillBonus": {
          "Resistência Mental": 1,
          "Investigação": 1
        }
      },
      {
        "name": "Engenheiro de Ressonância",
        "base": "Alquimista",
        "summary": "Construtor de pontes de energia, autômatos e amplificadores arcanos.",
        "talent": "Calibrar Estrutura: em uma pausa, conceda +2 no próximo teste de Engenharia do grupo ou restaure um dispositivo simples.",
        "equipment": "Ferramentas arcanas, cristais azuis, luvas e peças de reposição.",
        "skillBonus": {
          "Engenharia": 1,
          "Concentração": 1
        }
      },
      {
        "name": "Observador Estelar",
        "base": "Navegador Celeste",
        "summary": "Estudioso das ilhas móveis, correntes celestes e fenômenos do céu.",
        "talent": "Previsão de Rota: antes de uma viagem, identifique a ameaça ambiental mais provável e conceda +2 para evitá-la.",
        "equipment": "Luneta, mapas estelares, instrumentos de cálculo e arma leve.",
        "skillBonus": {
          "Percepção": 1,
          "Estratégia": 1
        }
      },
      {
        "name": "Agente Analítico",
        "base": "Espião",
        "summary": "Operador externo do Nexus, treinado para infiltração sem perder disciplina.",
        "talent": "Perfil Comportamental: após observar um alvo por um turno, receba +2 no próximo teste social ou furtivo contra ele.",
        "equipment": "Disfarce sóbrio, ferramentas, foco de memória e arma discreta.",
        "skillBonus": {
          "Intuição": 1,
          "Furtividade": 1
        }
      }
    ],
    "Tsukihana": [
      {
        "name": "Samurai de Clã",
        "base": "Duelista",
        "summary": "Guerreiro juramentado a uma casa, templo ou senhor de ilha.",
        "talent": "Juramento da Lâmina: escolha um dever na cena; ao agir diretamente por ele, receba +1 Defesa até o próximo turno.",
        "equipment": "Lâmina cerimonial, armadura leve ou média, brasão e kit de viagem."
      },
      {
        "name": "Shinobi",
        "base": "Espião",
        "summary": "Infiltrador, mensageiro secreto ou assassino a serviço de um clã.",
        "talent": "Passo entre Sombras: após usar Furtividade com sucesso, mova 2m sem provocar reação.",
        "equipment": "Armas discretas, ferramentas, máscara e bombas de fumaça."
      },
      {
        "name": "Sacerdote Lunar",
        "base": "Sacerdote",
        "summary": "Devoto de Nyx ou guardião de ritos lunares e juramentos quebrados.",
        "talent": "Véu da Lua: uma vez por cena, conceda +2 Defesa a um aliado em penumbra até o próximo turno.",
        "equipment": "Símbolo lunar, vestes rituais, sinos e lâmina curta.",
        "skillBonus": {
          "Rituais": 1,
          "Ocultismo": 1
        }
      },
      {
        "name": "Ritualista de Espíritos",
        "base": "Guardião Funerário",
        "summary": "Médium e exorcista que negocia com ancestrais, máscaras e sombras de juramento.",
        "talent": "Etiqueta Espiritual: espíritos não hostis iniciam encontros um passo mais receptivos quando o ritual correto é respeitado.",
        "equipment": "Talismãs, máscara ritual, sal, incenso e arma cerimonial.",
        "skillBonus": {
          "Rituais": 1,
          "Intuição": 1
        },
        "statBonus": {
          "pe": 4
        }
      },
      {
        "name": "Ferreiro Cerimonial",
        "base": "Alquimista",
        "summary": "Artesão de armas de clã, armaduras e objetos com significado espiritual.",
        "talent": "Nome da Arma: após um descanso longo, nomeie e prepare uma arma; seu primeiro acerto crítico causa +1d6.",
        "equipment": "Ferramentas de forja, martelo, inscrições e materiais de reparo.",
        "skillBonus": {
          "Engenharia": 1,
          "Ocultismo": 1
        }
      },
      {
        "name": "Arqueiro de Templo",
        "base": "Caçador",
        "summary": "Guardião de portões, pontes vermelhas e santuários nas montanhas.",
        "talent": "Flecha de Advertência: ao acertar um alvo que se aproxima de local protegido, reduza seu movimento em 2m.",
        "equipment": "Arco, aljava, armadura leve e talismã de templo."
      },
      {
        "name": "Curandeiro Hanamori",
        "base": "Alquimista",
        "summary": "Especialista em ervas, venenos e flores espirituais do clã Hanamori.",
        "talent": "Flor de Duas Faces: após descanso longo, prepare uma dose que pode curar 1d6 PV ou causar Veneno Fraco.",
        "equipment": "Kit herbal, agulhas, frascos e flores espirituais.",
        "skillBonus": {
          "Medicina": 1,
          "Alquimia": 1
        },
        "statBonus": {
          "pe": 2
        }
      }
    ],
    "Sahra'Nür": [
      {
        "name": "Mercador de Miraj",
        "base": "Mercador Diplomata",
        "summary": "Negociador de bazar, corretor de informações e especialista em contratos.",
        "talent": "Cláusula Favorável: uma vez por sessão, descubra uma condição oculta, custo adicional ou interesse real em uma negociação.",
        "equipment": "Roupas de comércio, documentos, mercadoria de troca e arma discreta."
      },
      {
        "name": "Navegador das Dunas",
        "base": "Navegador Celeste",
        "summary": "Guia de caravanas pelo Mar de Areia Suspenso e pelas rotas celestes.",
        "talent": "Ler Estrelas e Areia: o grupo recebe +2 em viagem por desertos suspensos e ignora a primeira perda de suprimentos.",
        "equipment": "Instrumentos astronômicos, mapa, véu de areia e arma leve."
      },
      {
        "name": "Guardião de Caravana",
        "base": "Guerreiro",
        "summary": "Protetor de mercadores, peregrinos e cargas entre cidades e portos.",
        "talent": "Formação de Escolta: aliados adjacentes à carga ou ao protegido recebem +1 Defesa contra ataques à distância.",
        "equipment": "Arma marcial, armadura média, escudo e kit de viagem."
      },
      {
        "name": "Astrônomo de Qamarat",
        "base": "Estrategista",
        "summary": "Leitor de estrelas, ilhas móveis e presságios de rota.",
        "talent": "Janela Celeste: uma vez por sessão, determine o melhor momento próximo para viajar, observar ou realizar um ritual astronômico.",
        "equipment": "Luneta, cartas estelares, instrumentos de cálculo e vestes leves.",
        "skillBonus": {
          "História": 1,
          "Estratégia": 1
        },
        "statBonus": {
          "pe": 2
        }
      },
      {
        "name": "Arqueólogo de Ruínas",
        "base": "Investigador",
        "summary": "Explorador das ruínas anteriores à Guerra dos Deuses e de tumbas seladas.",
        "talent": "Camada Antiga: uma vez por cena, identifique a época, cultura ou função provável de uma estrutura ou artefato.",
        "equipment": "Ferramentas de escavação, registros, corda e arma simples.",
        "skillBonus": {
          "História": 1,
          "Investigação": 1
        }
      },
      {
        "name": "Alquimista do Deserto",
        "base": "Alquimista",
        "summary": "Criador de remédios térmicos, venenos, óleos e explosivos de areia.",
        "talent": "Reserva Selada: carregue um preparo adicional que não ocupa espaço de inventário e resiste ao calor.",
        "equipment": "Kit alquímico, máscara, frascos resistentes e reagentes."
      },
      {
        "name": "Contrabandista das Velas Carmesins",
        "base": "Espião",
        "summary": "Agente das rotas ilegais, portos ocultos e leilões de relíquias.",
        "talent": "Manifesto Falso: uma vez por sessão, produza documentação plausível para uma carga pequena ou passagem limitada.",
        "equipment": "Disfarce mercante, ferramentas, compartimento oculto e arma discreta.",
        "skillBonus": {
          "Furtividade": 1,
          "Persuasão": 1
        }
      }
    ],
    "Ilhas Derivantes": [
      {
        "name": "Navegador Errante",
        "base": "Navegador Celeste",
        "summary": "Piloto acostumado a ilhas móveis e rotas que desaparecem por meses.",
        "talent": "Rota Improvisada: quando uma rota muda, faça imediatamente um teste de Percepção ou Engenharia para evitar atraso ou perigo.",
        "equipment": "Instrumentos de navegação, mapas incompletos, corda e arma leve."
      },
      {
        "name": "Mercador Itinerante",
        "base": "Mercador Diplomata",
        "summary": "Comerciante sem território fixo que acompanha mercados temporários.",
        "talent": "Estoque Oportuno: uma vez por sessão, declare que trouxe um item comum plausível para troca.",
        "equipment": "Mercadoria variada, documentos de múltiplos portos e arma discreta."
      },
      {
        "name": "Pirata Celeste",
        "base": "Guerreiro",
        "summary": "Saqueador de navios, ilhas móveis e rotas sem bandeira.",
        "talent": "Abordagem Violenta: no primeiro turno após entrar em um navio ou plataforma inimiga, receba +2m Movimento e +1 dano.",
        "equipment": "Arma marcial, gancho, corda, armadura leve e bandeira pessoal.",
        "skillBonus": {
          "Atletismo": 1,
          "Intimidação": 1
        },
        "statBonus": {
          "pv": 2
        }
      },
      {
        "name": "Cartógrafo de Correntes",
        "base": "Investigador",
        "summary": "Registrador das correntes de vento, rotas instáveis e ilhas desaparecidas.",
        "talent": "Mapa em Movimento: após observar uma área por dez minutos, o grupo recebe +2 para retornar pelo mesmo caminho.",
        "equipment": "Mapas, bússola celeste, instrumentos de desenho e arma simples.",
        "skillBonus": {
          "Engenharia": 1,
          "Investigação": 1
        }
      },
      {
        "name": "Caçador de Tempestades",
        "base": "Caçador",
        "summary": "Batedor que persegue fenômenos celestes e criaturas atraídas por tempestades.",
        "talent": "Olho da Tormenta: resistência a penalidades de visão e movimento causadas por vento ou chuva intensa.",
        "equipment": "Arma à distância, capa reforçada, para-raios e kit de sobrevivência."
      },
      {
        "name": "Contrabandista Errante",
        "base": "Espião",
        "summary": "Transportador de pessoas, cultos e mercadorias entre ilhas sem governo estável.",
        "talent": "Porto Amigo: uma vez por sessão, encontre um abrigo discreto ou contato menor em uma zona móvel.",
        "equipment": "Ferramentas, compartimento oculto, disfarce e arma leve."
      }
    ],
    "Campo das Ilhas Destroçadas": [
      {
        "name": "Caçador de Relíquias",
        "base": "Investigador",
        "summary": "Explorador que busca artefatos entre ruínas giratórias e fragmentos da Guerra Divina.",
        "talent": "Instinto de Relíquia: uma vez por cena, detecte qual objeto próximo possui maior carga mágica ou histórica.",
        "equipment": "Ferramentas de coleta, corda, recipientes selados e arma simples.",
        "skillBonus": {
          "Investigação": 1,
          "Ocultismo": 1
        }
      },
      {
        "name": "Saqueador de Ruínas",
        "base": "Espião",
        "summary": "Especialista em entrar, retirar valor e sair antes que a estrutura desabe.",
        "talent": "Saída Marcada: ao entrar em uma ruína, marque uma rota; receba +2 para escapar por ela durante a cena.",
        "equipment": "Ferramentas, arma discreta, ganchos e bolsas reforçadas.",
        "skillBonus": {
          "Furtividade": 1,
          "Acrobacia": 1
        }
      },
      {
        "name": "Engenheiro de Destroços",
        "base": "Alquimista",
        "summary": "Técnico que reaproveita autômatos quebrados, navios e estruturas instáveis.",
        "talent": "Remendo Improvável: uma vez por cena, faça um dispositivo quebrado funcionar por alguns minutos.",
        "equipment": "Ferramentas arcanas, peças, cristais instáveis e proteção ocular.",
        "skillBonus": {
          "Engenharia": 1,
          "Alquimia": 1
        }
      },
      {
        "name": "Mercenário de Recuperação",
        "base": "Guerreiro",
        "summary": "Combatente contratado para proteger equipes de exploração e cargas raras.",
        "talent": "Prioridade da Carga: ao proteger um objeto ou aliado designado, +1 Defesa e +2 contra empurrões.",
        "equipment": "Arma marcial, armadura média, cordas e contrato."
      },
      {
        "name": "Ocultista de Fragmentos",
        "base": "Escriba Rúnico",
        "summary": "Estudioso dos ecos da Guerra dos Deuses, selos quebrados e essência instável.",
        "talent": "Leitura de Ruptura: uma vez por cena, identifique se uma anomalia é divina, abissal, espiritual ou primordial.",
        "equipment": "Foco rúnico, recipientes de amostra, códice e proteção leve.",
        "skillBonus": {
          "Ocultismo": 1,
          "Concentração": 1
        }
      },
      {
        "name": "Batedor da Ruptura",
        "base": "Navegador Celeste",
        "summary": "Explorador de fragmentos móveis, destroços e passagens que mudam sem padrão.",
        "talent": "Salto Calculado: vantagem no primeiro teste de movimento entre plataformas instáveis em cada cena.",
        "equipment": "Gancho, corda, mapa de fragmentos e arma leve.",
        "skillBonus": {
          "Acrobacia": 1,
          "Percepção": 1
        }
      }
    ],
    "Borda do Abismo": [
      {
        "name": "Exorcista da Borda",
        "base": "Guardião Funerário",
        "summary": "Especialista em mortos sem Caminho, possessões e influência abissal.",
        "talent": "Selo de Limiar: uma vez por cena, crie uma linha curta que criaturas espirituais menores hesitam em atravessar.",
        "equipment": "Arma ritual, sal negro, sinos, correntes e kit funerário."
      },
      {
        "name": "Caçador de Demônios",
        "base": "Caçador",
        "summary": "Rastreador de entidades, pactuários deformados e bestas de queda.",
        "talent": "Marca Abissal: após identificar uma criatura abissal, +1d4 no primeiro dano por rodada contra ela.",
        "equipment": "Arma à distância, lâmina consagrada, armadilhas e kit de sobrevivência.",
        "skillBonus": {
          "Sobrevivência": 1,
          "Ocultismo": 1
        }
      },
      {
        "name": "Contrabandista Abissal",
        "base": "Espião",
        "summary": "Transportador de relíquias, exilados e mercadorias que regiões superiores proíbem.",
        "talent": "Conhecer o Preço: uma vez por sessão, identifique quem compraria, esconderia ou destruiria um objeto proibido.",
        "equipment": "Disfarce, compartimentos ocultos, ferramentas e arma discreta.",
        "skillBonus": {
          "Furtividade": 1,
          "Intuição": 1
        }
      },
      {
        "name": "Vigia das Correntes",
        "base": "Guerreiro",
        "summary": "Sentinela de pontes partidas, correntes antigas e postos de fronteira.",
        "talent": "Âncora do Limiar: não pode ser movido contra a vontade enquanto estiver adjacente a uma estrutura firme.",
        "equipment": "Arma de haste, armadura média, gancho e lanterna."
      },
      {
        "name": "Sobrevivente do Limiar",
        "base": "Navegador Celeste",
        "summary": "Guia de baixa luz, ruínas caídas e rotas próximas ao vazio.",
        "talent": "Instinto de Queda: uma vez por cena, repita um teste de Reflexos ou Sobrevivência contra queda, desabamento ou terreno instável.",
        "equipment": "Corda, ganchos, máscara, suprimentos e arma leve.",
        "skillBonus": {
          "Reflexos": 1,
          "Sobrevivência": 1
        },
        "statBonus": {
          "pv": 2
        }
      },
      {
        "name": "Guardião de Exilados",
        "base": "Mercador Diplomata",
        "summary": "Mediador e protetor de comunidades rejeitadas na fronteira inferior.",
        "talent": "Rede dos Sem Bandeira: uma vez por sessão, encontre abrigo ou informação básica entre exilados locais.",
        "equipment": "Símbolo comunitário, documentos falsos, suprimentos e arma simples.",
        "skillBonus": {
          "Persuasão": 1,
          "Resistência Mental": 1
        },
        "statBonus": {
          "pv": 2
        }
      }
    ],
    "Abismo": [
      {
        "name": "Pactuário Abissal",
        "base": "Escriba Rúnico",
        "summary": "Mortal que estuda e utiliza cláusulas gravadas na alma por entidades do Abismo.",
        "talent": "Cláusula de Emergência: uma vez por sessão, reduza em 2 PE um poder abissal e ganhe 1 Corrupção.",
        "equipment": "Marca de pacto, foco abissal, códice de cláusulas e arma simples.",
        "skillBonus": {
          "Ocultismo": 1,
          "Resistência Mental": 1
        },
        "statBonus": {
          "pe": 4
        }
      },
      {
        "name": "Caçador Abissal",
        "base": "Caçador",
        "summary": "Predador de feras de carne, demônios menores e pactuários transformados.",
        "talent": "Predador do Predador: quando uma criatura abissal causar dano em você, +2 no próximo ataque contra ela.",
        "equipment": "Arma à distância, lâmina pesada, armadilhas e troféus."
      },
      {
        "name": "Explorador da Superfície",
        "base": "Navegador Celeste",
        "summary": "Guia das ruínas do antigo mundo, túneis e zonas espiritualmente deformadas.",
        "talent": "Memória do Solo: +2 em História ou Sobrevivência para interpretar estruturas da Era do Solo.",
        "equipment": "Mapa incompleto, lanterna, corda, máscara e arma leve.",
        "skillBonus": {
          "História": 1,
          "Sobrevivência": 1
        }
      },
      {
        "name": "Cirurgião de Carne",
        "base": "Alquimista",
        "summary": "Curandeiro ou modificador que trabalha com corpos alterados e matéria abissal.",
        "talent": "Sutura Impossível: uma vez por cena, cure 1d6 PV; o alvo sofre -1 em Resistência à Corrupção até o descanso.",
        "equipment": "Instrumentos cirúrgicos, reagentes, máscara e recipientes.",
        "skillBonus": {
          "Medicina": 1,
          "Alquimia": 1
        },
        "statBonus": {
          "pe": 2
        }
      },
      {
        "name": "Exilado Celestial",
        "base": "Guerreiro",
        "summary": "Antigo servidor das regiões superiores ou dos céus que aprendeu a sobreviver abaixo.",
        "talent": "Disciplina Quebrada: uma vez por cena, ignore Medo ou uma ordem de autoridade sobrenatural.",
        "equipment": "Arma antiga, armadura danificada, insígnia removida e suprimentos.",
        "skillBonus": {
          "Resistência Mental": 1,
          "Atletismo": 1
        },
        "statBonus": {
          "pv": 4
        }
      },
      {
        "name": "Coletor de Almas",
        "base": "Guardião Funerário",
        "summary": "Especialista perigoso em localizar, transportar ou aprisionar fragmentos de alma.",
        "talent": "Recipiente Espiritual: carregue com segurança uma alma ou eco menor por uma cena, sob decisão do mestre.",
        "equipment": "Recipiente selado, corrente ritual, foco espiritual e arma curta.",
        "skillBonus": {
          "Ocultismo": 1,
          "Rituais": 1
        },
        "statBonus": {
          "pe": 4
        }
      }
    ]
  },
  "talents": [
    {
      "id": "agil",
      "name": "Ágil",
      "effect": "Movimento +2m.",
      "calc": {
        "movement": 2
      }
    },
    {
      "id": "alma_fortificada",
      "name": "Alma Fortificada",
      "effect": "Integridade da Alma máxima +2.",
      "calc": {
        "soul": 2
      }
    },
    {
      "id": "armadura_treinada",
      "name": "Armadura Treinada",
      "effect": "Ignore a penalidade de uma categoria de armadura."
    },
    {
      "id": "ataque_preciso",
      "name": "Ataque Preciso",
      "effect": "Uma vez por turno, após errar ataque por 2 ou menos, gaste 1 PE para acertar."
    },
    {
      "id": "canal_amplo",
      "name": "Canal Amplo",
      "effect": "PE máximo +5.",
      "calc": {
        "pe": 5
      }
    },
    {
      "id": "critico_aprimorado",
      "name": "Crítico Aprimorado",
      "effect": "Escolha físico ou mágico; a faixa de crítico escolhida passa a 19-20."
    },
    {
      "id": "especialista",
      "name": "Especialista",
      "effect": "Adicione +1 de Treino a duas perícias, respeitando limite."
    },
    {
      "id": "maestria",
      "name": "Maestria",
      "effect": "Uma perícia com Treino 2 passa a 3.",
      "calc": {
        "mastery": 1
      }
    },
    {
      "id": "guarda_costas",
      "name": "Guarda-Costas",
      "effect": "Reação Proteger pode alcançar aliado a 2m."
    },
    {
      "id": "mente_ferro",
      "name": "Mente de Ferro",
      "effect": "Vantagem uma vez por cena contra Medo, Confusão ou Dominação."
    },
    {
      "id": "resiliente",
      "name": "Resiliente",
      "effect": "PV máximo +6.",
      "calc": {
        "pv": 6
      }
    },
    {
      "id": "ritualista",
      "name": "Ritualista",
      "effect": "Rituais levam metade do tempo e recebem +1."
    },
    {
      "id": "sangue_frio",
      "name": "Sangue Frio",
      "effect": "Ao chegar à metade dos PV, recupere PE igual à Vontade uma vez por cena."
    },
    {
      "id": "sortudo",
      "name": "Sortudo",
      "effect": "Uma vez por sessão, repita um d20 seu ou force inimigo a repetir."
    },
    {
      "id": "vinculo_divino",
      "name": "Vínculo Divino",
      "effect": "Favor máximo +1 e aprenda bênção de custo até 5.",
      "calc": {
        "favorMax": 1
      }
    },
    {
      "id": "poder_assinatura",
      "name": "Poder Assinatura",
      "effect": "Escolha um poder; reduza seu custo em 1 PE, mínimo 1."
    },
    {
      "id": "conjurador_seguro",
      "name": "Conjurador Seguro",
      "effect": "Em falha crítica de poder, não sofre reação negativa do próprio poder."
    },
    {
      "id": "sobrevivente",
      "name": "Sobrevivente",
      "effect": "Primeiro Teste de Caminho de cada combate tem vantagem."
    },
    {
      "id": "olhos_atentos",
      "name": "Olhos Atentos",
      "effect": "Percepção Passiva +3.",
      "calc": {
        "passivePerception": 3
      }
    },
    {
      "id": "combate_dupla",
      "name": "Combate em Dupla",
      "effect": "Quando aliado adjacente acerta alvo, receba +2 no próximo ataque contra ele."
    }
  ],
  "capstones": [
    {
      "id": "campeao_mortal",
      "name": "Campeão Mortal",
      "effect": "Uma vez por cena, transforme um acerto em crítico físico."
    },
    {
      "id": "canal_divino",
      "name": "Canal Divino",
      "effect": "Uma vez por sessão, use bênção de custo até 8 sem gastar PE."
    },
    {
      "id": "mestre_arcano",
      "name": "Mestre Arcano",
      "effect": "Um poder Avançado escolhido custa -3 PE."
    },
    {
      "id": "alma_inquebravel",
      "name": "Alma Inquebrável",
      "effect": "Quando ganharia Corrupção, ignore 1 ponto uma vez por sessão."
    },
    {
      "id": "lenda_regional",
      "name": "Lenda Regional",
      "effect": "Vantagem social com uma facção importante e ajuda limitada."
    }
  ],
  "conditions": [
    {
      "id": "agarrado",
      "name": "Agarrado",
      "effect": "Movimento 0. Pode escapar com Ação e teste oposto."
    },
    {
      "id": "atordoado",
      "name": "Atordoado",
      "effect": "-2 Defesa, não usa Reação e desvantagem em ataques."
    },
    {
      "id": "caido",
      "name": "Caído",
      "effect": "Levantar custa metade do Movimento."
    },
    {
      "id": "cego",
      "name": "Cego",
      "effect": "Ataques visuais têm desvantagem; ataques contra ele têm vantagem."
    },
    {
      "id": "confuso",
      "name": "Confuso",
      "effect": "No início do turno, role 1d4 conforme tabela de Confusão."
    },
    {
      "id": "congelado",
      "name": "Congelado",
      "effect": "Movimento pela metade; se total, não age."
    },
    {
      "id": "enfraquecido",
      "name": "Enfraquecido",
      "effect": "Causa 25% menos dano."
    },
    {
      "id": "envenenado",
      "name": "Envenenado",
      "effect": "Desvantagem em testes físicos; pode sofrer dano contínuo."
    },
    {
      "id": "exausto",
      "name": "Exausto",
      "effect": "-2 em testes; novas fontes aumentam até -5."
    },
    {
      "id": "lento",
      "name": "Lento",
      "effect": "Movimento pela metade e não pode Correr."
    },
    {
      "id": "paralisado",
      "name": "Paralisado",
      "effect": "Sem Ação, Movimento ou Reação; ataques adjacentes são críticos."
    },
    {
      "id": "silenciado",
      "name": "Silenciado",
      "effect": "Não usa habilidades que exijam voz, oração ou comando verbal."
    },
    {
      "id": "surdo",
      "name": "Surdo",
      "effect": "Falha em testes puramente sonoros e não recebe comandos verbais."
    },
    {
      "id": "amedrontado",
      "name": "Amedrontado",
      "effect": "-2 em ataques e não se aproxima da fonte."
    }
  ],
  "damageTypes": [
    {
      "name": "Corte",
      "die": "1d8",
      "natural": "Pode abrir ferida; Sangramento exige efeito comprado.",
      "cost": 0
    },
    {
      "name": "Perfuração",
      "die": "1d8",
      "natural": "Ignorar armadura exige melhoria.",
      "cost": 0
    },
    {
      "name": "Impacto",
      "die": "1d10",
      "natural": "Pode empurrar ou derrubar em crítico.",
      "cost": 0
    },
    {
      "name": "Fogo",
      "die": "1d8",
      "natural": "Pode incendiar objetos; Queimadura deve ser comprada.",
      "cost": 0
    },
    {
      "name": "Gelo",
      "die": "1d6",
      "natural": "Pode criar terreno difícil; Lentidão deve ser comprada.",
      "cost": 0
    },
    {
      "name": "Eletricidade",
      "die": "1d10",
      "natural": "Pode afetar mecanismos; Choque deve ser comprado.",
      "cost": 0
    },
    {
      "name": "Veneno",
      "die": "1d6",
      "natural": "Condições devem ser compradas.",
      "cost": 0
    },
    {
      "name": "Ácido",
      "die": "1d8",
      "natural": "Pode corroer objetos desprotegidos.",
      "cost": 0
    },
    {
      "name": "Trevas",
      "die": "1d8",
      "natural": "Interage com sombras e criaturas solares.",
      "cost": 0
    },
    {
      "name": "Luz/Sagrado",
      "die": "1d8",
      "natural": "Forte contra criaturas sombrias conforme a ficha.",
      "cost": 0
    },
    {
      "name": "Som",
      "die": "1d6",
      "natural": "Ignora cobertura visual, mas não barreiras sólidas.",
      "cost": 0
    },
    {
      "name": "Psíquico",
      "die": "1d6",
      "natural": "Criaturas sem mente podem ser imunes.",
      "cost": 0
    },
    {
      "name": "Sangue",
      "die": "1d10",
      "natural": "Pode exigir sangue, ferida ou custo narrativo.",
      "cost": 0
    },
    {
      "name": "Arcano",
      "die": "1d10",
      "natural": "Dano puro, sem efeito natural.",
      "cost": 0
    },
    {
      "name": "Vácuo",
      "die": "1d12",
      "natural": "Em falha crítica, usuário sofre 1d6.",
      "cost": 3
    }
  ],
  "debuffs": [
    {
      "name": "Sangramento",
      "duration": "3 turnos",
      "effect": "1d4/turno",
      "cost": 3
    },
    {
      "name": "Sangramento Profundo",
      "duration": "5 turnos",
      "effect": "1d6/turno",
      "cost": 5
    },
    {
      "name": "Hemorragia",
      "duration": "3 turnos",
      "effect": "1d10/turno",
      "cost": 8
    },
    {
      "name": "Queimadura",
      "duration": "3 turnos",
      "effect": "1d6/turno",
      "cost": 4
    },
    {
      "name": "Incêndio",
      "duration": "5 turnos",
      "effect": "1d8/turno",
      "cost": 7
    },
    {
      "name": "Veneno Fraco",
      "duration": "4 turnos",
      "effect": "1d4/turno",
      "cost": 3
    },
    {
      "name": "Veneno Forte",
      "duration": "6 turnos",
      "effect": "1d6/turno",
      "cost": 6
    },
    {
      "name": "Veneno Mortal",
      "duration": "3 turnos",
      "effect": "1d12/turno",
      "cost": 10
    },
    {
      "name": "Congelamento Leve",
      "duration": "3 turnos",
      "effect": "-2m Movimento",
      "cost": 3
    },
    {
      "name": "Congelamento",
      "duration": "2 turnos",
      "effect": "Movimento pela metade",
      "cost": 5
    },
    {
      "name": "Congelamento Total",
      "duration": "1 turno",
      "effect": "Não age",
      "cost": 8
    },
    {
      "name": "Choque",
      "duration": "1 turno",
      "effect": "Perde Reação",
      "cost": 4
    },
    {
      "name": "Paralisia",
      "duration": "1 turno",
      "effect": "Não age",
      "cost": 8
    },
    {
      "name": "Atordoamento",
      "duration": "1 turno",
      "effect": "-2 Defesa e desvantagem",
      "cost": 5
    },
    {
      "name": "Cegueira",
      "duration": "3 turnos",
      "effect": "Condição Cego",
      "cost": 5
    },
    {
      "name": "Surdez",
      "duration": "3 turnos",
      "effect": "Condição Surdo",
      "cost": 3
    },
    {
      "name": "Silêncio",
      "duration": "2 turnos",
      "effect": "Condição Silenciado",
      "cost": 7
    },
    {
      "name": "Medo",
      "duration": "3 turnos",
      "effect": "-2 ataques e não se aproxima",
      "cost": 3
    },
    {
      "name": "Terror",
      "duration": "2 turnos",
      "effect": "Pode perder Ação",
      "cost": 6
    },
    {
      "name": "Pânico",
      "duration": "1 turno",
      "effect": "Foge ou perde Ação",
      "cost": 8
    },
    {
      "name": "Confusão",
      "duration": "3 turnos",
      "effect": "Tabela de Confusão",
      "cost": 6
    },
    {
      "name": "Dominação Mental",
      "duration": "1 turno",
      "effect": "Controla uma ação do alvo",
      "cost": 10
    },
    {
      "name": "Fraqueza",
      "duration": "4 turnos",
      "effect": "-25% dano",
      "cost": 4
    },
    {
      "name": "Exaustão",
      "duration": "5 turnos",
      "effect": "-2 em testes",
      "cost": 5
    },
    {
      "name": "Lentidão",
      "duration": "3 turnos",
      "effect": "-50% Movimento",
      "cost": 4
    },
    {
      "name": "Maldição",
      "duration": "5 turnos",
      "effect": "-1 em um atributo para testes",
      "cost": 7
    },
    {
      "name": "Marca Sombria",
      "duration": "4 turnos",
      "effect": "Recebe +25% dano",
      "cost": 5
    },
    {
      "name": "Drenagem Vital",
      "duration": "3 turnos",
      "effect": "1d6 dano e cura 1d6",
      "cost": 8
    },
    {
      "name": "Ruína da Alma",
      "duration": "5 turnos",
      "effect": "1d8 espiritual/turno",
      "cost": 9
    }
  ],
  "upgrades": [
    {
      "name": "+1d6 dano",
      "effect": "Aumenta dano inicial; repetições custam +2, +3 e +4.",
      "cost": 2,
      "repeatable": true
    },
    {
      "name": "Área pequena (3m)",
      "effect": "Atinge todos; Reflexos para metade.",
      "cost": 3
    },
    {
      "name": "Área média (10m)",
      "effect": "Grande área; sempre permite resistência.",
      "cost": 6
    },
    {
      "name": "Área grande (20m)",
      "effect": "Exige poder Avançado ou superior.",
      "cost": 10
    },
    {
      "name": "Dano contínuo",
      "effect": "Transforma até metade dos dados em dano por 3 turnos.",
      "cost": 3
    },
    {
      "name": "Ignorar armadura",
      "effect": "Desconsidera bônus de armadura física.",
      "cost": 5
    },
    {
      "name": "Roubar vida",
      "effect": "Cura metade do dano realmente causado.",
      "cost": 6
    },
    {
      "name": "Empurrar",
      "effect": "Move 2m; +2m por sucesso elevado.",
      "cost": 2
    },
    {
      "name": "Derrubar",
      "effect": "Alvo fica Caído se falhar em Reflexos.",
      "cost": 3
    },
    {
      "name": "Teleporte",
      "effect": "Usuário se move até o ponto do efeito.",
      "cost": 8
    },
    {
      "name": "Invocar criatura",
      "effect": "Cria aliado temporário de categoria inferior.",
      "cost": 8
    },
    {
      "name": "Escudo mágico",
      "effect": "Reduz metade do próximo dano recebido.",
      "cost": 5
    },
    {
      "name": "Reflexão",
      "effect": "Devolve metade do próximo dano ao atacante.",
      "cost": 10
    },
    {
      "name": "Alcance longo",
      "effect": "Aumenta alcance de 10m para 30m.",
      "cost": 2
    },
    {
      "name": "Ação rápida",
      "effect": "Usa como Reação ou Ação rápida; apenas 1 por rodada.",
      "cost": 4
    },
    {
      "name": "Sustentado",
      "effect": "Mantém efeito por até 3 turnos com Concentração.",
      "cost": 2
    }
  ],
  "powerForms": [
    {
      "name": "Ataque direto",
      "rule": "Ataque contra Defesa; corpo a corpo ou 10m.",
      "cost": 0
    },
    {
      "name": "Resistência",
      "rule": "Alvo testa resistência contra DT de Poder.",
      "cost": 0
    },
    {
      "name": "Suporte",
      "rule": "Aliado voluntário; sem rolagem.",
      "cost": 0
    },
    {
      "name": "Defesa reativa",
      "rule": "Reação após ser alvo.",
      "cost": 3
    },
    {
      "name": "Aura",
      "rule": "Efeito em 3m enquanto sustentado.",
      "cost": 4
    },
    {
      "name": "Ritual",
      "rule": "Leva 10 minutos ou mais.",
      "cost": -2
    }
  ],
  "limitations": [
    {
      "name": "Componente raro consumível (-1)",
      "cost": -1
    },
    {
      "name": "Componente raro consumível (-2)",
      "cost": -2
    },
    {
      "name": "Componente raro consumível (-3)",
      "cost": -3
    },
    {
      "name": "Só funciona em ambiente específico",
      "cost": -1
    },
    {
      "name": "Usuário sofre 1d6 inevitável",
      "cost": -2
    },
    {
      "name": "Recarga: uma vez por cena",
      "cost": -2
    },
    {
      "name": "Recarga: uma vez por sessão",
      "cost": -4
    },
    {
      "name": "Preparação de 1 turno completo",
      "cost": -2
    },
    {
      "name": "Alvo precisa estar marcado/ferido",
      "cost": -1
    },
    {
      "name": "Poder também afeta o usuário",
      "cost": -2
    }
  ],
  "powerTiers": {
    "Comum": {
      "min": 1,
      "max": 5,
      "damage": 1,
      "effect": 1,
      "upgrade": 0,
      "level": 1
    },
    "Intermediário": {
      "min": 6,
      "max": 10,
      "damage": 2,
      "effect": 2,
      "upgrade": 1,
      "level": 3
    },
    "Avançado": {
      "min": 11,
      "max": 16,
      "damage": 3,
      "effect": 3,
      "upgrade": 2,
      "level": 6
    },
    "Supremo": {
      "min": 17,
      "max": 22,
      "damage": 3,
      "effect": 3,
      "upgrade": 3,
      "level": 9
    }
  },
  "weapons": [
    {
      "name": "Desarmado",
      "damage": "1d4 Impacto",
      "property": "Livre",
      "notes": "Atletismo ou Acrobacia."
    },
    {
      "name": "Adaga",
      "damage": "1d6 Corte/Perfuração",
      "property": "Leve, oculta",
      "notes": "Arremesso 6m."
    },
    {
      "name": "Espada curta",
      "damage": "1d8 Corte",
      "property": "Ágil",
      "notes": "Atletismo ou Acrobacia."
    },
    {
      "name": "Espada longa",
      "damage": "1d10 Corte",
      "property": "Uma mão",
      "notes": "Versátil 1d12."
    },
    {
      "name": "Machado",
      "damage": "1d10 Corte",
      "property": "Brutal",
      "notes": "Crítico +1d6."
    },
    {
      "name": "Martelo",
      "damage": "1d10 Impacto",
      "property": "Pesado",
      "notes": "+2 para derrubar objetos."
    },
    {
      "name": "Lança",
      "damage": "1d8 Perfuração",
      "property": "Alcance 2m",
      "notes": "Arremesso 10m."
    },
    {
      "name": "Arco",
      "damage": "1d8 Perfuração",
      "property": "20m",
      "notes": "Duas mãos."
    },
    {
      "name": "Besta",
      "damage": "1d10 Perfuração",
      "property": "20m, recarga",
      "notes": "Interação simples para recarregar."
    },
    {
      "name": "Arma de fogo arcana",
      "damage": "1d12 Perfuração/Arcano",
      "property": "30m, rara",
      "notes": "Falha crítica exige Engenharia DT 12."
    }
  ],
  "armors": [
    {
      "name": "Sem armadura",
      "defense": 0,
      "movement": 0,
      "stealth": "Nenhuma",
      "strength": 0
    },
    {
      "name": "Leve",
      "defense": 1,
      "movement": 0,
      "stealth": "Nenhuma",
      "strength": 0
    },
    {
      "name": "Média",
      "defense": 2,
      "movement": 0,
      "stealth": "-1 Furtividade",
      "strength": 2
    },
    {
      "name": "Pesada",
      "defense": 3,
      "movement": -2,
      "stealth": "Desvantagem em Furtividade",
      "strength": 3
    }
  ],
  "consumables": [
    {
      "name": "Bandagem de combate",
      "effect": "Encerra Sangramento Fraco ou +2 no próximo teste de Medicina."
    },
    {
      "name": "Tônico restaurador",
      "effect": "Recupera 1d6 PV; usos adicionais na cena causam Exaustão."
    },
    {
      "name": "Essência de foco",
      "effect": "Recupera 1d4 PE; máximo uma por cena."
    },
    {
      "name": "Antídoto comum",
      "effect": "Vantagem contra Veneno Fraco ou encerra com Medicina DT 10."
    },
    {
      "name": "Sal funerário",
      "effect": "+2 em ritual contra espírito, possessão ou morto-vivo."
    },
    {
      "name": "Cristal rúnico",
      "effect": "Substitui componente de poder de custo até 5."
    }
  ],
  "blessings": {
    "Toth": {
      "dominios": "Sabedoria, escrita, criação, leis, runas, ordem estrutural e anjos.",
      "corrupcao": "Frieza extrema, obsessão por controle e incapacidade de ver pessoas como indivíduos.",
      "skills": [
        {
          "nome": "Leitura de Línguas Antigas",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Compreende qualquer texto, fala ou runa antiga ou morta por 10 minutos.",
          "custo": 2,
          "base": false
        },
        {
          "nome": "Criação de Selos",
          "tipo": "UTILITÁRIO",
          "acao": "Ritual",
          "alcance": "Toque",
          "resistencia": "Força/Intelecto",
          "efeito": "Sela uma porta, objeto ou item por algumas horas. Romper exige Força ou Intelecto contra sua DT de Poder.",
          "custo": 3,
          "base": false
        },
        {
          "nome": "Runas de Proteção",
          "tipo": "DEFENSIVO",
          "acao": "Ação",
          "alcance": "Toque",
          "resistencia": "-",
          "efeito": "Reduz pela metade o próximo dano recebido antes do fim da cena.",
          "custo": 5,
          "base": false
        },
        {
          "nome": "Análise de Fraquezas",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "20m",
          "resistencia": "-",
          "efeito": "Após observar um alvo por 1 turno, revela sua maior resistência, vulnerabilidade ou menor defesa.",
          "custo": 3,
          "base": false
        },
        {
          "nome": "Barreiras Geométricas",
          "tipo": "DEFENSIVO",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "-",
          "efeito": "Cria parede rúnica de 6m por 3m, PV 15 + Intelecto × 3, por 2 turnos.",
          "custo": 5,
          "base": false
        },
        {
          "nome": "Criação Temporária de Objetos",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "Toque",
          "resistencia": "-",
          "efeito": "Materializa objeto simples e inanimado que se desfaz em 10 minutos. Não cria relíquias, venenos ou dinheiro.",
          "custo": 4,
          "base": false
        }
      ]
    },
    "Isis": {
      "dominios": "Alma, morte, passagem, memória, repouso e luto.",
      "corrupcao": "Apego excessivo à morte e desejo de controlar o destino das almas.",
      "skills": [
        {
          "nome": "Acalmar Espíritos",
          "tipo": "SUPORTE/CONTROLE",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Resistência Mental",
          "efeito": "Aplica Fraqueza por 4 turnos em espírito agressivo; se ele não estiver em combate, pode encerrar a hostilidade.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Detectar Almas Perdidas",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Percebe presenças espirituais num raio de 10m por uma cena.",
          "custo": 2,
          "base": false
        },
        {
          "nome": "Proteger Contra Possessão",
          "tipo": "DEFENSIVO",
          "acao": "Ação",
          "alcance": "Toque",
          "resistencia": "-",
          "efeito": "Concede imunidade a possessão por uma cena.",
          "custo": 6,
          "base": false
        },
        {
          "nome": "Conduzir Mortos",
          "tipo": "UTILITÁRIO",
          "acao": "Ritual",
          "alcance": "10m",
          "resistencia": "Resistência Mental",
          "efeito": "Guia um espírito menor ao repouso; entidades importantes podem exigir ritual ou missão.",
          "custo": 5,
          "base": false
        },
        {
          "nome": "Selar Cadáveres",
          "tipo": "UTILITÁRIO",
          "acao": "Ritual",
          "alcance": "Toque",
          "resistencia": "-",
          "efeito": "Impede que um corpo seja reanimado ou profanado por sete dias.",
          "custo": 3,
          "base": false
        },
        {
          "nome": "Purificar Áreas de Luto",
          "tipo": "SUPORTE",
          "acao": "Ritual",
          "alcance": "Área 10m",
          "resistencia": "-",
          "efeito": "Remove uma manifestação espiritual menor e reduz em 1 a Corrupção ambiental do local.",
          "custo": 6,
          "base": false
        }
      ]
    },
    "Montus": {
      "dominios": "Corpo, força, sangue, resistência, combate, vitalidade e glória física.",
      "corrupcao": "Vício em combate, desprezo por fraqueza e incapacidade de resolver conflitos sem violência.",
      "skills": [
        {
          "nome": "Aumento de Força Física",
          "tipo": "MELHORIA",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Adiciona +1d6 ao próximo dano físico causado nesta cena.",
          "custo": 2,
          "base": false
        },
        {
          "nome": "Resistência Temporária",
          "tipo": "DEFENSIVO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Reduz todo dano recebido em 25% por 3 turnos.",
          "custo": 5,
          "base": false
        },
        {
          "nome": "Recuperação em Combate",
          "tipo": "SUPORTE",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Cura 1d6 + Força PV imediatamente.",
          "custo": 6,
          "base": false
        },
        {
          "nome": "Golpes de Impacto",
          "tipo": "OFENSIVO",
          "acao": "Ação",
          "alcance": "Corpo a corpo",
          "resistencia": "Defesa",
          "efeito": "Ataque básico de Impacto 1d10; em crítico, escolha empurrar 2m ou derrubar.",
          "custo": 0,
          "base": true
        },
        {
          "nome": "Endurecimento do Corpo",
          "tipo": "DEFENSIVO",
          "acao": "Reação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Como Reação, reduz pela metade uma fonte de Corte ou Perfuração.",
          "custo": 5,
          "base": false
        },
        {
          "nome": "Presença Intimidante",
          "tipo": "CONTROLE",
          "acao": "Ação",
          "alcance": "Área 3m",
          "resistencia": "Resistência Mental",
          "efeito": "Inimigos em 3m testam Resistência Mental ou sofrem Medo por 3 turnos.",
          "custo": 3,
          "base": false
        }
      ]
    },
    "Nyx": {
      "dominios": "Noite, lua, sombras, sonhos, segredos e rejeitados.",
      "corrupcao": "Isolamento, segredo obsessivo e proteção de culpados por pena.",
      "skills": [
        {
          "nome": "Ocultação em Sombras",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "Percepção",
          "efeito": "Fica visualmente indetectável por 2 turnos enquanto permanecer em penumbra; atacar encerra o efeito.",
          "custo": 5,
          "base": false
        },
        {
          "nome": "Sonhos Proféticos",
          "tipo": "UTILITÁRIO",
          "acao": "Ritual",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Durante um descanso, recebe visão parcial de evento futuro próximo, a critério do mestre.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Proteção Noturna",
          "tipo": "DEFENSIVO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Recebe +2 Defesa por uma cena durante a noite ou em ambiente escuro.",
          "custo": 3,
          "base": false
        },
        {
          "nome": "Silêncio Espiritual",
          "tipo": "CONTROLE",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Resistência Mental",
          "efeito": "Aplica Silêncio por 2 turnos.",
          "custo": 7,
          "base": false
        },
        {
          "nome": "Comunicação Onírica",
          "tipo": "UTILITÁRIO",
          "acao": "Ritual",
          "alcance": "Distância regional",
          "resistencia": "-",
          "efeito": "Envia mensagem curta pelos sonhos de aliado conhecido e adormecido.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Véus Contra Perseguição",
          "tipo": "UTILITÁRIO",
          "acao": "Ritual",
          "alcance": "Grupo",
          "resistencia": "Investigação",
          "efeito": "Apaga rastros físicos e espirituais do grupo por algumas horas.",
          "custo": 3,
          "base": false
        }
      ]
    },
    "Hélio": {
      "dominios": "Sol, dia, revelação, julgamento e purificação.",
      "corrupcao": "Fanatismo, incapacidade de perdoar e julgamento sem compaixão.",
      "skills": [
        {
          "nome": "Luz Solar",
          "tipo": "OFENSIVO",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Defesa",
          "efeito": "Ataque básico de Luz/Sagrado 1d8; dobra os dados contra criaturas com vulnerabilidade sombria.",
          "custo": 0,
          "base": true
        },
        {
          "nome": "Fogo Sagrado",
          "tipo": "OFENSIVO",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Defesa/Reflexos",
          "efeito": "Causa Fogo 1d8 e aplica Queimadura por 3 turnos se o alvo falhar em Reflexos.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Detecção de Mentiras",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Resistência Mental",
          "efeito": "Sabe se a última frase de um alvo foi conscientemente falsa.",
          "custo": 3,
          "base": false
        },
        {
          "nome": "Revelação de Invisíveis",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "Área 10m",
          "resistencia": "Ocultismo",
          "efeito": "Revela seres, objetos e disfarces ocultos em 10m por 1 turno.",
          "custo": 5,
          "base": false
        },
        {
          "nome": "Purificação de Corrupção",
          "tipo": "SUPORTE",
          "acao": "Ritual",
          "alcance": "Toque",
          "resistencia": "-",
          "efeito": "Remove 1 ponto de Corrupção de um alvo; cada alvo só pode receber este efeito uma vez por sessão.",
          "custo": 8,
          "base": false
        },
        {
          "nome": "Marca de Julgamento",
          "tipo": "CONTROLE",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Resistência Mental",
          "efeito": "Alvo recebe +25% de dano Sagrado por 4 turnos.",
          "custo": 5,
          "base": false
        }
      ]
    },
    "Zeus": {
      "dominios": "Tempestade, autoridade, soberania, juramento e céu armado.",
      "corrupcao": "Autoritarismo, arrogância e desejo de submissão.",
      "skills": [
        {
          "nome": "Relâmpagos",
          "tipo": "OFENSIVO",
          "acao": "Ação",
          "alcance": "20m",
          "resistencia": "Defesa/Reflexos",
          "efeito": "Eletricidade 1d10; em falha de Reflexos, perde Reação por 1 turno.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Trovões",
          "tipo": "OFENSIVO/CONTROLE",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Reflexos",
          "efeito": "Som 1d6 em área de 3m; pode causar Surdez por 3 turnos.",
          "custo": 3,
          "base": false
        },
        {
          "nome": "Imposição de Presença",
          "tipo": "CONTROLE",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Resistência Mental",
          "efeito": "Aplica Atordoamento por 1 turno.",
          "custo": 5,
          "base": false
        },
        {
          "nome": "Punição de Juramento Quebrado",
          "tipo": "OFENSIVO",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Defesa",
          "efeito": "Eletricidade 1d10, dobrando dados contra alvo que quebrou juramento relevante na campanha.",
          "custo": 0,
          "base": true
        },
        {
          "nome": "Resistência a Intimidação",
          "tipo": "DEFENSIVO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Imunidade a Medo, Terror e Pânico por uma cena.",
          "custo": 5,
          "base": false
        }
      ]
    },
    "Hera": {
      "dominios": "Linhagem, família, realeza, juramentos conjugais e continuidade.",
      "corrupcao": "Obsessão por sangue nobre, perseguição a uniões proibidas e controle familiar.",
      "skills": [
        {
          "nome": "Proteção de Aliado Juramentado",
          "tipo": "DEFENSIVO",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "-",
          "efeito": "Aliado juramentado reduz pela metade o próximo dano recebido.",
          "custo": 5,
          "base": false
        },
        {
          "nome": "Punição de Traidores",
          "tipo": "OFENSIVO",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Defesa",
          "efeito": "Psíquico 1d6, dobrando dados contra quem traiu juramento ou aliança relevante.",
          "custo": 0,
          "base": true
        },
        {
          "nome": "Fortalecimento de Pactos Familiares",
          "tipo": "SUPORTE",
          "acao": "Ação",
          "alcance": "Área 10m",
          "resistencia": "-",
          "efeito": "Até três aliados de sangue ou juramento recebem +1d6 no próximo dano ou +2 Defesa até o próximo turno.",
          "custo": 6,
          "base": false
        },
        {
          "nome": "Autoridade Social",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Vantagem em testes sociais de hierarquia, nobreza ou etiqueta por uma cena.",
          "custo": 3,
          "base": false
        }
      ]
    },
    "Atena": {
      "dominios": "Estratégia, sabedoria militar, técnica, defesa e disciplina.",
      "corrupcao": "Tratar guerra como cálculo e ignorar sofrimento.",
      "skills": [
        {
          "nome": "Leitura de Padrões de Combate",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "20m",
          "resistencia": "-",
          "efeito": "Revela a ação mais provável de inimigo observado; concede +2 Defesa contra ela.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Defesa Perfeita",
          "tipo": "DEFENSIVO",
          "acao": "Reação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Como Reação, reduz o dano físico pela metade e devolve o valor reduzido ao atacante, máximo 15.",
          "custo": 10,
          "base": false
        },
        {
          "nome": "Foco Mental",
          "tipo": "SUPORTE",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "-",
          "efeito": "Remove Confusão ou Atordoamento de si ou aliado.",
          "custo": 5,
          "base": false
        },
        {
          "nome": "Arma Guiada por Estratégia",
          "tipo": "OFENSIVO",
          "acao": "Ação",
          "alcance": "Arma",
          "resistencia": "Defesa",
          "efeito": "Perfuração 1d8 e ignora 1 ponto de Armadura.",
          "custo": 0,
          "base": true
        },
        {
          "nome": "Previsão Tática",
          "tipo": "UTILITÁRIO",
          "acao": "Ritual",
          "alcance": "Grupo",
          "resistencia": "-",
          "efeito": "Concede vantagem no primeiro ataque de batalha planejada com antecedência.",
          "custo": 3,
          "base": false
        }
      ]
    },
    "Ares": {
      "dominios": "Guerra, fúria, violência, coragem e sangue em batalha.",
      "corrupcao": "Massacre, sede de sangue e perda de controle.",
      "skills": [
        {
          "nome": "Fúria de Batalha",
          "tipo": "SUPORTE",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Adiciona +1d6 a ataques físicos por 3 turnos; ao final, sofre Exaustão por 1 turno.",
          "custo": 5,
          "base": false
        },
        {
          "nome": "Dano Aumentado",
          "tipo": "MELHORIA",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Adiciona +1d6 ao próximo golpe físico.",
          "custo": 2,
          "base": false
        },
        {
          "nome": "Resistência à Dor",
          "tipo": "DEFENSIVO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Ignora penalidades de ferimentos e Exaustão por uma cena.",
          "custo": 5,
          "base": false
        },
        {
          "nome": "Grito de Guerra",
          "tipo": "CONTROLE",
          "acao": "Ação",
          "alcance": "Área 3m",
          "resistencia": "Resistência Mental",
          "efeito": "Inimigos em 3m testam Resistência Mental ou sofrem Medo por 3 turnos.",
          "custo": 3,
          "base": false
        },
        {
          "nome": "Presença Aterradora",
          "tipo": "CONTROLE",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Resistência Mental",
          "efeito": "Um alvo sofre Terror por 2 turnos.",
          "custo": 6,
          "base": false
        }
      ]
    },
    "Afrodite": {
      "dominios": "Beleza, desejo, fascínio, influência e obsessão.",
      "corrupcao": "Transformar amor em posse, manipulação e dependência.",
      "skills": [
        {
          "nome": "Encanto",
          "tipo": "CONTROLE",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Resistência Mental",
          "efeito": "Alvo seduzido ou distraído sofre Confusão por 3 turnos.",
          "custo": 6,
          "base": false
        },
        {
          "nome": "Manipulação Emocional",
          "tipo": "CONTROLE",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Resistência Mental",
          "efeito": "Alvo emocionalmente abalado sofre Fraqueza por 4 turnos.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Presença Hipnótica",
          "tipo": "CONTROLE",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Resistência Mental",
          "efeito": "Um alvo não pode atacar diretamente você ou seus aliados por 1 turno.",
          "custo": 8,
          "base": false
        },
        {
          "nome": "Disfarce Social",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "Investigação",
          "efeito": "Altera aparência e voz por uma cena; exame próximo permite Investigação contra sua DT.",
          "custo": 5,
          "base": false
        },
        {
          "nome": "Influência Sobre Desejo",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Resistência Mental",
          "efeito": "NPC torna-se mais receptivo em uma negociação, sem perder livre-arbítrio.",
          "custo": 3,
          "base": false
        }
      ]
    },
    "Apolo": {
      "dominios": "Música, profecia, cura, luz artística e harmonia.",
      "corrupcao": "Obsessão por perfeição e harmonia forçada.",
      "skills": [
        {
          "nome": "Cura Luminosa",
          "tipo": "SUPORTE",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "-",
          "efeito": "Cura 1d8 + Fé PV.",
          "custo": 6,
          "base": false
        },
        {
          "nome": "Música Encantada",
          "tipo": "CONTROLE",
          "acao": "Ação",
          "alcance": "Área 10m",
          "resistencia": "Resistência Mental",
          "efeito": "Inimigos que ouvem sofrem Lentidão por 3 turnos.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Profecias",
          "tipo": "UTILITÁRIO",
          "acao": "Ritual",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Recebe pista narrativa sobre o futuro próximo.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Dissipação de Doenças Espirituais",
          "tipo": "SUPORTE",
          "acao": "Ritual",
          "alcance": "Toque",
          "resistencia": "-",
          "efeito": "Remove Maldição, Ruína da Alma ou doença mágica.",
          "custo": 7,
          "base": false
        },
        {
          "nome": "Inspiração Artística",
          "tipo": "SUPORTE",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "-",
          "efeito": "Aliado recebe vantagem no próximo teste de perícia.",
          "custo": 3,
          "base": false
        }
      ]
    },
    "Ártemis": {
      "dominios": "Caça, lua selvagem, florestas e proteção dos intocados.",
      "corrupcao": "Isolamento extremo, desprezo por civilização e caça obsessiva.",
      "skills": [
        {
          "nome": "Mira Perfeita",
          "tipo": "MELHORIA",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Próximo ataque à distância ignora Armadura e cobertura parcial.",
          "custo": 5,
          "base": false
        },
        {
          "nome": "Rastreio",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Encontra e segue rastro específico; recebe vantagem em Sobrevivência por uma cena.",
          "custo": 3,
          "base": false
        },
        {
          "nome": "Silêncio",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "Percepção",
          "efeito": "Movimento completamente silencioso por 3 turnos.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Comunhão com Bestas",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "-",
          "efeito": "Comunica-se e acalma animais não hostis.",
          "custo": 3,
          "base": false
        },
        {
          "nome": "Proteção Contra Predadores",
          "tipo": "DEFENSIVO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "Resistência Mental",
          "efeito": "Bestas não inteligentes evitam atacar o usuário por uma cena, salvo provocação.",
          "custo": 4,
          "base": false
        }
      ]
    },
    "Hermes": {
      "dominios": "Viagem, comércio, mensagens, furtividade e rotas.",
      "corrupcao": "Trapaça compulsiva, falta de lealdade e vício em vantagem.",
      "skills": [
        {
          "nome": "Velocidade",
          "tipo": "MELHORIA",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Aumenta Movimento em 50% por 3 turnos.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Comunicação à Distância",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "Regional",
          "resistencia": "-",
          "efeito": "Envia mensagem curta a alvo conhecido na mesma região.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Travessia Segura",
          "tipo": "UTILITÁRIO",
          "acao": "Ritual",
          "alcance": "Grupo",
          "resistencia": "-",
          "efeito": "Grupo ignora perigos simples de terreno por uma cena.",
          "custo": 5,
          "base": false
        },
        {
          "nome": "Leitura de Rotas",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Sabe o caminho mais rápido entre pontos conhecidos e detecta desvio recente.",
          "custo": 2,
          "base": false
        },
        {
          "nome": "Furtividade",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Recebe +2 em Furtividade e escapismo por uma cena.",
          "custo": 3,
          "base": false
        }
      ]
    },
    "Hades": {
      "dominios": "Mortos, sepulturas, riquezas subterrâneas e silêncio.",
      "corrupcao": "Apego ao silêncio, frieza absoluta e desejo de manter tudo enterrado.",
      "skills": [
        {
          "nome": "Comunicação com Mortos",
          "tipo": "UTILITÁRIO",
          "acao": "Ritual",
          "alcance": "Toque",
          "resistencia": "-",
          "efeito": "Faz uma pergunta a espírito ligado a túmulo ou corpo; a resposta depende do que ele sabia.",
          "custo": 6,
          "base": false
        },
        {
          "nome": "Proteção Contra Profanação",
          "tipo": "DEFENSIVO",
          "acao": "Ritual",
          "alcance": "Toque",
          "resistencia": "-",
          "efeito": "Protege corpo ou túmulo por sete dias contra invasão e reanimação simples.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Autoridade Sobre Tumbas",
          "tipo": "CONTROLE",
          "acao": "Ação",
          "alcance": "Área 10m",
          "resistencia": "Resistência Mental",
          "efeito": "Mortos-vivos menores sem inteligência obedecem ordens simples por uma cena.",
          "custo": 7,
          "base": false
        },
        {
          "nome": "Resistência Espiritual",
          "tipo": "DEFENSIVO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Recebe +2 em Resistência à Corrupção por uma cena.",
          "custo": 4,
          "base": false
        }
      ]
    },
    "Poseidon": {
      "dominios": "Águas suspensas, mares antigos, tempestades e tremores.",
      "corrupcao": "Temperamento instável e destruição por orgulho.",
      "skills": [
        {
          "nome": "Controle de Água",
          "tipo": "UTILITÁRIO/OFENSIVO",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Defesa",
          "efeito": "Move ou molda água próxima; como ataque causa Impacto 1d6.",
          "custo": 3,
          "base": false
        },
        {
          "nome": "Ondas Suspensas",
          "tipo": "OFENSIVO",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Defesa",
          "efeito": "Impacto 1d10; em crítico, empurra 2m ou derruba.",
          "custo": 0,
          "base": true
        },
        {
          "nome": "Tremores em Ilhas",
          "tipo": "OFENSIVO",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Reflexos",
          "efeito": "Impacto 1d10 em área 3m; Reflexos reduz à metade.",
          "custo": 3,
          "base": false
        },
        {
          "nome": "Tempestades Marítimas",
          "tipo": "OFENSIVO",
          "acao": "Ação",
          "alcance": "20m",
          "resistencia": "Defesa/Reflexos",
          "efeito": "Eletricidade 1d10; pode causar Choque por 1 turno.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Respiração Submersa",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "Toque",
          "resistencia": "-",
          "efeito": "Até três alvos respiram debaixo d’água por uma cena.",
          "custo": 3,
          "base": false
        }
      ]
    },
    "Osíris": {
      "dominios": "Morte justa, renascimento, fertilidade espiritual e julgamento pós-morte.",
      "corrupcao": "Transformar julgamento em condenação fixa e negar mudança.",
      "skills": [
        {
          "nome": "Repouso Espiritual",
          "tipo": "SUPORTE",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Resistência Mental",
          "efeito": "Acalma espírito e encerra hostilidade não violenta.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Restauração",
          "tipo": "SUPORTE",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "-",
          "efeito": "Cura 1d6 + Fé PV ou remove condição negativa leve.",
          "custo": 5,
          "base": false
        },
        {
          "nome": "Proteção Contra Mortos-Vivos",
          "tipo": "DEFENSIVO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Recebe +2 Defesa contra mortos-vivos por uma cena.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Julgamento de Almas",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Resistência Mental",
          "efeito": "Revela se a intenção imediata do alvo é proteger, explorar ou destruir.",
          "custo": 5,
          "base": false
        },
        {
          "nome": "Renascimento Simbólico",
          "tipo": "SUPORTE",
          "acao": "Reação",
          "alcance": "10m",
          "resistencia": "-",
          "efeito": "Uma vez por sessão, reverte o primeiro efeito de Morte sem Caminho por 1 rodada, permitindo ritual de salvamento.",
          "custo": 10,
          "base": false
        }
      ]
    },
    "Anúbis": {
      "dominios": "Guarda dos mortos, mumificação, pesagem da alma e tumbas.",
      "corrupcao": "Rigidez ritualística e punição excessiva a profanadores.",
      "skills": [
        {
          "nome": "Selar Cadáveres",
          "tipo": "UTILITÁRIO",
          "acao": "Ritual",
          "alcance": "Toque",
          "resistencia": "-",
          "efeito": "Impede reanimação ou profanação por sete dias.",
          "custo": 3,
          "base": false
        },
        {
          "nome": "Detectar Almas Corrompidas",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "Área 10m",
          "resistencia": "-",
          "efeito": "Percebe Corrupção em almas num raio de 10m, sem revelar a causa exata.",
          "custo": 3,
          "base": false
        },
        {
          "nome": "Proteger Tumbas",
          "tipo": "DEFENSIVO",
          "acao": "Ritual",
          "alcance": "Local",
          "resistencia": "-",
          "efeito": "Cria selo que avisa o usuário e oferece resistência a invasão.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Impedir Possessões",
          "tipo": "DEFENSIVO",
          "acao": "Ação",
          "alcance": "Toque",
          "resistencia": "-",
          "efeito": "Concede imunidade a possessão por uma cena.",
          "custo": 6,
          "base": false
        },
        {
          "nome": "Pesar Culpa Espiritual",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Resistência Mental",
          "efeito": "Revela o maior peso moral que o alvo reconhece carregar.",
          "custo": 4,
          "base": false
        }
      ]
    },
    "Rá": {
      "dominios": "Sol primordial, criação, realeza solar e fogo celeste.",
      "corrupcao": "Superioridade divina e culto à realeza absoluta.",
      "skills": [
        {
          "nome": "Fogo Solar",
          "tipo": "OFENSIVO",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Defesa",
          "efeito": "Luz/Sagrado 1d8, dobrando dados contra criaturas sombrias vulneráveis.",
          "custo": 0,
          "base": true
        },
        {
          "nome": "Restauração",
          "tipo": "SUPORTE",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "-",
          "efeito": "Cura 1d8 + Fé PV.",
          "custo": 6,
          "base": false
        },
        {
          "nome": "Aura Régia",
          "tipo": "CONTROLE",
          "acao": "Ação",
          "alcance": "Área 3m",
          "resistencia": "Resistência Mental",
          "efeito": "Inimigos de menor Vontade em 3m sofrem Medo por 3 turnos.",
          "custo": 3,
          "base": false
        },
        {
          "nome": "Proteção Contra Sombras",
          "tipo": "DEFENSIVO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Recebe +2 Defesa e resistência a Trevas por uma cena.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Luz Criadora",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "Área 20m",
          "resistencia": "-",
          "efeito": "Ilumina área ampla por horas, sem calor ou fogo real.",
          "custo": 2,
          "base": false
        }
      ]
    },
    "Sekhmet": {
      "dominios": "Guerra, praga, cura violenta e fúria solar.",
      "corrupcao": "Extermínio em nome da cura.",
      "skills": [
        {
          "nome": "Fúria Solar",
          "tipo": "OFENSIVO",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Defesa/Reflexos",
          "efeito": "Fogo 1d8 e Queimadura por 3 turnos em falha de Reflexos.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Doenças Sagradas",
          "tipo": "OFENSIVO",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Defesa/Resistência",
          "efeito": "Veneno 1d6 e Veneno Forte por 6 turnos.",
          "custo": 6,
          "base": false
        },
        {
          "nome": "Cura por Cauterização",
          "tipo": "SUPORTE",
          "acao": "Ação",
          "alcance": "Toque",
          "resistencia": "-",
          "efeito": "Cura 1d6 + Fé PV, mas causa 1 dano de Fogo inevitável.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Intimidação",
          "tipo": "CONTROLE",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Resistência Mental",
          "efeito": "Aplica Medo por 3 turnos.",
          "custo": 3,
          "base": false
        },
        {
          "nome": "Destruição de Infecções Espirituais",
          "tipo": "SUPORTE",
          "acao": "Ritual",
          "alcance": "Toque",
          "resistencia": "-",
          "efeito": "Remove Ruína da Alma, Corrupção temporária ou Veneno de um alvo.",
          "custo": 7,
          "base": false
        }
      ]
    },
    "Bastet": {
      "dominios": "Gatos, proteção, dança, lar, graça e vigilância noturna.",
      "corrupcao": "Vaidade, proteção possessiva e manipulação suave.",
      "skills": [
        {
          "nome": "Agilidade",
          "tipo": "MELHORIA",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Recebe +2 Defesa por 3 turnos.",
          "custo": 3,
          "base": false
        },
        {
          "nome": "Proteção de Lares",
          "tipo": "DEFENSIVO",
          "acao": "Ritual",
          "alcance": "Local",
          "resistencia": "Força/Ocultismo",
          "efeito": "Protege residência contra intrusos não convidados por uma noite; invasão exige resistência à DT.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Percepção Noturna",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Visão perfeita no escuro por uma cena.",
          "custo": 2,
          "base": false
        },
        {
          "nome": "Graça Sobrenatural",
          "tipo": "MELHORIA",
          "acao": "Reação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Sempre cai de pé e ignora até 6d6 de dano de queda nesta cena.",
          "custo": 3,
          "base": false
        },
        {
          "nome": "Encanto Leve",
          "tipo": "CONTROLE",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Resistência Mental",
          "efeito": "Alvo sofre -1 para resistir a pedidos gentis por 4 turnos; ordens perigosas anulam o efeito.",
          "custo": 4,
          "base": false
        }
      ]
    },
    "Seth": {
      "dominios": "Deserto, caos, tempestade seca, violência e ruptura.",
      "corrupcao": "Traição, destruição sem reconstrução e instabilidade.",
      "skills": [
        {
          "nome": "Tempestade de Areia",
          "tipo": "OFENSIVO/CONTROLE",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Reflexos",
          "efeito": "Impacto 1d10 em área 3m e Cegueira por 3 turnos em falha de Reflexos.",
          "custo": 8,
          "base": false
        },
        {
          "nome": "Força Caótica",
          "tipo": "OFENSIVO",
          "acao": "Ação",
          "alcance": "10m",
          "resistencia": "Defesa",
          "efeito": "Arcano 1d10; role duas vezes e use o maior, mas em falha crítica use o menor e sofra 1d6.",
          "custo": 0,
          "base": true
        },
        {
          "nome": "Ruptura de Barreiras",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "Toque",
          "resistencia": "Ocultismo",
          "efeito": "Destrói barreira mágica ou selo simples; contra efeito maior, faça Ocultismo oposto.",
          "custo": 6,
          "base": false
        },
        {
          "nome": "Resistência ao Calor",
          "tipo": "DEFENSIVO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Imunidade a calor ambiental e resistência a Fogo por uma cena.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Agressividade Sobrenatural",
          "tipo": "SUPORTE",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "+1d6 no próximo ataque, mas -2 Defesa até o início do próximo turno.",
          "custo": 3,
          "base": false
        }
      ]
    },
    "Hórus": {
      "dominios": "Céu, visão, falcões, realeza e vingança justa.",
      "corrupcao": "Vigilância excessiva e vingança como identidade.",
      "skills": [
        {
          "nome": "Visão Distante",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Enxerga claramente um ponto distante e ignora penalidade de alcance visual por uma cena.",
          "custo": 3,
          "base": false
        },
        {
          "nome": "Ataques Precisos",
          "tipo": "MELHORIA",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Próximo ataque ignora Armadura e cobertura parcial.",
          "custo": 5,
          "base": false
        },
        {
          "nome": "Proteção Aérea",
          "tipo": "DEFENSIVO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Recebe +2 Defesa contra ataques aéreos ou à distância por uma cena.",
          "custo": 4,
          "base": false
        },
        {
          "nome": "Autoridade Real",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "Pessoal",
          "resistencia": "-",
          "efeito": "Vantagem em testes sociais de comando ou realeza por uma cena.",
          "custo": 3,
          "base": false
        },
        {
          "nome": "Percepção de Ameaças",
          "tipo": "UTILITÁRIO",
          "acao": "Ação",
          "alcance": "Área 20m",
          "resistencia": "-",
          "efeito": "Revela a maior ameaça imediata em uma área ou situação.",
          "custo": 3,
          "base": false
        }
      ]
    }
  }
};

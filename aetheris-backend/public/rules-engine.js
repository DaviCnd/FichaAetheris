/* Numerical rules from Grimório, pp. 6–18, 33–40. No automatic narrative rulings. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.AETHERIS_RULES = api;
})(typeof window !== "undefined" ? window : globalThis, () => {
  const has = (s, id) => s.talents.includes(id),
    cond = (s, id) => s.conditions.includes(id);
  function racial(s, name) {
    const c = s.context || {};
    if (
      s.race === "lupir" &&
      c.smell &&
      ["Percepção", "Sobrevivência"].includes(name)
    )
      return 2;
    if (
      s.race === "avaris" &&
      ((c.visual && name === "Percepção") ||
        (c.longRange && name === "Pontaria"))
    )
      return 2;
    if (s.race === "veylans" && c.mentalThreat && name === "Resistência Mental")
      return 2;
    return 0;
  }
  function conditionPenalty(s) {
    return cond(s, "exausto")
      ? -Math.min(5, 1 + (s.exhaustionSources || 1))
      : 0;
  }
  function defense(s, base) {
    return (
      base +
      (s.profession === "Guerreiro" && s.warriorStance === "defensiva"
        ? 1
        : 0) -
      (cond(s, "atordoado") ? 2 : 0)
    );
  }
  function movement(s, base) {
    if (
      cond(s, "agarrado") ||
      cond(s, "paralisado") ||
      cond(s, "congelamento_total") ||
      s.pvLoss >= s._pvMax
    )
      return 0;
    let n = base;
    if (cond(s, "congelamento_leve")) n = Math.max(0, n - 2);
    if (cond(s, "congelado") || cond(s, "lento")) n /= 2;
    return n;
  }
  function powerPrice(D, s, p, discounts = true) {
    let total = D.powerForms.find((x) => x.name === p.form)?.cost || 0;
    for (const [key, list] of [
      ["damage", D.damageTypes],
      ["effects", D.debuffs],
      ["limitations", D.limitations],
    ])
      for (const n of p[key] || [])
        total += list.find((x) => x.name === n)?.cost || 0;
    let extra = 0;
    for (const n of p.upgrades || []) {
      if (n === "+1d6 dano") total += [2, 3, 4][Math.min(extra++, 2)];
      else total += D.upgrades.find((x) => x.name === n)?.cost || 0;
    }
    total = Math.max(1, total);
    if (discounts && p.signature && has(s, "poder_assinatura"))
      total = Math.max(1, total - 1);
    if (
      discounts &&
      s.level >= 10 &&
      s.capstone === "mestre_arcano" &&
      s.masterArcanePowerId === p.id &&
      p.tier === "Avançado"
    )
      total = Math.max(1, total - 3);
    return total;
  }
  function powerCheck(D, s, p) {
    const errors = [],
      notes = [],
      tier = D.powerTiers[p.tier],
      name = p.name?.trim();
    if (!name) errors.push("Informe o nome do poder.");
    if (!tier) {
      errors.push("Categoria inválida.");
      return { errors, notes };
    }
    if (
      !D.attributes.includes(p.keyAttr) ||
      !D.skills.some((g) => g.items.includes(p.skill))
    )
      errors.push("Escolha atributo e perícia válidos.");
    if (!D.powerForms.some((x) => x.name === p.form))
      errors.push("Escolha a forma do poder.");
    if (!["Arcano", "Divino", "Abissal", "Técnico"].includes(p.source))
      errors.push("Fonte de poder inválida.");
    const cost = powerPrice(D, s, p, false);
    if (cost < tier.min || cost > tier.max)
      errors.push(
        `Custo de construção ${cost} fora da faixa ${tier.min}–${tier.max}.`,
      );
    if (s.level < tier.level) errors.push(`Requer nível ${tier.level}.`);
    for (const [key, list] of [
      ["damage", D.damageTypes],
      ["effects", D.debuffs],
      ["upgrades", D.upgrades],
      ["limitations", D.limitations],
    ]) {
      for (const n of p[key] || [])
        if (!list.some((x) => x.name === n))
          errors.push(`Seleção incompleta ou desconhecida em ${key}.`);
      const unique = new Set();
      for (const n of p[key] || []) {
        if (unique.has(n) && n !== "+1d6 dano") errors.push(`Não repita ${n}.`);
        unique.add(n);
      }
    }
    if ((p.upgrades || []).filter((n) => n === "+1d6 dano").length > 3)
      notes.push(
        "O livro não define custo depois do terceiro dado adicional. Registre a decisão do mestre.",
      );
    if (
      (p.limitations || []).filter((n) => n.startsWith("Componente raro"))
        .length > 1
    )
      errors.push("Escolha um único desconto de componente raro.");
    if (
      (p.limitations || []).filter((n) => n.startsWith("Recarga:")).length > 1
    )
      errors.push("Escolha recarga por cena ou por sessão, sem somá-las.");
    if (
      (p.upgrades || []).includes("Área grande (20m)") &&
      !["Avançado", "Supremo"].includes(p.tier)
    )
      errors.push("Área grande exige categoria Avançado ou Supremo.");
    if (p.signature && !has(s, "poder_assinatura"))
      errors.push("Poder Assinatura exige o talento.");
    if (!p.description?.trim())
      errors.push("Descreva o efeito, a ativação e as condições de uso.");
    if (!p.range?.trim() || !p.duration?.trim() || !p.resistance?.trim())
      errors.push(
        "Defina alcance/área, duração e ataque ou resistência (use “Não se aplica” quando necessário).",
      );
    if (p.tier === "Supremo") notes.push("Supremo exige aprovação do mestre.");
    else
      for (const [key, limit] of [
        ["damage", tier.damage],
        ["effects", tier.effect],
        ["upgrades", tier.upgrade],
      ])
        if ((p[key] || []).length > limit)
          notes.push(
            `Estrutura recomendada: ${key === "damage" ? "tipos de dano" : key === "effects" ? "efeitos" : "melhorias"} até ${limit}.`,
          );
    if ((p.limitations || []).length)
      notes.push(
        "O mestre deve confirmar que as limitações criam restrição real.",
      );
    if ((p.damage || []).length > 1)
      notes.push(
        "Role um único dado base; registre como a mesa resolve resistências a tipos múltiplos.",
      );
    if (
      (p.upgrades || []).some((x) =>
        ["Invocar criatura", "Ação rápida", "Dano contínuo"].includes(x),
      )
    )
      notes.push(
        "Detalhe com o mestre as ações, duração e resolução dessa melhoria.",
      );
    return { errors: [...new Set(errors)], notes: [...new Set(notes)] };
  }
  function validate(D, s, f) {
    const result = [],
      push = (title, ok, detail) => result.push({ title, ok, detail });
    const pool = 12 + (s.level >= 5 ? 1 : 0) + (s.level >= 10 ? 1 : 0),
      cap = s.level >= 10 ? 6 : s.level >= 5 ? 5 : 4;
    push(
      "Conceito e vínculos",
      ["f-nome", "f-regiao", "f-conceito", "f-objetivo", "f-vinculo"].every(
        (k) => f[k]?.trim(),
      ),
      "Preencha nome, região, conceito, objetivo e vínculo.",
    );
    push("Raça", Object.hasOwn(D.races, s.race), "Escolha uma das oito raças.");
    push(
      "Profissão",
      Object.hasOwn(D.professions, s.profession),
      "Escolha uma das doze profissões.",
    );
    push(
      "Atributos",
      D.attributes.every(
        (a) =>
          Number.isInteger(s.attrs[a]) && s.attrs[a] >= 1 && s.attrs[a] <= cap,
      ) && D.attributes.reduce((n, a) => n + s.attrs[a], 0) === pool,
      `${pool} pontos; cada atributo entre 1 e ${cap}.`,
    );
    const skills = D.skills.flatMap((g) => g.items),
      training =
        8 +
        (s.level >= 4 ? 2 : 0) +
        (s.level >= 8 ? 2 : 0) +
        (D.races[s.race]?.trainingBonus || 0),
      spent = Object.values(s.training).reduce((n, v) => n + v, 0);
    push(
      "Treino",
      spent === training &&
        Object.entries(s.training).every(
          ([k, v]) =>
            skills.includes(k) && Number.isInteger(v) && v >= 0 && v <= 3,
        ),
      `${spent}/${training} pontos distribuídos.`,
    );
    const slots =
        [2, 5, 9].filter((l) => s.level >= l).length +
        (s.path === "Livre" ? 1 : 0),
      count =
        s.talents.length +
        (has(s, "maestria") ? Math.max(0, (s.masteryPurchases || 1) - 1) : 0);
    push(
      "Talentos",
      count === slots &&
        new Set(s.talents).size === s.talents.length &&
        s.talents.every((id) => D.talents.some((t) => t.id === id)),
      `${count}/${slots} escolhas; Maestria adicional consome outra escolha.`,
    );
    const master = s.level >= 8 ? 2 : s.level >= 4 ? 1 : 0,
      allowed = has(s, "maestria")
        ? Math.min(master, s.masteryPurchases || 1)
        : 0;
    push(
      "Maestria",
      Object.values(s.training).filter((v) => v === 3).length <= allowed &&
        (!has(s, "maestria") || s.level >= 4),
      `Até ${allowed} perícia(s) com Treino 3; requer nível 4/8 e talento específico.`,
    );
    if (has(s, "especialista"))
      push(
        "Especialista",
        s.specialistSkills.length === 2 &&
          new Set(s.specialistSkills).size === 2 &&
          s.specialistSkills.every(
            (k) => skills.includes(k) && s.training[k] < 2,
          ),
        "Escolha duas perícias diferentes com Treino 0 ou 1.",
      );
    if (has(s, "armadura_treinada"))
      push(
        "Armadura Treinada",
        D.armors.some(
          (a) => a.name === s.armorTrainingChoice && a.name !== "Sem armadura",
        ),
        "Escolha a categoria de armadura.",
      );
    if (has(s, "critico_aprimorado"))
      push(
        "Crítico Aprimorado",
        ["fisico", "magico"].includes(s.criticalChoice),
        "Escolha físico ou mágico.",
      );
    if (has(s, "poder_assinatura"))
      push(
        "Poder Assinatura",
        s.powers.filter((p) => p.signature).length === 1,
        "Escolha exatamente um poder.",
      );
    push(
      "Caminho",
      Object.hasOwn(D.paths, s.path),
      "Escolha Devoto, Livre ou Pactuário.",
    );
    const learned = (D.blessings[s.patron]?.skills || []).filter((x) =>
      s.learnedBlessings.includes(x.nome),
    );
    if (s.path === "Devoto")
      push(
        "Patrono",
        Object.hasOwn(D.blessings, s.patron),
        "Devoto precisa de patrono.",
      );
    if (s.creationMode && s.level === 1) {
      if (s.path === "Devoto")
        push(
          "Início Devoto",
          s.favor === 2 &&
            learned.length === 2 &&
            learned.every((x) => x.custo <= 5),
          "Favor 2 e duas bênçãos de custo até 5.",
        );
      if (s.path === "Livre")
        push(
          "Início Livre",
          s.powers.length === 2 && s.powers.every((p) => p.tier === "Comum"),
          "Dois poderes Comuns e o talento adicional.",
        );
      if (s.path === "Pactuário")
        push(
          "Início Pactuário",
          s.corruption === 1 &&
            Boolean(s.pactType) &&
            Boolean(f["p-marca"]?.trim()) &&
            s.powers.length === 1 &&
            s.powers[0].source === "Abissal",
          "Corrupção 1, pacto menor, marca e um poder abissal.",
        );
    }
    push(
      "Bênçãos registradas",
      learned.length === s.learnedBlessings.length,
      "Cada bênção deve pertencer ao patrono selecionado.",
    );
    if (s.powers.length) {
      const invalid = s.powers.filter((p) => powerCheck(D, s, p).errors.length);
      push(
        "Poderes",
        !invalid.length,
        invalid.length
          ? `${invalid.length} poder(es) com pendências. Veja os cartões.`
          : "Custos e requisitos conferidos.",
      );
      const pending = s.powers.filter(
        (p) => powerCheck(D, s, p).notes.length && !p.ruling?.trim(),
      );
      push(
        "Decisões de poderes",
        !pending.length,
        pending.length
          ? "Registre as decisões do mestre nos poderes com observações."
          : "Decisões registradas.",
      );
    }
    push(
      "Capstone",
      s.level >= 10
        ? D.capstones.some((c) => c.id === s.capstone)
        : !s.capstone,
      "Escolha somente no nível 10.",
    );
    if (s.capstone === "mestre_arcano")
      push(
        "Mestre Arcano",
        s.powers.some(
          (p) => p.id === s.masterArcanePowerId && p.tier === "Avançado",
        ),
        "Selecione o poder Avançado que recebe -3 PE.",
      );
    const armor = D.armors.find((a) => a.name === s.armor);
    push(
      "Equipamento",
      Boolean(armor) &&
        armor.strength <= s.attrs.forca &&
        D.weapons.some((w) => w.name === s.weapon) &&
        !(s.shield && s.weapon === "Arco"),
      "Respeite Força mínima e mãos ocupadas (arco exige duas mãos).",
    );
    return result;
  }
  return {
    racial,
    conditionPenalty,
    defense,
    movement,
    powerPrice,
    powerCheck,
    validate,
  };
});

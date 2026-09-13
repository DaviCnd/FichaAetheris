/* Shared transport validation. Drafts may be incomplete; malformed JSON is rejected. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.AETHERIS_SCHEMA = api;
})(typeof window !== "undefined" ? window : globalThis, () => {
  const object = (v) =>
    v !== null && typeof v === "object" && !Array.isArray(v);
  function safeAvatar(value) {
    return typeof value === "string" &&
      value.length <= 1500000 &&
      /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(value)
      ? value
      : "";
  }
  function validate(raw) {
    if (!object(raw) || !object(raw.state))
      throw new Error("A ficha precisa conter um objeto state válido.");
    if (raw.schemaVersion != null && ![1, 2, 3, 4].includes(raw.schemaVersion))
      throw new Error("Versão de ficha não suportada.");
    function walk(v, depth = 0) {
      if (depth > 12) throw new Error("Ficha com estrutura muito profunda.");
      if (Array.isArray(v)) {
        if (v.length > 300) throw new Error("Lista excede 300 itens.");
        v.forEach((x) => walk(x, depth + 1));
      } else if (object(v)) {
        for (const [k, x] of Object.entries(v)) {
          if (["__proto__", "prototype", "constructor"].includes(k))
            throw new Error("Campo inválido.");
          walk(x, depth + 1);
        }
      } else if (typeof v === "number" && !Number.isFinite(v))
        throw new Error("Número inválido.");
      else if (typeof v === "string" && v.length > 1500000)
        throw new Error("Texto ou imagem muito grande.");
    }
    walk(raw);
    for (const key of ["fields", "identity"])
      if (raw[key] != null && !object(raw[key]))
        throw new Error(`Campo ${key} inválido.`);
    for (const [key, v] of Object.entries(raw.fields || {}))
      if (typeof v !== "string" || v.length > 50000)
        throw new Error(`Texto inválido: ${key}.`);
    const s = raw.state;
    for (const key of ["attrs", "training", "context"])
      if (s[key] != null && !object(s[key]))
        throw new Error(`Campo ${key} inválido.`);
    for (const key of ["attrs", "training"])
      for (const v of Object.values(s[key] || {}))
        if (!Number.isInteger(v) || v < 0 || v > 100)
          throw new Error(`Número inválido em ${key}.`);
    for (const key of [
      "level",
      "pvLoss",
      "peSpent",
      "soulLoss",
      "resurrections",
      "favor",
      "corruption",
      "slotsUsed",
      "deathSuccess",
      "deathFail",
      "exhaustionSources",
      "masteryPurchases",
    ])
      if (
        s[key] != null &&
        (!Number.isInteger(s[key]) || s[key] < 0 || s[key] > 100000)
      )
        throw new Error(`Número inválido: ${key}.`);
    for (const key of [
      "talents",
      "learnedBlessings",
      "consumables",
      "conditions",
      "specialistSkills",
    ])
      if (
        s[key] != null &&
        (!Array.isArray(s[key]) || s[key].some((v) => typeof v !== "string"))
      )
        throw new Error(`Lista inválida: ${key}.`);
    for (const key of [
      "race",
      "profession",
      "path",
      "armor",
      "weapon",
      "patron",
      "pactType",
      "capstone",
      "avarisLineage",
      "criticalChoice",
      "armorTrainingChoice",
      "masterArcanePowerId",
      "warriorStance",
      "corruptionManifestation",
      "corruptionPenalty",
      "corruptionBlessingMode",
    ])
      if (s[key] != null && typeof s[key] !== "string")
        throw new Error(`Texto inválido: ${key}.`);
    for (const key of ["shield", "creationMode", "pauseUsed"])
      if (s[key] != null && typeof s[key] !== "boolean")
        throw new Error(`Opção inválida: ${key}.`);
    if (s.context)
      for (const v of Object.values(s.context))
        if (typeof v !== "boolean") throw new Error("Contexto inválido.");
    if (
      s.powers != null &&
      (!Array.isArray(s.powers) || s.powers.some((p) => !object(p)))
    )
      throw new Error("Poderes inválidos.");
    for (const p of s.powers || []) {
      for (const key of ["damage", "effects", "upgrades", "limitations"])
        if (
          p[key] != null &&
          (!Array.isArray(p[key]) || p[key].some((v) => typeof v !== "string"))
        )
          throw new Error(`Lista inválida no poder: ${key}.`);
      for (const key of [
        "id",
        "name",
        "source",
        "tier",
        "keyAttr",
        "skill",
        "form",
        "description",
        "range",
        "duration",
        "resistance",
        "ruling",
      ])
        if (p[key] != null && typeof p[key] !== "string")
          throw new Error(`Campo inválido no poder: ${key}.`);
      if (p.signature != null && typeof p.signature !== "boolean")
        throw new Error("Assinatura inválida.");
    }
    if (
      s.reputation != null &&
      (!Array.isArray(s.reputation) ||
        s.reputation.some(
          (r) =>
            !object(r) ||
            typeof r.name !== "string" ||
            !Number.isInteger(r.value) ||
            r.value < -3 ||
            r.value > 3,
        ))
    )
      throw new Error("Reputação inválida.");
    if (s.avatarData && !safeAvatar(s.avatarData))
      throw new Error("Retrato inválido. Use uma imagem PNG, JPEG ou WebP.");
    return raw;
  }
  return { validate, safeAvatar };
});

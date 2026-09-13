"use strict";
function initRulesReader() {
  const dialog = $("rules-dialog");
  let index = null,
    page = 1,
    textMode = false,
    previousFocus = null,
    searchTimer = null;
  const normalize = (s) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  function setSidebar(open) {
    dialog.classList.toggle("index-open", open);
    $("rules-index-toggle").setAttribute("aria-expanded", String(open));
  }
  function fitPage() {
    const image = $("rules-page-image"),
      viewport = $("rules-pdf");
    if (!image.naturalWidth || !viewport.clientHeight || textMode) return;
    const ratio = image.naturalWidth / image.naturalHeight;
    const width = Math.min(
      viewport.clientWidth - 32,
      (viewport.clientHeight - 32) * ratio,
    );
    const scale =
      $("rules-zoom").value === "fit" ? 1 : Number($("rules-zoom").value) / 100;
    image.style.width = `${Math.max(1, width * scale)}px`;
    image.style.height = `${Math.max(1, (width * scale) / ratio)}px`;
  }
  $("rules-page-image").addEventListener("load", fitPage);
  if (window.ResizeObserver)
    new ResizeObserver(fitPage).observe($("rules-pdf"));
  window.addEventListener("resize", fitPage);
  $("rules-index-toggle").addEventListener("click", () => {
    const open = !dialog.classList.contains("index-open");
    setSidebar(open);
    if (open) $("rules-search").focus();
  });
  $("rules-index-backdrop").addEventListener("click", () => {
    setSidebar(false);
    $("rules-index-toggle").focus();
  });
  function renderPage() {
    $("rules-page").value = page;
    $("rules-zoom").disabled = textMode;
    $("rules-prev").disabled = page === 1;
    $("rules-next").disabled = page === 50;
    $("rules-pdf").classList.toggle("hidden", textMode);
    $("rules-text").classList.toggle("hidden", !textMode);
    $("rules-mode").textContent = textMode
      ? "Ver página original"
      : "Ler em texto";
    if (!textMode) {
      $("rules-page-image").src = `/rules/pages/${page}.webp`;
      $("rules-page-image").alt = `Grimório de Aetheris, página ${page}`;
      $("rules-pdf").scrollTop = 0;
      $("rules-pdf").scrollLeft = 0;
      fitPage();
    }
    $("rules-text").textContent =
      index?.pages[page - 1]?.text || "Carregando o texto…";
    $("rules-text").scrollTop = 0;
    $("rules-download").href = `/rules/grimorio.pdf#page=${page}`;
    qsa("[data-rule-page]").forEach((b) => {
      if (Number(b.dataset.rulePage) === page)
        b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });
  }
  function go(n) {
    page = clamp(Math.trunc(Number(n) || 1), 1, 50);
    renderPage();
    if (dialog.classList.contains("index-open")) {
      setSidebar(false);
      $("rules-index-toggle").focus();
    }
  }
  function button(title, n, snippet) {
    const b = document.createElement("button");
    b.className = "rules-link";
    b.dataset.rulePage = n;
    const label = document.createElement("span"),
      number = document.createElement("span");
    label.className = "rules-link-title";
    label.textContent = title.replace(/^\d+\.\s*/, "");
    number.className = "rules-link-page";
    number.textContent = n;
    b.setAttribute("aria-label", `${label.textContent}, página ${n}`);
    b.append(label, number);
    if (snippet) {
      const s = document.createElement("small");
      s.textContent = snippet;
      b.appendChild(s);
    }
    b.addEventListener("click", () => go(n));
    return b;
  }
  function toc() {
    if (!index) return;
    const nav = $("rules-toc"),
      query = normalize($("rules-search").value.trim());
    nav.replaceChildren();
    if (!query) {
      $("rules-search-status").textContent = "Capítulos";
      index.chapters.forEach((x) => nav.appendChild(button(x.title, x.page)));
      const details = document.createElement("details"),
        summary = document.createElement("summary");
      summary.textContent = "Divindades";
      details.appendChild(summary);
      index.deities.forEach((x) =>
        details.appendChild(button(x.title, x.page)),
      );
      nav.appendChild(details);
      return;
    }
    const results = index.pages.filter((x) =>
      normalize(x.text).includes(query),
    );
    $("rules-search-status").textContent =
      `${results.length} página(s) encontrada(s).`;
    for (const p of results) {
      const i = normalize(p.text).indexOf(query),
        snippet = p.text
          .slice(Math.max(0, i - 55), i + query.length + 130)
          .replace(/\s+/g, " ");
      nav.appendChild(button("Resultado", p.page, snippet));
    }
  }
  async function openBook(requestedPage) {
    if (requestedPage) page = clamp(Math.trunc(Number(requestedPage)), 1, 50);
    previousFocus = document.activeElement;
    textMode = false;
    $("rules-zoom").value = "fit";
    setSidebar(false);
    dialog.showModal();
    document.body.classList.add("book-open");
    if (window.innerWidth > 700) $("rules-search").focus();
    else $("rules-page").focus();
    if (!index) {
      $("rules-search-status").textContent = "Carregando o índice…";
      try {
        const r = await fetch("/rules/index.json");
        if (!r.ok) throw new Error();
        index = await r.json();
      } catch {
        $("rules-search-status").textContent =
          "Não foi possível carregar o índice. O PDF continua disponível.";
      }
    }
    toc();
    renderPage();
  }
  $("rules-open").addEventListener("click", () => openBook());
  qsa("[data-open-book]").forEach((button) => {
    button.addEventListener("click", () => openBook(button.dataset.openBook));
  });
  $("rules-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    document.body.classList.remove("book-open");
    previousFocus?.focus();
  });
  $("rules-search").addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(toc, 150);
  });
  $("rules-page").addEventListener("change", (e) => go(e.target.value));
  $("rules-prev").addEventListener("click", () => go(page - 1));
  $("rules-next").addEventListener("click", () => go(page + 1));
  $("rules-zoom").addEventListener("change", () => {
    fitPage();
    $("rules-pdf").scrollTop = 0;
    $("rules-pdf").scrollLeft = 0;
  });
  $("rules-mode").addEventListener("click", () => {
    textMode = !textMode;
    renderPage();
  });
}

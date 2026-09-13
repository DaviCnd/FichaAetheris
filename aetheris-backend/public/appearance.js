"use strict";
(() => {
  const root = document.documentElement;
  const defaults = { dark: false, color: "#2e4d75" };
  let account = "",
    preferences = { ...defaults },
    previousFocus;
  const dialog = document.getElementById("appearance-dialog");
  const key = () =>
    `aetheris:appearance:v1:${account ? "account:" + encodeURIComponent(account) : "guest"}`;
  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(key()));
      return {
        dark: value?.dark === true,
        color: /^#[\da-f]{6}$/i.test(value?.color || "")
          ? value.color.toLowerCase()
          : defaults.color,
      };
    } catch {
      return { ...defaults };
    }
  }
  function paint() {
    const rgb = preferences.color
      .slice(1)
      .match(/../g)
      .map((v) => parseInt(v, 16) / 255);
    const high = Math.max(...rgb),
      low = Math.min(...rgb),
      delta = high - low,
      light = (high + low) / 2;
    let hue = 0,
      saturation = 0;
    if (delta) {
      saturation = delta / (1 - Math.abs(2 * light - 1));
      hue =
        (high === rgb[0]
          ? ((rgb[1] - rgb[2]) / delta) % 6
          : high === rgb[1]
            ? (rgb[2] - rgb[0]) / delta + 2
            : (rgb[0] - rgb[1]) / delta + 4) * 60;
    }
    const h = ((hue + 360) % 360) / 360;
    const s = preferences.dark ? Math.min(saturation, 0.75) : saturation;
    const l = preferences.dark ? 0.42 : 0.36;
    const a = s * Math.min(l, 1 - l);
    const channels = [0, 8, 4].map((n) => {
      const k = (n + h * 12) % 12;
      const c = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    const luminance =
      channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    root.style.setProperty(
      "--on-accent",
      1.05 / (luminance + 0.05) >= (luminance + 0.05) / 0.05
        ? "#ffffff"
        : "#000000",
    );
    root.dataset.theme = preferences.dark ? "dark" : "light";
    root.style.setProperty("--accent-h", String((hue + 360) % 360));
    root.style.setProperty("--accent-s", `${saturation * 100}%`);
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.textContent = preferences.dark ? "☀ Modo claro" : "☾ Modo escuro";
      button.setAttribute("aria-pressed", String(preferences.dark));
    });
    document.getElementById("appearance-dark").checked = preferences.dark;
    document.getElementById("appearance-color").value = preferences.color;
    document
      .querySelectorAll("[data-accent]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.accent === preferences.color),
        ),
      );
  }
  function save() {
    paint();
    try {
      localStorage.setItem(key(), JSON.stringify(preferences));
      document.getElementById("appearance-status").textContent =
        "Salvo neste navegador, separado por conta.";
    } catch {
      document.getElementById("appearance-status").textContent =
        "Aparência aplicada. Este navegador não permitiu salvar a preferência.";
    }
  }
  for (const [name, color] of [
    ["Azul celeste", "#2e4d75"],
    ["Violeta", "#8056bb"],
    ["Esmeralda", "#21876e"],
    ["Rosa", "#b65789"],
    ["Âmbar", "#b88627"],
    ["Carmesim", "#b64c56"],
  ]) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "appearance-swatch";
    button.dataset.accent = color;
    button.setAttribute("aria-label", name);
    button.title = name;
    button.style.setProperty("--swatch", color);
    button.addEventListener("click", () => {
      preferences.color = color;
      save();
    });
    document.getElementById("appearance-presets").append(button);
  }
  document.querySelectorAll("[data-theme-toggle]").forEach((button) =>
    button.addEventListener("click", () => {
      preferences.dark = !preferences.dark;
      save();
    }),
  );
  document.querySelectorAll("[data-appearance-open]").forEach((button) =>
    button.addEventListener("click", () => {
      previousFocus = document.activeElement;
      dialog.showModal();
    }),
  );
  document
    .getElementById("appearance-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => previousFocus?.focus());
  document.getElementById("appearance-dark").addEventListener("change", (e) => {
    preferences.dark = e.target.checked;
    save();
  });
  document.getElementById("appearance-color").addEventListener("input", (e) => {
    if (/^#[\da-f]{6}$/i.test(e.target.value)) {
      preferences.color = e.target.value.toLowerCase();
      save();
    }
  });
  document.getElementById("appearance-reset").addEventListener("click", () => {
    preferences = { ...defaults };
    save();
  });
  window.addEventListener("storage", (e) => {
    if (e.key === key() || e.key === null) {
      preferences = read();
      paint();
    }
  });
  window.AetherisAppearance = {
    setAccount(name) {
      account = String(name || "");
      preferences = read();
      paint();
    },
  };
  preferences = read();
  paint();
})();

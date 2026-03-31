import { siteContent } from "../data/site-content.js";

const DEFAULT_LANG = "en";

const languageLabels = {
  en: "English",
  zh: "繁體中文",
  "zh-cn": "簡體中文",
  ja: "日本語",
  ko: "한국어"
};

function getMetaDescriptionNode() {
  return document.querySelector('meta[name="description"]');
}

function getLangFromPath() {
  const path = window.location.pathname.toLowerCase();

  if (path.startsWith("syncora-2/zh-tw")) return "zh";
  if (path.startsWith("syncora-2/zh-cn")) return "zh-cn";
  if (path.startsWith("syncora-2/ja")) return "ja";
  if (path.startsWith("syncora-2/ko")) return "ko";
  return "en";
}

function setDocumentLanguage(lang) {
  if (lang === "en") {
    document.documentElement.lang = "en";
    return;
  }

  if (lang === "zh-cn") {
    document.documentElement.lang = "zh-CN";
    return;
  }

  if (lang === "ja") {
    document.documentElement.lang = "ja";
    return;
  }

  if (lang === "ko") {
    document.documentElement.lang = "ko";
    return;
  }

  document.documentElement.lang = "zh-Hant";
}

function updateMeta(dict) {
  document.title = dict.metaTitle || document.title;

  const metaDescription = getMetaDescriptionNode();
  if (metaDescription && dict.metaDescription) {
    metaDescription.setAttribute("content", dict.metaDescription);
  }
}

function updateTextNodes(dict) {
  const nodes = document.querySelectorAll("[data-i18n]");

  nodes.forEach((node) => {
    const key = node.dataset.i18n;
    const value = dict[key];
    if (typeof value === "string") {
      node.textContent = value;
    }
  });
}

function updateLanguageButtons(lang) {
  const buttons = document.querySelectorAll("[data-lang]");

  buttons.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
  });

  const current = document.querySelector("[data-lang-current]");
  if (current) {
    current.textContent = languageLabels[lang] || languageLabels[DEFAULT_LANG];
  }
}

export function applyLanguage(lang) {
  const safeLang = siteContent[lang] ? lang : DEFAULT_LANG;
  const dict = siteContent[safeLang];

  setDocumentLanguage(safeLang);
  updateMeta(dict);
  updateTextNodes(dict);
  updateLanguageButtons(safeLang);
}

function initLanguageDropdown() {
  const menu = document.querySelector("[data-lang-menu]");
  const trigger = document.querySelector("[data-lang-trigger]");

  if (!menu || !trigger) return;

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = menu.classList.toggle("is-open");
    trigger.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!menu.contains(event.target)) {
      menu.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menu.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    }
  });
}

export function initI18n() {
  const lang = getLangFromPath();
  applyLanguage(lang);
  initLanguageDropdown();

  const routeMap = {
    en: "/",
    zh: "/zh-tw/",
    "zh-cn": "/zh-cn/",
    ja: "/ja/",
    ko: "/ko/"
  };

  const buttons = document.querySelectorAll("[data-lang]");
  const menu = document.querySelector("[data-lang-menu]");
  const trigger = document.querySelector("[data-lang-trigger]");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetLang = btn.dataset.lang;
      window.location.href = routeMap[targetLang] || "/";
    });
  });

  if (menu && trigger) {
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        menu.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      });
    });
  }
}
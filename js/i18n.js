import { siteContent } from "../data/site-content.js";

const STORAGE_KEY = "syncora-lang";
const DEFAULT_LANG = "en";

const languageLabels = {
  en: "English",
  zh: "繁中",
  "zh-cn": "简中",
  ja: "日本語",
  ko: "한국어"
};

function getMetaDescriptionNode() {
  return document.querySelector('meta[name="description"]');
}

function getLangFromPath() {
  const path = window.location.pathname.toLowerCase();

  if (path.startsWith("/zh-tw")) return "zh";
  if (path.startsWith("/zh-cn")) return "zh-cn";
  if (path.startsWith("/ja")) return "ja";
  if (path.startsWith("/ko")) return "ko";
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

  localStorage.setItem(STORAGE_KEY, safeLang);
}

export function initI18n() {
  const pathLang = getLangFromPath();
  applyLanguage(pathLang);

  const buttons = document.querySelectorAll("[data-lang]");
  const menu = document.querySelector("[data-lang-menu]");
  const trigger = document.querySelector("[data-lang-trigger]");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;

      const routeMap = {
        en: "/",
        zh: "/zh-tw/",
        "zh-cn": "/zh-cn/",
        ja: "/ja/",
        ko: "/ko/"
      };

      window.location.href = routeMap[lang] || "/";
    });
  });

  if (menu && trigger) {
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
}
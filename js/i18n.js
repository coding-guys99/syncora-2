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

function getLangFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const lang = params.get("lang");

  if (lang && siteContent[lang]) return lang;
  return DEFAULT_LANG;
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
  if (dict.metaTitle) {
    document.title = dict.metaTitle;
  }

  const metaDescription = getMetaDescriptionNode();
  if (metaDescription && dict.metaDescription) {
    metaDescription.setAttribute("content", dict.metaDescription);
  }
}

function updateTextNodes(dict) {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    const value = dict[key];

    if (typeof value === "string") {
      node.textContent = value;
    }
  });
}

function updateLanguageButtons(lang) {
  document.querySelectorAll("[data-lang]").forEach((btn) => {
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
  const lang = getLangFromUrl();
  applyLanguage(lang);
  initLanguageDropdown();

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetLang = btn.dataset.lang;
      const url = new URL(window.location.href);

      url.pathname = "/syncora-2/";
      url.searchParams.set("lang", targetLang);

      window.location.href = url.toString();
    });
  });
}
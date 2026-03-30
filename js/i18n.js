import { siteContent } from "../data/site-content.js";

const STORAGE_KEY = "syncora-lang";
const DEFAULT_LANG = "zh";

const languageLabels = {
  zh: "繁體中文",
  en: "English",
  "zh-cn": "簡體中文",
  "ko": "한국어",
  "ja": "にほんご",
};

function getMetaDescriptionNode() {
  return document.querySelector('meta[name="description"]');
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

export function getSavedLanguage() {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
}

function initLanguageDropdown() {
  const menu = document.querySelector("[data-lang-menu]");
  const trigger = document.querySelector("[data-lang-trigger]");
  const dropdown = document.querySelector("[data-lang-dropdown]");

  if (!menu || !trigger || !dropdown) return;

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
  const savedLang = getSavedLanguage();
  applyLanguage(savedLang);
  initLanguageDropdown();

  const buttons = document.querySelectorAll("[data-lang]");
  const menu = document.querySelector("[data-lang-menu]");
  const trigger = document.querySelector("[data-lang-trigger]");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyLanguage(btn.dataset.lang);

      if (menu) menu.classList.remove("is-open");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  });
}
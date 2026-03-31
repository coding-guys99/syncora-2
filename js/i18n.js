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
  if (lang === "en") return document.documentElement.lang = "en";
  if (lang === "zh-cn") return document.documentElement.lang = "zh-CN";
  if (lang === "ja") return document.documentElement.lang = "ja";
  if (lang === "ko") return document.documentElement.lang = "ko";
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
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (typeof dict[key] === "string") {
      node.textContent = dict[key];
    }
  });
}

function updateLanguageButtons(lang) {
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
  });

  const current = document.querySelector("[data-lang-current]");
  if (current) current.textContent = languageLabels[lang] || "English";
}

export function applyLanguage(lang) {
  const safeLang = siteContent[lang] ? lang : DEFAULT_LANG;
  const dict = siteContent[safeLang];

  setDocumentLanguage(safeLang);
  updateMeta(dict);
  updateTextNodes(dict);
  updateLanguageButtons(safeLang);
}

export function initI18n() {
  const lang = getLangFromUrl();
  applyLanguage(lang);

  const menu = document.querySelector("[data-lang-menu]");
  const trigger = document.querySelector("[data-lang-trigger]");

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
  }

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      const url = new URL(window.location.href);
      url.pathname = "/syncora-2/";
      url.searchParams.set("lang", lang);
      window.location.href = url.toString();
    });
  });
}
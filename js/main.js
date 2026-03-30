import { initStickyNavbar } from "./sticky-navbar.js";
import { initSmoothScroll } from "./smooth-scroll.js";
import { initRevealOnScroll } from "./reveal-on-scroll.js";
import { initActiveSection } from "./active-section.js";
import { initHeroVisual } from "./hero-visual.js";
import { initDemoSwitcher } from "./demo-switcher.js";
import { initI18n } from "./i18n.js";
import { initVideoSound } from "./video-sound.js";

document.addEventListener("DOMContentLoaded", () => {
  initI18n();
  initStickyNavbar();
  initSmoothScroll();
  initRevealOnScroll();
  initActiveSection();
  initHeroVisual();
  initDemoSwitcher();
  initVideoSound();

  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("is-open");
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("is-open");
      });
    });
  }
});

document.querySelectorAll("[data-sound-toggle]").forEach((btn) => {
  const video = btn.closest(".video-frame").querySelector("video");

  btn.addEventListener("click", () => {
    video.muted = !video.muted;
    btn.textContent = video.muted ? "🔇" : "🔊";
  });
});
import { $, $$ } from './utils/dom.js';

export function initNav() {
  const toggle = $('[data-nav-toggle]');
  const menu = $('[data-nav-menu]');
  const links = $$('.navbar__link', menu || document);

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('nav-open', isOpen);
  });

  links.forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

export function initActiveSection() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".navbar__link");

  if (!sections.length || !links.length) return;

  const map = new Map();
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href) map.set(href.replace("#", ""), link);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        links.forEach((link) => link.classList.remove("is-active"));
        const activeLink = map.get(entry.target.id);
        if (activeLink) activeLink.classList.add("is-active");
      });
    },
    {
      threshold: 0.45
    }
  );

  sections.forEach((section) => observer.observe(section));
}
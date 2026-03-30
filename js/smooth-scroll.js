export function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const nav = document.querySelector(".navbar");
      const navHeight = nav ? nav.offsetHeight : 0;
      const y = target.getBoundingClientRect().top + window.pageYOffset - navHeight + 1;

      window.scrollTo({
        top: y,
        behavior: "smooth"
      });
    });
  });
}
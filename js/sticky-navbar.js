export function initStickyNavbar() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 24) {
      navbar.classList.add("is-sticky");
    } else {
      navbar.classList.remove("is-sticky");
    }
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}
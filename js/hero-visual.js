export function initHeroVisual() {
  const box = document.querySelector("[data-tracking-box]");
  if (!box) return;

  let t = 0;

  const loop = () => {
    t += 0.02;
    const x = Math.sin(t) * 4;
    const y = Math.cos(t * 1.35) * 3;
    box.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
}
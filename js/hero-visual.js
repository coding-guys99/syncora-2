export function initHeroVisual() {
  const box = document.querySelector("[data-tracking-box]");
  if (box) {
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

  const video = document.querySelector("[data-video]");
  const toggle = document.querySelector("[data-sound-toggle]");
  const icon = document.querySelector("[data-sound-icon]");

  if (video && toggle && icon) {
    const updateSoundUI = () => {
      const isMuted = video.muted;
      toggle.classList.toggle("is-muted", isMuted);
      toggle.setAttribute("aria-pressed", String(!isMuted));
      toggle.setAttribute(
        "aria-label",
        isMuted ? "Unmute video" : "Mute video"
      );
      icon.textContent = isMuted ? "🔇" : "🔊";
    };

    updateSoundUI();

    toggle.addEventListener("click", async () => {
      try {
        if (video.muted) {
          video.muted = false;
          video.volume = 1;
          await video.play();
        } else {
          video.muted = true;
        }

        updateSoundUI();
      } catch (error) {
        console.error("Failed to toggle video sound:", error);
      }
    });
  }
}
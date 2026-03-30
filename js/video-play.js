export function initVideoPlay() {
  const groups = document.querySelectorAll(".video-frame, .hero__video-stage");

  groups.forEach((group) => {
    const video = group.querySelector("[data-video]");
    const toggle = group.querySelector("[data-play-toggle]");
    const icon = group.querySelector("[data-play-icon]");

    if (!video || !toggle || !icon) return;

    const updateUI = () => {
      const isPlaying = !video.paused;

      toggle.classList.toggle("is-playing", isPlaying);
      toggle.setAttribute("aria-pressed", String(isPlaying));
      toggle.setAttribute(
        "aria-label",
        isPlaying ? "Pause video" : "Play video"
      );

      icon.textContent = isPlaying ? "⏸" : "▶";
    };

    updateUI();

    toggle.addEventListener("click", async () => {
      try {
        if (video.paused) {
          await video.play();
        } else {
          video.pause();
        }

        updateUI();
      } catch (err) {
        console.error("Video play toggle error:", err);
      }
    });

    // 防止 autoplay 被瀏覽器擋掉時 UI 不對
    video.addEventListener("play", updateUI);
    video.addEventListener("pause", updateUI);
  });
}
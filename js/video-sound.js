export function initVideoSound() {
  const videoGroups = document.querySelectorAll(".video-frame, .hero__video-stage");

  let activeVideo = null;

  videoGroups.forEach((group) => {
    const video = group.querySelector("[data-video]");
    const toggle = group.querySelector("[data-sound-toggle]");
    const icon = group.querySelector("[data-sound-icon]");

    if (!video || !toggle || !icon) return;

    const updateUI = () => {
      const isMuted = video.muted;
      toggle.classList.toggle("is-muted", isMuted);
      icon.textContent = isMuted ? "🔇" : "🔊";
    };

    updateUI();

    toggle.addEventListener("click", async () => {
      try {
        // 👉 如果有其他影片正在播放聲音 → 先關掉
        if (activeVideo && activeVideo !== video) {
          activeVideo.muted = true;

          const activeGroup = activeVideo.closest(".video-frame, .hero__video-stage");
          if (activeGroup) {
            const activeIcon = activeGroup.querySelector("[data-sound-icon]");
            const activeToggle = activeGroup.querySelector("[data-sound-toggle]");

            if (activeIcon) activeIcon.textContent = "🔇";
            if (activeToggle) activeToggle.classList.add("is-muted");
          }
        }

        if (video.muted) {
          video.muted = false;
          video.volume = 1;
          await video.play();
          activeVideo = video;
        } else {
          video.muted = true;
          activeVideo = null;
        }

        updateUI();
      } catch (err) {
        console.error("Video sound toggle error:", err);
      }
    });
  });
}
export function initVideoSound() {
  const videoGroups = document.querySelectorAll(".video-frame, .hero__video-stage");
  let activeVideo = null;

  const updateUI = (video, toggle, icon) => {
    const isMuted = video.muted;

    toggle.classList.toggle("is-muted", isMuted);
    toggle.setAttribute("aria-pressed", String(!isMuted));
    toggle.setAttribute("aria-label", isMuted ? "Unmute video" : "Mute video");
    icon.textContent = isMuted ? "🔇" : "🔊";
  };

  videoGroups.forEach((group) => {
    const video = group.querySelector("[data-video]");
    const toggle = group.querySelector("[data-sound-toggle]");
    const icon = group.querySelector("[data-sound-icon]");

    if (!video || !toggle || !icon) return;

    updateUI(video, toggle, icon);

    toggle.addEventListener("click", async () => {
      try {
        if (activeVideo && activeVideo !== video) {
          activeVideo.muted = true;

          const activeGroup = activeVideo.closest(".video-frame, .hero__video-stage");
          if (activeGroup) {
            const activeToggle = activeGroup.querySelector("[data-sound-toggle]");
            const activeIcon = activeGroup.querySelector("[data-sound-icon]");

            if (activeToggle && activeIcon) {
              updateUI(activeVideo, activeToggle, activeIcon);
            }
          }
        }

        if (video.muted) {
          video.muted = false;
          video.volume = 1;
          await video.play();
          activeVideo = video;
        } else {
          video.muted = true;
          if (activeVideo === video) {
            activeVideo = null;
          }
        }

        updateUI(video, toggle, icon);
      } catch (err) {
        console.error("Video sound toggle error:", err);
      }
    });
  });
}
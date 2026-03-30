export function initVideoPlay() {
  const groups = document.querySelectorAll(".video-frame, .hero__video-stage");
  let activeVideo = null;

  const updatePlayUI = (video, toggle, icon) => {
    const isPlaying = !video.paused;
    toggle.classList.toggle("is-playing", isPlaying);
    toggle.setAttribute("aria-pressed", String(isPlaying));
    toggle.setAttribute("aria-label", isPlaying ? "Pause video" : "Play video");
    icon.textContent = isPlaying ? "⏸" : "▶";
  };

  const updateProgressUI = (video, progressBar) => {
    if (!video.duration || !isFinite(video.duration)) {
      progressBar.style.width = "0%";
      return;
    }

    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.width = `${percent}%`;
  };

  groups.forEach((group) => {
    const video = group.querySelector("[data-video]");
    const playToggle = group.querySelector("[data-play-toggle]");
    const playIcon = group.querySelector("[data-play-icon]");
    const progress = group.querySelector("[data-progress]");
    const progressBar = group.querySelector("[data-progress-bar]");

    if (!video || !playToggle || !playIcon) return;

    updatePlayUI(video, playToggle, playIcon);

    if (progress && progressBar) {
      updateProgressUI(video, progressBar);

      video.addEventListener("timeupdate", () => {
        updateProgressUI(video, progressBar);
      });

      video.addEventListener("loadedmetadata", () => {
        updateProgressUI(video, progressBar);
      });

      progress.addEventListener("click", (event) => {
        if (!video.duration || !isFinite(video.duration)) return;

        const rect = progress.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const ratio = Math.max(0, Math.min(1, clickX / rect.width));
        video.currentTime = ratio * video.duration;
        updateProgressUI(video, progressBar);
      });
    }

    playToggle.addEventListener("click", async () => {
      try {
        // 如果目前要播放新影片，先暫停其他影片
        if (video.paused) {
          groups.forEach((otherGroup) => {
            const otherVideo = otherGroup.querySelector("[data-video]");
            const otherToggle = otherGroup.querySelector("[data-play-toggle]");
            const otherIcon = otherGroup.querySelector("[data-play-icon]");

            if (!otherVideo || !otherToggle || !otherIcon) return;
            if (otherVideo !== video) {
              otherVideo.pause();
              updatePlayUI(otherVideo, otherToggle, otherIcon);
            }
          });

          await video.play();
          activeVideo = video;
        } else {
          video.pause();
          if (activeVideo === video) activeVideo = null;
        }

        updatePlayUI(video, playToggle, playIcon);
      } catch (err) {
        console.error("Video play toggle error:", err);
      }
    });

    video.addEventListener("play", () => {
      updatePlayUI(video, playToggle, playIcon);
    });

    video.addEventListener("pause", () => {
      updatePlayUI(video, playToggle, playIcon);
    });

    video.addEventListener("ended", () => {
      updatePlayUI(video, playToggle, playIcon);
    });
  });
}
export function initVideoPlay() {
  const allGroups = document.querySelectorAll(".video-frame, .hero__video-stage");
  const demoGroups = document.querySelectorAll(".video-frame");

  const updatePlayUI = (video, toggle, icon) => {
    const isPlaying = !video.paused;
    toggle.classList.toggle("is-playing", isPlaying);
    toggle.setAttribute("aria-pressed", String(isPlaying));
    toggle.setAttribute("aria-label", isPlaying ? "Pause video" : "Play video");
    icon.textContent = isPlaying ? "⏸" : "▶";
  };

  const updateProgressUI = (video, progressBar) => {
    if (!progressBar) return;

    if (!video.duration || !isFinite(video.duration)) {
      progressBar.style.width = "0%";
      return;
    }

    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.width = `${percent}%`;
  };

  const seekToPosition = (video, progress, progressBar, clientX) => {
    if (!video.duration || !isFinite(video.duration)) return;

    const rect = progress.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, offsetX / rect.width));

    video.currentTime = ratio * video.duration;
    updateProgressUI(video, progressBar);
  };

  const requestFullscreenFor = async (target) => {
    if (!target) return;

    try {
      if (target.requestFullscreen) {
        await target.requestFullscreen();
      } else if (target.webkitRequestFullscreen) {
        target.webkitRequestFullscreen();
      } else if (target.webkitEnterFullscreen && target.tagName === "VIDEO") {
        target.webkitEnterFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  allGroups.forEach((group) => {
    const video = group.querySelector("[data-video]");
    const playToggle = group.querySelector("[data-play-toggle]");
    const playIcon = group.querySelector("[data-play-icon]");
    const progress = group.querySelector("[data-progress]");
    const progressBar = group.querySelector("[data-progress-bar]");
    const expandToggle = group.querySelector("[data-expand-toggle]");

    if (!video || !playToggle || !playIcon) return;

    updatePlayUI(video, playToggle, playIcon);
    updateProgressUI(video, progressBar);

    let isDraggingProgress = false;
    const isDemoVideo = group.classList.contains("video-frame");

    playToggle.addEventListener("click", async () => {
      try {
        if (video.paused) {
          // 只有 Demo 區影片彼此互斥，Hero 不受影響
          if (isDemoVideo) {
            demoGroups.forEach((otherGroup) => {
              const otherVideo = otherGroup.querySelector("[data-video]");
              const otherToggle = otherGroup.querySelector("[data-play-toggle]");
              const otherIcon = otherGroup.querySelector("[data-play-icon]");

              if (!otherVideo || !otherToggle || !otherIcon) return;
              if (otherVideo !== video) {
                otherVideo.pause();
                updatePlayUI(otherVideo, otherToggle, otherIcon);
              }
            });
          }

          await video.play();
        } else {
          video.pause();
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

    video.addEventListener("timeupdate", () => {
      if (!isDraggingProgress) {
        updateProgressUI(video, progressBar);
      }
    });

    video.addEventListener("loadedmetadata", () => {
      updateProgressUI(video, progressBar);
    });

    if (progress && progressBar) {
      progress.addEventListener("pointerdown", (event) => {
        isDraggingProgress = true;
        progress.setPointerCapture?.(event.pointerId);
        seekToPosition(video, progress, progressBar, event.clientX);
      });

      progress.addEventListener("pointermove", (event) => {
        if (!isDraggingProgress) return;
        seekToPosition(video, progress, progressBar, event.clientX);
      });

      const endDrag = (event) => {
        if (!isDraggingProgress) return;
        isDraggingProgress = false;

        if (event?.clientX != null) {
          seekToPosition(video, progress, progressBar, event.clientX);
        }
      };

      progress.addEventListener("pointerup", endDrag);
      progress.addEventListener("pointercancel", endDrag);
      progress.addEventListener("lostpointercapture", () => {
        isDraggingProgress = false;
      });
    }

    if (expandToggle) {
      expandToggle.addEventListener("click", async () => {
        await requestFullscreenFor(video);
      });
    }
  });
}
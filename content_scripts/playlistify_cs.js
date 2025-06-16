(() => {
  // use anywhere
  const video = document.querySelector("video");

  // use at repeat recent
  let repeatCount = 0;
  let videoTimeUpdateHandler = null;

  function playPause() {
    if (video.paused) {
      video.play().catch((e) => {
        alert("Please click anywhere...");
        console.error("Can't use autoplay : ", e);
      });
    } else {
      video.pause();
    }
  }

  function repeatRecent(n) {
    if (videoTimeUpdateHandler) {
      video.removeEventListener("timeupdate", videoTimeUpdateHandler);
    }

    repeatCount = n;
    video.loop = n > 0;

    if (video.loop) {
      let lastTime = 0;
      videoTimeUpdateHandler = () => {
        // need more safe for checking currentTime, but at least it works!
        if (video.currentTime < lastTime && video.currentTime < 0.1) {
          repeatCount--;
          browser.storage.local.set({ repeatRecent: repeatCount });

          if (repeatCount <= 0) {
            video.loop = false;
            video.removeEventListener("timeupdate", videoTimeUpdateHandler);
          }
        }

        lastTime = video.currentTime;
      };

      video.addEventListener("timeupdate", videoTimeUpdateHandler);
    }
  }

  function loop(isLoop) {
    video.loop = isLoop;
  }

  browser.runtime.onMessage.addListener((message) => {
    if (!video) return;

    if (video && message.action.includes("play-pause")) {
      playPause();
    }

    if (video && message.action.includes("repeat-recent")) {
      repeatRecent(parseInt(message.value || 0));
    }

    if (video && message.action.includes("loop")) {
      loop(message.value);
    }
  });
})();

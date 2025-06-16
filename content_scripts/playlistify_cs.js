(() => {
  // use anywhere
  let video = document.querySelector("video");

  const observer = new MutationObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.oldValue) {
        browser.storage.local.get(["repeatRecent", "loop"], (data) => {
          // later...
          // repeatRecent(data.repeatRecent || 0);
          video.loop = data.loop || false;
        });
      }
    });
  });
  observer.observe(video, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ["src"],
  });

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
    if (!video) {
      video = document.querySelector("video");
      if (!video) return;
    }

    if (video && message.action.includes("play-pause")) playPause();

    if (video && message.action.includes("repeat-recent"))
      repeatRecent(parseInt(message.value || 0));

    if (video && message.action.includes("loop")) loop(message.value);
  });
})();

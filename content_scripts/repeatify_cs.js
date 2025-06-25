(() => {
  browser.storage.local.clear();
  // use anywhere
  let video = document.querySelector("video");

  // use when browser get refresh / first load!
  const observeVideo = new MutationObserver((entries) => {
    entries.forEach((e) => {
      if (
        e.target.nodeName.includes("VIDEO") &&
        e.attributeName.includes("src")
      ) {
        video = document.querySelector("video");
        observeVideo.disconnect();

        checkStorage(video);
        obsChangeSong(video);

        document.querySelector(".playback-rate").hidden = false;
        document.querySelector(".repeat").hidden = true;
      }
    });
  });
  observeVideo.observe(document.querySelector("#player"), optObsVideo);

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
    cleanupHandlers(video);

    repeatCount = n;
    video.loop = n > 0;
    currentSrc = video.src;

    if (n > 0) {
      let lastTime = 0;
      videoTimeUpdateHandler = () => {
        // need more safe for checking currentTime, but at least it works!
        if (
          Math.abs(video.currentTime - lastTime) > 0.5 &&
          video.currentTime < 0.1 &&
          currentSrc == video.src
        ) {
          repeatCount--;
          browser.storage.local.set({ leftRepeat: repeatCount });

          if (repeatCount <= 0) {
            video.loop = false;
            cleanupHandlers(video);

            browser.storage.local.get(["every"], (data) => {
              if (data.every) {
                videoEndedHandler = () => {
                  browser.storage.local.set({ leftRepeat: n });
                  repeatRecent(n);
                };
                video.addEventListener("ended", videoEndedHandler);
              }
            });
          }
        } else {
          if (currentSrc != video.src) {
            repeatCount = n;
            video.loop = n > 0;
            currentSrc = video.src;
          }
        }

        lastTime = video.currentTime;
      };

      video.addEventListener("timeupdate", videoTimeUpdateHandler);
    }
  }

  function loop(isLoop) {
    video.loop = isLoop;
    if (isLoop) {
      cleanupHandlers(video);
    } else {
      browser.storage.local.get(["leftRepeat"], (data) => {
        const left = parseInt(data.leftRepeat);
        if (left > 0) {
          repeatRecent(left);
        }
      });
    }
  }

  browser.runtime.onMessage.addListener((message) => {
    if (!video) return;

    if (message.action.includes("play-pause")) playPause();

    if (message.action.includes("repeat-recent"))
      repeatRecent(parseInt(message.value || 0));

    if (message.action.includes("loop")) loop(message.value);

    if (message.action.includes("every")) console.log(message.value);
  });
})();

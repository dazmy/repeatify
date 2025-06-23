const optObsVideo = {
  childList: true,
  subtree: true,
  attributes: true,
  attributeOldValue: true,
  attributeFilter: ["src"],
};

// use at repeat recent
let repeatCount = 0;
let videoTimeUpdateHandler = null;
let videoEndedHandler = null;
let currentSrc = "";

function cleanupHandlers(video) {
  if (videoTimeUpdateHandler) {
    video.removeEventListener("timeupdate", videoTimeUpdateHandler);
    videoTimeUpdateHandler = null;
  }
  if (videoEndedHandler) {
    video.removeEventListener("ended", videoEndedHandler);
    videoEndedHandler = null;
  }
}

function checkStorage(video) {
  browser.storage.local.get(["repeatRecent", "loop", "every"], (data) => {
    // later...
    // repeatRecent(data.repeatRecent || 0);
    video.loop = data.loop || false;
    if (!video.loop) {
      if (data.every) {
        video.loop = data.every;
        browser.storage.local.set({ leftRepeat: data.repeatRecent });
      } else {
        browser.storage.local.set({ leftRepeat: 0 });
        video.loop = false;
        cleanupHandlers(video);
      }
    }
  });
}

function obsChangeSong(video) {
  const observeChangeSong = new MutationObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.oldValue) {
        checkStorage(video);
      }
    });
  });

  observeChangeSong.observe(video, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ["src"],
  });
}

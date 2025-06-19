const optObsVideo = {
  childList: true,
  subtree: true,
  attributes: true,
  attributeOldValue: true,
  attributeFilter: ["src"],
};

function checkStorage(video) {
  browser.storage.local.get(["repeatRecent", "loop", "every"], (data) => {
    // later...
    // repeatRecent(data.repeatRecent || 0);
    video.loop = data.loop || false;
    if (!video.loop) {
      video.loop = data.every;
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

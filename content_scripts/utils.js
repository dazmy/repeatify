const optObsVideo = {
  childList: true,
  subtree: true,
  attributes: true,
  attributeOldValue: true,
  attributeFilter: ["src"],
};

function checkStorage(video) {
  browser.storage.local.get(["repeatRecent", "loop"], (data) => {
    // later...
    // repeatRecent(data.repeatRecent || 0);
    video.loop = data.loop || false;
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

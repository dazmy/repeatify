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

function obsChangeSongImg(image, imageSmall) {
  const observeChangeSongImg = new MutationObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target.src && entry.target.src.includes("googleusercontent")) {
        if (entry.target.id.includes("img")) {
          browser.storage.local.set({ defaultImg: entry.target.src });
        }

        browser.storage.local.get(["sfw", "randomImg"], (data) => {
          const sfw = data.sfw || false;
          const randomImg = data.randomImg || "";
          if (sfw) {
            entry.target.src = randomImg;
          }
        });
      }
    });
  });

  observeChangeSongImg.observe(image, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ["src"],
  });

  observeChangeSongImg.observe(imageSmall, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ["src"],
  });
}

function randomImage() {
  const images = [
    "https://i.pinimg.com/736x/6e/8d/03/6e8d03749649ecb8b998e72c98694815.jpg",
    "https://i.pinimg.com/originals/d4/63/3d/d4633ddb3bf09bbca5ffee063d3f48cc.jpg",
    "https://i.pinimg.com/736x/a5/74/b1/a574b1145c636a11a7e36c69b1ad1a10.jpg",
    "https://i.pinimg.com/736x/9c/bb/f1/9cbbf11f13f5fca5db63da003f019ae5.jpg",
    "https://i.pinimg.com/originals/be/b8/db/beb8db4141cc8d7b9f1f0362c891a018.jpg",
    "https://i.pinimg.com/originals/d2/9b/c9/d29bc9830b70c0436eddb9310972b893.jpg",
    "https://i.pinimg.com/originals/34/9c/cd/349ccd6e2e3d80a4f4c8fec8b71f530e.jpg",
    "https://i.pinimg.com/originals/8a/76/fa/8a76fa77a4f741ab07cc70269df0b11e.jpg",
  ];
  return images[Math.floor(Math.random() * images.length)];
}

function changeImageRandom(image, imageSmall) {
  const newSrc = randomImage();
  browser.storage.local.set({ randomImg: newSrc });

  if (image) image.src = newSrc;
  if (imageSmall) imageSmall.src = newSrc;
}
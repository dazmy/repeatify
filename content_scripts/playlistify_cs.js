(() => {
  browser.runtime.onMessage.addListener((message) => {
    const video = document.querySelector("video");

    if (video && message.action.includes("play-pause")) {
      if (video.paused) {
        video.play().catch((e) => {
          alert("Please click anywhere...");
          console.error("Can't use autoplay : ", e);
        });
      } else if (video.played) {
        video.pause();
      }
    }
  });
})();

(() => {
  const video = document.querySelector("video");

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

  browser.runtime.onMessage.addListener((message) => {
    if (!video) return;

    if (video && message.action.includes("play-pause")) {
      playPause();
    }
  });
})();

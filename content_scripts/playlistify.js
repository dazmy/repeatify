const playButton = document.getElementById("play-pause-button");

browser.runtime.onMessage.addListener((message) => {
  if (playButton) {
    playButton.click();
  }
});

const playPauseButton = document.getElementById("play-pause-button");
const isPlay = playPauseButton.getAttribute("title").includes("Jeda");

if (isPlay) {
  console.log("SUDAH JALAN DARI TADI");
} else {
  playPauseButton.click();
}

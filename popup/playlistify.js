const button = document.getElementById("play");
const recentSong = document.querySelector("input#recentSong");
const loopSong = document.querySelector("input#loop");
const buttonSave = document.querySelector("button#saveRepeat");
const leftRepeat = document.querySelector("span#leftRepeat");

function checkLoop(isLoop) {
  if (isLoop) {
    recentSong.disabled = true;
    buttonSave.disabled = true;
    leftRepeat.textContent = "∞";
  } else {
    recentSong.disabled = false;
    buttonSave.disabled = false;
    browser.storage.local.get(["leftRepeat"], (data) => {
      leftRepeat.textContent = data.leftRepeat || 0;
    });
  }
}

function exec(tabs) {
  if (!tabs.length) {
    browser.tabs.create({ url: "https://music.youtube.com" });
  } else {
    browser.tabs.sendMessage(tabs[0].id, {
      action: "play-pause",
    });
  }
}

function repeatRecent(tabs, repeat) {
  browser.tabs.sendMessage(tabs[0].id, {
    action: "repeat-recent",
    value: repeat,
  });
  browser.storage.local.set({ repeatRecent: repeat, leftRepeat: repeat });
  recentSong.value = repeat;
  leftRepeat.textContent = repeat;
}

function loop(tabs, isLoop) {
  checkLoop(isLoop);
  browser.tabs.sendMessage(tabs[0].id, {
    action: "loop",
    value: isLoop,
  });
  browser.storage.local.set({ loop: isLoop });
}

function err(err) {
  console.error("error : ", err);
}

/**
 * set value input
 */
browser.storage.local.get(["repeatRecent", "loop"], (data) => {
  recentSong.value = data.repeatRecent || 0;
  loopSong.checked = data.loop || false;

  checkLoop(loopSong.checked);
});

/**
 * event listener
 */
button.addEventListener("click", () => {
  browser.tabs.query({ url: "*://music.youtube.com/*" }).then(exec).catch(err);
});

buttonSave.addEventListener("click", () => {
  browser.tabs
    .query({ url: "*://music.youtube.com/*" })
    .then((tabs) => repeatRecent(tabs, recentSong.value))
    .catch(err);
});

loopSong.addEventListener("change", (e) => {
  browser.tabs
    .query({ url: "*://music.youtube.com/*" })
    .then((tabs) => loop(tabs, e.target.checked))
    .catch(err);
});

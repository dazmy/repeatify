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
  browser.storage.local.set({ repeatRecent: repeat });
}

function loop(tabs, isLoop) {
  browser.tabs.sendMessage(tabs[0].id, {
    action: "loop",
    value: isLoop,
  });
  browser.storage.local.set({ loop: isLoop });
}

function err(tabs) {
  console.error("error : ", tabs);
}

const button = document.getElementById("play");
const recentSong = document.querySelector("input#recentSong");
const loopSong = document.querySelector("input#loop");

/**
 * set value input
 */
browser.storage.local.get("repeatRecent", (data) => {
  recentSong.value = data.repeatRecent;
});

browser.storage.local.get("loop", (data) => {
  loopSong.checked = data.loop;
});

/**
 * event listener
 */
button.addEventListener("click", () => {
  browser.tabs.query({ url: "*://music.youtube.com/*" }).then(exec).catch(err);
});

recentSong.addEventListener("input", () => {
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

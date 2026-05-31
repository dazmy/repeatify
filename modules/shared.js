function exec(tabs, browser) {
  if (!tabs.length) {
    browser.tabs.create({ url: "https://music.youtube.com" });
  } else {
    browser.tabs.sendMessage(tabs[0].id, {
      action: "play-pause",
    });
  }
}

function sfw(tabs, isSfw) {
  browser.tabs.sendMessage(tabs[0].id, {
    action: "sfw",
    value: isSfw,
  });
  browser.storage.local.set({ sfw: isSfw });
}

// only here not inside popup/repeatify.js
function loopShared(tabs, isLoop, browser) {
  browser.tabs.sendMessage(tabs[0].id, {
    action: "loop",
    value: isLoop,
  });
  browser.storage.local.set({ loop: isLoop });
}

function err(err) {
  console.error("error : ", err);
}

export { exec, loopShared, sfw, err };

function exec(tabs, browser) {
  if (!tabs.length) {
    browser.tabs.create({ url: "https://music.youtube.com" });
  } else {
    browser.tabs.sendMessage(tabs[0].id, {
      action: "play-pause",
    });
  }
}

function err(err) {
  console.error("error : ", err);
}

export { exec, err };

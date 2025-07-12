function exec(tabs) {
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

browser.commands.onCommand.addListener((command) => {
  if (command.includes("play-pause")) {
    browser.tabs
      .query({ url: "*://music.youtube.com/*" })
      .then(exec)
      .catch(err);
  }
});

import { exec, loopShared, err } from "../modules/shared.js";

browser.commands.onCommand.addListener((command) => {
  if (command.includes("play-pause")) {
    browser.tabs
      .query({ url: "*://music.youtube.com/*" })
      .then((tabs) => exec(tabs, browser))
      .catch(err);
  }

  if (command.includes("loop")) {
    let isLoop = false;
    browser.storage.local.get(["loop"], (data) => {
      isLoop = !(data.loop || false);

      browser.tabs
        .query({ url: "*://music.youtube.com/*" })
        .then((tabs) => loopShared(tabs, isLoop, browser))
        .catch(err);
    });
  }
});

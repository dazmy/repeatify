import { exec, err } from "../modules/shared.js";

browser.commands.onCommand.addListener((command) => {
  if (command.includes("play-pause")) {
    browser.tabs
      .query({ url: "*://music.youtube.com/*" })
      .then((tabs) => exec(tabs, browser))
      .catch(err);
  }
});

import { exec, loopShared, err } from "../modules/shared.js";

function alertLoop(tabs, isLoop) {
  const message = isLoop
    ? "Repeat Current Active ✅"
    : "Repeat Current Not Active ❌";

  browser.tabs.executeScript(tabs[0].id, {
    code: `
    (function() {
      const existingPopup = document.getElementById('repeatify-popup');
      if (existingPopup) {
        clearTimeout(Number(existingPopup.dataset.timeoutId));
        existingPopup.remove();
      }

      const popup = document.createElement('div');
      popup.id = 'repeatify-popup';
      popup.style.position = 'fixed';
      popup.style.bottom = '20px';
      popup.style.right = '20px';
      popup.style.padding = '10px';
      popup.style.background = '#26D5E8';
      popup.style.color = 'black';
      popup.style.zIndex = '9999';
      popup.textContent = '${message}';
      document.body.appendChild(popup);
      const timeoutId = setTimeout(() => popup.remove(), 3000);
      popup.dataset.timeoutId = timeoutId;
    })();
    `,
  });
}

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

      browser.tabs
        .query({ active: true, currentWindow: true })
        .then((tabs) => alertLoop(tabs, isLoop))
        .catch(err);
    });
  }
});

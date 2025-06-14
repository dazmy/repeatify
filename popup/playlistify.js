function exec(tabs) {
  if (!tabs.length) {
    browser.tabs.create({ url: "https://music.youtube.com" });
  } else {
    browser.tabs.sendMessage(tabs[0].id, {
      command: "TEST",
    });
  }
}

function err(tabs) {
  console.error("error : ", tabs);
}

const button = document.getElementById("play");

button.addEventListener("click", () => {
  browser.tabs.query({ url: "*://music.youtube.com/*" }).then(exec).catch(err);
});

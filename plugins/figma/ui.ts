let loaded = false;

window.onmessage = async (msg: any) => {
  console.log("UI recieved", msg);
  if (msg.source != window.parent) {
    window.parent.postMessage(msg.data, "*");
    loaded = true;
  } else {
    let nuxt = window.frames[0];

    nuxt.postMessage(msg.data.pluginMessage, "*");
  }
};
checkPageLoaded();
async function checkPageLoaded() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (loaded) return;

  openDriverPage();
}

function openDriverPage() {
  window.open("https://axifigma.steftervel.de");
}

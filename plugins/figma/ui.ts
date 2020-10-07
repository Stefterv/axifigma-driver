window.onmessage = async (msg: any) => {
  console.log("UI recieved", msg);
  if (msg.source != window.parent) {
    window.parent.postMessage(msg.data, "*");
  } else {
    let nuxt = window.frames[0];

    nuxt.postMessage(msg.data.pluginMessage, "*");
  }
};

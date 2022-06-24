// TODO: Cleanup unregistered properties
export function registerProperty(
  property: string,
  callback: (data: any) => {}
) {
  function parseMessageData(msg: MessageEvent) {
    console.log("Nuxt recieved", msg.data, property);
    let { pluginMessage } = msg.data;
    if (!pluginMessage || !pluginMessage[property]) return;
    callback(pluginMessage[property]);
  }
  window.addEventListener("message", parseMessageData);
}

if (process.client) window.parent.postMessage({ pluginMessage: "👋" }, "*");

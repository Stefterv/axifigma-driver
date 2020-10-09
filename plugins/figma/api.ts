const registeredProperties: String[] = [];

export function registerProperty(
  property: string,
  callback: (data: any) => {}
) {
  if (registeredProperties.includes(property)) {
    console.warn("Property already registered");
  }

  window.addEventListener("message", (msg) => {
    console.log("Nuxt recieved", msg.data);
    let { pluginMessage } = msg.data;
    if (!pluginMessage[property]) return;
    callback(pluginMessage[property]);
  });
}

if (process.client) window.parent.postMessage({ pluginMessage: "👋" }, "*");

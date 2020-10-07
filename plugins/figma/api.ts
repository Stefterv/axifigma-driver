const registeredProperties: String[] = [];

export function registerProperty(
  property: string,
  callback: (data: any) => {}
) {
  if (registeredProperties.includes(property)) {
    console.warn("Property already registered");
  }

  window.addEventListener("message", (msg) => {
    if (!msg.data[property]) return;
    callback(msg.data[property]);
  });
}

if (process.client) window.parent.postMessage({ pluginMessage: "👋" }, "*");

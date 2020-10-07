import { menubar } from "menubar";
import { Nuxt, loadNuxtConfig } from "nuxt";
import saxi from "saxi";

async function startNuxt() {
  let rootDir = process.nuxtDir;
  let config = await loadNuxtConfig({ for: "start", rootDir });
  config.rootDir = rootDir;
  config.dev = false;
  let nuxt = new Nuxt(config);
  await nuxt.ready();
  let server = await nuxt.listen(3000);
  console.log("Nuxt server running at ", server.port);
}
startNuxt();
saxi.server.startServer(9090);

const _NUXT_URL_ = `http://localhost:3000`;
const mb = menubar({
  index: _NUXT_URL_,
});
const { app } = mb;

const gotTheLock = app.requestSingleInstanceLock();
if (gotTheLock) {
  registerProtocol("axidraw");
} else {
  app.quit();
}
mb.on("ready", () => {
  console.log("Electron Running");
});

function registerProtocol(protocol) {
  if (!app.isDefaultProtocolClient(protocol)) {
    app.setAsDefaultProtocolClient(protocol);
  }
}

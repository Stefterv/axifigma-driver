import { menubar } from "menubar";
import { Nuxt, loadNuxtConfig } from "nuxt";
import saxi from "saxi";
import path from "path";
import { nuxtPort, saxiPort } from "~/nuxt.config";

async function startNuxt() {
  let rootDir = path.join(__dirname, "../../");
  let config = await loadNuxtConfig({ for: "start", rootDir });
  config.rootDir = rootDir;
  config.dev = false;
  let nuxt = new Nuxt(config);
  await nuxt.ready();
  let server = await nuxt.listen(nuxtPort);
  console.log("Nuxt server running at ", server.port);
}
startNuxt();
saxi.server.startServer(saxiPort);

const _NUXT_URL_ = `http://localhost:${nuxtPort}`;
const mb = menubar({
  index: _NUXT_URL_,
  icon: "static/menubar/icon@2x.png",
  showDockIcon: false,
});
const { app } = mb;

const gotTheLock = app.requestSingleInstanceLock();
if (gotTheLock) {
  registerProtocol("axidraw");
} else {
  app.quit();
}
mb.on("ready", () => {
  console.log("Electron Running!");
});

function registerProtocol(protocol) {
  if (!app.isDefaultProtocolClient(protocol)) {
    app.setAsDefaultProtocolClient(protocol);
  }
}

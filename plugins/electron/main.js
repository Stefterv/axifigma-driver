import { menubar } from "menubar";
import { Nuxt, loadNuxtConfig } from "nuxt";
import saxi from "saxi";
import path from "path";
import { nuxtPort, saxiPort } from "~/nuxt.config";
import consola from "consola";

const rootDir = path.join(__dirname, "../../");
async function startNuxt() {
  let config = await loadNuxtConfig({ for: "start", rootDir });
  config.rootDir = rootDir;
  config.dev = false;
  let nuxt = new Nuxt(config);
  await nuxt.ready();
  try {
    let server = await nuxt.listen(nuxtPort);
    console.log("Nuxt server running at ", server.port);
  } catch (err) {
    if (err.code == "EADDRINUSE") return;
    console.warn("Nuxt not started", err);
  }
}
startNuxt();
saxi.server.startServer(saxiPort);

const _NUXT_URL_ = `http://127.0.0.1:${nuxtPort}/main`;
const mb = menubar({
  index: _NUXT_URL_,
  icon: `${rootDir}/static/menubar/icon@2x.png`,
  showDockIcon: false,
  browserWindow: {
    width: 300,
    height: 66,
  },
});
mb.on("ready", () => {
  consola.info("Electron Running!");
});
const { app } = mb;

const gotTheLock = app.requestSingleInstanceLock();
if (gotTheLock) {
  registerProtocol("axidraw");
} else {
  app.quit();
}

function registerProtocol(protocol) {
  if (!app.isDefaultProtocolClient(protocol)) {
    app.setAsDefaultProtocolClient(protocol);
  }
}

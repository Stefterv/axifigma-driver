import { menubar } from "menubar";
import { loadNuxt } from "nuxt";

loadNuxt("start");
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

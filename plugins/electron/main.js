import electron from "electron";
import path from "path";

let win = null;

const app = electron.app;
const _NUXT_URL_ = `http://localhost:3000`;

debugger;

const newWin = () => {
  win = new electron.BrowserWindow({
    icon: path.join(__dirname, "../static/icon.png"),
  });
  win.maximize();
  win.on("closed", () => (win = null));
  win.loadURL(_NUXT_URL_);
};
app.on("ready", newWin);
app.on("window-all-closed", () => app.quit());
app.on("activate", () => win === null && newWin());

import electron from "electron";
import path from "path";
import { menubar } from "menubar";

let win = null;

// const app = electron.app;
const _NUXT_URL_ = `http://localhost:3000`;

// const newWin = () => {
//   win = new electron.BrowserWindow({
//     icon,
//   });
//   win.maximize();
//   win.on("closed", () => (win = null));
//   win.loadURL(_NUXT_URL_);
// };
// app.on("ready", newWin);
// app.on("window-all-closed", () => app.quit());
// app.on("activate", () => win === null && newWin());
const mb = menubar({
  index: _NUXT_URL_,
});

mb.on("ready", () => {
  console.log("app is ready");
  // your app code here
});

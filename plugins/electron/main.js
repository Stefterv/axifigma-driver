import electron from "electron";
import path from "path";
import { menubar } from "menubar";

const _NUXT_URL_ = `http://localhost:3000`;
const mb = menubar({
  index: _NUXT_URL_,
});

mb.on("ready", () => {
  console.log("Electron Running");
});

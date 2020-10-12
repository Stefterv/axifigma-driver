import registerMessage from "./main/registerMessage";

figma.showUI(__html__, {
  width: 300,
  height: 66,
});

figma.on("selectionchange", () => {
  figma.ui.postMessage({ pageChanged: true });
});
figma.on("currentpagechange", () => {
  figma.ui.postMessage({ pageChanged: true });
});

async function exportSVG() {
  let svg = await figma.currentPage.exportAsync({
    format: "SVG",
    svgOutlineText: true,
    svgSimplifyStroke: true,
    svgIdAttribute: true,
  });
  figma.ui.postMessage({ svg });
}
registerMessage("sendSVG", exportSVG);

import Seen from "./main/Seen";
registerMessage("sendSeen", Seen.display);
registerMessage("triggerSeen", Seen.trigger);

import Resize from "./main/Resize";
registerMessage("resize", Resize);

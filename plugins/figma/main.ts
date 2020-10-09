import registerMessage from "./main/registerMessage";

figma.showUI(__html__);

figma.on("selectionchange", () => {
  figma.ui.postMessage({ pageChanged: true });
});

async function exportSVG() {
  let svg = await figma.currentPage.exportAsync({
    format: "SVG",
    svgOutlineText: true,
    svgSimplifyStroke: true,
  });
  figma.ui.postMessage({ svg });
}

import Seen from "./main/Seen";
registerMessage("sendSeen", Seen.display);
registerMessage("triggerSeen", Seen.trigger);
registerMessage("sendSVG", exportSVG);

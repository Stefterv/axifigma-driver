import registerMessage from "./main/registerMessage";

figma.showUI(__html__, {
  width: 300,
  height: 66,
});

figma.on("selectionchange", () => {
  let select = figma.currentPage.selection.filter((item) =>
    figma.currentPage.children.includes(item)
  );
  if (!select[0]) return;
  frame = select[0];

  figma.ui.postMessage({ pageChanged: true });
});
figma.on("currentpagechange", () => {
  frame = figma.currentPage.children[0];
  figma.ui.postMessage({ pageChanged: true });
});

let frame = figma.currentPage.selection[0] || figma.currentPage.children[0];
async function exportSVG() {
  let svg = await frame.exportAsync({
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

function insertCurrent({ size, presetName }) {
  let frame = figma.createFrame();
  frame.resize(size.x, size.y);
  frame.name = `AxiDraw - ${presetName}`;
  figma.currentPage.appendChild(frame);
  // ;
  // console.log(size);
}
registerMessage("insertCurrent", insertCurrent);

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
registerMessage("sendSVG", exportSVG);
function registerMessage(type, cb) {
  figma.ui.onmessage = (msg) => {
    if (msg.type !== type) return;
    cb(msg);
  };
}

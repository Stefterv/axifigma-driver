figma.showUI(__html__);

figma.ui.onmessage = (msg) => {
  if (msg.type === "create-rectangles") {
    const nodes: SceneNode[] = [];
    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [
        {
          type: "SOLID",
          color: { r: 1, g: 0.5, b: 0 },
        },
      ];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }
  // TODO: Listen for window size changes
};

exportSVG();
async function exportSVG() {
  let svg = await figma.currentPage.exportAsync({
    format: "SVG",
    svgOutlineText: true,
    svgSimplifyStroke: true,
  });
  figma.ui.postMessage({ svg });
}

// TOOD: Start tracking when the document changes

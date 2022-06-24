export default async function exportSVG() {
  let svg = await figma.currentPage.exportAsync({
    format: "SVG",
    svgOutlineText: true,
    svgSimplifyStroke: true,
  });
  console.log("Sending SVG");
  figma.ui.postMessage({ svg });
}

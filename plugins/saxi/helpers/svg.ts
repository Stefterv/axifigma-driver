import { flattenSVG } from "flatten-svg";

export function svgToPlan(svg: Uint8Array) {
  let paths = svgStringToPaths(svg);
  debugger;
}

export function svgStringToPaths(svg: Uint8Array) {
  let div = document.createElement("div");
  let svgString = new TextDecoder().decode(svg);
  let el = null;
  try {
    div.innerHTML = svgString;
    el = div.children[0] as SVGElement;
  } catch {
    throw "Not a valid svg";
  }
  return svgElementToPaths(el);
}

export function svgElementToPaths(svg: SVGElement) {
  // copied from nornagon/saxi/src/ui.tsx/readSvg
  return flattenSVG(svg).map((line: any) => {
    const a = line.points.map(([x, y]: [number, number]) => ({ x, y }));
    (a as any).stroke = line.stroke;
    (a as any).groupId = line.groupId;
    return a;
  });
}

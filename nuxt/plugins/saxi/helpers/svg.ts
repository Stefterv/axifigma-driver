import { flattenSVG } from "flatten-svg";
import { replan } from "~/node_modules/saxi/src/massager";
import {
  PlanOptions,
  defaultPlanOptions,
} from "~/node_modules/saxi/src/planning";
import { Vec2 } from "~/node_modules/saxi/src/vec";

export function svgToPlan(svgData: Uint8Array, profile: PlanOptions) {
  let { svg, paths } = svgStringToPaths(svgData);

  const strokes = new Set();
  const groups = new Set();
  for (const path of paths) {
    strokes.add((path as any).stroke);
    groups.add((path as any).groupId);
  }
  const layerMode = groups.size > 1 ? "group" : "stroke";
  const groupLayers = Array.from(groups).sort();
  const strokeLayers = Array.from(strokes).sort();

  profile = profile || defaultPlanOptions;
  profile.selectedStrokeLayers = new Set(strokeLayers) as Set<string>;
  profile.selectedGroupLayers = new Set(groupLayers) as Set<string>;
  profile.layerMode = layerMode;
  let plan = replan(paths, profile);
  return { plan, svg };
}

export function svgStringToPaths(svg: Uint8Array) {
  let div = document.createElement("div");
  let svgString = new TextDecoder().decode(svg);
  let el = null;
  try {
    div.innerHTML = svgString;
    el = div.children[0] as SVGElement;
    let children = el.querySelectorAll("rect:not([id]");
    for (let child of children) {
      child.parentNode.removeChild(child);
    }
  } catch (err) {
    throw "Not a valid svg" + err;
  }
  return {
    svg: el,
    paths: svgElementToPaths(el),
  };
}

export function svgElementToPaths(svg: SVGElement): Vec2[][] {
  // copied from nornagon/saxi/src/ui.tsx/readSvg
  return flattenSVG(svg).map((line: any) => {
    const a = line.points.map(([x, y]: [number, number]) => ({ x, y }));
    (a as any).stroke = line.stroke;
    (a as any).groupId = line.groupId;
    return a;
  });
}

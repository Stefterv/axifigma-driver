import { flattenSVG } from "flatten-svg";
import { replan } from "~/node_modules/saxi/src/massager";
import {
  PlanOptions,
  defaultPlanOptions,
} from "~/node_modules/saxi/src/planning";
import { Vec2 } from "~/node_modules/saxi/src/vec";

export function svgToPlan(svg: Uint8Array, profile: PlanOptions) {
  let paths = svgStringToPaths(svg);

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
  let pln = replan(paths, profile);
  return pln;
}

export function svgStringToPaths(svg: Uint8Array): Vec2[][] {
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

export function svgElementToPaths(svg: SVGElement): Vec2[][] {
  // copied from nornagon/saxi/src/ui.tsx/readSvg
  return flattenSVG(svg).map((line: any) => {
    const a = line.points.map(([x, y]: [number, number]) => ({ x, y }));
    (a as any).stroke = line.stroke;
    (a as any).groupId = line.groupId;
    return a;
  });
}

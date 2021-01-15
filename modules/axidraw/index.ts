import { Module } from "@nuxt/types";

const AxidrawModule: Module = function(moduleOptions) {
  this.addServerMiddleware({
    path: "/axidraw/",
    handler: "~/modules/axidraw/api/",
  });
};

export default AxidrawModule;

import bonjour from "bonjour";
const discovery = bonjour({});
discovery.publish({
  name: "AxiDraw",
  port: 9000,
  type: "axidraw",
});

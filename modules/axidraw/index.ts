import { Module } from "@nuxt/types";

const AxidrawModule: Module = function(moduleOptions) {
  this.addServerMiddleware({
    path: "/axidraw/",
    handler: "~/modules/axidraw/api/",
  });
};

export default AxidrawModule;

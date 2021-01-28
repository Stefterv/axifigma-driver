// Proxy websockets and requests to the selected device

import { ModuleThis } from "@nuxt/types/config/module";
import { AxidrawApi } from ".";
import saxi from "saxi";
import { Server } from "ws";
import express from "express";

import cookieParser from "cookie-parser";

let { wss, rest, connect } = saxi.server.standalone();

const proxy = express();

proxy.use(cookieParser());

// Add proxying
proxy.use((req, res, next) => {
  if (req.cookies.device) {
    req.device = JSON.parse(req.cookies.device);
  }
  console.log(req.device);

  if (req.device?.host) {
    next();
  } else {
    next();
  }
});

proxy.get("/", (req, res, next) => {
  res.json("Hello!");
});

proxy.use(rest);

export default function(app: AxidrawApi) {
  app.on("init", (nuxt: ModuleThis) => {
    nuxt.addServerMiddleware({
      path: "/saxi/",
      handler: proxy,
    });
    nuxt.nuxt.hook("listen", (server: Server) => {
      connect();
      server.on("upgrade", (request, socket, head) => {
        if (request.url !== "/saxi/") return;
        wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
          console.log("Connecting ws");
          wss.emit("connection", ws);
        });
      });
    });
  });
}

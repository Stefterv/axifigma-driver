// Proxy websockets and requests to the selected device

import { ModuleThis } from "@nuxt/types/config/module";
import { AxidrawApi } from ".";
import saxi from "saxi";
import { Server } from "ws";

let { wss, rest, connect } = saxi.server.standalone();

// Add proxying

rest.get("/", (req, res, next) => {
  res.json("Hello!");
});

export default function(app: AxidrawApi) {
  app.on("init", (nuxt: ModuleThis) => {
    nuxt.addServerMiddleware({
      path: "/saxi/",
      handler: rest,
    });
    nuxt.nuxt.hook("listen", (server: Server) => {
      connect();
      server.on("upgrade", (request, socket, head) => {
        if (request.url !== "/saxi/") return;
        wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
          wss.emit("connection", ws);
        });
      });
    });
  });
}

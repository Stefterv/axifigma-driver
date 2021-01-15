import express from "express";
import Discovery from "./Discovery";
import WebSocket, { Server } from "ws";
import { AxiState } from "./State";
import { EventEmitter } from "events";
import Clients from "./Clients";
import { Module } from "@nuxt/types";
import { AppEvents } from "./Command";
import Devices from "./Devices";

export class AxidrawApi extends EventEmitter implements AppEvents {
  rest = express();
  wss = new Server({ noServer: true });
  state = new AxiState();
}
const app = new AxidrawApi();
Clients(app);
Discovery(app);
Devices(app);

let nuxtModule: Module = function() {
  this.addServerMiddleware({
    path: "/axidraw/",
    handler: app.rest,
  });
  this.nuxt.hook("listen", (server: Server) => {
    server.on("upgrade", (request, socket, head) => {
      if (request.url !== "/axidraw/") return;
      app.wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
        app.wss.emit("connection", ws);
      });
    });
  });
};

export default nuxtModule;

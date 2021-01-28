import saxi from "saxi";

import express from "express";
import Discovery from "./Discovery";
import WebSocket, { Server } from "ws";
import { AxiState } from "./State";
import { EventEmitter } from "events";
import Clients from "./Clients";
import { Module } from "@nuxt/types";
import { AppEvents, Command } from "./Command";
import Devices from "./Devices";

export class AxidrawApi extends EventEmitter implements AppEvents {
  rest = express();
  wss = new Server({ noServer: true });
  state = new AxiState();

  refreshDevices() {
    app.state.clients.map((client) =>
      client.send(Command.Devices, app.state.devices)
    );
  }
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
    app.emit("listen", server);
    server.on("upgrade", (request, socket, head) => {
      if (request.url !== "/axidraw/") return;
      app.wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
        app.wss.emit("connection", ws);
      });
    });
  });

  let { wss, rest, connect } = saxi.server.standalone();
  rest.get("/", (req, res, next) => {
    res.json("Hello!");
  });
  this.addServerMiddleware({
    path: "/saxi/",
    handler: rest,
  });
  this.nuxt.hook("listen", (server: Server) => {
    connect();
    server.on("upgrade", (request, socket, head) => {
      if (request.url !== "/saxi/") return;
      wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
        wss.emit("connection", ws);
      });
    });
  });
};

export default nuxtModule;

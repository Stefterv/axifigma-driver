import { Module } from "@nuxt/types";
import express from "express";
import { Server } from "ws";

import Discovery from "./Discovery";
import { AxiState } from "./State";
import { EventEmitter } from "events";
import Clients from "./Clients";
import { AppEvents, Command } from "./Command";
import Devices from "./Devices";
import Saxi from "./Proxy";

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
Saxi(app);

let nuxtModule: Module = function() {
  this.addServerMiddleware({
    path: "/axidraw/",
    handler: app.rest,
  });
  app.emit("init", this);
  this.nuxt.hook("listen", (server: Server) => {
    app.emit("listen", server);
  });
};

export default nuxtModule;

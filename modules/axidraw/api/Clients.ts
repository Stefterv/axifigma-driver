import { AxidrawApi } from ".";
import { Device } from "./Devices";
import WebSocket from "ws";
import { ClientCommands, Command } from "./Command";

export class Client implements ClientCommands {
  device?: Device;
  socket: WebSocket;
  constructor(socket: WebSocket) {
    this.socket = socket;
  }
  send(cmd: Command, data: any) {
    this.socket.send(
      JSON.stringify({
        cmd: Command[cmd],
        data,
      })
    );
  }
}

export default function(app: AxidrawApi) {
  app.wss.on("connection", (ws) => {
    let client = new Client(ws);
    app.state.clients.push(client);
    app.emit("client", client);

    ws.on("close", () => {
      let index = app.state.clients.indexOf(client);
      app.state.clients.splice(index, 1);
    });
  });

  app.rest.get("/clients/", (req, res) => {
    res.json(app.state.clients);
  });
}

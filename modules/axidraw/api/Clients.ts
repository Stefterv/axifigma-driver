import { AxidrawApi } from ".";
import { Device } from "./Device";
import WebSocket, { Server } from "ws";
import { ClientCommands, Command } from "./Command";

export class Client implements ClientCommands {
  device?: Device;
  socket: WebSocket;
  constructor(socket: WebSocket) {
    this.socket = socket;
  }
  send(cmd: Command, data: any) {
    if (this.socket.readyState != WebSocket.OPEN) return;
    try {
      this.socket.send(
        JSON.stringify({
          cmd: Command[cmd],
          data,
        })
      );
    } catch (err) {
      console.warn("Error sending to socket: ", err);
    }
  }
}

export default function(app: AxidrawApi) {
  app.on("listen", (server: Server) => {
    server.on("upgrade", (request, socket, head) => {
      if (request.url !== "/axidraw/") return;
      app.wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
        app.wss.emit("connection", ws);
      });
    });
  });
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

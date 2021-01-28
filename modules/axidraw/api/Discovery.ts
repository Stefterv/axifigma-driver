import os from "os";
import WebSocket from "ws";
import axios from "axios";
import mdns, { tcp, Service } from "mdns";

import { AxidrawApi } from ".";
import { Command } from "./Command";

const type = tcp("axidraw");

const ad = mdns.createAdvertisement(type, 9000);

const hostname = os.hostname();

const services = new Array<Service>();
const discovery = mdns.createBrowser(type);
discovery.on("serviceUp", (service) => {
  services.push(service);
});
discovery.on("serviceDown", (service) => {
  let index = services.indexOf(service);
  services.splice(index, 1);
});

interface CommandObject<T> {
  [command: string]: (this: T, data: any) => void;
}

export default function(app: AxidrawApi) {
  app.rest.get("/discovery/", (req, res, next) => res.json(services));

  app.on("listen", async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    ad.start();
    discovery.start();
  });

  discovery.on("serviceUp", async (service) => {
    if (service.name == hostname) return;
    console.info("Driver found!", service.host);
    try {
      let handler: CommandObject<AxidrawApi> = {
        Devices(devices) {
          devices = devices.filter((device) => !device.host);
          let changed = false;

          let unknown = app.state.devices.filter(
            (device) => device.host == service.host
          );
          for (let device of devices) {
            let exists = unknown.find((exist) => exist.path == device.path);
            if (!exists) {
              device.host = service.host;
              device.origin = service.name;
              this.state.devices.push(device);

              changed = true;
            } else {
              unknown.splice(unknown.indexOf(exists), 1);
            }
          }
          for (let removed of unknown) {
            changed = true;
            this.state.devices.splice(this.state.devices.indexOf(removed), 1);
          }
          if (changed) this.refreshDevices();
        },
      };

      function receive(event: MessageEvent<any>) {
        let json = JSON.parse(event.data);
        if (!json.cmd) return;
        let command: Command = json.cmd;
        if (!handler[command]) {
          return;
        }
        handler[command].apply(app, [json.data]);
      }
      const url = `${service.host}:${service.port}/axidraw/`;
      let res = null;
      do {
        console.info(`Trying ${service.host}`);
        res = await axios.get(`http://${url}`).catch((err) => err);
        if (res.status === 200) break;
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } while (true);
      console.info(`Connecting to ${service.host}`);

      let ws = new WebSocket(`ws://${url}`);
      ws.addEventListener("message", receive);
      ws.addEventListener("error", (err) => {
        console.log("Goodbye!", err);
      });
      ws.addEventListener("close", () => {
        handler.Devices.apply(app, [[]]);
      });
    } catch (err) {
      console.warn("Driver connection error!", service.host, err);
    }
  });
}

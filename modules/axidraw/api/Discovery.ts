import { AxidrawApi } from ".";
import mdns, { tcp, Service } from "mdns";
import os from "os";
import axios from "axios";
import { Device } from "./Devices";

const type = tcp("axidraw");

const ad = mdns.createAdvertisement(type, 9000);
ad.start();

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

discovery.start();

export default function(app: AxidrawApi) {
  app.rest.get("/discovery/", (req, res, next) => res.json(services));
  app.rest.get("/discovery/devices/", (req, res, next) =>
    res.json(app.state.devices.filter((device) => !device.host))
  );

  discovery.on("serviceUp", async (service) => {
    if (service.name == hostname) return;
    try {
      let resp = await axios.get<typeof app.state.devices>(
        `http://${service.host}:${service.port}/axidraw/discovery/devices/`
      );
      let devices = resp.data;
      for (let device of devices) {
        device.host = service.host;
        app.state.devices.push(device);
      }
    } catch (err) {}
  });
  discovery.on("serviceDown", (service) => {
    let devices = app.state.devices;
    for (let device of [...devices]) {
      if (device.host !== service.host) continue;

      devices.splice(devices.indexOf(device), 1);
    }
  });
}

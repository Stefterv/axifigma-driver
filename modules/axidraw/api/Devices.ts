import SerialPort from "serialport";
import { EventEmitter } from "events";

// List and connect to available devices

import { AxidrawApi } from ".";
import { Command } from "./Command";
import { Device } from "./Device";

export interface DevicesData extends Array<Device> {}

export default function(app: AxidrawApi) {
  const devices = new DeviceCache();
  app.rest.get("/devices/", (req, res) => res.json(app.state.devices));

  app.on("client", (client) => {
    client.send(Command.Devices, app.state.devices);
  });

  setInterval(() => devices.refreshList(), 5000);

  let simulator = new Device();
  simulator.path = "/dev/tty/simulator";
  simulator.name = "Simulator";
  app.state.devices.push(simulator);

  devices.on("found", (device) => {
    console.info("Device found: ", device.path);
    app.state.devices.push(device);
    app.state.clients.map((client) =>
      client.send(Command.Devices, app.state.devices)
    );
    app.emit("device");
  });
  devices.on("lost", (device) => {
    app.state.devices.splice(app.state.devices.indexOf(device), 1);
    app.state.clients.map((client) =>
      client.send(Command.Devices, app.state.devices)
    );
    app.emit("device");
  });
}

interface DeviceCacheEvents {
  on(event: "found", listener: (device: Device) => void): this;
  on(event: "lost", listener: (device: Device) => void): this;
}

class DeviceCache extends EventEmitter implements DeviceCacheEvents {
  deviceList = new Array<SerialPort.PortInfo>();

  async refreshList() {
    // console.info("Refreshing device list");
    let ports = await SerialPort.list();
    let devices = ports.filter(isEBB);

    let unknown = [...this.deviceList];
    for (let device of devices) {
      let exists = unknown.find((exist) => exist.path == device.path);
      if (!exists) {
        this.emit("found", device);
        this.deviceList.push(device);
      } else {
        unknown.splice(unknown.indexOf(exists), 1);
      }
    }
    for (let removed of unknown) {
      this.emit("lost", removed);
      this.deviceList.splice(this.deviceList.indexOf(removed), 1);
    }
  }
}

function isEBB(p: SerialPort.PortInfo): boolean {
  return (
    p.manufacturer === "SchmalzHaus" ||
    p.manufacturer === "SchmalzHaus LLC" ||
    (p.vendorId == "04D8" && p.productId == "FD92")
  );
}

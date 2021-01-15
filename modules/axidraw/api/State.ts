import { Client } from "./Clients";
import { Device } from "./Devices";

export class State {
  devices = new Array<Device>();
  clients = new Array<Client>();
}

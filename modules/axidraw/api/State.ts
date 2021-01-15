import { Client } from "./Clients";
import { Device } from "./Devices";

export class AxiState {
  devices = new Array<Device>();
  clients = new Array<Client>();
}

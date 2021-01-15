import { Client } from "./Clients";
import { Device } from "./Device";

export class AxiState {
  devices = new Array<Device>();
  clients = new Array<Client>();
}

import { Client } from "./Clients";
import { DevicesData } from "./Devices";

// Available commands that are available to websocket clients
export enum Command {
  Null,
  State,
  Devices,
  Select,
}

export interface NullData {}

export declare interface ClientCommands {
  send(cmd: Command.Null, data: NullData);
  send(cmd: Command.Devices, data: DevicesData);
}

export declare interface AppEvents {
  on(event: "client", listener: (client: Client) => void): this;
  on(event: "device", listener: () => void): this;
}

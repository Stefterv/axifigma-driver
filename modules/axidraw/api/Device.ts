import SerialPort from "serialport";

export class Device implements SerialPort.PortInfo {
  path!: string;
  manufacturer?: string | undefined;
  serialNumber?: string | undefined;
  pnpId?: string | undefined;
  locationId?: string | undefined;
  productId?: string | undefined;
  vendorId?: string | undefined;
  host?: string; // is the device external?
  name = "Axidraw";

  get unique() {
    return `${this.host || "local"}:${this.path}`;
  }
}

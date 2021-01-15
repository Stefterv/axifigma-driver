import express from "express";
import mdns, { tcp, Service } from "mdns";

const app = express();

const type = tcp("axidraw");

const ad = mdns.createAdvertisement(type, 9000);

const services = new Array<Service>();
const discovery = mdns.createBrowser(type);
discovery.start();
discovery.on("serviceUp", (service) => {
  debugger;
  services.push(service);
});

app.get("/", async (req, res, next) => {
  res.json(services);
});

export default app;

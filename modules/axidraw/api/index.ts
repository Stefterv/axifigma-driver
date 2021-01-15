import express from "express";

import bonjour from "bonjour";

const discovery = bonjour({});

const app = express();

app.get("/", async (req, res, next) => {
  let services = await new Promise<bonjour.RemoteService>((resolve) =>
    discovery.find({ type: "axidraw" }, resolve)
  );
  res.json(services);
});

export default app;

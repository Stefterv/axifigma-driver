// Proxy websockets and requests to the selected device

import { ModuleThis } from "@nuxt/types/config/module";
import { AxidrawApi } from ".";
import saxi from "saxi";

import express from "express";
import cookieParser from "cookie-parser";
import httpProxy from "http-proxy";

import { Server } from "ws";

let { wss, rest, connect } = saxi.server.standalone();

const _proxy = httpProxy.createProxyServer({
  ws: true,
});
const proxy = express();
proxy.use((req, res, next) => {
  console.log("Request to: ", req.path);
  next();
});

proxy.use(cookieParser());

// Add proxying
proxy.use((req, res, next) => {
  if (req.cookies.state) {
    req.state = JSON.parse(req.cookies.state);
  }

  let host = req.state?.device?.host;
  if (host) {
    console.log(`Web: ${host}`);
    try {
      delete req.header.cookie;
      _proxy.web(req, res, {
        target: `http://${host}`,
      });
    } catch (err) {
      console.error("Proxy error: ", err);
    }
  } else {
    next();
  }
});

proxy.get("/", (req, res, next) => {
  res.json("Hello!");
});

proxy.use(rest);

let parser = cookieParser();
export default function(app: AxidrawApi) {
  app.on("init", (nuxt: ModuleThis) => {
    nuxt.addServerMiddleware({
      path: "/saxi/",
      handler: proxy,
    });
    nuxt.nuxt.hook("listen", (server: Server) => {
      connect();
      server.on("upgrade", (req, res, head) => {
        if (req.url !== "/saxi/") return;

        parser(req, res, () => {});
        if (req.cookies.state) {
          req.state = JSON.parse(req.cookies.state);
        }

        let host = req.state?.device?.host;
        if (host) {
          console.log(`Ws: ${host}`);
          try {
            _proxy.ws(req, res, head, {
              target: `ws://${host}${req.url}`,
            });
          } catch (err) {
            console.error("WS Socket err: ", err);
          }
        } else {
          wss.handleUpgrade(req, res, head, (ws: WebSocket) => {
            wss.emit("connection", ws);
          });
        }
      });
    });
  });
}

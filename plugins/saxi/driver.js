import Vue from "vue";
import { registerProperty } from "~/plugins/figma/api";
import { svgToPlan } from "./helpers/svg";

export default async function(app, inject) {
  const saxi = new Saxi();
  saxi.app = app;
  inject("saxi", saxi);
  await saxi.checkConnection();
}

export class Saxi {
  state = Vue.observable({
    connected: false,
    paused: true,
    motionIdx: 0,
    plan: null,
  });
  app = null;
  constructor() {
    this.createSocket();
    this.listenFigma();
  }
  listenFigma() {
    if (process.server) return;
    registerProperty("svg", (svg) => {
      let plan = svgToPlan(svg);
      this.state.plan = plan;
    });
  }
  createSocket() {
    if (process.server) return;
    let state = this.state;

    this.socket = new WebSocket(`ws://${document.location.host}/saxi/`);
    this.socket.addEventListener("open", () => {
      state.connected = true;
    });
    this.socket.addEventListener("close", (close) => {
      state.connected = false;
    });

    let options = { pause: "paused", progress: "motionIdx", plan: "plan" };
    this.socket.addEventListener("message", (e) => {
      if (typeof e.data !== "string") return;

      const msg = JSON.parse(e.data);
      for (let option in options) {
        if (msg.c != option) continue;
        let prop = options[option];
        this.state[prop] = msg.p[prop];
      }
    });
  }
  async checkConnection() {
    let { $axios } = this.app;
    try {
      let res = await $axios.get("/saxi/");
      if (res.status == 200) {
        this.state.connected = true;
      } else {
        throw "No Connection";
      }
    } catch (err) {
      this.state.connected = false;
    }
  }
}

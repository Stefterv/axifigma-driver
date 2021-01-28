<template>
  <Provide :axistate="state">
    <div :key="deviceUnique">
      {{ item }}
      <slot />
    </div>
  </Provide>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "nuxt-property-decorator";

import { AxiState } from "../api/State";
import { Command } from "../api/Command";
import { Device } from "../api/Device";

export interface CommandObject<T> {
  [command: string]: (this: T, data: any) => void;
}

export class AxiClientState extends AxiState {
  device = new Device();
}

@Component
export default class AxiClient extends Vue {
  state = new AxiClientState();

  ws!: WebSocket;

  handler: CommandObject<AxiClient> = {
    Devices(devices) {
      devices.map((device) => Object.setPrototypeOf(device, Device.prototype));
      this.state.devices = devices;
    },
  };

  recieve(event: MessageEvent<any>) {
    console.log("Message from server ", event.data);
    let json = JSON.parse(event.data);
    if (!json.cmd) return;
    let command: Command = json.cmd;
    if (!this.handler[command]) {
      console.error("Unrecognised command: ", command, event.data);
      return;
    }
    this.handler[command].apply(this, [json.data]);
  }

  async reconnect() {
    this.ws = new WebSocket(
      `${this.protocol}:${document.location.host}/axidraw/`
    );
    this.ws.addEventListener("message", this.recieve);
    this.ws.addEventListener("close", this.reconnect.bind(this));
  }

  mounted() {
    this.reconnect();
  }
  get protocol() {
    return document.location.protocol.startsWith("https") ? "wss" : "ws";
  }

  get deviceUnique() {
    return this.state?.device?.unique || "none";
  }

  @Watch("state", {
    deep: true,
  })
  status(state) {
    this.$cookies.set("state", state);
  }
}
</script>

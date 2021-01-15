<template>
  <Provide :axistate="state">
    <div>
      <slot />
    </div>
  </Provide>
</template>

<script lang="ts">
import { AxiState } from "../api/State";
import { Vue, Component } from "nuxt-property-decorator";
import { Command } from "../api/Command";

export interface CommandObject<T> {
  [command: string]: (this: T, data: any) => void;
}

@Component
export default class AxiClient extends Vue {
  state = new AxiState();

  ws!: WebSocket;

  handler: CommandObject<AxiClient> = {
    Devices(devices) {
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
}
</script>

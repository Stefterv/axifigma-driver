<template>
  <div>
    <slot v-bind:connected="connected" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      connected: false,
      socket: null,
      isDestroyed: false,
    };
  },
  async fetch() {
    await this.connect();
  },
  methods: {
    async connect() {
      let self = this;
      // check if http repsonse
      this.connected = false;
      async function* connection() {
        yield await self.http();
        if (self.isServer()) return;

        yield await self.createSocket();
        yield await self.socketConnected();
        yield await self.socketDisconnected();
      }
      for await (let step of connection()) {
        this.connected = step;
        if (!step) return;
      }
      this.connected = true;
    },
    isServer() {
      return process.server;
    },
    async http() {
      if (this.connected) return true;
      try {
        let { status, data } = await this.$axios.get("/saxi/");
        return status == 200;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    async createSocket() {
      try {
        this.socket = new WebSocket(`ws://${document.location.host}/saxi/`);
        return true;
      } catch (err) {
        return false;
      }
    },
    socketConnected() {
      let self = this;
      return new Promise((resolve) => {
        this.socket.addEventListener("open", () => {
          resolve(true);
        });
      });
    },
    socketDisconnected() {
      let self = this;
      return new Promise((resolve) => {
        this.socket.addEventListener("close", () => {
          resolve(false);
        });
      });
    },
  },
  async mounted() {
    while (!this.isDestroyed) {
      await this.connect();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.warn("Retrying connection");
    }
  },
  destroyed() {
    this.isDestroyed = true;
  },
};
</script>


<template>
  <div>
    <slot v-bind="state" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      state: {
        connected: false,
        paused: true,
        motionIdx: 0,
        plan: null,
      },
      socket: null,
    };
  },
  fetch() {
    this.checkConnection();
  },
  methods: {
    async checkConnection() {
      try {
        let { status, data } = await this.connect();
        if (status == 200) {
          this.state.connected = true;
        } else {
          throw "No Connection";
        }
      } catch (err) {
        this.state.connected = false;
      }
    },
    createSocket() {
      let self = this;

      this.socket = this.websocket();
      this.socket.addEventListener("open", () => {
        self.state.connected = true;
      });
      this.socket.addEventListener("close", (close) => {
        self.state.connected = false;
        self.socket = null;
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
    },
    connect() {
      return this.$axios.get("/saxi/");
    },
    websocket() {
      return new WebSocket(`ws://${document.location.host}/saxi/`);
    },
  },
  mounted() {
    this.createSocket();
  },
  watch: {
    async "state.connected"(connected) {
      if (connected && !this.socket) this.createSocket();
      if (connected) {
        this.$cookies.set("seen", true);
        return;
      }

      while (this.state.connected) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await this.checkConnection();
      }
    },
  },
};
</script>

<style></style>

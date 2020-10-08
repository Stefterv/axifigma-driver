<template>
  <div>
    <Provide :state="state">
      <slot v-bind="state" />
    </Provide>
  </div>
</template>

<script>
// TODO: Retry websocket connection instead of http one
// TODO: Remove driver state from alive test

export default {
  data() {
    return {
      state: {
        connected: false,
        paused: true,
        motionIdx: -1,
        plan: null,
        path: null,
      },
      socket: null,
    };
  },
  async fetch() {
    await this.checkConnection();
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
      // command : `data ->` property
      let options = {
        pause: "paused",
        progress: "motionIdx",
        plan: "plan",
        dev: "path",
        finished() {
          self.state.motionIdx = -1;
          self.state.paused = true;
        },
        cancelled() {
          self.state.motionIdx = -1;
        },
      };
      this.socket.addEventListener("message", (e) => {
        if (typeof e.data !== "string") return;

        const msg = JSON.parse(e.data);
        for (let option in options) {
          if (msg.c != option) continue;
          let prop = options[option];
          if (prop instanceof Function) {
            options[option]();
          } else {
            this.state[prop] = msg.p[prop];
          }
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
      if (connected) return;

      while (this.state.connected) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await this.checkConnection();
      }
    },
  },
  components: {
    Provide: {
      provide() {
        return this.$attrs;
      },
      render() {
        return this.$scopedSlots.default({});
      },
    },
  },
};
</script>

<style></style>

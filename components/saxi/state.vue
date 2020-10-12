<template>
  <Provide :state="state">
    <div>
      <slot />
    </div>
  </Provide>
</template>

<script>
export default {
  data() {
    return {
      state: {
        connected: false,
        paused: true,
        motionIdx: -1,
        plan: null,
        path: null,
        possiblePlan: null,
        options: null,
      },
      socket: null,
    };
  },
  fetchOnServer: false,
  async fetch() {
    let self = this;
    this.socket = new WebSocket(`ws://${document.location.host}/saxi/`);
    let options = {
      pause: "paused",
      progress: "motionIdx",
      plan({ p }) {
        let _plan = Plan.deserialize(p.plan);
        self.state.plan = _plan;
      },
      dev: "path",
      finished() {
        self.state.motionIdx = -1;
        self.state.paused = true;
      },
      cancelled() {
        self.state.motionIdx = -1;
        self.state.plan = null;
      },
    };
    this.socket.addEventListener("message", (e) => {
      if (typeof e.data !== "string") return;

      const msg = JSON.parse(e.data);
      for (let option in options) {
        if (msg.c != option) continue;
        let prop = options[option];
        if (prop instanceof Function) {
          options[option](msg);
        } else {
          this.state[prop] = msg.p[prop];
        }
      }
    });
    await new Promise((resolve) =>
      this.socket.addEventListener("open", resolve)
    );
    this.state.connected = true;
  },
  methods: {
    send(msg) {
      if (!this.state.connected) return;
      this.socket.send(JSON.stringify(msg));
    },
  },
  provide() {
    return {
      saxi: {
        send: this.send,
      },
    };
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

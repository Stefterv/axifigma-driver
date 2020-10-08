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
      plan: "plan",
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
          options[option]();
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

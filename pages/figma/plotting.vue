<template>
  <div class="plotting">
    <template v-if="state.plan">
      <p>Time to plot</p>
      <p>{{ (state.plan.duration() * 1000) | humanize }}</p>
      <strong>Time remaining </strong>
      <strong>{{ ((duration - motion.offset) * 1000) | humanize }}</strong>
      <div class="progress">
        <progress
          :max="state.plan.motions.length"
          :value="state.motionIdx"
        ></progress>
      </div>
    </template>
    <button
      class="button button--primary"
      @click="state.paused ? resume : paused"
    >
      {{ state.paused ? "resume" : "pause" }}
    </button>
    <button class="button button--primary-destructive" @click="cancel">
      cancel
    </button>
  </div>
</template>

<script>
export default {
  inject: ["state"],

  data() {
    return {
      motion: {
        lastChange: null,
        offset: 0,
        interval: null,
      },
    };
  },
  methods: {
    resume() {
      this.$axios.post("/saxi/resume");
    },
    pause() {
      this.$axios.post("/saxi/pause");
    },
    cancel() {
      this.$axios.post("/saxi/cancel");
    },
    updateTimer() {
      this.motion.offset =
        (new Date().getTime() - this.motion.lastChange.getTime()) / 1000;
    },
  },
  computed: {
    duration() {
      let id = this.state.motionIdx;
      let motions = this.state.plan.motions;
      motions = motions.filter((m, idx) => idx >= id);

      return motions.map((m) => m.duration()).reduce((a, b) => a + b, 0);
    },
  },
  watch: {
    "state.motionIdx": {
      immediate: true,
      handler() {
        this.motion.lastChange = new Date();
      },
    },
  },
  mounted() {
    this.motion.interval = setInterval(this.updateTimer, 1000);
  },
  destroyed() {
    clearInterval(this.motion.interval);
  },
};
</script>

<style lang="scss" scoped>
.plotting {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: var(--margin);
  gap: var(--margin);
  text-align: center;
}
.progress {
  grid-column: 1 / span 2;
  padding: 0 var(--margin);
}
.button {
  justify-content: center;
}
progress {
  width: 100%;
}
</style>

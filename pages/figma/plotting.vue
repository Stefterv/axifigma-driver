<template>
  <div v-if="state.plan">
    <div>
      <p>Time to plot: {{ (state.plan.duration() * 1000) | humanize }}</p>
      <p>Time remaining: {{ (duration * 1000) | humanize }}</p>
      <progress
        :max="state.plan.motions.length"
        :value="state.motionIdx"
      ></progress>
    </div>
    <button @click="resume" v-if="state.paused">resume</button>
    <button @click="pause" v-else>pause</button>
    <button @click="cancel">cancel</button>
  </div>
</template>

<script>
export default {
  inject: ["state"],
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
  },
  computed: {
    duration() {
      let id = this.state.motionIdx;
      let motions = this.state.plan.motions;
      motions = motions.filter((m, idx) => idx >= id);

      return motions.map((m) => m.duration()).reduce((a, b) => a + b, 0);
    },
  },
};
</script>

<style></style>

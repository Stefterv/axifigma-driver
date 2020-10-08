<template>
  <div>
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
};
</script>

<style>
</style>
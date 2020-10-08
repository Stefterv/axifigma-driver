<template>
  <div>
    <nuxt-child></nuxt-child>
    <details>
      <pre>{{ { ...state, plotting, running } }}</pre>
    </details>
  </div>
</template>

<script>
export default {
  layout: "connected",
  inject: ["state"],
  computed: {
    plotting() {
      return this.state.plan != null || this.state.motionIdx >= 0;
    },
    running() {
      return this.state.motionIdx >= 0 && !this.state.paused;
    },
  },
  watch: {
    plotting: {
      handler(plotting) {
        if (plotting) this.$router.push("/figma/plotting");
        else if (this.$route.path == "/figma/plotting")
          this.$router.push("/figma/prepare");
      },
      immediate: true,
    },
  },
};
</script>

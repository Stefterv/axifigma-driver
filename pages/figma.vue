<template>
  <div class="figma">
    <div class="status">
      <div class="description" :class="{ [status]: true }">
        {{ status }}
      </div>
      <button
        class="button button--primary-destructive button--destructive"
        @click="disengage"
      >
        Disengage Motors
      </button>
    </div>
    <hr />
    <nuxt-child></nuxt-child>
    <template v-if="false">
      <hr />
      <details>
        <pre>{{ { ...state, plotting, running } }}</pre>
      </details>
    </template>
  </div>
</template>

<script>
export default {
  layout: "connected",
  inject: ["state"],
  methods: {
    disengage() {},
  },
  computed: {
    plotting() {
      return this.state.plan != null || this.state.motionIdx >= 0;
    },
    running() {
      return this.state.motionIdx >= 0 && !this.state.paused;
    },
    status() {
      if (!this.state.possiblePlan) return "waiting for input";
      if (this.plotting) return "plotting";
      return "idle";
    },
  },
  watch: {
    plotting: {
      handler(plotting) {
        if (plotting) this.$router.push("/figma/plotting");
        else if (
          ["/figma/plotting", "/figma/", "/figma"].includes(this.$route.path)
        )
          this.$router.push("/figma/prepare");
      },
      immediate: true,
    },
  },
  mounted() {
    window.parent.postMessage({ pluginMessage: { type: "triggerSeen" } }, "*");
  },
};
</script>

<style lang="scss" scoped>
.status {
  display: flex;
  width: 100%;
  padding: var(--margin);
  justify-content: space-between;
  align-items: center;
  .description {
    margin: var(--margin);
  }
  .idle {
    opacity: 0.2;
  }
}
</style>

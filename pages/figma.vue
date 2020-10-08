<template>
  <div>
    plotting:{{ plotting }} running:{{ running }}

    <details>
      <pre>{{ state }}</pre>
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
};
</script>

<template>
  <div>
    {{ plotting }}

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
  },
};
</script>

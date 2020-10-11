<template>
  <div class="main">
    <div class="state">
      {{ state.path != null ? "Plotter connnected" : "Plotter not connected" }}
      <button
        class="button button--primary-destructive button--destructive"
        @click="disengage"
      >
        disengage motors
      </button>
    </div>
    <hr />
  </div>
</template>

<script>
export default {
  inject: ["state"],
  layout: "connected",
};
</script>

<style lang="scss" scoped>
.state {
  display: grid;
  justify-content: space-between;
  text-align: center;
  align-items: center;
  grid-template-columns: 1fr 1fr;
  width: 100vw;
  height: 100vh;
  padding: var(--margin);
}
.block {
  justify-content: center;
}
</style>

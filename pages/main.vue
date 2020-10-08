<template>
  <div>
    {{ state.path != null ? "Plotter connnected" : "Plotter not connected" }}
  </div>
</template>

<script>
export default {
  inject: ["state"],
  layout: "connected",
};
</script>

<style lang="scss" scoped>
div {
  &:hover {
    color: red;
  }
}
</style>

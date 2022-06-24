<template>
  <div class="main">
    <div class="state">
      {{ state.path != null ? "Plotter connnected" : "Plotter not connected" }}
      <Limp> </Limp>
    </div>
  </div>
</template>

<script>
import Limp from "~/components/saxi/limp";

export default {
  inject: ["state"],
  layout: "connected",
  components: {
    Limp,
  },
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
  padding: var(--margin);
}
.block {
  justify-content: center;
}
</style>

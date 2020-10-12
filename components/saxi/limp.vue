<template>
  <button
    class="button button--primary-destructive button--destructive"
    @click="disengage"
  >
    Disengage Motors
  </button>
</template>

<script>
export default {
  inject: ["saxi"],
  methods: {
    disengage() {
      this.saxi.send({ c: "limp" });
    },
  },
};
</script>

<style></style>

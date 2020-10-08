<template>
  <div>
    Driver offline
    <!-- TODO: add check if downloaded before -->
    <button @click="download">Download!</button>
  </div>
</template>

<script>
import { homepage } from "~/package.json";

export default {
  methods: {
    download() {
      window.open(`${homepage}/`);
    },
    launch() {
      window.open(`${homepage}/launch`);
    },
  },
};
</script>

<style></style>

<template>
  <div>
    <h2>
      Driver offline
    </h2>
    <button @click="download" v-if="!seen">Download!</button>
    <button @click="download" v-else>Launch!</button>
  </div>
</template>

<script>
import { homepage } from "~/package.json";
import * as Figma from "~/plugins/figma/api";

export default {
  data() {
    return {
      seen: false,
    };
  },
  methods: {
    download() {
      window.open(`${homepage}/`);
    },
    launch() {
      window.open(`${homepage}/launch`);
    },
    setSeen(seen) {
      debugger;
      this.seen = seen;
    },
  },
  mounted() {
    console.log("Requesting download status");
    window.parent.postMessage({ pluginMessage: { type: "sendSeen" } }, "*");
    Figma.registerProperty("seen", this.setSeen);
  },
};
</script>

<style></style>

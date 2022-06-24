<template>
  <div class="offline">
    <template v-if="!seen">
      <div class="status">
        AxiDraw driver not installed
      </div>
      <button class="button button--primary" @click="download">
        Download!
      </button>
    </template>
    <template v-else>
      <div class="status">
        AxiDraw driver not running
      </div>
      <button class="button button--primary" @click="launch">
        Launch!
      </button>
    </template>
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

<style lang="scss" scoped>
.offline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: var(--margin);
  box-sizing: border-box;
  .status {
    padding: 0 var(--margin);
  }
}
</style>

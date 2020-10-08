<template>
  <Alive v-slot="state">
    <template v-if="state.connected">Connected!</template>
    <Offline v-else> </Offline>
  </Alive>
</template>

<script>
let loaded = false;
import { nuxtPort } from "~/nuxt.config";
import Alive from "./saxi/alive";
import Offline from "~/components/saxi/offline";

export default {
  data() {
    return {
      nuxtPort,
    };
  },
  components: {
    Alive,
    Offline,
  },
};
</script>

<style>
iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>

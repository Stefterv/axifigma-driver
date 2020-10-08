<template>
  <Alive v-slot="state">
    <iframe
      v-if="state.connected"
      :src="`http://127.0.0.1:${nuxtPort}/figma`"
    ></iframe>
    <Offline v-else> </Offline>
  </Alive>
</template>

<script>
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

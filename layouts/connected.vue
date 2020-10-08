<template>
  <div>
    <Alive v-slot="state">
      <nuxt-child v-if="state.connected"></nuxt-child>
      <Offline v-else> </Offline>
    </Alive>
  </div>
</template>

<script>
import Alive from "~/components/saxi/alive";
import Offline from "~/components/saxi/offline";

export default {
  components: {
    Alive,
    Offline,
  },
};
</script>

<style>
</style>
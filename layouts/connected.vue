<template>
  <div>
    <Alive v-slot="{ connected }">
      connection: {{ connected }}
      <template v-if="connected">
        <State>
          <nuxt-child></nuxt-child>
        </State>
      </template>
      <Offline v-else> </Offline>
    </Alive>
  </div>
</template>

<script>
import Alive from "~/components/saxi/alive";
import State from "~/components/saxi/state";
import Offline from "~/components/saxi/offline";

export default {
  components: {
    Alive,
    Offline,
    State,
  },
};
</script>

<style>
</style>
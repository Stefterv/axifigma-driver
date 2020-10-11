<template>
  <div class="layout">
    <Alive v-slot="{ connected }">
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
  data() {
    return {
      ro: null,
    };
  },
  methods: {
    updateSize() {
      console.log("Resize observed");
      let { clientHeight, clientWidth } = document.querySelector("body");
      let size = [clientWidth, clientHeight];
      window.parent.postMessage(
        { pluginMessage: { type: "resize", size } },
        "*"
      );
    },
  },
  mounted() {
    this.ro = new ResizeObserver(this.updateSize).observe(this.$el);
  },
  destroyed() {
    delete this.ro;
  },
};
</script>

<style>
body {
  margin: 0;
}
</style>

<style lang="scss" scoped>
.layout {
  display: flex;
}
</style>

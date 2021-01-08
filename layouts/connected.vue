<template>
  <div class="layout">
    <div class="errors">
      <div
        class="error"
        v-for="(error, index) in errors"
        :key="index"
        @click="errors.splice(index, 1)"
      >
        <div class="icon icon--warning icon--white"></div>
        {{ error }}
      </div>
    </div>
    <Alive v-slot="{ connected }">
      <template v-if="connected">
        <State>
          <Settings>
            <nuxt-child></nuxt-child>
          </Settings>
        </State>
      </template>
      <Offline v-else> </Offline>
    </Alive>
  </div>
</template>

<script>
import Alive from "~/components/saxi/alive";
import State from "~/components/saxi/state";
import Settings from "~/components/saxi/settings";
import Offline from "~/components/saxi/offline";

export default {
  components: {
    Alive,
    Offline,
    State,
    Settings,
  },
  data() {
    return {
      ro: null,
      errors: [],
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
    window.parent.postMessage({ pluginMessage: { type: "triggerSeen" } }, "*");
  },
  destroyed() {
    delete this.ro;
  },
  errorCaptured(err, vm, info) {
    this.errors.push(err);
    return false;
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
.errors {
  position: fixed;
  top: 0;
  left: 0;

  z-index: 1;
  .error {
    color: white;
    padding: var(--margin);
    display: flex;
    gap: var(--margin);
    background: #f24822;
    animation: movein 0.2s;
  }
}
@keyframes movein {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}
</style>

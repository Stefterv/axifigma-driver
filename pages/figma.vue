<template>
  <div class="figma">
    <div class="status">
      <div class="description" :class="{ [status]: true }">
        {{ status }}
      </div>
      <Limp> </Limp>
    </div>
    <hr />
    <nuxt-child></nuxt-child>
    <template v-if="false">
      <hr />
      <details>
        <pre>{{ { ...state, plotting, running } }}</pre>
      </details>
    </template>
  </div>
</template>

<script>
import * as Figma from "~/plugins/figma/api";
import { svgToPlan } from "~/plugins/saxi/helpers/svg";
import Limp from "~/components/saxi/limp";

export default {
  layout: "connected",
  inject: ["state"],
  data() {
    return {
      lastSvg: null,
    };
  },
  computed: {
    plotting() {
      return this.state.plan != null || this.state.motionIdx >= 0;
    },
    running() {
      return this.state.motionIdx >= 0 && !this.state.paused;
    },
    status() {
      if (!this.state.possiblePlan) return "waiting for input";
      if (this.plotting) return "plotting";
      return "idle";
    },
  },
  methods: {
    disengage() {},
    svg(svg) {
      this.lastSvg = svg;
      let opt = this.state.options ? { ...this.state.options } : null;
      let plan = svgToPlan(svg, opt);
      this.state.possiblePlan = plan;
    },
    requestSVG() {
      window.parent.postMessage({ pluginMessage: { type: "sendSVG" } }, "*");
    },
  },
  watch: {
    plotting: {
      handler(plotting) {
        if (plotting) this.$router.push("/figma/plotting");
        else if (
          ["/figma/plotting", "/figma/", "/figma"].includes(this.$route.path)
        )
          this.$router.push("/figma/prepare");
      },
      immediate: true,
    },
    "state.options": {
      deep: true,
      handler() {
        console.log("Options changed");
        if (this.lastSvg == null) return;

        this.svg(this.lastSvg);
      },
    },
  },
  components: {
    Limp,
  },
  mounted() {
    Figma.registerProperty("pageChanged", this.requestSVG);
    Figma.registerProperty("svg", this.svg);
    this.requestSVG();
  },
};
</script>

<style lang="scss" scoped>
.status {
  display: flex;
  width: 100%;
  padding: var(--margin);
  justify-content: space-between;
  align-items: center;
  .description {
    margin: var(--margin);
  }
  .idle {
    opacity: 0.2;
  }
}
</style>

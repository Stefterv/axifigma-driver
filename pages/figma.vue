<template>
  <div class="figma">
    <Provide> </Provide>
    <div class="status">
      <div class="description" :class="{ [status]: true }">
        {{ status }}
      </div>
      <Limp> </Limp>
    </div>
    <hr />
    <nuxt-child></nuxt-child>
    <Preview> </Preview>
  </div>
</template>

<script>
import * as Figma from "~/plugins/figma/api";
import { svgToPlan } from "~/plugins/saxi/helpers/svg";
import Limp from "~/components/saxi/limp";
import Preview from "~/components/preview/";

export default {
  layout: "connected",
  inject: ["state", "options"],
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
    svg(svgData) {
      this.lastSvg = svgData;
      let opt = this.options ? { ...this.options } : null;
      let { plan, svg } = svgToPlan(svgData, opt);
      this.state.possiblePlan = plan;
      this.state.svg = svg;
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
    options: {
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
    Preview,
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

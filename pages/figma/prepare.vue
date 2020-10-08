<template>
  <div>
    <div>
      <nuxt-link to="settings">Settings</nuxt-link>
    </div>
    <p>
      Request current svg from figma, listen to document changes ({{ updates }})
    </p>

    <button @click="plot" :disabled="!state.possiblePlan">plot!</button>
  </div>
</template>

<script>
import * as Figma from "~/plugins/figma/api";
import { svgToPlan } from "~/plugins/saxi/helpers/svg";

export default {
  inject: ["state"],
  data() {
    return {
      updates: 0,
    };
  },
  methods: {
    pageUpdate() {
      this.updates++;
    },
    svg(svg) {
      let plan = svgToPlan(svg);
      this.state.possiblePlan = plan;
    },
    plot() {
      this.$axios.post("/saxi/plot", this.state.possiblePlan.serialize());
      this.state.plan = this.state.possiblePlan;
    },
  },
  mounted() {
    Figma.registerProperty("pageChanged", this.pageUpdate);
    Figma.registerProperty("svg", this.svg);
    window.parent.postMessage({ pluginMessage: { type: "sendSVG" } }, "*");
  },
};
</script>

<style></style>

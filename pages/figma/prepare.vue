<template>
  <div>
    <div>
      <nuxt-link to="settings">Settings</nuxt-link>
    </div>
    <div v-if="!state.possiblePlan">Waiting for input</div>
    <div v-else>
      Time to plot: {{ (state.possiblePlan.duration() * 1000) | humanize }}
    </div>
    <button @click="plot" :disabled="!state.possiblePlan">plot!</button>
  </div>
</template>

<script>
// TODO: continuesly based on settings, svg, and selection, in a different thread estimate the necessary time

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
    requestSVG() {
      window.parent.postMessage({ pluginMessage: { type: "sendSVG" } }, "*");
    },
  },
  mounted() {
    Figma.registerProperty("pageChanged", this.requestSVG);
    Figma.registerProperty("svg", this.svg);
    this.requestSVG();
  },
};
</script>

<style></style>

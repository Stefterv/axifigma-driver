<template>
  <div class="prepare">
    <div class="plot">
      <div>
        <div class="estimation">
          Est.
          <template v-if="state.possiblePlan">
            {{ (state.possiblePlan.duration() * 1000) | humanize }}
          </template>
          <template v-else>
            -
          </template>
        </div>
        <button
          @click="plot"
          class="button button--primary"
          :disabled="!state.possiblePlan"
        >
          Plot
        </button>
      </div>
    </div>
    <nuxt-link to="settings">
      <button class="button button--secondary">
        Settings
      </button>
    </nuxt-link>
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

<style scoped lang="scss">
.prepare {
  display: grid;
  margin: var(--margin);
  grid-template-columns: 1fr 1fr;
  align-items: flex-end;
  gap: var(--margin);
  .plot {
    text-align: center;
  }
  & > * {
    width: 100%;
    box-sizing: border-box;
  }
  .button {
    width: 100%;
    justify-content: center;
  }
  .estimation {
    margin: var(--margin);
    margin-top: 0;
  }
}
</style>

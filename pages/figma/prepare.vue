<template>
  <div class="prepare">
    <div class="plot">
      <div>
        <label>Plotting Time</label>
        <div class="estimation">
          <template v-if="state.possiblePlan">
            ~{{ (state.possiblePlan.duration() * 1000) | humanize }}
          </template>
          <template v-else>
            -
          </template>
        </div>
      </div>
      <div>
        <label>Canvas Size</label>
        <div class="canvas">
          {{ options.paperSize.size.x || "-" }}mm x
          {{ options.paperSize.size.y || "-" }}mm
        </div>
      </div>
      <div class="pen">
        <label>Pen</label>
        <div suffix="Up" suffix-link>
          <input
            type="number"
            class="input__field"
            v-model.number="options.penUpHeight"
            placeholder=""
            min="0"
            max="100"
            @focus="testPenHeight(true)"
            @change="testPenHeight(true)"
          />
        </div>
        <div suffix="Down" suffix-link>
          <input
            type="number"
            class="input__field"
            v-model.number="options.penDownHeight"
            placeholder=""
            min="0"
            max="100"
            @focus="testPenHeight(false)"
            @change="testPenHeight(false)"
          />
        </div>
      </div>
    </div>
    <div class="actions">
      <button
        @click="plot"
        class="button button--primary"
        :disabled="!state.possiblePlan"
      >
        Start Plotting
      </button>
      <nuxt-link
        to="/figma/prepare/settings"
        v-if="$route.path == '/figma/prepare'"
      >
        <button class="button button--secondary">
          Settings
        </button>
      </nuxt-link>
      <a v-else href="#" @click.prevent="$router.back()">
        <button class="button button--secondary">
          Back
        </button>
      </a>
    </div>
    <nuxt-child></nuxt-child>
  </div>
</template>

<script>
import { Device } from "~/node_modules/saxi/src/planning";
export default {
  inject: ["state", "options", "saxi"],
  methods: {
    plot() {
      this.$axios.post("/saxi/plot", this.state.possiblePlan.serialize());
      this.state.plan = this.state.possiblePlan;
    },
    testPenHeight(state) {
      const rate = 1000;
      const height = Device.Axidraw.penPctToPos(
        state ? this.options.penUpHeight : this.options.penDownHeight
      );
      this.saxi.send({ c: "setPenHeight", p: { height, rate } });
    },
  },
};
</script>

<style scoped lang="scss">
.plot {
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-auto-flow: column;
  margin: var(--margin) calc(var(--margin) * 2);
  gap: var(--margin);
  .pen {
    grid-row: 1 / span 2;
  }
}
.actions {
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
label {
  opacity: 0.5;
}
</style>

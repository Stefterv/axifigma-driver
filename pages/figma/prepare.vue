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
        <div
          class="canvas"
          :title="
            `Equivalent to ${current.x || '-'}px x ${current.y ||
              '-'}px Artboard Size\n(Click to insert)`
          "
          @click="insertCurrent"
        >
          {{ options.paperSize.size.x || "-" }}mm x
          {{ options.paperSize.size.y || "-" }}mm
        </div>
      </div>
      <div class="pen">
        <label>
          Pen
          <div
            class="icon icon--up-down"
            @click="testPenHeight(!penState)"
          ></div>
        </label>
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
      <nuxt-link to="/figma/prepare" v-else>
        <button class="button button--secondary">
          Close
        </button>
      </nuxt-link>
    </div>
    <template v-if="$route.path !== '/figma/prepare'">
      <hr />
      <nav>
        <nuxt-link to="/figma/prepare/settings">
          <li>
            Document
          </li>
        </nuxt-link>
        <nuxt-link to="/figma/prepare/advanced">
          <li>
            Timing
          </li>
        </nuxt-link>
        <nuxt-link to="/figma/prepare/optimization">
          <li>
            Optimization
          </li>
        </nuxt-link>
      </nav>
      <hr />
      <nuxt-child></nuxt-child>
    </template>
  </div>
</template>

<script>
import { Device } from "~/node_modules/saxi/src/planning";
import Preview from "~/components/preview/";
export default {
  inject: ["state", "options", "saxi", "paperPresets"],
  data() {
    return {
      penState: false,
    };
  },
  computed: {
    current() {
      return {
        x: Math.round((this.options.paperSize.size.x / 25.4) * 96),
        y: Math.round((this.options.paperSize.size.y / 25.4) * 96),
      };
    },
  },
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
      this.penState = state;
    },
    insertCurrent() {
      let size = this.current;
      window.parent.postMessage(
        {
          pluginMessage: {
            type: "insertCurrent",
            size,
            presetName: this.currentPaperPreset(),
          },
        },
        "*"
      );
    },
    currentPaperPreset() {
      // TODO Move to reusable place
      let props = ["size.x", "size.y"];
      let size = this.options.paperSize;
      for (let preset of this.paperPresets) {
        let diff = false;
        for (let prop of props) {
          if (getKey(prop, preset) === getKey(prop, size)) continue;
          diff = true;
          break;
        }
        if (diff) continue;
        return preset.name;
      }
    },
  },
  components: {
    Preview,
  },
};
function getKey(key, obj) {
  return key.split(".").reduce(function(a, b) {
    return a && a[b];
  }, obj);
}
</script>

<style scoped lang="scss">
.prepare {
  min-width: 100vw;
}
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
nav {
  display: flex;
  list-style: none;
  padding: var(--margin);
  gap: calc(var(--margin) * 2);
  font-weight: bold;
  a {
    opacity: 0.5;
  }
  .nuxt-link-exact-active {
    opacity: 1;
  }
}
label {
  opacity: 0.5;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.canvas {
  text-decoration: underline;
}
.pen-toggle {
  display: inline-block;
}
</style>

<template>
  <div class="settings">
    <section>
      <div class="estimation">
        Est.
        <template v-if="state.possiblePlan">
          {{ (state.possiblePlan.duration() * 1000) | humanize }}
        </template>
        <template v-else>
          -
        </template>
      </div>
    </section>
    <!-- <section>
      <label><strong>Preset</strong></label>

      <FigmaSelect :options="presets" v-model="currentPreset" property="name">
      </FigmaSelect>
      <div>
        <input
          class="input__field"
          placeholder="Name"
          v-show="!currentPreset"
        />
      </div>
      <div>
        <button class="button button--secondary" :disabled="currentPreset">
          save
        </button>
      </div>
    </section> -->
    <template v-if="!advanced">
      <section>
        <h4>Optimization</h4>

        <div class="label">Minimum Path Length</div>
        <input
          type="number"
          class="input__field"
          v-model.number="options.minimumPathLength"
          placeholder=""
          step="0.1"
          min="0"
        />
        <div class="label">Point Join Radius</div>
        <input
          type="number"
          class="input__field"
          v-model.number="options.pointJoinRadius"
          placeholder=""
          step="0.1"
          min="0"
        />
        <div class="label">Path Join Radius</div>
        <input
          type="number"
          class="input__field"
          v-model.number="options.pathJoinRadius"
          placeholder=""
          step="0.1"
          min="0"
        />
      </section>
      <section>
        <h4>Paper Size</h4>
        <div class="label">Preset</div>
        <FigmaSelect
          :options="paperPresets"
          v-model="currentPaperPreset"
          property="name"
        >
        </FigmaSelect>
        <div class="label">Width</div>
        <div suffix="mm">
          <input
            type="number"
            class="input__field"
            v-model.number="options.paperSize.size.x"
            placeholder=""
            min="0"
          />
        </div>
        <div class="label">Height</div>
        <div suffix="mm">
          <input
            type="number"
            class="input__field"
            v-model.number="options.paperSize.size.y"
            placeholder=""
            min="0"
          />
        </div>
        <div class="label">Margins</div>
        <div suffix="mm">
          <input
            type="number"
            class="input__field"
            v-model.number="options.marginMm"
            placeholder=""
            min="0"
          />
        </div>
        <div class="checkbox">
          <input
            id="fitToPage"
            v-model="options.fitPage"
            type="checkbox"
            class="checkbox__box"
          />
          <label for="fitToPage" class="checkbox__label">Fit to page</label>
        </div>
        <div class="checkbox">
          <input
            id="sortPaths"
            v-model="options.sortPaths"
            type="checkbox"
            class="checkbox__box"
          />
          <label for="sortPaths" class="checkbox__label">Sort Paths</label>
        </div>
        <div class="checkbox">
          <input
            id="cropToMargins"
            v-model="options.cropToMargins"
            type="checkbox"
            class="checkbox__box"
          />
          <label for="cropToMargins" class="checkbox__label"
            >Crop to Margins</label
          >
        </div>
      </section>
      <section>
        <h4>Pen</h4>
        <button class="button button--tertiary pen" @click="movePen(true)">
          Up
        </button>

        <button class="button button--tertiary pen" @click="movePen(false)">
          Down
        </button>
        <div class="label">Pen up height</div>

        <div suffix="%">
          <input
            type="number"
            class="input__field"
            v-model.number="options.penUpHeight"
            placeholder=""
            min="0"
            max="100"
          />
        </div>
        <div class="label">Pen down height</div>
        <div suffix="%">
          <input
            type="number"
            class="input__field"
            v-model.number="options.penDownHeight"
            placeholder=""
            min="0"
            max="100"
          />
        </div>
      </section>
      <a href="#" @click.prevent="advanced = true">
        <h5>
          Advanced settings
        </h5>
      </a>
    </template>
    <template v-else>
      <h4>Pen</h4>
      <h5>Down</h5>
      <section>
        <div class="label">Duration</div>
        <div suffix="s">
          <input
            type="number"
            class="input__field"
            v-model.number="options.penDropDuration"
            placeholder=""
            step="0.1"
            min="0"
          />
        </div>
        <div class="label">Acceleration</div>
        <div suffix="mm/s²">
          <input
            type="number"
            class="input__field"
            v-model.number="options.penDownAcceleration"
            placeholder=""
            min="0"
          />
        </div>
        <div class="label">Max Velocty</div>
        <div suffix="mm/s">
          <input
            type="number"
            class="input__field"
            v-model.number="options.penDownMaxVelocity"
            placeholder=""
            min="0"
          />
        </div>
        <div class="label">Cornering Factor</div>
        <div suffix="mm">
          <input
            type="number"
            class="input__field"
            v-model.number="options.penDownCorneringFactor"
            placeholder=""
            step="0.01"
            min="0"
          />
        </div>
      </section>
      <h5>Up</h5>
      <section>
        <div class="label">Duration</div>
        <div suffix="s">
          <input
            type="number"
            class="input__field"
            v-model.number="options.penLiftDuration"
            placeholder=""
            step="0.1"
            min="0"
          />
        </div>
        <div class="label">Acceleration</div>
        <div suffix="mm/s²">
          <input
            type="number"
            class="input__field"
            v-model.number="options.penUpAcceleration"
            placeholder=""
            min="0"
          />
        </div>
        <div class="label">Max Velocty</div>
        <div suffix="mm/s">
          <input
            type="number"
            class="input__field"
            v-model.number="options.penUpMaxVelocity"
            placeholder=""
            min="0"
          />
        </div>
      </section>
      <details>
        <pre>
        {{ options }}
      </pre
        >
      </details>
    </template>
    <section>
      <a v-if="advanced" href="#" @click.prevent="advanced = false">
        <button class="button button--secondary">back</button>
      </a>
      <nuxt-link v-else to="prepare">
        <button class="button button--secondary">back</button>
      </nuxt-link>
      <a href="#" class="feedback" @click.prevent="feedback">Feedback/bugs</a>
    </section>
  </div>
</template>

<script>
import { defaultPlanOptions, Device } from "~/node_modules/saxi/src/planning";
import { PaperSize } from "~/node_modules/saxi/src/paper-size";
import { selectMenu, disclosure } from "figma-plugin-ds";
import FigmaSelect from "~/components/select";
import debounce from "debounce";

export default {
  inject: ["state", "saxi"],
  data() {
    return {
      advanced: false,
      options: this.state.options
        ? this.state.options
        : { ...defaultPlanOptions },
      presets: [
        {
          name: "Default",
          options: { ...defaultPlanOptions },
        },
        {
          name: "Default 2",
          options: { ...defaultPlanOptions, penUpHeight: 10 },
        },
      ],
      paperPresets: Object.entries(PaperSize.standard).map(([name, obj]) => ({
        name,
        ...obj,
      })),
    };
  },
  computed: {
    currentPreset: {
      get() {
        for (let preset of this.presets) {
          if (JSON.stringify(this.options) != JSON.stringify(preset.options))
            continue;
          return preset.name;
        }
      },
      set(name) {
        let currentPreset = null;
        for (let preset of this.presets) {
          if (preset.name != name) continue;
          currentPreset = preset;
        }
        Object.assign(this.options, currentPreset.options);
      },
    },
    currentPaperPreset: {
      get() {
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
      set(name) {
        let currentPreset = null;
        for (let preset of this.paperPresets) {
          if (preset.name != name) continue;
          currentPreset = preset;
        }
        Object.assign(
          this.options.paperSize,
          JSON.parse(JSON.stringify(currentPreset))
        );
      },
    },
  },
  methods: {
    feedback() {
      window.open("https://github.com/Stefterv/axifigma-driver/issues?q=");
    },
    movePen(state) {
      const rate = 1000;
      const height = Device.Axidraw.penPctToPos(
        state ? this.options.penUpHeight : this.options.penDownHeight
      );
      this.saxi.send({ c: "setPenHeight", p: { height, rate } });
    },
  },
  watch: {
    options: {
      deep: true,
      handler: debounce(function(options) {
        console.log("Updating options");
        this.$cookies.set("settings", btoa(JSON.stringify(options)));
        if (this.state.options) {
          Object.assign(this.state.options, options);
        } else {
          this.state.options = options;
        }
      }, 500),
    },
  },
  components: {
    FigmaSelect,
  },
};
function getKey(key, obj) {
  return key.split(".").reduce(function(a, b) {
    return a && a[b];
  }, obj);
}
</script>

<style lang="scss" scoped>
.settings {
  margin: var(--margin);
}
section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  column-gap: var(--margin);
}
.estimation {
  text-align: center;
}
[suffix] {
  position: relative;
  &:after {
    content: attr(suffix);
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    margin-right: 2em;
  }
}
h4 {
  grid-column: 1 / span 2;
}
.feedback {
  opacity: 0.2;
  text-decoration: underline;
}
.button.pen {
  justify-content: center;
}
</style>

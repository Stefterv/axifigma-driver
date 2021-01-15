<template>
  <div class="settings">
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
    <section>
      <h4>Paper Size</h4>
      <div class="label">Preset</div>
      <FigmaSelect
        :options="paperPresets"
        v-model="currentPaperPreset"
        property="name"
      >
      </FigmaSelect>
      <div class="label">Orientation</div>
      <div class="orientations">
        <div
          class="orientation"
          @click="setPortrait(true)"
          :isPortrait="
            (isPortrait = options.paperSize.size.x < options.paperSize.size.y)
          "
          :isCanvasPortrait="
            (isCanvasPortrait =
              parseInt(state.svg.attributes.width.value) <
              parseInt(state.svg.attributes.height.value))
          "
          :class="{
            active: isPortrait,
            canvas: isCanvasPortrait,
          }"
          :title="
            (title =
              isPortrait == isCanvasPortrait
                ? ''
                : '⚠️ The paper orientation does not correspond to orientation of the selected frame')
          "
        >
          <svg
            class="svg"
            width="8"
            height="14"
            viewBox="0 0 8 14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 1H1v12h6V1zM1 0H0v14h8V0H1z"
              fill-rule="evenodd"
              fill-opacity="1"
              fill="#000"
              stroke="none"
            ></path>
          </svg>
        </div>
        <div
          class="orientation"
          @click="setPortrait(false)"
          :class="{ active: !isPortrait, canvas: !isCanvasPortrait }"
          :title="title"
        >
          <svg
            class="svg"
            width="14"
            height="8"
            viewBox="0 0 14 8"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1v6h12V1H1zM0 7v1h14V0H0v7z"
              fill-rule="evenodd"
              fill-opacity="1"
              fill="#000"
              stroke="none"
            ></path>
          </svg>
        </div>
      </div>
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
        <label
          for="fitToPage"
          class="checkbox__label"
          title="Fit the artboart content to the selected paper size"
          >Fit Content</label
        >
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
        <label for="cropToMargins" class="checkbox__label">
          Crop to Margins
        </label>
      </div>
      <div>
        <div
          class="icon icon--warning"
          v-if="!options.cropToMargins"
          :title="
            `Turning off crop to margins might cause the axidraw to draw outside it\'s range.\nTip: turn on crop to margins but set the margin to 0`
          "
        ></div>
      </div>
    </section>

    <section>
      <a href="#" class="feedback" @click.prevent="feedback">Feedback/bugs</a>
    </section>
  </div>
</template>

<script>
import { selectMenu, disclosure } from "figma-plugin-ds";
import FigmaSelect from "~/components/select";
import { port } from "~/plugins/saxi/config";

export default {
  inject: ["state", "saxi", "options", "presets", "paperPresets"],
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
    setPortrait(portrait) {
      let size = this.options.paperSize.size;
      let min = Math.min(size.x, size.y);
      let max = Math.max(size.x, size.y);
      size.x = portrait ? min : max;
      size.y = !portrait ? min : max;

      this.options.paperSize = { size };
    },
    feedback() {
      window.open("https://github.com/Stefterv/axifigma-driver/issues?q=");
    },
  },

  watch: {
    "state.svg"(svg) {},
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
  margin-top: 0;
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
.orientations {
  display: flex;
  &:hover {
    .orientation {
      border-color: #eee;
    }
  }
  .orientation {
    border: 1px solid transparent;
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    // &.canvas {
    //   border-color: red;
    // }
    &.active {
      background: #eee;
      border-color: #eee;
    }
    &.canvas:not(.active) {
      outline: 1px solid red;
    }
  }
}
</style>

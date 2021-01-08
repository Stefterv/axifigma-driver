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
            'Turning off crop to margins might cause the axidraw to draw outside it\'s range.\nTip: turn on crop to margins but set the margin to 0'
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
    feedback() {
      window.open("https://github.com/Stefterv/axifigma-driver/issues?q=");
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
</style>

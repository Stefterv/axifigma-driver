<template>
  <div class="settings">
    <section>
      <label><Strong> Preset </Strong></label>

      <FigmaSelect :options="presets" v-model="currentPreset" property="name">
      </FigmaSelect>
    </section>
    <section>
      <div class="label">Label</div>
      <input
        type="number"
        class="input__field"
        v-model.number="options.penUpHeight"
        placeholder="Placeholder"
      />
    </section>
    <details>
      <pre>
        {{ options }}
      </pre>
    </details>
    <nuxt-link to="prepare">
      <button class="button button--secondary">back</button>
    </nuxt-link>
  </div>
</template>

<script>
import {
  PlanOptions,
  defaultPlanOptions,
} from "~/node_modules/saxi/src/planning";
import { selectMenu, disclosure } from "figma-plugin-ds";
import { cloneDeep } from "lodash";
import FigmaSelect from "~/components/select";
export default {
  data() {
    return {
      options: cloneDeep(defaultPlanOptions),
      presets: [
        {
          name: "Default",
          options: cloneDeep(defaultPlanOptions),
        },
        {
          name: "Default 2",
          options: cloneDeep({ ...defaultPlanOptions, penUpHeight: 10 }),
        },
      ],
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
  },

  components: {
    FigmaSelect,
  },
};
</script>

<style lang="scss" scoped>
.settings {
  margin: var(--margin);
}
section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
</style>

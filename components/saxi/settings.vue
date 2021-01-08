<template>
  <Provide :options="options" :presets="presets" :paperPresets="paperPresets">
    <slot />
  </Provide>
</template>

<script>
import debounce from "debounce";
import { defaultPlanOptions } from "~/node_modules/saxi/src/planning";
import { PaperSize } from "~/node_modules/saxi/src/paper-size";

export default {
  inject: ["state"],
  data() {
    let options = this.$cookies.get("settings");
    try {
      if (process.client && options) options = JSON.parse(atob(options));
    } catch (err) {}
    return {
      advanced: false,
      options: options || {
        ...defaultPlanOptions,
        fitPage: false,
        paperSize: PaperSize.standard.A6.landscape,
      },
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
        ...obj.landscape,
      })),
    };
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
};
</script>

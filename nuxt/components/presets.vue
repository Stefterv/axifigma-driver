<template>
  <div>
    <slot v-bind="presets" />
  </div>
</template>

<script>
export default {
  props: {
    slot: {
      type: String,
      default: "Test",
    },
  },
  data() {
    return {
      presets: [
        {
          name: "Default",
          options: { ...defaultPlanOptions },
          lastUpdate: 0,
          hidden: false,
        },
      ],
    };
  },
  methods: {
    save() {},
    delete() {},
  },
  watch: {
    presets() {
      // if presets get updated, save in figma document
    },
  },
  mounted() {
    // request document presets from figma, combine them with cookie presets
  },
};
</script>

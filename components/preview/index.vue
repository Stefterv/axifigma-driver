<template>
  <div class="preview">
    <h4>Preview</h4>
    <svg v-if="state.possiblePlan" :viewBox="preview.viewBox">
      <line
        v-for="motion in preview.motions"
        :key="motion.id"
        :class="{ drawn: state.motionIdx > motion.id, penDown: motion.penDown }"
        :x1="motion.p1.x"
        :x2="motion.p2.x"
        :y1="motion.p1.y"
        :y2="motion.p2.y"
      ></line>
    </svg>
  </div>
</template>

<script>
export default {
  inject: ["state"],
  computed: {
    preview() {
      let plan = this.state.possiblePlan;
      if (!plan) return {};
      let penDown = false;
      let motions = plan.motions
        .map((motion, index) => {
          return {
            ...motion,
            index,
          };
        })
        .filter((motion) => {
          if (!motion.initialPos) {
            motion.penDown = penDown;
            return true;
          }
          penDown = !penDown;
        })
        .flatMap((motion) =>
          motion.blocks.map((block) => ({
            ...block,
            penDown: motion.penDown,
            id: motion.index,
          }))
        );

      function filt(type, prop, def) {
        return (min, motion) =>
          type(min || def, motion.p1[prop], motion.p2[prop]);
      }
      let xMin = motions.reduce(filt(Math.min, "x", Number.MAX_VALUE));
      let xMax = motions.reduce(filt(Math.max, "x", Number.MIN_VALUE));
      let yMin = motions.reduce(filt(Math.min, "y", Number.MAX_VALUE));
      let yMax = motions.reduce(filt(Math.max, "y", Number.MIN_VALUE));
      debugger;
      return {
        motions,
        viewBox: `${xMin} ${yMin} ${xMax} ${yMax}`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.preview {
  padding: var(--margin);
}
svg {
  overflow: visible;
}
line {
  stroke-dasharray: 10vw;
  stroke-width: 1vw;
  stroke: #c4c4c4;

  &.penDown {
    stroke-dasharray: 0;
    stroke: black;
  }
  &.drawn {
    stroke: red;
  }
}
</style>

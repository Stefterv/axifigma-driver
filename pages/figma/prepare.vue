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
export default {
  inject: ["state"],
  methods: {
    plot() {
      this.$axios.post("/saxi/plot", this.state.possiblePlan.serialize());
      this.state.plan = this.state.possiblePlan;
    },
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

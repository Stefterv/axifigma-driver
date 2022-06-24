<template>
  <div class="settings">
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
      <h4>Debug</h4>
      <div
        class="figma-svg"
        title="Svg exported from Figma"
        v-html="svgHtml"
      ></div>
      <details>
        <summary>
          <label for="">Options</label>
        </summary>
        <pre>{{ options }}</pre>
      </details>
      <details>
        <summary>
          <label for="">State</label>
        </summary>
        <pre>{{ state }}</pre>
      </details>
    </section>
  </div>
</template>

<script>
import Settings from "./settings";
export default {
  extends: Settings,
  computed: {
    svgHtml() {
      let svg = this.state.svg;
      let html = svg.outerHTML;
      return html;
    },
  },
};
</script>

<style lang="scss" scoped>
.settings {
  margin: var(--margin);
  margin-top: 0;
}
.figma-svg {
  width: 100%;
  &::v-deep svg {
    max-width: 100%;
    max-height: 100vw;
    * {
      stroke: black;
      stroke-width: 5;
      fill: none;
    }
  }
}
</style>

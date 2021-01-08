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
  </div>
</template>

<script>
import Settings from "./settings";
export default {
  extends: Settings,
};
</script>

<style></style>

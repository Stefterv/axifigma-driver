<template>
  <div class="settings">
    <h4>Pen</h4>
    <section>
      <div class="label">Drawing Velocity</div>
      <div suffix="mm/s">
        <input
          type="number"
          class="input__field"
          v-model.number="options.penDownMaxVelocity"
          placeholder=""
          min="0"
        />
      </div>
      <div class="label">Drawing Acceleration</div>
      <div suffix="mm/s²">
        <input
          type="number"
          class="input__field"
          v-model.number="options.penDownAcceleration"
          placeholder=""
          :disabled="constant"
          min="0"
        />
      </div>
      <div class="label" :title="(title = 'Use a constant drawing speed')">
        Disable Acceleration
      </div>
      <div :title="title">
        <input type="checkbox" disabled="true" v-model="constant" />
      </div>
      <div
        class="label"
        :title="(title = 'The movement speed whilst the pen is up')"
      >
        Movement Velocity
      </div>
      <div suffix="mm/s" :title="title">
        <input
          type="number"
          class="input__field"
          v-model.number="options.penUpMaxVelocity"
          placeholder=""
          min="0"
        />
      </div>

      <div class="label">Lowering Duration</div>
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
      <div class="label">Raising Duration</div>
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

      <div class="label">Moving Acceleration</div>
      <div suffix="mm/s²">
        <input
          type="number"
          class="input__field"
          v-model.number="options.penUpAcceleration"
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
  </div>
</template>

<script>
import Settings from "./settings";
export default {
  extends: Settings,
  data() {
    return {
      constant: false,
    };
  },
};
</script>

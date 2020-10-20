<template>
  <div class="settings">
    <h4>Pen</h4>
    <h5>Down</h5>
    <section>
      <div class="label">Duration</div>
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
      <div class="label">Acceleration</div>
      <div suffix="mm/s²">
        <input
          type="number"
          class="input__field"
          v-model.number="options.penDownAcceleration"
          placeholder=""
          min="0"
        />
      </div>
      <div class="label">Max Velocty</div>
      <div suffix="mm/s">
        <input
          type="number"
          class="input__field"
          v-model.number="options.penDownMaxVelocity"
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
    <h5>Up</h5>
    <section>
      <div class="label">Duration</div>
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
      <div class="label">Acceleration</div>
      <div suffix="mm/s²">
        <input
          type="number"
          class="input__field"
          v-model.number="options.penUpAcceleration"
          placeholder=""
          min="0"
        />
      </div>
      <div class="label">Max Velocty</div>
      <div suffix="mm/s">
        <input
          type="number"
          class="input__field"
          v-model.number="options.penUpMaxVelocity"
          placeholder=""
          min="0"
        />
      </div>
    </section>
    <details>
      <pre>{{ options }}</pre>
    </details>
  </div>
</template>

<script>
import Settings from "./settings";
export default {
  extends: Settings,
};
</script>

<template>
  <div>
    <select v-model="device">
      <option value="" disabled></option>
      <option
        v-for="device in state.devices"
        :key="device.unique"
        :value="device"
      >
        <template v-if="device.origin">{{ device.origin }}:</template>
        {{ device.name }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Inject, Watch } from "nuxt-property-decorator";
import { AxiClientState } from "./client.vue";
@Component
export default class DeviceSelect extends Vue {
  @Inject("axistate") state!: AxiClientState;

  get device() {
    return this.state.device;
  }
  set device(device) {
    this.state.device = device;
  }
  @Watch("state.devices")
  deviceUpdate(devices) {
    let selected = devices.find(
      (device) => device.unique === this.state.device?.unique
    );
    if (selected) return;
    this.state.device = devices[0];
  }
}
</script>
